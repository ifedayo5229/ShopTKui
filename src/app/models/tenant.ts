export interface Tenant {
  id: number;
  tenantId: string; // GUID
  businessName: string;
  ownerName: string;
  email: string;
  phoneNumber?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  logoUrl?: string;
  subscriptionPlan?: string;
  hasPaidSubscription?: boolean;
  subscriptionStartDate?: string;
  subscriptionEndDate?: string;
  subscriptionStatus?: string;
  createdDate?: string;
}

export interface CreateTenantRequest {
  name: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
}

export interface UpdateTenantRequest {
  businessName?: string;
  ownerName?: string;
  email?: string;
  phoneNumber?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  logoUrl?: string;
}
