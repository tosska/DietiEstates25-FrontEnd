import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { RestBackendService } from '../_services/rest-backend/rest-backend.service';
import { CommonModule } from '@angular/common';

// Validatore personalizzato per confrontare le password
export const passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const password = control.get('newPassword');
  const confirmPassword = control.get('confirmPassword');
  return password && confirmPassword && password.value !== confirmPassword.value ? { mismatch: true } : null;
};

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss'
})
export class ChangePasswordComponent {

  private restService = inject(RestBackendService);
  private router = inject(Router);
  private toastr = inject(ToastrService);

  submitted = false;
  isLoading = false; // Gestisce lo stato del caricamento nel bottone

  changePasswordForm = new FormGroup({
    newPassword: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(20),
    ]),
    confirmPassword: new FormControl('', Validators.required)
  }, { validators: passwordMatchValidator }); // Aggiunto il validatore di gruppo

  handleChangePassword() {
    this.submitted = true;

    // Se il form è invalido (inclusa la mancata corrispondenza delle password)
    if (this.changePasswordForm.invalid) {
      if (this.changePasswordForm.hasError('mismatch')) {
        this.toastr.error('Le password non coincidono', 'Errore');
      } else {
        this.toastr.error('Inserisci una password valida', 'Errore');
      }
      return;
    }

    const { newPassword } = this.changePasswordForm.value;

    this.isLoading = true; // Attiva lo spinner

    this.restService.changePasswordFirstLogin(newPassword!)
      .subscribe({
        next: () => {
          this.isLoading = false;
          this.toastr.success('Password aggiornata con successo', 'Ottimo!');
          this.router.navigate(['/homepage']);
        },
        error: (err) => {
          this.isLoading = false;
          console.error(err);
          this.toastr.error('Errore durante il cambio password', 'Operazione fallita');
        }
      });
  }
}