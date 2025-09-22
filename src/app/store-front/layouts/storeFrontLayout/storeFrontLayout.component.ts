import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavBarComponent } from '@store-front/components/NavBar/NavBar.component';

@Component({
  selector: 'app-store-front-layout',
  imports: [RouterOutlet, NavBarComponent],
  templateUrl: './storeFrontLayout.component.html',
  styleUrl: './storeFrontLayout.component.css',
})
export class StoreFrontLayoutComponent {}
