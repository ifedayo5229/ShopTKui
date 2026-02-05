import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginResponse } from 'src/app/models/loginResponse';
import { User } from 'src/app/models/user';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private httpClient: HttpClient) {

   }

   saveSession(loginResponse: LoginResponse) {

    window.localStorage.setItem('AT', loginResponse.accessToken);
    // window.localStorage.setItem('RT', loginResponse.tokens.refreshToken);
    window.localStorage.setItem('ID', loginResponse.profile.id.toString());
    window.localStorage.setItem('FN', `${loginResponse.profile.firstName} ${loginResponse.profile.lastName}`);
    window.localStorage.setItem('EM', `${loginResponse.profile.email}`);
    window.localStorage.setItem('FNAME', `${loginResponse.profile.firstName}`);
    window.localStorage.setItem('LNAME', `${loginResponse.profile.lastName}`);
    window.localStorage.setItem('ROLES', `${loginResponse.profile.roles}`);
  }
  
  getSession(): LoginResponse | null {

    if (window.localStorage.getItem('AT')) {
      const profiles: User = {
        firstName: window.localStorage.getItem('FNAME') || '',
        lastName: window.localStorage.getItem('LNAME') || '',
        email: window.localStorage.getItem('EM') || '',
        id: window.localStorage.getItem('ID') || '',
        roles: window.localStorage.getItem('ROLES') || []
      };
      const loginResponse: LoginResponse = {
        // tokens: {
          accessToken: window.localStorage.getItem('AT') || '',
          // refreshToken: window.localStorage.getItem('AT') || ''
        // },
        profile: profiles
      };

      return loginResponse;
    }
    return null;
  }

  setInfo(data: LoginResponse) {

    const jsonData = JSON.stringify(data)
    localStorage.setItem('myData', jsonData)

  }
  
  isLoggedIn(): boolean {
    debugger
    let session = this.getSession();
    if (session == null) {
      return false;
    }
    return true;
  }
  
  isTokenValid(): boolean {
    if (this.isLoggedIn()) {
      debugger
      // check if token is expired
      let accessToken = window.localStorage.getItem('AT') || ''
      const jwtToken = JSON.parse(atob(accessToken.split('.')[1]));
      const tokenExpired = Date.now() > (jwtToken.exp * 1000);
  
      return !tokenExpired;
    }
  
    return false
  }

  getInfo(): LoginResponse {

    var my_object: LoginResponse = JSON.parse(localStorage.getItem('myData')!);

    return my_object;

  }
   
}
