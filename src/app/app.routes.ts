import { Routes } from '@angular/router';
import { NotAuthenticateGuard } from './auth/guards/Not-authenticate.guard';
import { AutorizateGuard } from './admin-dashboard/guards/Autorizate.guard';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes').then((m) => m.routes),
    canMatch: [NotAuthenticateGuard],
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin-dashboard/admin.routes').then((m) => m.adminRoutes),
    canMatch: [AutorizateGuard],
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
