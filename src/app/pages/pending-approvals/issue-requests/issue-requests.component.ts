import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ItemRequestService } from 'src/app/services/item-request/item-request.service';
import { ToastrService } from 'ngx-toastr';
import { ApproveRequestVm } from 'src/app/models/approveRequestVm';
import { TokenService } from 'src/app/services/token/token.service';
import { LoginResponseData } from 'src/app/models/login-response-data';
import { IssueRequestVm } from 'src/app/models/issue-requestVm';
import { ItemRequestResponse } from 'src/app/models/itemRequestResponse';
import { ValidationService } from 'src/app/services/shared/validation.service';

@Component({
  selector: 'app-issue-requests',
  templateUrl: './issue-requests.component.html',
  styleUrls: ['./issue-requests.component.scss']
})
export class IssueRequestsComponent implements OnInit {
  approveRequestForm: FormGroup;
  isSubmitting: boolean = false;
  userId: string = '';
  currentUser: any;
  isHos: Boolean = this.data.isHos;
  isStoreManager: Boolean = this.data.isStoreManager;
  isLineManager: Boolean = this.data.isLineManager;
  GetRequest!: ItemRequestResponse;
 

  constructor(
    private router: Router,
    private requestService: ItemRequestService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private tokenService: TokenService,
    public dialogRef: MatDialogRef<IssueRequestsComponent>,
    private validationService: ValidationService,
    
    @Inject(MAT_DIALOG_DATA) public data: { selectedRequestId: number, isHos: Boolean, isStoreManager: Boolean, isLineManager: Boolean }
  ) {
    this.approveRequestForm = this.fb.group({
      quantity: ['', [Validators.required, this.validationService.validateJustPositiveInteger()]], // Use an array for multiple validators

      comment: ['', Validators.required] 
    });

    this.dialogRef.disableClose = true;
  }

  ngOnInit() {
    this.getinfo();
    this.getRequestBy(this.data.selectedRequestId);

  }
 async getRequestBy(id: number) {
            debugger
            let resGetRequest = await this.requestService.getRequestBy(id).toPromise();
            this.GetRequest = <ItemRequestResponse><unknown>resGetRequest?.responseData;

            this.loadFormValues();
  }

  loadFormValues() { 
  debugger

    if (this.isHos || this.isStoreManager)
    {
      this.approveRequestForm.patchValue({
        quantity: this.GetRequest.approvedQuantity
      });
    } 
    if (this.isLineManager){
      this.approveRequestForm.patchValue({
        quantity: this.GetRequest.quantity
      });
    }
  }

  
  getinfo(){
    debugger
    
      const loginResponse: LoginResponseData = this.tokenService.getInfo();
      var datas = loginResponse.permission;

      this.currentUser = this.tokenService.getInfo(); 
      this.userId = this.currentUser.profile.id;
    }

  approveRequest() {

    if (this.approveRequestForm.invalid) {
      this.approveRequestForm.markAllAsTouched();
      return; // Exit the function if the form is invalid
    }

    if (this.isSubmitting  == true)  {
      return; 
    }
  
    this.isSubmitting = true;

    if (this.approveRequestForm.valid) {
      this.isSubmitting = true;

      const issueRequest: IssueRequestVm = {
        userid: this.userId,
        id: this.data.selectedRequestId, // Use the selectedRequestId directly
        comment: this.approveRequestForm.value.comment,
        issuedQuantity: this.approveRequestForm.value.quantity

      };

      this.requestService.issueRequests(issueRequest).subscribe({
        next: (data) => {
          debugger;
          this.isSubmitting = false; 
          if (data.responseCode === "00") {
            this.toastr.success('Approval successful');
            this.dialogRef.close(true); 
          } else {
            this.toastr.error(data.message);
          }
        },
        error: (error: any) => {
          console.log(error);
          this.isSubmitting = false; 
          this.toastr.error('Oops! Something went wrong. \nIt\'s not you, it\'s us. \nPlease try again');
        },
        complete: () => {
          this.isSubmitting = false; 
          this.approveRequestForm.reset();
        }
      });
    }
  }

  onCancelClick(): void {
    this.dialogRef.close(null);
  }
}