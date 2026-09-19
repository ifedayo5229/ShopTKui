import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/app/environments/environment';
import { Shop, CreateShopRequest, UpdateShopRequest } from 'src/app/models/shop';
import { ApiResponse } from 'src/app/models/api-response';

@Injectable({
  providedIn: 'root'
})
export class ShopService {
  private baseUrl = `${environment.apiUrl}/shops`;

  constructor(private http: HttpClient) { }

  create(request: CreateShopRequest): Observable<ApiResponse<Shop>> {
    return this.http.post<ApiResponse<Shop>>(`${this.baseUrl}/create`, request);
  }

  getAll(): Observable<ApiResponse<Shop[]>> {
    return this.http.get<ApiResponse<Shop[]>>(`${this.baseUrl}/all`);
  }

  getById(id: number | string): Observable<ApiResponse<Shop>> {
    return this.http.get<ApiResponse<Shop>>(`${this.baseUrl}/${id}`);
  }

  getByName(name: string): Observable<ApiResponse<Shop>> {
    return this.http.get<ApiResponse<Shop>>(`${this.baseUrl}/by-name/${name}`);
  }

  update(request: UpdateShopRequest): Observable<ApiResponse<Shop>> {
    return this.http.put<ApiResponse<Shop>>(`${this.baseUrl}/update`, request);
  }

  delete(id: number | string): Observable<ApiResponse<boolean>> {
    return this.http.delete<ApiResponse<boolean>>(`${this.baseUrl}/delete/${id}`);
  }

  uploadLogo(shopId: number | string, file: File): Observable<ApiResponse<string>> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<ApiResponse<string>>(`${this.baseUrl}/${shopId}/upload-logo`, formData);
  }
}
