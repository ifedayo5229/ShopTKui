import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/app/environments/environment';
import { 
  ShopUser, 
  CreateShopUserRequest, 
  UpdateShopUserRequest, 
  UpdatePasswordRequest,
  UserRole,
  LoginRequest,
  LoginResponse,
  RegisterTenantRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  ChangePasswordRequest
} from 'src/app/models/shop-user';
import { ApiResponse } from 'src/app/models/api-response';

@Injectable({
  providedIn: 'root'
})
export class ShopUserService {
  private baseUrl = `${environment.apiUrl}/shopusers`;

  constructor(private http: HttpClient) { }

  create(request: CreateShopUserRequest): Observable<ApiResponse<ShopUser>> {
    return this.http.post<ApiResponse<ShopUser>>(`${this.baseUrl}/create`, request);
  }

  getAll(): Observable<ApiResponse<ShopUser[]>> {
    return this.http.get<ApiResponse<ShopUser[]>>(`${this.baseUrl}/all`);
  }

  getById(id: number): Observable<ApiResponse<ShopUser>> {
    return this.http.get<ApiResponse<ShopUser>>(`${this.baseUrl}/${id}`);
  }

  getByEmail(email: string): Observable<ApiResponse<ShopUser>> {
    return this.http.get<ApiResponse<ShopUser>>(`${this.baseUrl}/by-email/${email}`);
  }

  getByShop(shopId: number | string): Observable<ApiResponse<ShopUser[]>> {
    return this.http.get<ApiResponse<ShopUser[]>>(`${this.baseUrl}/by-shop/${shopId}`);
  }

  getByRole(roleType: UserRole): Observable<ApiResponse<ShopUser[]>> {
    return this.http.get<ApiResponse<ShopUser[]>>(`${this.baseUrl}/by-role/${roleType}`);
  }

  update(request: UpdateShopUserRequest): Observable<ApiResponse<ShopUser>> {
    return this.http.put<ApiResponse<ShopUser>>(`${this.baseUrl}/update`, request);
  }

  updatePassword(request: UpdatePasswordRequest): Observable<ApiResponse<boolean>> {
    return this.http.put<ApiResponse<boolean>>(`${this.baseUrl}/update-password`, request);
  }

  lock(userId: number): Observable<ApiResponse<boolean>> {
    return this.http.put<ApiResponse<boolean>>(`${this.baseUrl}/lock/${userId}`, {});
  }

  unlock(userId: number): Observable<ApiResponse<boolean>> {
    return this.http.put<ApiResponse<boolean>>(`${this.baseUrl}/unlock/${userId}`, {});
  }

  delete(id: number): Observable<ApiResponse<boolean>> {
    return this.http.delete<ApiResponse<boolean>>(`${this.baseUrl}/delete/${id}`);
  }

  // Authentication methods
  login(request: LoginRequest): Observable<ApiResponse<LoginResponse>> {
    return this.http.post<ApiResponse<LoginResponse>>(`${environment.apiUrl}/auth/login`, request);
  }

  register(request: RegisterTenantRequest): Observable<ApiResponse<LoginResponse>> {
    debugger;
    return this.http.post<ApiResponse<LoginResponse>>(`${environment.apiUrl}/auth/register`, request);
  }

  refreshToken(): Observable<ApiResponse<LoginResponse>> {
    return this.http.post<ApiResponse<LoginResponse>>(`${environment.apiUrl}/auth/refresh-token`, {});
  }

  logout(): Observable<ApiResponse<boolean>> {
    return this.http.post<ApiResponse<boolean>>(`${environment.apiUrl}/auth/logout`, {});
  }

  // Password recovery methods
  forgotPassword(request: ForgotPasswordRequest): Observable<ApiResponse<boolean>> {
    return this.http.post<ApiResponse<boolean>>(`${environment.apiUrl}/auth/forgot-password`, request);
  }

  resetPassword(request: ResetPasswordRequest): Observable<ApiResponse<boolean>> {
    return this.http.post<ApiResponse<boolean>>(`${environment.apiUrl}/auth/reset-password`, request);
  }

  changePassword(request: ChangePasswordRequest): Observable<ApiResponse<boolean>> {
    return this.http.post<ApiResponse<boolean>>(`${environment.apiUrl}/auth/change-password`, request);
  }
}
