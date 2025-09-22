import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./store-front/store.routes').then((m) => m.storeRoutes),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
