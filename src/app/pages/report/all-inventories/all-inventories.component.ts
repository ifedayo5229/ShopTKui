import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { User } from 'src/app/models/user';
import { InventoryMovement } from 'src/app/models/inventory-movement';
import { ReportsService } from 'src/app/services/reports/reports.service';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { FormControl } from '@angular/forms';
import { StoreLocation } from 'src/app/models/store-location';
import { StoreLocationService } from 'src/app/services/store-location/store-location.service';
import { InventoryMovementService } from 'src/app/services/inventoryMovement/inventory-movement.service';

@Component({
  selector: 'app-all-inventories',
  templateUrl: './all-inventories.component.html',
  styleUrls: ['./all-inventories.component.scss']
})
export class AllInventoriesComponent implements OnInit {
  
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator; // Define MatPaginator
  @ViewChild(MatSort, { static: true }) sort: MatSort = new MatSort; //search

  constructor(private reportService: ReportsService, private storeLocationService: StoreLocationService, private inventoryService: InventoryMovementService) 
  {

  }

  
  displayedColumns: string[] = ['position', 'itemCode', 'item', 'store', 'quantity', 'costPerUnit'];
  GetMyInventoryMovts: InventoryMovement[] = [];
  displayedData: InventoryMovement[] = [];
  dataSource = new MatTableDataSource<InventoryMovement>(this.GetMyInventoryMovts);  //paginator
  storeId!: number;
  currentUser: any;

  searchInputStores = new FormControl();
  allStoreLocations: StoreLocation[] = [];
  filteredStoreLocations: StoreLocation[] = [];


  ngOnInit(): void {
    this.getAllInventoryMovts();
    this.getAllStoreLocations();
    this.setupStoreSearch();
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator; 
  }

  async getAllStoreLocations() {
    let resGetAllStoreLocations = await this.storeLocationService.getallStoreLocations().toPromise();
    this.allStoreLocations = <StoreLocation[]><unknown>resGetAllStoreLocations?.responseData;
    this.filteredStoreLocations = this.allStoreLocations;
  }

  async getAllInventoryMovts() {
    let resGetAllInventories = await this.reportService.getAllInventories().toPromise();
    this.GetMyInventoryMovts = <InventoryMovement[]>resGetAllInventories?.responseData;
    this.dataSource = new MatTableDataSource<InventoryMovement>(this.GetMyInventoryMovts); //for paginator
    this.dataSource.sort = this.sort;             //for search
    this.dataSource.paginator = this.paginator;   //for paginator
  }

  

  //Search function
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  setupStoreSearch() {
    this.searchInputStores.valueChanges.subscribe(value => {
      this.filterStores(value);
    });
  }

  filterStores(searchTerm: string) {
    if (!searchTerm) {
      this.filteredStoreLocations = this.allStoreLocations; // Reset to all stores if search term is empty
    } else {
      this.filteredStoreLocations = this.allStoreLocations.filter(store =>
        store.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
  }

  async onStoreChange(storeId: number): Promise<void> {

    if (storeId === null) {
      this.getAllInventoryMovts();
    }
    else{
    let resGetStoreInventories = await this.inventoryService.getInventoryMovementsByStoreId(storeId).toPromise();
    this.GetMyInventoryMovts = <InventoryMovement[]>resGetStoreInventories?.responseData;
    this.dataSource = new MatTableDataSource<InventoryMovement>(this.GetMyInventoryMovts); //for paginator
    this.dataSource.sort = this.sort;             //for search
    this.dataSource.paginator = this.paginator;
    }
    
  }

  viewUser(user: User) {
    // this.selectedUser = user;
    // this.fetchUserRoles(user);
  }

    exportToExcel(): void {

      const filteredData = this.dataSource.filteredData.map(row => ({
        'Reference': row.code,
        'Item': row.itemName,
        'Store': row.storeName,
        'Quantity': row.quantity,
        'Store Manager': row.receivedBy,
        'Movement Date': row.movementDate
        
      }));
  
      const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(filteredData);
      const workbook: XLSX.WorkBook = {
        Sheets: { 'data': worksheet },
        SheetNames: ['data']
      };
  
      const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, 'Inventories');
  }
  
    private saveAsExcelFile(buffer: any, fileName: string): void {
      const blob = new Blob([buffer], { type: 'application/octet-stream' });
      saveAs(blob, `${fileName}.xlsx`);
    }


}
