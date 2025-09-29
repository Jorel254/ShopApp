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
      return `${baseUrl}/files/product/${value[index]}`;
    } else if (typeof value === 'string') {
      return `${baseUrl}/files/product/${value}`;
    }
    return '/assets/images/no-image.jpg';
  }
}
