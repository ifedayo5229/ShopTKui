import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/app/environments/environment.prod';
import { ApiResponseObject } from 'src/app/models/api-response-object';
import { Category } from 'src/app/models/category';
import { CreateCategoryVM } from 'src/app/models/createCategoryVM';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private httpClient: HttpClient) { }

  getAllCategories(): Observable<ApiResponseObject<Category[]>> {
    debugger
    return this.httpClient.get<ApiResponseObject<Category[]>>(`${environment.apiUrl}/ItemCategories/all`);
  }

  createCategory(request: CreateCategoryVM): Observable<ApiResponseObject<Category>> {
    debugger
    return this.httpClient.post<ApiResponseObject<Category>>(`${environment.apiUrl}/ItemCategories/create`, request,);
  }

}
