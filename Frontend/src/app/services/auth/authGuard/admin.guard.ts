import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserManagementService } from '../../admin/user-management.service';
import { AuthService } from '../../auth/AuthService/auth.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const userService = inject(UserManagementService);
  const authService = inject(AuthService);
  const router = inject(Router);

  const user = userService.getCurrentUser();

  if (!authService.isLoggedIn()) {
    return router.parseUrl(`/app-login?returnUrl=${state.url}`);
  }

  if (user?.role === 'admin') {
    return true;
  }

  return router.parseUrl('/app-startseite');
};
