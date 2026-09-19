import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/app/environments/environment';
import { ShopSettings, UpdateSettingRequest, ProductThreshold, UpdateProductThresholdRequest } from 'src/app/models/shop-settings';
import { ApiResponse } from 'src/app/models/api-response';

@Injectable({
  providedIn: 'root'
})
export class ShopSettingsService {
  private baseUrl = `${environment.apiUrl}/shops`;

  constructor(private http: HttpClient) { }

  /** Get all settings for a shop */
  getSettings(shopId: number | string): Observable<ApiResponse<ShopSettings>> {
    return this.http.get<ApiResponse<ShopSettings>>(`${this.baseUrl}/${shopId}/settings`);
  }

  // ========== Inventory Settings (individual endpoints) ==========

  updateDefaultLowStockThreshold(shopId: number | string, value: number): Observable<ApiResponse<boolean>> {
    return this.http.put<ApiResponse<boolean>>(
      `${this.baseUrl}/${shopId}/settings/default-low-stock-threshold`,
      { value } as UpdateSettingRequest
    );
  }

  updateEnableLowStockAlerts(shopId: number | string, value: boolean): Observable<ApiResponse<boolean>> {
    return this.http.put<ApiResponse<boolean>>(
      `${this.baseUrl}/${shopId}/settings/enable-low-stock-alerts`,
      { value } as UpdateSettingRequest
    );
  }

  updateEnableEmailAlerts(shopId: number | string, value: boolean): Observable<ApiResponse<boolean>> {
    return this.http.put<ApiResponse<boolean>>(
      `${this.baseUrl}/${shopId}/settings/enable-email-alerts`,
      { value } as UpdateSettingRequest
    );
  }

  updateAllowNegativeStock(shopId: number | string, value: boolean): Observable<ApiResponse<boolean>> {
    return this.http.put<ApiResponse<boolean>>(
      `${this.baseUrl}/${shopId}/settings/allow-negative-stock`,
      { value } as UpdateSettingRequest
    );
  }

  // ========== Notification Settings (individual endpoints) ==========

  updateLowStockNotifications(shopId: number | string, value: boolean): Observable<ApiResponse<boolean>> {
    return this.http.put<ApiResponse<boolean>>(
      `${this.baseUrl}/${shopId}/settings/low-stock-notifications`,
      { value } as UpdateSettingRequest
    );
  }

  updateDailySalesSummary(shopId: number | string, value: boolean): Observable<ApiResponse<boolean>> {
    return this.http.put<ApiResponse<boolean>>(
      `${this.baseUrl}/${shopId}/settings/daily-sales-summary`,
      { value } as UpdateSettingRequest
    );
  }

  updateNewUserNotifications(shopId: number | string, value: boolean): Observable<ApiResponse<boolean>> {
    return this.http.put<ApiResponse<boolean>>(
      `${this.baseUrl}/${shopId}/settings/new-user-notifications`,
      { value } as UpdateSettingRequest
    );
  }

  // ========== Per-Product Thresholds ==========

  /** Get all product thresholds for a shop */
  getProductThresholds(shopId: number | string): Observable<ApiResponse<ProductThreshold[]>> {
    return this.http.get<ApiResponse<ProductThreshold[]>>(
      `${this.baseUrl}/${shopId}/settings/product-thresholds`
    );
  }

  /** Update a single product's low stock threshold */
  updateProductThreshold(
    shopId: number | string,
    inventoryId: number,
    threshold: number
  ): Observable<ApiResponse<boolean>> {
    return this.http.put<ApiResponse<boolean>>(
      `${this.baseUrl}/${shopId}/settings/product-thresholds/${inventoryId}`,
      { threshold } as UpdateProductThresholdRequest
    );
  }
}
