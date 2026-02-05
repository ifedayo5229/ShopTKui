import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ItemRequestService } from 'src/app/services/item-request/item-request.service';
import { ToastrService } from 'ngx-toastr';
import { ApproveRequestVm } from 'src/app/models/approveRequestVm';
import { TokenService } from 'src/app/services/token/token.service';
import { LoginResponseData } from 'src/app/models/login-response-data';
import { ItemRequestResponse } from 'src/app/models/itemRequestResponse';
import { ValidationService } from 'src/app/services/shared/validation.service';

@Component({
  selector: 'app-it-reject-dialog',
  templateUrl: './it-reject-dialog.component.html',
  styleUrls: ['./it-reject-dialog.component.scss']
})
export class ItRejectDialogComponent implements OnInit {
  approveRequestForm: FormGroup;
  isSubmitting: boolean = false;
  userId: string = ''
  currentUser: any;
  GetRequest!: ItemRequestResponse;
  isHos: Boolean = this.data.isHos;
  isStoreManager: Boolean = this.data.isStoreManager;
  isLineManager: Boolean = this.data.isLineManager;

  constructor(
    private router: Router,
    private requestService: ItemRequestService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private tokenService: TokenService,
    public dialogRef: MatDialogRef<ItRejectDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { selectedRequestId: number, isHos: Boolean, isStoreManager: Boolean, isLineManager: Boolean },
    private validationService: ValidationService,
    
  ) {
    this.approveRequestForm = this.fb.group({
      quantity: ['', [Validators.required, this.validationService.validateJustPositiveInteger()]], 
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
              let resGetRequest = await this.requestService.getITRequestBy(id).toPromise();
              this.GetRequest = <ItemRequestResponse><unknown>resGetRequest?.responseData;
  
              this.loadFormValues();
    }
  
    loadFormValues() {
      this.approveRequestForm.patchValue({
        quantity: this.GetRequest.quantity
      });
  }

  getinfo(){
    debugger
    
      const loginResponse: LoginResponseData = this.tokenService.getInfo();
      var datas = loginResponse.permission;

      this.currentUser = this.tokenService.getInfo(); 
      this.userId = this.currentUser.profile.id;
    }
 
  rejectRequest() { 

    if (this.approveRequestForm.invalid) {
      this.approveRequestForm.markAllAsTouched();
      return; // Exit the function if the form is invalid
    }
    
    if (this.isSubmitting  == true)  {
      return; 
    }

    if (this.approveRequestForm.valid) {
      this.isSubmitting = true;

      const approvalRequest: ApproveRequestVm = {
        userid: this.userId,
        id: this.data.selectedRequestId,
        comment: this.approveRequestForm.value.comment,
        approvedQuantity: this.approveRequestForm.value.quantity
      };

      this.requestService.rejectITRequest(approvalRequest).subscribe({
        next: (data) => {
          debugger;
          this.isSubmitting = false; 
          if (data.responseCode === "00") {
            this.toastr.success('Reject successful');
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