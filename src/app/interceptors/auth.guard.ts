import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { TenantContextService } from '../services/tenant-context/tenant-context.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router, 
    private tenantContext: TenantContextService
  ) {}
  
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    
    if (this.tenantContext.isLoggedIn()) {
      // Check for required roles if specified in route data
      const requiredRoles = next.data['roles'] as string[] | undefined;
      
      if (requiredRoles && requiredRoles.length > 0) {
        const userRole = this.tenantContext.currentUser?.role;
        if (!userRole || !requiredRoles.includes(userRole)) {
          this.router.navigate(['/home/dashboard']);
          return false;
        }
      }
      
      return true;
    }

    // Store the attempted URL for redirecting after login
    const returnUrl = state.url;
    this.router.navigate(['/login'], { queryParams: { returnUrl } });
    return false;
  }
}

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(
    private router: Router,
    private tenantContext: TenantContextService
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const requiredRoles = next.data['roles'] as string[];
    const userRole = this.tenantContext.currentUser?.role;

    if (!userRole || !requiredRoles?.includes(userRole)) {
      this.router.navigate(['/home/dashboard']);
      return false;
    }

    return true;
  }
}