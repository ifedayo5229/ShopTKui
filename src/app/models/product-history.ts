export interface ProductHistory {
  id: number;
  productId: number;
  productName: string;
  shopId?: number;
  shopName?: string;
  activityType: ProductActivityType;
  description: string;
  quantityBefore?: number;
  quantityAfter?: number;
  quantityChanged?: number;
  priceBefore?: number;
  priceAfter?: number;
  referenceNumber?: string;
  reason?: string;
  relatedSaleId?: number;
  invoiceNumber?: string;
  performedBy: string;
  notes?: string;
  createdDate: Date | string;
}

export type ProductActivityType = 
  | 'ProductCreated'
  | 'ProductUpdated'
  | 'ProductDeleted'
  | 'StockAdded'
  | 'StockRemoved'
  | 'StockAdjusted'
  | 'Sale'
  | 'SaleReturned'
  | 'PriceChanged'
  | 'CategoryChanged'
  | 'LowStockAlert';

export interface ProductHistoryFilter {
  productId?: number;
  shopId?: number | string;
  activityType?: ProductActivityType;
  startDate?: Date | string;
  endDate?: Date | string;
  count?: number;
}
