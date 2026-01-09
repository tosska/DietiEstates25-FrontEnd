import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { RestBackendService } from '../_services/rest-backend/rest-backend.service';
import { FacebookLoginProvider, GoogleLoginProvider, SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { GoogleSocialButtonComponent } from '../social-button/google-social-button/google-social-button.component';
import { SignupRequest } from '../_services/rest-backend/signup-request.type';
import { FacebookSocialButtonComponent } from "../social-button/facebook-social-button/facebook-social-button.component";

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, GoogleSocialButtonComponent, FacebookSocialButtonComponent],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {
  toastr = inject(ToastrService);
  router = inject(Router);
  socialAuthService = inject(SocialAuthService);
  restService = inject(RestBackendService);
  submitted = false;

  socialUserToSignup: SignupRequest | null = null;

  
  showPhoneModal: boolean = false;

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

  socialPhoneForm = new FormGroup({
    phone: new FormControl('', [
      Validators.required, 
      Validators.pattern('^[0-9+ ]*$') // Validazione base per numeri
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

  importDataFromGoogle(user: SocialUser): void {
    this.socialUserToSignup = {
      email: user.email,
      name: user.firstName,
      surname: user.lastName,
      providerToken: user.idToken,
      providerName: GoogleLoginProvider.PROVIDER_ID,
      phone: ""
    };

    console.log("Dati importati per la registrazione:", this.socialUserToSignup);

    this.showPhoneModal = true;

    
  }

  importDataFromFacebook(user: SocialUser): void {
    this.socialUserToSignup = {
      email: user.email,
      name: user.firstName,
      surname: user.lastName,
      providerToken: user.authToken,
      providerName: FacebookLoginProvider.PROVIDER_ID,
      phone: ""
    };

    console.log("Dati importati per la registrazione:", this.socialUserToSignup);

    this.showPhoneModal = true;
  }

  insertPhoneAndSocialSignup(): void {
    this.showPhoneModal = false;
    this.socialUserToSignup!.phone = this.socialPhoneForm.value.phone as string;


    console.log("Completamento registrazione con telefono:", this.socialUserToSignup);


    this.restService.signupWithSocial(this.socialUserToSignup!).subscribe({
      error: (err) => {
        this.toastr.error("There was an error during the signup process", "Oops! Could not create a new user");
      },
      complete: () => {
        this.toastr.success(
          `You can now login with your new account`,
          `Congrats ${this.socialUserToSignup!.name}!`
        );
         this.showPhoneModal = false;
        this.router.navigateByUrl("/login");
      }
    });

  }



}
