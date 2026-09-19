export interface ShopInventory {
  id: number;
  productId: number;
  product: string;          // Product name
  description?: string;
  sku: string;
  barcode?: string;
  categoryId?: number;
  category?: string;        // Category name
  costPrice: number;
  price: number;            // Selling price
  quantity: number;
  stock: number;
  reorderLevel: number;     // Low stock threshold
  status: string;           // "In Stock", "Low Stock", "Out of Stock"
  isTaxable: boolean;
  taxPercentage: number;
  isActive: boolean;
  lastRestockedDate?: Date;
  lastSoldDate?: Date;
}

export interface AddStockRequest {
  productId: number;
  shopId: number | string;
  quantity: number;
  notes?: string;
  referenceNumber?: string;
}

export interface RemoveStockRequest {
  productId: number;
  shopId: number | string;
  quantity: number;
  reason?: string;
  newReasonName?: string;  // For creating a new reason on the fly
  notes?: string;
}

export interface LowStockItem {
  inventoryId: number;
  productId: number;
  productName: string;
  productSku: string;
  currentStock: number;
  lowStockThreshold: number;
  deficit: number;
}

export interface StockRemovalReason {
  id: number;
  shopId: number | string;
  code: string;
  name: string;
  description?: string;
  isActive: boolean;
}

export interface CreateRemovalReasonRequest {
  shopId: number | string;
  code: string;
  name: string;
  description?: string;
}
