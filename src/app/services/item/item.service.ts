import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponseObject } from 'src/app/models/api-response-object';
import { environment } from 'src/app/environments/environment';
import { Item } from 'src/app/models/item';
import { CreateItem } from 'src/app/models/createItemVm';
import { GhetItem } from 'src/app/models/ghet-itemVm';

@Injectable({
  providedIn: 'root'
})
export class ItemService {

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



  createItems(request: CreateItem): Observable<ApiResponseObject<Item>> {
    debugger
    return this.httpClient.post<ApiResponseObject<Item>>(`${environment.apiUrl}/Items/create`, request,);
  }

  createITItems(request: CreateItem): Observable<ApiResponseObject<Item>> {
    debugger
    return this.httpClient.post<ApiResponseObject<Item>>(`${environment.apiUrl}/Items/createItemIT`, request,);
  } 

  // createGhetItems(model: FormData){
  //   debugger;
  //   return this.httpClient.post(`${environment.apiUrl}/Items/createGhetItems`, model);
  // }

  // createGhetItems(request: FormData): Observable<ApiResponseObject<any>> {
  //     return this.request('POST', 'Items/createGhetItems', request);
  //   }

     createGhetItems(request: FormData){
    debugger;
    return this.httpClient.post(`${environment.apiUrl}/Items/createGhetItems`, request);
  }


  getallItems(): Observable<ApiResponseObject<Item[]>> {
    debugger
    return this.httpClient.get<ApiResponseObject<Item[]>>(`${environment.apiUrl}/Items/all`);
  }

  getallITItems(): Observable<ApiResponseObject<Item[]>> {
    debugger
    return this.httpClient.get<ApiResponseObject<Item[]>>(`${environment.apiUrl}/Items/allIT`);
  }

  getallGhetItems(): Observable<ApiResponseObject<Item[]>> {
    debugger
    return this.httpClient.get<ApiResponseObject<Item[]>>(`${environment.apiUrl}/Items/GetAllGhetItems`);
  }

  getItemById(id: number): Observable<ApiResponseObject<Item>> {
    debugger
    return this.httpClient.get<ApiResponseObject<Item>>(`${environment.apiUrl}/Items/${id}`);
  }

  getItemImageById(id: number): Observable<any> {
    debugger
    return this.httpClient.get<any>(`${environment.docApiUrl}api/Documents/ViewDocument/${id}`);
  } 
  
}
