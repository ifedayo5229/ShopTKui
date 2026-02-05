import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ItemRequestResponse } from 'src/app/models/itemRequestResponse';
import { ItemRequestService } from 'src/app/services/item-request/item-request.service';
import { LoginResponseData } from 'src/app/models/login-response-data';
import { TokenService } from 'src/app/services/token/token.service';

@Component({
  selector: 'app-view-store-request',
  templateUrl: './view-store-request.component.html',
  styleUrls: ['./view-store-request.component.scss']
})
export class ViewStoreRequestComponent implements OnInit {
  
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator; // Define MatPaginator
  @ViewChild(MatSort, { static: true }) sort: MatSort = new MatSort; //search

  constructor(private itemRequestService: ItemRequestService, private tokenService: TokenService) 
  {

  }

  
  displayedColumns: string[] = ['position', 'itemName', 'description', 'quantity', 'sourceStoreName', 'requestedDate', 'Status'];
  GetMyItemRequests: ItemRequestResponse[] = [];
  displayedData: ItemRequestResponse[] = [];
  dataSource = new MatTableDataSource<ItemRequestResponse>(this.GetMyItemRequests);  //paginator
  
  userId: string = '';
  userEmail: string = '';
  currentUser: any;


  ngOnInit(): void {
    this.getinfo();
    this.getAllItemRequests();
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator; 
  }

  getinfo(){
    debugger
    
      const loginResponse: LoginResponseData = this.tokenService.getInfo();
      var datas = loginResponse.permission;

      this.currentUser = this.tokenService.getInfo(); 
      this.userId = this.currentUser.profile.id;
      this.userEmail = this.currentUser.profile.email;
    }



  async getAllItemRequests() {
    let resGetAllItemRequests = await this.itemRequestService.getallPendingStoreRequests(this.userEmail).toPromise();
    this.GetMyItemRequests = <ItemRequestResponse[]><unknown>resGetAllItemRequests?.responseData;
    this.dataSource = new MatTableDataSource<ItemRequestResponse>(this.GetMyItemRequests); //for paginator
    this.dataSource.sort = this.sort;             //for search
    this.dataSource.paginator = this.paginator;   //for paginator
    debugger;
  }



  //Search function
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
