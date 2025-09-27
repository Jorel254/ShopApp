import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/Auth.service';

@Component({
  selector: 'app-register-page',
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './RegisterPage.component.html',
  styleUrl: './RegisterPage.component.css',
})
export class RegisterPageComponent {
  formBuilder = inject(FormBuilder);
  authService = inject(AuthService);
  hasError = signal(false);
  router = inject(Router);

  registerForm: FormGroup = this.formBuilder.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
  });

  onSubmit() {
    console.log('submit');
    if (this.registerForm.invalid) {
      this.hasError.set(true);
      setTimeout(() => {
        this.hasError.set(false);
      }, 2000);
      return;
    }
    const { name, email, password, confirmPassword } = this.registerForm.value as {
      name: string;
      email: string;
      password: string;
      confirmPassword: string;
    };
    if (this.hasError()) {
      return;
    }
    if (password !== confirmPassword) {
      this.hasError.set(true);
      setTimeout(() => {
        this.hasError.set(false);
      }, 2000);
      return;
    }
    this.authService.register(name, email, password).subscribe((isRegistered) => {
      if (isRegistered) {
        this.router.navigateByUrl('/');
      }
      this.hasError.set(true);
      setTimeout(() => {
        this.hasError.set(false);
      }, 2000);
    });
  }
}
