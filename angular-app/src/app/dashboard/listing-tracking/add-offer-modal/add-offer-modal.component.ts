import { Component, Input, Output, EventEmitter, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../../_services/auth/auth.service'; // Assicurati che il percorso sia corretto
import { OfferBackendService } from '../../../_services/offer-backend/offer-backend.service';
import { Offer } from '../../../_services/offer-backend/offer';

@Component({
  selector: 'app-add-offer-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-offer-modal.component.html',
  styleUrls: ['./add-offer-modal.component.scss']
})
export class AddOfferModalComponent implements OnInit {

  // Dati in ingresso dal componente genitore
  @Input() listingId!: number;
  
  // Rimosso @Input() customers: ... non è più necessario

  // Eventi per comunicare al genitore
  @Output() close = new EventEmitter<void>();
  @Output() offerSubmitted = new EventEmitter<any>(); // Emette l'oggetto offerta

  // Servizi
  private authService = inject(AuthService);
  private offerService = inject(OfferBackendService);

  // Form
  public offerForm: FormGroup;
  public errorMessage: string | null = null;

  constructor() {
    this.offerForm = new FormGroup({
      customerName: new FormControl(null, [Validators.required]),
      amount: new FormControl(null, [Validators.required, Validators.min(1)]),
      status: new FormControl('', [Validators.required]),
      offer_Date: new FormControl(this.getCurrentDateTimeLocal(), [Validators.required]),
      message: new FormControl(''),
    });
  }

  ngOnInit(): void {
  }

  /**
   * Gestisce l'invio del form.
   */
  onSubmit(): void {
    if (this.offerForm.invalid) {
      this.offerForm.markAllAsTouched();
      this.errorMessage = "Per favore, compila tutti i campi obbligatori.";
      return;
    }

    if (!this.authService.userId()) { 
      this.errorMessage = "Errore: Utente non autenticato.";
      return;
    }
    
    const agentId = this.authService.userId(); 
    const formValues = this.offerForm.value; // Prende tutti i valori

    // Costruisci l'oggetto offerta come da modello
    const newOfferPayload = {
      externalName: formValues.customerName,
      amount: formValues.amount,
      message: formValues.message || null,
      status: formValues.status,
      offerDate: new Date(formValues.offer_Date), // Converte la stringa in Data
      response_Date: new Date(),
      counteroffer: false, // È un'offerta di un cliente, non controfferta
      agent_id: agentId,
      customer_id: 0,
      listing_id: this.listingId
    } as Offer;

    console.log("Registrazione nuova offerta manuale:", newOfferPayload);
    this.createOffer(newOfferPayload);
  }

  /**
   * Emette l'evento per chiudere il modal.
   */
  onClose(): void {
    this.close.emit();
  }


  createOffer(payload: Offer) {
    this.offerService.createOffer(payload).subscribe({
      next: (createdOffer) => {
        console.log('Offerta creata con successo:', createdOffer);  
        this.offerSubmitted.emit(createdOffer); // Emette l'offerta creata
        this.onClose(); // Chiude il modal
        },
      error: (error) => {
        console.error('Errore durante la creazione dell\'offerta:', error);
        this.errorMessage = "Si è verificato un errore durante la creazione dell'offerta. Per favore riprova.";
      }
    });
  }



  /**
   * Helper per ottenere la data/ora corrente nel formato YYYY-MM-DDTHH:mm
   * richiesto dall'input [type="datetime-local"]
   */
  private getCurrentDateTimeLocal(): string {
    const now = new Date();
    // Aggiusta per il fuso orario locale
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    // Ritorna la stringa nel formato corretto
    return now.toISOString().slice(0, 16);
  }
}