import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/app/environments/environment';
import { StockTransaction, TransactionType } from 'src/app/models/stock-transaction';
import { ApiResponse } from 'src/app/models/api-response';

@Injectable({
  providedIn: 'root'
})
export class StockTransactionService {
  private baseUrl = `${environment.apiUrl}/stocktransactions`;

  constructor(private http: HttpClient) { }

  getAll(): Observable<ApiResponse<StockTransaction[]>> {
    return this.http.get<ApiResponse<StockTransaction[]>>(`${this.baseUrl}/all`);
  }

  getById(id: number): Observable<ApiResponse<StockTransaction>> {
    return this.http.get<ApiResponse<StockTransaction>>(`${this.baseUrl}/${id}`);
  }

  getByProduct(productId: number): Observable<ApiResponse<StockTransaction[]>> {
    return this.http.get<ApiResponse<StockTransaction[]>>(`${this.baseUrl}/by-product/${productId}`);
  }

  getByShop(shopId: number): Observable<ApiResponse<StockTransaction[]>> {
    return this.http.get<ApiResponse<StockTransaction[]>>(`${this.baseUrl}/by-shop/${shopId}`);
  }

  getByType(type: TransactionType): Observable<ApiResponse<StockTransaction[]>> {
    return this.http.get<ApiResponse<StockTransaction[]>>(`${this.baseUrl}/by-type/${type}`);
  }

  getByDateRange(startDate: Date, endDate: Date, shopId?: number): Observable<ApiResponse<StockTransaction[]>> {
    let params = new HttpParams()
      .set('startDate', startDate.toISOString())
      .set('endDate', endDate.toISOString());
    
    if (shopId) {
      params = params.set('shopId', shopId.toString());
    }

    return this.http.get<ApiResponse<StockTransaction[]>>(`${this.baseUrl}/by-date-range`, { params });
  }

  getBySale(saleId: number): Observable<ApiResponse<StockTransaction[]>> {
    return this.http.get<ApiResponse<StockTransaction[]>>(`${this.baseUrl}/by-sale/${saleId}`);
  }
}
