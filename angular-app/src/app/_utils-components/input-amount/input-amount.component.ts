import { Component } from '@angular/core';

@Component({
  selector: 'app-input-amount',
  standalone: true,
  imports: [],
  templateUrl: './input-amount.component.html',
  styleUrl: './input-amount.component.scss'
})
export class InputAmountComponent {

  formattedOffer: string = '';

  onOfferInput(event: Event): void {
    const input = (event.target as HTMLInputElement).value;

    // Rimuovi tutto ciò che non è numero
    const numericValue = input.replace(/\D/g, '');

    // Aggiorna FormControl con valore numerico (o null se vuoto)
    this.offerForm.get('amount')?.setValue(numericValue ? +numericValue : null);

    // Aggiorna valore formattato per la UI
    this.formattedOffer = this.formatNumber(numericValue);
  }

  private formatNumber(value: string): string {
    if (!value) return '';
    // Formatta con separatore migliaia (es: "250000" -> "250.000")
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

}
