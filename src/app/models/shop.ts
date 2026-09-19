export interface Shop {
  id: number;
  tenantId: string;
  name: string;
  description?: string;
  address?: string;
  city?: string;
  state?: string;
  phoneNumber?: string;
  logoUrl?: string;
  brandColor?: string;
  isMainBranch?: boolean;
  isActive: boolean;
  createdDate?: string;
}

export interface CreateShopRequest {
  name: string;
  description?: string;
  address?: string;
  city?: string;
  state?: string;
  phoneNumber?: string;
  logoUrl?: string;
  brandColor?: string;
  isMainBranch?: boolean;
}

export interface UpdateShopRequest {
  id: number | string;
  name?: string;
  description?: string;
  address?: string;
  city?: string;
  state?: string;
  phoneNumber?: string;
  logoUrl?: string;
  brandColor?: string;
  isMainBranch?: boolean;
  isActive?: boolean;
}
