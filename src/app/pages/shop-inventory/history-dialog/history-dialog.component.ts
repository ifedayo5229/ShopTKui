import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProductHistoryService } from 'src/app/services/product-history/product-history.service';
import { ProductHistory, ProductActivityType } from 'src/app/models/product-history';
import { ShopInventory } from 'src/app/models/shop-inventory';
import { isApiSuccess, getApiData } from 'src/app/models/api-response';

export interface HistoryDialogData {
  inventory: ShopInventory;
}

@Component({
  selector: 'app-history-dialog',
  templateUrl: './history-dialog.component.html',
  styleUrls: ['./history-dialog.component.scss']
})
export class HistoryDialogComponent implements OnInit {
  history: ProductHistory[] = [];
  filteredHistory: ProductHistory[] = [];
  isLoading = false;
  
  // Filters
  selectedType: ProductActivityType | '' = '';
  dateRange: { start: Date | null; end: Date | null } = { start: null, end: null };
  
  activityTypes: { value: ProductActivityType | ''; label: string }[] = [
    { value: '', label: 'All Activities' },
    { value: 'StockAdded', label: 'Stock Added' },
    { value: 'StockRemoved', label: 'Stock Removed' },
    { value: 'Sale', label: 'Sales' },
    { value: 'SaleReturned', label: 'Returns' },
    { value: 'PriceChanged', label: 'Price Changes' },
    { value: 'ProductUpdated', label: 'Product Updates' },
    { value: 'LowStockAlert', label: 'Low Stock Alerts' }
  ];

  constructor(
    private dialogRef: MatDialogRef<HistoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: HistoryDialogData,
    private historyService: ProductHistoryService
  ) {}

  ngOnInit(): void {
    this.loadHistory();
  }

  loadHistory(): void {
    this.isLoading = true;
    this.historyService.getByProduct(this.data.inventory.productId).subscribe({
      next: (response) => {
        this.isLoading = false;
        const data = getApiData(response);
        if (isApiSuccess(response) && data) {
          this.history = data;
          this.applyFilters();
        }
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  applyFilters(): void {
    let filtered = [...this.history];
    
    if (this.selectedType) {
      filtered = filtered.filter(h => h.activityType === this.selectedType);
    }
    
    if (this.dateRange.start) {
      const startDate = new Date(this.dateRange.start);
      startDate.setHours(0, 0, 0, 0);
      filtered = filtered.filter(h => new Date(h.createdDate) >= startDate);
    }
    
    if (this.dateRange.end) {
      const endDate = new Date(this.dateRange.end);
      endDate.setHours(23, 59, 59, 999);
      filtered = filtered.filter(h => new Date(h.createdDate) <= endDate);
    }
    
    this.filteredHistory = filtered;
  }

  onTypeChange(): void {
    this.applyFilters();
  }

  onDateChange(): void {
    this.applyFilters();
  }

  clearFilters(): void {
    this.selectedType = '';
    this.dateRange = { start: null, end: null };
    this.applyFilters();
  }

  getActivityIcon(type: ProductActivityType): string {
    const icons: Record<ProductActivityType, string> = {
      'ProductCreated': 'add_box',
      'ProductUpdated': 'edit',
      'ProductDeleted': 'delete',
      'StockAdded': 'add_circle',
      'StockRemoved': 'remove_circle',
      'StockAdjusted': 'tune',
      'Sale': 'shopping_cart',
      'SaleReturned': 'assignment_return',
      'PriceChanged': 'attach_money',
      'CategoryChanged': 'category',
      'LowStockAlert': 'warning'
    };
    return icons[type] || 'history';
  }

  getActivityColor(type: ProductActivityType): string {
    const colors: Record<ProductActivityType, string> = {
      'ProductCreated': '#22c55e',
      'ProductUpdated': '#3b82f6',
      'ProductDeleted': '#ef4444',
      'StockAdded': '#22c55e',
      'StockRemoved': '#f97316',
      'StockAdjusted': '#0ea5a4',
      'Sale': '#0f7c5c',
      'SaleReturned': '#eab308',
      'PriceChanged': '#14b8a6',
      'CategoryChanged': '#ec4899',
      'LowStockAlert': '#f97316'
    };
    return colors[type] || '#6b7280';
  }

  getQuantityChangeClass(change: number | undefined): string {
    if (!change) return '';
    return change > 0 ? 'positive' : 'negative';
  }

  formatQuantityChange(change: number | undefined): string {
    if (!change) return '-';
    return change > 0 ? `+${change}` : `${change}`;
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
