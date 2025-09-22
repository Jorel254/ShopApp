import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'front-nav-bar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './NavBar.component.html',
  styleUrl: './NavBar.component.css',
})
export class NavBarComponent {}
