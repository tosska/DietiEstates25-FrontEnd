import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Listing } from './listing';

@Injectable({
  providedIn: 'root'
})
export class ListingBackendService {
  url = 'http://localhost:3003'; 
  constructor(private http: HttpClient) { }

  getListingById(id: number) {
    return this.http.get(`${this.url}/listing/${id}`);
  }

  createListing(listingData: Listing) {
    return this.http.post(`${this.url}/listing`, listingData);
  }

  
}
