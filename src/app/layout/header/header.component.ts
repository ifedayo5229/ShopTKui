import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginResponseData } from 'src/app/models/login-response-data';
import { SidebarService } from 'src/app/services/sidebar/sidebar.service';
import { TokenService } from 'src/app/services/token/token.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(private router: Router, private sidebarService: SidebarService, private tokenService: TokenService) {}

  isSidebarOpen = true;
  currentUser: any;
  firstName: any;
  lastName: any;
  fullname: any;
  

  ngOnInit(): void {
    this.getinfo();
  }

  getinfo(){
    debugger
    
    const loginResponse: LoginResponseData = this.tokenService.getInfo();
    var datas = loginResponse.permission;

      this.currentUser = this.tokenService.getInfo(); 
      this.firstName = this.currentUser.profile.firstName;
      this.lastName = this.currentUser.profile.lastName;
      this.fullname =  this.lastName + ' ' + this.firstName
      // console.log(this.currentUser);
    }


    toggleSidebar() {
      this.sidebarService.toggleSidebar();
    }
  
    logoHome(){
      this.router.navigate(['/home/dashboard']);
    }
    onLogout(){
      window.localStorage.clear();
      this.router.navigate(['']);
    }

}

  


  


