import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user/user.service';
import { MatDialog } from '@angular/material/dialog';
import { AssignRoleComponent } from '../assign-role/assign-role.component';
import { RolesService } from 'src/app/services/roles/roles.service';
import { RoleDto } from 'src/app/models/RoleDto';
import { ToastrService } from 'ngx-toastr';
import { AssignRolesComponent } from '../assign-roles/assign-roles.component';
import { AssignItManagerComponent } from '../assign-it-manager/assign-it-manager.component';

@Component({
  selector: 'app-view-users',
  templateUrl: './view-users.component.html',
  styleUrls: ['./view-users.component.scss']
})
export class ViewUsersComponent implements OnInit {
  
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator; // Define MatPaginator
  @ViewChild(MatSort, { static: true }) sort: MatSort = new MatSort; //search

  
  displayedColumns: string[] = ['position', 'name', 'email', 'positions', 'action'];
  GetMyUsers: User[] = [];
  displayedData: User[] = [];
  dataSource = new MatTableDataSource<User>(this.GetMyUsers);  //paginator
  isLoading: boolean = true;
  selectedUser: User | null = null; 
  sidebarOpen: boolean = false;
  userRoles: RoleDto[] = []; 
  isRolesLoading: boolean = false;
  isStoreManager: boolean = false;

  constructor(private userService: UserService, private dialog: MatDialog, private roleService: RolesService,
              private toastr: ToastrService
  ) 
  { }


  ngOnInit(): void {
    this.getAllUsers();
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator; 
  }

  openSidebar(user: User): void {
    this.selectedUser = user;
    this.sidebarOpen = true;
    this.fetchUserRoles(user.id);
  }

  openAddRoleDialog(): void {
    const dialogRef = this.dialog.open(AssignRoleComponent, {
      width: '400px',
      data: { userId: this.selectedUser?.id }
    });

    

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.fetchUserRoles(this.selectedUser?.id || '');
      }
    });
  }

  openAddItManagerRoleDialog(): void {
    const dialogRef = this.dialog.open(AssignItManagerComponent, {
      width: '400px',
      data: { userId: this.selectedUser?.id }
    });

    

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.fetchUserRoles(this.selectedUser?.id || '');
      }
    });
  }


  openAddRolesDialog(): void {
    const dialogRef = this.dialog.open(AssignRolesComponent, {
      width: '400px',
      data: { userId: this.selectedUser?.id, userRoles: this.userRoles }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.fetchUserRoles(this.selectedUser?.id || '');
      }
    });
  }

  async getAllUsers() {
    debugger
    let resGetAllUsers = await this.userService.getAllUsers().toPromise();
    this.GetMyUsers = <User[]>resGetAllUsers?.data;
    this.dataSource = new MatTableDataSource<User>(this.GetMyUsers); //for paginator
    this.dataSource.sort = this.sort;             //for search
    this.dataSource.paginator = this.paginator;   //for paginator
  }

  closeSidebar(): void {
    this.sidebarOpen = false;
    this.selectedUser = null;
  }

  fetchUserRoles(userId: string): void {
    this.isRolesLoading = true;
    this.roleService.getRolesForUser(userId).subscribe({
      next: (response) => {
        this.userRoles = response?.responseData || [];
        this.isRolesLoading = false;
  
        const hasStoreManagerRole = this.userRoles.some(role => role.roleName === 'Store Manager');
        if (hasStoreManagerRole) {
          this.isStoreManager = true;
          console.log(this.isStoreManager);
        } else {
          this.isStoreManager = false;
          console.log(this.isStoreManager);
        }
      },
      error: (error) => {
        console.error('Error fetching roles:', error.message || error);
        this.isRolesLoading = false;
      }
    });
  }
  

  removeRole(roleId: number) {
    debugger
    const userId = this.selectedUser?.id ;
    const id = roleId;
  
    const roleRequest: any = {
      userId: userId,
      id: id
    };
  
    if(id === null){
      console.log("Please select a role to remove.");
      return;
    }
  console.log(roleRequest);
    this.roleService.removeRoleFromUser(roleRequest).subscribe({
      next: (data) => {
        if (data.responseCode === "99") {
          console.log("Role not available for user");
        } 
        else if (data.responseCode === "00"){
          this.toastr.success('Role removed successfully');
              setTimeout(() => {
                window.location.reload();
              }, 1000);
        }
      },
      error: (error: any) => {
        console.log(error.error);
        this.toastr.success('Please try again');
              setTimeout(() => {
                window.location.reload();
              }, 1000);
      }
    });
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
