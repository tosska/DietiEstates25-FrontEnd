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

  listingsToShow: Listing[] = [];
  numberOfListings: number = 0;


  ngOnInit() {
    this.fetchActiveListings();
  }

  fetchActiveListings() {
    this.listingService.getActiveListingsForAgent().subscribe({
      next: (listings) => {
        console.log('Active listings fetched:', listings);
        this.listingsToShow = listings as Listing[];
        this.numberOfListings = this.listingsToShow.length;
        // Gestisci i dati delle inserzioni attive qui
      },
      error: (error) => {
        console.error('Error fetching active listings:', error);
      }
    });
  }

  openListing(id: number) {
    this.router.navigate(['/listing', id]);
  }

  urlPhoto(listing: Listing){

    const photos=listing.Photos;
    if(photos){
      return this.listingService.craftListingImageUrl(photos[0].url);
    }

    return "https://via.placeholder.com/600x400";

  }


}
