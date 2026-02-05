import { CanActivateFn } from '@angular/router';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router, private  authService: AuthService) {
    
    }
  
  canActivate(
    
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      debugger
        const currentUser = this.authService.isTokenValid();
        if (currentUser) {
            return true;
        }
    
        this.router.navigate(['']); //This is login page
        return false;
    }
}