import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor() { }

  public formatNumber(value: string): string {
    if (!value) return '';
    // Formatta con separatore migliaia (es: "250000" -> "250.000")
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  public craftListingImageUrl(relativePath: string): string{

    relativePath = relativePath.replace('\\', '/');
    return `http://localhost:8000/listing-public/${relativePath}`;

  }


}
