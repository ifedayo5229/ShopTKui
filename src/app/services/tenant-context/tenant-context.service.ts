import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { TenantInfo, ShopInfo, ShopUser, UserRole } from 'src/app/models/shop-user';
import { AppConstants } from 'src/app/models/app-constants';

@Injectable({
  providedIn: 'root'
})
export class TenantContextService {
  private tenantSubject = new BehaviorSubject<TenantInfo | null>(null);
  private currentShopSubject = new BehaviorSubject<ShopInfo | null>(null);
  private availableShopsSubject = new BehaviorSubject<ShopInfo[]>([]);
  private currentUserSubject = new BehaviorSubject<ShopUser | null>(null);

  tenant$ = this.tenantSubject.asObservable();
  currentShop$ = this.currentShopSubject.asObservable();
  availableShops$ = this.availableShopsSubject.asObservable();
  currentUser$ = this.currentUserSubject.asObservable();

  private readonly STORAGE_KEYS = {
    TENANT: 'CURRENT_TENANT',
    SHOP: 'CURRENT_SHOP',
    SHOPS: 'AVAILABLE_SHOPS',
    USER: 'CURRENT_USER',
    TOKEN: 'ACCESS_TOKEN',
    REFRESH_TOKEN: 'REFRESH_TOKEN'
  };

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    try {
      const tenantJson = localStorage.getItem(this.STORAGE_KEYS.TENANT);
      const shopJson = localStorage.getItem(this.STORAGE_KEYS.SHOP);
      const shopsJson = localStorage.getItem(this.STORAGE_KEYS.SHOPS);
      const userJson = localStorage.getItem(this.STORAGE_KEYS.USER);

      if (tenantJson) {
        this.tenantSubject.next(JSON.parse(tenantJson));
      }
      if (shopJson) {
        this.currentShopSubject.next(JSON.parse(shopJson));
      }
      if (shopsJson) {
        this.availableShopsSubject.next(JSON.parse(shopsJson));
      }
      if (userJson) {
        const user = JSON.parse(userJson);
        this.currentUserSubject.next(user);
        // Restore user role in AppConstants
        if (user?.role) {
          AppConstants.setUserRole(user.role as UserRole);
        }
      }
    } catch (e) {
      console.error('Error loading tenant context from storage', e);
    }
  }

  setTenantContext(tenant: TenantInfo | null, shops: ShopInfo[], user: ShopUser): void {
    if (tenant) {
      localStorage.setItem(this.STORAGE_KEYS.TENANT, JSON.stringify(tenant));
    } else {
      localStorage.removeItem(this.STORAGE_KEYS.TENANT);
    }
    localStorage.setItem(this.STORAGE_KEYS.SHOPS, JSON.stringify(shops));
    localStorage.setItem(this.STORAGE_KEYS.USER, JSON.stringify(user));

    this.tenantSubject.next(tenant);
    this.availableShopsSubject.next(shops);
    this.currentUserSubject.next(user);

    // Set user role in AppConstants
    AppConstants.setUserRole(user.role as UserRole);

    // Auto-select first shop if only one (skip for SuperAdmin)
    if (user.role !== UserRole.SuperAdmin && shops.length === 1) {
      this.setCurrentShop(shops[0]);
    } else if (user.role !== UserRole.SuperAdmin && shops.length > 0) {
      // Check if user has a shop assigned
      const userShop = shops.find(s => s.id === user.shopId);
      if (userShop) {
        this.setCurrentShop(userShop);
      } else {
        // Fallback: auto-select the first available shop
        this.setCurrentShop(shops[0]);
      }
    }
  }

  setCurrentShop(shop: ShopInfo): void {
    localStorage.setItem(this.STORAGE_KEYS.SHOP, JSON.stringify(shop));
    this.currentShopSubject.next(shop);
  }

  setAccessToken(token: string, refreshToken?: string): void {
    localStorage.setItem(this.STORAGE_KEYS.TOKEN, token);
    if (refreshToken) {
      localStorage.setItem(this.STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
    }
  }

  getAccessToken(): string | null {
    return localStorage.getItem(this.STORAGE_KEYS.TOKEN);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.STORAGE_KEYS.REFRESH_TOKEN);
  }

  get currentTenant(): TenantInfo | null {
    return this.tenantSubject.value;
  }

  get currentShop(): ShopInfo | null {
    return this.currentShopSubject.value;
  }

  get currentUser(): ShopUser | null {
    return this.currentUserSubject.value;
  }

  get shops(): ShopInfo[] {
    return this.availableShopsSubject.value;
  }

  get hasMultipleShops(): boolean {
    return this.availableShopsSubject.value.length > 1;
  }

  isLoggedIn(): boolean {
    const token = this.getAccessToken();
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return Date.now() < payload.exp * 1000;
    } catch {
      return false;
    }
  }

  clearContext(): void {
    Object.values(this.STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
    this.tenantSubject.next(null);
    this.currentShopSubject.next(null);
    this.availableShopsSubject.next([]);
    this.currentUserSubject.next(null);
    AppConstants.clearUserRole();
  }

  updateUser(user: ShopUser): void {
    localStorage.setItem(this.STORAGE_KEYS.USER, JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  updateTenant(tenant: TenantInfo): void {
    localStorage.setItem(this.STORAGE_KEYS.TENANT, JSON.stringify(tenant));
    this.tenantSubject.next(tenant);
  }

  // Check user permissions
  hasRole(role: string): boolean {
    return this.currentUser?.role === role;
  }

  isSuperAdmin(): boolean {
    return this.currentUser?.role === UserRole.SuperAdmin;
  }

  canManageUsers(): boolean {
    return this.isSuperAdmin() || this.hasRole('TenantOwner') || this.hasRole('ShopManager');
  }

  canManageInventory(): boolean {
    return this.hasRole('TenantOwner') || this.hasRole('ShopManager') || this.hasRole('StockKeeper');
  }

  canProcessSales(): boolean {
    return this.hasRole('TenantOwner') || this.hasRole('ShopManager') || this.hasRole('Cashier');
  }

  canViewReports(): boolean {
    return this.hasRole('TenantOwner') || this.hasRole('ShopManager') || this.hasRole('Viewer');
  }
}
