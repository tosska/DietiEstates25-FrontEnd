import { Component, inject, Input } from '@angular/core';
import { Offer } from '../../../_services/offer-backend/offer';
import { OfferBackendService } from '../../../_services/offer-backend/offer-backend.service';
import { Listing } from '../../../_services/listing-backend/listing';
import { ListingBackendService } from '../../../_services/listing-backend/listing-backend.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OfferModalComponent } from '../../../listing-page/offer-modal/offer-modal.component';
import { ListingSummaryCardComponent } from '../../../listing-summary-card/listing-summary-card.component';
import { CustomerBackendService } from '../../../_services/customer-backend/customer-backend.service';

@Component({
  selector: 'app-offers-by-listing',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, OfferModalComponent, ListingSummaryCardComponent],
  templateUrl: './offers-by-listing.component.html',
  styleUrl: './offers-by-listing.component.scss'
})
export class OffersByListingComponent {

  offerService = inject(OfferBackendService);
  listingService = inject(ListingBackendService);
  customerService = inject(CustomerBackendService);
  isAcceptModalOpen: boolean = false;
  isRejectModalOpen: boolean = false;
  isCounterModalOpen: boolean = false;

  offers: Offer[] = [];

  listingSelected: Listing | null = null;
  offerToRespond: Offer | null = null;

  // Variabili per la Controfferta
  counterofferAmount: number | null = null;
  counterMessage: string = '';

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {

    this.loadOfferData();
    this.loadListingData();
  }


  loadOfferData(): void {

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


  }

  loadListingData(): void {
    const listingId = Number(this.route.snapshot.paramMap.get('id'));

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
        this.closeModal();
        this.loadOfferData(); // Ricarica i dati dopo l'aggiornamento
      },
      error: (error) => {
        console.error('Error response:', error);
      }});
  }

  openModal(type: 'accept' | 'reject' | 'counter', offer: Offer) {
    this.offerToRespond = offer;

    switch (type) {
      case 'accept':
        this.isAcceptModalOpen = true;
        break;
      case 'reject':
        this.isRejectModalOpen = true;
        break;
      case 'counter':
        this.isCounterModalOpen = true;
        break;
    }
  }


  closeModal() {
    this.loadOfferData();
    this.isAcceptModalOpen = false;
    this.isRejectModalOpen = false;
    this.isCounterModalOpen = false;
    this.offerToRespond = null;
  }






}
