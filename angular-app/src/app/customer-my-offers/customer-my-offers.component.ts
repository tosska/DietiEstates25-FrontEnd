import { Component, inject } from '@angular/core';
import { ListingCardComponent } from '../listing-card/listing-card.component';
import { ListingBackendService } from '../_services/listing-backend/listing-backend.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-customer-my-offers',
  standalone: true,
  imports: [ListingCardComponent],
  templateUrl: './customer-my-offers.component.html',
  styleUrl: './customer-my-offers.component.scss'
})
export class CustomerMyOffersComponent {

  listingService = inject(ListingBackendService);
  private router = inject(Router);

  offeredListings: any[] = [];

  constructor() { }
  
  ngOnInit(): void {
    this.loadOfferedListings();
  }


  loadOfferedListings(): void {
    this.listingService.getListingsOfferedByCustomer().subscribe({
      next: (listings) => {
        this.offeredListings = listings;
      },
      error: (error) => {
        console.error('Errore nel caricamento degli annunci offerti:', error);
      }
    });
  }

  openTracking(id: number): void {
      this.router.navigate(['/customer-my-offers/listing', id]);
  }



}
