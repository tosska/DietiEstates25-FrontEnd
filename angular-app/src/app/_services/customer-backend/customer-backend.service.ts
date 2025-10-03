import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CustomerBackendService {

  url: string = 'http://localhost:8000/customer-service'; 
  constructor(private http: HttpClient) { }



  
  
}
