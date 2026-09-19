// Payment Gateway Types
export type PaymentGateway = 'paystack' | 'flutterwave' | 'stripe' | 'opay';

// Saved Payment Method (Card)
export interface SavedPaymentMethod {
  id: number;
  gateway: PaymentGateway;
  cardType: string; // Visa, Mastercard, etc.
  last4: string;
  expiryMonth: string;
  expiryYear: string;
  cardholderName: string;
  email: string;
  isDefault: boolean;
}

// Request to initialize payment
export interface InitializePaymentRequest {
  gateway?: PaymentGateway;
  planId: number;
  amount: number;
  email?: string;
  callbackUrl: string;
  type?: 'subscription' | 'renewal' | 'upgrade';
}

// Response from payment initialization
export interface InitializePaymentResponse {
  success: boolean;
  authorizationUrl: string; // Redirect URL for payment
  reference: string;
  accessCode?: string; // For Paystack
  transactionId?: string; // For Flutterwave
  clientSecret?: string; // For Stripe
}

// Request to verify payment
export interface VerifyPaymentRequest {
  gateway?: PaymentGateway;
  reference: string;
  planId: number;
  saveCard?: boolean;
}

// Payment verification response
export interface PaymentVerificationResponse {
  success: boolean;
  reference: string;
  amount: number;
  currency: string;
  status: string;
  gateway: string;
  message: string;
  savedCard: SavedPaymentMethod | null;
}

// Charge saved card request
export interface ChargeSavedCardRequest {
  paymentMethodId: number;
  planId: number;
  amount: number;
  email?: string;
}

// Gateway configuration (public keys only)
export interface PaymentGatewayConfig {
  id: string;
  name: string;
  displayName: string;
  logoUrl: string;
  isActive: boolean;
  publicKey: string | null;
  supportedCurrencies: string[];
}

// Upgrade flow models
export interface UpgradePricingDetails {
  currentPlanId: number;
  currentPlanName: string;
  currentPlanPrice: number;
  newPlanId: number;
  newPlanName: string;
  newPlanPrice: number;
  proratedCredit: number;
  amountDue: number;
  currency: string;
  daysRemaining: number;
  newEndDate: string;
}

// Payment result for callbacks
export interface PaymentResult {
  success: boolean;
  gateway: PaymentGateway;
  reference: string;
  message?: string;
  subscriptionActivated?: boolean;
}

// Webhook payload (for reference - handled on backend)
export interface PaymentWebhookPayload {
  gateway: PaymentGateway;
  event: string;
  data: any;
}

// ==================== OPay Specific Models ====================

// Request to initialize OPay payment
export interface OPayInitializeRequest {
  amount: number;
  currency?: string;
  email?: string;
  customerName?: string;
  customerPhone?: string;
  planId: number;
  paymentType?: string;
}

// Response from OPay initialization
export interface OPayInitializeResponse {
  success: boolean;
  orderNo: string;
  reference: string;
  cashierUrl: string;  // Redirect user to this URL
  message?: string;
}

// OPay payment status
export type OPayStatus = 'SUCCESS' | 'FAIL' | 'PENDING' | 'INITIAL';

// OPay complete payment request
export interface OPayCompleteRequest {
  reference: string;
  planId: number;
}

// OPay order query response
export interface OPayOrderStatusResponse {
  success: boolean;
  orderNo: string;
  reference: string;
  status: OPayStatus;
  amount: number;
  currency: string;
  payMethod?: string;
  paidAt?: Date;
  message?: string;
}

// OPay callback query params
export interface OPayCallbackParams {
  orderNo: string;
  reference: string;
  status: OPayStatus;
}
