import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/app/environments/environment';
import { Tenant, CreateTenantRequest, UpdateTenantRequest } from 'src/app/models/tenant';
import { ApiResponse } from 'src/app/models/api-response';

@Injectable({
  providedIn: 'root'
})
export class TenantService {
  private baseUrl = `${environment.apiUrl}/tenants`;

  constructor(private http: HttpClient) { }

  getProfile(): Observable<ApiResponse<Tenant>> {
    return this.http.get<ApiResponse<Tenant>>(`${this.baseUrl}/profile`);
  }

  create(request: CreateTenantRequest): Observable<ApiResponse<Tenant>> {
    return this.http.post<ApiResponse<Tenant>>(`${this.baseUrl}/create`, request);
  }

  getAll(): Observable<ApiResponse<Tenant[]>> {
    return this.http.get<ApiResponse<Tenant[]>>(`${this.baseUrl}/all`);
  }

  getById(id: number): Observable<ApiResponse<Tenant>> {
    return this.http.get<ApiResponse<Tenant>>(`${this.baseUrl}/${id}`);
  }

  getByTenantId(tenantId: string): Observable<ApiResponse<Tenant>> {
    return this.http.get<ApiResponse<Tenant>>(`${this.baseUrl}/by-tenant-id/${tenantId}`);
  }

  getByEmail(email: string): Observable<ApiResponse<Tenant>> {
    return this.http.get<ApiResponse<Tenant>>(`${this.baseUrl}/by-email/${email}`);
  }

  update(request: UpdateTenantRequest): Observable<ApiResponse<Tenant>> {
    return this.http.put<ApiResponse<Tenant>>(`${this.baseUrl}/update`, request);
  }

  delete(id: number): Observable<ApiResponse<boolean>> {
    return this.http.delete<ApiResponse<boolean>>(`${this.baseUrl}/delete/${id}`);
  }
}
