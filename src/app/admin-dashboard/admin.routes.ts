import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './layouts/AdminLayout/AdminLayout.component';
import { ProductsAdminComponent } from './pages/ProductsAdmin/ProductsAdmin.component';
import { ProductAdminComponent } from './pages/ProductAdmin/ProductAdmin.component';

export const adminRoutes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      {
        path: 'products',
        component: ProductsAdminComponent,
      },
      {
        path: 'product/:id',
        component: ProductAdminComponent,
      },
      {
        path: '**',
        redirectTo: 'products',
      },
    ],
  },
];
export default adminRoutes;
