import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Gender, Product, ProductResponse } from '../interfaces/Product';
import { Observable, of, tap } from 'rxjs';
import { environment } from '@/environments/environment';
import { User } from '@auth/interfaces/User';

export interface ProductOptions {
  limit?: number;
  gender?: string;
  offset?: number;
}
const defaultProduct: Product = {
  id: 'new',
  title: '',
  price: 0,
  description: '',
  slug: '',
  stock: 0,
  sizes: [],
  gender: Gender.Men,
  tags: [],
  images: [],
  user: {} as User,
};
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
    if (id === 'new') {
      return of(defaultProduct);
    }
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
  getProductBySlug(slug: string): Observable<Product> {
    if (this.productCache.has(slug)) {
      return of(this.productCache.get(slug)!);
    }
    return this.http.get<Product>(`${environment.baseUrl}/products/${slug}`).pipe(
      tap((product) => {
        this.productCache.set(slug, product);
      })
    );
  }

  updateProduct(id: string, product: Product): Observable<Product> {
    return this.http.patch<Product>(`${environment.baseUrl}/products/${id}`, product).pipe(
      tap((product) => {
        console.log(product);
      }),
      tap((product) => {
        this.updateProdcutCache(id, product);
      })
    );
  }

  updateProdcutCache(id: string, product: Product) {
    this.productCache.set(id, product);
    this.productsCache.forEach((productResponse) => {
      productResponse.products = productResponse.products.map((currentProduct) =>
        currentProduct.id === id ? product : currentProduct
      );
    });
  }

  createProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(`${environment.baseUrl}/products`, product).pipe(
      tap((product) => {
        this.updateProdcutCache(product.id, product);
      })
    );
  }
}
