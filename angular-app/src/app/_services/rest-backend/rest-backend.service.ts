import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthRequest } from './auth-request.type';
import { SignupRequest } from './signup-request.type'
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// Service for making HTTP requests to the backend REST API

@Injectable({
  providedIn: 'root'
})
export class RestBackendService {

  url = "http://localhost:3001"
  constructor(private http: HttpClient) {}

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  login(loginRequest: AuthRequest) {
    const url = `${this.url}/login`;
    return this.http.post<string>(url, loginRequest, this.httpOptions);
  }

  signup(signupRequest: SignupRequest) {
    const url = `${this.url}/register/customer`;
    console.log(signupRequest);
    return this.http.post(url, signupRequest, this.httpOptions);
  }

 
  
  
}
