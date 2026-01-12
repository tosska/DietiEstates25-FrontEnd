// auth.service.ts

import { Injectable, WritableSignal, computed, effect, signal } from '@angular/core';
import { jwtDecode } from "jwt-decode";
import { AuthState } from './auth-state.type';
import { RestBackendService } from '../rest-backend/rest-backend.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Signal per notificare l'aggiornamento del profilo
  readonly userProfileUpdated = signal(0);

  authState: WritableSignal<AuthState> = signal<AuthState>({
    authId: this.getAuthId(),
    userId: this.getUserId(),
    role: this.getRole(),
    token: this.getToken(),
    isAuthenticated: this.verifyToken(this.getToken())
  });

  authId = computed(() => this.authState().authId);
  userId = computed(() => this.authState().userId);
  role = computed(() => this.authState().role);
  token = computed(() => this.authState().token);
  isAuthenticated = computed(() => this.authState().isAuthenticated);

  constructor(private restService: RestBackendService) {
    //funzione eseguita quando authState cambia
    effect(() => {
      const token = this.authState().token;
      const authId = this.authState().authId;
      const userId = this.authState().userId;
      const role = this.authState().role;
      if (token !== null) {
        localStorage.setItem("token", token);
      } else {
        localStorage.removeItem("token");
      }
      if (authId !== null) {
        localStorage.setItem("authId", authId.toString());
      } else {
        localStorage.removeItem("authId");
      }
      if (userId !== null) {
        localStorage.setItem("userId", userId.toString());
      } else {
        localStorage.removeItem("userId");
      }
      if (role !== null) {
        localStorage.setItem("role", role);
      } else {
        localStorage.removeItem("role");
      }
      console.log('authState aggiornato:', this.authState());
    });
  }

  // Metodo da chiamare dopo aver salvato le modifiche al profilo
  triggerUserRefresh() {
    this.userProfileUpdated.update(value => value + 1);
  }

  updateToken(token: string): void {
    try {
      const decodedToken: any = jwtDecode(token);
      console.log('Token decodificato in updateToken:', decodedToken); // Debug
      const authId = decodedToken.authId;
      const userId = decodedToken.userId;
      const role = decodedToken.role;
      //const role = "agent"; // Temporaneo, da rimuovere dopo debug
      console.log('User ID estratto:', userId, 'Role:', role);
      const isValid = this.verifyToken(token);
      localStorage.setItem("token", token); // Salva il token
      this.authState.set({
        authId: authId,
        userId: userId,
        role: role,
        token: token,
        isAuthenticated: isValid
      });
      //if (userId) this.fetchUserName(userId);
    } catch (error) {
      console.error('Errore decodifica token:', error);
      this.authState.set({ authId: null, userId: null, role: null, token: null, isAuthenticated: false });
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

  getAuthId(): number | null {
    const id = localStorage.getItem("authId");
    return id ? Number(id) : null;
  }

  getUserId(): number | null {
    const id = localStorage.getItem("userId");
    return id ? Number(id) : null;
  }

  getRole(): string | null {
    return localStorage.getItem("role");
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
      authId: null,
      userId: null,
      role: null,
      token: null,
      isAuthenticated: false
    });
  }
}