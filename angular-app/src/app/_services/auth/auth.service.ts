import { Injectable, WritableSignal, computed, effect, signal } from '@angular/core';
import { jwtDecode } from "jwt-decode";
import { AuthState } from './auth-state.type';
import { RestBackendService } from '../rest-backend/rest-backend.service';

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

  constructor(private restService: RestBackendService) {
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
      console.log('Token decodificato in updateToken:', decodedToken); // Debug
      const userId = decodedToken.userId;
      const role = decodedToken.role;
      console.log('User ID estratto:', userId, 'Role:', role);
      const isValid = this.verifyToken(token);
      localStorage.setItem("token", token); // Salva il token
      this.authState.set({
        user: userId,
        token: token,
        isAuthenticated: isValid
      });
      if (userId) this.fetchUserName(userId);
    } catch (error) {
      console.error('Errore decodifica token:', error);
      this.authState.set({ user: null, token: null, isAuthenticated: false });
    }
  }
  
  getToken(): string | null {
    const token = localStorage.getItem("token");
    console.log('Token recuperato da getToken:', token); // Debug
    return token;
  }

  // Metodo per recuperare il nome usando l'endpoint /customers/:id
  private fetchUserName(userId: string): void {
    this.restService.getCustomerById(userId).subscribe({
      next: (customer: any) => {
        console.log('Dati cliente recuperati:', customer);
        const userName = customer.Name || 'Utente'; // Adatta ai campi reali
        console.log('Nome utente estratto:', userName);
        this.authState.update(state => ({ ...state, user: userName }));
      },
      error: (err) => {
        console.error('Errore recupero nome utente:', err);
        this.authState.update(state => ({ ...state, user: 'Utente' })); // Fallback a 'Utente'
      }
    });
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