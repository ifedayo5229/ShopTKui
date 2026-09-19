import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from 'src/app/environments/environment';
import { ApiResponse } from 'src/app/models/api-response';
import {
  PaymentGateway,
  SavedPaymentMethod,
  InitializePaymentRequest,
  InitializePaymentResponse,
  VerifyPaymentRequest,
  PaymentVerificationResponse,
  ChargeSavedCardRequest,
  PaymentGatewayConfig,
  UpgradePricingDetails,
  PaymentResult,
  OPayInitializeRequest,
  OPayInitializeResponse,
  OPayCompleteRequest,
  OPayOrderStatusResponse
} from 'src/app/models/payment';

declare var PaystackPop: any;
declare var FlutterwaveCheckout: any;

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private baseUrl = `${environment.apiUrl}/payments`;

  // Track payment in progress
  private paymentInProgress = new BehaviorSubject<boolean>(false);
  paymentInProgress$ = this.paymentInProgress.asObservable();

  constructor(private http: HttpClient) { }

  // ==================== Gateway Configuration ====================

  // Get available payment gateways
  getAvailableGateways(): Observable<ApiResponse<PaymentGatewayConfig[]>> {
    return this.http.get<ApiResponse<PaymentGatewayConfig[]>>(`${this.baseUrl}/gateways`);
  }

  // Get gateway config from environment
  getLocalGatewayConfig(): { paystack: any; flutterwave: any; stripe: any } {
    return (environment as any).payment;
  }

  // ==================== Saved Payment Methods ====================

  // Get user's saved payment methods (cards)
  getSavedPaymentMethods(): Observable<ApiResponse<SavedPaymentMethod[]>> {
    return this.http.get<ApiResponse<SavedPaymentMethod[]>>(`${this.baseUrl}/methods`);
  }

  // Delete a saved payment method
  deletePaymentMethod(paymentMethodId: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.baseUrl}/methods/${paymentMethodId}`);
  }

  // Set default payment method
  setDefaultPaymentMethod(paymentMethodId: number): Observable<ApiResponse<void>> {
    return this.http.put<ApiResponse<void>>(`${this.baseUrl}/methods/${paymentMethodId}/default`, {});
  }

  // ==================== Upgrade/Subscription Payment ====================

  // Get upgrade plan details (pricing, proration, etc.)
  getUpgradeDetails(planId: number): Observable<ApiResponse<UpgradePricingDetails>> {
    return this.http.get<ApiResponse<UpgradePricingDetails>>(`${this.baseUrl}/upgrade/${planId}/details`);
  }

  // Initialize payment for subscription upgrade
  initializePayment(request: InitializePaymentRequest): Observable<ApiResponse<InitializePaymentResponse>> {
    return this.http.post<ApiResponse<InitializePaymentResponse>>(`${this.baseUrl}/initialize`, request);
  }

  // Verify payment after callback
  verifyPayment(request: VerifyPaymentRequest): Observable<ApiResponse<PaymentVerificationResponse>> {
    return this.http.post<ApiResponse<PaymentVerificationResponse>>(`${this.baseUrl}/verify`, request);
  }

  // Charge saved card for subscription
  chargeSavedCard(request: ChargeSavedCardRequest): Observable<ApiResponse<PaymentVerificationResponse>> {
    return this.http.post<ApiResponse<PaymentVerificationResponse>>(`${this.baseUrl}/charge`, request);
  }

  // ==================== Payment Gateway Integration ====================

  /**
   * Open Paystack payment popup
   */
  payWithPaystack(config: {
    email: string;
    amount: number; // in kobo (multiply naira by 100)
    reference: string;
    publicKey: string;
    currency?: string;
    metadata?: any;
    onSuccess: (response: any) => void;
    onClose: () => void;
  }): void {
    if (typeof PaystackPop === 'undefined') {
      console.error('Paystack SDK not loaded. Make sure https://js.paystack.co/v1/inline.js is included in index.html');
      this.paymentInProgress.next(false);
      config.onClose();
      return;
    }

    this.paymentInProgress.next(true);

    try {
      const handler = PaystackPop.setup({
        key: config.publicKey,
        email: config.email,
        amount: config.amount,
        currency: config.currency || 'NGN',
        ref: config.reference,
        metadata: config.metadata || {},
        callback: (response: any) => {
          this.paymentInProgress.next(false);
          config.onSuccess(response);
        },
        onClose: () => {
          this.paymentInProgress.next(false);
          config.onClose();
        }
      });

      handler.openIframe();
    } catch (error) {
      console.error('Error opening Paystack popup:', error);
      this.paymentInProgress.next(false);
      config.onClose();
    }
  }

  /**
   * Open Flutterwave payment modal
   */
  payWithFlutterwave(config: {
    email: string;
    amount: number;
    reference: string;
    publicKey: string;
    currency?: string;
    customerName?: string;
    customerPhone?: string;
    title?: string;
    description?: string;
    logo?: string;
    onSuccess: (response: any) => void;
    onClose: () => void;
  }): void {
    this.paymentInProgress.next(true);

    FlutterwaveCheckout({
      public_key: config.publicKey,
      tx_ref: config.reference,
      amount: config.amount,
      currency: config.currency || 'NGN',
      payment_options: 'card',
      customer: {
        email: config.email,
        name: config.customerName || '',
        phone_number: config.customerPhone || ''
      },
      customizations: {
        title: config.title || 'ShopTK Subscription',
        description: config.description || 'Subscription Payment',
        logo: config.logo || ''
      },
      callback: (response: any) => {
        this.paymentInProgress.next(false);
        config.onSuccess(response);
      },
      onclose: () => {
        this.paymentInProgress.next(false);
        config.onClose();
      }
    });
  }

  /**
   * For Stripe - returns client secret for Stripe Elements
   * The actual Stripe integration happens in the component using Stripe.js
   */
  getStripeClientSecret(planId: number): Observable<ApiResponse<{ clientSecret: string; paymentIntentId: string }>> {
    return this.http.post<ApiResponse<{ clientSecret: string; paymentIntentId: string }>>(
      `${this.baseUrl}/stripe/create-intent`,
      { planId }
    );
  }

  // Confirm Stripe payment
  confirmStripePayment(paymentIntentId: string): Observable<ApiResponse<PaymentVerificationResponse>> {
    return this.http.post<ApiResponse<PaymentVerificationResponse>>(
      `${this.baseUrl}/stripe/confirm`,
      { paymentIntentId }
    );
  }

  // ==================== OPay Integration ====================

  /**
   * Initialize OPay payment - returns cashier URL to redirect user
   * POST /api/payments/opay/initialize
   */
  initializeOPayPayment(request: OPayInitializeRequest): Observable<ApiResponse<OPayInitializeResponse>> {
    return this.http.post<ApiResponse<OPayInitializeResponse>>(
      `${this.baseUrl}/opay/initialize`,
      request
    );
  }

  /**
   * Verify OPay payment status
   * GET /api/payments/opay/verify/{ref}
   */
  verifyOPayPayment(reference: string): Observable<ApiResponse<OPayOrderStatusResponse>> {
    return this.http.get<ApiResponse<OPayOrderStatusResponse>>(
      `${this.baseUrl}/opay/verify/${reference}`
    );
  }

  /**
   * Complete OPay payment after verification
   * POST /api/payments/opay/complete
   */
  completeOPayPayment(request: OPayCompleteRequest): Observable<ApiResponse<PaymentVerificationResponse>> {
    return this.http.post<ApiResponse<PaymentVerificationResponse>>(
      `${this.baseUrl}/opay/complete`,
      request
    );
  }

  // ==================== Helper Methods ====================

  // Generate unique payment reference
  generateReference(prefix: string = 'SHOPTK'): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `${prefix}_${timestamp}_${random}`;
  }

  // Format amount for display
  formatAmount(amount: number, currency: string = 'NGN'): string {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: currency
    }).format(amount);
  }

  // Convert to minor units (e.g., Naira to Kobo)
  toMinorUnits(amount: number, currency: string = 'NGN'): number {
    // Most currencies use 100 minor units
    return Math.round(amount * 100);
  }
}
