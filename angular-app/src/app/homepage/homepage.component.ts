import { Component, inject } from '@angular/core';
import { SearchBarComponent } from './search-bar/search-bar.component';
import { filter } from 'rxjs';
import { FilterModalComponent } from './filter-modal/filter-modal.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Listing } from '../_services/listing-backend/listing';
import { ListingBackendService } from '../_services/listing-backend/listing-backend.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [SearchBarComponent, CommonModule, ReactiveFormsModule],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.scss'
})
export class HomepageComponent {


  latestListings: Listing[] = [];
  listingService = inject(ListingBackendService);
  private router = inject(Router);

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
    console.log("sesso")
    this.router.navigate(['/listing', id]);
  }

}
