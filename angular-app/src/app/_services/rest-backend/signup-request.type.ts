// Usato solo per la registrazione
export interface SignupRequest {
  email: string;
  password?: string;
  name: string;
  surname: string;
  phone?: string;
  providerToken?: string; // Opzionale, per social login
  providerName?: string; // Opzionale, per social login
}
