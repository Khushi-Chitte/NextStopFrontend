import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthserviceService } from '../services/authservice.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthserviceService);
  const router = inject(Router);

  const isAdmin = authService.getUserRoles()  === 'admin';
  
  if(!isAdmin){
    router.navigate(['/app-home']);
    return false;
  }

  return true;
};
