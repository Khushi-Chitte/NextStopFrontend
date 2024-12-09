import { HttpInterceptorFn } from '@angular/common/http';
import { AuthserviceService } from './services/authservice.service';

export const authInterceptorInterceptor: HttpInterceptorFn = (req, next) => {


  const userId = localStorage.getItem('userId');
  const jwtToken = localStorage.getItem('jwtToken');

  if(userId && jwtToken) {
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${jwtToken}`,
      }
    });
    return next(clonedRequest);
  }

  return next(req);
};
