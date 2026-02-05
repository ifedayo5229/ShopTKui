import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ItemRequestService } from 'src/app/services/item-request/item-request.service';
import { ToastrService } from 'ngx-toastr';
import { ApproveRequestVm } from 'src/app/models/approveRequestVm';
import { TokenService } from 'src/app/services/token/token.service';
import { LoginResponseData } from 'src/app/models/login-response-data';
import { InventoryMovementService } from 'src/app/services/inventoryMovement/inventory-movement.service';
import { ValidationService } from 'src/app/services/shared/validation.service';
import { ItemRequestResponse } from 'src/app/models/itemRequestResponse';
import { IssueRequestVm } from 'src/app/models/issue-requestVm';

@Component({
  selector: 'app-receive-disbursed-item-dialog',
  templateUrl: './receive-disbursed-item-dialog.component.html',
  styleUrls: ['./receive-disbursed-item-dialog.component.scss']
})
export class ReceiveDisbursedItemDialogComponent implements OnInit {
  receiveItemForm: FormGroup;
  isSubmitting: boolean = false;
  userId: string = '';
  currentUser: any;
  GetRequest!: ItemRequestResponse;

  constructor(
    private inventoryMovementservice :InventoryMovementService,
    private router: Router,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private tokenService: TokenService,
    public dialogRef: MatDialogRef<ReceiveDisbursedItemDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { selectedRequestId: number },
    private validationService: ValidationService,
    private requestService: ItemRequestService
  ) {
    this.receiveItemForm = this.fb.group({
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

}

  getinfo(){
    debugger
    
      const loginResponse: LoginResponseData = this.tokenService.getInfo();
      var datas = loginResponse.permission;

      this.currentUser = this.tokenService.getInfo(); 
      this.userId = this.currentUser.profile.id;
    }

    receiveItem() {
    debugger;

    if (this.receiveItemForm.invalid) {
      this.receiveItemForm.markAllAsTouched();
      return; // Exit the function if the form is invalid
    }

    if (this.isSubmitting  == true)  {
      return; 
    }
  
    this.isSubmitting = true;

    if (this.receiveItemForm.valid) {
      this.isSubmitting = true;

      const receiveItemRequest: IssueRequestVm = {
        userid: this.userId,
        id: this.data.selectedRequestId, // Use the selectedRequestId directly
        comment: this.receiveItemForm.value.comment,
        issuedQuantity:this.receiveItemForm.value.quantity

      };

      console.log(receiveItemRequest);

      this.inventoryMovementservice.RecieveItem(receiveItemRequest).subscribe({
        next: (data) => {
          debugger;
          this.isSubmitting = false; 
          if (data.responseCode === "00") {
            this.toastr.success('Received successfully');
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
          this.receiveItemForm.reset();
        }
      });
    }
  }

  onCancelClick(): void {
    this.dialogRef.close(null);
  }
}