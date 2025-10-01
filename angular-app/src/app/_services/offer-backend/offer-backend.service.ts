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

  getCountOfPendingOffersGroupListing() {
    return this.http.get(`${this.url}/offers/pending/count-by-listing`);

  }

  getAllPendingOffersByListingId(listingId: number) {
    return this.http.get(`${this.url}/offers/pending/listing/${listingId}`);
  }

  responseToOffer(offerId: number, response: string) {
    return this.http.put(`${this.url}/offer/${offerId}/response`, { response });
  }
}
