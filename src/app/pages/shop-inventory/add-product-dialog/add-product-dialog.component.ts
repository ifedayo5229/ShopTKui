import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ProductService } from 'src/app/services/product/product.service';
import { ProductCategoryService } from 'src/app/services/product-category/product-category.service';
import { TenantContextService } from 'src/app/services/tenant-context/tenant-context.service';
import { CreateProductRequest } from 'src/app/models/product';
import { ProductCategory } from 'src/app/models/product-category';
import { isApiSuccess, getApiData } from 'src/app/models/api-response';

@Component({
  selector: 'app-add-product-dialog',
  templateUrl: './add-product-dialog.component.html',
  styleUrls: ['./add-product-dialog.component.scss']
})
export class AddProductDialogComponent implements OnInit {
  productForm: FormGroup;
  isLoading = false;
  categories: ProductCategory[] = [];
  isCreatingNewCategory = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddProductDialogComponent>,
    private productService: ProductService,
    private categoryService: ProductCategoryService,
    private tenantContext: TenantContextService
  ) {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      sku: [{value: '', disabled: true}],
      categoryId: [''],
      newCategoryName: [''],
      barcode: [''],
      description: [''],
      costPrice: [0, [Validators.required, Validators.min(0)]],
      sellingPrice: [0, [Validators.required, Validators.min(0)]],
      initialStock: [0, [Validators.min(0)]],
      lowStockThreshold: [10, [Validators.min(0)]],
      isTaxable: [false],
      taxPercentage: [0, [Validators.min(0), Validators.max(100)]]
    });
  }

  ngOnInit(): void {
    this.loadCategories();
    this.productForm.get('name')?.valueChanges.subscribe(name => {
      this.productForm.get('sku')?.setValue(this.generateSku(name));
    });
  }

  private generateSku(name: string): string {
    if (!name || name.trim().length === 0) return '';
    const prefix = name.trim()
      .toUpperCase()
      .replace(/[^A-Z0-9\s]/g, '')
      .split(/\s+/)
      .map(w => w.substring(0, 3))
      .join('')
      .substring(0, 6);
    const random = Math.floor(1000 + Math.random() * 9000);
    return `${prefix}-${random}`;
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

  onCategoryChange(event: any): void {
    if (event.value === 'new') {
      this.isCreatingNewCategory = true;
      this.productForm.get('newCategoryName')?.setValidators([Validators.required, Validators.minLength(2)]);
    } else {
      this.isCreatingNewCategory = false;
      this.productForm.get('newCategoryName')?.clearValidators();
      this.productForm.get('newCategoryName')?.setValue('');
    }
    this.productForm.get('newCategoryName')?.updateValueAndValidity();
  }

  cancelNewCategory(): void {
    this.isCreatingNewCategory = false;
    this.productForm.get('categoryId')?.setValue('');
    this.productForm.get('newCategoryName')?.clearValidators();
    this.productForm.get('newCategoryName')?.setValue('');
    this.productForm.get('newCategoryName')?.updateValueAndValidity();
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

    const categoryId = this.productForm.value.categoryId;
    const newCategoryName = this.productForm.value.newCategoryName;

    const request: CreateProductRequest = {
      shopId: shopId!,
      name: this.productForm.value.name,
      sku: this.productForm.getRawValue().sku,
      categoryId: categoryId && categoryId !== 'new' ? categoryId : undefined,
      newCategoryName: this.isCreatingNewCategory ? newCategoryName : undefined,
      barcode: this.productForm.value.barcode || undefined,
      description: this.productForm.value.description || undefined,
      costPrice: this.productForm.value.costPrice,
      sellingPrice: this.productForm.value.sellingPrice,
      initialStock: this.productForm.value.initialStock || 0,
      lowStockThreshold: this.productForm.value.lowStockThreshold || 10,
      isTaxable: this.productForm.value.isTaxable || false,
      taxPercentage: this.productForm.value.isTaxable ? (this.productForm.value.taxPercentage || 0) : 0
    };

    this.productService.create(request).subscribe({
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
}
