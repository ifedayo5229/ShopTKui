import { Component, OnInit, HostListener, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { TenantContextService } from 'src/app/services/tenant-context/tenant-context.service';
import { ThemeService } from '../../services/shared/theme.service';
import { SubscriptionService } from 'src/app/services/subscription/subscription.service';
import { ShopInventoryService } from 'src/app/services/shop-inventory/shop-inventory.service';
import { isApiSuccess, getApiData } from 'src/app/models/api-response';
import { TenantSubscription, SubscriptionStatus } from 'src/app/models/subscription';
import { ShopInventory } from 'src/app/models/shop-inventory';

interface NavItem {
  label: string;
  description: string;
  icon: string;
  route: string;
  color: string;
  keywords: string[];
}

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  userName = '';
  userInitials = '';
  userEmail = '';
  isDarkMode = false;

  // Subscription
  subscription: TenantSubscription | null = null;
  showUpgradeButton = false;
  isFreeTrial = false;
  daysRemaining = 0;

  // Search
  isSearchOpen = false;
  searchQuery = '';
  selectedIndex = 0;
  allProducts: ShopInventory[] = [];
  filteredProducts: ShopInventory[] = [];
  filteredNavItems: NavItem[] = [];

  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;

  quickNavItems: NavItem[] = [
    { label: 'Dashboard', description: 'Overview and analytics', icon: 'dashboard', route: '/home/dashboard', color: 'blue', keywords: ['dashboard', 'home', 'overview', 'analytics'] },
    { label: 'Inventory', description: 'Manage products and stock', icon: 'inventory_2', route: '/home/inventory', color: 'green', keywords: ['inventory', 'products', 'stock', 'items'] },
    { label: 'Point of Sale', description: 'Process sales and checkout', icon: 'point_of_sale', route: '/home/pos', color: 'teal', keywords: ['pos', 'sale', 'sell', 'checkout', 'point of sale'] },
    { label: 'Sales History', description: 'View past transactions', icon: 'receipt_long', route: '/home/sales', color: 'orange', keywords: ['sales', 'history', 'transactions', 'invoices', 'receipts'] },
    { label: 'Reports', description: 'Sales and inventory reports', icon: 'assessment', route: '/home/reports', color: 'red', keywords: ['reports', 'analytics', 'charts', 'summary', 'revenue'] },
    { label: 'Settings', description: 'Shop and account settings', icon: 'settings', route: '/home/settings', color: 'gray', keywords: ['settings', 'configuration', 'account', 'shop'] },
  ];

  constructor(
    private router: Router,
    private tenantContext: TenantContextService,
    private themeService: ThemeService,
    private subscriptionService: SubscriptionService,
    private inventoryService: ShopInventoryService
  ) {}

  ngOnInit(): void {
    const user = this.tenantContext.currentUser;
    if (user) {
      this.userName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'User';
      this.userInitials = `${user.firstName?.charAt(0) || ''}${user.lastName?.charAt(0) || ''}`.toUpperCase() || 'U';
      this.userEmail = user.email || '';
    }

    this.themeService.isDarkMode$.subscribe((isDark: boolean) => {
      this.isDarkMode = isDark;
    });

    this.loadSubscription();
    this.loadProducts();
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardShortcut(event: KeyboardEvent): void {
    if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
      event.preventDefault();
      this.openSearch();
    }
  }

  openSearch(): void {
    this.isSearchOpen = true;
    this.searchQuery = '';
    this.selectedIndex = 0;
    this.filteredNavItems = [];
    this.filteredProducts = [];
    setTimeout(() => this.searchInput?.nativeElement?.focus(), 50);
  }

  closeSearch(): void {
    this.isSearchOpen = false;
    this.searchQuery = '';
  }

  onSearchQueryChange(): void {
    this.selectedIndex = 0;
    const q = this.searchQuery.toLowerCase().trim();

    if (!q) {
      this.filteredNavItems = [];
      this.filteredProducts = [];
      return;
    }

    this.filteredNavItems = this.quickNavItems.filter(nav =>
      nav.label.toLowerCase().includes(q) ||
      nav.description.toLowerCase().includes(q) ||
      nav.keywords.some(k => k.includes(q))
    );

    this.filteredProducts = this.allProducts.filter(p =>
      p.product?.toLowerCase().includes(q) ||
      p.sku?.toLowerCase().includes(q) ||
      p.category?.toLowerCase().includes(q)
    ).slice(0, 5);
  }

  navigateResults(direction: number): void {
    const total = this.filteredNavItems.length + this.filteredProducts.length;
    if (total === 0) return;
    this.selectedIndex = (this.selectedIndex + direction + total) % total;
  }

  selectResult(): void {
    if (this.selectedIndex < this.filteredNavItems.length) {
      this.navigateTo(this.filteredNavItems[this.selectedIndex].route);
    } else {
      this.navigateTo('/home/inventory');
    }
  }

  navigateTo(route: string): void {
    this.closeSearch();
    this.router.navigate([route]);
  }

  getProductStockClass(product: ShopInventory): string {
    if (product.quantity === 0) return 'out-of-stock';
    if (product.status === 'Low Stock') return 'low-stock';
    return 'in-stock';
  }

  private loadProducts(): void {
    const shopId = this.tenantContext.currentShop?.id;
    if (shopId) {
      this.inventoryService.getByShop(shopId).subscribe({
        next: (response) => {
          const data = getApiData(response);
          if (isApiSuccess(response) && data) {
            this.allProducts = data;
          }
        }
      });
    }
  }

  loadSubscription(): void {
    this.subscriptionService.getMySubscription().subscribe({
      next: (response) => {
        const data = getApiData(response);
        if (isApiSuccess(response) && data) {
          this.subscription = data;
          this.daysRemaining = data.daysRemaining || 0;
          this.isFreeTrial = data.status === SubscriptionStatus.Trial;
          // Show upgrade button for free trial or expiring within 7 days
          this.showUpgradeButton = this.isFreeTrial || (this.daysRemaining <= 7 && this.daysRemaining > 0);
        }
      }
    });
  }

  goToUpgrade(): void {
    this.router.navigate(['/home/subscription/upgrade']);
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  onLogout(): void {
    this.tenantContext.clearContext();
    this.router.navigate(['/login']);
  }

  goToDashboard(): void {
    this.router.navigate(['/home/dashboard']);
  }
}







