import { AuthService } from '@/app/auth/services/Auth.service';
import { Component, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-admin-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './AdminLayout.component.html',
  styleUrl: './AdminLayout.component.css',
})
export class AdminLayoutComponent {
  authService = inject(AuthService);
  user = computed(() => this.authService.user());
}
