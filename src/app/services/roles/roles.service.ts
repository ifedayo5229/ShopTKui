import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RoleDto } from 'src/app/models/RoleDto';
import { ApiResponseObject } from 'src/app/models/api-response-object';
import { environment } from 'src/app/environments/environment.prod';
import { RoleRequest } from 'src/app/models/role-request';
import { Profile } from 'src/app/models/profile';

@Injectable({
  providedIn: 'root'
})
export class RolesService {

  constructor(private httpClient: HttpClient) { }
  getRoles(): Observable<RoleDto[]> {
    return this.httpClient.get<RoleDto[]>(`${environment.apiUrl}/Roles/all`);
  }
  
  saveRole(roleRequest: RoleRequest): Observable<ApiResponseObject<RoleDto>> {
   
    return this.httpClient.post<ApiResponseObject<RoleDto>>(`${environment.apiUrl}/Roles`, roleRequest);
  }

  getRolesForUser(userid: string): Observable<ApiResponseObject<RoleDto[]>> {
    return this.httpClient.get<ApiResponseObject<RoleDto[]>>(`${environment.apiUrl}/Roles/role/${userid}`);
  }

  assignRoleToUser(vm: any): Observable<ApiResponseObject<Profile>> {
   
    return this.httpClient.post<ApiResponseObject<Profile>>(`${environment.apiUrl}/User/assignRoleToUser`, vm);
  }

  assignItManagerRoleToUser(vm: any): Observable<ApiResponseObject<Profile>> {
   
    return this.httpClient.post<ApiResponseObject<Profile>>(`${environment.apiUrl}/User/assignITRoleToUser`, vm);
  } 

  assignRolesToUser(vm: any): Observable<ApiResponseObject<Profile>> {
   
    return this.httpClient.post<ApiResponseObject<Profile>>(`${environment.apiUrl}/User/assignRolesToUser`, vm);
  }

  removeRoleFromUser(vm: any): Observable<ApiResponseObject<Profile>> {
    debugger
   
    return this.httpClient.post<ApiResponseObject<Profile>>(`${environment.apiUrl}/User/removeRoleToUser`, vm);
  }

}
