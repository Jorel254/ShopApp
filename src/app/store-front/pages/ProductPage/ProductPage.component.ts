import { Product } from '@/app/products/interfaces/Product';
import { ProductsService } from '@/app/products/services/Products.service';
import { Component, inject, ResourceRef, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ImageProductPipe } from '@/app/products/pipes/ImageProduct.pipe';

@Component({
  selector: 'app-product-page',
  imports: [CommonModule, ImageProductPipe],
  templateUrl: './ProductPage.component.html',
  styleUrl: './ProductPage.component.css',
})
export class ProductPageComponent {
  activatedRoute = inject(ActivatedRoute);
  productId = signal<string>(this.activatedRoute.snapshot.params['id']);
  productsService = inject(ProductsService);
  idImage = signal<number>(0);

  productResource: ResourceRef<Product> = rxResource({
    request: () => ({}),
    loader: ({}) => {
      return this.productsService.getProductById(this.productId());
    },
  } as any);

  changeIdImage(index: number) {
    this.idImage.set(index);
  }
}
