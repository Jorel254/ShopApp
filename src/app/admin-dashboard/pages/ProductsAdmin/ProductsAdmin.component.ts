import { ProductResponse } from '@/app/products/interfaces/Product';
import { ProductsService } from '@/app/products/services/Products.service';
import { PaginationService } from '@/app/shared/components/Pagination/PaginationService.service';
import { Component, inject, ResourceRef, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ProductsTableComponent } from '@products/components/ProductsTable/ProductsTable.component';
import { PaginationComponent } from '@/app/shared/components/Pagination/Pagination.component';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-products-admin',
  imports: [ProductsTableComponent, PaginationComponent, RouterLink],
  templateUrl: './ProductsAdmin.component.html',
  styleUrl: './ProductsAdmin.component.css',
})
export class ProductsAdminComponent {
  productsService = inject(ProductsService);
  paginationService = inject(PaginationService);

  limit = signal<number>(10);

  currentPage = this.paginationService.currentPage;

  productsResource: ResourceRef<ProductResponse> = rxResource({
    request: () => ({ page: this.currentPage(), limit: this.limit() }),
    loader: ({ request }: { request: { page: number, limit: number } }) => {
      return this.productsService.getProducts({
        offset: (request.page - 1) * 12,
        limit: request.limit,
      });
    },
  } as any);
}
