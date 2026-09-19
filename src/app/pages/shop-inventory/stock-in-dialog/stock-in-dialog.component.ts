import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ShopInventoryService } from 'src/app/services/shop-inventory/shop-inventory.service';
import { TenantContextService } from 'src/app/services/tenant-context/tenant-context.service';
import { ShopInventory, AddStockRequest } from 'src/app/models/shop-inventory';
import { isApiSuccess } from 'src/app/models/api-response';

export interface StockInDialogData {
  inventory: ShopInventory;
}

@Component({
  selector: 'app-stock-in-dialog',
  templateUrl: './stock-in-dialog.component.html',
  styleUrls: ['./stock-in-dialog.component.scss']
})
export class StockInDialogComponent {
  stockForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<StockInDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: StockInDialogData,
    private inventoryService: ShopInventoryService,
    private tenantContext: TenantContextService
  ) {
    this.stockForm = this.fb.group({
      quantity: [1, [Validators.required, Validators.min(1)]],
      referenceNumber: [''],
      notes: ['']
    });
  }

  onSubmit(): void {
    if (!this.stockForm.valid) return;

    this.isLoading = true;
    const shopId = this.tenantContext.currentShop?.id;

    const request: AddStockRequest = {
      productId: this.data.inventory.productId,
      shopId: shopId!,
      quantity: this.stockForm.value.quantity,
      referenceNumber: this.stockForm.value.referenceNumber,
      notes: this.stockForm.value.notes
    };

    this.inventoryService.addStock(request).subscribe({
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
