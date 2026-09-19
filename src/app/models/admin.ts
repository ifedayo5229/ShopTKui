import { Shop } from './shop';
import { TenantSubscription } from './subscription';

export interface AdminDashboardStats {
  totalTenants: number;
  activeTenants: number;
  totalShops: number;
  totalProducts: number;
  totalUsers: number;
  totalRevenue: number;
  monthlyRecurringRevenue: number;
  subscriptionBreakdown: PlanBreakdown[];
  recentSignups: RecentSignup[];
  expiringSubscriptions: number;
}

export interface PlanBreakdown {
  planName: string;
  planCode: string;
  count: number;
  revenue: number;
}

export interface RecentSignup {
  tenantId: string;
  name: string;
  email: string;
  plan: string;
  createdAt: Date;
}

export interface TenantListItem {
  id: number;
  tenantId: string;
  name: string;
  email: string;
  phone?: string;
  isActive: boolean;
  subscriptionPlan?: string;
  subscriptionStatus?: string;
  shopCount: number;
  userCount?: number;
  productCount?: number;
  createdDate?: Date;
  createdAt?: Date;
  lastLoginAt?: Date;
}

export interface TenantDetails {
  id: number;
  tenantId: string;
  name: string;
  ownerName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  logoUrl: string | null;
  isActive: boolean;
  createdDate: string;
  subscription: TenantSubscriptionSummary | null;
  shops: TenantShopInfo[];
}

export interface TenantSubscriptionSummary {
  planName: string;
  status: string;
  endDate: string;
  daysRemaining: number;
}

export interface TenantShopInfo {
  id: number;
  name: string;
  address: string;
  isMainBranch: boolean;
  isActive: boolean;
}

export interface AdminUserListItem {
  id: string;
  fullName: string;
  email: string;
  tenantId: string;
  tenantName: string;
  shopId?: number;
  shopName?: string;
  role: string;
  isActive: boolean;
  createdAt: Date;
  lastLoginAt?: Date;
}

export interface TenantStatusUpdate {
  isActive: boolean;
  reason?: string;
}

export interface UserStatusUpdate {
  isActive: boolean;
  reason?: string;
}

export interface TriggerLowStockRequest {
  shopId?: number;
  tenantId?: string;
}

export interface TriggerLowStockResponse {
  alertsCreated: number;
  shopsChecked: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
