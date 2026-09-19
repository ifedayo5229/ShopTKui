import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TenantContextService } from 'src/app/services/tenant-context/tenant-context.service';
import { ShopService } from 'src/app/services/shop/shop.service';
import { ShopUserService } from 'src/app/services/shop-user/shop-user.service';
import { Shop, UpdateShopRequest } from 'src/app/models/shop';
import { ShopUser, UpdateShopUserRequest } from 'src/app/models/shop-user';
import { UserDialogComponent } from './user-dialog/user-dialog.component';
import { isApiSuccess, getApiData } from 'src/app/models/api-response';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  activeSection = 'shop';
  
  shopForm: FormGroup;
  accountForm: FormGroup;
  inventoryForm: FormGroup;

  currentShop: Shop | null = null;
  users: ShopUser[] = [];
  userColumns = ['user', 'role', 'status', 'actions'];
  
  isSaving = false;

  // Branding
  selectedBrandColor = '#0f7c5c';
  customBrandColor = '';
  brandColors = [
    { name: 'Shop Green', value: '#0f7c5c' },
    { name: 'Inventory Blue', value: '#3b82f6' },
    { name: 'Stock Green', value: '#22c55e' },
    { name: 'Checkout Teal', value: '#14b8a6' },
    { name: 'Attention Amber', value: '#f6b343' },
    { name: 'Alert Red', value: '#ef4444' },
    { name: 'Promo Pink', value: '#ec4899' }
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private tenantContext: TenantContextService,
    private shopService: ShopService,
    private shopUserService: ShopUserService
  ) {
    this.shopForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      phone: [''],
      email: ['', Validators.email],
      address: ['']
    });

    this.accountForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['']
    });

    this.inventoryForm = this.fb.group({
      lowStockThreshold: [10],
      emailAlerts: [true],
      pushNotifications: [true]
    });
  }

  ngOnInit(): void {
    this.loadShopDetails();
    this.loadUsers();
    this.loadAccountDetails();
  }

  loadShopDetails(): void {
    const shopId = this.tenantContext.currentShop?.id;
    if (shopId) {
      this.shopService.getById(shopId).subscribe({
        next: (response) => {
          const data = getApiData(response);
          if (isApiSuccess(response) && data) {
            this.currentShop = data;
            this.shopForm.patchValue({
              name: data.name,
              description: data.description,
              phoneNumber: data.phoneNumber,
              address: data.address
            });
            this.inventoryForm.patchValue({});
          }
        }
      });
    }
  }

  loadUsers(): void {
    const shopId = this.tenantContext.currentShop?.id;
    if (shopId) {
      this.shopUserService.getByShop(shopId).subscribe({
        next: (response) => {
          const data = getApiData(response);
          if (isApiSuccess(response) && data) {
            this.users = data;
          }
        }
      });
    }
  }

  loadAccountDetails(): void {
    const user = this.tenantContext.currentUser;
    if (user) {
      this.accountForm.patchValue({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phoneNumber: user.phoneNumber
      });
    }
  }

  saveShopDetails(): void {
    if (!this.shopForm.valid) return;

    this.isSaving = true;
    const shopId = this.tenantContext.currentShop?.id;

    const request: UpdateShopRequest = {
      id: shopId!,
      ...this.shopForm.value
    };

    this.shopService.update(request).subscribe({
      next: (response) => {
        this.isSaving = false;
        if (isApiSuccess(response)) {
          this.toastr.success('Shop details updated', 'Success');
          this.shopForm.markAsPristine();
        } else {
          this.toastr.error(response.message || 'Failed to update', 'Error');
        }
      },
      error: () => {
        this.isSaving = false;
        this.toastr.error('Failed to update shop details', 'Error');
      }
    });
  }

  saveInventorySettings(): void {
    if (!this.inventoryForm.valid) return;

    this.isSaving = true;
    const shopId = this.tenantContext.currentShop?.id;

    const request: UpdateShopRequest = {
      id: shopId!
    };

    this.shopService.update(request).subscribe({
      next: (response) => {
        this.isSaving = false;
        if (isApiSuccess(response)) {
          this.toastr.success('Inventory settings saved', 'Success');
        }
      },
      error: () => {
        this.isSaving = false;
        this.toastr.error('Failed to save settings', 'Error');
      }
    });
  }

  saveAccountDetails(): void {
    if (!this.accountForm.valid) return;

    this.isSaving = true;
    const userId = this.tenantContext.currentUser?.id;

    const request: UpdateShopUserRequest = {
      id: userId!,
      firstName: this.accountForm.value.firstName,
      lastName: this.accountForm.value.lastName,
      phoneNumber: this.accountForm.value.phone
    };

    this.shopUserService.update(request).subscribe({
      next: (response) => {
        this.isSaving = false;
        const data = getApiData(response);
        if (isApiSuccess(response) && data) {
          this.tenantContext.updateUser(data);
          this.toastr.success('Account updated', 'Success');
          this.accountForm.markAsPristine();
        }
      },
      error: () => {
        this.isSaving = false;
        this.toastr.error('Failed to update account', 'Error');
      }
    });
  }

  // Branding
  onLogoSelected(event: any): void {
    const file = event.target.files[0];
    if (!file) return;

    const shopId = this.tenantContext.currentShop?.id;
    if (!shopId) return;

    this.shopService.uploadLogo(shopId, file).subscribe({
      next: (response) => {
        if (isApiSuccess(response)) {
          this.toastr.success('Logo uploaded', 'Success');
          this.loadShopDetails();
        }
      },
      error: () => {
        this.toastr.error('Failed to upload logo', 'Error');
      }
    });
  }

  removeLogo(): void {
    // Implement logo removal
    this.toastr.info('Logo removal not implemented', 'Info');
  }

  selectBrandColor(color: string): void {
    this.selectedBrandColor = color;
  }

  saveBranding(): void {
    // Save branding settings
    this.toastr.success('Branding saved', 'Success');
  }

  // Users
  openAddUserDialog(): void {
    const dialogRef = this.dialog.open(UserDialogComponent, {
      width: '500px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadUsers();
        this.toastr.success('User added successfully', 'Success');
      }
    });
  }

  editUser(user: ShopUser): void {
    // Open edit dialog
    this.toastr.info('Edit user not implemented', 'Info');
  }

  toggleUserLock(user: ShopUser): void {
    const action = user.isLocked 
      ? this.shopUserService.unlock(user.id)
      : this.shopUserService.lock(user.id);

    action.subscribe({
      next: (response) => {
        if (isApiSuccess(response)) {
          this.toastr.success(`User ${user.isLocked ? 'unlocked' : 'locked'}`, 'Success');
          this.loadUsers();
        }
      }
    });
  }

  deleteUser(user: ShopUser): void {
    if (confirm(`Are you sure you want to delete ${user.firstName} ${user.lastName}?`)) {
      this.shopUserService.delete(user.id).subscribe({
        next: (response) => {
          if (isApiSuccess(response)) {
            this.toastr.success('User deleted', 'Success');
            this.loadUsers();
          }
        }
      });
    }
  }

  // Account
  openChangePasswordDialog(): void {
    this.toastr.info('Change password feature coming soon', 'Info');
  }

  logout(): void {
    this.tenantContext.clearContext();
    this.router.navigate(['/login']);
    this.toastr.success('You have been logged out', 'Goodbye');
  }
}
