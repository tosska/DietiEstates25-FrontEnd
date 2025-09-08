import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ListingBackendService } from '../_services/listing-backend/listing-backend.service';
import { Listing } from '../_services/listing-backend/listing';

@Component({
  selector: 'app-listing-page',
  standalone: true,
  imports: [],
  templateUrl: './listing-page.component.html',
  styleUrl: './listing-page.component.scss'
})
export class ListingPageComponent {

  id: number | null = null;
  currentListing: Listing | null  = null; //aggiungere il tipo Listing in listing-backend.service.ts quando disponibile
  listingService = inject(ListingBackendService);

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.id = Number(this.route.snapshot.paramMap.get('id')); 
    this.listingService.getListingById(this.id).subscribe({
      next: (listing) => {
        console.log("Listing received:", listing);
        this.currentListing = listing as Listing;
      }
    })
  }


}
