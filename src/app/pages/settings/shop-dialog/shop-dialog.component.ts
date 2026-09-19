import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ShopService } from 'src/app/services/shop/shop.service';
import { Shop, CreateShopRequest, UpdateShopRequest } from 'src/app/models/shop';
import { isApiSuccess, getApiData } from 'src/app/models/api-response';

@Component({
  selector: 'app-shop-dialog',
  templateUrl: './shop-dialog.component.html',
  styleUrls: ['./shop-dialog.component.scss']
})
export class ShopDialogComponent implements OnInit {
  shopForm: FormGroup;
  isSubmitting = false;
  mode: 'create' | 'edit' = 'create';

  constructor(
    private fb: FormBuilder,
    private shopService: ShopService,
    private toastr: ToastrService,
    private dialogRef: MatDialogRef<ShopDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { mode: 'create' | 'edit'; shop?: Shop }
  ) {
    this.mode = data.mode || 'create';

    this.shopForm = this.fb.group({
      name: ['', Validators.required],
      phoneNumber: [''],
      address: [''],
      city: [''],
      state: [''],
      description: [''],
      isMainBranch: [false]
    });
  }

  ngOnInit(): void {
    if (this.mode === 'edit' && this.data.shop) {
      this.shopForm.patchValue({
        name: this.data.shop.name,
        phoneNumber: this.data.shop.phoneNumber || '',
        address: this.data.shop.address || '',
        city: this.data.shop.city || '',
        state: this.data.shop.state || '',
        description: this.data.shop.description || '',
        isMainBranch: this.data.shop.isMainBranch || false
      });
    }
  }

  get title(): string {
    return this.mode === 'create' ? 'Add New Shop' : 'Edit Shop';
  }

  onSubmit(): void {
    if (!this.shopForm.valid) return;

    this.isSubmitting = true;

    if (this.mode === 'create') {
      const request: CreateShopRequest = {
        name: this.shopForm.value.name,
        phoneNumber: this.shopForm.value.phoneNumber || undefined,
        address: this.shopForm.value.address || undefined,
        city: this.shopForm.value.city || undefined,
        state: this.shopForm.value.state || undefined,
        description: this.shopForm.value.description || undefined,
        isMainBranch: this.shopForm.value.isMainBranch || false
      };

      this.shopService.create(request).subscribe({
        next: (response) => {
          this.isSubmitting = false;
          if (isApiSuccess(response)) {
            this.toastr.success('Shop created successfully', 'Success');
            this.dialogRef.close(getApiData(response));
          } else {
            this.toastr.error(response.message || 'Failed to create shop', 'Error');
          }
        },
        error: (err) => {
          this.isSubmitting = false;
          this.toastr.error(err?.error?.message || 'Failed to create shop', 'Error');
        }
      });
    } else {
      const request: UpdateShopRequest = {
        id: this.data.shop!.id,
        name: this.shopForm.value.name,
        phoneNumber: this.shopForm.value.phoneNumber || undefined,
        address: this.shopForm.value.address || undefined,
        city: this.shopForm.value.city || undefined,
        state: this.shopForm.value.state || undefined,
        description: this.shopForm.value.description || undefined,
        isMainBranch: this.shopForm.value.isMainBranch
      };

      this.shopService.update(request).subscribe({
        next: (response) => {
          this.isSubmitting = false;
          if (isApiSuccess(response)) {
            this.toastr.success('Shop updated successfully', 'Success');
            this.dialogRef.close(getApiData(response));
          } else {
            this.toastr.error(response.message || 'Failed to update shop', 'Error');
          }
        },
        error: (err) => {
          this.isSubmitting = false;
          this.toastr.error(err?.error?.message || 'Failed to update shop', 'Error');
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
