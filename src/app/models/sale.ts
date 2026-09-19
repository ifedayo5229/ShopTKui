export interface Sale {
  id: number;
  shopId: number;
  shopName?: string;
  invoiceNumber: string;
  customerId?: number;
  customerName?: string;
  customerPhone?: string;
  subTotal: number;
  totalAmount: number;
  discount: number;
  tax: number;
  amountPaid: number;
  changeGiven: number;
  paymentMethod: PaymentMethod | string;
  paymentStatus?: PaymentStatus;
  notes?: string;
  soldBy?: string;
  createdBy?: string;
  saleDate: Date | string;
  createdAt?: Date | string;
  
  // Navigation - API returns 'items' not 'saleItems'
  items?: SaleItem[];
  saleItems?: SaleItem[];
}

export interface SaleItem {
  id: number;
  saleId?: number;
  productId: number;
  productName?: string;
  productSku?: string;
  productSKU?: string; // API returns uppercase
  quantity: number;
  unitPrice: number;
  discount: number;
  totalPrice: number;
}

export interface ProcessSaleRequest {
  shopId: number | string;
  customerId?: number;
  customerName?: string;
  discount?: number;
  tax?: number;
  paymentMethod: PaymentMethod;
  notes?: string;
  saleDate?: Date | string;
  items: SaleItemRequest[];
}

export interface SaleItemRequest {
  productId: number;
  quantity: number;
  discount?: number;
}

export interface DailySales {
  date: Date | string;
  totalSales: number;
  totalAmount: number;
  totalItems: number;
}

export interface SalesStats {
  totalSales: number;
  totalRevenue: number;
  totalItems: number;
  averageOrderValue: number;
}

export interface SalesFilter {
  shopId?: number | string;
  startDate?: Date | string;
  endDate?: Date | string;
  paymentMethod?: PaymentMethod;
  paymentStatus?: PaymentStatus;
  searchTerm?: string;
}

export enum PaymentMethod {
  Cash = 'Cash',
  Card = 'Card',
  BankTransfer = 'BankTransfer',
  MobileMoney = 'MobileMoney',
  Credit = 'Credit'
}

export enum PaymentStatus {
  Pending = 'Pending',
  Paid = 'Paid',
  PartiallyPaid = 'PartiallyPaid',
  Cancelled = 'Cancelled'
}
