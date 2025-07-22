import { Component, EventEmitter, Output } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-geo-map',
  standalone: true,
  imports: [],
  templateUrl: './geo-map.component.html',
  styleUrl: './geo-map.component.scss'
})
export class GeoMapComponent {
  private map!: L.Map;
   

  ngOnInit() {

    this.map = L.map('modal-map').setView([45.4642, 9.1900], 13); // Milano

    L.tileLayer(`https://maps.geoapify.com/v1/tile/dark-matter/{z}/{x}/{y}.png?apiKey=8b73f3e3576c4ff489b1f97f34475ed9`, {
      attribution:
        '© <a href="https://www.geoapify.com/">Geoapify</a>, © OpenMapTiles © OpenStreetMap contributors',
      maxZoom: 20
    }).addTo(this.map);
  }




  

  
}
