import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ListingBackendService } from '../_services/listing-backend/listing-backend.service';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common'; // Importa CommonModule o le singole pipe
import { Listing } from '../_services/listing-backend/listing';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { GeoMapComponent } from '../geo-map/geo-map.component';
import { OfferModalComponent } from './offer-modal/offer-modal.component';
import { AuthService } from '../_services/auth/auth.service';
import { UtilsService } from '../_services/utils/utils.service';
import { AgencyBackendService } from '../_services/agency-backend/agency-backend.service';
import { Agent } from '../_services/agency-backend/agent';

@Component({
  selector: 'app-listing-page',
  standalone: true,
  imports: [GeoMapComponent, OfferModalComponent, RouterLink, CommonModule],
  templateUrl: './listing-page.component.html',
  styleUrl: './listing-page.component.scss'
})
export class ListingPageComponent {

  id: number | null = null;
  currentListing: Listing | null  = null; //aggiungere il tipo Listing in listing-backend.service.ts quando disponibile
  
  authService = inject(AuthService);  
  listingService = inject(ListingBackendService);
  utilsService = inject(UtilsService);
  agencyService = inject(AgencyBackendService);

  selectedPhoto: string | undefined;
  isOfferModalVisible: boolean=false;
  isWithOutAuthModalVisible: boolean=false;
  creatorAgentName: string | null = null;
  agencyName: string | null = null;

  removeModalVisible: boolean=false;

  constructor(private route: ActivatedRoute, private sanitizer: DomSanitizer) {}

  ngOnInit() {
    console.log("ruolo", this.authService.getRole());
    this.id = Number(this.route.snapshot.paramMap.get('id')); 
    this.listingService.getListingById(this.id).subscribe({
      next: (listing) => {
        console.log("Listing received:", listing);
        this.currentListing = listing as Listing;
        if (this.currentListing && this.currentListing.Photos && this.currentListing.Photos.length > 0) {
          this.selectedPhoto = this.currentListing.Photos[0].url;
        }
        this.getAgentName();
        this.getAgencyName();
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

  isCreatorAgent(): boolean {
    const userId = this.authService.userId();
    const role = this.authService.role();

    return role === 'agent' && this.currentListing?.agentId === userId;
  }

  getAgentName(): void {

    this.agencyService.getAgentById(this.currentListing?.agentId || 0).subscribe({
      next: (agent) => {
        let agentemp = agent as Agent;
        this.creatorAgentName = agentemp.name + ' ' + agentemp.surname;
      }
    }); 
  }

  getAgencyName(): void {
    if (this.currentListing) {

      this.agencyService.getAgencyNameById(this.currentListing?.agencyId).subscribe({
        next: (agency) => {
          console.log("Agency name received:", agency);
        this.agencyName = agency as string;
      }
    });
   }  
}

  


}
