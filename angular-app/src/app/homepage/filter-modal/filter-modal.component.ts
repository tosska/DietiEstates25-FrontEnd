import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { AbstractControl, FormsModule, ValidationErrors, ValidatorFn } from '@angular/forms';
import { SearchBackendService } from '../../_services/search-backend/search-backend.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SearchRequest } from '../../_services/search-backend/search-request';
import { Router } from '@angular/router';
import { LocationRequest } from '../../_services/geo-service/location-request';
import { UtilsService } from '../../_services/utils/utils.service';


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
  @Input() selectedPropertyType: string | null = null;
  @Output() closeFilters = new EventEmitter<void>();

  availableYears: number[] = [];
  availableRooms: number[] = [];
  utilsService = inject(UtilsService);

  searchForm = new FormGroup({
    listing_type: new FormControl(null),
    number_rooms: new FormControl(null, [Validators.min(1), Validators.pattern("^[0-9]*$")]),

    min_area: new FormControl(null, [Validators.min(1)]),
    max_area: new FormControl(null, [Validators.min(1)]),

    min_price: new FormControl(null, [Validators.min(0)]),
    max_price: new FormControl(null, [Validators.min(0)]),

    construction_year_after: new FormControl(null, [Validators.min(1800), Validators.max(new Date().getFullYear())]),
    construction_year_before: new FormControl(null, [Validators.min(1800), Validators.max(new Date().getFullYear())]),

    energyClass: new FormControl(null)
  }, {
    // Validatori di Gruppo applicati all'intero form
    validators: [
      this.rangeValidator('min_price', 'max_price', 'priceRangeError'),
      this.rangeValidator('min_area', 'max_area', 'areaRangeError'),
      this.rangeValidator('construction_year_after', 'construction_year_before', 'yearRangeError')
    ]
  });


ngOnInit(): void {
    this.availableYears = this.utilsService.generateYears();
    
    for(let i=1; i<=10; i++ ) {
      this.availableRooms.push(i);
    }
  }


handleSearch() {
    if (this.searchForm.valid) {
      // 1. Clona i valori del form
      let queryParams: any = { ...this.searchForm.value };

      // 2. Aggiungi i dati della Location se presenti
      if (this.selectedLocation) {
        const { formatted, ...pureAddress } = this.selectedLocation;
        queryParams = { ...queryParams, ...pureAddress };
      }

      // 3. Aggiungi il tipo proprietà se presente (CORRETTO: usa 'propertyType')
      if (this.selectedPropertyType) {
        queryParams.propertyType = this.selectedPropertyType;
      }

      // 4. Rimuovi chiavi nulle o vuote per pulire l'URL
      Object.keys(queryParams).forEach(key => {
        if (queryParams[key] === null || queryParams[key] === '') {
          delete queryParams[key];
        }
      });

      console.log('Filtri inviati:', queryParams);

      this.router.navigate(['/listings-page'], {
        queryParams: queryParams
      });

      this.close();
    } else {
      // Evidenzia gli errori se l'utente forza l'invio
      this.searchForm.markAllAsTouched();
    }
  }

  close() {
    // Logica per chiudere il modal
    this.closeFilters.emit();
  }

  rangeValidator(minKey: string, maxKey: string, errorName: string): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const minControl = group.get(minKey);
      const maxControl = group.get(maxKey);

      if (!minControl || !maxControl) return null;

      const min = minControl.value;
      const max = maxControl.value;

      // Se entrambi i valori esistono e min > max, ritorna l'errore
      if (min !== null && max !== null && min > max) {
        return { [errorName]: true };
      }
      return null;
    };
  }

}
