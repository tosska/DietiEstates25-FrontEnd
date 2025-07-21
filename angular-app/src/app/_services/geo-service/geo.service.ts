import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

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

  fetchSuggestions(query: string) {

    const uri = `${this.url}/geocode/autocomplete?text=${encodeURIComponent(query)}&lang=it&typefilter=city&apiKey=${this.apiKey}`;
    return this.http.get(uri);
  }


}
