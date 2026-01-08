import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { GoogleLoginProvider, GoogleSigninButtonModule, SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';

@Component({
  selector: 'app-google-social-button',
  standalone: true,
  imports: [GoogleSigninButtonModule],
  templateUrl: './google-social-button.component.html',
  styleUrl: './google-social-button.component.scss'
})
export class GoogleSocialButtonComponent {

// Variabile per salvare il token di sicurezza
  socialToken: string | null = null;
  private authService = inject(SocialAuthService);

  @Output() socialUserEvent = new EventEmitter<SocialUser>();
  @Input() mode: 'signup' | 'login' = 'signup';
  
  ngOnInit() {
    // 1. "Ascoltiamo" la risposta di Google
    this.authService.authState.subscribe((user: SocialUser) => {
      if (user) {
        console.log("Dati ricevuti da Google:", user);
        
        this.socialUserEvent.emit(user);

      }
    });
  }

}
