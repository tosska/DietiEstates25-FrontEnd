import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../_services/auth/auth.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const requiredRoles = route.data['roles'] as string[];
  const userRole = auth.getRole();

  if (userRole && requiredRoles.includes(userRole)) {
    return true;
  }

  // se non ha i permessi → redirect
  router.navigate(['/unauthorized']);
  return false;
};



