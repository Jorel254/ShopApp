import { Product } from '@/app/products/interfaces/Product';
import { ProductsService } from '@/app/products/services/Products.service';
import { Component, effect, inject, ResourceRef } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { map } from 'rxjs';
import { ProductDetailsComponent } from "./ProductDetails/ProductDetails.component";
@Component({
  selector: 'app-product-admin',
  imports: [CommonModule, ProductDetailsComponent],
  templateUrl: './ProductAdmin.component.html',
  styleUrl: './ProductAdmin.component.css',
})
export class ProductAdminComponent {
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);

  productId = toSignal(this.activatedRoute.params.pipe(map(({ id }) => id)));

  productsService = inject(ProductsService);

  productResource: ResourceRef<Product> = rxResource({
    request: () => ({}),
    loader: () => {
      return this.productsService.getProductById(this.productId());
    },
  } as any);

  redirectEffect = effect(() => {
    if (this.productResource.error()) {
      this.router.navigate(['/admin/products']);
    }
  });
}
