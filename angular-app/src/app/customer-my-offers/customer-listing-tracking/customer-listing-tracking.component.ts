import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { Offer } from '../../_services/offer-backend/offer';
import { OfferBackendService } from '../../_services/offer-backend/offer-backend.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { OfferModalComponent } from '../../listing-page/offer-modal/offer-modal.component';

@Component({
  selector: 'app-customer-listing-tracking',
  standalone: true,
  imports: [CommonModule, OfferModalComponent],
  templateUrl: './customer-listing-tracking.component.html',
  styleUrl: './customer-listing-tracking.component.scss'
})
export class CustomerListingTrackingComponent {

  offersHistory: Offer[] = [];
  offerService = inject(OfferBackendService);

  listingId: number | null = null;
  isLoading: boolean = false;
  error: string | null = null;
  latestOffer: Offer | null = null;
  showOfferModal: boolean = false;

  canRespond: boolean = false;
  canCreateNewOffer: boolean = false;

  @ViewChild('chatContainer') private chatContainer!: ElementRef;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {

    this.listingId = Number(this.route.snapshot.paramMap.get('id')); 
    this.loadOffersHistory(this.listingId!);
  }

  loadOffersHistory(id: number): void {
    this.offerService.getOfferHistoryForListingByCustomer(id).subscribe({
      next: (offers) => {
        this.offersHistory = offers;
        console.log('Offer history loaded:', this.offersHistory);
        this.latestOffer = this.offersHistory[this.offersHistory.length - 1];

        this.setScrollToBottom();
        this.checkCanRespond();
        this.checkCanCreateNewOffer();
      },
      error: (error) => {
        console.error('Errore nel caricamento della cronologia delle offerte:', error);
      }
    });
  }

setScrollToBottom(): void {
  setTimeout(() => {
    if (this.chatContainer?.nativeElement) {
      this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
      console.log("Scrolled to bottom");
    }
  }, 0);
}


  checkCanRespond() {

    if (this.offersHistory.length != 0 && this.latestOffer) {
      this.canRespond = this.latestOffer.status === 'Pending' && this.latestOffer.counteroffer;
    }
  }

  checkCanCreateNewOffer(){
    if (this.offersHistory.length != 0 && this.latestOffer) {
  
      if(this.latestOffer.status === 'Rejected'){this.canCreateNewOffer = true;}
      
    }
  }



  openOfferModal(): void {
    this.showOfferModal = true;
  }

  acceptOffer(): void {

    this.offerService.responseToOffer(this.latestOffer!.id, 'Accepted').subscribe({
      next: (response) => {
        console.log('Offer accepted:', response);
        this.loadOffersHistory(this.latestOffer!.listing_id);
      },
      error: (error) => {
        console.error('Error accepting offer:', error);
      }
    });
  }

  rejectOffer(): void {
    this.offerService.responseToOffer(this.latestOffer!.id, 'Rejected').subscribe({
      next: (response) => {
        console.log('Offer rejected:', response);
        this.loadOffersHistory(this.latestOffer!.listing_id);
      },
      error: (error) => {
        console.error('Error rejecting offer:', error);
      }
    });
  }
}
