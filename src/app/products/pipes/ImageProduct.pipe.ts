import { Pipe, type PipeTransform } from '@angular/core';
import { environment } from '@/environments/environment';
const baseUrl = environment.baseUrl;
@Pipe({
  name: 'appImageProduct',
})
export class ImageProductPipe implements PipeTransform {
  transform(value: string | string[] | undefined, index: number = 0): unknown {
    if (!value) {
      return './assets/images/no-image.png';
    }
    if (Array.isArray(value)) {
      return `${baseUrl}/files/product/${value[index]}`;
    } else if (typeof value === 'string') {
      return `${baseUrl}/files/product/${value}`;
    }
    return './assets/images/no-image.png';
  }
}
