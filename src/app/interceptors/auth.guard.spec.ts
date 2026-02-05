import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { AuthService } from '../services/auth/auth.service';

describe('AuthGuard', () => {
  let authGuard: AuthGuard;
  let authService: AuthService;
  let router: Router;

  beforeEach(() => {
    const routerMock = { navigate: jasmine.createSpy('navigate') };

    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: AuthService, useValue: { isTokenValid: () => true } },
        { provide: Router, useValue: routerMock }
      ]
    });

    authGuard = TestBed.inject(AuthGuard);
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);

    // Spy on the `isTokenValid` method
    spyOn(authService, 'isTokenValid').and.returnValue(true);
  });

  it('should be created', () => {
    expect(authGuard).toBeTruthy();
  });

  it('should allow activation if token is valid', () => {
    (authService.isTokenValid as jasmine.Spy).and.returnValue(true);
    const canActivate = authGuard.canActivate(null as any, null as any);
    expect(canActivate).toBeTrue();
  });

  it('should navigate to login if token is invalid', () => {
    (authService.isTokenValid as jasmine.Spy).and.returnValue(false);
    const canActivate = authGuard.canActivate(null as any, null as any);
    expect(canActivate).toBeFalse();
    expect(router.navigate).toHaveBeenCalledWith(['']);
  });
});
