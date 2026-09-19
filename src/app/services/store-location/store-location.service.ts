import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/app/environments/environment';
import { ApiResponseObject } from 'src/app/models/api-response-object';
import { CreateStoreVm } from 'src/app/models/createStore';
import { Store } from 'src/app/models/store';
import { StoreLocation } from 'src/app/models/store-location';

@Injectable({
  providedIn: 'root'
})
export class StoreLocationService {

  constructor(private httpClient: HttpClient) { }

  getallStoreLocations(): Observable<ApiResponseObject<StoreLocation[]>> {
    debugger
    return this.httpClient.get<ApiResponseObject<StoreLocation[]>>(`${environment.apiUrl}/StoreLocations/all`);
  }

  getallITStores(): Observable<ApiResponseObject<StoreLocation[]>> {
    debugger
    return this.httpClient.get<ApiResponseObject<StoreLocation[]>>(`${environment.apiUrl}/StoreLocations/allITStores`);
  }

  getallGhetStores(): Observable<ApiResponseObject<StoreLocation[]>> {
    debugger
    return this.httpClient.get<ApiResponseObject<StoreLocation[]>>(`${environment.apiUrl}/StoreLocations/allGhetStores`);
  }

  getStoreLocationById(id: number): Observable<ApiResponseObject<StoreLocation>> {
    debugger
    return this.httpClient.get<ApiResponseObject<StoreLocation>>(`${environment.apiUrl}/StoreLocations/${id}`);
  }

  getStoreLocationNameById(storeId: number): Promise<string | undefined> {
    return this.getStoreLocationById(storeId).toPromise().then(store => store?.responseData.name);
  }



  //this part is for Stores
  createStore(request: CreateStoreVm): Observable<ApiResponseObject<Store>> {
    debugger
    return this.httpClient.post<ApiResponseObject<Store>>(`${environment.apiUrl}/StoreLocations/create`, request,);
  }

}
