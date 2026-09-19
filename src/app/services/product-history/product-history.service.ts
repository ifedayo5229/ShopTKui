import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/app/environments/environment';
import { ProductHistory, ProductActivityType } from 'src/app/models/product-history';
import { ApiResponse } from 'src/app/models/api-response';

@Injectable({
  providedIn: 'root'
})
export class ProductHistoryService {
  private baseUrl = `${environment.apiUrl}/product-history`;

  constructor(private http: HttpClient) { }

  getByProduct(productId: number): Observable<ApiResponse<ProductHistory[]>> {
    return this.http.get<ApiResponse<ProductHistory[]>>(`${this.baseUrl}/by-product/${productId}`);
  }

  getRecentByProduct(productId: number, count: number = 50): Observable<ApiResponse<ProductHistory[]>> {
    return this.http.get<ApiResponse<ProductHistory[]>>(
      `${this.baseUrl}/by-product/${productId}/recent`,
      { params: { count: count.toString() } }
    );
  }

  getByShop(shopId: number | string): Observable<ApiResponse<ProductHistory[]>> {
    return this.http.get<ApiResponse<ProductHistory[]>>(`${this.baseUrl}/by-shop/${shopId}`);
  }

  getByType(activityType: ProductActivityType): Observable<ApiResponse<ProductHistory[]>> {
    return this.http.get<ApiResponse<ProductHistory[]>>(`${this.baseUrl}/by-type/${activityType}`);
  }

  getByDateRange(startDate: Date | string, endDate: Date | string): Observable<ApiResponse<ProductHistory[]>> {
    const params = new HttpParams()
      .set('startDate', this.formatDate(startDate))
      .set('endDate', this.formatDate(endDate));
    return this.http.get<ApiResponse<ProductHistory[]>>(`${this.baseUrl}/by-date-range`, { params });
  }

  getByProductDateRange(productId: number, startDate: Date | string, endDate: Date | string): Observable<ApiResponse<ProductHistory[]>> {
    const params = new HttpParams()
      .set('startDate', this.formatDate(startDate))
      .set('endDate', this.formatDate(endDate));
    return this.http.get<ApiResponse<ProductHistory[]>>(
      `${this.baseUrl}/by-product/${productId}/date-range`,
      { params }
    );
  }

  private formatDate(date: Date | string): string {
    if (typeof date === 'string') return date;
    return date.toISOString().split('T')[0];
  }
}
