import { Component, input } from '@angular/core';
import { Product } from '../../interfaces/Product';
import { ImageProductPipe } from '../../pipes/ImageProduct.pipe';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
@Component({
  selector: 'app-products-table',
  imports: [ImageProductPipe, RouterLink, RouterLinkActive, CurrencyPipe],
  templateUrl: './ProductsTable.component.html',
  styleUrl: './ProductsTable.component.css',
})
export class ProductsTableComponent {
  products = input<Product[]>([]);
}
