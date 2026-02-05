import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-view-routes',
  templateUrl: './view-routes.component.html',
  styleUrls: ['./view-routes.component.scss']
})
export class ViewRoutesComponent implements OnInit {
  
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator; // Define MatPaginator
  @ViewChild(MatSort, { static: true }) sort: MatSort = new MatSort; //search

  
  displayedColumns: string[] = ['position', 'name', 'email', 'positions', 'action'];
  GetMyUsers: User[] = [];
  displayedData: User[] = [];
  dataSource = new MatTableDataSource<User>(this.GetMyUsers);  //paginator



  ngOnInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator; 
  }


  async getAllUsers() {
    // let resGetAllUsers = await this.userservice.getAlluser().toPromise();
    // this.GetMyUsers = <User[]>resGetAllUsers?.responseData;
    this.dataSource = new MatTableDataSource<User>(this.GetMyUsers); //for paginator
    this.dataSource.sort = this.sort;             //for search
    this.dataSource.paginator = this.paginator;   //for paginator
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
