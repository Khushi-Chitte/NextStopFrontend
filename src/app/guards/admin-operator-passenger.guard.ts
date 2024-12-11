import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthserviceService } from '../services/authservice.service';

export const adminOperatorPassengerGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthserviceService);
  const router = inject(Router);

  const isAdmin = authService.getUserRoles()  === 'admin';
  const isOperator = authService.getUserRoles()  === 'operator';
  const isPassenger = authService.getUserRoles()  === 'passenger';

  if(!isAdmin && !isOperator  && !isPassenger) {
    router.navigate(['/app-home']);
    return false;
  }

  return true;
};
