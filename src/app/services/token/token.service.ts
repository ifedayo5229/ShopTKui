import { Injectable } from '@angular/core';
import { LoginResponseData } from 'src/app/models/login-response-data';
import { Profile } from 'src/app/models/profile';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor() { }

  saveSession(tokenResponse: LoginResponseData) {

    window.localStorage.setItem('AT', tokenResponse.accessToken);
    window.localStorage.setItem('RT', tokenResponse.refreshToken);
    if (tokenResponse.profile.id) 
    {
      window.localStorage.setItem('ID', tokenResponse.profile.id.toString());
      window.localStorage.setItem('FN', `${tokenResponse.profile.firstName} ${tokenResponse.profile.lastName}`);
      window.localStorage.setItem('EM', `${tokenResponse.profile.email}`);
      window.localStorage.setItem('FNAME', `${tokenResponse.profile.firstName}`);
      window.localStorage.setItem('LMANAGER', `${tokenResponse.profile.lineManager}`);
      window.localStorage.setItem('HOD', `${tokenResponse.profile.headOfUnit}`);
      window.localStorage.setItem('FUNCTIONHEAD', `${tokenResponse.profile.firstName}`);
      window.localStorage.setItem('LNAME', `${tokenResponse.profile.lastName}`);
      window.localStorage.setItem('FULLNAME', `${tokenResponse.profile.fullname}`);
      window.localStorage.setItem('PO', `${tokenResponse.profile.position}`);
      window.localStorage.setItem('ROLENAME', `${tokenResponse.profile.roleName}`);
      window.localStorage.setItem('RID', `${tokenResponse.profile.roleId}`);
    }

  }

  getSession(): LoginResponseData | null {
  
    if (window.localStorage.getItem('AT')) {
      const profiles: Profile = {
        firstName: window.localStorage.getItem('FNAME') || '',
        lastName: window.localStorage.getItem('LNAME') || '',
        fullname: window.localStorage.getItem('FULLNAME') || '',
        email: window.localStorage.getItem('EM') || '',
        lineManager: window.localStorage.getItem('LMANAGER') || '',
        headOfUnit: window.localStorage.getItem('HOD') || '',
        headOfFunction: window.localStorage.getItem('FUNCTIONHEAD') || '',
        phoneNumber: '',
        isEmailConfirmed: false,
        isSuperAdmin: false,
        departmentId: 0,
        designationId: 0,
        functionName: '',
        id: window.localStorage.getItem('ID') || '',
        isActive: false,
        roleId: Number(window.localStorage.getItem('RID')) || 0,
        roleName: window.localStorage.getItem('ROLENAME') || '',
        departmentName: '',
        position: '',
        designationName: '',
        isManager: false,
        managerId: '',
        mustChangePassword: false,
      
      };
      const tokenResponse: LoginResponseData = {
        accessToken: window.localStorage.getItem('AT') || '',
        refreshToken: window.localStorage.getItem('RT') || '',
        fullNamme: window.localStorage.getItem('FN') || '',
        profile: profiles,
        expiredIn: 0,
        permission: []
      };

      return tokenResponse;
    }
    return null;
  }
  isLoggedIn(): boolean {
    let session = this.getSession();
    if (!session) {
      return false;
    }
    // check if token is expired
    const jwtToken = JSON.parse(atob(session.accessToken.split('.')[1]));
    const tokenExpired = Date.now() > (jwtToken.exp * 1000);

    return !tokenExpired;

  }

  setInfo(data: LoginResponseData) {
    
    data.accessToken='';
    data.refreshToken='';
 
    const jsonData = JSON.stringify(data)
    localStorage.setItem('myData', jsonData)
   
 }

 getInfo() : LoginResponseData
 {
 
   var my_object :LoginResponseData = JSON.parse(localStorage.getItem('myData')!);
  
  return  my_object;
  
 }
}

