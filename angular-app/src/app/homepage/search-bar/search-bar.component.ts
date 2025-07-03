import { Component } from '@angular/core';
import { FilterModalComponent } from '../filter-modal/filter-modal.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [FilterModalComponent, FormsModule, CommonModule],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.scss'
})
export class SearchBarComponent {
  isFilterModalOpen = false;

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
    // Puoi inviarli al genitore, fare fetch, ecc.
  }
}
