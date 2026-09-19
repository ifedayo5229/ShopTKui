import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/app/environments/environment';
import { ApiResponse } from 'src/app/models/api-response';
import {
  AdminDashboardStats,
  TenantListItem,
  TenantDetails,
  AdminUserListItem,
  TenantStatusUpdate,
  UserStatusUpdate,
  TriggerLowStockRequest,
  TriggerLowStockResponse,
  PaginatedResponse
} from 'src/app/models/admin';
import {
  SubscriptionPlan,
  CreatePlanRequest,
  UpdatePlanRequest,
  TenantSubscription,
  AdminSubscriptionUpdate
} from 'src/app/models/subscription';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private baseUrl = `${environment.apiUrl}/admin`;

  constructor(private http: HttpClient) { }

  // Dashboard
  getDashboardStats(): Observable<ApiResponse<AdminDashboardStats>> {
    return this.http.get<ApiResponse<AdminDashboardStats>>(`${this.baseUrl}/dashboard/stats`);
  }

  // Subscription Plans
  getPlans(): Observable<ApiResponse<SubscriptionPlan[]>> {
    return this.http.get<ApiResponse<SubscriptionPlan[]>>(`${this.baseUrl}/subscription-plans`);
  }

  getPlanById(id: number): Observable<ApiResponse<SubscriptionPlan>> {
    return this.http.get<ApiResponse<SubscriptionPlan>>(`${this.baseUrl}/subscription-plans/${id}`);
  }

  createPlan(request: CreatePlanRequest): Observable<ApiResponse<SubscriptionPlan>> {
    return this.http.post<ApiResponse<SubscriptionPlan>>(`${this.baseUrl}/subscription-plans`, request);
  }

  updatePlan(request: UpdatePlanRequest): Observable<ApiResponse<SubscriptionPlan>> {
    return this.http.put<ApiResponse<SubscriptionPlan>>(`${this.baseUrl}/subscription-plans/${request.id}`, request);
  }

  deletePlan(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.baseUrl}/subscription-plans/${id}`);
  }

  // Subscriptions (Admin view)
  getAllSubscriptions(): Observable<ApiResponse<TenantSubscription[]>> {
    return this.http.get<ApiResponse<TenantSubscription[]>>(`${this.baseUrl}/subscriptions`);
  }

  getSubscriptionsByStatus(status: string): Observable<ApiResponse<TenantSubscription[]>> {
    return this.http.get<ApiResponse<TenantSubscription[]>>(`${this.baseUrl}/subscriptions/by-status/${status}`);
  }

  getExpiringSubscriptions(days: number = 7): Observable<ApiResponse<TenantSubscription[]>> {
    const params = new HttpParams().set('days', days.toString());
    return this.http.get<ApiResponse<TenantSubscription[]>>(`${this.baseUrl}/subscriptions/expiring`, { params });
  }

  updateTenantSubscription(tenantId: string, update: AdminSubscriptionUpdate): Observable<ApiResponse<TenantSubscription>> {
    return this.http.put<ApiResponse<TenantSubscription>>(`${this.baseUrl}/subscriptions/${tenantId}/subscription`, update);
  }

  activateSubscription(tenantId: string): Observable<ApiResponse<TenantSubscription>> {
    return this.http.put<ApiResponse<TenantSubscription>>(`${this.baseUrl}/subscriptions/${tenantId}/activate`, {});
  }

  suspendSubscription(tenantId: string, reason?: string): Observable<ApiResponse<TenantSubscription>> {
    return this.http.put<ApiResponse<TenantSubscription>>(`${this.baseUrl}/subscriptions/${tenantId}/suspend`, { reason });
  }

  // Get expired free trials (trial period ended)
  getExpiredTrials(): Observable<ApiResponse<TenantSubscription[]>> {
    return this.http.get<ApiResponse<TenantSubscription[]>>(`${this.baseUrl}/subscriptions/expired-trials`);
  }

  // Get expired subscriptions (paid subscriptions that ended)
  getExpiredSubscriptions(): Observable<ApiResponse<TenantSubscription[]>> {
    return this.http.get<ApiResponse<TenantSubscription[]>>(`${this.baseUrl}/subscriptions/expired`);
  }

  // Batch suspend expired subscriptions
  batchSuspendExpired(tenantIds: string[], reason: string): Observable<ApiResponse<{ suspended: number; failed: number }>> {
    return this.http.post<ApiResponse<{ suspended: number; failed: number }>>(`${this.baseUrl}/subscriptions/batch-suspend`, { 
      tenantIds, 
      reason 
    });
  }

  // End free trial for a tenant
  endFreeTrial(tenantId: string): Observable<ApiResponse<TenantSubscription>> {
    return this.http.put<ApiResponse<TenantSubscription>>(`${this.baseUrl}/subscriptions/${tenantId}/end-trial`, {});
  }

  // Extend trial period for a tenant
  extendTrial(tenantId: string, days: number): Observable<ApiResponse<TenantSubscription>> {
    return this.http.put<ApiResponse<TenantSubscription>>(`${this.baseUrl}/subscriptions/${tenantId}/extend-trial`, { days });
  }

  // Tenants
  getTenants(
    page: number = 1,
    pageSize: number = 20,
    search?: string,
    status?: 'active' | 'inactive' | 'all'
  ): Observable<ApiResponse<PaginatedResponse<TenantListItem>>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());
    if (search) params = params.set('search', search);
    if (status && status !== 'all') params = params.set('status', status);
    return this.http.get<ApiResponse<PaginatedResponse<TenantListItem>>>(`${this.baseUrl}/tenants`, { params });
  }

  getTenantById(tenantId: string): Observable<ApiResponse<TenantDetails>> {
    return this.http.get<ApiResponse<TenantDetails>>(`${this.baseUrl}/tenants/${tenantId}`);
  }

  activateTenant(tenantId: string): Observable<ApiResponse<any>> {
    return this.http.put<ApiResponse<any>>(`${this.baseUrl}/tenants/${tenantId}/activate`, {});
  }

  deactivateTenant(tenantId: string, reason?: string): Observable<ApiResponse<any>> {
    return this.http.put<ApiResponse<any>>(`${this.baseUrl}/tenants/${tenantId}/deactivate`, { isActive: false, reason });
  }

  updateTenantStatus(tenantId: string, update: TenantStatusUpdate): Observable<ApiResponse<void>> {
    return this.http.put<ApiResponse<void>>(`${this.baseUrl}/tenants/${tenantId}/status`, update);
  }

  // Users (Admin view)
  getUsers(
    page: number = 1,
    pageSize: number = 20,
    tenantId?: string,
    shopId?: number,
    role?: string
  ): Observable<ApiResponse<PaginatedResponse<AdminUserListItem>>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());
    if (tenantId) params = params.set('tenantId', tenantId);
    if (shopId) params = params.set('shopId', shopId.toString());
    if (role) params = params.set('role', role);
    return this.http.get<ApiResponse<PaginatedResponse<AdminUserListItem>>>(`${this.baseUrl}/users`, { params });
  }

  updateUserStatus(userId: string, update: UserStatusUpdate): Observable<ApiResponse<void>> {
    return this.http.put<ApiResponse<void>>(`${this.baseUrl}/users/${userId}/status`, update);
  }

  // Low Stock Alerts
  triggerLowStockCheck(request: TriggerLowStockRequest): Observable<ApiResponse<TriggerLowStockResponse>> {
    return this.http.post<ApiResponse<TriggerLowStockResponse>>(`${this.baseUrl}/low-stock-alerts/trigger`, request);
  }
}
