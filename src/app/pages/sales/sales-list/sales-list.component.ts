import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { SalesService } from 'src/app/services/sales/sales.service';
import { TenantContextService } from 'src/app/services/tenant-context/tenant-context.service';
import { Sale, PaymentMethod, PaymentStatus } from 'src/app/models/sale';
import { SaleDetailsDialogComponent } from '../sale-details-dialog/sale-details-dialog.component';
import { isApiSuccess, getApiData } from 'src/app/models/api-response';

@Component({
  selector: 'app-sales-list',
  templateUrl: './sales-list.component.html',
  styleUrls: ['./sales-list.component.scss']
})
export class SalesListComponent implements OnInit {
  displayedColumns: string[] = ['invoiceNumber', 'customer', 'items', 'totalAmount', 'paymentMethod', 'date', 'actions'];
  dataSource = new MatTableDataSource<Sale>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  isLoading = false;
  showFilters = false;

  // Stats
  totalSales = 0;
  totalRevenue = 0;
  todaySales = 0;
  todayRevenue = 0;

  // Filters
  searchTerm = '';
  selectedPaymentMethod: PaymentMethod | '' = '';
  selectedPaymentStatus: PaymentStatus | '' = '';
  dateRange: { start: Date | null; end: Date | null } = { start: null, end: null };
  filterPreset: 'today' | 'week' | 'month' | 'all' = 'today';

  paymentMethods = Object.values(PaymentMethod);
  paymentStatuses = Object.values(PaymentStatus);

  constructor(
    private salesService: SalesService,
    private tenantContext: TenantContextService,
    private dialog: MatDialog,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.setDatePreset('today');
    this.loadSales();
    this.setupFilterPredicate();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  setupFilterPredicate(): void {
    this.dataSource.filterPredicate = (data: Sale, filter: string): boolean => {
      const searchMatch = !this.searchTerm ||
        !!(data.invoiceNumber?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        data.customerName?.toLowerCase().includes(this.searchTerm.toLowerCase()));

      const paymentMethodMatch = !this.selectedPaymentMethod ||
        data.paymentMethod === this.selectedPaymentMethod;

      const paymentStatusMatch = !this.selectedPaymentStatus ||
        data.paymentStatus === this.selectedPaymentStatus;

      return searchMatch && paymentMethodMatch && paymentStatusMatch;
    };
  }

  setDatePreset(preset: 'today' | 'week' | 'month' | 'all'): void {
    this.filterPreset = preset;
    const now = new Date();

    switch (preset) {
      case 'today':
        this.dateRange.start = new Date(now.setHours(0, 0, 0, 0));
        this.dateRange.end = new Date();
        this.dateRange.end.setHours(23, 59, 59, 999);
        break;
      case 'week':
        // Use Monday as start of week (ISO standard)
        const weekStart = new Date(now);
        const dayOfWeek = now.getDay();
        // If Sunday (0), go back 6 days; otherwise go back (day - 1) days to get to Monday
        const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
        weekStart.setDate(now.getDate() - daysToMonday);
        weekStart.setHours(0, 0, 0, 0);
        this.dateRange.start = weekStart;
        this.dateRange.end = new Date();
        this.dateRange.end.setHours(23, 59, 59, 999);
        break;
      case 'month':
        this.dateRange.start = new Date(now.getFullYear(), now.getMonth(), 1);
        this.dateRange.end = new Date();
        this.dateRange.end.setHours(23, 59, 59, 999);
        break;
      case 'all':
        this.dateRange.start = null;
        this.dateRange.end = null;
        break;
    }
    this.loadSales();
  }

  loadSales(): void {
    const shopId = this.tenantContext.currentShop?.id;
    if (!shopId) return;

    this.isLoading = true;

    if (this.dateRange.start && this.dateRange.end) {
      this.salesService.getByDateRange(this.dateRange.start, this.dateRange.end, shopId).subscribe({
        next: (response) => {
          this.handleSalesResponse(response);
        },
        error: () => {
          this.isLoading = false;
          this.toastr.error('Failed to load sales', 'Error');
        }
      });
    } else {
      this.salesService.getByShop(shopId).subscribe({
        next: (response) => {
          this.handleSalesResponse(response);
        },
        error: () => {
          this.isLoading = false;
          this.toastr.error('Failed to load sales', 'Error');
        }
      });
    }
  }

  private handleSalesResponse(response: any): void {
    this.isLoading = false;
    const data = getApiData<Sale[]>(response);
    if (isApiSuccess(response) && data) {
      this.dataSource.data = data;
      this.calculateStats(data);
    }
  }

  private calculateStats(sales: Sale[]): void {
    this.totalSales = sales.length;
    this.totalRevenue = sales.reduce((sum, sale) => sum + (sale.totalAmount || 0), 0);

    // Calculate today's stats
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todaysSales = sales.filter(sale => {
      const saleDate = new Date(sale.saleDate);
      saleDate.setHours(0, 0, 0, 0);
      return saleDate.getTime() === today.getTime();
    });
    this.todaySales = todaysSales.length;
    this.todayRevenue = todaysSales.reduce((sum, sale) => sum + (sale.totalAmount || 0), 0);
  }

  applyFilters(): void {
    this.dataSource.filter = 'trigger';
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedPaymentMethod = '';
    this.selectedPaymentStatus = '';
    this.applyFilters();
  }

  onDateChange(): void {
    this.filterPreset = 'all';
    if (this.dateRange.start && this.dateRange.end) {
      this.loadSales();
    }
  }

  viewDetails(sale: Sale): void {
    this.dialog.open(SaleDetailsDialogComponent, {
      width: '600px',
      data: { sale }
    });
  }

  downloadInvoice(sale: Sale): void {
    this.salesService.downloadInvoice(sale.id).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${sale.invoiceNumber}.pdf`;
        link.click();
        window.URL.revokeObjectURL(url);
        this.toastr.success('Invoice downloaded', 'Success');
      },
      error: () => {
        this.toastr.error('Failed to download invoice', 'Error');
      }
    });
  }

  deleteSale(sale: Sale): void {
    if (!confirm(`Are you sure you want to delete sale ${sale.invoiceNumber}?`)) return;

    this.salesService.delete(sale.id).subscribe({
      next: (response) => {
        if (isApiSuccess(response)) {
          this.toastr.success('Sale deleted successfully', 'Success');
          this.loadSales();
        }
      },
      error: () => {
        this.toastr.error('Failed to delete sale', 'Error');
      }
    });
  }

  getPaymentMethodIcon(method: PaymentMethod): string {
    const icons: Record<PaymentMethod, string> = {
      [PaymentMethod.Cash]: 'payments',
      [PaymentMethod.Card]: 'credit_card',
      [PaymentMethod.BankTransfer]: 'account_balance',
      [PaymentMethod.MobileMoney]: 'phone_android',
      [PaymentMethod.Credit]: 'receipt_long'
    };
    return icons[method] || 'payment';
  }

  getPaymentStatusClass(status: PaymentStatus): string {
    const classes: Record<PaymentStatus, string> = {
      [PaymentStatus.Paid]: 'status-paid',
      [PaymentStatus.Pending]: 'status-pending',
      [PaymentStatus.PartiallyPaid]: 'status-partial',
      [PaymentStatus.Cancelled]: 'status-cancelled'
    };
    return classes[status] || '';
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(amount);
  }

  navigateToPos(): void {
    // Navigate to POS
  }
}
