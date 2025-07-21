import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
  private route = inject(ActivatedRoute);
  private searchService = inject(SearchBackendService);
  public listings: any[] = [];


  ngOnInit() {
    this.route.queryParams.subscribe(params => {
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

  
}
