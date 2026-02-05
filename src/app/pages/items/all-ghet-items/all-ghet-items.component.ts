import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { User } from 'src/app/models/user';
import { Item } from 'src/app/models/item';
import { ItemService } from 'src/app/services/item/item.service';

@Component({
  selector: 'app-all-ghet-items',
  templateUrl: './all-ghet-items.component.html',
  styleUrls: ['./all-ghet-items.component.scss']
})
export class AllGhetItemsComponent implements OnInit {
  
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator; // Define MatPaginator
  @ViewChild(MatSort, { static: true }) sort: MatSort = new MatSort; //search

  constructor(private itemService: ItemService) {}

  
  displayedColumns: string[] = ['position', 'reference', 'itemName', 'description', 'categoryName'];
  GetMyItems: Item[] = [];
  displayedData: Item[] = [];
  dataSource = new MatTableDataSource<Item>(this.GetMyItems);  //paginator
  item: Item | undefined;



  ngOnInit(): void {
    this.getAllGhetItems();
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator; 
  }

  async getAllGhetItems() {
    let resGetAllItems = await this.itemService.getallGhetItems().toPromise();
    this.GetMyItems = <Item[]>resGetAllItems?.responseData;
    this.dataSource = new MatTableDataSource<Item>(this.GetMyItems); //for paginator
    this.dataSource.sort = this.sort;             //for search
    this.dataSource.paginator = this.paginator;   //for paginator
  }

  //Search function
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
