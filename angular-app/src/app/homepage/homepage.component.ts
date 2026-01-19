import { Component, inject } from '@angular/core';
import { SearchBarComponent } from './search-bar/search-bar.component';
import { filter } from 'rxjs';
import { FilterModalComponent } from './filter-modal/filter-modal.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Listing } from '../_services/listing-backend/listing';
import { ListingBackendService } from '../_services/listing-backend/listing-backend.service';
import { Router } from '@angular/router';
import { ListingCardComponent } from '../listing-card/listing-card.component';
import { GeoModalComponent } from './geo-modal/geo-modal.component';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [SearchBarComponent, CommonModule, ReactiveFormsModule, ListingCardComponent, FilterModalComponent, GeoModalComponent],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.scss'
})
export class HomepageComponent {


  latestListings: Listing[] = [];
  listingService = inject(ListingBackendService);
  private router = inject(Router);

  // Stato dei modali spostato qui per evitare il problema del CSS transform
  isFilterModalOpen = false;
  isGeoModalOpen = false;

  ngOnInit() {
    this.listingService.getLatestListings(4).subscribe({
      next: (listings) => {
        console.log('Latest listings fetched:', listings);
        this.latestListings = listings as Listing[];
      },
      error: (error) => {
        console.error('Error fetching latest listings:', error);
      }
    });

  }

  openListing(id: number) {
    this.router.navigate(['/listing', id]);
  }

  getMainPhotoForListingCard(listing: Listing) {
    if(listing.Photos) {
      return this.listingService.craftListingImageUrl(listing.Photos[0].url); 
    }
    
    return `https://placehold.co/600x400/e2e8f0/64748b?text=Foto+non+disponibile`;
  }

  


}
