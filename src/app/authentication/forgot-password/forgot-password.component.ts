import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ShopUserService } from 'src/app/services/shop-user/shop-user.service';
import { ForgotPasswordRequest } from 'src/app/models/shop-user';
import { isApiSuccess } from 'src/app/models/api-response';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  forgotPasswordForm: FormGroup;
  isLoading = false;
  emailSent = false;
  currentYear = new Date().getFullYear();

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private shopUserService: ShopUserService
  ) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {}

  sendResetMail(): void {
    if (!this.forgotPasswordForm.valid) {
      return;
    }

    this.isLoading = true;
    const email = this.forgotPasswordForm.value.email;
    
    // Construct the reset URL based on current origin
    const resetUrl = `${window.location.origin}/reset-password`;

    const request: ForgotPasswordRequest = {
      email,
      resetUrl
    };

    this.shopUserService.forgotPassword(request).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (isApiSuccess(response)) {
          this.emailSent = true;
          this.toastr.success('Check your email for the reset link', 'Email Sent');
          // Store email for reset password page
          sessionStorage.setItem('resetEmail', email);
          // Redirect to reset password page after 2 seconds
          setTimeout(() => {
            this.router.navigate(['/reset-password']);
          }, 2000);
        } else {
          this.toastr.error(response.message || 'Failed to send reset email', 'Error');
        }
      },
      error: (err) => {
        this.isLoading = false;
        const errorMessage = err.error?.message || 'Failed to send reset email. Please try again.';
        this.toastr.error(errorMessage, 'Error');
      }
    });
  }

  backToLogin(): void {
    this.router.navigate(['/login']);
  }
}

