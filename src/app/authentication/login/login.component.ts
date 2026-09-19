import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TenantContextService } from 'src/app/services/tenant-context/tenant-context.service';
import { ShopUserService } from 'src/app/services/shop-user/shop-user.service';
import { LoginRequest, UserRole } from 'src/app/models/shop-user';
import { isApiSuccess, getApiData } from 'src/app/models/api-response';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isLoading = false;
  hidePassword = true;
  today = new Date();
  currentYear = new Date().getFullYear();

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private tenantContext: TenantContextService,
    private shopUserService: ShopUserService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });
  }

  ngOnInit(): void {
    // Check if already logged in
    if (this.tenantContext.isLoggedIn()) {
      this.router.navigate(['/home/dashboard']);
    }

    // Load remembered email if exists
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail) {
      this.loginForm.patchValue({ email: rememberedEmail, rememberMe: true });
    }
  }

  onLogin(): void {
    if (!this.loginForm.valid) {
      return;
    }

    this.isLoading = true;
    
    const request: LoginRequest = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password
    };

    this.shopUserService.login(request).subscribe({
      next: (response) => {
        this.isLoading = false;
        const data = getApiData(response);
        if (isApiSuccess(response) && data) {
          // Save token and context
          this.tenantContext.setAccessToken(
            data.accessToken, 
            data.refreshToken
          );
          this.tenantContext.setTenantContext(
            data.tenant,
            data.shops,
            data.user
          );

          // Handle remember me
          if (this.loginForm.value.rememberMe) {
            localStorage.setItem('rememberedEmail', this.loginForm.value.email);
          } else {
            localStorage.removeItem('rememberedEmail');
          }

          this.toastr.success('Welcome back!', 'Login Successful');
          
          // Route SuperAdmin to admin dashboard, others to regular dashboard
          if (data.user.role === UserRole.SuperAdmin) {
            this.router.navigate(['/home/admin']);
          } else {
            this.router.navigate(['/home/dashboard']);
          }
        } else {
          this.toastr.error(response.message || 'Login failed', 'Error');
        }
      },
      error: (err) => {
        this.isLoading = false;
        const errorMessage = err.error?.message || 'Invalid credentials. Please try again.';
        this.toastr.error(errorMessage, 'Login Failed');
      }
    });
  }
}
