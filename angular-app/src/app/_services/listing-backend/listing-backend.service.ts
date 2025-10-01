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

  createListing(listingData: Listing, photos: File[]) {
    const formData = new FormData();

    // Aggiungo i dati dell'annuncio come stringa (deve essere JSON)
    formData.append("listingData", JSON.stringify(listingData));

    // Aggiungo ogni file usando lo stesso nome "photos"
    photos.forEach((photo) => {
      formData.append("photos", photo); // <-- stesso nome, multer lo raggruppa
    });

    return this.http.post(`${this.url}/listing`, formData);
  }

  getActiveListingsForAgent() {
    return this.http.get<Listing[]>(`${this.url}/agent/listings/active`);
  }

  getLatestListings(limit: number = 4) {
    return this.http.get<Listing[]>(`${this.url}/listings/latest?limit=${limit}`);
  }

  getListingsByIds(listingIds: number[]) {
    return this.http.post<Listing[]>(`${this.url}/listings/by-ids`, { listingIds: listingIds });
  }


}
