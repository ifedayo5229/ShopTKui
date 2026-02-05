import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/app/environments/environment.prod';
import { ApiResponseObject } from 'src/app/models/api-response-object';
import { ApproveRequestVm } from 'src/app/models/approveRequestVm';
import { DirectIssue } from 'src/app/models/direct-issueVm';
import { DisburseItems } from 'src/app/models/disburse-items';
import { InventoryMovement } from 'src/app/models/inventory-movement';
import { InventoryMovtVm } from 'src/app/models/inventory-movementVm';
import { IssueOutInventoryVm } from 'src/app/models/issue-out-inventory';
import { IssueRequestVm } from 'src/app/models/issue-requestVm';
import { ItemRequestResponse } from 'src/app/models/itemRequestResponse';
import { RequestItems } from 'src/app/models/requestItemVm';
import { StoreRequestResponse } from 'src/app/models/storeRequestResponse';

@Injectable({
  providedIn: 'root'
})
export class InventoryMovementService {

  constructor(private httpClient: HttpClient) { }

  createInventoryMovt(request: InventoryMovtVm): Observable<ApiResponseObject<InventoryMovement>> {
    debugger
    return this.httpClient.post<ApiResponseObject<InventoryMovement>>(`${environment.apiUrl}/InventoryMovement/Create`, request,);
  }

  createITInventoryMovt(request: InventoryMovtVm): Observable<ApiResponseObject<InventoryMovement>> {
    debugger
    return this.httpClient.post<ApiResponseObject<InventoryMovement>>(`${environment.apiUrl}/InventoryMovement/CreateIT`, request,);
  }

  createGhetInventoryMovt(request: InventoryMovtVm): Observable<ApiResponseObject<InventoryMovement>> {
    debugger
    return this.httpClient.post<ApiResponseObject<InventoryMovement>>(`${environment.apiUrl}/InventoryMovement/MoveGhetItemsToGhetStore`, request,);
  }
  
  createOutwardMovt(request: IssueOutInventoryVm): Observable<ApiResponseObject<InventoryMovement>> {
    debugger
    return this.httpClient.post<ApiResponseObject<InventoryMovement>>(`${environment.apiUrl}/InventoryMovement/CreateOutward`, request,);
  }

  getallInventoryMovements(): Observable<ApiResponseObject<InventoryMovement[]>> {
    debugger
    return this.httpClient.get<ApiResponseObject<InventoryMovement[]>>(`${environment.apiUrl}/InventoryMovement/GetAll`);
  }

  getInventoryMovementsByStoreId(id: number): Observable<ApiResponseObject<InventoryMovement[]>> {
    debugger
   return this.httpClient.get<ApiResponseObject<InventoryMovement[]>>(`${environment.apiUrl}/InventoryMovement/GetByStore/${id}`);
 }
 getGhetInventoryMovementsByStoreId(id: number): Observable<ApiResponseObject<InventoryMovement[]>> {
    debugger
   return this.httpClient.get<ApiResponseObject<InventoryMovement[]>>(`${environment.apiUrl}/InventoryMovement/GetByStoreGhet/${id}`);
 }

 getITInventoryByStoreId(id: number): Observable<ApiResponseObject<InventoryMovement[]>> {
    debugger
   return this.httpClient.get<ApiResponseObject<InventoryMovement[]>>(`${environment.apiUrl}/InventoryMovement/GetByStoreIT/${id}`);
 }

 DisburseItem(request: DisburseItems): Observable<ApiResponseObject<ItemRequestResponse>> {
    debugger
    return this.httpClient.post<ApiResponseObject<ItemRequestResponse>>(`${environment.apiUrl}/InventoryMovement/DisburseItems`, request,);
  }

  directIssues(request: DirectIssue): Observable<ApiResponseObject<ItemRequestResponse>> {
    debugger
    return this.httpClient.post<ApiResponseObject<ItemRequestResponse>>(`${environment.apiUrl}/InventoryMovement/DirectIssue`, request,);
  }
  
    getallPendingdisburseditems(userEmail: string): Observable<ApiResponseObject<ItemRequestResponse[]>> {
      debugger
      return this.httpClient.get<ApiResponseObject<ItemRequestResponse[]>>(`${environment.apiUrl}/InventoryMovement/GetDisurseStoremanager/${userEmail}`);
    }

    RecieveItem(request: IssueRequestVm): Observable<ApiResponseObject<StoreRequestResponse>> {
      debugger
      return this.httpClient.post<ApiResponseObject<StoreRequestResponse>>(`${environment.apiUrl}/InventoryMovement/AknowledgeDisbursedItems`, request,);
    }

}
