import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { TenantContextService } from 'src/app/services/tenant-context/tenant-context.service';
import { SubscriptionService } from 'src/app/services/subscription/subscription.service';
import { isApiSuccess, getApiData } from 'src/app/models/api-response';
import { AppConstants } from 'src/app/models/app-constants';

interface MenuItem {
  label: string;
  icon: string;
  route: string;
  roles?: string[];
  adminOnly?: boolean;
}

interface MenuSection {
  title?: string;
  items: MenuItem[];
  adminOnly?: boolean;
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit, OnDestroy {
  currentRoute = '';
  shopName = '';
  planName = '';
  subscriptionStatus = '';
  daysRemaining = 0;
  isSuperAdmin = false;
  private destroy$ = new Subject<void>();
  
  menuSections: MenuSection[] = [
    {
      title: 'Main',
      items: [
        { label: 'Dashboard', icon: 'dashboard', route: '/home/dashboard' },
        { label: 'Inventory', icon: 'inventory_2', route: '/home/inventory' },
        { label: 'Point of Sale', icon: 'point_of_sale', route: '/home/pos' },
        { label: 'Sales', icon: 'receipt_long', route: '/home/sales' },
        { label: 'Reports', icon: 'assessment', route: '/home/reports' },
        { label: 'Settings', icon: 'settings', route: '/home/settings' },
      ]
    },
    {
      title: 'Admin',
      adminOnly: true,
      items: [
        { label: 'Admin Dashboard', icon: 'admin_panel_settings', route: '/home/admin', adminOnly: true },
        { label: 'Tenants', icon: 'business', route: '/home/admin/tenants', adminOnly: true },
        { label: 'Subscription Plans', icon: 'loyalty', route: '/home/admin/plans', adminOnly: true },
      ]
    }
  ];

  // Keep backward compatibility
  menuItems: MenuItem[] = this.menuSections[0].items;

  constructor(
    private router: Router,
    private tenantContext: TenantContextService,
    private subscriptionService: SubscriptionService
  ) {}

  ngOnInit(): void {
    this.currentRoute = this.router.url;
    this.isSuperAdmin = AppConstants.IsSuperAdmin;
    
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.currentRoute = event.urlAfterRedirects;
    });

    // Get shop/business name reactively
    this.tenantContext.tenant$.pipe(takeUntil(this.destroy$)).subscribe(tenant => {
      this.shopName = tenant?.name || this.tenantContext.currentShop?.name || 'My Shop';
    });

    // Also react to shop changes
    this.tenantContext.currentShop$.pipe(takeUntil(this.destroy$)).subscribe(shop => {
      if (!this.tenantContext.currentTenant?.name) {
        this.shopName = shop?.name || 'My Shop';
      }
    });

    // Load subscription plan name
    if (!this.isSuperAdmin) {
      this.subscriptionService.getMySubscription().subscribe({
        next: (response) => {
          console.log('=== MY SUBSCRIPTION RESPONSE ===', response);
          const data = getApiData(response);
          if (isApiSuccess(response) && data) {
            this.planName = data.planName || '';
            this.subscriptionStatus = data.statusName || data.status?.toString() || '';
            this.daysRemaining = data.daysRemaining || 0;
          }
        },
        error: (err) => {
          console.log('=== SUBSCRIPTION ERROR ===', err);
        }
      });
    }
  }

  isActive(route: string): boolean {
    if (route === '/home/admin') {
      return this.currentRoute === '/home/admin';
    }
    return this.currentRoute.includes(route);
  }

  navigate(route: string): void {
    this.router.navigate([route]);
  }

  shouldShowSection(section: MenuSection): boolean {
    if (section.adminOnly) {
      return this.isSuperAdmin;
    }
    return true;
  }

  goToUpgrade(): void {
    this.router.navigate(['/home/subscription/upgrade']);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
