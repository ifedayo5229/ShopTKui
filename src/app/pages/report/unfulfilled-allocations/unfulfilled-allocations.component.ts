import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ItemRequestResponse } from 'src/app/models/itemRequestResponse';
import { ItemRequestService } from 'src/app/services/item-request/item-request.service';
import { ReportsService } from 'src/app/services/reports/reports.service';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-unfulfilled-allocations',
  templateUrl: './unfulfilled-allocations.component.html',
  styleUrls: ['./unfulfilled-allocations.component.scss']
})
export class UnfulfilledAllocationsComponent implements OnInit {
  
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator; // Define MatPaginator
  @ViewChild(MatSort, { static: true }) sort: MatSort = new MatSort; //search

  constructor(private reportsService: ReportsService) 
  {

  }

  
  displayedColumns: string[] = ['position', 'reference', 'itemName', 'description', 'quantity', 'sourceStoreName', 'requestedDate', 'Status'];
  GetMyItemRequests: ItemRequestResponse[] = [];
  filteredRequests: ItemRequestResponse[] = [];
  displayedData: ItemRequestResponse[] = [];
  dataSource = new MatTableDataSource<ItemRequestResponse>(this.GetMyItemRequests);  //paginator
  



  ngOnInit(): void {
    this.getAllRequests();
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator; 
  }


  async getAllRequests() {
    let resGetAllRequests = await this.reportsService.getAllRequests().toPromise();
    debugger;
    this.GetMyItemRequests = <ItemRequestResponse[]><unknown>resGetAllRequests?.responseData;
    this.filteredRequests = this.GetMyItemRequests.filter(item => item.status.toLowerCase() !== 'issued');
    this.dataSource = new MatTableDataSource<ItemRequestResponse>(this.filteredRequests); //for paginator
    this.dataSource.sort = this.sort;             //for search
    this.dataSource.paginator = this.paginator;   //for paginator
    debugger;
  }

  //Search function
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  exportToExcel(): void {
    
    const filteredData = this.dataSource.filteredData.map(row => ({
      'Reference': row.reference,
      'Item': row.itemName,
      'Description': row.description,
      'Quantity': row.quantity,
      'Source Store': row.sourceStoreName,
      'Request Date': row.requestDate,
      'Status': row.status
    }));
  
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook: XLSX.WorkBook = {
      Sheets: { 'data': worksheet },
      SheetNames: ['data']
    };
  
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, 'Unfulfilled_Allocations');
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const blob = new Blob([buffer], { type: 'application/octet-stream' });
    saveAs(blob, `${fileName}.xlsx`);
  }

}
