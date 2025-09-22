import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Product, ProductResponse } from '../interfaces/Product';
import { Observable, of, tap } from 'rxjs';
import { environment } from '@/environments/environment';

export interface ProductOptions {
  limit?: number;
  gender?: string;
  offset?: number;
}
@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  http = inject(HttpClient);

  private readonly productsCache = new Map<string, ProductResponse>();
  private readonly productCache = new Map<string, Product>();

  getProducts(options: ProductOptions): Observable<ProductResponse> {
    const { limit = 12, gender = '', offset = 0 } = options;
    const cacheKey = `${gender}-${limit}-${offset}`;
    if (this.productsCache.has(cacheKey)) {
      return of(this.productsCache.get(cacheKey)!);
    }
    return this.http
      .get<ProductResponse>(`${environment.baseUrl}/products`, {
        params: {
          limit,
          gender,
          offset,
        },
      })
      .pipe(
        tap((products) => {
          console.log(products);
        }),
        tap((products) => {
          this.productsCache.set(cacheKey, products);
        })
      );
  }
  getProductById(id: string): Observable<Product> {
    if (this.productCache.has(id)) {
      return of(this.productCache.get(id)!);
    }
    return this.http.get<Product>(`${environment.baseUrl}/products/${id}`).pipe(
      tap((product) => {
        console.log(product);
      }),
      tap((product) => {
        this.productCache.set(id, product);
      })
    );
  }
}
