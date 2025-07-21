import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SearchBackendService } from '../../_services/search-backend/search-backend.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SearchRequest } from '../../_services/search-backend/search-request';
import { Router } from '@angular/router';


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
  searchForm = new FormGroup({
    listing_type: new FormControl(''),
    number_rooms: new FormControl(1, [Validators.min(1)]),
    min_area: new FormControl(1, [Validators.min(1)]),
    max_area: new FormControl(0, [Validators.min(1)]),
    min_price: new FormControl(0, [Validators.min(0)]),
    max_price: new FormControl(0, [Validators.min(0)]),
    construction_year_after: new FormControl(1900, [Validators.min(1900)]),
    construction_year_before: new FormControl(new Date().getFullYear(), [Validators.min(1900)]),
    energyClass: new FormControl(null),
    city: new FormControl(null),
    state: new FormControl(null),
  });
 


  handleSearch() {
    console.log('Form values:', this.searchForm.value);
    if (this.searchForm.valid) {
      console.log('Form is valid, proceeding with search...');
      const filters = this.searchForm.value;

      this.router.navigate(['/listings-page'], {
        queryParams: filters
      });
    }
  }  

  close() {
    // Logica per chiudere il modal
  }

}
