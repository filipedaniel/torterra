import { HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { AuthService } from 'src/app/services/auth.service';
import { Injectable, Injector } from '@angular/core';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private injector: Injector) {}

  intercept(request: HttpRequest<any>, next: HttpHandler) {
    const authService = this.injector.get(AuthService);

    const token = authService.getToken();
    // if (token) {
    request = request.clone({
      setHeaders: {
        Authorization: 'Bearer ' + token
      }
    });
    return next.handle(request);
    // } else {
    //   return next.handle(req);
    // }
  }
}
