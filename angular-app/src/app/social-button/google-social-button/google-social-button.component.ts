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
  private initTime = Date.now();

  @Output() socialUserEventFromGoogle = new EventEmitter<SocialUser>();
  @Input() mode: 'signup' | 'login' = 'signup';
  
  ngOnInit() {
    // 1. "Ascoltiamo" la risposta di Google
    this.authService.authState.subscribe((user: SocialUser) => {

      const timeElapsed = Date.now() - this.initTime;

      // 2. Se l'evento arriva troppo presto (es. meno di 500ms), è un "fantasma" della memoria
      // Un essere umano non può cliccare in 0.1 secondi.
      if (timeElapsed < 500) {
         console.warn("Ignorato login fantasma (residuo di memoria)");
         return; 
      }


      if (user && user.provider===GoogleLoginProvider.PROVIDER_ID) {
        console.log("Dati ricevuti da Google:", user);
        
        this.socialUserEventFromGoogle.emit(user);

      }
    });
  }

}
