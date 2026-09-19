import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/app/environments/environment';
import { ApiResponseObject } from 'src/app/models/api-response-object';
import { StockReason, CreateStockReasonRequest, UpdateStockReasonRequest, StockReasonType } from 'src/app/models/stock-reason';

@Injectable({
  providedIn: 'root'
})
export class StockReasonService {

  constructor(private httpClient: HttpClient) { }

  getAll(): Observable<ApiResponseObject<StockReason[]>> {
    return this.httpClient.get<ApiResponseObject<StockReason[]>>(`${environment.apiUrl}/StockReasons/all`);
  }

  getByType(type: StockReasonType): Observable<ApiResponseObject<StockReason[]>> {
    return this.httpClient.get<ApiResponseObject<StockReason[]>>(`${environment.apiUrl}/StockReasons/by-type/${type}`);
  }

  getStockOutReasons(): Observable<ApiResponseObject<StockReason[]>> {
    return this.httpClient.get<ApiResponseObject<StockReason[]>>(`${environment.apiUrl}/StockReasons/stock-out`);
  }

  getStockInReasons(): Observable<ApiResponseObject<StockReason[]>> {
    return this.httpClient.get<ApiResponseObject<StockReason[]>>(`${environment.apiUrl}/StockReasons/stock-in`);
  }

  getById(id: number): Observable<ApiResponseObject<StockReason>> {
    return this.httpClient.get<ApiResponseObject<StockReason>>(`${environment.apiUrl}/StockReasons/${id}`);
  }

  create(request: CreateStockReasonRequest): Observable<ApiResponseObject<StockReason>> {
    return this.httpClient.post<ApiResponseObject<StockReason>>(`${environment.apiUrl}/StockReasons/create`, request);
  }

  update(request: UpdateStockReasonRequest): Observable<ApiResponseObject<StockReason>> {
    return this.httpClient.put<ApiResponseObject<StockReason>>(`${environment.apiUrl}/StockReasons/update`, request);
  }

  delete(id: number): Observable<ApiResponseObject<boolean>> {
    return this.httpClient.delete<ApiResponseObject<boolean>>(`${environment.apiUrl}/StockReasons/${id}`);
  }
}
