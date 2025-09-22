import { Component, inject, ResourceRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '@/app/products/services/Products.service';
import { ProductResponse } from '@/app/products/interfaces/Product';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { CardProductComponent } from '@store-front/components/CardProduct/CardProduct.component';
import { map } from 'rxjs';
import { PaginationComponent } from '@shared/components/Pagination/Pagination.component';
import { PaginationService } from '@/app/shared/components/Pagination/PaginationService.service';

@Component({
  selector: 'app-gendere-page',
  imports: [CardProductComponent, PaginationComponent],
  templateUrl: './GenderePage.component.html',
  styleUrl: './GenderePage.component.css',
})
export class GenderePAgeComponent {
  activatedRoute = inject(ActivatedRoute);
  gender = toSignal(this.activatedRoute.params.pipe(map(({ gender }) => gender))); // Se usa toSignal para que el valor se actualice cuando el valor de la ruta cambie
  productsService = inject(ProductsService);
  paginationService = inject(PaginationService);
  currentPage = this.paginationService.currentPage;
  productsResource: ResourceRef<ProductResponse> = rxResource({
    request: () => ({ gender: this.gender(), page: this.currentPage() }),
    loader: ({ request }: { request: { gender: string, page: number } }) => {
      return this.productsService.getProducts({
        limit: 12,
        offset: (request.page - 1) * 12,
        gender: request.gender,
      });
    },
  } as any);
}
