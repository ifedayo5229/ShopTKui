export interface StockTransaction {
  id: number;
  shopId: number;
  productId: number;
  inventoryId: number;
  transactionType: TransactionType;
  quantity: number;
  previousQuantity: number;
  newQuantity: number;
  referenceId?: number;
  referenceType?: string;
  notes?: string;
  createdBy: number;
  createdAt: Date;
  
  // Navigation properties
  productName?: string;
  productSku?: string;
  createdByName?: string;
}

export enum TransactionType {
  StockIn = 'StockIn',
  StockOut = 'StockOut',
  Sale = 'Sale',
  Return = 'Return',
  Adjustment = 'Adjustment',
  Transfer = 'Transfer'
}
