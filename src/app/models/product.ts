export interface Product {
  id: number;
  shopId: number;
  categoryId?: number;
  name: string;
  description?: string;
  sku: string;
  barcode?: string;
  costPrice: number;
  sellingPrice: number;
  imageUrl?: string;
  isTaxable: boolean;
  taxPercentage: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt?: Date;
  
  // Navigation properties
  categoryName?: string;
  currentStock?: number;
}

export interface CreateProductRequest {
  shopId: number | string;
  categoryId?: number;
  newCategoryName?: string; // If provided, creates a new category
  name: string;
  description?: string;
  sku: string;
  barcode?: string;
  costPrice: number;
  sellingPrice: number;
  initialStock?: number;
  lowStockThreshold?: number;
  isTaxable?: boolean;
  taxPercentage?: number;
}

export interface UpdateProductRequest {
  id: number;
  shopId: number | string;
  categoryId?: number;
  name: string;
  description?: string;
  sku: string;
  barcode?: string;
  costPrice: number;
  sellingPrice: number;
  lowStockThreshold?: number;
  unitOfMeasure?: string;
  imageUrl?: string;
  isTaxable?: boolean;
  taxPercentage?: number;
}
