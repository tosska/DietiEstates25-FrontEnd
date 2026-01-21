import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Listing } from '../_services/listing-backend/listing'; // Assicurati che il percorso sia corretto
import { ListingResult } from '../_services/search-backend/listing-result';
import { ListingBackendService } from '../_services/listing-backend/listing-backend.service';

@Component({
  selector: 'app-listing-card',
  standalone: true,
  imports: [CommonModule, CurrencyPipe],
  templateUrl: './listing-card.component.html',
  styleUrls: ['./listing-card.component.scss']
})
export class ListingCardComponent {


  @Input() listing!: Listing;
  @Input() buttonText: string = 'Dettagli';
  @Input() IsWithoutButton: boolean = false;
  @Input() extraMessage: string = "";


  @Output() cardClick = new EventEmitter<void>();

  listingService = inject(ListingBackendService)
  extraData: string = "";

  constructor() { }


  getMainPhotoUrl(): string {
    if (this.listing?.Photos && this.listing.Photos.length > 0 && this.listing.Photos[0].url) {
      return this.listingService.craftListingImageUrl(this.listing.Photos[0].url);
    }
    // Placeholder se non ci sono foto
    return `https://placehold.co/600x400/e2e8f0/64748b?text=Foto+non+disponibile`;
  }


  getCategories(cat: string){

    if(this.listing.Category) {

      let categories: string[] = this.listing.Category;

    
      if(cat == "park") return "Parchi"
      if(cat == "school") return "Scuole"
      if(cat == "public_trasport") return "Trasporti pubblici"
    

    }

    return null;
  }

  /**
   * Gestisce il click sulla card ed emette l'evento.
   */
  onActionClick(event: any): void {
    this.cardClick.emit();
  }


  onCardClick(): void {
    this.cardClick.emit();
  }
}