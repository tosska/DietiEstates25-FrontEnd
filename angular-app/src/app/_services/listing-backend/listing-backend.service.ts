import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Listing } from './listing';

@Injectable({
  providedIn: 'root'
})
export class ListingBackendService {
  url = 'http://localhost:8000/listing-service'; 
  publicUrl = 'http://localhost:8000/listing-public'; 
  constructor(private http: HttpClient) { }

  getListingById(id: number) {
    return this.http.get(`${this.publicUrl}/listing/${id}`);
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

  getListingsForAgent() {
    return this.http.get<Listing[]>(`${this.url}/agent/listings`);
  }

  getActiveListingsForAgent() {
    return this.http.get<Listing[]>(`${this.url}/agent/listings/active`);
  }

  getClosedListingsForAgent() {
    return this.http.get<Listing[]>(`${this.url}/agent/listings/closed`);
  }

  getLatestListings(limit: number = 4) {
    return this.http.get<Listing[]>(`${this.publicUrl}/listings/latest?limit=${limit}`);
  }

  getListingsByIds(listingIds: number[]) {
    return this.http.post<Listing[]>(`${this.url}/listings/by-ids`, { listingIds: listingIds });
  }

  getListingsOfferedByCustomer() {
    return this.http.get<Listing[]>(`${this.url}/customers/me/listings/offered`);
  }


  public craftListingImageUrl(relativePath: string): string{

    relativePath = relativePath.replace('\\', '/');
    return `${this.publicUrl}/${relativePath}`;

  }

}
