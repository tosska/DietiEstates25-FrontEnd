import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { OfferRequest } from './offer-request';

@Injectable({
  providedIn: 'root'
})
export class OfferBackendService {
  url: string = 'http://localhost:8000/offer-service'; 
  constructor(private http: HttpClient) { }

  getOfferById(id: number) {
    return this.http.get(`${this.url}/offer/${id}`);
  }

  createOffer(offerData: OfferRequest){
    return this.http.post(`${this.url}/offer`, offerData);
  }

  getCountOfActiveOffersGroupListing() {
    return this.http.get(`${this.url}/offers/count-by-listing`);

  }
}
