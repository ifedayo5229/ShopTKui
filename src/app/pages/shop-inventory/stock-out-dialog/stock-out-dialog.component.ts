import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ShopInventoryService } from 'src/app/services/shop-inventory/shop-inventory.service';
import { TenantContextService } from 'src/app/services/tenant-context/tenant-context.service';
import { ShopInventory, RemoveStockRequest, StockRemovalReason } from 'src/app/models/shop-inventory';
import { isApiSuccess, getApiData } from 'src/app/models/api-response';

export interface StockOutDialogData {
  inventory: ShopInventory;
}

@Component({
  selector: 'app-stock-out-dialog',
  templateUrl: './stock-out-dialog.component.html',
  styleUrls: ['./stock-out-dialog.component.scss']
})
export class StockOutDialogComponent implements OnInit {
  stockForm: FormGroup;
  isLoading = false;
  reasons: StockRemovalReason[] = [];
  isLoadingReasons = false;
  isCreatingNewReason = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<StockOutDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: StockOutDialogData,
    private inventoryService: ShopInventoryService,
    private tenantContext: TenantContextService
  ) {
    this.stockForm = this.fb.group({
      quantity: [1, [Validators.required, Validators.min(1), Validators.max(data.inventory.quantity)]],
      reason: ['', [Validators.required]],
      newReasonName: [''],
      notes: ['']
    });
  }

  ngOnInit(): void {
    this.loadReasons();
  }

  loadReasons(): void {
    const shopId = this.tenantContext.currentShop?.id;
    if (!shopId) return;

    this.isLoadingReasons = true;
    this.inventoryService.getRemovalReasons(shopId).subscribe({
      next: (response) => {
        this.isLoadingReasons = false;
        const data = getApiData(response);
        if (isApiSuccess(response) && data) {
          this.reasons = data.filter(r => r.isActive);
        }
      },
      error: () => {
        this.isLoadingReasons = false;
        // Fallback to default reasons if API fails
        this.reasons = [
          { id: 1, shopId: shopId, code: 'damaged', name: 'Damaged/Expired', isActive: true },
          { id: 2, shopId: shopId, code: 'lost', name: 'Lost/Missing', isActive: true },
          { id: 3, shopId: shopId, code: 'adjustment', name: 'Stock Adjustment', isActive: true },
          { id: 4, shopId: shopId, code: 'return', name: 'Returned to Supplier', isActive: true },
          { id: 5, shopId: shopId, code: 'other', name: 'Other', isActive: true }
        ];
      }
    });
  }

  onReasonChange(event: any): void {
    if (event.value === 'new') {
      this.isCreatingNewReason = true;
      this.stockForm.get('newReasonName')?.setValidators([Validators.required, Validators.minLength(2)]);
      this.stockForm.get('reason')?.clearValidators();
    } else {
      this.isCreatingNewReason = false;
      this.stockForm.get('newReasonName')?.clearValidators();
      this.stockForm.get('newReasonName')?.setValue('');
      this.stockForm.get('reason')?.setValidators([Validators.required]);
    }
    this.stockForm.get('newReasonName')?.updateValueAndValidity();
    this.stockForm.get('reason')?.updateValueAndValidity();
  }

  cancelNewReason(): void {
    this.isCreatingNewReason = false;
    this.stockForm.get('reason')?.setValue('');
    this.stockForm.get('reason')?.setValidators([Validators.required]);
    this.stockForm.get('newReasonName')?.clearValidators();
    this.stockForm.get('newReasonName')?.setValue('');
    this.stockForm.get('newReasonName')?.updateValueAndValidity();
    this.stockForm.get('reason')?.updateValueAndValidity();
  }

  get newStockLevel(): number {
    const quantity = this.stockForm.get('quantity')?.value || 0;
    return Math.max(0, this.data.inventory.quantity - quantity);
  }

  onSubmit(): void {
    if (!this.stockForm.valid) return;

    this.isLoading = true;
    const shopId = this.tenantContext.currentShop?.id;

    const request: RemoveStockRequest = {
      productId: this.data.inventory.productId,
      shopId: shopId!,
      quantity: this.stockForm.value.quantity,
      notes: this.stockForm.value.notes
    };

    if (this.isCreatingNewReason) {
      // Pass the new reason name directly - backend will create it
      request.newReasonName = this.stockForm.value.newReasonName.trim();
    } else {
      request.reason = this.stockForm.value.reason;
    }

    this.inventoryService.removeStock(request).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (isApiSuccess(response)) {
          this.dialogRef.close(true);
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
