import { Component, OnInit, AfterViewInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RestBackendService } from '../_services/rest-backend/rest-backend.service';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-signup-agency',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule
  ],
  templateUrl: './signup-agency.component.html',
  styleUrls: ['./signup-agency.component.scss']
})
export class SignupAgencyComponent implements OnInit, AfterViewInit, OnDestroy {
  toastr = inject(ToastrService);
  currentStep = 1;
  signupForm: FormGroup;
  mapCoordinates: { latitude: number; longitude: number } = { latitude: 45.46, longitude: 9.19 };

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private restService: RestBackendService,
    private router: Router
  ) {
    this.signupForm = this.fb.group({
      // STEP 1: Credenziali Manager
      step1: this.fb.group({
        name: ['', Validators.required],     
        surname: ['', Validators.required],  
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]]
      }),

      // STEP 2: Indirizzo (Tutti campi obbligatori nel DB)
      step2: this.fb.group({
        street: ['', Validators.required],
        city: ['', Validators.required],
        postalCode: ['', Validators.required],
        
        // Ho aggiunto il validatore required qui
        state: ['', Validators.required], 
        
        unitDetail: [''], // Opzionale
        houseNumber: ['', Validators.required],
        country: ['Italia', Validators.required],
        latitude: [this.mapCoordinates.latitude],
        longitude: [this.mapCoordinates.longitude]
      }),

      // STEP 3: Dati Agenzia
      step3: this.fb.group({
        phone: ['', [Validators.required]],
        description: ['', Validators.required], // Aggiunto required anche qui per coerenza
        vatNumber: ['', [Validators.required]],
        website: ['']
      })
    });
  }

  ngOnInit() {}

  ngAfterViewInit() {}

  ngOnDestroy() {}

  nextStep() {
    if (this.currentStep === 1 && this.step1.invalid) {
        this.step1.markAllAsTouched(); // Mostra errori visivi
        return;
    }
    if (this.currentStep === 2 && this.step2.invalid) {
        this.step2.markAllAsTouched(); // Mostra errori visivi
        return;
    }
    
    this.currentStep++;
  }

  prevStep() {
    this.currentStep--;
  }

  onSubmit() {
    if (this.signupForm.invalid) {
        this.signupForm.markAllAsTouched();
        return;
    }

    const formData = {
      // Dati Manager
      name: this.step1.get('name')?.value,       
      surname: this.step1.get('surname')?.value, 
      email: this.step1.get('email')?.value,
      password: this.step1.get('password')?.value,
      
      // Dati Agenzia
      phone: this.step3.get('phone')?.value,
      description: this.step3.get('description')?.value,
      vatNumber: this.step3.get('vatNumber')?.value,
      website: this.step3.get('website')?.value,
      
      // Dati Indirizzo
      street: this.step2.get('street')?.value,
      city: this.step2.get('city')?.value,
      postalCode: this.step2.get('postalCode')?.value,
      state: this.step2.get('state')?.value, // Mappatura corretta
      unitDetail: this.step2.get('unitDetail')?.value,
      houseNumber: this.step2.get('houseNumber')?.value,
      country: this.step2.get('country')?.value,
      longitude: this.step2.get('longitude')?.value,
      latitude: this.step2.get('latitude')?.value
    };

    console.log('Dati inviati al backend:', formData);

    this.restService.registerAgency(formData).subscribe({
      next: (response) => {
        this.toastr.success(`L'agenzia è stata registrata con successo`);
        this.router.navigate(['/homepage']); 
      },
      error: (error) => {
        console.error('Errore registrazione agenzia:', error);
        // Mostra il messaggio di errore specifico dal backend se disponibile
        const msg = error.error?.message || 'Errore durante la registrazione.';
        this.toastr.error(msg);
      }
    });
  }

  get step1() { return this.signupForm.get('step1') as FormGroup; }
  get step2() { return this.signupForm.get('step2') as FormGroup; }
  get step3() { return this.signupForm.get('step3') as FormGroup; }
}