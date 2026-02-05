import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ItemRequestResponse } from 'src/app/models/itemRequestResponse';
import { ReportsService } from 'src/app/services/reports/reports.service';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { Router } from '@angular/router';
import { EquipmentFormResponse } from 'src/app/models/equipmentFormResponse';


@Component({
  selector: 'app-all-equipment-forms',
  templateUrl: './all-equipment-forms.component.html',
  styleUrls: ['./all-equipment-forms.component.scss']
})
export class AllEquipmentFormsComponent implements OnInit {
  
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator; // Define MatPaginator
  @ViewChild(MatSort, { static: true }) sort: MatSort = new MatSort; //search

  constructor(private reportsService: ReportsService, private router: Router, ) 
  {

  }

  

  
  displayedColumns: string[] = ['position', 'reference', 'itemName', 'description', 'quantity', 'sourceStoreName', 'Status', 'action'];
  GetEquipmentForms: EquipmentFormResponse[] = [];
  displayedData: EquipmentFormResponse[] = [];
  dataSource = new MatTableDataSource<EquipmentFormResponse>(this.GetEquipmentForms);  //paginator
  sidebarOpen: boolean = false;
  selectedForm!: EquipmentFormResponse;


  ngOnInit(): void {
    this.getAllDirectIssues();
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator; 
  }



  async getAllDirectIssues() {
    let resGetAllEquipForms = await this.reportsService.getAllEquipmentForms().toPromise();
    debugger;
    this.GetEquipmentForms = <EquipmentFormResponse[]><unknown>resGetAllEquipForms?.responseData;
    this.dataSource = new MatTableDataSource<EquipmentFormResponse>(this.GetEquipmentForms); //for paginator
    this.dataSource.sort = this.sort;             //for search
    this.dataSource.paginator = this.paginator;   //for paginator
    console.log(this.GetEquipmentForms);
    debugger;
  }
   

  //Search function
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openSidebar(form: EquipmentFormResponse){
    this.sidebarOpen = true;
    this.selectedForm = form;
  }

  closeSidebar(){
    this.sidebarOpen = false;
  }

    exportToExcel(): void {
      // Use this.dataSource.data to get the current data
      const filteredData = this.dataSource.filteredData.map(row => ({
        'Requester Email': row.emailAddress,
        'Name': row.employeeName,
        'Employee ID/Phone No': row.employeeIdOrPhoneNumber,
        'Department': row.department,
        'Location': row.location,
        'Manager Name': row.managerName,
        'Manager Confirmation': row.managerAlignedConfirmation,
        'Equipment Type': row.equipmentType,
        'Manufacturer': row.manufacturer,
        'Model': row.model,
        'Serial/Part No': row.serialOrPartNumber,
        'Computer Hostname': row.computerHostName,
        'Items': row.item,
        'Issued Date': new Date(row.dateIssued).toLocaleString(),
        'Additional Comment': row.additionalComment,
        'Returned Old System Hostname': row.oldSystemHostNameReturned,
        'Employee Acknowledgement': row.equipmentAcknowledgedByEmployee,
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
