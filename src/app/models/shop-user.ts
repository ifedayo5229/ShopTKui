export interface ShopUser {
  id: number;
  tenantId: string;
  shopId?: number;
  shopIds?: number[];
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  role: UserRole;
  isActive: boolean;
  isLocked: boolean;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt?: Date;
  
  // Navigation
  shopName?: string;
  shopNames?: string[];
  fullName?: string;
}

export interface CreateShopUserRequest {
  shopIds?: (number | string)[];
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  role: UserRole;
}

export interface UpdateShopUserRequest {
  id: number;
  shopIds?: (number | string)[];
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  role?: UserRole;
  isActive?: boolean;
}

export interface UpdatePasswordRequest {
  userId: number;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export enum UserRole {
  SuperAdmin = 'SuperAdmin',
  TenantOwner = 'TenantOwner',
  ShopManager = 'ShopManager',
  Cashier = 'Cashier',
  StockKeeper = 'StockKeeper',
  Viewer = 'Viewer'
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken?: string;
  expiresAt: Date;
  user: ShopUser;
  tenant: TenantInfo | null;  // null for SuperAdmin
  shops: ShopInfo[];          // empty for SuperAdmin
}

export interface TenantInfo {
  id: number;
  tenantId: string;
  name: string;
  logoUrl?: string;
  brandColor?: string;
}

export interface ShopInfo {
  id: string | number;
  name: string;
  address?: string;
  phone?: string;
  logoUrl?: string;
  isActive?: boolean;
}

export interface RegisterTenantRequest {
  tenantName: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  shops: RegisterShopRequest[];
}

export interface RegisterShopRequest {
  name: string;
  address?: string;
}

export interface ForgotPasswordRequest {
  email: string;
  resetUrl: string;
}

export interface ResetPasswordRequest {
  email: string;
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
