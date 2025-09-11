import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SearchBackendService } from '../../_services/search-backend/search-backend.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SearchRequest } from '../../_services/search-backend/search-request';
import { Router } from '@angular/router';
import { LocationRequest } from '../../_services/geo-service/location-request';


@Component({
  selector: 'app-filter-modal',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './filter-modal.component.html',
  styleUrl: './filter-modal.component.scss'
})
export class FilterModalComponent {
  searchService = inject(SearchBackendService);
  private router = inject(Router);
  @Input() selectedLocation: LocationRequest | null = null;
  @Output() closeFilters = new EventEmitter<void>();

  searchForm = new FormGroup({
    listing_type: new FormControl(null),
    number_rooms: new FormControl(1, [Validators.min(1)]),
    min_area: new FormControl(null, [Validators.min(1)]),
    max_area: new FormControl(null, [Validators.min(1)]),
    min_price: new FormControl(null, [Validators.min(0)]),
    max_price: new FormControl(null, [Validators.min(0)]),
    construction_year_after: new FormControl(1900, [Validators.min(1900)]),
    construction_year_before: new FormControl(new Date().getFullYear(), [Validators.min(1900)]),
    energyClass: new FormControl(null)
  });
 


  handleSearch() {
    console.log('Form values:', this.searchForm.value);
    if (this.searchForm.valid) {
      let filters = this.searchForm.value;

    
      if(this.selectedLocation) {
        const { formatted, ...pureAddress } = this.selectedLocation;

        filters = { ...filters, ...pureAddress };
      
      }

      this.router.navigate(['/listings-page'], {
        queryParams: filters
      });
    }
  }  

  close() {
    // Logica per chiudere il modal
    this.closeFilters.emit();
  }

}
