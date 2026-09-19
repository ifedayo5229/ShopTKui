export interface StockReason {
  id: number;
  code: string;
  name: string;
  description?: string;
  type: StockReasonType;
  isActive: boolean;
}

export enum StockReasonType {
  StockIn = 'StockIn',
  StockOut = 'StockOut',
  Both = 'Both'
}

export interface CreateStockReasonRequest {
  code: string;
  name: string;
  description?: string;
  type: StockReasonType;
}

export interface UpdateStockReasonRequest {
  id: number;
  code?: string;
  name?: string;
  description?: string;
  type?: StockReasonType;
  isActive?: boolean;
}
