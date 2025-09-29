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
  previousImages = signal<string[]>([]);
  isSaved = signal<boolean>(false);
  ngOnInit(): void {
    this.setFormValues(this.product() as any);
    // Asegurar que idImage esté en 0 si hay imágenes
    if (this.product()?.images && this.product()!.images.length > 0) {
      this.idImage.set(0);
    }
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
      this.productsService.createProduct(productLike as Product, this.selectedFiles!).subscribe({
        next: (product) => {
          console.log(product);
          this.router.navigate(['/admin/product', product.id]);
          this.isSaved.set(true);
          setTimeout(() => {
            this.isSaved.set(false);
          }, 3000);
        },
        error: (error) => {
          console.error('Error al crear el producto:', error);
          alert(`Error al crear el producto: ${error.message || error}`);
        }
      });
    } else {
      this.productsService
        .updateProduct(this.product()?.id ?? '', productLike as Product, this.selectedFiles!)
        .subscribe({
          next: (product) => {
            console.log(product);
            this.isSaved.set(true);
            setTimeout(() => {
              this.isSaved.set(false);
            }, 3000);
          },
          error: (error) => {
            console.error('Error al actualizar el producto:', error);
            alert(`Error al actualizar el producto: ${error.message || error}`);
          }
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
    // Procesar las imágenes seleccionadas para preview
    const files = Array.from(this.selectedFiles ?? []);
    const previewImages: string[] = [];
    let completedReads = 0;

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        previewImages.push(e.target.result);
        completedReads++;

        // Cuando todas las imágenes se hayan leído, actualizar el producto
        if (completedReads === files.length) {
          this.updateProductImages(previewImages);
        }
      };
      reader.readAsDataURL(file);
    });
  }

  // Método auxiliar para actualizar las imágenes del producto
  private updateProductImages(newImages: string[]) {
    const currentProduct = this.product();
    if (currentProduct) {
      const previousImagesCount = currentProduct.images?.length || 0;
      // Crear una nueva referencia del array de imágenes
      currentProduct.images = [...(currentProduct.images || []), ...newImages];

      // Si no había imágenes previas, mostrar la primera imagen nueva
      if (previousImagesCount === 0) {
        this.idImage.set(0);
      } else {
        // Si había imágenes previas, mostrar la primera imagen nueva
        this.idImage.set(previousImagesCount);
      }
    }
  }
}
