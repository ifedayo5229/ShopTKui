import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/app/environments/environment.prod';
import { ApiResponseObject } from 'src/app/models/api-response-object';
import { Department } from 'src/app/models/department';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {
  constructor(private httpClient: HttpClient) { }

  getallDepartments(): Observable<ApiResponseObject<Department[]>> {
    debugger
    return this.httpClient.get<ApiResponseObject<Department[]>>(`${environment.apiUrl}/Functions/GetAll`);
  }
  
}
