import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { Offer } from '../../_services/offer-backend/offer';
import { OfferBackendService } from '../../_services/offer-backend/offer-backend.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { OfferModalComponent } from '../../listing-page/offer-modal/offer-modal.component';
import { ListingCardComponent } from '../../listing-card/listing-card.component';
import { ListingSummaryCardComponent } from '../../listing-summary-card/listing-summary-card.component';

@Component({
  selector: 'app-customer-listing-tracking',
  standalone: true,
  imports: [CommonModule, OfferModalComponent, ListingSummaryCardComponent, RouterLink],
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
  offerAccepted: boolean = false

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
        this.checkAcceptedOffer();
        this.readOffer();
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
    // Resettiamo sempre prima di calcolare
    this.canRespond = false; 

    if (this.offersHistory.length != 0 && this.latestOffer) {
      // Puoi rispondere solo se è Pending E se è una controfferta (quindi tocca a te)
      this.canRespond = this.latestOffer.status === 'Pending' && this.latestOffer.counteroffer === true;
    }
  }

  checkCanCreateNewOffer(){
    // Caso 0: Nessuna offerta nello storico -> DEVI poter fare la prima offerta
    if (this.offersHistory.length === 0) {
      this.canCreateNewOffer = true;
      return;
    }

    if (this.latestOffer) {
      // Se c'è uno storico:
      // Puoi creare una nuova offerta SOLO se l'ultima è stata Rifiutata (Rejected).
      // Se è Pending (in attesa) o Accepted (accettata), NON puoi farne una nuova.
      this.canCreateNewOffer = this.latestOffer.status === 'Rejected';
    } else {
      // Fallback di sicurezza
      this.canCreateNewOffer = false;
    }
  }

  checkAcceptedOffer(){
    this.offerAccepted = false; // Reset

    if (this.offersHistory.length != 0 && this.latestOffer) {
      if(this.latestOffer.status === 'Accepted'){
        this.offerAccepted = true;
      }
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

  handle_submitted(): void {
    if(this.canRespond){
      this.rejectOffer();
    }

    this.loadOffersHistory(this.listingId!);
  }


// Metodo chiamato al click sulla card o sul bottone
  readOffer(): void {

    // 1. Controlla se c'è un'offerta non letta e se abbiamo il suo ID

      
      this.offerService.markOfferAsRead(this!.latestOffer!.id).subscribe({
        next: (response) => {
          console.log('Offerta segnata come letta:', response);
        },
        error: (err) => {
          console.error('Errore nel segnare l\'offerta come letta:', err);
          // Consiglio: Naviga comunque alla pagina di dettaglio anche se la chiamata fallisce
          // this.router.navigate(['/listings', listing.id]);
        }
      });
    }

}
