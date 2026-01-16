import { Component } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.scss'
})
export class NotFoundComponent {

  // 2. Iniettalo nel costruttore
  constructor(private location: Location) {}

  // 3. Crea il metodo per tornare indietro
  goBack(): void {
    this.location.back();
  }

}
