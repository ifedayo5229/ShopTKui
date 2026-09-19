import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/app/environments/environment';
import { ProductCategory, CreateProductCategoryRequest, UpdateProductCategoryRequest } from 'src/app/models/product-category';
import { ApiResponse } from 'src/app/models/api-response';

@Injectable({
  providedIn: 'root'
})
export class ProductCategoryService {
  private baseUrl = `${environment.apiUrl}/productcategories`;

  constructor(private http: HttpClient) { }

  create(request: CreateProductCategoryRequest): Observable<ApiResponse<ProductCategory>> {
    return this.http.post<ApiResponse<ProductCategory>>(`${this.baseUrl}/create`, request);
  }

  getAll(): Observable<ApiResponse<ProductCategory[]>> {
    return this.http.get<ApiResponse<ProductCategory[]>>(`${this.baseUrl}/all`);
  }

  getById(id: number): Observable<ApiResponse<ProductCategory>> {
    return this.http.get<ApiResponse<ProductCategory>>(`${this.baseUrl}/${id}`);
  }

  getByName(name: string, shopId: number | string): Observable<ApiResponse<ProductCategory>> {
    const params = new HttpParams()
      .set('name', name)
      .set('shopId', shopId.toString());
    return this.http.get<ApiResponse<ProductCategory>>(`${this.baseUrl}/by-name`, { params });
  }

  getByShop(shopId: number | string): Observable<ApiResponse<ProductCategory[]>> {
    return this.http.get<ApiResponse<ProductCategory[]>>(`${this.baseUrl}/by-shop/${shopId}`);
  }

  update(request: UpdateProductCategoryRequest): Observable<ApiResponse<ProductCategory>> {
    return this.http.put<ApiResponse<ProductCategory>>(`${this.baseUrl}/update`, request);
  }

  delete(id: number): Observable<ApiResponse<boolean>> {
    return this.http.delete<ApiResponse<boolean>>(`${this.baseUrl}/delete/${id}`);
  }
}
