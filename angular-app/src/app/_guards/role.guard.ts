import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../_services/auth/auth.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  // 1. Verifica autenticazione di base
  if (!auth.isAuthenticated()) {
    // Salva l'URL a cui voleva accedere per redirect post-login (opzionale)
    return router.createUrlTree(['/login']);
  }

  const requiredRoles = route.data['roles'] as string[];
  const userRole = auth.getRole();

  // 2. Verifica ruolo specifico
  if (userRole && requiredRoles.includes(userRole)) {
    return true;
  }

  // 3. Utente loggato ma senza permessi -> Unauthorized
  return router.createUrlTree(['/unauthorized']);
};