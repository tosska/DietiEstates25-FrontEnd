import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { OfferBackendService } from '../../_services/offer-backend/offer-backend.service';
import { OfferRequest } from '../../_services/offer-backend/offer-request';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../_services/auth/auth.service';

@Component({
  selector: 'app-offer-modal',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './offer-modal.component.html',
  styleUrl: './offer-modal.component.scss'
})
export class OfferModalComponent {

  offerService= inject(OfferBackendService);
  authService= inject(AuthService);
  toastr = inject(ToastrService);

  @Input() listingId: number=-1;
  @Input() agentId: number=-1;
  @Input() amountFromListing: number | null;
  @Output() close = new EventEmitter<void>();

  offerForm = new FormGroup({
    amount: new FormControl<number | null>(null, [Validators.required, Validators.min(1)]),
    message: new FormControl<string | null>(null, [Validators.required])})

  formattedOffer: string = '';
  customerId: number=-1;
  

  constructor(){
    this.amountFromListing=null

    let customerId = this.authService.getUserId();
    if(customerId)
      this.customerId= customerId;
  }


  ngOnInit(){
    



    if(this.amountFromListing){
      this.offerForm.get('amount')?.setValue(this.amountFromListing);
      this.formattedOffer = this.formatNumber(this.amountFromListing?.toString());
    }

  }

   /** Valore formattato per la view */


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
  

  closeModal(): void {
    this.close.emit();
  }

  onSubmitForm(){
    if(this.offerForm.valid){

      let dataForm = this.offerForm.value;

      if (dataForm) {
        const offerData: OfferRequest = {
          amount: dataForm.amount ?? 0, // or handle as needed if 0 is not valid
          message: dataForm.message ?? '',
          counteroffer: false,
          customer_id: this.customerId,
          listing_id: this.listingId,
          agent_id: this.agentId
        };

        this.offerService.createOffer(offerData).subscribe({
          next: (offerId) => {
            this.toastr.success(`Annuncio creato con successo! con codice ${offerId}`, 'Successo!');
            this.closeModal();
          },
          error: (error) => { 
            this.toastr.error("Si è verificato un errore");
            this.closeModal();
          }
        });
      }
    }
  }

}
