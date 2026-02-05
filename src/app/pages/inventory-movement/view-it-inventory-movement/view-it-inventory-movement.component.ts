import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { User } from 'src/app/models/user';
import { ItemService } from 'src/app/services/item/item.service';
import { InventoryMovement } from 'src/app/models/inventory-movement';
import { InventoryMovementService } from 'src/app/services/inventoryMovement/inventory-movement.service';
import { StoreLocationService } from 'src/app/services/store-location/store-location.service';
import { TokenService } from 'src/app/services/token/token.service';

@Component({
  selector: 'app-view-it-inventory-movement',
  templateUrl: './view-it-inventory-movement.component.html',
  styleUrls: ['./view-it-inventory-movement.component.scss']
})
export class ViewItInventoryMovementComponent implements OnInit {
  
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator; // Define MatPaginator
  @ViewChild(MatSort, { static: true }) sort: MatSort = new MatSort; //search

  constructor(private inventoryMovementService: InventoryMovementService, private itemService: ItemService,
              private storeLocationService: StoreLocationService, private tokenService: TokenService ) 
  {

  }

  
  displayedColumns: string[] = ['position', 'itemCode', 'item', 'store', 'quantity'];
  GetMyInventoryMovts: InventoryMovement[] = [];
  displayedData: InventoryMovement[] = [];
  dataSource = new MatTableDataSource<InventoryMovement>(this.GetMyInventoryMovts);  //paginator
  storeId!: number;
  currentUser: any;



  ngOnInit(): void {
    this.getinfo();
    this.getITInventoryMovts(this.storeId);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator; 
  }

  getinfo(){
    debugger
      this.currentUser = this.tokenService.getInfo(); 
      
      var roles = this.currentUser.roles;
      this.setStoreDetails(roles);
    }

  async getITInventoryMovts(id: number) {
    let resGetInwardMovtsByStoreId = await this.inventoryMovementService.getITInventoryByStoreId(id).toPromise();
    this.GetMyInventoryMovts = <InventoryMovement[]>resGetInwardMovtsByStoreId?.responseData;

    this.dataSource = new MatTableDataSource<InventoryMovement>(this.GetMyInventoryMovts);
    console.log(this.GetMyInventoryMovts); 
    this.dataSource.sort = this.sort;            
    this.dataSource.paginator = this.paginator;    
  }

  //This gets the store name and store Id from array of roles objects
  setStoreDetails(data: any[]) {
    const storeDetails = data.find(item => item.roleName === "Store Manager");

    if (storeDetails) {
      this.storeId = storeDetails.storeId;
    } else {
      console.error("Store Manager role not found.");
    }
  }

  //Search function
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
