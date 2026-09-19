export interface ShopSettings {
  shopId: number;
  // Inventory settings
  defaultLowStockThreshold: number;
  enableLowStockAlerts: boolean;
  enableEmailAlerts: boolean;
  allowNegativeStock: boolean;
  // Notification settings
  lowStockNotifications: boolean;
  dailySalesSummary: boolean;
  newUserNotifications: boolean;
}

export interface UpdateSettingRequest {
  value: boolean | number | string;
}

export interface ProductThreshold {
  inventoryId: number;
  productId: number;
  productName: string;
  sku: string;
  currentStock: number;
  threshold: number;
}

export interface UpdateProductThresholdRequest {
  threshold: number;
}
