import { Injectable } from '@angular/core';
import { LoginResponseData } from 'src/app/models/login-response-data';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  loginResponseData!:LoginResponseData ;
  constructor() { }
}