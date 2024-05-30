import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { first, Observable, switchMap } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

@Injectable()
export class AuthHeaderInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return this.authService.isLoggedIn$.pipe(
      first(),
      switchMap((isLoggedIn) => {
        if (isLoggedIn === false || this.isThirdPartyRequest(request.url)) {
          return next.handle(request);
        }

        return this.authService.user$.pipe(
          first(Boolean),
          switchMap(({ token }) => {
            const headers = request.headers.append(
              'Authorization',
              `Bearer ${token}`
            );
            return next.handle(request.clone({ headers }));
          })
        );
      })
    );
  }

  private isThirdPartyRequest(url: string): boolean {
    return url.startsWith(environment.API_BASE_URL) === false;
  }
}