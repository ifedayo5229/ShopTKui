import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/app/environments/environment.prod';
import { ApiResponseObject } from 'src/app/models/api-response-object';
import { EquipmentFormResponse } from 'src/app/models/equipmentFormResponse';
import { InventoryMovement } from 'src/app/models/inventory-movement';
import { ItemRequestResponse } from 'src/app/models/itemRequestResponse';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {

  constructor(private httpClient: HttpClient) { }

  getAllInventories(): Observable<ApiResponseObject<InventoryMovement[]>> {
    debugger
    return this.httpClient.get<ApiResponseObject<InventoryMovement[]>>(`${environment.apiUrl}/Report/GetAllInventories`);
  }

  getAllRequests(): Observable<ApiResponseObject<ItemRequestResponse[]>> {
    debugger
    return this.httpClient.get<ApiResponseObject<ItemRequestResponse[]>>(`${environment.apiUrl}/Report/GetAllRequests`);
  }

  getAllDisbursements(): Observable<ApiResponseObject<ItemRequestResponse[]>> {
    debugger
    return this.httpClient.get<ApiResponseObject<ItemRequestResponse[]>>(`${environment.apiUrl}/Report/GetAllDisbursementInfos`);
  }

  // getAllDirectIssues(): Observable<ApiResponseObject<ItemRequestResponse[]>> {
  //   debugger
  //   return this.httpClient.get<ApiResponseObject<ItemRequestResponse[]>>(`${environment.apiUrl}/Report/GetAllDirectIssue`);
  // }

  getAllDirectIssues(): Observable<ApiResponseObject<ItemRequestResponse[]>> {
    debugger
    return this.httpClient.get<ApiResponseObject<ItemRequestResponse[]>>(`${environment.apiUrl}/InventoryMovement/GetAllDirectIssue`);
  }

  getAllEquipmentForms(): Observable<ApiResponseObject<EquipmentFormResponse[]>> {
    debugger
    return this.httpClient.get<ApiResponseObject<EquipmentFormResponse[]>>(`${environment.apiUrl}/InventoryMovement/GetEquipmentForm`);
  }

}
