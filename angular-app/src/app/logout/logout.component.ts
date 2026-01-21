import { Component, inject } from '@angular/core';
import { AuthService } from '../_services/auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { SocialAuthService } from '@abacritt/angularx-social-login';

@Component({
  selector: 'app-logout',
  standalone: true,
  imports: [],
  template: '',
  styles: ''
})
export class LogoutComponent {

  authService = inject(AuthService);
  socialAuthService = inject(SocialAuthService);
  toastr = inject(ToastrService);
  router = inject(Router);

  ngOnInit() {
    if(! this.authService.isAuthenticated()){
      this.router.navigateByUrl("/"); //go to homepage
    } else {
      this.toastr.info(`Arrivederci! See you soon!`);
      this.authService.logout();
      this.socialAuthService.signOut(true);
      this.router.navigateByUrl("/"); //go to homepage
    }
  }

}
