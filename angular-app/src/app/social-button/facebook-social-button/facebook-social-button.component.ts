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

  @Output() socialUserEventFromFacebook = new EventEmitter<SocialUser>();
  @Input() mode: 'signup' | 'login' = 'signup';


  signInWithFB(): void {
    // Chiami il login e aspetti la risposta DIRETTA di questa azione
    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID)
      .then((user) => {
        console.log("Login Facebook effettuato con successo:", user);
        this.socialUserEventFromFacebook.emit(user);
      })
      .catch((err) => {
        console.error("Errore o login annullato:", err);
      });
  }

}
