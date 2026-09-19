import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ShopInventory } from 'src/app/models/shop-inventory';

@Component({
  selector: 'app-product-details-dialog',
  templateUrl: './product-details-dialog.component.html',
  styleUrls: ['./product-details-dialog.component.scss']
})
export class ProductDetailsDialogComponent {
  product: ShopInventory;

  constructor(
    private dialogRef: MatDialogRef<ProductDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { product: ShopInventory }
  ) {
    this.product = data.product;
  }

  onClose(): void {
    this.dialogRef.close();
  }

  getStockClass(): string {
    if (this.product.status === 'Out of Stock' || this.product.quantity === 0) return 'out-of-stock';
    if (this.product.status === 'Low Stock') return 'low-stock';
    return 'in-stock';
  }

  getStatusClass(): string {
    return this.getStockClass();
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(amount);
  }

  getProfitMargin(): number | null {
    const cost = this.product.costPrice;
    const selling = this.product.price;
    
    if (cost && selling && cost > 0) {
      return ((selling - cost) / cost) * 100;
    }
    return null;
  }

  getProfit(): number {
    return this.product.price - this.product.costPrice;
  }
}
