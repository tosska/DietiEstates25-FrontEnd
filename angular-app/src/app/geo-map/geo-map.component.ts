import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import * as L from 'leaflet';
import { Address } from '../_services/geo-service/address';
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

  private map!: L.Map;


  selectedLocation : Address | null = null;
  @Output() selectedLocationEvent = new EventEmitter<Address>();

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
      this.onMapClick(e);
    });
  }

  ngOnChanges(){
    
    const location = this.selectedLocation;

    if(location) {
      this.removeCircleZone();
      this.createCircleZone(location.latitude!, location.longitude!, this.circleRadiusKm);
    }


  }

  onMapClick(event: L.LeafletMouseEvent) {
    const lat = event.latlng.lat;
    const lng = event.latlng.lng;
        
    this.removeCircleZone();
    this.createCircleZone(lat, lng, this.circleRadiusKm);

    this.geoService.reverseGeocode(lat, lng).subscribe({
      next: (address: Address) => {
        this.selectedLocation = address;

        this.selectedLocationEvent.emit(this.selectedLocation);
        console.log('Selected address:', this.selectedLocation);
      }
    })
    console.log(`Clicked at latitude: ${lat}, longitude: ${lng}`);
    // Here you can emit the coordinates or handle them as needed
  }


  private createCurrentMarker(lat: number, lng: number): void {
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

    this.currentMarker.addTo(this.map);
  }


  private removeCurrentMarker(): void {
    if (this.currentMarker) {
      this.map.removeLayer(this.currentMarker);
      this.currentMarker = null;
    }
  }

  private createCircleZone(lat: number, lng: number, radiusKm: number) : void{
    this.createCurrentMarker(lat, lng);

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
