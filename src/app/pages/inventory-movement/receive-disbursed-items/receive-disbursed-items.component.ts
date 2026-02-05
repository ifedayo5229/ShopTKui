import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { RolesService } from 'src/app/services/roles/roles.service';
import { ToastrService } from 'ngx-toastr';
import { ItemRequestService } from 'src/app/services/item-request/item-request.service';
import { TokenService } from 'src/app/services/token/token.service';
import { LoginResponseData } from 'src/app/models/login-response-data';
import { StoreRequestResponse } from 'src/app/models/storeRequestResponse';
import { ApproveRequestDialogComponent } from '../../pending-approvals/approve-request-dialog/approve-request-dialog.component';
import { RejectRequestDialogComponent } from '../../pending-approvals/reject-request-dialog/reject-request-dialog.component';
import { InventoryMovementService } from 'src/app/services/inventoryMovement/inventory-movement.service';
import { ReceiveDisbursedItemDialogComponent } from '../../items/receive-disbursed-item-dialog/receive-disbursed-item-dialog.component';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-receive-disbursed-items',
  templateUrl: './receive-disbursed-items.component.html',
  styleUrls: ['./receive-disbursed-items.component.scss']
})
export class ReceiveDisbursedItemsComponent implements OnInit {
closeDialog() {
throw new Error('Method not implemented.');
}
  
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator; // Define MatPaginator
  @ViewChild(MatSort, { static: true }) sort: MatSort = new MatSort; //search

  
  displayedColumns: string[] = ['position', 'reference', 'itemName', 'description', 'quantity', 'sourceStoreName', 'Status', 'actions'];
  GetMyPendingRequests: StoreRequestResponse[] = [];
  displayedData: StoreRequestResponse[] = [];
  dataSource = new MatTableDataSource<StoreRequestResponse>(this.GetMyPendingRequests);  //paginator
  isLoading: boolean = true;
  selectedRequest: StoreRequestResponse | null = null; 
  sidebarOpen: boolean = false;
  userId: string = '';
  userEmail: string = '';
  currentUser: any;

  constructor(private dialog: MatDialog, private roleService: RolesService,
              private toastr: ToastrService, private itemRequestService: ItemRequestService, private inventorymovementService:InventoryMovementService,  private tokenService: TokenService,
  )
   { }


  ngOnInit(): void {
    this.getinfo();
    this.getAllPendingStoreRequests();
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator; 
  }


  getinfo(){
    debugger
    
      const loginResponse: LoginResponseData = this.tokenService.getInfo();
      var datas = loginResponse.permission;
      this.userId = loginResponse.profile.id;
      this.userEmail = loginResponse.profile.email;
    } 


        async getAllPendingStoreRequests() {
          debugger
          let resGetAllPendingRequests = await this.inventorymovementService.getallPendingdisburseditems(this.userEmail).toPromise();
          this.GetMyPendingRequests = <StoreRequestResponse[]><unknown>resGetAllPendingRequests?.responseData;
          this.dataSource = new MatTableDataSource<StoreRequestResponse>(this.GetMyPendingRequests); //for paginator
          this.dataSource.sort = this.sort;             //for search
          this.dataSource.paginator = this.paginator;   //for paginator
        }

        openSidebar(req: StoreRequestResponse): void {
          this.selectedRequest = req;
          this.sidebarOpen = true;
        }
      
        approveRequest (requestId: number) {
          debugger
          const dialogConfig = new MatDialogConfig();
          dialogConfig.data = { selectedRequestId: requestId };
          const dialogRef = this.dialog.open(ApproveRequestDialogComponent, dialogConfig);
      
          dialogRef.afterClosed().subscribe(result => {
            if (result) {
              window.location.reload();
            }
          });
        }

        receiveItem (requestId: number) {
          debugger
          const dialogConfig = new MatDialogConfig();
          dialogConfig.data = { selectedRequestId: requestId };
          const dialogRef = this.dialog.open(ReceiveDisbursedItemDialogComponent, dialogConfig);
      
          dialogRef.afterClosed().subscribe(result => {
            if (result) {
              window.location.reload();
            }
          });
        }


        rejectRequest (requestId: number) {
          debugger
          const dialogConfig = new MatDialogConfig();
          dialogConfig.data = { selectedRequestId: requestId };
          const dialogRef = this.dialog.open(RejectRequestDialogComponent, dialogConfig);
      
          dialogRef.afterClosed().subscribe(result => {
            if (result) {
              window.location.reload();
            }
          });
        }

  closeSidebar(): void {
    this.sidebarOpen = false;
    this.selectedRequest = null;
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

  convertToNumber(value: string | null | undefined): number {
    if (value === null || value === undefined) {
      return 0; 
    }
    const parsedValue = Number(value);
    return parsedValue;
  }

}
