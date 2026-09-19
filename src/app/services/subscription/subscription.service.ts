import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/app/environments/environment';
import { ApiResponse } from 'src/app/models/api-response';
import {
  SubscriptionPlan,
  TenantSubscription,
  SubscribeRequest,
  UpgradeRequest,
  BillingRecord
} from 'src/app/models/subscription';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {
  private baseUrl = `${environment.apiUrl}/subscriptions`;

  constructor(private http: HttpClient) { }

  // Get available plans (public)
  getPlans(): Observable<ApiResponse<SubscriptionPlan[]>> {
    return this.http.get<ApiResponse<SubscriptionPlan[]>>(`${this.baseUrl}/plans`);
  }

  // Get current tenant's subscription
  getMySubscription(): Observable<ApiResponse<TenantSubscription>> {
    return this.http.get<ApiResponse<TenantSubscription>>(`${this.baseUrl}/my-subscription`);
  }

  // Subscribe to a plan
  subscribe(request: SubscribeRequest): Observable<ApiResponse<TenantSubscription>> {
    return this.http.post<ApiResponse<TenantSubscription>>(`${this.baseUrl}/subscribe`, request);
  }

  // Upgrade/downgrade plan
  upgrade(request: UpgradeRequest): Observable<ApiResponse<TenantSubscription>> {
    return this.http.put<ApiResponse<TenantSubscription>>(`${this.baseUrl}/upgrade`, request);
  }

  // Cancel subscription
  cancel(): Observable<ApiResponse<TenantSubscription>> {
    return this.http.post<ApiResponse<TenantSubscription>>(`${this.baseUrl}/cancel`, {});
  }

  // Resume cancelled subscription
  resume(): Observable<ApiResponse<TenantSubscription>> {
    return this.http.post<ApiResponse<TenantSubscription>>(`${this.baseUrl}/resume`, {});
  }

  // Toggle auto-renew
  toggleAutoRenew(autoRenew: boolean): Observable<ApiResponse<TenantSubscription>> {
    return this.http.put<ApiResponse<TenantSubscription>>(`${this.baseUrl}/auto-renew`, { autoRenew });
  }

  // Get billing history
  getBillingHistory(): Observable<ApiResponse<BillingRecord[]>> {
    return this.http.get<ApiResponse<BillingRecord[]>>(`${this.baseUrl}/billing-history`);
  }

  // Check if can add more shops
  canAddShop(): Observable<ApiResponse<{ canAdd: boolean }>> {
    return this.http.get<ApiResponse<{ canAdd: boolean }>>(`${this.baseUrl}/can-add-shop`);
  }

  // Check if can add more products
  canAddProduct(): Observable<ApiResponse<{ canAdd: boolean }>> {
    return this.http.get<ApiResponse<{ canAdd: boolean }>>(`${this.baseUrl}/can-add-product`);
  }

  // Check if can add more users
  canAddUser(): Observable<ApiResponse<{ canAdd: boolean }>> {
    return this.http.get<ApiResponse<{ canAdd: boolean }>>(`${this.baseUrl}/can-add-user`);
  }
}
