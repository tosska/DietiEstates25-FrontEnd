import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SearchBackendService } from '../_services/search-backend/search-backend.service';
import { SearchRequest } from '../_services/search-backend/search-request';

@Component({
  selector: 'app-listings-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './listings-page.component.html',
  styleUrl: './listings-page.component.scss'
})
export class ListingsPageComponent {
  private activeRoute = inject(ActivatedRoute);
  private router = inject(Router);
  private searchService = inject(SearchBackendService);
  public listings: any[] = [];


  ngOnInit() {
    this.activeRoute.queryParams.subscribe(params => {
      const filters = params as SearchRequest
      console.log("Received filters:", filters);
      this.searchService.search(filters).subscribe({
        next: (listings) => {
          console.log("Listings:", listings);
          // Handle the listings data as needed
          this.listings = Array.isArray(listings) ? listings : [];
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

  
}
