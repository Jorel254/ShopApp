import { Component, input } from '@angular/core';
import { Product } from '@products/interfaces/Product';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ImageProductPipe } from '@products/pipes/ImageProduct.pipe';
@Component({
  selector: 'app-card-product',
  imports: [RouterLink, RouterLinkActive, ImageProductPipe],
  templateUrl: './CardProduct.component.html',
  styleUrl: './CardProduct.component.css',
})
export class CardProductComponent {
  product = input<Product>();
}
