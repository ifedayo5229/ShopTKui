import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/app/environments/environment.prod';
import { ApiResponseObject } from 'src/app/models/api-response-object';
import { ApproveRequestVm } from 'src/app/models/approveRequestVm';
import { EquipmentForm } from 'src/app/models/fill-equipmentVm';
import { GhetItemRequest } from 'src/app/models/ghet-requestVm';
import { IssueRequestVm } from 'src/app/models/issue-requestVm';
import { IssuedEquipment } from 'src/app/models/issued-equipment';
import { ItemRequestResponse } from 'src/app/models/itemRequestResponse';
import { LogUsageRequest } from 'src/app/models/logUsageRequest';
import { Item, RequestItems } from 'src/app/models/requestItemVm';
import { StoreRequestResponse } from 'src/app/models/storeRequestResponse';
import { UsageLog } from 'src/app/models/usageLog';

@Injectable({
  providedIn: 'root'
})
export class ItemRequestService {

  constructor(private httpClient: HttpClient) { }


  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('AT')}`,
      'Content-Type': 'application/json'
    });
  }

  private request<T>(method: 'GET' | 'POST', url: string, body?: any): Observable<ApiResponseObject<T>> {
    return this.httpClient.request<ApiResponseObject<T>>(method, `${environment.apiUrl}/${url}`, {
      body,
      headers: this.getHeaders()
    });
  }
  


  createRequestForItems(request: RequestItems): Observable<ApiResponseObject<ItemRequestResponse>> {
    debugger
    return this.httpClient.post<ApiResponseObject<ItemRequestResponse>>(`${environment.apiUrl}/Requests/create`, request,);
  }

  createGhetItemRequest(request: GhetItemRequest): Observable<ApiResponseObject<any>> {
    return this.request('POST', 'Requests/CreateRequestForGhetItems', request);
  }


  // getAllIsolators(): Observable<ApiResponseObject<Isolator[]>> {
  // debugger;
  //   return this.httpClient.get<ApiResponseObject<Isolator[]>>(
  //     `${environment.apiUrl}/EnergyIsolationPermitRequest/GetUsersWithIsolatorRole`
  //   );
  // }

  fillEquimentForm(request: EquipmentForm): Observable<ApiResponseObject<IssuedEquipment>> {
    debugger
    return this.httpClient.post<ApiResponseObject<IssuedEquipment>>(`${environment.apiUrl}/InventoryMovement/FillEquipmentForm`, request,);
  } 

  createStoreRequest(request: RequestItems): Observable<ApiResponseObject<ItemRequestResponse>> {
    debugger
    return this.httpClient.post<ApiResponseObject<ItemRequestResponse>>(`${environment.apiUrl}/Requests/CreateStoreRequest`, request,);
  }

  getallItemRequests(): Observable<ApiResponseObject<ItemRequestResponse[]>> {
    debugger
    return this.httpClient.get<ApiResponseObject<ItemRequestResponse[]>>(`${environment.apiUrl}/Requests/all`);
  }

  getMyApprovedITRequests(email: string): Observable<ApiResponseObject<ItemRequestResponse[]>> {
    debugger
    return this.httpClient.get<ApiResponseObject<ItemRequestResponse[]>>(`${environment.apiUrl}/InventoryMovement/GetMyApprovedRequestIT/${email}`);
  }

  getallPendingRequests(userId: string): Observable<ApiResponseObject<ItemRequestResponse[]>> {
    debugger
    return this.httpClient.get<ApiResponseObject<ItemRequestResponse[]>>(`${environment.apiUrl}/Requests/GetPendingRequest/${userId}`);
  }

  getallPendingItRequests(userEmail: string): Observable<ApiResponseObject<ItemRequestResponse[]>> {
    debugger
    return this.httpClient.get<ApiResponseObject<ItemRequestResponse[]>>(`${environment.apiUrl}/InventoryMovement/GetMyPendingDirectIssueFromITStore/${userEmail}`);
  }

  getallPendingGhetquests(userEmail: string): Observable<ApiResponseObject<ItemRequestResponse[]>> {
    debugger
    return this.httpClient.get<ApiResponseObject<ItemRequestResponse[]>>(`${environment.apiUrl}/Requests/GetGhetRequestPendingwithMe/${userEmail}`);
  }

  getallGhetquests(): Observable<ApiResponseObject<ItemRequestResponse[]>> {
    debugger
    return this.httpClient.get<ApiResponseObject<ItemRequestResponse[]>>(`${environment.apiUrl}/Requests/GetAllGhetRequests`);
  }

  getRequestsPendingCPASD(): Observable<ApiResponseObject<ItemRequestResponse[]>> {
    debugger
    return this.httpClient.get<ApiResponseObject<ItemRequestResponse[]>>(`${environment.apiUrl}/Requests/GetAllGhetRequestsPendingCPASDAction`);
  } 

  getRequestBy(id: number): Observable<ApiResponseObject<ItemRequestResponse>> {
    debugger
    return this.httpClient.get<ApiResponseObject<ItemRequestResponse>>(`${environment.apiUrl}/Requests/${id}`);
  }

  getITRequestBy(id: number): Observable<ApiResponseObject<ItemRequestResponse>> {
    debugger
    return this.httpClient.get<ApiResponseObject<ItemRequestResponse>>(`${environment.apiUrl}/InventoryMovement/GetDirectIssueById/${id}`);
  }

  getGhetRequestBy(id: number): Observable<ApiResponseObject<ItemRequestResponse>> {
    debugger
    return this.httpClient.get<ApiResponseObject<ItemRequestResponse>>(`${environment.apiUrl}/Requests/GetGhetRequestById/${id}`);
  } 

  getAllRequestsBy(userId: string): Observable<ApiResponseObject<ItemRequestResponse[]>> {
    debugger
    return this.httpClient.get<ApiResponseObject<ItemRequestResponse[]>>(`${environment.apiUrl}/Requests/user/${userId}`);
  }

  getallPendingStoreRequests(userEmail: string): Observable<ApiResponseObject<StoreRequestResponse[]>> {
    debugger
    return this.httpClient.get<ApiResponseObject<StoreRequestResponse[]>>(`${environment.apiUrl}/Requests/GetPendingStoreRequestStoremanager/${userEmail}`);
  }

  getMyPendingRequests(userId: string): Observable<ApiResponseObject<ItemRequestResponse[]>> {
    debugger
    return this.httpClient.get<ApiResponseObject<ItemRequestResponse[]>>(`${environment.apiUrl}/Requests/user/${userId}`);
  }

  approveRequest(request: ApproveRequestVm): Observable<ApiResponseObject<ItemRequestResponse>> {
    debugger
    return this.httpClient.post<ApiResponseObject<ItemRequestResponse>>(`${environment.apiUrl}/Requests/Approve`, request,);
  }

  approveITRequest(request: ApproveRequestVm): Observable<ApiResponseObject<ItemRequestResponse>> {
    debugger
    return this.httpClient.post<ApiResponseObject<ItemRequestResponse>>(`${environment.apiUrl}/InventoryMovement/DirectIssueApproval`, request,);
  }

  approveGhetRequest(request: ApproveRequestVm): Observable<ApiResponseObject<ItemRequestResponse>> {
    debugger
    return this.httpClient.post<ApiResponseObject<ItemRequestResponse>>(`${environment.apiUrl}/Requests/ApproveGhetRequest`, request,);
  } 

  issueRequests(request: IssueRequestVm): Observable<ApiResponseObject<ItemRequestResponse>> {
    debugger
    return this.httpClient.post<ApiResponseObject<ItemRequestResponse>>(`${environment.apiUrl}/Requests/Issue`, request,);
  }

  rejectRequest(request: ApproveRequestVm): Observable<ApiResponseObject<ItemRequestResponse>> {
    debugger
    return this.httpClient.post<ApiResponseObject<ItemRequestResponse>>(`${environment.apiUrl}/Requests/Reject`, request,);
  }

  rejectITRequest(request: ApproveRequestVm): Observable<ApiResponseObject<ItemRequestResponse>> {
    debugger
    return this.httpClient.post<ApiResponseObject<ItemRequestResponse>>(`${environment.apiUrl}/InventoryMovement/DirectIssueReject`, request,);
  }

  logItemUsage(request: LogUsageRequest): Observable<ApiResponseObject<ItemRequestResponse>> {
    debugger
    return this.httpClient.post<ApiResponseObject<ItemRequestResponse>>(`${environment.apiUrl}/Requests/ExecutionReport`, request,);
  }

  getallUsageLogs(requestId: number): Observable<ApiResponseObject<UsageLog[]>> {
    debugger
    return this.httpClient.get<ApiResponseObject<UsageLog[]>>(`${environment.apiUrl}/Requests/GetExecutionReportByRequestId/${requestId}`);
  }
  
}
