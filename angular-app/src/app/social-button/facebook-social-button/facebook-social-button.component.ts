import { FacebookLoginProvider, SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';

@Component({
  selector: 'app-facebook-social-button',
  standalone: true,
  imports: [],
  templateUrl: './facebook-social-button.component.html',
  styleUrl: './facebook-social-button.component.scss'
})
export class FacebookSocialButtonComponent {

  private authService = inject(SocialAuthService);

  @Output() socialUserEvent = new EventEmitter<SocialUser>();
  @Input() mode: 'signup' | 'login' = 'signup';

  ngOnInit() {
    this.authService.authState.subscribe((user: SocialUser) => {
      // Verifichiamo che l'utente provenga da Facebook
      if (user && user.provider === FacebookLoginProvider.PROVIDER_ID) {
        this.socialUserEvent.emit(user);
      }
    });
  }

  signInWithFB(): void {
    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID);
  }

}
