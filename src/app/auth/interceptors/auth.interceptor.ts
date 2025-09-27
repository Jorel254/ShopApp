import type { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '../services/Auth.service';
import { inject } from '@angular/core';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = inject(AuthService).token();
  const newRq = req.clone({
    headers: req.headers.set('Authorization', `Bearer ${token}`),
  });
  return next(newRq);
};
