import { Injectable } from '@angular/core';
  import { HttpClient, HttpHeaders } from '@angular/common/http';
  import { AuthRequest } from './auth-request.type';
  import { SignupRequest } from './signup-request.type';
  import { Observable } from 'rxjs';
  import { map, catchError } from 'rxjs/operators';
  import { throwError } from 'rxjs';

  @Injectable({
    providedIn: 'root'
  })
  export class RestBackendService {
    url = "http://localhost:3001";

    constructor(private http: HttpClient) {}

    httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    login(loginRequest: AuthRequest): Observable<string> {
      const url = `${this.url}/login`; 
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
      const url = `${this.url}/register/customer`; 
      console.log('Invio signup con:', signupRequest);
      return this.http.post(url, signupRequest, this.httpOptions).pipe(
        catchError((error) => {
          console.error('Errore signup:', error);
          return throwError(() => new Error(error.message || 'Errore nella richiesta di signup'));
        })
      );
    }
  }