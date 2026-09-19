import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/app/environments/environment';
import { ShopInventory, AddStockRequest, RemoveStockRequest, LowStockItem, StockRemovalReason } from 'src/app/models/shop-inventory';
import { ApiResponse } from 'src/app/models/api-response';

@Injectable({
  providedIn: 'root'
})
export class ShopInventoryService {
  private baseUrl = `${environment.apiUrl}/shop-inventory`;

  constructor(private http: HttpClient) { }

  getAll(): Observable<ApiResponse<ShopInventory[]>> {
    debugger;
    return this.http.get<ApiResponse<ShopInventory[]>>(`${this.baseUrl}/all`);
  }

  getById(id: number): Observable<ApiResponse<ShopInventory>> {
    return this.http.get<ApiResponse<ShopInventory>>(`${this.baseUrl}/${id}`);
  }

  getByProduct(productId: number): Observable<ApiResponse<ShopInventory>> {
    debugger;
    return this.http.get<ApiResponse<ShopInventory>>(`${this.baseUrl}/by-product/${productId}`);
  }

  getByShop(shopId: number | string): Observable<ApiResponse<ShopInventory[]>> {
    return this.http.get<ApiResponse<ShopInventory[]>>(`${this.baseUrl}/by-shop/${shopId}`);
  }

  getLowStock(): Observable<ApiResponse<LowStockItem[]>> {
    return this.http.get<ApiResponse<LowStockItem[]>>(`${this.baseUrl}/low-stock`);
  }

  getLowStockByShop(shopId: number | string): Observable<ApiResponse<LowStockItem[]>> {
    return this.http.get<ApiResponse<LowStockItem[]>>(`${this.baseUrl}/low-stock/by-shop/${shopId}`);
  }

  addStock(request: AddStockRequest): Observable<ApiResponse<ShopInventory>> {
    return this.http.post<ApiResponse<ShopInventory>>(`${this.baseUrl}/add-stock`, request);
  }

  removeStock(request: RemoveStockRequest): Observable<ApiResponse<ShopInventory>> {
    return this.http.post<ApiResponse<ShopInventory>>(`${this.baseUrl}/remove-stock`, request);
  }

  getRemovalReasons(shopId: number | string): Observable<ApiResponse<StockRemovalReason[]>> {
    return this.http.get<ApiResponse<StockRemovalReason[]>>(`${this.baseUrl}/removal-reasons/${shopId}`);
  }
}
