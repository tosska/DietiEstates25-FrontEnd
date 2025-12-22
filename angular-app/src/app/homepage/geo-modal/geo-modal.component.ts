import { Component, EventEmitter, Output, OnInit, AfterViewInit } from '@angular/core';
import { LocationRequest } from '../../_services/geo-service/location-request';
import { GeoMapComponent } from '../../geo-map/geo-map.component';
import { FormsModule } from '@angular/forms';
import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';  // Importa la libreria Leaflet

@Component({
  selector: 'app-geo-modal',
  standalone: true,
  imports: [GeoMapComponent, FormsModule],
  templateUrl: './geo-modal.component.html',
  styleUrls: ['./geo-modal.component.scss'],
})
export class GeoModalComponent implements OnInit, AfterViewInit {
  @Output() close = new EventEmitter<void>();
  @Output() confirmLocationEvent = new EventEmitter<LocationRequest>();
  selectedLocationFromMap: LocationRequest | null = null;
  selectedRadius: number = 1;
  
  ngOnInit() {}

  ngAfterViewInit() {
    // Configura Leaflet solo quando la mappa viene caricata
    if (document.getElementById('map')) {
      this.configureLeafletIcons();
    }
  }

  onClose() {
    this.close.emit();
  }

  setLocation(location: LocationRequest) {
    this.selectedLocationFromMap = location;
    this.selectedLocationFromMap.radiusKm = this.selectedRadius;
  }

  onRadiusChange() {
    if (this.selectedLocationFromMap) {
      this.selectedLocationFromMap.radiusKm = this.selectedRadius;
    }
  }

  onConfirmLocation() {
    if (this.selectedLocationFromMap) {
      const location: LocationRequest = this.selectedLocationFromMap;
      this.confirmLocationEvent.emit({
        formatted: location.formatted,
        latitude: location.latitude,
        longitude: location.longitude,
        radiusKm: location.radiusKm
      });
      this.close.emit();
    }
  }

  private configureLeafletIcons() {
    // Modifica direttamente le opzioni dell'icona senza fare riferimento a _getIconUrl
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'
    });
  }
}
