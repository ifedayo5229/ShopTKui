import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HTTP_INTERCEPTORS,
  HttpErrorResponse
} from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../environments/environment';
import { TenantContextService } from '../services/tenant-context/tenant-context.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private tenantContext: TenantContextService, 
    private router: Router
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const isApiRequest = request.url.startsWith(environment.apiUrl);
    const token = this.tenantContext.getAccessToken();

    // Skip auth header for login and register endpoints
    const isAuthEndpoint = request.url.includes('/auth/login') || 
                           request.url.includes('/auth/register') ||
                           request.url.includes('/auth/refresh-token') ||
                           request.url.includes('/auth/forgot-password') ||
                           request.url.includes('/auth/reset-password');

    if (token && isApiRequest && !isAuthEndpoint) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });

      // Add tenant context header if available
      const tenantId = this.tenantContext.currentTenant?.tenantId;
      if (tenantId) {
        request = request.clone({
          setHeaders: {
            'X-Tenant-Id': tenantId
          }
        });
      }

      // Add current shop header if available
      const shopId = this.tenantContext.currentShop?.id;
      if (shopId) {
        request = request.clone({
          setHeaders: {
            'X-Shop-Id': shopId.toString()
          }
        });
      }
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          // Token expired or invalid
          this.tenantContext.clearContext();
          this.router.navigate(['/login']);
        } else if (error.status === 403) {
          // Forbidden - user doesn't have permission
          this.router.navigate(['/home/dashboard']);
        }
        return throwError(() => error);
      })
    );
  }
}

export const AuthInterceptorProvider = { 
  provide: HTTP_INTERCEPTORS, 
  useClass: AuthInterceptor, 
  multi: true 
};