import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SearchBackendService } from '../_services/search-backend/search-backend.service';
import { SearchRequest } from '../_services/search-backend/search-request';
import { GeoMapComponent } from '../geo-map/geo-map.component';
import { ListingCardComponent } from '../listing-card/listing-card.component';
import { Listing } from '../_services/listing-backend/listing';
import { ListingResult } from '../_services/search-backend/listing-result';
import { UtilsService } from '../_services/utils/utils.service';
import { GeoPoint } from '../_services/geo-service/GeoPoint';

@Component({
  selector: 'app-listings-page',
  standalone: true,
  imports: [CommonModule, GeoMapComponent, ListingCardComponent],
  templateUrl: './listings-page.component.html',
  styleUrl: './listings-page.component.scss'
})
export class ListingsPageComponent {
  private activeRoute = inject(ActivatedRoute);
  private router = inject(Router);
  private searchService = inject(SearchBackendService);
  private utilsService = inject(UtilsService);
  public listings: Listing[] = []; //mettere il tipo listing
  public listingFocused: any = null; //mettere il tipo listing
  public listingGeoPoints: GeoPoint[] = [];

  ngOnInit() {
    this.activeRoute.queryParams.subscribe(params => {
      const filters = params as SearchRequest
      console.log("FILTRI SELEZIONATI", filters);
      console.log("Received filters:", filters);
      this.searchService.search(filters).subscribe({
        next: (listings) => {
          console.log("Listings:", listings);
          // Handle the listings data as needed
          let result = (Array.isArray(listings) ? listings : []) as ListingResult[];
          this.listings = result.map(item => this.utilsService.convertListingResultToListing(item));
          this.listingGeoPoints = this.listings.map(listing => this.utilsService.convertListingToGeoPoint(listing));
      
        },
        error: (error) => {
          console.error('Error during search:', error);
        }
      });
    });

  }

  openListing(id: number) {
    this.router.navigate(['/listing', id]);
  }

  highlightListing(listing: any) {
    this.listingFocused = listing;
  }
  
  clearHighlight() {
    this.listingFocused = null;
  }
  
}
