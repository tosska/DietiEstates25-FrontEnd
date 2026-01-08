import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../_services/auth/auth.service';
import { RestBackendService } from '../_services/rest-backend/rest-backend.service';
import { GoogleSocialButtonComponent } from "../social-button/google-social-button/google-social-button.component";
import { FacebookLoginProvider, GoogleLoginProvider, SocialUser } from '@abacritt/angularx-social-login';
import { FacebookSocialButtonComponent } from '../social-button/facebook-social-button/facebook-social-button.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, GoogleSocialButtonComponent, FacebookSocialButtonComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  toastr = inject(ToastrService);
  router = inject(Router);
  restService = inject(RestBackendService);
  authService = inject(AuthService);
  submitted = false;
  loginForm = new FormGroup({
    user: new FormControl('', [Validators.required]),
    pass: new FormControl('', [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(16)
    ])
  });



  handleLogin() {
    this.submitted = true;
    if (this.loginForm.invalid) {
      this.toastr.error("The data you provided is invalid!", "Oops! Invalid data!");
    } else {
      const credentials = {
        usr: this.loginForm.value.user as string,
        pwd: this.loginForm.value.pass as string,
      };
      this.restService.login(credentials).subscribe({
        next: (token: string) => {
          console.log('Token ricevuto:', token);
          this.authService.updateToken(token);
          this.toastr.success(`Succesfully logged in`, `Welcome ${this.loginForm.value.user}!`);
          this.router.navigate(['/homepage']);
        },
        error: (err) => {
          console.error('Errore login:', err);
          this.toastr.error("Please, insert a valid username and password", "Oops! Invalid credentials");
        }
      });
    }
  }

  loginWithGoogle(user: SocialUser): void {
    console.log("Login con Google:", user);
    this.restService.loginWithSocial({
      usr: user.email,
      providerToken: user.idToken,
      providerName: GoogleLoginProvider.PROVIDER_ID


    }).subscribe({
      next: (token: string) => {
        console.log('Token ricevuto:', token);
        this.authService.updateToken(token);
        this.toastr.success(`Succesfully logged in`, `Welcome ${user.name}!`);
        this.router.navigate(['/homepage']);
      },
      error: (err) => {
        console.error('Errore login:', err);
        this.toastr.error("There was an error during the login process", "Oops! Could not login");
        this.router.navigate(['/logout']);
      }
    });
  }

  loginWithFacebook(user: SocialUser): void {
    console.log("Login con Facebook:", user);
    this.restService.loginWithSocial({
      usr: user.email,
      providerToken: user.authToken,
      providerName: FacebookLoginProvider.PROVIDER_ID
    }).subscribe({
      next: (token: string) => {
        console.log('Token ricevuto:', token);
        this.authService.updateToken(token);
        this.toastr.success(`Succesfully logged in`, `Welcome ${user.name}!`);
        this.router.navigate(['/homepage']);
      }
      ,
      error: (err) => {
        console.error('Errore login:', err);
        this.toastr.error("There was an error during the login process", "Oops! Could not login");
        this.router.navigate(['/logout']);
      }
    });
  }



}


