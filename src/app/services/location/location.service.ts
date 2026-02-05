import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponseObject } from 'src/app/models/api-response-object';
import { environment } from 'src/app/environments/environment.prod';
import { LocationDto } from 'src/app/models/locations';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  constructor(private httpClient: HttpClient) { }

  getAllLocations(): Observable<ApiResponseObject<LocationDto[]>> {
    debugger
    return this.httpClient.get<ApiResponseObject<LocationDto[]>>(`${environment.apiUrl}/Location/GetAll`);
  }
  
  
}
