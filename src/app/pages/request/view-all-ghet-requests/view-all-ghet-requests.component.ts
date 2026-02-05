import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { User } from 'src/app/models/user';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ItemRequestResponse } from 'src/app/models/itemRequestResponse';
import { ItemRequestService } from 'src/app/services/item-request/item-request.service';
import { TokenService } from 'src/app/services/token/token.service';
import { LoginResponseData } from 'src/app/models/login-response-data';
import { GhetApproveDialogComponent } from '../../pending-approvals/ghet-approve-dialog/ghet-approve-dialog.component';

@Component({
  selector: 'app-view-all-ghet-requests',
  templateUrl: './view-all-ghet-requests.component.html',
  styleUrls: ['./view-all-ghet-requests.component.scss']
})
export class ViewAllGhetRequestsComponent implements OnInit {
closeDialog() {
throw new Error('Method not implemented.');
}
  
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator; // Define MatPaginator
  @ViewChild(MatSort, { static: true }) sort: MatSort = new MatSort; //search

  
  displayedColumns: string[] = ['position', 'reference', 'itemName', 'description', 'quantity', 'approvedQuantity', 'sourceStoreName', 'Status', 'actions'];
  GetAllGhetRequests: ItemRequestResponse[] = [];
  displayedData: ItemRequestResponse[] = [];
  dataSource = new MatTableDataSource<ItemRequestResponse>(this.GetAllGhetRequests);  //paginator
  isLoading: boolean = true;
  selectedRequest: ItemRequestResponse | null = null; 
  sidebarOpen: boolean = false;
  userId: string = '';
  userEmail: string = '';
  currentUser: any;
  userRoles: string[] = [];
  isStoreManager: boolean = false;
  isHoS: boolean = false;
  isLineManager: boolean = false;

  constructor(private dialog: MatDialog, 
              private itemRequestService: ItemRequestService,  
              private tokenService: TokenService)
   { 
    
   }


  ngOnInit(): void {
    this.getinfo();
    this.getAllGhetRequests();
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator; 
  }


  getinfo(){
    debugger
    
      const loginResponse: LoginResponseData = this.tokenService.getInfo();
      var datas = loginResponse.permission;
      this.userId = loginResponse.profile.id;
      this.userEmail = loginResponse.profile.email;

      this.currentUser = this.tokenService.getInfo(); 
      var roles = this.currentUser.roles;
      const userRoles = roles.map((role: { roleName: any; }) => role.roleName);
      if (userRoles.length == 0)
      {
        userRoles.push('Requester');
      }
      this.userRoles = userRoles;
    } 


        async getAllGhetRequests() {
          debugger
          let resGetAllGhetRequests = await this.itemRequestService.getallGhetquests().toPromise();
          this.GetAllGhetRequests = <ItemRequestResponse[]><unknown>resGetAllGhetRequests?.responseData;
          this.dataSource = new MatTableDataSource<ItemRequestResponse>(this.GetAllGhetRequests); //for paginator
          this.dataSource.sort = this.sort;             //for search
          this.dataSource.paginator = this.paginator;   //for paginator
          console.log(this.GetAllGhetRequests);
        }

        openSidebar(req: ItemRequestResponse): void {
          this.selectedRequest = req;
          this.sidebarOpen = true;
        }

  closeSidebar(): void {
    this.sidebarOpen = false;
    this.selectedRequest = null;
  }

  //Search function
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
