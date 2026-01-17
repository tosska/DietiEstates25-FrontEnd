import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SearchRequest } from './search-request';

@Injectable({
  providedIn: 'root'
})
export class SearchBackendService {
  url = 'http://localhost:8000/search-service'; 
  constructor(private http: HttpClient) { }

  search(searchRequest: SearchRequest) {
    
    return this.http.post(`${this.url}/listings/search`, searchRequest);
  }
}
