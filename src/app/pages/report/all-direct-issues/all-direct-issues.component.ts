import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ItemRequestResponse } from 'src/app/models/itemRequestResponse';
import { ReportsService } from 'src/app/services/reports/reports.service';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { Router } from '@angular/router';


@Component({
  selector: 'app-all-direct-issues',
  templateUrl: './all-direct-issues.component.html',
  styleUrls: ['./all-direct-issues.component.scss']
})
export class AllDirectIssuesComponent implements OnInit {
  
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator; // Define MatPaginator
  @ViewChild(MatSort, { static: true }) sort: MatSort = new MatSort; //search

  constructor(private reportsService: ReportsService, private router: Router, ) 
  {

  }

  

  
  displayedColumns: string[] = ['position', 'reference', 'itemName', 'description', 'quantity', 'sourceStoreName', 'Status', 'action'];
  GetMyItemRequests: ItemRequestResponse[] = [];
  displayedData: ItemRequestResponse[] = [];
  dataSource = new MatTableDataSource<ItemRequestResponse>(this.GetMyItemRequests);  //paginator
  sidebarOpen: boolean = false;
  selectedRequest!: ItemRequestResponse;


  ngOnInit(): void {
    this.getAllDirectIssues();
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator; 
  }



  async getAllDirectIssues() {
    let resGetAllItemRequests = await this.reportsService.getAllDirectIssues().toPromise();
    debugger;
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

  openSidebar(req: ItemRequestResponse){
    this.sidebarOpen = true;
    this.selectedRequest = req;
  }

  closeSidebar(){
    this.sidebarOpen = false;
  }

    exportToExcel(): void {
      // Use this.dataSource.data to get the current data
      const filteredData = this.dataSource.filteredData.map(row => ({
        'Reference': row.reference,
        'Item': row.itemName,
        'Description': row.description,
        'Quantity': row.quantity,
        'Source Store': row.sourceStoreName,
        'Destination Store': row.destinationStoreName,
        'Disbursed Date': row.requestDate,
        'Status': row.status
      }));
  
      const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(filteredData);
      const workbook: XLSX.WorkBook = {
        Sheets: { 'data': worksheet },
        SheetNames: ['data']
      };
  
      const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, 'Direct_Issues');
  }
  
    private saveAsExcelFile(buffer: any, fileName: string): void {
      const blob = new Blob([buffer], { type: 'application/octet-stream' });
      saveAs(blob, `${fileName}.xlsx`);
    }


goToPendingWithMe(): void {
  this.router.navigate(['/home/itPendingRequests']);
}

}
