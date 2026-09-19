import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/app/environments/environment';
import { ApiResponseObject } from 'src/app/models/api-response-object';
import { LoginRequest } from 'src/app/models/login-request';
import { LoginResponseData } from 'src/app/models/login-response-data';
import { LoginResponse } from 'src/app/models/loginResponse';
import { User } from 'src/app/models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private httpClient: HttpClient) { }
  
  login(loginRequest: LoginRequest): Observable<ApiResponseObject<LoginResponseData>> {
   debugger
    return this.httpClient.post<ApiResponseObject<LoginResponseData>>(`${environment.apiUrl}/Accounts/Login`, loginRequest);
  }

  requestLoginCode(useremail: string): Observable<ApiResponseObject<Boolean>> {
    debugger
    return this.httpClient.get<ApiResponseObject<Boolean>>(`${environment.apiUrl}/Accounts/GetLoginCode/${useremail}`);
  }

  validateLoginCode(token: string): Observable<ApiResponseObject<LoginResponse>> {
    return this.httpClient.post<ApiResponseObject<LoginResponse>>(`${environment.apiUrl}/Accounts/ValidateLoginCode/${token}`, token );
  }

  passwordlessSignIn(object: any): Observable<ApiResponseObject<LoginResponseData>> {
   
    return this.httpClient.post<ApiResponseObject<LoginResponseData>>(`${environment.apiUrl}/Accounts/PasswordlessSignIn`, object);
  }

  getAllUsers(): Observable<ApiResponseObject<User[]>> {
    return this.httpClient.get<ApiResponseObject<User[]>>(`${environment.apiUrl}/User`);
  }

  getAllHoDUsers(): Observable<ApiResponseObject<User[]>> {
    return this.httpClient.get<ApiResponseObject<User[]>>(`${environment.apiUrl}/User/getUnitHeads`);
  }

}
