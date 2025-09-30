
/* ============================================= */
/* property-offers-list.component.ts */
/* ============================================= */

import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Listing } from '../../_services/listing-backend/listing';
import { Offer } from '../../_services/offer-backend/offer';


interface FilterOption {
  key: string;
  label: string;
}

@Component({
  selector: 'app-offers-received',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './offers-received.component.html',
  styleUrl: './offers-received.component.scss'
})
export class OffersReceivedComponent {

  private router = inject(Router);

  ngOnInit(): void {
    
  }




}
