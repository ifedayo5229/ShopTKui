import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ItemRequestResponse } from 'src/app/models/itemRequestResponse';
import { ItemRequestService } from 'src/app/services/item-request/item-request.service';

@Component({
  selector: 'app-all-forms',
  templateUrl: './all-forms.component.html',
  styleUrls: ['./all-forms.component.scss']
})
export class AllFormsComponent implements OnInit {
  
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator; // Define MatPaginator
  @ViewChild(MatSort, { static: true }) sort: MatSort = new MatSort; //search

  constructor(private itemRequestService: ItemRequestService) 
  {

  }

  
  displayedColumns: string[] = ['position', 'itemName', 'description', 'quantity', 'sourceStoreName', 'requestedDate', 'Status'];
  GetMyItemRequests: ItemRequestResponse[] = [];
  displayedData: ItemRequestResponse[] = [];
  dataSource = new MatTableDataSource<ItemRequestResponse>(this.GetMyItemRequests);  //paginator
  



  ngOnInit(): void {
    this.getAllItemRequests();
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator; 
  }


  async getAllItemRequests() {
    let resGetAllItemRequests = await this.itemRequestService.getallItemRequests().toPromise();
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
