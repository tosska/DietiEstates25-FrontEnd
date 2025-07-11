import { Component, inject } from '@angular/core';
  import { Router, RouterLink } from '@angular/router';
  import { ToastrService } from 'ngx-toastr';
  import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
  import { AuthService } from '../_services/auth/auth.service';
  import { RestBackendService } from '../_services/rest-backend/rest-backend.service';

  @Component({
    selector: 'app-login',
    standalone: true,
    imports: [RouterLink, ReactiveFormsModule],
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
  }