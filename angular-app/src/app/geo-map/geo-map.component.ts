import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import * as L from 'leaflet';
import { LocationRequest } from '../_services/geo-service/location-request';
import { GeoService } from '../_services/geo-service/geo.service';

@Component({
  selector: 'app-geo-map',
  standalone: true,
  imports: [],
  templateUrl: './geo-map.component.html',
  styleUrl: './geo-map.component.scss'
})
export class GeoMapComponent {

  @Input() width: string = '100%';
  @Input() height: string = '400px';
  @Input() circleRadiusKm: number = 1;
  @Input() isResearch: boolean = true;
  @Input() elementsToMark: any[] = [];
  @Input() focusOn: any = null;


  private map!: L.Map;



  selectedLocation : LocationRequest | null = null;
  @Output() selectedLocationEvent = new EventEmitter<LocationRequest>();
  geoService = inject(GeoService);
  private currentMarker: L.Marker | null = null;
  private currentCircleZone: L.Circle | null = null;


  ngOnInit() {

    this.map = L.map('modal-map').setView([45.4642, 9.1900], 13); // Milano

    L.tileLayer(`https://maps.geoapify.com/v1/tile/osm-bright/{z}/{x}/{y}.png?apiKey=8b73f3e3576c4ff489b1f97f34475ed9`, {
      attribution:
        '© <a href="https://www.geoapify.com/">Geoapify</a>, © OpenMapTiles © OpenStreetMap contributors',
      maxZoom: 20
    }).addTo(this.map);


    // Aggiungi l'evento di clic sulla mappa
    this.map.on('click', (e: L.LeafletMouseEvent) => {

      if(this.isResearch) {
        this.setSearchRadius(e);
      }
    });
  }

  ngOnChanges(){

    this.setMarkFromElements();
    
    const location = this.selectedLocation;

    if(location) {
      this.removeCircleZone();
      this.createCircleZone(location.latitude!, location.longitude!, this.circleRadiusKm);
    }


  }

  setMarkFromElements() {
    
    if(this.elementsToMark && this.elementsToMark.length>0) {
      this.elementsToMark.forEach( (elem) => {
        if(elem.latitude && elem.longitude) {
          this.createMarker(elem.latitude, elem.longitude, elem);
        }})
    
    }
  }


  setSearchRadius(event: L.LeafletMouseEvent) {
    const lat = event.latlng.lat;
    const lng = event.latlng.lng;
        
    this.removeCircleZone();
    this.createCircleZone(lat, lng, this.circleRadiusKm);

    this.geoService.reverseGeocode(lat, lng).subscribe({
      next: (address: LocationRequest) => {
        this.selectedLocation = address;

        this.selectedLocationEvent.emit(this.selectedLocation);
        console.log('Selected address:', this.selectedLocation);
      }
    })
    console.log(`Clicked at latitude: ${lat}, longitude: ${lng}`);
    // Here you can emit the coordinates or handle them as needed
  }


  private createMarker(lat: number, lng: number, elem?: any): void {
    this.currentMarker = L.marker([lat, lng], {
      icon: L.icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
        shadowSize: [41, 41]
      })
    });

    if (elem) {
      const popupContent = `
        <div style="width:150px">
          <img src="${elem.imageUrl}" alt="immobile" style="width:100%; border-radius:8px; margin-bottom:5px"/>
          <strong>${elem.title ?? 'Immobile'}</strong><br>
          <span>${elem.price ? elem.price + ' €' : ''}</span>
        </div>`;

        this.currentMarker.bindPopup(popupContent);
    }
    this.currentMarker.addTo(this.map);
  }


  private removeCurrentMarker(): void {
    if (this.currentMarker) {
      this.map.removeLayer(this.currentMarker);
      this.currentMarker = null;
    }
  }

  private createCircleZone(lat: number, lng: number, radiusKm: number) : void{
    this.createMarker(lat, lng);

    const radiusMeters = radiusKm*1000;

    this.currentCircleZone= L.circle([lat, lng], {
      color: 'green',
      fillColor: '#c1fcc1ff',
      fillOpacity: 0.5,
      radius: radiusMeters
    }).addTo(this.map);
  }

  private removeCircleZone(): void {
    this.removeCurrentMarker();

    if(this.currentCircleZone){
      this.map.removeLayer(this.currentCircleZone);
      this.currentCircleZone=null;
    }
  }


  

  
}
