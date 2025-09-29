import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Gender, Product, ProductResponse } from '../interfaces/Product';
import { forkJoin, map, Observable, of, switchMap, tap } from 'rxjs';
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

  updateProdcutCache(id: string, product: Product) {
    this.productCache.set(id, product);
    this.productsCache.forEach((productResponse) => {
      productResponse.products = productResponse.products.map((currentProduct) =>
        currentProduct.id === id ? product : currentProduct
      );
    });
  }

  updateProduct(id: string, product: Product, images: FileList): Observable<Product> {
    if (product.images) {
      product.images = product.images.filter((image) => !image.includes('data:image/'));
    }
    return this.updateProductImages(images).pipe(
      map((imagesNames) => {
        return {
          ...product,
          images: [...(product.images ?? []), ...imagesNames],
        };
      }),
      switchMap((updatedProduct) => {
        return this.http
          .patch<Product>(`${environment.baseUrl}/products/${id}`, updatedProduct)
          .pipe(
            tap((product) => {
              console.log(product);
            }),
            tap((product) => {
              this.updateProdcutCache(id, product);
            })
          );
      })
    );
  }

  createProduct(product: Product, images: FileList): Observable<Product> {
    if (product.images) {
      product.images = product.images.filter((image) => !image.includes('data:image/'));
    }
    return this.updateProductImages(images).pipe(
      map((imagesNames) => {
        return {
          ...product,
          images: imagesNames,
        };
      }),
      switchMap((updatedProduct) => {
        return this.http.post<Product>(`${environment.baseUrl}/products`, updatedProduct).pipe(
          tap((product) => {
            console.log(product);
          }),
          tap((product) => {
            this.updateProdcutCache(product.id, product);
          })
        );
      })
    );
  }

  updateProductImages(images: FileList): Observable<string[]> {
    if (images.length === 0 || !images) {
      return of([]);
    }

    // Validar tamaño de imágenes (máximo 5MB por imagen)
    const maxSize = 5 * 1024 * 1024; // 5MB en bytes
    const invalidFiles = Array.from(images).filter((file) => file.size > maxSize);

    if (invalidFiles.length > 0) {
      throw new Error(
        `Las siguientes imágenes exceden el tamaño máximo de 5MB: ${invalidFiles
          .map((f) => f.name)
          .join(', ')}`
      );
    }

    const uploadObservable = Array.from(images).map((image) => this.updateProductImage(image));
    return forkJoin(uploadObservable);
  }
  updateProductImage(image: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', image);
    return this.http
      .post<{ fileName: string }>(`${environment.baseUrl}/files/product`, formData)
      .pipe(map((res: { fileName: string }) => res.fileName));
  }
}
