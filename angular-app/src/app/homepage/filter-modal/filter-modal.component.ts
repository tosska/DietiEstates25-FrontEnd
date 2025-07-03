import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-filter-modal',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './filter-modal.component.html',
  styleUrl: './filter-modal.component.scss'
})
export class FilterModalComponent {
  @Output() close = new EventEmitter<void>();
  @Output() applyFilters = new EventEmitter<any>();

  // Campi collegati ai ngModel
  listing_type?: string;
  number_rooms?: number;
  min_area?: number;
  max_area?: number;
  min_price?: number;
  max_price?: number;
  construction_year_before?: number;
  construction_year_after?: number;
  energyClass?: string;
  city?: string;
  state?: string;
  isActive?: boolean;


  onApply() {
    this.applyFilters.emit({
      listing_type: this.listing_type,
      number_rooms: this.number_rooms,
      min_area: this.min_area,
      max_area: this.max_area,
      min_price: this.min_price,
      max_price: this.max_price,
      construction_year_before: this.construction_year_before,
      construction_year_after: this.construction_year_after,
      energyClass: this.energyClass,
      city: this.city,
      state: this.state,
      isActive: this.isActive
    });
    this.close.emit(); //Emissione dell'evento chiusura 
  }

  onClose() {
    this.close.emit();
  }

}
