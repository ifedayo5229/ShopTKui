export interface LowStockAlert {
  id: number;
  shopId: number;
  productId: number;
  inventoryId: number;
  currentStock: number;
  threshold: number;
  status: AlertStatus;
  acknowledgedBy?: number;
  acknowledgedAt?: Date;
  resolvedBy?: number;
  resolvedAt?: Date;
  emailSent: boolean;
  emailSentAt?: Date;
  createdAt: Date;
  
  // Navigation properties
  productName?: string;
  productSku?: string;
  shopName?: string;
  acknowledgedByName?: string;
  resolvedByName?: string;
}

export enum AlertStatus {
  Active = 'Active',
  Acknowledged = 'Acknowledged',
  Resolved = 'Resolved'
}
