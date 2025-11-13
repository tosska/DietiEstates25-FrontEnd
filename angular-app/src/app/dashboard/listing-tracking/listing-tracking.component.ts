import { Component, inject } from '@angular/core';
import { AuthService } from '../../_services/auth/auth.service';
import { OfferBackendService } from '../../_services/offer-backend/offer-backend.service';
import { ActivatedRoute } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { CommonModule } from '@angular/common';
import { Offer } from '../../_services/offer-backend/offer';
import { ListingSummaryCardComponent } from '../../listing-summary-card/listing-summary-card.component';
import { AddOfferModalComponent } from './add-offer-modal/add-offer-modal.component';

@Component({
  selector: 'app-listing-tracking',
  standalone: true,
  imports: [CurrencyPipe, CommonModule, ListingSummaryCardComponent, AddOfferModalComponent],
  templateUrl: './listing-tracking.component.html',
  styleUrl: './listing-tracking.component.scss'
})
export class ListingTrackingComponent {

  listingId: number | null = null;

  authService = inject(AuthService);
  offerService = inject(OfferBackendService);
  offers: Offer[] = [];

  addOfferModalOpen: boolean = false;


  constructor(private route: ActivatedRoute) {}


  ngOnInit() {
    
    this.listingId = Number(this.route.snapshot.paramMap.get('id')); 
    if (this.listingId) {
      this.fetchOfferHistory();
    }
  }

  fetchOfferHistory() {

    this.offerService.getOfferHistoryForListingByAgent(this.listingId!).subscribe({
      next: (offers) => {
        console.log('Offer history for listing:', offers);
        this.offers = offers;

      },
      error: (error) => {
        console.error('Error fetching offer history:', error);
      }
    });

  }

  openAddOfferModal(){
    this.addOfferModalOpen = true;

  }

  goBack() {



  }


}
