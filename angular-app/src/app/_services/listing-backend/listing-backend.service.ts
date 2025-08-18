import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ListingBackendService {
  url = 'http://localhost:3003'; 
  constructor(private http: HttpClient) { }

  getListingById(id: number) {
    return this.http.get(`${this.url}/listing/${id}`);
  }

  
}
