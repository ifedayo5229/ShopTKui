import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-payment-success',
  template: `
    <div class="success-container">
      <div class="success-card">
        <div class="success-icon">
          <mat-icon>check_circle</mat-icon>
        </div>
        
        <h1>Payment Successful!</h1>
        <p class="message">Your subscription has been activated successfully.</p>
        
        <div class="details" *ngIf="planName">
          <div class="detail-row">
            <span class="label">Plan</span>
            <span class="value">{{ planName }}</span>
          </div>
          <div class="detail-row" *ngIf="reference">
            <span class="label">Reference</span>
            <span class="value">{{ reference }}</span>
          </div>
        </div>
        
        <div class="actions">
          <button mat-raised-button color="primary" (click)="goToDashboard()">
            Go to Dashboard
          </button>
          <button mat-stroked-button (click)="viewBilling()">
            View Billing History
          </button>
        </div>
        
        <p class="support-note">
          Need help? Contact us at <a href="mailto:support@shoptk.com">support@shoptk.com</a>
        </p>
      </div>
    </div>
  `,
  styles: [`
    .success-container {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: calc(100vh - 120px);
      padding: 24px;
    }

    .success-card {
      text-align: center;
      max-width: 480px;
      background: var(--surface);
      border-radius: 16px;
      padding: 48px 32px;
      box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
    }

    .success-icon {
      margin-bottom: 24px;
      
      mat-icon {
        font-size: 80px;
        width: 80px;
        height: 80px;
        color: #10b981;
      }
    }

    h1 {
      font-size: 28px;
      font-weight: 600;
      margin: 0 0 8px;
      color: var(--text-primary);
    }

    .message {
      color: var(--text-secondary);
      font-size: 16px;
      margin-bottom: 32px;
    }

    .details {
      background: var(--background);
      border-radius: 8px;
      padding: 16px;
      margin-bottom: 32px;

      .detail-row {
        display: flex;
        justify-content: space-between;
        padding: 8px 0;

        .label {
          color: var(--text-secondary);
        }

        .value {
          font-weight: 500;
          color: var(--text-primary);
        }
      }
    }

    .actions {
      display: flex;
      flex-direction: column;
      gap: 12px;

      button {
        width: 100%;
        height: 48px;
      }
    }

    .support-note {
      margin-top: 24px;
      font-size: 13px;
      color: var(--text-muted);

      a {
        color: var(--primary);
      }
    }
  `]
})
export class PaymentSuccessComponent implements OnInit {
  planName: string = '';
  reference: string = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.planName = this.route.snapshot.queryParams['planName'] || '';
    this.reference = this.route.snapshot.queryParams['reference'] || '';
  }

  goToDashboard(): void {
    this.router.navigate(['/home/dashboard']);
  }

  viewBilling(): void {
    this.router.navigate(['/home/settings/billing']);
  }
}
