import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { User } from 'src/app/models/user';
import { StoreLocationService } from 'src/app/services/store-location/store-location.service';
import { StoreLocation } from 'src/app/models/store-location';

@Component({
  selector: 'app-view-stores',
  templateUrl: './view-stores.component.html',
  styleUrls: ['./view-stores.component.scss']
})
export class ViewStoresComponent implements OnInit {
  
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator; // Define MatPaginator
  @ViewChild(MatSort, { static: true }) sort: MatSort = new MatSort; //search

  constructor(private storeLocationService: StoreLocationService) 
  {

  }

  
  displayedColumns: string[] = ['position', 'storeName', 'desription', 'function', 'location', 'storeKeeper', 'isMainStore', 'createdDate'];
  GetMyStores: StoreLocation[] = [];
  displayedData: StoreLocation[] = [];
  dataSource = new MatTableDataSource<StoreLocation>(this.GetMyStores);  //paginator



  ngOnInit(): void {
    this.getAllInventoryMovts();
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator; 
  }


  async getAllInventoryMovts() {
    let resGetAllStores= await this.storeLocationService.getallStoreLocations().toPromise();
    this.GetMyStores = <StoreLocation[]><unknown>resGetAllStores?.responseData;

    this.dataSource = new MatTableDataSource<StoreLocation>(this.GetMyStores); 
    this.dataSource.sort = this.sort;            
    this.dataSource.paginator = this.paginator;      
  }





  //Search function
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  viewUser(user: User) {
    // this.selectedUser = user;
    // this.fetchUserRoles(user);
  }
}
