import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { RestBackendService } from '../_services/rest-backend/rest-backend.service';

@Component({
  selector: 'app-signup-agency',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule,
  ],
  templateUrl: './signup-agency.component.html',
  // styleUrls: ['./signup-agency.component.scss']
})
export class SignupAgencyComponent implements OnInit {
  currentStep = 1;
  signupForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private restService: RestBackendService,
    private router: Router
  ) {
    this.signupForm = this.fb.group({
      step1: this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]]
      }),
      step2: this.fb.group({
        // I campi obbligatori del backend ora hanno Validators.required
        street: ['', [Validators.required]], 
        city: ['', [Validators.required]],
        postalCode: ['', [Validators.required]],
        state: ['', [Validators.required]],
        unitDetail: ['', [Validators.required]], // Assicurati di inviare anche questo
      }),
      step3: this.fb.group({
        phone: ['', [Validators.required]],
        description: [''],
        vatNumber: ['', [Validators.required]],
        website: ['']
      })
    });
  }

  ngOnInit() {}

  nextStep() {
    if (this.currentStep === 1) {
      if (this.step1.invalid) return;
    }
    
    if (this.currentStep === 2) {
      if (this.step2.invalid) return;
    }
    
    this.currentStep++;
  }

  prevStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  onSubmit() {
    // Il controllo di validità finale include anche lo Step 3
    if (this.signupForm.invalid || this.step3.invalid) return;

    const formData = {
      email: this.step1.get('email')?.value,
      password: this.step1.get('password')?.value,
      
      // Dati Indirizzo (tutti obbligatori)
      street: this.step2.get('street')?.value,
      city: this.step2.get('city')?.value,
      postalCode: this.step2.get('postalCode')?.value,
      state: this.step2.get('state')?.value,
      unitDetail: this.step2.get('unitDetail')?.value,

      // Dati Agenzia
      phone: this.step3.get('phone')?.value,
      description: this.step3.get('description')?.value,
      vatNumber: this.step3.get('vatNumber')?.value,
      website: this.step3.get('website')?.value,
    };

    this.restService.registerAgency(formData).subscribe({
      next: (response) => {
        console.log('Registrazione agenzia completata:', response);
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Errore registrazione agenzia:', error);
      }
    });
  }

  get step1() { return this.signupForm.get('step1') as FormGroup; }
  get step2() { return this.signupForm.get('step2') as FormGroup; }
  get step3() { return this.signupForm.get('step3') as FormGroup; }
}