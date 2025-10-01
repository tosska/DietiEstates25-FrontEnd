import { Component, inject, Input } from '@angular/core';
import { Offer } from '../../../_services/offer-backend/offer';
import { OfferBackendService } from '../../../_services/offer-backend/offer-backend.service';
import { Listing } from '../../../_services/listing-backend/listing';
import { ListingBackendService } from '../../../_services/listing-backend/listing-backend.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-offers-by-listing',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './offers-by-listing.component.html',
  styleUrl: './offers-by-listing.component.scss'
})
export class OffersByListingComponent {

  offerService = inject(OfferBackendService);
  listingService = inject(ListingBackendService);
  offers: Offer[] = [];

  listingSelected: Listing | null = null;
  
  constructor(private route: ActivatedRoute) {}

  ngOnInit() {

    const listingId = Number(this.route.snapshot.paramMap.get('id')); 

    this.offerService.getAllPendingOffersByListingId(listingId).subscribe(({
      next: (offers) => {
        console.log('Offers fetched for listing:', offers);
        this.offers = offers as Offer[];
      },
      error: (error) => {
        console.error('Error fetching offers for listing:', error);
      }
    }));


    this.listingService.getListingById(listingId).subscribe(({
      next: (listing) => {
        console.log('Listing fetched:', listing);
        this.listingSelected = listing as Listing;
      }, 
      error: (error) => {
        console.error('Error fetching listing:', error);
      } 
    }));



  }

  responseOffer(offerId: number, response: string): void {
    console.log(`Response to offer with ID: ${offerId}`);
    this.offerService.responseToOffer(offerId, response).subscribe({
      next: (updatedOffer) => {
        console.log('Offer updated successfully:', updatedOffer);
      },
      error: (error) => {
        console.error('Error response:', error);
      }});
  }


  goBack(): void {
    window.history.back();
  }






}
