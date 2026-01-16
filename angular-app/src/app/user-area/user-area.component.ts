import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { AuthService } from '../_services/auth/auth.service';
import { RestBackendService } from '../_services/rest-backend/rest-backend.service';
import { AgencyBackendService } from '../_services/agency-backend/agency-backend.service';
import { Router } from '@angular/router';
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
  userId: string | null = null; 
  userRole: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private restService: RestBackendService,
    private agencyService: AgencyBackendService,
    private router: Router
  ) {
    this.userProfileForm = this.fb.group({
      name: ['', Validators.required], 
      surname: ['', Validators.required], 
      phone: ['', Validators.required],
      vatNumber: [''], 
      yearsExperience: [''],
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
    
    // MODIFICA: Procediamo se abbiamo almeno l'authId (le credenziali sono il minimo sindacale)
    if (this.authId) {
      this.loadUserProfile();
    } else {
      this.errorMessage = 'Impossibile identificare l\'utente (AuthID mancante).';
      console.error('AuthID non trovato nel token');
    }
  }

  ngOnDestroy() {}

  private extractIdsFromToken() {
    const aId = this.authService.getAuthId();
    const uId = this.authService.getUserId();
    this.userRole = this.authService.getRole();

    this.authId = aId ? aId.toString() : null;
    this.userId = uId ? uId.toString() : null;
    
    console.log('UserArea Init -> AuthID:', this.authId, 'UserID:', this.userId, 'Role:', this.userRole);
  }

  loadUserProfile() {
    // 1. CARICAMENTO DATI ANAGRAFICI (Solo se abbiamo userId e Role validi)
    if (this.userId && this.userRole) {
      
      // LOGICA ADMIN: Rimuovi validazione telefono
      if (this.userRole === 'admin' || this.userRole === 'manager') {
        this.userProfileForm.get('phone')?.clearValidators();
        this.userProfileForm.get('phone')?.updateValueAndValidity();
      }

      let profileRequest;

      if (this.userRole === 'customer') {
        profileRequest = this.restService.getCustomerById(this.userId);
      } else if (this.userRole === 'agent') {
        profileRequest = this.agencyService.getAgentById(Number(this.userId));
      } else if (this.userRole === 'admin' || this.userRole === 'manager') {
        profileRequest = this.agencyService.getAdminById(Number(this.userId));
      }

      if (profileRequest) {
        profileRequest.subscribe({
          next: (data: any) => {
            this.userData = { ...this.userData, ...data }; 
            
            this.userProfileForm.patchValue({
              name: data.name || '',
              surname: data.surname || '',
              phone: data.phone || '',
              vatNumber: data.vatNumber || '',
              yearsExperience: data.yearsExperience || ''
            });
          },
          error: (err) => console.error('Errore caricamento profilo anagrafico:', err)
        });
      }
    } else {
      console.warn('UserID o Role mancante: impossibile caricare profilo anagrafico (Customer/Agent/Admin).');
    }

    // 2. CARICAMENTO CREDENZIALI (Sempre eseguito se authId c'è)
    if (this.authId) {
      this.restService.getCredentials(this.authId).subscribe({
        next: (creds) => {
          this.userData = { ...this.userData, email: creds.email }; 
          this.credentialsForm.patchValue({
            email: creds.email || '' 
          });
        },
        error: (err) => console.error('Errore caricamento credenziali:', err)
      });
    }
  }

  // ... (Tutti gli altri metodi rimangono uguali: toggleProfileEdit, saveProfile, updateCredentials, deleteProfile, logout)
  toggleProfileEdit() {
    this.isEditingProfile = !this.isEditingProfile;
    if (this.isEditingProfile) {
      this.userProfileForm.enable();
    } else {
      this.userProfileForm.disable();
      this.loadUserProfile(); 
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
    if (this.userProfileForm.valid && this.userId && this.userRole) {
      
      const formValues = this.userProfileForm.value;
      const updatedData: any = {
        name: formValues.name,
        surname: formValues.surname,
      };

      if (this.userRole !== 'admin' && this.userRole !== 'manager') {
        updatedData.phone = formValues.phone;
      }

      if (this.userRole === 'agent') {
        updatedData.vatNumber = formValues.vatNumber;
        updatedData.yearsExperience = formValues.yearsExperience;
      }

      let updateRequest;

      if (this.userRole === 'customer') {
        updateRequest = this.restService.updateCustomer(this.userId, updatedData);
      } else if (this.userRole === 'agent') {
        updateRequest = this.agencyService.updateAgent(Number(this.userId), updatedData);
      } else if (this.userRole === 'admin' || this.userRole === 'manager') {
        updateRequest = this.agencyService.updateAdmin(Number(this.userId), updatedData);
      }

      if (updateRequest) {
        updateRequest.subscribe({
          next: () => {
            this.authService.triggerUserRefresh();
            this.authService.authState.update(state => ({ ...state, user: updatedData.name }));
            this.userData = { ...this.userData, ...updatedData };
            this.isEditingProfile = false;
          },
          error: (err) => {
            console.error('Errore aggiornamento profilo:', err);
            alert('Errore durante il salvataggio.');
          }
        });
      }
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
          alert('Errore aggiornamento credenziali.');
          console.error(err);
        }
      });
    }
  }

  deleteProfile() {
    if (this.authId && confirm('Sei sicuro di voler eliminare definitivamente il tuo account?')) {
      this.restService.deleteCredentials(this.authId).subscribe({
        next: () => {
          console.log('Account eliminato con successo');
          this.authService.logout();
          this.router.navigate(['/login']);
        },
        error: (err) => {
          console.error('Errore eliminazione account:', err);
          alert('Impossibile eliminare l\'account. Riprova.');
        }
      });
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}