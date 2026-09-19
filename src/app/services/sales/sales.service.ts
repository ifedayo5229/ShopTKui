import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/app/environments/environment';
import { Sale, ProcessSaleRequest, DailySales } from 'src/app/models/sale';
import { ApiResponse } from 'src/app/models/api-response';

@Injectable({
  providedIn: 'root'
})
export class SalesService {
  private baseUrl = `${environment.apiUrl}/sales`;

  constructor(private http: HttpClient) { }

  processSale(request: ProcessSaleRequest): Observable<ApiResponse<Sale>> {
    return this.http.post<ApiResponse<Sale>>(`${this.baseUrl}/process`, request);
  }

  getAll(): Observable<ApiResponse<Sale[]>> {
    return this.http.get<ApiResponse<Sale[]>>(`${this.baseUrl}/all`);
  }

  getById(id: number): Observable<ApiResponse<Sale>> {
    return this.http.get<ApiResponse<Sale>>(`${this.baseUrl}/${id}`);
  }

  getByInvoice(invoiceNumber: string): Observable<ApiResponse<Sale>> {
    return this.http.get<ApiResponse<Sale>>(`${this.baseUrl}/by-invoice/${invoiceNumber}`);
  }

  getByShop(shopId: number | string): Observable<ApiResponse<Sale[]>> {
    return this.http.get<ApiResponse<Sale[]>>(`${this.baseUrl}/by-shop/${shopId}`);
  }

  // Filters sales by saleDate field (supports backdated sales)
  getByDateRange(startDate: Date, endDate: Date, shopId?: number | string): Observable<ApiResponse<Sale[]>> {
    let params = new HttpParams()
      .set('startDate', startDate.toISOString())
      .set('endDate', endDate.toISOString());
    
    if (shopId) {
      params = params.set('shopId', shopId.toString());
    }

    return this.http.get<ApiResponse<Sale[]>>(`${this.baseUrl}/by-date-range`, { params });
  }

  getDailySales(date?: Date): Observable<ApiResponse<DailySales>> {
    let params = new HttpParams();
    if (date) {
      params = params.set('date', date.toISOString());
    }
    return this.http.get<ApiResponse<DailySales>>(`${this.baseUrl}/daily`, { params });
  }

  getDailySalesByShop(shopId: number, date?: Date): Observable<ApiResponse<DailySales>> {
    let params = new HttpParams();
    if (date) {
      params = params.set('date', date.toISOString());
    }
    return this.http.get<ApiResponse<DailySales>>(`${this.baseUrl}/daily/by-shop/${shopId}`, { params });
  }

  getTotalAmount(startDate: Date, endDate: Date, shopId?: number): Observable<ApiResponse<number>> {
    let params = new HttpParams()
      .set('startDate', startDate.toISOString())
      .set('endDate', endDate.toISOString());
    
    if (shopId) {
      params = params.set('shopId', shopId.toString());
    }

    return this.http.get<ApiResponse<number>>(`${this.baseUrl}/total-amount`, { params });
  }

  delete(id: number): Observable<ApiResponse<boolean>> {
    return this.http.delete<ApiResponse<boolean>>(`${this.baseUrl}/delete/${id}`);
  }

  downloadInvoice(saleId: number): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/${saleId}/invoice`, {
      responseType: 'blob'
    });
  }

  downloadInvoiceByNumber(invoiceNumber: string): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/invoice/${invoiceNumber}`, {
      responseType: 'blob'
    });
  }

  getTodaySalesByShop(shopId: number | string): Observable<ApiResponse<Sale[]>> {
    return this.http.get<ApiResponse<Sale[]>>(`${this.baseUrl}/today/by-shop/${shopId}`);
  }
}
