import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AgencyBackendService {

  url: string = 'http://localhost:8000/agency-service'; 
  publicUrl = 'http://localhost:8000/agency-public'; 

  constructor(private http: HttpClient) { }

  getAgentById(id: number) {
    return this.http.get(`${this.url}/agent/${id}`);
  }

  getAgencyById(id: number) {
    return this.http.get(`${this.url}/agency/${id}`);
  }

  getAgencyNameById(id: number) {
    return this.http.get(`${this.url}/agency/${id}/name`);
  }

  public getAgentImageUrl(id: number, nameFile: string): string{

    return `${this.publicUrl}/images/agents/${id}/${nameFile}`;

  }

}
