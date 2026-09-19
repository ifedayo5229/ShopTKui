import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { SubscriptionService } from 'src/app/services/subscription/subscription.service';
import { PaymentService } from 'src/app/services/payment/payment.service';
import { TenantContextService } from 'src/app/services/tenant-context/tenant-context.service';
import { TokenService } from 'src/app/services/token/token.service';
import { isApiSuccess, getApiData } from 'src/app/models/api-response';
import { 
  SubscriptionPlan, 
  TenantSubscription, 
  SubscriptionStatus,
  BillingCycle
} from 'src/app/models/subscription';
import { 
  SavedPaymentMethod, 
  PaymentGateway,
  UpgradePricingDetails 
} from 'src/app/models/payment';
import { environment } from 'src/app/environments/environment';

// Extended plan interface for UI
interface DisplayPlan extends SubscriptionPlan {
  isAvailable: boolean;
  comingSoon?: boolean;
  popular?: boolean;
}

@Component({
  selector: 'app-upgrade',
  templateUrl: './upgrade.component.html',
  styleUrls: ['./upgrade.component.scss']
})
export class UpgradeComponent implements OnInit {
  // Loading states
  isLoading = true;
  isProcessingPayment = false;

  // Data
  currentSubscription: TenantSubscription | null = null;
  displayPlans: DisplayPlan[] = [];
  selectedPlan: DisplayPlan | null = null;
  savedPaymentMethods: SavedPaymentMethod[] = [];
  selectedPaymentMethod: SavedPaymentMethod | null = null;
  selectedGateway: PaymentGateway = 'paystack';

  // Upgrade details
  upgradeDetails: UpgradePricingDetails | null = null;

  // User info (from auth)
  userEmail: string = '';

  // Currency
  currency = 'NGN';
  currencySymbol = '₦';

  // Payment gateway config
  gatewayConfig = (environment as any).payment;

  // angular4-paystack reference
  reference: string = '';

  // Available gateway keys
  availableGatewayKeys: PaymentGateway[] = ['paystack', 'opay'];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private subscriptionService: SubscriptionService,
    private paymentService: PaymentService,
    private tenantContext: TenantContextService,
    private tokenService: TokenService
  ) { }

  ngOnInit(): void {
    this.loadUserInfo();
    this.loadData();
    this.reference = `ref-${Math.ceil(Math.random() * 10e13)}`;
  }

  private loadUserInfo(): void {
    // 1. Try TenantContextService (used by header, sidebar, dashboard)
    const user = this.tenantContext.currentUser;
    if (user && user.email) {
      this.userEmail = user.email;
    }

    // 2. Fallback: TokenService.getInfo() (reads localStorage['myData'])
    if (!this.userEmail) {
      try {
        const info = this.tokenService.getInfo();
        if (info && info.profile && info.profile.email) {
          this.userEmail = info.profile.email;
        }
      } catch (e) {
        console.warn('tokenService.getInfo() failed', e);
      }
    }

    // 3. Fallback: direct localStorage key
    if (!this.userEmail) {
      const stored = localStorage.getItem('EM');
      if (stored && stored !== 'undefined' && stored !== 'null') {
        this.userEmail = stored;
      }
    }

    console.log('User email loaded:', this.userEmail);
  }

  private loadData(): void {
    this.isLoading = true;

    // Load current subscription
    this.subscriptionService.getMySubscription().subscribe({
      next: (response) => {
        const data = getApiData(response);
        if (isApiSuccess(response) && data) {
          this.currentSubscription = data;
        }
        this.loadPlans();
      },
      error: (err) => {
        console.error('Error loading subscription', err);
        this.loadPlans();
      }
    });
  }

  private loadPlans(): void {
    // Fetch plans from backend API (using real plan IDs from database)
    this.subscriptionService.getPlans().subscribe({
      next: (response) => {
        console.log('=== PLANS API RESPONSE ===', response);
        const plans = getApiData(response);
        console.log('=== EXTRACTED PLANS ===', plans);
        if (isApiSuccess(response) && plans && plans.length > 0) {
          this.displayPlans = plans
            .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
            .map((plan: any) => ({
              ...plan,
              // Map alternate field names from backend
              name: plan.name || plan.planName || '',
              code: plan.code || plan.planCode || '',
              price: plan.price || plan.amount || 0,
              billingCycle: plan.billingCycle || plan.billing_cycle || 'Monthly',
              description: plan.description || '',
              features: plan.features || [],
              isAvailable: plan.isActive ?? plan.is_active ?? true,
              comingSoon: false,
              popular: false
            } as DisplayPlan));
        } else {
          // No plans from API — should not happen
          this.displayPlans = [];
          this.toastr.warning('No subscription plans available');
        }

        // Auto-select first available plan
        const availablePlan = this.displayPlans.find(p => p.isAvailable);
        if (availablePlan) {
          this.selectPlan(availablePlan);
        }

        // Override with planId from route if present
        const planId = this.route.snapshot.queryParams['planId'];
        if (planId) {
          const plan = this.displayPlans.find(p => p.id === +planId && p.isAvailable);
          if (plan) {
            this.selectPlan(plan);
          }
        }

        this.loadSavedPaymentMethods();
      },
      error: (err) => {
        console.error('Error loading plans from API', err);
        this.toastr.error('Failed to load subscription plans');
        this.isLoading = false;
      }
    });
  }

  private loadSavedPaymentMethods(): void {
    this.paymentService.getSavedPaymentMethods().subscribe({
      next: (response) => {
        const data = getApiData(response);
        if (isApiSuccess(response) && data) {
          this.savedPaymentMethods = data;
          // Auto-select default payment method
          this.selectedPaymentMethod = this.savedPaymentMethods.find(pm => pm.isDefault) || null;
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading payment methods', err);
        this.isLoading = false;
      }
    });
  }

  selectPlan(plan: DisplayPlan): void {
    // Only allow selecting available plans
    if (!plan.isAvailable) {
      this.toastr.info(`${plan.name} plan is coming soon!`);
      return;
    }
    this.selectedPlan = plan;
    this.loadUpgradeDetails(plan.id);
  }

  private loadUpgradeDetails(planId: number): void {
    this.paymentService.getUpgradeDetails(planId).subscribe({
      next: (response) => {
        const data = getApiData(response);
        if (isApiSuccess(response) && data) {
          this.upgradeDetails = data;
        }
      },
      error: (err) => {
        // Non-blocking — use plan price as fallback
        console.warn('Upgrade details unavailable, using plan price as total', err);
        this.upgradeDetails = null;
      }
    });
  }

  selectGateway(gateway: PaymentGateway): void {
    this.selectedGateway = gateway;
    // Clear saved payment method if switching gateways
    if (this.selectedPaymentMethod?.gateway !== gateway) {
      this.selectedPaymentMethod = null;
    }
  }

  selectPaymentMethod(method: SavedPaymentMethod): void {
    this.selectedPaymentMethod = method;
    this.selectedGateway = method.gateway;
  }

  // Get current subscription status display
  get subscriptionStatusText(): string {
    if (!this.currentSubscription) return 'No active subscription';
    
    switch (this.currentSubscription.status) {
      case SubscriptionStatus.Trial:
        return `Free Trial - ${this.currentSubscription.daysRemaining} days remaining`;
      case SubscriptionStatus.Active:
        return `${this.currentSubscription.planName} - ${this.currentSubscription.daysRemaining} days remaining`;
      case SubscriptionStatus.Expired:
        return 'Subscription Expired';
      case SubscriptionStatus.Cancelled:
        return 'Subscription Cancelled';
      case SubscriptionStatus.Suspended:
        return 'Subscription Suspended';
      case SubscriptionStatus.PendingActivation:
        return 'Payment received — pending activation';
      default:
        return 'Unknown Status';
    }
  }

  get isFreeTrial(): boolean {
    return this.currentSubscription?.status === SubscriptionStatus.Trial;
  }

  // Color accent for plan cards
  getPlanAccent(index: number): string {
    const accents = ['stock', 'checkout', 'teal'];
    return accents[index % accents.length];
  }

  get isExpiringSoon(): boolean {
    return (this.currentSubscription?.daysRemaining || 0) <= 7;
  }

  // Process payment
  processPayment(): void {
    if (!this.selectedPlan) {
      this.toastr.warning('Please select a plan');
      return;
    }

    if (!this.userEmail) {
      this.loadUserInfo();
      if (!this.userEmail) {
        this.toastr.error('User email not found. Please log in again.');
        return;
      }
    }

    // If user has a saved payment method, use it
    if (this.selectedPaymentMethod) {
      this.chargeExistingCard();
    } else {
      // Initialize new payment
      this.initializeNewPayment();
    }
  }

  private chargeExistingCard(): void {
    if (!this.selectedPaymentMethod || !this.selectedPlan) return;

    this.isProcessingPayment = true;
    
    this.paymentService.chargeSavedCard({
      paymentMethodId: this.selectedPaymentMethod.id,
      planId: this.selectedPlan.id,
      amount: this.upgradeDetails?.amountDue || this.selectedPlan.price,
      email: this.userEmail
    }).subscribe({
      next: (response) => {
        this.isProcessingPayment = false;
        const data = getApiData(response);
        if (isApiSuccess(response) && data) {
          this.handlePaymentSuccess(data);
        } else {
          this.toastr.error(response.message || 'Payment failed');
        }
      },
      error: (err) => {
        this.isProcessingPayment = false;
        this.toastr.error('Payment failed. Please try again.');
        console.error('Payment error', err);
      }
    });
  }

  private initializeNewPayment(): void {
    if (!this.selectedPlan) return;

    const amount = this.upgradeDetails?.amountDue || this.selectedPlan.price;
    const reference = this.paymentService.generateReference();

    this.isProcessingPayment = true;

    if (this.selectedGateway === 'opay') {
      this.initializeOPayPayment(amount, reference);
      return;
    }

    // Paystack / Flutterwave — use generic initialize endpoint
    this.paymentService.initializePayment({
      gateway: this.selectedGateway,
      planId: this.selectedPlan.id,
      amount: amount,
      email: this.userEmail,
      callbackUrl: `${window.location.origin}/home/subscription/payment-callback`,
      type: this.currentSubscription ? 'upgrade' : 'subscription'
    }).subscribe({
      next: (response) => {
        const data = getApiData(response);
        if (isApiSuccess(response) && data) {
          // Store planId for recovery after redirect
          localStorage.setItem('pendingPlanId', this.selectedPlan!.id.toString());
          this.openPaymentGateway(data.reference, amount);
        } else {
          this.isProcessingPayment = false;
          this.toastr.error('Failed to initialize payment');
        }
      },
      error: (err) => {
        this.isProcessingPayment = false;
        this.toastr.error('Failed to initialize payment');
        console.error('Payment init error', err);
      }
    });
  }

  private initializeOPayPayment(amount: number, reference: string): void {
    if (!this.selectedPlan) return;

    const userName = this.tenantContext.currentUser;
    const customerName = userName
      ? `${userName.firstName || ''} ${userName.lastName || ''}`.trim() || 'Customer'
      : 'Customer';

    this.paymentService.initializeOPayPayment({
      amount: amount,
      currency: 'NGN',
      email: this.userEmail,
      customerName: customerName,
      planId: this.selectedPlan.id,
      paymentType: 'subscription'
    }).subscribe({
      next: (response) => {
        const data = getApiData(response);
        if (isApiSuccess(response) && data && data.cashierUrl) {
          // Store planId for recovery after redirect
          localStorage.setItem('pendingPlanId', this.selectedPlan!.id.toString());
          // Redirect to OPay cashier page
          window.location.href = data.cashierUrl;
        } else {
          this.isProcessingPayment = false;
          this.toastr.error(data?.message || 'Failed to initialize OPay payment');
        }
      },
      error: (err) => {
        this.isProcessingPayment = false;
        this.toastr.error('Failed to initialize OPay payment');
        console.error('OPay init error', err);
      }
    });
  }

  private openPaymentGateway(reference: string, amount: number): void {
    switch (this.selectedGateway) {
      case 'paystack':
        this.payWithPaystack(reference, amount);
        break;
      case 'flutterwave':
        this.payWithFlutterwave(reference, amount);
        break;
    }
  }

  private payWithPaystack(reference: string, amount: number): void {
    if (typeof (window as any).PaystackPop === 'undefined') {
      this.isProcessingPayment = false;
      this.toastr.error('Payment service is not available. Please refresh the page and try again.');
      return;
    }

    this.paymentService.payWithPaystack({
      email: this.userEmail,
      amount: this.paymentService.toMinorUnits(amount), // Convert to kobo
      reference: reference,
      publicKey: this.gatewayConfig.paystack.publicKey,
      currency: 'NGN',
      metadata: {
        planId: this.selectedPlan?.id,
        planName: this.selectedPlan?.name
      },
      onSuccess: (response) => {
        this.verifyPayment('paystack', response.reference);
      },
      onClose: () => {
        this.isProcessingPayment = false;
        this.toastr.info('Payment cancelled');
      }
    });
  }

  private payWithFlutterwave(reference: string, amount: number): void {
    this.paymentService.payWithFlutterwave({
      email: this.userEmail,
      amount: amount,
      reference: reference,
      publicKey: this.gatewayConfig.flutterwave.publicKey,
      currency: 'NGN',
      title: 'ShopTK Subscription',
      description: `Upgrade to ${this.selectedPlan?.name}`,
      onSuccess: (response) => {
        this.verifyPayment('flutterwave', response.tx_ref, response.transaction_id?.toString());
      },
      onClose: () => {
        this.isProcessingPayment = false;
        this.toastr.info('Payment cancelled');
      }
    });
  }

  private verifyPayment(gateway: PaymentGateway, reference: string, transactionId?: string): void {
    this.paymentService.verifyPayment({
      gateway: gateway,
      reference: reference,
      planId: this.selectedPlan?.id || 0,
      saveCard: true
    }).subscribe({
      next: (response) => {
        this.isProcessingPayment = false;
        const data = getApiData(response);
        if (isApiSuccess(response) && data) {
          this.handlePaymentSuccess(data);
        } else {
          this.toastr.error(response.message || 'Payment verification failed');
        }
      },
      error: (err) => {
        this.isProcessingPayment = false;
        this.toastr.error('Payment verification failed');
        console.error('Verification error', err);
      }
    });
  }

  private handlePaymentSuccess(data: any): void {
    this.toastr.success('Payment received! Your subscription is pending activation.');
    
    // Navigate to success page or dashboard
    this.router.navigate(['/home/subscription/success'], {
      queryParams: { 
        planName: this.selectedPlan?.name,
        reference: data.reference 
      }
    });
  }

  // Delete saved payment method
  deletePaymentMethod(method: SavedPaymentMethod, event: Event): void {
    event.stopPropagation();
    
    if (confirm(`Delete card ending in ${method.last4}?`)) {
      this.paymentService.deletePaymentMethod(method.id).subscribe({
        next: () => {
          this.savedPaymentMethods = this.savedPaymentMethods.filter(m => m.id !== method.id);
          if (this.selectedPaymentMethod?.id === method.id) {
            this.selectedPaymentMethod = null;
          }
          this.toastr.success('Card removed successfully');
        },
        error: () => {
          this.toastr.error('Failed to remove card');
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/home/dashboard']);
  }

  // Direct Paystack button using Inline JS SDK
  payWithPaystackDirect(): void {
    if (!this.selectedPlan) {
      this.toastr.warning('Please select a plan');
      return;
    }
    if (!this.userEmail) {
      this.loadUserInfo();
      if (!this.userEmail) {
        this.toastr.error('User email not found. Please log in again.');
        return;
      }
    }

    const amount = this.upgradeDetails?.amountDue || this.selectedPlan.price;
    this.reference = `ref-${Math.ceil(Math.random() * 10e13)}`;
    this.isProcessingPayment = true;

    this.paymentService.payWithPaystack({
      email: this.userEmail,
      amount: this.paymentService.toMinorUnits(amount),
      reference: this.reference,
      publicKey: this.gatewayConfig.paystack.publicKey,
      currency: 'NGN',
      metadata: {
        planId: this.selectedPlan?.id,
        planName: this.selectedPlan?.name
      },
      onSuccess: (response) => {
        this.isProcessingPayment = false;
        this.verifyPayment('paystack', response.reference);
      },
      onClose: () => {
        this.isProcessingPayment = false;
        this.toastr.info('Payment cancelled');
      }
    });
  }
}
