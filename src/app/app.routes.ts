import { Routes } from '@angular/router';
import { NotAuthenticateGuard } from './auth/guards/Not-authenticate.guard';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes').then((m) => m.routes),
    canMatch: [NotAuthenticateGuard],
  },
  {
    path: '',
    loadChildren: () => import('./store-front/store.routes').then((m) => m.storeRoutes),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
