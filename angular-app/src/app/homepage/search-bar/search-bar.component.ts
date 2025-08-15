import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FilterModalComponent } from '../filter-modal/filter-modal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { GeoMapComponent } from '../../geo-map/geo-map.component';
import { GeocoderAutocomplete } from '@geoapify/geocoder-autocomplete';
import { GeoService } from '../../_services/geo-service/geo.service';
import { GeoModalComponent } from "../geo-modal/geo-modal.component";
import { Address } from '../../_services/geo-service/address';
import { SearchBackendService } from '../../_services/search-backend/search-backend.service';
import { routes } from '../../app.routes';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [FilterModalComponent, FormsModule, CommonModule, ReactiveFormsModule, GeoModalComponent],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.scss'
})
export class SearchBarComponent {

  private router = inject(Router);
  isFilterModalOpen = false;
  isGeoModalOpen = false;
  dropdownVisibleMap = false;
  geoService = inject(GeoService);
  searchService = inject(SearchBackendService);

  suggestedAddresses: Address[] = [];
  dropdownVisibleSuggestions = false;


  selectedLocation: Address | null = null;
  searchQuery: string | null  = '';

  constructor() { }


  onFocus(event: any) {
    if (event.target.value === '' || event.target.value === null) {
      console.log('Sono focusato');
      this.dropdownVisibleMap = true;
      this.dropdownVisibleSuggestions = false;
    } else {
      this.dropdownVisibleMap = false;
    }
    console.log('Focus event:', event);
  }

  onInput(event: any) {

    if(!event.target.value || event.target.value.trim() === '') {
      console.log('Input vuoto, chiudo il dropdown dei suggerimenti');
      this.dropdownVisibleSuggestions = false;
      this.dropdownVisibleMap = true;
      return;
    }

    this.dropdownVisibleMap = false;

    this.geoService.fetchSuggestions(event.target.value, false).subscribe( {       
      next: (suggestionsResponse) => {
        this.suggestedAddresses = suggestionsResponse as Address[];  
        console.log('Suggerimenti ricevuti:', this.suggestedAddresses);
      },
      error: (error) => {console.error('Errore durante il recupero dei suggerimenti:', error)},
      complete: () => {
        this.dropdownVisibleSuggestions = true;
      }
    });
  }

  onSelectLocation(address: Address) {
    this.selectedLocation = address;
    this.searchQuery = address.formatted;
    this.dropdownVisibleSuggestions = false;
    console.log('Indirizzo selezionato:', this.selectedLocation);
  }

  handleSearch() {
    if (this.selectedLocation) {
      const { formatted, ...pureAddress } = this.selectedLocation;
      this.router.navigate(['/listings-page'], {
        queryParams: pureAddress
      });
    } else {
      console.warn('Nessun indirizzo selezionato per la ricerca.');
    }
  }

  openFilters() {
    console.log('Apro il modal');
    this.isFilterModalOpen = true;
  }

  closeFilters() {
    this.isFilterModalOpen = false;
  }

  handleApplyFilters(filters: any) {
    console.log('Filtri ricevuti dal modal:', filters);
    this.closeFilters();

  }

  hideDropdownWithDelay() {
    setTimeout(() => {
      this.dropdownVisibleMap = false;
    }, 200); // evita che il blur chiuda prima del click sul bottone
  }

  onMapSearchClick() {
    console.log('Apertura mappa interattiva...');
    this.dropdownVisibleMap = false;
    this.isGeoModalOpen = true;
  }

  closeMap() {
    this.isGeoModalOpen = false;
  }

 

}
