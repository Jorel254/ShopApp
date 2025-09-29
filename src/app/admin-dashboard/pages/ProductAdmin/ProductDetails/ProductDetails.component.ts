import { Gender, Product, Size } from '@/app/products/interfaces/Product';
import { Component, inject, input, OnInit, signal } from '@angular/core';
import { ImageProductPipe } from '@/app/products/pipes/ImageProduct.pipe';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormUtils } from '@utils/form-utils';
import { ProductsService } from '@/app/products/services/Products.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-details',
  imports: [ImageProductPipe, CommonModule, ReactiveFormsModule],
  templateUrl: './ProductDetails.component.html',
  styleUrl: './ProductDetails.component.css',
})
export class ProductDetailsComponent implements OnInit {
  fb = inject(FormBuilder);
  productsService = inject(ProductsService);
  router = inject(Router);
  product = input<Product>();
  idImage = signal<number>(0);
  isSaved = signal<boolean>(false);
  ngOnInit(): void {
    this.setFormValues(this.product() as any);
  }

  sizes: Size[] = [Size.Xs, Size.S, Size.M, Size.L, Size.Xl, Size.Xxl];

  productForm = this.fb.group({
    title: ['', [Validators.required]],
    slug: ['', [Validators.required, Validators.pattern(FormUtils.slugPattern)]],
    description: ['', [Validators.required]],
    price: ['', [Validators.required, Validators.min(0)]],
    stock: ['', [Validators.required, Validators.min(0)]],
    gender: ['men', [Validators.required]],
    tags: [''],
    sizes: [[] as Size[], [Validators.required]],
  });

  // Propiedad separada para manejar archivos
  selectedFiles: FileList | null = null;

  onSubmit() {
    console.log(this.productForm.value);
    console.log('Archivos seleccionados:', this.selectedFiles);
    const isValidForm = this.productForm.valid;
    this.productForm.markAllAsTouched();
    const formValue = this.productForm.value;
    if (!isValidForm) {
      return;
    }

    const productLike = {
      tags:
        formValue.tags
          ?.toLowerCase()
          .split(',')
          .map((tag) => tag.trim()) ?? [],
      sizes: formValue.sizes as Size[],
      images: this.product()?.images ?? [],
      price: formValue.price ? Number(formValue.price) : 0,
      stock: formValue.stock ? Number(formValue.stock) : 0,
      gender: formValue.gender as Gender,
      description: formValue.description ?? '',
      slug: formValue.slug ?? '',
      title: formValue.title ?? '',
    };
    console.log(productLike);
    if (this.product()?.id === 'new') {
      this.productsService.createProduct(productLike as Product).subscribe((product) => {
        console.log(product);
        this.router.navigate(['/admin/product', product.id]);
        this.isSaved.set(true);
        setTimeout(() => {
          this.isSaved.set(false);
        }, 3000);
      });
    } else {
      this.productsService
        .updateProduct(this.product()?.id ?? '', productLike as Product)
        .subscribe((product) => {
          console.log(product);
          this.isSaved.set(true);
          setTimeout(() => {
            this.isSaved.set(false);
          }, 3000);
        });
    }
  }
  setFormValues(formLike: Partial<Product>) {
    this.productForm.reset(formLike as any);
    this.productForm.patchValue({ tags: formLike.tags?.join(',') ?? '' });
    this.productForm.patchValue({ sizes: formLike.sizes ?? [] });
  }
  changeIdImage(index: number) {
    this.idImage.set(index);
  }
  onSizeClick(size: string) {
    const currentSizes = this.productForm.value.sizes;
    if (currentSizes?.includes(size as Size)) {
      this.productForm.patchValue({ sizes: currentSizes?.filter((s) => s !== size) ?? [] });
    } else {
      this.productForm.patchValue({ sizes: [...(currentSizes ?? []), size as Size] });
    }
  }

  // Método para manejar la selección de archivos
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.selectedFiles = input.files;
    }
  }
}
