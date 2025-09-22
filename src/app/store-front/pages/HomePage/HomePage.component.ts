import { Component, inject, ResourceRef } from '@angular/core';
import { CardProductComponent } from '@store-front/components/CardProduct/CardProduct.component';
import { ProductsService } from '@products/services/Products.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { ProductResponse } from '@products/interfaces/Product';
import { PaginationComponent } from '@shared/components/Pagination/Pagination.component';
import { PaginationService } from '@shared/components/Pagination/PaginationService.service';
@Component({
  selector: 'app-home-page',
  imports: [CardProductComponent, PaginationComponent],
  templateUrl: './HomePage.component.html',
  styleUrl: './HomePage.component.css',
})
export class HomePageComponent {
  productsService = inject(ProductsService);
  paginationService = inject(PaginationService);
  currentPage = this.paginationService.currentPage;
  productsResource: ResourceRef<ProductResponse> = rxResource({
    request: () => ({ page: this.currentPage() }),
    loader: ({ request }: { request: { page: number } }) => {
      return this.productsService.getProducts({
        offset: (request.page - 1) * 12,
      });
    },
  } as any);
}
