import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ListingBackendService } from '../_services/listing-backend/listing-backend.service';
import { Listing } from '../_services/listing-backend/listing';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { GeoMapComponent } from '../geo-map/geo-map.component';
import { OfferModalComponent } from './offer-modal/offer-modal.component';

@Component({
  selector: 'app-listing-page',
  standalone: true,
  imports: [GeoMapComponent, OfferModalComponent],
  templateUrl: './listing-page.component.html',
  styleUrl: './listing-page.component.scss'
})
export class ListingPageComponent {

  id: number | null = null;
  currentListing: Listing | null  = null; //aggiungere il tipo Listing in listing-backend.service.ts quando disponibile
  listingService = inject(ListingBackendService);

  selectedPhoto: string | undefined;

  isOfferModalVisible: boolean=false;

  constructor(private route: ActivatedRoute, private sanitizer: DomSanitizer) {}

  ngOnInit() {
    this.id = Number(this.route.snapshot.paramMap.get('id')); 
    this.listingService.getListingById(this.id).subscribe({
      next: (listing) => {
        console.log("Listing received:", listing);
        this.currentListing = listing as Listing;
        this.bypassSecurityTrust();

      }
    })
  }

  bypassSecurityTrust() {
    if(this.currentListing?.Photos) {

      this.currentListing.Photos.map(p => ({
          ...p,
          url: this.sanitizer.bypassSecurityTrustResourceUrl(p.url),
      }));
    }


  }

    // Questo metodo viene chiamato al click sulla miniatura
  selectPhoto(photoUrl: string): void {
    this.selectedPhoto = photoUrl;
  }

  openOfferModal(){
    this.isOfferModalVisible = true;
  }

  closeOfferModal(): void {
    this.isOfferModalVisible = false;
  }


}
