import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthRequest } from './auth-request.type';
import { SignupRequest } from './signup-request.type';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { AgencySignupRequest } from './agency-signup-request.type';

@Injectable({
  providedIn: 'root'
})
export class RestBackendService {
  authServiceUrl = "http://localhost:3001";
  clientServiceUrl = "http://localhost:3002";

  constructor(private http: HttpClient) {}

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  login(loginRequest: AuthRequest): Observable<string> {
    const url = `${this.authServiceUrl}/login`; 
    console.log('Invio login con:', loginRequest);
    return this.http.post<any>(url, loginRequest, this.httpOptions).pipe(
      map((response: any) => {
        const token = typeof response === 'string' ? response : response.token;
        console.log('Risposta login:', token);
        if (!token) throw new Error('Token non trovato nella risposta');
        return token;
      }),
      catchError((error) => {
        console.error('Errore login:', error);
        return throwError(() => new Error(error.message || 'Errore nella richiesta di login'));
      })
    );
  }

  signup(signupRequest: SignupRequest): Observable<any> {
    const url = `${this.authServiceUrl}/register/customer`; 
    console.log('Invio signup con:', signupRequest);
    return this.http.post(url, signupRequest, this.httpOptions).pipe(
      catchError((error) => {
        console.error('Errore signup:', error);
        return throwError(() => new Error(error.message || 'Errore nella richiesta di signup'));
      })
    );
  }

  registerAgency(data: any): Observable<any> { 
    const url = `${this.authServiceUrl}/register/agency`;
    console.log('Invio dati registrazione agenzia:', data);
    return this.http.post<any>(url, data, this.httpOptions).pipe(
      map((response) => {
        console.log('Risposta registrazione agenzia:', response);
        return response;
      }),
      catchError((error) => {
        console.error('Errore registrazione agenzia:', error);
        return throwError(() => new Error(error.message || 'Errore nella registrazione'));
      })
    );
  }

  getCustomerById(userId: string): Observable<any> {
    const url = `${this.clientServiceUrl}/customers/${userId}`;
    const token = this.getToken();
    console.log('Token recuperato da localStorage:', token); // Debug
    if (!token) {
      console.error('Nessun token trovato in localStorage');
      throw new Error('Token mancante');
    }
    const authHeaders = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // Verifica il formato
      })
    };
    console.log('Header Authorization inviato:', authHeaders.headers.get('Authorization')); // Debug
    console.log('Richiesta getCustomerById per ID:', userId, 'con URL:', url);
    return this.http.get<any>(url, authHeaders).pipe(
      map((response: any) => {
        console.log('Risposta getCustomerById:', response);
        return response;
      }),
      catchError((error) => {
        console.error('Errore getCustomerById:', error);
        return throwError(() => new Error(error.message || 'Errore nel recupero dei dati del cliente'));
      })
    );
  }

  private getToken(): string | null {
    return localStorage.getItem("token");
  }
}