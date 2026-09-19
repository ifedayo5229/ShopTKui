import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PaymentService } from 'src/app/services/payment/payment.service';
import { PaymentGateway } from 'src/app/models/payment';
import { isApiSuccess, getApiData } from 'src/app/models/api-response';

@Component({
  selector: 'app-payment-callback',
  template: `
    <div class="callback-container">
      <div class="callback-card">
        <mat-spinner *ngIf="isVerifying" diameter="48"></mat-spinner>
        
        <div *ngIf="isVerifying" class="verifying-text">
          <h2>Verifying Payment...</h2>
          <p>Please wait while we confirm your payment.</p>
        </div>

        <div *ngIf="!isVerifying && error" class="error-state">
          <mat-icon>error</mat-icon>
          <h2>Payment Verification Failed</h2>
          <p>{{ error }}</p>
          <button mat-raised-button color="primary" (click)="retry()">
            Try Again
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .callback-container {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: calc(100vh - 120px);
      padding: 24px;
    }

    .callback-card {
      text-align: center;
      max-width: 400px;
      background: var(--surface);
      border-radius: 16px;
      padding: 48px 32px;
      box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
    }

    .verifying-text {
      margin-top: 24px;

      h2 {
        font-size: 20px;
        font-weight: 600;
        margin: 0 0 8px;
        color: var(--text-primary);
      }

      p {
        color: var(--text-secondary);
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
        color: var(--text-primary);
      }

      p {
        color: #ef4444;
        margin-bottom: 24px;
      }
    }
  `]
})
export class PaymentCallbackComponent implements OnInit {
  isVerifying = true;
  error: string = '';
  private planId: number = 0;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private paymentService: PaymentService
  ) { }

  ngOnInit(): void {
    this.verifyPayment();
  }

  private verifyPayment(): void {
    // Get query params - different gateways send different params
    const params = this.route.snapshot.queryParams;

    // Recover planId from query params or localStorage
    this.planId = +(params['planId'] || localStorage.getItem('pendingPlanId') || '0');
    localStorage.removeItem('pendingPlanId');

    // Paystack sends: reference, trxref
    // Flutterwave sends: tx_ref, transaction_id, status
    // Stripe sends: payment_intent, payment_intent_client_secret
    // OPay sends: orderNo, reference, status

    let gateway: PaymentGateway;
    let reference: string;
    let transactionId: string | undefined;

    if (params['orderNo'] && params['status']) {
      // OPay callback
      gateway = 'opay';
      reference = params['reference'];
      transactionId = params['orderNo'];

      // OPay also sends status
      if (params['status'] === 'FAIL') {
        this.isVerifying = false;
        this.toastr.error('Payment failed');
        this.router.navigate(['/home/subscription/upgrade']);
        return;
      } else if (params['status'] === 'PENDING') {
        this.isVerifying = false;
        this.toastr.info('Payment is pending. Please check back later.');
        this.router.navigate(['/home/subscription/upgrade']);
        return;
      }

      // First verify OPay payment status, then complete
      this.paymentService.verifyOPayPayment(reference).subscribe({
        next: (verifyResponse) => {
          const verifyData = getApiData(verifyResponse);
          if (isApiSuccess(verifyResponse) && verifyData?.status === 'SUCCESS') {
            // Payment verified, now complete it
            this.paymentService.completeOPayPayment({ reference, planId: this.planId }).subscribe({
              next: (completeResponse) => {
                this.isVerifying = false;
                const completeData = getApiData(completeResponse);
                if (isApiSuccess(completeResponse) && completeData?.success) {
                  this.toastr.success('Payment successful!');
                  this.router.navigate(['/home/subscription/success'], {
                    queryParams: {
                      reference: completeData.reference
                    }
                  });
                } else {
                  this.error = completeData?.message || 'Payment completion failed';
                }
              },
              error: (err) => {
                this.isVerifying = false;
                this.error = 'Unable to complete payment. Please contact support.';
                console.error('OPay complete error:', err);
              }
            });
          } else {
            this.isVerifying = false;
            this.error = verifyData?.message || 'Payment verification failed';
          }
        },
        error: (err) => {
          this.isVerifying = false;
          this.error = 'Unable to verify payment. Please contact support.';
          console.error('OPay verification error:', err);
        }
      });
      return;
    } else if (params['reference'] || params['trxref']) {
      // Paystack callback
      gateway = 'paystack';
      reference = params['reference'] || params['trxref'];
    } else if (params['tx_ref']) {
      // Flutterwave callback
      gateway = 'flutterwave';
      reference = params['tx_ref'];
      transactionId = params['transaction_id'];

      // Flutterwave also sends status
      if (params['status'] === 'cancelled') {
        this.isVerifying = false;
        this.toastr.info('Payment was cancelled');
        this.router.navigate(['/home/subscription/upgrade']);
        return;
      }
    } else if (params['payment_intent']) {
      // Stripe callback
      gateway = 'stripe';
      reference = params['payment_intent'];
    } else {
      // Unknown or missing params
      this.isVerifying = false;
      this.error = 'Invalid payment callback. Missing required parameters.';
      return;
    }

    // Verify with backend
    this.paymentService.verifyPayment({
      gateway,
      reference,
      planId: this.planId,
      saveCard: true
    }).subscribe({
      next: (response) => {
        this.isVerifying = false;
        const data = getApiData(response);
        if (isApiSuccess(response) && data && data.success) {
          this.toastr.success('Payment successful!');
          this.router.navigate(['/home/subscription/success'], {
            queryParams: {
              reference: data.reference
            }
          });
        } else {
          this.error = data?.message || 'Payment verification failed';
        }
      },
      error: (err) => {
        this.isVerifying = false;
        this.error = 'Unable to verify payment. Please contact support.';
        console.error('Verification error:', err);
      }
    });
  }

  retry(): void {
    this.router.navigate(['/home/subscription/upgrade']);
  }
}
