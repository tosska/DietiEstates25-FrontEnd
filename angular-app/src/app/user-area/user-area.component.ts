import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { AuthService } from '../_services/auth/auth.service';
import { RestBackendService } from '../_services/rest-backend/rest-backend.service';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { CommonModule } from '@angular/common';

export const passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const password = control.get('newPassword');
  const confirmPassword = control.get('confirmPassword');
  return password && confirmPassword && password.value !== confirmPassword.value ? { mismatch: true } : null;
};

@Component({
  selector: 'app-user-area',
  templateUrl: './user-area.component.html',
  styleUrls: ['./user-area.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule]
})
export class UserAreaComponent implements OnInit, OnDestroy {
  userProfileForm: FormGroup;
  credentialsForm: FormGroup;
  
  userData: any = {};
  errorMessage: string = '';

  isEditingProfile: boolean = false;      
  isEditingCredentials: boolean = false; 

  authId: string | null = null;
  customerId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private restService: RestBackendService,
    private router: Router
  ) {
    this.userProfileForm = this.fb.group({
      name: ['', Validators.required], 
      surname: ['', Validators.required], 
      phone: ['', Validators.required], 
    });

    this.credentialsForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      oldPassword: [''],
      newPassword: ['', [Validators.minLength(6)]],
      confirmPassword: ['']
    }, { validators: passwordMatchValidator });
  }

  ngOnInit() {
    this.extractIdsFromToken();
    if (this.customerId && this.authId) {
      this.loadUserProfile();
    } else {
      this.errorMessage = 'Impossibile identificare l\'utente.';
    }
  }

  ngOnDestroy() {}

  private extractIdsFromToken() {
    const aId = this.authService.getAuthId();
    const cId = this.authService.getUserId();
    this.authId = aId ? aId.toString() : null;
    this.customerId = cId ? cId.toString() : null;
  }

  loadUserProfile() {
    if (this.customerId) {
      this.restService.getCustomerById(this.customerId).subscribe({
        next: (customer) => {
          this.userData = { ...this.userData, ...customer }; 
          this.userProfileForm.patchValue({
            name: customer.name || '',
            surname: customer.surname || '',
            phone: customer.phone || ''
          });
        },
        error: (err) => console.error('Errore anagrafica:', err)
      });
    }

    if (this.authId) {
      this.restService.getCredentials(this.authId).subscribe({
        next: (creds) => {
          this.userData = { ...this.userData, email: creds.email }; 
          this.credentialsForm.patchValue({
            email: creds.email || '' 
          });
        },
        error: (err) => console.error('Errore credenziali:', err)
      });
    }
  }

  toggleProfileEdit() {
    this.isEditingProfile = !this.isEditingProfile;
    if (this.isEditingProfile) {
      this.userProfileForm.enable();
    } else {
      this.userProfileForm.disable();
      if (this.userData) {
         this.userProfileForm.patchValue({
           name: this.userData.name, 
           surname: this.userData.surname, 
           phone: this.userData.phone
         });
      }
    }
  }

  toggleCredentialsEdit() {
    this.isEditingCredentials = !this.isEditingCredentials;
    if (!this.isEditingCredentials) {
      this.credentialsForm.patchValue({
        email: this.userData.email,
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    }
  }

  saveProfile() {
    if (this.userProfileForm.valid && this.customerId) {
      const updatedData = {
        name: this.userProfileForm.get('name')?.value,
        surname: this.userProfileForm.get('surname')?.value,
        phone: this.userProfileForm.get('phone')?.value
      };
      
      this.restService.updateCustomer(this.customerId, updatedData).subscribe({
        next: () => {
          this.authService.triggerUserRefresh();
          this.authService.authState.update(state => ({ ...state, user: updatedData.name }));
          this.userData = { ...this.userData, ...updatedData };
          this.isEditingProfile = false;
        },
        error: (err) => console.error(err)
      });
    }
  }

  updateCredentials() {
    if (this.credentialsForm.valid && this.authId) {
      const formVal = this.credentialsForm.value;
      const emailToUpdate = (this.credentialsForm.get('email')?.dirty && formVal.email !== this.userData.email) ? formVal.email : null;
      const passwordToUpdate = (formVal.newPassword) ? formVal.newPassword : null;

      if (!emailToUpdate && !passwordToUpdate) {
        this.toggleCredentialsEdit(); 
        return; 
      }

      this.restService.updateCredentials(this.authId, emailToUpdate, passwordToUpdate).subscribe({
        next: () => {
          alert('Credenziali aggiornate con successo');
          this.isEditingCredentials = false;
          this.credentialsForm.patchValue({ oldPassword: '', newPassword: '', confirmPassword: '' });
          if (emailToUpdate) {
             this.loadUserProfile(); 
          }
        },
        error: (err) => {
          alert('Errore aggiornamento.');
          console.error(err);
        }
      });
    }
  }

  // MODIFICATO: Chiama SOLO deleteCredentials.
  deleteProfile() {
    if (this.authId && confirm('Sei sicuro di voler eliminare definitivamente il tuo account?')) {
      // Chiamiamo solo l'Auth Service. Le regole di Foreign Key nel DB faranno il resto.
      this.restService.deleteCredentials(this.authId).subscribe({
        next: () => {
          console.log('Account eliminato con successo');
          this.authService.logout();
          this.router.navigate(['/login']);
        },
        error: (err) => {
          console.error('Errore durante l\'eliminazione dell\'account:', err);
          alert('Si è verificato un errore. Riprova.');
        }
      });
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}