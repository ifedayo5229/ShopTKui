import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator  } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { User } from 'src/app/models/user';
import { ItemService } from 'src/app/services/item/item.service';
import { InventoryMovement } from 'src/app/models/inventory-movement';
import { InventoryMovementService } from 'src/app/services/inventoryMovement/inventory-movement.service';
import { StoreLocationService } from 'src/app/services/store-location/store-location.service';

@Component({
  selector: 'app-outward-movements',
  templateUrl: './outward-movements.component.html',
  styleUrls: ['./outward-movements.component.scss']
})
export class OutwardMovementsComponent implements OnInit {
  
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator; // Define MatPaginator
  @ViewChild(MatSort, { static: true }) sort: MatSort = new MatSort; //search

  constructor(private inventoryMovementService: InventoryMovementService, private itemService: ItemService,
              private storeLocationService: StoreLocationService ) 
  {

  }

  
  displayedColumns: string[] = ['position', 'item', 'store', 'movtType', 'quantity', 'receivedBy', 'movtDate'];
  GetMyInventoryMovts: InventoryMovement[] = [];
  displayedData: InventoryMovement[] = [];
  dataSource = new MatTableDataSource<InventoryMovement>(this.GetMyInventoryMovts);  //paginator
  itemNames: { [key: number]: string | undefined} = {};
  storeNames: { [key: number]: string | undefined } = {};



  ngOnInit(): void {
    this.getAllInventoryMovts();
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator; 
  }


  async getAllInventoryMovts() {
    let resGetAllInventoryMovts = await this.inventoryMovementService.getallInventoryMovements().toPromise();
    this.GetMyInventoryMovts = <InventoryMovement[]>resGetAllInventoryMovts?.responseData;

  
  debugger;
  // Fetch store names
  this.GetMyInventoryMovts.forEach(movt => {
    this.storeLocationService.getStoreLocationNameById(movt.storeId).then(name => {
      this.storeNames[movt.storeId] = name;
    });
  });

    this.dataSource = new MatTableDataSource<InventoryMovement>(this.GetMyInventoryMovts); 
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
