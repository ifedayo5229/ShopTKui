import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ShopUserService } from 'src/app/services/shop-user/shop-user.service';
import { ResetPasswordRequest, ForgotPasswordRequest } from 'src/app/models/shop-user';
import { isApiSuccess } from 'src/app/models/api-response';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm: FormGroup;
  isLoading = false;
  hidePassword = true;
  hideConfirmPassword = true;
  currentYear = new Date().getFullYear();
  prefilledEmail = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private shopUserService: ShopUserService
  ) {
    this.resetPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      token: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    // Get email from session storage (set by forgot password page)
    this.prefilledEmail = sessionStorage.getItem('resetEmail') || '';
    if (this.prefilledEmail) {
      this.resetPasswordForm.patchValue({ email: this.prefilledEmail });
    }
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const newPassword = control.get('newPassword');
    const confirmPassword = control.get('confirmPassword');
    
    if (newPassword && confirmPassword && newPassword.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    return null;
  }

  onSubmit(): void {
    if (!this.resetPasswordForm.valid) {
      return;
    }

    this.isLoading = true;

    const request: ResetPasswordRequest = {
      email: this.resetPasswordForm.value.email,
      token: this.resetPasswordForm.value.token,
      newPassword: this.resetPasswordForm.value.newPassword,
      confirmPassword: this.resetPasswordForm.value.confirmPassword
    };

    this.shopUserService.resetPassword(request).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (isApiSuccess(response)) {
          // Clear stored email
          sessionStorage.removeItem('resetEmail');
          this.toastr.success('Password reset successfully!', 'Success');
          this.router.navigate(['/login']);
        } else {
          this.toastr.error(response.message || 'Failed to reset password', 'Error');
        }
      },
      error: (err) => {
        this.isLoading = false;
        const errorMessage = err.error?.message || 'Failed to reset password. Please check your code and try again.';
        this.toastr.error(errorMessage, 'Error');
      }
    });
  }

  backToLogin(): void {
    this.router.navigate(['/login']);
  }

  resendCode(): void {
    const email = this.resetPasswordForm.value.email;
    if (!email) {
      this.toastr.warning('Please enter your email first', 'Warning');
      return;
    }

    const request: ForgotPasswordRequest = {
      email,
      resetUrl: `${window.location.origin}/reset-password`
    };

    this.shopUserService.forgotPassword(request).subscribe({
      next: (response) => {
        if (isApiSuccess(response)) {
          this.toastr.success('New reset link sent to your email', 'Email Sent');
        } else {
          this.toastr.error(response.message || 'Failed to send code', 'Error');
        }
      },
      error: (err) => {
        this.toastr.error('Failed to send code', 'Error');
      }
    });
  }
}

