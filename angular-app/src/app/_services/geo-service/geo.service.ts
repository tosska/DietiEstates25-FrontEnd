import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { map, filter, count, first } from 'rxjs/operators';
import { LocationRequest } from './location-request';
import { Address } from '../listing-backend/address';


@Injectable({
  providedIn: 'root'
})
export class GeoService {
  url: string = "https://api.geoapify.com/v1";
  apiKey: string = '8b73f3e3576c4ff489b1f97f34475ed9';

  constructor(private http: HttpClient) { }

  reverseGeocode(lat: number, lon: number) {
    const uri = `${this.url}/geocode/reverse?lat=${lat}&lon=${lon}&lang=it&apiKey=${this.apiKey}`;
    return this.http.get(uri).pipe(
      map((response: any) => {return this.filterResponse(response.features[0], true); }))

  }

  // se geometry è false significa che non voglio le coordinate
  fetchSuggestions(query: string, type: string, isGeometry: boolean = true, placeId?: string) {
    let params = new HttpParams()
      .set('text', query)
      .set('lang', 'it')
      .set('type', type)
      .set('filter', 'countrycode:it')
      .set('limit', '5')
      .set('apiKey', this.apiKey);

    if (placeId) {
      params = params.set('filter', "place:" + placeId);
    }

    return this.http.get(`${this.url}/geocode/autocomplete`, { params }).pipe(
      map((response: any) => {
        return response.features.map((feature: any) => {
          return this.filterResponse(feature, isGeometry);
        });
      })
    );
  }

  verifyAddress(location: LocationRequest) {
    const params = new HttpParams()
      .set('housenumber', location.housenumber || '')
      .set('street', location.street || '')
      .set('postcode', location.postalCode || '')
      .set('city', location.city || '')
      .set('state', location.state || '')
      .set('country', location.country || '')
      .set('apiKey', this.apiKey);

    return this.http.get(`${this.url}/geocode/search`, { params }).pipe(
      map((response: any) => {
        if (!response.features || response.features.length === 0) {
          return null;
        }

        const firstResult = response.features[0];
        const confidence = firstResult.properties.rank?.confidence || 0;

        if (confidence < 0.8) {
          return null;
        } else {
          return this.filterResponse(firstResult, true);
        }
      })
    );
  }

  convertLocationToAddress(location: LocationRequest): Address {

    let address: Address = {

      street: location.street || '',
      houseNumber: location.housenumber || '',
      city: location.city || '',
      state: location.state || '',
      country: location.country || '',
      unitDetail: location.unitDetail || '',
      postalCode: location.postalCode || '',
      longitude: location.longitude || null,
      latitude: location.latitude || null
    }

    return address;
  }


  private filterResponse(elementResponse: any, isGeometry: boolean) : LocationRequest {


    const properties =elementResponse.properties;
    let geometryData = elementResponse.geometry;

    // Se geometry è false, non includere le coordinate
    if (!isGeometry) {geometryData.coordinates=[];}
      
    return {
      formatted: properties.formatted,
      street: properties.street,
      city: properties.city,
      postalCode: properties.postcode,
      state: properties.county,
      country: properties.country,
      unitDetail: properties.unit_detail,
      longitude: geometryData?.coordinates[0],
      latitude: geometryData?.coordinates[1],
      idPlace: properties.place_id
    };

  }
  
}
