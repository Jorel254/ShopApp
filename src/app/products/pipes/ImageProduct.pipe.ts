import { Pipe, type PipeTransform } from '@angular/core';
import { environment } from '@/environments/environment';
const baseUrl = environment.baseUrl;
@Pipe({
  name: 'appImageProduct',
})
export class ImageProductPipe implements PipeTransform {
  transform(value: string | string[] | undefined | null, index: number = 0): unknown {
    if (!value || value.length === 0) {
      return '/assets/images/no-image.jpg';
    }
    if (Array.isArray(value)) {
      const imageUrl = value[index];
      if (!imageUrl) {
        return '/assets/images/no-image.jpg';
      }
      // Si es una imagen base64 (data URL), devolverla directamente
      if (imageUrl.includes('data:image/')) {
        return imageUrl;
      }
      // Si es una imagen del servidor, construir la URL
      return `${baseUrl}/files/product/${imageUrl}`;
    } else if (typeof value === 'string') {
      if (value.includes('data:image/')) {
        return value;
      }
      return `${baseUrl}/files/product/${value}`;
    }
    return '/assets/images/no-image.jpg';
  }
}
