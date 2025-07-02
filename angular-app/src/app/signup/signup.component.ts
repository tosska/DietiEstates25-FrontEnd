import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { RestBackendService } from '../_services/rest-backend/rest-backend.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {
  toastr = inject(ToastrService);
  router = inject(Router);
  restService = inject(RestBackendService);
  submitted = false;

  signupForm = new FormGroup({
    name: new FormControl('', Validators.required),
    surname: new FormControl('', Validators.required),
    phone: new FormControl('', Validators.required),
    user: new FormControl('', Validators.required),
    pass: new FormControl('', [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(16)
    ])
  });

  handleSignup() {
    console.log("Signup");
    this.submitted = true;

    if (this.signupForm.invalid) {
      this.toastr.error("The data you provided is invalid!", "Oops! Invalid data!");
    } else {
      this.restService.signup({
        email: this.signupForm.value.user as string,
        password: this.signupForm.value.pass as string,
        name: this.signupForm.value.name as string,
        surname: this.signupForm.value.surname as string,
        phone: this.signupForm.value.phone as string
      }).subscribe({
        error: (err) => {
          this.toastr.error("The username you selected was already taken", "Oops! Could not create a new user");
        },
        complete: () => {
          this.toastr.success(
            `You can now login with your new account`,
            `Congrats ${this.signupForm.value.name}!`
          );
          this.router.navigateByUrl("/login");
        }
      });
    }
  }
}
