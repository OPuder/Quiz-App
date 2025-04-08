import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../AuthService/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const routerService = inject(Router);

  console.log('AuthGuard aufgerufen');
  console.log('Benutzer eingeloggt:', authService.isLoggedIn());

  if (!authService.isLoggedIn()) {
    console.log('Benutzer ist nicht eingeloggt, weiterleiten zur Login-Seite');
    routerService.navigate(['/app-login']);
    return false;
  }
  console.log('Benutzer ist eingeloggt, Zugang zur Route erlaubt');
  return true;
};
