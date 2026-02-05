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

@Component({
  selector: 'app-my-item-requests',
  templateUrl: './my-item-requests.component.html',
  styleUrls: ['./my-item-requests.component.scss']
})
export class MyItemRequestsComponent implements OnInit {
  
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator; // Define MatPaginator
  @ViewChild(MatSort, { static: true }) sort: MatSort = new MatSort; //search

  constructor(private toastr: ToastrService,private fb: FormBuilder, private itemRequestService: ItemRequestService, private tokenService: TokenService, private validationService: ValidationService) 
  {
      this.logUsageForm = this.fb.group({
            items: this.fb.array([])
          });
  }

  
  displayedColumns: string[] = ['position', 'reference', 'itemName', 'description', 'quantity', 'approvedQuantity', 'sourceStoreName', 'Status', 'actions'];
  GetMyItemRequests: ItemRequestResponse[] = [];
  myUsageLogs: UsageLog[] = [];
  displayedData: ItemRequestResponse[] = [];
  dataSource = new MatTableDataSource<ItemRequestResponse>(this.GetMyItemRequests);  //paginator
  
  userId: string = '';
  currentUser: any;

  sidebarOpen: boolean = false;
  isLogUsageSidebarOpen: boolean = false;
  isViewLogSidebarOpen: boolean = false;
  selectedRequest!: ItemRequestResponse;

  logUsageForm: FormGroup;
  isSubmitting: boolean = false;
  requestId: number = 0;
  selectedItem: string = "";
  totalQuantityLogged: number = 0;
  canLogUsage: boolean = false;
  selectedReference: string = '';

  ngOnInit(): void {
    this.getinfo();
    this.getAllItemRequests();
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator; 
    this.addItem();
    // this.getAllUsageLogs(this.selectedRequest.id);
  }

  getinfo(){
    debugger
    
      const loginResponse: LoginResponseData = this.tokenService.getInfo();
      var datas = loginResponse.permission;

      this.currentUser = this.tokenService.getInfo(); 
      this.userId = this.currentUser.profile.id;
    }



  async getAllItemRequests() {
    let resGetAllItemRequests = await this.itemRequestService.getMyPendingRequests(this.userId).toPromise();
    this.GetMyItemRequests = <ItemRequestResponse[]><unknown>resGetAllItemRequests?.responseData;
    this.dataSource = new MatTableDataSource<ItemRequestResponse>(this.GetMyItemRequests); //for paginator
    this.dataSource.sort = this.sort;             //for search
    this.dataSource.paginator = this.paginator;   //for paginator
    debugger;
  }

  async getAllUsageLogs(requestId: number) {
    let resGetAllUsageLogs = await this.itemRequestService.getallUsageLogs(requestId).toPromise();
    this.myUsageLogs = <UsageLog[]><unknown>resGetAllUsageLogs?.responseData;
    debugger;
    const totalQuantity = this.myUsageLogs.reduce((sum, log) => sum + log.quantity, 0);
    // console.log(totalQuantity, this.selectedRequest.approvedQuantity);
    this.totalQuantityLogged = totalQuantity;
    if(this.selectedRequest.approvedQuantity === this.totalQuantityLogged){
      this.canLogUsage = true;
    }
  }

  //Search function
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  viewRequestSidebar(req: ItemRequestResponse): void {
    this.selectedRequest = req;
    this.requestId = req.id;
    this.sidebarOpen = true;
  }

  logUsageSidebar(req: ItemRequestResponse): void {
    this.selectedRequest = req;
    this.requestId = req.id;
    this.isLogUsageSidebarOpen = true;
  }

  viewLogSidebar(req: ItemRequestResponse): void {
    this.selectedRequest = req;
    this.selectedItem = req.itemName;
    this.requestId = req.id;
    this.selectedReference = req.reference;
    this.getAllUsageLogs(this.requestId);
    this.isViewLogSidebarOpen = true;
  }

  async onActionButtonClick(req: ItemRequestResponse): Promise<void> {
    this.selectedRequest = req;
    this.requestId = req.id;

    this.getAllUsageLogs(this.requestId);
  }

  closeSidebar(){
    this.sidebarOpen = false;
  }

  closeLogUsageSidebar(){
    this.cancel();
    this.isLogUsageSidebarOpen = false;
  }

  closeViewLogSidebar(){
    this.isViewLogSidebarOpen = false;
  }

  //I use this to get the values of the items form array
      get items(): FormArray {
        return this.logUsageForm.get('items') as FormArray;
      }
  
      addItem(): void {
        const logUsageGroup = this.fb.group({
          name: ['', Validators.required],
          phoneNumber: ['', [Validators.required, this.validationService.validatePhoneNumber()]],
          quantity: ['', [Validators.required, this.validationService.validateJustPositiveInteger()]],          
          address: ['', Validators.required],
          comment: ['', Validators.required]
        });
        this.items.push(logUsageGroup);
      }
    
      removeItem(index: number): void {
        this.items.removeAt(index);
      }
  
      clearForm() {
        this.items.clear();
        this.addItem();
      }

      clearItems() {
        const items = this.logUsageForm.get('items') as FormArray;
        while (items.length > 1) {
          items.removeAt(items.length - 1);
        }
      }

      cancel() {
        this.clearForm(); 
      }

      onKeydown(event: KeyboardEvent) {
        if (event.key === 'Enter') {
            event.preventDefault();
        }
    }

      onSubmit(): void {
      
          if (this.logUsageForm.invalid) {
            this.logUsageForm.markAllAsTouched();
            return; 
        }
      
        if (this.isSubmitting  == true)  {
          return; 
        }
      
        this.isSubmitting = true;

        const formValues = this.items.value; 

        let logUsageRequest: LogUsageRequest = {
          userId: this.userId,
          requestId: this.requestId,
          executionReportDetailVms: formValues
        }
        
            debugger;
            this.itemRequestService.logItemUsage(logUsageRequest).subscribe(
              {
                next: (data => {
                  this.isSubmitting = false;
                  if (data.responseCode == "00") {
                    this.toastr.success('Usage logged successfully');
                    setTimeout(() => {
                      window.location.reload();
                    }, 1000);
                  }
                  else {
                    this.isSubmitting = false;
                    this.toastr.error(data.message);
                    setTimeout(() => {
                      window.location.reload();
                  }, 2500);
                  }
                }),
                error: ((error: any) => {
                  console.log(error);
                  this.toastr.error(error.error.message);
                  this.isSubmitting = false;
                }),
                complete: () => {
                  this.isSubmitting = false; 
                  this.logUsageForm.reset();
                }
              }
            );
          
        }

}
