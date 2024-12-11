import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthserviceService } from '../services/authservice.service';

export const passengerGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthserviceService);
  const router = inject(Router);

  const isPassenger = authService.getUserRoles()  === 'passenger';

  if(!isPassenger) {
    router.navigate(['/app-home']);
    return false;
  }
  return true;
};
