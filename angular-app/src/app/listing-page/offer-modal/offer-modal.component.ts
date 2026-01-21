import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { OfferBackendService } from '../../_services/offer-backend/offer-backend.service';
import { OfferRequest } from '../../_services/offer-backend/offer-request';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../_services/auth/auth.service';
import { UtilsService } from '../../_services/utils/utils.service';

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
  utilsService = inject(UtilsService);

  @Input() listingId: number | null = null;
  @Input() offerId: number | null = null;
  @Input() userTarget: number | null = null;
  @Input() initialAmount: number | null;
  @Input() isCounterOffer=false;
  @Input() modalMessage: string = "Fai un'offerta per questo annuncio";

  @Output() close = new EventEmitter<void>();
  @Output() submitted = new EventEmitter<void>();

  offerForm = new FormGroup({
    amount: new FormControl<number | null>(null, [Validators.required, Validators.min(1)]),
    message: new FormControl<string | null>(null, [Validators.required])})

  formattedOffer: string = '';
  

  constructor(){
    this.initialAmount=null
  }


  ngOnInit(){
    
    if(this.initialAmount){
      this.offerForm.get('amount')?.setValue(this.initialAmount);
      this.formattedOffer = this.utilsService.formatNumber(this.initialAmount?.toString());
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
    this.formattedOffer = this.utilsService.formatNumber(numericValue);
  }


  closeModal(): void {
    this.close.emit();
  }

  onSubmitForm(){
    if(this.offerForm.valid){
      console.log("Form valido, procedo con l'invio");
      let dataForm = this.offerForm.value;
      if(this.listingId) {
        const offerData: OfferRequest = {
          amount: dataForm.amount ?? 0, // or handle as needed if 0 is not valid
          message: dataForm.message ?? '',
          listing_id: this.listingId
        };


        if(!this.isCounterOffer) {
          this.createOffer(offerData);
        } else {
          this.createCounteroffer(offerData);
        }
      }


      

      
      

    }
  }

  private createOffer(offerData: OfferRequest): void {

    let customerId = this.authService.userId();

    if (this.userTarget !== null && customerId !== null) {

      offerData.customer_id = customerId;
      offerData.agent_id = this.userTarget;

      this.offerService.createOffer(offerData).subscribe({
        next: (offerId) => {
          this.toastr.success(`Offerta effettuata con successo!`, 'Successo!');
          this.closeModal();
        },
        error: (error) => {
          this.toastr.error("Si è verificato un errore");
          this.closeModal();
        }
      });
    }
  }

  private createCounteroffer(offerData: OfferRequest): void {

    let agentId = this.authService.userId();

    if (this.userTarget !== null && agentId !== null && this.offerId !== null) {

      console.log("sto in controfferta")

      offerData.agent_id = agentId;
      offerData.customer_id = this.userTarget;
      
      this.offerService.createCounterOffer(this.offerId, offerData).subscribe({
        next: (offerId) => {
          this.submitted.emit();
          this.toastr.success(`Offerta effettuata con successo!`, 'Successo!');
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
