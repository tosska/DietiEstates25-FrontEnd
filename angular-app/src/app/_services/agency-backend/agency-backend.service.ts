import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AgencyBackendService {

  url: string = 'http://localhost:8000/agency-service'; 
  constructor(private http: HttpClient) { }

  getAgentById(id: number) {
    return this.http.get(`${this.url}/agent/${id}`);
  }


}
