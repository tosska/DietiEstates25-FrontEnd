import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { OfferRequest } from './offer-request';
import { Offer } from './offer';

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

  createCounterOffer(originalOfferId: number, offerData: OfferRequest ) {
    return this.http.post(`${this.url}/offer/${originalOfferId}/counteroffer`, offerData);
  }

  getOfferHistoryForListingByAgent(listingId: number) {
    return this.http.get<Offer[]>(`${this.url}/agent/offers/history/listing/${listingId}`);
  }

  getOfferHistoryForListingByCustomer(listingId: number) {
    return this.http.get<Offer[]>(`${this.url}/customer/offers/history/listing/${listingId}`);
  }

  getLatestOfferReadStatus(listingIds: number[]) {
    return this.http.post<Offer[]>(`${this.url}/offers/read-status`, {listingIds: listingIds});

  }

  markOfferAsRead(offerId: number) {
    return this.http.put(`${this.url}/offers/${offerId}/read`, {});
  }

  
}