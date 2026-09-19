import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/app/environments/environment';
import { LowStockAlert, AlertStatus } from 'src/app/models/low-stock-alert';
import { ApiResponse } from 'src/app/models/api-response';

@Injectable({
  providedIn: 'root'
})
export class LowStockAlertService {
  private baseUrl = `${environment.apiUrl}/lowstockalerts`;

  constructor(private http: HttpClient) { }

  getAll(): Observable<ApiResponse<LowStockAlert[]>> {
    return this.http.get<ApiResponse<LowStockAlert[]>>(`${this.baseUrl}/all`);
  }

  getById(id: number): Observable<ApiResponse<LowStockAlert>> {
    return this.http.get<ApiResponse<LowStockAlert>>(`${this.baseUrl}/${id}`);
  }

  getActive(): Observable<ApiResponse<LowStockAlert[]>> {
    return this.http.get<ApiResponse<LowStockAlert[]>>(`${this.baseUrl}/active`);
  }

  getActiveByProduct(productId: number): Observable<ApiResponse<LowStockAlert>> {
    return this.http.get<ApiResponse<LowStockAlert>>(`${this.baseUrl}/active/by-product/${productId}`);
  }

  getByShop(shopId: number): Observable<ApiResponse<LowStockAlert[]>> {
    return this.http.get<ApiResponse<LowStockAlert[]>>(`${this.baseUrl}/by-shop/${shopId}`);
  }

  getByStatus(status: AlertStatus): Observable<ApiResponse<LowStockAlert[]>> {
    return this.http.get<ApiResponse<LowStockAlert[]>>(`${this.baseUrl}/by-status/${status}`);
  }

  getUnsentEmail(): Observable<ApiResponse<LowStockAlert[]>> {
    return this.http.get<ApiResponse<LowStockAlert[]>>(`${this.baseUrl}/unsent-email`);
  }

  acknowledge(alertId: number): Observable<ApiResponse<LowStockAlert>> {
    return this.http.put<ApiResponse<LowStockAlert>>(`${this.baseUrl}/acknowledge/${alertId}`, {});
  }

  resolve(alertId: number): Observable<ApiResponse<LowStockAlert>> {
    return this.http.put<ApiResponse<LowStockAlert>>(`${this.baseUrl}/resolve/${alertId}`, {});
  }

  markEmailSent(alertId: number): Observable<ApiResponse<LowStockAlert>> {
    return this.http.put<ApiResponse<LowStockAlert>>(`${this.baseUrl}/mark-email-sent/${alertId}`, {});
  }
}
