export interface ProductCategory {
  id: number;
  shopId: number;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt?: Date;
  
  // Navigation
  productCount?: number;
}

export interface CreateProductCategoryRequest {
  shopId: number;
  name: string;
  description?: string;
}

export interface UpdateProductCategoryRequest {
  id: number;
  name?: string;
  description?: string;
  isActive?: boolean;
}
