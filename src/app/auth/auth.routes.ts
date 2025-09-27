import { Routes } from '@angular/router';
import { LoginPageComponent } from './pages/LoginPage/LoginPage.component';
import { RegisterPageComponent } from './pages/RegisterPage/RegisterPage.component';
import { AuthLayoutComponent } from './layouts/AuthLayout/AuthLayout.component';

export const routes: Routes = [
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      {
        path: 'login',
        component: LoginPageComponent,
      },
      {
        path: 'register',
        component: RegisterPageComponent,
      },
      {
        path: '**',
        redirectTo: 'login',
      },
    ],
  },
];
