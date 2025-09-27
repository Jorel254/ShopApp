import type { CanMatchFn } from '@angular/router';
import { AuthService } from '../services/Auth.service';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

export const NotAuthenticateGuard: CanMatchFn = async (route, segments) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const isAuthenticated = await firstValueFrom(authService.checkAuthStatus());
  if (isAuthenticated) {
    router.navigateByUrl('/');
    return false;
  }
  return true;
};
