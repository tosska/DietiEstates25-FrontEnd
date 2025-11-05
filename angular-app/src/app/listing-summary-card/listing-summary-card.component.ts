import { Component, inject, Input } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Listing } from '../_services/listing-backend/listing';
import { ListingBackendService } from '../_services/listing-backend/listing-backend.service';

@Component({
  selector: 'app-listing-summary-card',
  standalone: true,
  imports: [CommonModule, CurrencyPipe], // Importa i moduli necessari
  templateUrl: './listing-summary-card.component.html',
  styleUrls: ['./listing-summary-card.component.scss']
})
export class ListingSummaryCardComponent {
  
  // Il componente riceve l'oggetto Listing completo
  @Input() listingId: number | null = null;
  listingService = inject(ListingBackendService);
  listing: Listing | null = null;

  constructor() { }


  ngOnInit(): void {

    if (this.listingId) {
      this.listingService.getListingById(this.listingId).subscribe({
        next: (listing) => {
          this.listing = listing as Listing;
        },
        error: (error) => {
          console.error('Errore nel recupero dell\'annuncio:', error);
        }
      });
    }
  }

  /**
   * Restituisce l'URL della prima foto dell'annuncio.
   * Se non ci sono foto, restituisce un placeholder.
   */
  getMainPhotoUrl(listing: Listing | null): string {
    // Gestisce il caso in cui listing è null o Photos è undefined/vuoto
    if (!listing || !listing.Photos || listing.Photos.length === 0) {
      // Puoi personalizzare il placeholder
      return `https://placehold.co/600x400/e2e8f0/64748b?text=Foto+non+disponibile`;
    }

    // ASSUNZIONE: L'oggetto Photo ha una proprietà 'url'
    // Modifica 'listing.Photos[0].url' se la tua proprietà si chiama diversamente
    return this.listingService.craftListingImageUrl(listing.Photos[0].url); 
  }
}
