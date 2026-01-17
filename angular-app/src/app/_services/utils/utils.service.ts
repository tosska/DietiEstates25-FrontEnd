import { Injectable } from '@angular/core';
import { Listing } from '../listing-backend/listing';
import { Address } from '../listing-backend/address';
import { Photo } from '../listing-backend/photo';
import { ListingResult } from '../search-backend/listing-result';
import { GeoPoint } from '../geo-service/GeoPoint';
import { PropertyType } from '../listing-backend/propertyType';

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

  public convertListingResultToListing(result: ListingResult): Listing {
    const address: Address = {
      id: result.addressId,
      street: result.street,
      houseNumber: result.houseNumber,
      city: result.city,
      postalCode: result.postalCode,
      state: result.state,
      unitDetail: result.unitDetail,
      longitude: result.longitude,
      latitude: result.latitude,
      country: result.country
    };

    const photos: Photo[] = result.mainPhoto
      ? [{ id: 0, listingId: result.id, url: result.mainPhoto, order: 1 }]
      : [];

  
    const categories: string[] = result.categories; 

    return {
      id: result.id,
      title: result.title,
      price: result.price,
      listingType: result.listing_type,
      status: result.status,
      publicationDate: result.publicationDate ? new Date(result.publicationDate) : null,
      endPublicationDate: result.endPublicationDate ? new Date(result.endPublicationDate) : null,
      description: result.description,
      area: result.area,
      numberRooms: result.numberRooms,
      propertyType: result.propertyType,
      constructionYear: result.constructionYear,
      energyClass: result.energyClass,
      agencyId: result.agencyId,
      agentId: result.agentId,
      Address: address,
      Photos: photos,
      Category: categories
    };
}

public convertListingToGeoPoint(listing: Listing): GeoPoint {

  if(listing.Address.latitude == null || listing.Address.longitude == null) {
    throw new Error("Listing Address does not have valid latitude or longitude");
  }

  return {
    latitude: listing.Address.latitude ,
    longitude: listing.Address.longitude
  };

  
}

public generateYears(){

  let years = [];

  const currentYear = new Date().getFullYear();
    for (let i = currentYear; i >= 1900; i--) {
      years.push(i);
    }

  return years;
}



}
