import { Component, OnInit } from '@angular/core';
import { SalesService } from 'src/app/services/sales/sales.service';
import { ShopInventoryService } from 'src/app/services/shop-inventory/shop-inventory.service';
import { TenantContextService } from 'src/app/services/tenant-context/tenant-context.service';
import { Sale, PaymentMethod } from 'src/app/models/sale';
import { ShopInventory } from 'src/app/models/shop-inventory';
import { isApiSuccess, getApiData } from 'src/app/models/api-response';

interface TopProduct {
  name: string;
  totalQty: number;
  totalRevenue: number;
}

interface PaymentBreakdown {
  method: string;
  count: number;
  total: number;
}

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {
  isLoading = true;
  
  // Date range
  startDate: Date;
  endDate: Date;
  maxDate = new Date();

  // Summary stats
  totalRevenue = 0;
  totalSales = 0;
  totalItemsSold = 0;
  averageOrderValue = 0;
  totalTaxCollected = 0;
  totalDiscount = 0;

  // Top products
  topProducts: TopProduct[] = [];

  // Payment breakdown
  paymentBreakdown: PaymentBreakdown[] = [];

  // Low stock
  lowStockItems: ShopInventory[] = [];

  // Recent sales
  recentSales: Sale[] = [];

  // Inventory stats
  totalProducts = 0;
  inStockCount = 0;
  lowStockCount = 0;
  outOfStockCount = 0;
  totalInventoryValue = 0;

  constructor(
    private salesService: SalesService,
    private inventoryService: ShopInventoryService,
    private tenantContext: TenantContextService
  ) {
    // Default: current month
    const now = new Date();
    this.startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    this.endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
  }

  ngOnInit(): void {
    this.loadReport();
  }

  loadReport(): void {
    this.isLoading = true;
    const shopId = this.tenantContext.currentShop?.id;
    if (!shopId) return;

    // Load sales and inventory in parallel
    this.loadSalesData(shopId);
    this.loadInventoryData(shopId);
  }

  private loadSalesData(shopId: number | string): void {
    this.salesService.getByDateRange(this.startDate, this.endDate, shopId).subscribe({
      next: (response) => {
        const data = getApiData(response);
        if (isApiSuccess(response) && data) {
          this.processSalesData(data);
        }
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  private loadInventoryData(shopId: number | string): void {
    this.inventoryService.getByShop(shopId).subscribe({
      next: (response) => {
        const data = getApiData(response);
        if (isApiSuccess(response) && data) {
          this.processInventoryData(data);
        }
      }
    });
  }

  private processSalesData(sales: Sale[]): void {
    this.totalSales = sales.length;
    this.totalRevenue = sales.reduce((sum, s) => sum + s.totalAmount, 0);
    this.totalTaxCollected = sales.reduce((sum, s) => sum + (s.tax || 0), 0);
    this.totalDiscount = sales.reduce((sum, s) => sum + (s.discount || 0), 0);
    this.averageOrderValue = this.totalSales > 0 ? this.totalRevenue / this.totalSales : 0;

    // Count total items sold
    this.totalItemsSold = sales.reduce((sum, s) => {
      const items = s.items || s.saleItems || [];
      return sum + items.reduce((iSum, item) => iSum + item.quantity, 0);
    }, 0);

    // Top products
    const productMap = new Map<string, TopProduct>();
    sales.forEach(sale => {
      const items = sale.items || sale.saleItems || [];
      items.forEach(item => {
        const key = item.productName || `Product #${item.productId}`;
        const existing = productMap.get(key);
        if (existing) {
          existing.totalQty += item.quantity;
          existing.totalRevenue += item.totalPrice;
        } else {
          productMap.set(key, { name: key, totalQty: item.quantity, totalRevenue: item.totalPrice });
        }
      });
    });
    this.topProducts = Array.from(productMap.values())
      .sort((a, b) => b.totalRevenue - a.totalRevenue)
      .slice(0, 10);

    // Payment breakdown
    const paymentMap = new Map<string, PaymentBreakdown>();
    sales.forEach(sale => {
      const method = sale.paymentMethod?.toString() || 'Other';
      const existing = paymentMap.get(method);
      if (existing) {
        existing.count++;
        existing.total += sale.totalAmount;
      } else {
        paymentMap.set(method, { method, count: 1, total: sale.totalAmount });
      }
    });
    this.paymentBreakdown = Array.from(paymentMap.values()).sort((a, b) => b.total - a.total);

    // Recent sales (last 10)
    this.recentSales = [...sales].sort((a, b) => 
      new Date(b.saleDate).getTime() - new Date(a.saleDate).getTime()
    ).slice(0, 10);
  }

  private processInventoryData(inventory: ShopInventory[]): void {
    this.totalProducts = inventory.length;
    this.inStockCount = inventory.filter(i => i.status === 'In Stock').length;
    this.lowStockCount = inventory.filter(i => i.status === 'Low Stock').length;
    this.outOfStockCount = inventory.filter(i => i.status === 'Out of Stock' || i.quantity === 0).length;
    this.totalInventoryValue = inventory.reduce((sum, i) => sum + (i.costPrice * i.quantity), 0);
    this.lowStockItems = inventory
      .filter(i => i.status === 'Low Stock' || i.quantity === 0)
      .sort((a, b) => a.quantity - b.quantity)
      .slice(0, 10);
  }

  onDateChange(): void {
    if (this.startDate && this.endDate) {
      this.loadReport();
    }
  }

  setDateRange(range: 'today' | 'week' | 'month' | 'year'): void {
    const now = new Date();
    switch (range) {
      case 'today':
        this.startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        this.endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
        break;
      case 'week':
        const dayOfWeek = now.getDay();
        this.startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - dayOfWeek);
        this.endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
        break;
      case 'month':
        this.startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        this.endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
        break;
      case 'year':
        this.startDate = new Date(now.getFullYear(), 0, 1);
        this.endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
        break;
    }
    this.loadReport();
  }

  getStockClass(item: ShopInventory): string {
    if (item.quantity === 0) return 'out-of-stock';
    if (item.status === 'Low Stock') return 'low-stock';
    return 'in-stock';
  }

  getPaymentIcon(method: string): string {
    switch (method) {
      case 'Cash': return 'payments';
      case 'Card': return 'credit_card';
      case 'BankTransfer': return 'account_balance';
      case 'MobileMoney': return 'phone_android';
      case 'Credit': return 'schedule';
      default: return 'payment';
    }
  }
}
