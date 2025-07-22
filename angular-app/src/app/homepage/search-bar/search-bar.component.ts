import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FilterModalComponent } from '../filter-modal/filter-modal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { GeoMapComponent } from '../../geo-map/geo-map.component';
import { GeocoderAutocomplete } from '@geoapify/geocoder-autocomplete';
import { GeoService } from '../../_services/geo-service/geo.service';
import { GeoModalComponent } from "../geo-modal/geo-modal.component";

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [FilterModalComponent, FormsModule, CommonModule, ReactiveFormsModule, GeoModalComponent],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.scss'
})
export class SearchBarComponent {

  
  isFilterModalOpen = false;
  isGeoModalOpen = false;
  dropdownVisible = false;
  geoService = inject(GeoService);

  suggestions: string[] = [];
  dropdownVisibleSuggestions = false;

  constructor() { }

  onInput(event: any) {
    this.geoService.fetchSuggestions(event.target.value).subscribe( {       
      next: (suggestions) => {
        this.suggestions = suggestions as string[];  
        this.dropdownVisibleSuggestions = true;
      }})
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
      this.dropdownVisible = false;
    }, 200); // evita che il blur chiuda prima del click sul bottone
  }

  onMapSearchClick() {
    console.log('Apertura mappa interattiva...');
    this.dropdownVisible = false;
    this.isGeoModalOpen = true;
  }

  closeMap() {
    this.isGeoModalOpen = false;
  }


}
