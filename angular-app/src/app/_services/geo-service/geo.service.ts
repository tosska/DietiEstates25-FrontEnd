import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { map, filter } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class GeoService {
  url: string = "https://api.geoapify.com/v1";
  apiKey: string = '8b73f3e3576c4ff489b1f97f34475ed9';

  constructor(private http: HttpClient) { }

  reverseGeocode(lat: number, lon: number) {
    const uri = `${this.url}/geocode/reverse?lat=${lat}&lon=${lon}&lang=it&apiKey=${this.apiKey}`;
    return this.http.get(uri);
  }


   //se geometry è false significa che non voglio le coordinate
  fetchSuggestions(query: string, geometry: boolean = true) {
  
    const uri = `${this.url}/geocode/autocomplete?text=${encodeURIComponent(query)}&lang=it&typefilter=address&limit=5&apiKey=${this.apiKey}`;
    return this.http.get(uri).pipe( 
      map((response: any) => {
        return response.features.map((feature: any) => {
          const properties = feature.properties;
          let geometryData = feature.geometry;
          
          // Se geometry è false, non includere le coordinate
          
          if (!geometry) {geometryData.coordinates=[];}

          return {
            formatted: properties.formatted,
            street: properties.street,
            city: properties.city,
            postalCode: properties.postcode,
            state: properties.state,
            unitDetail: properties.unit_detail,
            longitude: feature.geometry?.coordinates[0],
            latitude: feature.geometry?.coordinates[1]
          };
        });
      }));
  }


}
