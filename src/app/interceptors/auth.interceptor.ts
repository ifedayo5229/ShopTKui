import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HTTP_INTERCEPTORS
} from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { TokenService } from '../services/token/token.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

 
  constructor(private tokenService: TokenService, private router: Router) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> 
  {
    debugger
    
    const requestForApis = request.url.startsWith(environment.apiUrl);
    const isLoggedIn = this.tokenService.isLoggedIn();

   // console.log('inside intercept');
    //console.log(`request is ${JSON.stringify(request.body)}`);
    if(!isLoggedIn){this.router.navigate(['signin']);}

    if (isLoggedIn && requestForApis) {
      let session = this.tokenService.getSession();
      if (session){
        request = request.clone({ headers: request.headers.set('Authorization', `Bearer ${session.accessToken}`) });
      }
      
    }
    return next.handle(request);
  }
}
export const AuthInterceptorProvider = { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true };