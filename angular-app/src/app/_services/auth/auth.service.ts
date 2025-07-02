import { Injectable, WritableSignal, computed, effect, signal } from '@angular/core';
  import { jwtDecode } from "jwt-decode";
  import { AuthState } from './auth-state.type';

  @Injectable({
    providedIn: 'root'
  })
  export class AuthService {
    authState: WritableSignal<AuthState> = signal<AuthState>({
      user: this.getUser(),
      token: this.getToken(),
      isAuthenticated: this.verifyToken(this.getToken())
    });

    user = computed(() => this.authState().user);
    token = computed(() => this.authState().token);
    isAuthenticated = computed(() => this.authState().isAuthenticated);

    constructor() {
      effect(() => {
        const token = this.authState().token;
        const user = this.authState().user;
        if (token !== null) {
          localStorage.setItem("token", token);
        } else {
          localStorage.removeItem("token");
        }
        if (user !== null) {
          localStorage.setItem("user", user);
        } else {
          localStorage.removeItem("user");
        }
        console.log('authState aggiornato:', this.authState());
      });
    }

    updateToken(token: string): void {
      try {
        const decodedToken: any = jwtDecode(token);
        console.log('Decoded token:', decodedToken);
        const user = decodedToken.userId || decodedToken.email || decodedToken.sub || decodedToken.name || 'Utente';
        console.log('User estratto:', user);
        const isValid = this.verifyToken(token);
        this.authState.set({
          user: user,
          token: token,
          isAuthenticated: isValid
        });
        console.log('authState dopo update:', { user, isAuthenticated: isValid });
      } catch (error) {
        console.error('Errore decodifica token:', error);
        this.authState.set({ user: null, token: null, isAuthenticated: false });
      }
    }

    getToken(): string | null {
      return localStorage.getItem("token");
    }

    getUser(): string | null {
      return localStorage.getItem("user");
    }

    verifyToken(token: string | null): boolean {
      if (token !== null) {
        try {
          const decodedToken = jwtDecode(token);
          console.log('Token verificato:', decodedToken);
          const expiration = decodedToken.exp;
          if (expiration === undefined) {
            console.warn('Token senza expiration, considerato valido temporaneamente');
            return true; // Temporaneo, da rimuovere dopo debug
          }
          return Date.now() < expiration * 1000;
        } catch (error) {
          console.error('Errore nella verifica del token:', error);
          return false;
        }
      }
      return false;
    }

    isUserAuthenticated(): boolean {
      return this.isAuthenticated();
    }

    logout() {
      this.authState.set({
        user: null,
        token: null,
        isAuthenticated: false
      });
    }
  }