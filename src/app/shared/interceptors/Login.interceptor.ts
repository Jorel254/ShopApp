import { HttpEvent, HttpEventType, HttpInterceptorFn } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export const loginInterceptor: HttpInterceptorFn = (req, next): Observable<HttpEvent<unknown>> => {
  return next(req).pipe(
    tap((event) => {
      if (event.type === HttpEventType.Response) {
        console.log(req.url, 'returned a response with status', event.status);
      }
    })
  );
};
