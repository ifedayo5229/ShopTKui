import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { TenantContextService } from 'src/app/services/tenant-context/tenant-context.service';
import { ShopInventoryService } from 'src/app/services/shop-inventory/shop-inventory.service';
import { SalesService } from 'src/app/services/sales/sales.service';
import { SubscriptionService } from 'src/app/services/subscription/subscription.service';
import { Sale } from 'src/app/models/sale';
import { TenantSubscription, SubscriptionStatus } from 'src/app/models/subscription';
import { isApiSuccess, getApiData } from 'src/app/models/api-response';
import { Chart, ChartConfiguration, registerables } from 'chart.js';

// Register Chart.js components
Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('revenueChart') revenueChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('salesChart') salesChartRef!: ElementRef<HTMLCanvasElement>;

  shopName = '';
  userName = '';

  // Stats
  totalProducts = 0;
  lowStockItems = 0;
  today = new Date();
  todaySales = 0;
  todayRevenue = 0;

  // Recent sales
  recentSales: Sale[] = [];
  isLoadingSales = false;

  // Charts
  revenueChart: Chart | null = null;
  salesChart: Chart | null = null;
  chartPeriod: 'week' | 'month' = 'week';
  private salesData: Sale[] = [];

  // Subscription
  subscription: TenantSubscription | null = null;
  showUpgradeBanner = false;
  isFreeTrial = false;
  isExpiringSoon = false;
  daysRemaining = 0;

  constructor(
    private router: Router,
    private tenantContext: TenantContextService,
    private inventoryService: ShopInventoryService,
    private salesService: SalesService,
    private subscriptionService: SubscriptionService
  ) {}

  ngOnInit(): void {
    const shop = this.tenantContext.currentShop;
    const user = this.tenantContext.currentUser;

    this.shopName = shop?.name || 'My Shop';
    this.userName = user?.firstName || 'User';

    this.loadStats();
    this.loadRecentSales();
    this.loadChartData();
    this.loadSubscription();
  }

  ngAfterViewInit(): void {
    // Charts will be initialized after data loads
  }

  ngOnDestroy(): void {
    this.revenueChart?.destroy();
    this.salesChart?.destroy();
  }

  loadStats(): void {
    const shopId = this.tenantContext.currentShop?.id;
    if (!shopId) return;

    // Load inventory stats
    this.inventoryService.getByShop(shopId).subscribe({
      next: (response) => {
        const data = getApiData(response);
        if (isApiSuccess(response) && data) {
          this.totalProducts = data.length;
          this.lowStockItems = data.filter(
            item => item.status === 'Low Stock' || item.status === 'Out of Stock'
          ).length;
        }
      }
    });

    // Load today's sales
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    this.salesService.getByDateRange(today, endOfDay, shopId).subscribe({
      next: (response) => {
        const data = getApiData(response);
        if (isApiSuccess(response) && data) {
          this.todaySales = data.length;
          this.todayRevenue = data.reduce(
            (sum, sale) => sum + (sale.totalAmount || 0), 0
          );
        }
      }
    });
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  navigateToUpgrade(): void {
    this.router.navigate(['/home/subscription/upgrade']);
  }

  loadSubscription(): void {
    this.subscriptionService.getMySubscription().subscribe({
      next: (response) => {
        const data = getApiData(response);
        if (isApiSuccess(response) && data) {
          this.subscription = data;
          this.daysRemaining = data.daysRemaining || 0;
          this.isFreeTrial = data.status === SubscriptionStatus.Trial;
          this.isExpiringSoon = this.daysRemaining <= 7 && this.daysRemaining > 0;

          // Show upgrade banner for free trial or expiring soon
          this.showUpgradeBanner = this.isFreeTrial || this.isExpiringSoon;
        }
      },
      error: (err) => {
        console.error('Error loading subscription', err);
      }
    });
  }

  dismissUpgradeBanner(): void {
    this.showUpgradeBanner = false;
    // Optionally store in localStorage to not show again for a day
    localStorage.setItem('upgradeBannerDismissed', new Date().toISOString());
  }

  getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  }

  getTimeIcon(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'wb_sunny';
    if (hour < 17) return 'wb_twilight';
    return 'nightlight';
  }

  loadRecentSales(): void {
    this.isLoadingSales = true;
    const shopId = this.tenantContext.currentShop?.id;
    if (!shopId) {
      this.isLoadingSales = false;
      return;
    }

    // Get sales from last 7 days
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7);

    this.salesService.getByDateRange(startDate, endDate, shopId).subscribe({
      next: (response) => {
        this.isLoadingSales = false;
        const data = getApiData(response);
        if (isApiSuccess(response) && data) {
          // Sort by date descending and take last 5
          this.recentSales = data
            .sort((a, b) => new Date(b.saleDate).getTime() - new Date(a.saleDate).getTime())
            .slice(0, 5);
        }
      },
      error: () => {
        this.isLoadingSales = false;
      }
    });
  }

  loadChartData(): void {
    const shopId = this.tenantContext.currentShop?.id;
    if (!shopId) return;

    const days = this.chartPeriod === 'week' ? 7 : 30;
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    this.salesService.getByDateRange(startDate, endDate, shopId).subscribe({
      next: (response) => {
        const data = getApiData(response);
        if (isApiSuccess(response) && data) {
          this.salesData = data;
          this.renderCharts();
        }
      }
    });
  }

  setChartPeriod(period: 'week' | 'month'): void {
    this.chartPeriod = period;
    this.loadChartData();
  }

  private renderCharts(): void {
    const days = this.chartPeriod === 'week' ? 7 : 30;
    const labels: string[] = [];
    const revenueData: number[] = [];
    const salesCountData: number[] = [];

    // Build data for each day
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);

      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      const daySales = this.salesData.filter(sale => {
        const saleDate = new Date(sale.saleDate);
        return saleDate >= date && saleDate < nextDate;
      });

      labels.push(date.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' }));
      revenueData.push(daySales.reduce((sum, sale) => sum + (sale.totalAmount || 0), 0));
      salesCountData.push(daySales.length);
    }

    this.createRevenueChart(labels, revenueData);
    this.createSalesChart(labels, salesCountData);
  }

  private createRevenueChart(labels: string[], data: number[]): void {
    if (!this.revenueChartRef?.nativeElement) return;

    this.revenueChart?.destroy();

    const ctx = this.revenueChartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    const gradient = ctx.createLinearGradient(0, 0, 0, 200);
    gradient.addColorStop(0, 'rgba(15, 124, 92, 0.3)');
    gradient.addColorStop(1, 'rgba(15, 124, 92, 0.02)');

    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const textColor = isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)';
    const gridColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)';

    this.revenueChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          data,
          borderColor: '#0f7c5c',
          backgroundColor: gradient,
          fill: true,
          tension: 0.4,
          borderWidth: 2,
          pointBackgroundColor: '#0f7c5c',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: isDark ? '#17231e' : '#fff',
            titleColor: isDark ? '#fff' : '#111827',
            bodyColor: isDark ? '#a9bbb2' : '#6b7280',
            borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
            borderWidth: 1,
            padding: 12,
            displayColors: false,
            callbacks: {
              label: (context) => `â‚¦${context.raw?.toLocaleString()}`
            }
          }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: textColor, font: { size: 11 } }
          },
          y: {
            grid: { color: gridColor },
            ticks: {
              color: textColor,
              font: { size: 11 },
              callback: (value) => 'â‚¦' + Number(value).toLocaleString()
            }
          }
        }
      }
    });
  }

  private createSalesChart(labels: string[], data: number[]): void {
    if (!this.salesChartRef?.nativeElement) return;

    this.salesChart?.destroy();

    const ctx = this.salesChartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const textColor = isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)';
    const gridColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)';

    this.salesChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          data,
          backgroundColor: '#22c55e',
          borderRadius: 6,
          barThickness: this.chartPeriod === 'week' ? 24 : 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: isDark ? '#17231e' : '#fff',
            titleColor: isDark ? '#fff' : '#111827',
            bodyColor: isDark ? '#a9bbb2' : '#6b7280',
            borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
            borderWidth: 1,
            padding: 12,
            displayColors: false,
            callbacks: {
              label: (context) => `${context.raw} sales`
            }
          }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: textColor, font: { size: 11 } }
          },
          y: {
            grid: { color: gridColor },
            ticks: { color: textColor, font: { size: 11 }, stepSize: 1 }
          }
        }
      }
    });
  }
}
