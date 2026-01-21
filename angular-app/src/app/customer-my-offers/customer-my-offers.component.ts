import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common'; // AGGIUNTO
import { RouterLink, Router } from '@angular/router'; // AGGIUNTO RouterLink
import { ListingCardComponent } from '../listing-card/listing-card.component';
import { ListingBackendService } from '../_services/listing-backend/listing-backend.service';
import { OfferBackendService } from '../_services/offer-backend/offer-backend.service';

@Component({
  selector: 'app-customer-my-offers',
  standalone: true,
  imports: [CommonModule, RouterLink, ListingCardComponent], // Aggiunto CommonModule e RouterLink
  templateUrl: './customer-my-offers.component.html',
  styleUrl: './customer-my-offers.component.scss'
})
export class CustomerMyOffersComponent {

  listingService = inject(ListingBackendService);
  offerService = inject(OfferBackendService);
  private router = inject(Router);

  // Variabile per gestire il filtro corrente
  activeFilter: 'active' | 'closed' = 'active'; 

  // Usiamo questa lista per visualizzare i dati nel template
  listingsToShow: any[] = []; 

  constructor() { }
  
  ngOnInit(): void {
    // All'avvio carica le offerte attive (default)
    this.setFilter('active');
  }

  // Nuova funzione per gestire il cambio filtro
  setFilter(filter: 'active' | 'closed'): void {
    this.activeFilter = filter;
    this.fetchListings();
  }

  // Funzione che decide quale chiamata fare in base al filtro
  fetchListings(): void {
    // Resetta la lista mentre carica (opzionale, per evitare flickering di vecchi dati)
    this.listingsToShow = []; 

    if (this.activeFilter === 'active') {
      this.loadActiveListings();
    } else {
      this.loadClosedListings();
    }
  }

  loadActiveListings(): void {
    this.listingService.getActiveListingsOfferedByCustomer().subscribe({
      next: (listings) => {
        this.listingsToShow = listings;
        this.loadReadStatus();
      },
      error: (error) => {
        console.error('Errore nel caricamento degli annunci attivi:', error);
      }
    });
  }

  loadClosedListings(): void {
    // Assicurati che questo metodo esista nel tuo ListingBackendService
    this.listingService.getClosedListingsOfferedByCustomer().subscribe({
      next: (listings) => {
        this.listingsToShow = listings;
        // Carichiamo lo stato di lettura anche per le chiuse (se serve)
        this.loadReadStatus();
      },
      error: (error) => {
        console.error('Errore nel caricamento degli annunci chiusi:', error);
      }
    });
  }

  openTracking(id: number): void {
      this.router.navigate(['/customer-my-offers/listing', id]);
  }

  loadReadStatus(): void {
    // 1. Estrazione corretta degli ID dalla lista VISUALIZZATA
    const listingIds: number[] = this.listingsToShow.map(listing => listing.id);
    console.log("ANNUNCI: ", listingIds)

    if (listingIds.length === 0) return;

    // 2. Chiamata al servizio
    this.offerService.getLatestOfferReadStatus(listingIds).subscribe({
      next: (results) => {
        console.log("RISULTATI:", results)
        results.forEach(status => {
          // Trova il listing corrispondente nella lista visualizzata
          const listing = this.listingsToShow.find(l => l.id === status.listing_id);

          if (listing) {
            console.log("LETTO: ", status.isRead);
            listing.isRead = status.isRead; 
            listing.lastOfferId = status.id; // Nota: nel log precedente era status.id o status.offerId, verifica il backend
          }
        });
      },
      error: (err) => {
        console.error("Errore nel recupero dello stato delle offerte", err);
      }
    });
  }
}