import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AgencyBackendService {

  url: string = 'http://localhost:8000/agency-service'; 
  publicUrl = 'http://localhost:8000/agency-public'; 

  constructor(private http: HttpClient) { }

  // Helper per ottenere l'header con il token (necessario per le chiamate protette)
  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };
  }

  // --- AGENT ---
  getAgentById(id: number) {
    return this.http.get(`${this.url}/agent/${id}`, this.getAuthHeaders());
  }

  updateAgent(id: number, data: any) {
    return this.http.put(`${this.url}/agent/${id}`, data, this.getAuthHeaders());
  }

  // --- ADMIN / MANAGER ---
  getAdminById(id: number) {
    return this.http.get(`${this.url}/admin/${id}`, this.getAuthHeaders());
  }

  updateAdmin(id: number, data: any) {
    return this.http.put(`${this.url}/admin/${id}`, data, this.getAuthHeaders());
  }

  // --- AGENCY ---
  getAgencyById(id: number) {
    return this.http.get(`${this.url}/agency/${id}`);
  }

  getAgencyNameById(id: number) {
    return this.http.get(`${this.url}/agency/${id}/name`);
  }

  getMyAgency() {
    return this.http.get(`${this.url}/my-agency`, this.getAuthHeaders());
  }

  public getAgentImageUrl(id: number, nameFile: string): string{
    return `${this.publicUrl}/images/agents/${id}/${nameFile}`;
  }
}