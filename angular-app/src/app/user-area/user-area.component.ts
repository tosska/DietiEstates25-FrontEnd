// user-area.component.ts

import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../_services/auth/auth.service'; // Adatta il percorso
import { RestBackendService } from '../_services/rest-backend/rest-backend.service'; // Adatta il percorso
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-user-area',
  templateUrl: './user-area.component.html',
  styleUrls: ['./user-area.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule]
})
export class UserAreaComponent implements OnInit, OnDestroy {
  userProfileForm: FormGroup;
  userData: any = {};
  isEditing: boolean = false;
  errorMessage: string = '';
  credentialsId: string | null = null;

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
  }

  ngOnInit() {
    this.credentialsId = this.getCredentialsIdFromToken();
    if (this.credentialsId) {
      this.loadUserProfile();
    } else {
      this.errorMessage = 'Impossibile identificare l\'utente.';
    }
  }

  ngOnDestroy() {
    // Pulizia se necessario
  }

  loadUserProfile() {
    if (this.credentialsId) {
      this.restService.getCustomerById(this.credentialsId).subscribe({
        next: (customer) => {
          this.userData = customer;
          this.userProfileForm.patchValue({
            name: customer.name || '',
            surname: customer.surname || '',
            phone: customer.phone || ''
          });
        },
        error: (err) => {
          this.errorMessage = 'Errore nel caricamento del profilo. Verifica se il CredentialsID corrisponde a un CustomerID.';
          console.error('Errore dettagliato:', err);
        }
      });
    }
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
    if (this.isEditing) {
      this.userProfileForm.enable();
    } else {
      this.userProfileForm.disable();
      this.loadUserProfile(); // Riporta i valori originali
    }
  }

  saveProfile() {
    if (this.userProfileForm.valid && this.credentialsId) {
      const updatedData = {
        name: this.userProfileForm.get('name')?.value,
        surname: this.userProfileForm.get('surname')?.value,
        phone: this.userProfileForm.get('phone')?.value
      };
      this.restService.updateCustomer(this.credentialsId, updatedData).subscribe({
        next: (response) => {
          // Notifica alla navbar di ricaricare i dati utente
          this.authService.triggerUserRefresh();
          
          this.authService.authState.update(state => ({ ...state, user: updatedData.name }));
          this.userData = { ...this.userData, ...updatedData };
          this.isEditing = false;
          this.errorMessage = '';
        },
        error: (err) => {
          this.errorMessage = 'Errore durante il salvataggio del profilo.';
          console.error(err);
        }
      });
    }
  }

  deleteProfile() {
    if (this.credentialsId && confirm('Sei sicuro di voler eliminare il tuo profilo? Questa azione è irreversibile.')) {
      this.restService.deleteCustomer(this.credentialsId).subscribe({
        next: () => {
          this.authService.logout();
          this.router.navigate(['/login']);
        },
        error: (err) => {
          this.errorMessage = 'Errore durante l\'eliminazione del profilo.';
          console.error(err);
        }
      });
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  private getCredentialsIdFromToken(): string | null {
    const token = this.authService.token();
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        return decodedToken.userId || null; // Assume che userId sia CredentialsID
      } catch (error) {
        console.error('Errore decodifica token:', error);
        return null;
      }
    }
    return null;
  }
}