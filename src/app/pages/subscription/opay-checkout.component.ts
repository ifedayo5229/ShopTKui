import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PaymentService } from 'src/app/services/payment/payment.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { OPayInitializeRequest } from 'src/app/models/payment';
import { environment } from 'src/app/environments/environment';
import { isApiSuccess, getApiData } from 'src/app/models/api-response';

@Component({
  selector: 'app-opay-checkout',
  template: `
    <div class="checkout-container">
      <div class="checkout-card">
        <!-- Loading State -->
        <div *ngIf="isLoading" class="loading-state">
          <mat-spinner diameter="48"></mat-spinner>
          <h2>Preparing OPay Checkout...</h2>
          <p>You'll be redirected to OPay to complete your payment.</p>
        </div>

        <!-- Error State -->
        <div *ngIf="!isLoading && error" class="error-state">
          <mat-icon>error</mat-icon>
          <h2>Unable to Initialize Payment</h2>
          <p>{{ error }}</p>
          <div class="error-actions">
            <button mat-stroked-button (click)="goBack()">
              <mat-icon>arrow_back</mat-icon>
              Go Back
            </button>
            <button mat-raised-button color="primary" (click)="retry()">
              <mat-icon>refresh</mat-icon>
              Try Again
            </button>
          </div>
        </div>

        <!-- Ready to Redirect State -->
        <div *ngIf="!isLoading && !error && cashierUrl" class="ready-state">
          <mat-icon class="opay-icon">account_balance_wallet</mat-icon>
          <h2>Ready to Pay with OPay</h2>
          <p class="amount">{{ currencySymbol }}{{ amount | number:'1.2-2' }}</p>
          <p class="description">{{ planName }} Plan - Monthly Subscription</p>
          
          <button mat-raised-button color="primary" class="pay-btn" (click)="redirectToOPay()">
            <mat-icon>launch</mat-icon>
            Continue to OPay
          </button>
          
          <p class="redirect-note">
            You will be redirected to OPay's secure payment page.
          </p>
          
          <button mat-button class="cancel-btn" (click)="goBack()">
            Cancel Payment
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .checkout-container {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: calc(100vh - 120px);
      padding: 24px;
      background: var(--bg-secondary, #f8f9fa);
    }

    .checkout-card {
      text-align: center;
      max-width: 420px;
      width: 100%;
      background: var(--surface, #fff);
      border-radius: 16px;
      padding: 48px 32px;
      box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
    }

    .loading-state {
      .mat-spinner {
        margin: 0 auto 24px;
      }

      h2 {
        font-size: 20px;
        font-weight: 600;
        margin: 0 0 8px;
        color: var(--text-primary, #1a1a2e);
      }

      p {
        color: var(--text-secondary, #6b7280);
        margin: 0;
      }
    }

    .error-state {
      mat-icon {
        font-size: 64px;
        width: 64px;
        height: 64px;
        color: #ef4444;
        margin-bottom: 16px;
      }

      h2 {
        font-size: 20px;
        font-weight: 600;
        margin: 0 0 8px;
        color: var(--text-primary, #1a1a2e);
      }

      p {
        color: #ef4444;
        margin-bottom: 24px;
      }

      .error-actions {
        display: flex;
        gap: 12px;
        justify-content: center;

        button {
          mat-icon {
            font-size: 18px;
            width: 18px;
            height: 18px;
            color: inherit;
          }
        }
      }
    }

    .ready-state {
      .opay-icon {
        font-size: 64px;
        width: 64px;
        height: 64px;
        color: #1dc286;
        margin-bottom: 16px;
      }

      h2 {
        font-size: 20px;
        font-weight: 600;
        margin: 0 0 16px;
        color: var(--text-primary, #1a1a2e);
      }

      .amount {
        font-size: 36px;
        font-weight: 700;
        color: var(--text-primary, #1a1a2e);
        margin: 0 0 8px;
      }

      .description {
        color: var(--text-secondary, #6b7280);
        margin: 0 0 24px;
      }

      .pay-btn {
        width: 100%;
        height: 48px;
        font-size: 16px;
        font-weight: 600;
        background: #1dc286;
        color: white;
        border-radius: 8px;
        margin-bottom: 12px;

        mat-icon {
          margin-right: 8px;
        }

        &:hover {
          background: #17a873;
        }
      }

      .redirect-note {
        font-size: 13px;
        color: var(--text-secondary, #6b7280);
        margin: 0 0 16px;
      }

      .cancel-btn {
        color: var(--text-secondary, #6b7280);

        &:hover {
          color: #ef4444;
        }
      }
    }
  `]
})
export class OPayCheckoutComponent implements OnInit {
  isLoading = true;
  error: string = '';
  
  planId: number = 0;
  planName: string = '';
  amount: number = 0;
  reference: string = '';
  cashierUrl: string = '';
  currencySymbol: string = '$';

  private userEmail: string = '';
  private userName: string = '';
  private userPhone: string = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private paymentService: PaymentService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.loadUserInfo();
    this.parseQueryParams();
    this.initializeOPayPayment();
  }

  private loadUserInfo(): void {
    const session = this.authService.getSession();
    if (session && session.profile) {
      this.userEmail = session.profile.email || '';
      this.userName = `${session.profile.firstName || ''} ${session.profile.lastName || ''}`.trim() || session.profile.email || '';
      this.userPhone = '';
    }
  }

  private parseQueryParams(): void {
    const params = this.route.snapshot.queryParams;
    this.planId = parseInt(params['planId']) || 0;
    this.amount = parseFloat(params['amount']) || 0;
    this.reference = params['reference'] || this.paymentService.generateReference('OPAY');
    this.planName = params['planName'] || 'Subscription';

    if (!this.planId || !this.amount) {
      this.isLoading = false;
      this.error = 'Invalid payment parameters. Please try again from the upgrade page.';
    }
  }

  private initializeOPayPayment(): void {
    if (this.error) return;

    // Build return URL - where OPay will redirect after payment
    const returnUrl = `${window.location.origin}/home/subscription/payment-callback`;

    const request: OPayInitializeRequest = {
      amount: this.amount,
      currency: 'NGN',
      email: this.userEmail,
      customerName: this.userName,
      customerPhone: this.userPhone,
      planId: this.planId,
      paymentType: 'subscription'
    };

    this.paymentService.initializeOPayPayment(request).subscribe({
      next: (response) => {
        this.isLoading = false;
        const data = getApiData(response);
        if (isApiSuccess(response) && data) {
          this.cashierUrl = data.cashierUrl;
          this.reference = data.reference;
          
          // Optional: Auto-redirect after short delay
          // setTimeout(() => this.redirectToOPay(), 2000);
        } else {
          this.error = response.message || 'Failed to initialize OPay payment';
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.error = 'Unable to connect to payment service. Please try again.';
        console.error('OPay init error:', err);
      }
    });
  }

  redirectToOPay(): void {
    if (this.cashierUrl) {
      // Store reference for verification
      sessionStorage.setItem('opay_reference', this.reference);
      sessionStorage.setItem('opay_planId', this.planId.toString());
      
      // Redirect to OPay cashier page
      window.location.href = this.cashierUrl;
    }
  }

  retry(): void {
    this.isLoading = true;
    this.error = '';
    this.reference = this.paymentService.generateReference('OPAY');
    this.initializeOPayPayment();
  }

  goBack(): void {
    this.router.navigate(['/home/subscription/upgrade']);
  }
}
