import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ListingBackendService } from '../../_services/listing-backend/listing-backend.service';
import { SearchBackendService } from '../../_services/search-backend/search-backend.service';
import { Listing } from '../../_services/listing-backend/listing';
import { Router, RouterLink } from "@angular/router";

@Component({
  selector: 'app-active-listings',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './active-listings.component.html',
  styleUrl: './active-listings.component.scss'
})
export class ActiveListingsComponent {

  listingService = inject(ListingBackendService);
  searchService = inject(SearchBackendService);
  router = inject(Router);


  allListings: Listing[] = [];
  listingsToShow: Listing[] = [];
  numberOfListings: number = 0;
  public activeFilter: 'all' | 'active' | 'closed' = 'active'; // Inizia con 'active'
  searchTerm: string = '';


  ngOnInit() {
    this.setFilter('active');
  }

  setFilter(filter: 'all' | 'active' | 'closed'): void {
    this.activeFilter = filter;
    this.fetchListings();
  }

  fetchListings() {
    if (this.activeFilter === 'active') {
      this.fetchActiveListings();
    } else if (this.activeFilter === 'closed') {
      this.fetchClosedListings();
    } else if (this.activeFilter === 'all') {
      this.fetchAllListings();
    }

  }



  fetchAllListings() {
    this.listingService.getListingsForAgent().subscribe({
      next: (listings) => {
        console.log('All listings fetched:', listings); 
        this.listingsToShow = listings as Listing[];
        this.allListings = this.listingsToShow; 
        this.numberOfListings = this.listingsToShow.length;
      },
      error: (error) => {
        console.error('Error fetching all listings:', error);
      }
    }); 
  }


  fetchActiveListings() {
    this.listingService.getActiveListingsForAgent().subscribe({
      next: (listings) => {
        console.log('Active listings fetched:', listings);
        this.listingsToShow = listings as Listing[];
        this.allListings = this.listingsToShow; 
        this.numberOfListings = this.listingsToShow.length;
      },
      error: (error) => {
        console.error('Error fetching active listings:', error);
      }
    });
  }

  fetchClosedListings() {
    this.listingService.getClosedListingsForAgent().subscribe({
      next: (listings) => {
        console.log('Closed listings fetched:', listings);
        this.listingsToShow = listings as Listing[];
        this.allListings = this.listingsToShow; 
        this.numberOfListings = this.listingsToShow.length;
        // Gestisci i dati delle inserzioni chiuse qui
      },
      error: (error) => {
        console.error('Error fetching closed listings:', error);
      }
    });
  }

  openListing(id: number) {
    this.router.navigate(['/listing', id]);
  }

  openTracking(id: number) {
    this.router.navigate(['/dashboard-agent/listing-tracking', id]);
  }


  /**
   * Gestisce l'input di ricerca.
   */
  onSearch(event: Event): void {
    this.searchTerm = (event.target as HTMLInputElement).value.toLowerCase();
    this.applySearch();
  }

  /**
   * Filtra `listingsToShow` in base a `searchTerm` (solo frontend).
   */
  applySearch(): void {
    if (!this.searchTerm) {
      this.listingsToShow = [...this.allListings];
      return;
    }
    this.listingsToShow = this.allListings.filter(listing =>
      listing.title.toLowerCase().includes(this.searchTerm) ||
      (listing.Address.street + ' ' + listing.Address.houseNumber).toLowerCase().includes(this.searchTerm)
    );
  }


  urlPhoto(listing: Listing){

    const photos=listing.Photos;

    if(photos && photos.length>0){
      return this.listingService.craftListingImageUrl(photos[0].url);
    }

    return "https://via.placeholder.com/600x400";

  }


}
