export interface SubscriptionPlan {
  id: number;
  name: string;
  code: string;
  description: string;
  price: number;
  billingCycle: BillingCycle;
  maxShops: number; // -1 = unlimited
  maxProducts: number; // -1 = unlimited
  maxUsers: number; // -1 = unlimited
  features: string[];
  isActive: boolean;
  sortOrder: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreatePlanRequest {
  name: string;
  code: string;
  description: string;
  price: number;
  billingCycle: BillingCycle;
  maxShops: number;
  maxProducts: number;
  maxUsers: number;
  features: string[];
  isActive: boolean;
  sortOrder: number;
}

export interface UpdatePlanRequest {
  id: number;
  code?: string;
  name?: string;
  description?: string;
  price?: number;
  billingCycle?: BillingCycle;
  maxShops?: number;
  maxProducts?: number;
  maxUsers?: number;
  features?: string[];
  isActive?: boolean;
  sortOrder?: number;
}

export interface TenantSubscription {
  id: number;
  tenantId: string;
  tenantName?: string;
  tenantEmail?: string;
  planId: number;
  planName?: string;
  planCode?: string;
  price?: number;
  status: SubscriptionStatus;
  statusName?: string;
  startDate: Date;
  endDate: Date;
  daysRemaining?: number;
  autoRenew: boolean;
  // Flat usage fields (admin endpoints)
  currentShops?: number;
  currentProducts?: number;
  currentUsers?: number;
  maxShops?: number;
  maxProducts?: number;
  maxUsers?: number;
  // Nested usage (my-subscription endpoint)
  usage?: SubscriptionUsage;
  billingHistory?: BillingRecord[];
  isActive?: boolean;
  createdDate?: Date;
  isDeleted?: boolean;
}

export interface SubscriptionUsage {
  shops: UsageLimit;
  products: UsageLimit;
  users: UsageLimit;
}

export interface UsageLimit {
  used: number;
  limit: number; // -1 = unlimited
}

export interface BillingRecord {
  id: number;
  tenantId: string;
  subscriptionId: number;
  amount: number;
  currency: string;
  paymentReference: string;
  paymentMethod: string;
  status: string;
  paidAt?: string;
  invoiceNumber?: string | null;
  invoiceUrl?: string | null;
}

export interface SubscribeRequest {
  planId: number;
  paymentMethod: string;
  paymentReference?: string;
}

export interface UpgradeRequest {
  newPlanId: number;
  paymentReference?: string;
}

export interface AdminSubscriptionUpdate {
  planId: number;
  endDate: Date;
  reason?: string;
}

export enum BillingCycle {
  Monthly = 'Monthly',
  Quarterly = 'Quarterly',
  Yearly = 'Yearly'
}

export enum SubscriptionStatus {
  Active = 'Active',
  Trial = 'Trial',
  Expired = 'Expired',
  Cancelled = 'Cancelled',
  Suspended = 'Suspended',
  PendingActivation = 'PendingActivation'
}

export enum PaymentStatus {
  Pending = 'Pending',
  Paid = 'Paid',
  Failed = 'Failed',
  Refunded = 'Refunded'
}
