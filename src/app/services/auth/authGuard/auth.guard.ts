import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../AuthService/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const routerService = inject(Router);

  if (!authService.isLoggedIn()) {
    routerService.navigate(['/app-login'], { queryParams: { returnUrl: state.url } });
    return false;
  }
  return true;
};
