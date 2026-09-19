import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProductService } from 'src/app/services/product/product.service';
import { ProductCategoryService } from 'src/app/services/product-category/product-category.service';
import { TenantContextService } from 'src/app/services/tenant-context/tenant-context.service';
import { UpdateProductRequest } from 'src/app/models/product';
import { ProductCategory } from 'src/app/models/product-category';
import { ShopInventory } from 'src/app/models/shop-inventory';
import { isApiSuccess, getApiData } from 'src/app/models/api-response';

@Component({
  selector: 'app-edit-product-dialog',
  templateUrl: './edit-product-dialog.component.html',
  styleUrls: ['./edit-product-dialog.component.scss']
})
export class EditProductDialogComponent implements OnInit {
  productForm: FormGroup;
  isLoading = false;
  categories: ProductCategory[] = [];
  product: ShopInventory;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditProductDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { product: ShopInventory },
    private productService: ProductService,
    private categoryService: ProductCategoryService,
    private tenantContext: TenantContextService
  ) {
    this.product = data.product;
    this.productForm = this.fb.group({
      name: [this.product.product, [Validators.required, Validators.minLength(2)]],
      sku: [this.product.sku, [Validators.required]],
      categoryId: [this.product.categoryId || ''],
      barcode: [this.product.barcode || ''],
      description: [this.product.description || ''],
      costPrice: [this.product.costPrice, [Validators.required, Validators.min(0)]],
      sellingPrice: [this.product.price, [Validators.required, Validators.min(0)]],
      lowStockThreshold: [this.product.reorderLevel || 10, [Validators.min(0)]],
      isTaxable: [this.product.isTaxable || false],
      taxPercentage: [this.product.taxPercentage || 0, [Validators.min(0), Validators.max(100)]]
    });
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    const shopId = this.tenantContext.currentShop?.id;
    if (shopId) {
      this.categoryService.getByShop(shopId).subscribe({
        next: (response) => {
          const data = getApiData(response);
          if (isApiSuccess(response) && data) {
            this.categories = data;
          }
        }
      });
    }
  }

  get profitMargin(): number | null {
    const cost = this.productForm.get('costPrice')?.value;
    const selling = this.productForm.get('sellingPrice')?.value;
    
    if (cost && selling && cost > 0) {
      return ((selling - cost) / cost) * 100;
    }
    return null;
  }

  onSubmit(): void {
    if (!this.productForm.valid) return;

    this.isLoading = true;
    const shopId = this.tenantContext.currentShop?.id;

    const request: UpdateProductRequest = {
      id: this.product.productId,
      shopId: shopId!,
      categoryId: this.productForm.value.categoryId || undefined,
      name: this.productForm.value.name,
      description: this.productForm.value.description || undefined,
      sku: this.productForm.value.sku,
      barcode: this.productForm.value.barcode || undefined,
      costPrice: this.productForm.value.costPrice,
      sellingPrice: this.productForm.value.sellingPrice,
      lowStockThreshold: this.productForm.value.lowStockThreshold || 10,
      isTaxable: this.productForm.value.isTaxable || false,
      taxPercentage: this.productForm.value.isTaxable ? (this.productForm.value.taxPercentage || 0) : 0
    };

    this.productService.update(request).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (isApiSuccess(response)) {
          this.dialogRef.close(getApiData(response));
        } else {
          this.dialogRef.close(false);
        }
      },
      error: () => {
        this.isLoading = false;
        this.dialogRef.close(false);
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  getStockClass(): string {
    if (this.product.status === 'Out of Stock' || this.product.quantity === 0) return 'out-of-stock';
    if (this.product.status === 'Low Stock') return 'low-stock';
    return 'in-stock';
  }
}
