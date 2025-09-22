import { Routes } from '@angular/router';
import { StoreFrontLayoutComponent } from './layouts/storeFrontLayout/storeFrontLayout.component';
import { HomePageComponent } from './pages/HomePage/HomePage.component';
import { GenderePAgeComponent } from './pages/GenderePAge/GenderePage.component';
import { ProductPageComponent } from './pages/ProductPage/ProductPage.component';
import { NotFoundPageComponent } from './pages/NotFoundPage/NotFoundPage.component';

export const storeRoutes: Routes = [
  {
    path: '',
    component: StoreFrontLayoutComponent,
    children: [
      {
        path: '',
        component: HomePageComponent,
      },
      {
        path: 'gender/:gender',
        component: GenderePAgeComponent,
      },
      {
        path: 'product/:id',
        component: ProductPageComponent,
      },
      {
        path: '**',
        component: NotFoundPageComponent,
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];

export default storeRoutes;
