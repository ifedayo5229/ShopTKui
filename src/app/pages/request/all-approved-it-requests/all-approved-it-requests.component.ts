import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ItemRequestResponse } from 'src/app/models/itemRequestResponse';
import { ItemRequestService } from 'src/app/services/item-request/item-request.service';
import { LoginResponseData } from 'src/app/models/login-response-data';
import { TokenService } from 'src/app/services/token/token.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ValidationService } from 'src/app/services/shared/validation.service';
import { LogUsageRequest } from 'src/app/models/logUsageRequest';
import { UsageLog } from 'src/app/models/usageLog';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-all-approved-it-requests',
  templateUrl: './all-approved-it-requests.component.html',
  styleUrls: ['./all-approved-it-requests.component.scss']
})
export class AllApprovedItRequestsComponent implements OnInit {
  
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator; // Define MatPaginator
  @ViewChild(MatSort, { static: true }) sort: MatSort = new MatSort; //search

  constructor(private toastr: ToastrService,private fb: FormBuilder, 
              private itemRequestService: ItemRequestService, private tokenService: TokenService, 
              private validationService: ValidationService, private router: Router,) 
  {

  }

  displayedColumns: string[] = ['position', 'reference', 'itemName', 'description', 'quantity','sourceStoreName', 'Status', 'actions'];
  GetMyApprovedITRequests: ItemRequestResponse[] = [];
  displayedData: ItemRequestResponse[] = [];
  dataSource = new MatTableDataSource<ItemRequestResponse>(this.GetMyApprovedITRequests);  //paginator
  
  userId: string = '';
  userEmail: string = '';
  currentUser: any;
  selectedRequest!: ItemRequestResponse;
  isSubmitting: boolean = false;
  requestId: number = 0;
  selectedItem: string = "";

  ngOnInit(): void {
    this.getinfo();
    this.getApprovedITRequests();
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator; 
  }

  getinfo(){
    debugger
    
      const loginResponse: LoginResponseData = this.tokenService.getInfo();
      var datas = loginResponse.permission;

      this.currentUser = this.tokenService.getInfo(); 
      this.userId = this.currentUser.profile.id;
      this.userEmail = this.currentUser.profile.email;
    }



  async getApprovedITRequests() {
    let resGetApprovedITRequests = await this.itemRequestService.getMyApprovedITRequests(this.userEmail).toPromise();
    this.GetMyApprovedITRequests = <ItemRequestResponse[]><unknown>resGetApprovedITRequests?.responseData;
    this.dataSource = new MatTableDataSource<ItemRequestResponse>(this.GetMyApprovedITRequests); //for paginator
    this.dataSource.sort = this.sort;             //for search
    this.dataSource.paginator = this.paginator;   //for paginator
    console.log(this.GetMyApprovedITRequests);
    debugger;
  }

  //Search function
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  goToForm(req: ItemRequestResponse): void {
  this.router.navigate(['/home/equipmentForm'], {
    queryParams: { issueId: req.id }
  });
}

  
}
