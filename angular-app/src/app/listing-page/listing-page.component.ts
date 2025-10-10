import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ListingBackendService } from '../_services/listing-backend/listing-backend.service';
import { Listing } from '../_services/listing-backend/listing';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { GeoMapComponent } from '../geo-map/geo-map.component';
import { OfferModalComponent } from './offer-modal/offer-modal.component';
import { AuthService } from '../_services/auth/auth.service';
import { UtilsService } from '../_services/utils/utils.service';

@Component({
  selector: 'app-listing-page',
  standalone: true,
  imports: [GeoMapComponent, OfferModalComponent, RouterLink],
  templateUrl: './listing-page.component.html',
  styleUrl: './listing-page.component.scss'
})
export class ListingPageComponent {

  id: number | null = null;
  currentListing: Listing | null  = null; //aggiungere il tipo Listing in listing-backend.service.ts quando disponibile
  
  authService = inject(AuthService);  
  listingService = inject(ListingBackendService);
  utilsService = inject(UtilsService);

  selectedPhoto: string | undefined;
  isOfferModalVisible: boolean=false;
  isWithOutAuthModalVisible: boolean=false;

  constructor(private route: ActivatedRoute, private sanitizer: DomSanitizer) {}

  ngOnInit() {
    console.log("ruolo", this.authService.getRole());
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
    if(this.authService.isUserAuthenticated()){
      this.isOfferModalVisible = true;
    } else {
      this.isWithOutAuthModalVisible = true;
    }
  }

  closeOfferModal(): void {
    this.isOfferModalVisible = false;
  }


}
