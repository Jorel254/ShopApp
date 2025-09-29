import type { CanMatchFn } from '@angular/router';
import { AuthService } from '@auth/services/Auth.service';
import { inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

export const AutorizateGuard: CanMatchFn = async (_route, _segments) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const isAutorized = signal<boolean>(false);

  await firstValueFrom(authService.checkAuthStatus()).then((isAuthenticated) => {
    if (isAuthenticated) {
      const isAdmin = authService.validateRoleUser('admin');
      if (!isAdmin) {
        router.navigateByUrl('/');
        isAutorized.set(false);
      }else{
        isAutorized.set(true);
      }
    }else{
      isAutorized.set(false);
    }
  });
  return isAutorized();
};
