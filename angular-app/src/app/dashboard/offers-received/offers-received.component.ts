
/* ============================================= */
/* property-offers-list.component.ts */
/* ============================================= */

import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Listing } from '../../_services/listing-backend/listing';
import { Offer } from '../../_services/offer-backend/offer';
import { ListingBackendService } from '../../_services/listing-backend/listing-backend.service';
import { OfferBackendService } from '../../_services/offer-backend/offer-backend.service';
import { map, switchMap } from 'rxjs/operators';

interface ListingIdWithCount {
  listing_id: number;
  count: number;
}


@Component({
  selector: 'app-offers-received',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './offers-received.component.html',
  styleUrl: './offers-received.component.scss'
})
export class OffersReceivedComponent {

  private router = inject(Router);
  listingService = inject(ListingBackendService);
  offerService = inject(OfferBackendService);

  listingWithOfferCount: {listing: Listing, offersCount: number}[] = [];
  listingIdsWithCount: ListingIdWithCount[] = [];
  listingPures: Listing[] = [];
  isLoading = false;

  
  ngOnInit(): void {
    this.fetchOffersCountAndListings();
  }
  
  private fetchOffersCountAndListings(): void {
    this.isLoading = true;

    this.offerService.getCountOfPendingOffersGroupListing().subscribe({
      next: (offerCounts) => {
        this.listingIdsWithCount = offerCounts as ListingIdWithCount[];
        console.log('Listing IDs with offer counts:', this.listingIdsWithCount);
        const listingIds = this.listingIdsWithCount.map(item => item.listing_id); 
        console.log('Extracted listing IDs:', listingIds);
        this.fetchListingsByIds(listingIds);
        this.isLoading = false;
      },
      error: (error) => { 
        console.error('Errore nel recupero del conteggio delle offerte:', error);
      }
    });
  }

  private fetchListingsByIds(listingIds: number[]): void {
    this.listingService.getListingsByIds(listingIds).subscribe({
      next: (listings) => { 
        this.listingPures = listings as Listing[];
        console.log('Listings fetched by IDs:', this.listingPures);
      },
      error: (error) => { 
        console.error('Errore nel recupero degli annunci:', error);
      }
    });

  }

  openOffersPage(listingId: number): void {
    this.router.navigate(['/dashboard-agent/offers-received/listing', listingId]);
  }


}


