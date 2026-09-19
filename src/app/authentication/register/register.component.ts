import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TenantContextService } from 'src/app/services/tenant-context/tenant-context.service';
import { ShopUserService } from 'src/app/services/shop-user/shop-user.service';
import { RegisterTenantRequest, RegisterShopRequest } from 'src/app/models/shop-user';
import { isApiSuccess, getApiData } from 'src/app/models/api-response';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  isLoading = false;
  hidePassword = true;
  hideConfirmPassword = true;
  currentStep = 1;
  currentYear = new Date().getFullYear();

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private tenantContext: TenantContextService,
    private shopUserService: ShopUserService
  ) {
    this.registerForm = this.fb.group({
      // Step 1: Account Info
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]],
      
      // Step 2: Business & Shops Info
      tenantName: ['', [Validators.required, Validators.minLength(2)]],
      shops: this.fb.array([this.createShopFormGroup()]), // Start with one shop
      agreeTerms: [false, [Validators.requiredTrue]]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  createShopFormGroup(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      address: ['']
    });
  }

  get shopsArray(): FormArray {
    return this.registerForm.get('shops') as FormArray;
  }

  addShop(): void {
    if (this.shopsArray.length < 5) { // Limit to 5 shops during registration
      this.shopsArray.push(this.createShopFormGroup());
    }
  }

  removeShop(index: number): void {
    if (this.shopsArray.length > 1) {
      this.shopsArray.removeAt(index);
    }
  }

  ngOnInit(): void {
    // Check if already logged in
    if (this.tenantContext.isLoggedIn()) {
      this.router.navigate(['/home/dashboard']);
    }
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ mismatch: true });
      return { mismatch: true };
    }
    return null;
  }

  get isStep1Valid(): boolean {
    const controls = ['firstName', 'lastName', 'email', 'password', 'confirmPassword'];
    return controls.every(name => {
      const control = this.registerForm.get(name);
      return control && control.valid;
    }) && this.registerForm.get('password')?.value === this.registerForm.get('confirmPassword')?.value;
  }

  get passwordStrength(): string {
    const password = this.registerForm.get('password')?.value || '';
    if (password.length < 6) return 'weak';
    
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;

    if (strength <= 1) return 'weak';
    if (strength <= 2) return 'medium';
    return 'strong';
  }

  get passwordStrengthText(): string {
    switch (this.passwordStrength) {
      case 'weak': return 'Weak';
      case 'medium': return 'Medium';
      case 'strong': return 'Strong';
      default: return '';
    }
  }

  nextStep(): void {
    if (this.isStep1Valid) {
      this.currentStep = 2;
    }
  }

  prevStep(): void {
    this.currentStep = 1;
  }

  onRegister(): void {
    if (!this.registerForm.valid) {
      // Mark all fields as touched to show errors
      Object.keys(this.registerForm.controls).forEach(key => {
        this.registerForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.isLoading = true;

    // Build shops array from form
    const shops: RegisterShopRequest[] = this.shopsArray.controls.map(shop => ({
      name: shop.get('name')?.value,
      address: shop.get('address')?.value || undefined
    }));

    const request: RegisterTenantRequest = {
      tenantName: this.registerForm.value.tenantName,
      email: this.registerForm.value.email,
      password: this.registerForm.value.password,
      firstName: this.registerForm.value.firstName,
      lastName: this.registerForm.value.lastName,
      phoneNumber: this.registerForm.value.phone || undefined,
      shops: shops
    };

    this.shopUserService.register(request).subscribe({
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

          this.toastr.success('Your account has been created successfully!', 'Welcome to ShopTK');
          this.router.navigate(['/home/dashboard']);
        } else {
          this.toastr.error(response.message || 'Registration failed', 'Error');
        }
      },
      error: (err) => {
        this.isLoading = false;
        const errorMessage = err.error?.message || 'Registration failed. Please try again.';
        this.toastr.error(errorMessage, 'Registration Failed');
      }
    });
  }
}
