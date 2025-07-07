import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RestBackendService } from '../_services/rest-backend/rest-backend.service';
import { AgencySignupRequest } from '../_services/rest-backend/agency-signup-request.type';

@Component({
  selector: 'app-company-signup',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './company-signup.component.html',
  styleUrl: './company-signup.component.scss'
})
export class CompanySignupComponent {
  toastr = inject(ToastrService);
  router = inject(Router);
  restService = inject(RestBackendService);
  submitted = false;
  signupForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(16)
    ]),
    phone: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    vatNumber: new FormControl(''),
    website: new FormControl(''),
    managerAdminId: new FormControl('', [Validators.required, Validators.min(1)]),
    addressId: new FormControl('', [Validators.required, Validators.min(1)])
  });

  handleSignup() {
    this.submitted = true;
    if (this.signupForm.invalid) {
      this.toastr.error("The data you provided is invalid!", "Oops! Invalid data!");
    } else {
      const signupRequest: AgencySignupRequest = {
        email: this.signupForm.value.email as string,
        password: this.signupForm.value.password as string,
        phone: this.signupForm.value.phone as string,
        description: this.signupForm.value.description as string,
        vatNumber: this.signupForm.value.vatNumber as string || undefined,
        website: this.signupForm.value.website as string || undefined,
        managerAdminId: Number(this.signupForm.value.managerAdminId) as number,
        addressId: Number(this.signupForm.value.addressId) as number
      };
      this.restService.signupCompany(signupRequest).subscribe({
        next: () => {
          this.toastr.success("Company registered successfully!", "Success!");
          this.router.navigateByUrl('/login');
        },
        error: (err) => {
          console.error('Errore signup company:', err);
          this.toastr.error("Unable to register company. Check the server.", "Error");
        }
      });
    }
  }
}