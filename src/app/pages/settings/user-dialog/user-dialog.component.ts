import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ShopUserService } from 'src/app/services/shop-user/shop-user.service';
import { TenantContextService } from 'src/app/services/tenant-context/tenant-context.service';
import { RolesService } from 'src/app/services/roles/roles.service';
import { ShopUser, UserRole, CreateShopUserRequest, UpdateShopUserRequest } from 'src/app/models/shop-user';
import { RoleDto } from 'src/app/models/RoleDto';
import { Shop } from 'src/app/models/shop';
import { ShopService } from 'src/app/services/shop/shop.service';
import { isApiSuccess, getApiData } from 'src/app/models/api-response';

@Component({
  selector: 'app-user-dialog',
  templateUrl: './user-dialog.component.html',
  styleUrls: ['./user-dialog.component.scss']
})
export class UserDialogComponent implements OnInit {
  userForm: FormGroup;
  isEdit = false;
  isSaving = false;
  showPassword = false;
  shops: Shop[] = [];
  roles: RoleDto[] = [];
  isLoadingRoles = false;

  /** Map role names to Material icons */
  private roleIcons: Record<string, string> = {
    shopmanager: 'admin_panel_settings',
    manager: 'admin_panel_settings',
    cashier: 'point_of_sale',
    stockkeeper: 'inventory',
    viewer: 'visibility',
    tenantowner: 'business',
    superadmin: 'shield'
  };

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<UserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { user?: ShopUser },
    private shopUserService: ShopUserService,
    private shopService: ShopService,
    private rolesService: RolesService,
    private tenantContext: TenantContextService,
    private toastr: ToastrService
  ) {
    this.isEdit = !!data?.user;

    this.userForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: [''],
      password: ['', this.isEdit ? [] : [Validators.required, Validators.minLength(6)]],
      role: ['', Validators.required],
      shopIds: [[] as (number | string)[], Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadShops();
    this.loadRoles();
    if (this.isEdit && this.data.user) {
      this.populateForm(this.data.user);
    }
  }

  loadRoles(): void {
    this.isLoadingRoles = true;
    const isSuperAdmin = this.tenantContext.isSuperAdmin();
    this.rolesService.getRoles().subscribe({
      next: (roles) => {
        this.isLoadingRoles = false;
        this.roles = (roles || []).filter(r => {
          if (r.disabled) return false;
          // Only SuperAdmin can see/assign the SuperAdmin role
          if (!isSuperAdmin && r.roleName?.toLowerCase() === 'superadmin') return false;
          return true;
        });
      },
      error: () => {
        this.isLoadingRoles = false;
        this.toastr.error('Failed to load roles', 'Error');
      }
    });
  }

  loadShops(): void {
    this.shopService.getAll().subscribe({
      next: (response) => {
        const data = getApiData(response);
        if (isApiSuccess(response) && data) {
          this.shops = data;
          // If creating and only one shop, pre-select it
          if (!this.isEdit && this.shops.length === 1) {
            this.userForm.patchValue({ shopIds: [this.shops[0].id] });
          }
        }
      }
    });
  }

  populateForm(user: ShopUser): void {
    // Coerce shopIds to numbers to match shop.id type
    const rawShopIds = user.shopIds || (user.shopId ? [user.shopId] : []);
    const shopIds = rawShopIds.map(id => typeof id === 'string' ? parseInt(id, 10) : id);

    this.userForm.patchValue({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,  // Use raw role string from backend
      shopIds: shopIds
    });
  }

  getRoleLabel(roleValue: string): string {
    const role = this.roles.find(r => r.roleName?.toLowerCase() === roleValue?.toLowerCase());
    return role ? role.roleName : roleValue;
  }

  getRoleIcon(roleName: string): string {
    if (!roleName) return 'badge';
    const key = roleName.toLowerCase().replace(/[\s_-]/g, '');
    return this.roleIcons[key] || 'badge';
  }

  getSelectedShopNames(): string {
    const selectedIds: (number | string)[] = this.userForm.get('shopIds')?.value || [];
    if (selectedIds.length === 0) return '';
    const names = this.shops
      .filter(s => selectedIds.some(id => +id === +s.id))
      .map(s => s.name);
    return names.join(', ');
  }

  getPermissions(role: string): string[] {
    if (!role) return [];
    const lower = role.toLowerCase();
    switch (lower) {
      case 'shopmanager':
        return [
          'View and manage all products',
          'Process sales and returns',
          'Manage inventory levels',
          'View all reports',
          'Manage shop users'
        ];
      case 'cashier':
        return [
          'Process sales',
          'View product inventory',
          'Issue receipts',
          'View daily sales reports'
        ];
      case 'stockkeeper':
        return [
          'Manage inventory levels',
          'Add and remove stock',
          'View low stock alerts',
          'View inventory reports'
        ];
      default:
        // Show role description from backend if available
        const roleDto = this.roles.find(r => r.roleName?.toLowerCase() === lower);
        return roleDto?.roleDescription ? [roleDto.roleDescription] : [];
    }
  }

  save(): void {
    if (!this.userForm.valid) return;

    this.isSaving = true;
    const values = this.userForm.value;

    if (this.isEdit && this.data.user) {
      const request: UpdateShopUserRequest = {
        id: this.data.user.id,
        shopIds: values.shopIds,
        firstName: values.firstName,
        lastName: values.lastName,
        phoneNumber: values.phoneNumber,
        role: values.role
      };

      this.shopUserService.update(request).subscribe({
        next: (response) => {
          this.isSaving = false;
          if (isApiSuccess(response)) {
            this.toastr.success('User updated successfully', 'Success');
            this.dialogRef.close(getApiData(response));
          } else {
            this.toastr.error(response.message || 'Failed to update user', 'Error');
          }
        },
        error: (err) => {
          this.isSaving = false;
          this.toastr.error(err?.error?.message || 'Failed to update user', 'Error');
        }
      });
    } else {
      const request: CreateShopUserRequest = {
        shopIds: values.shopIds,
        email: values.email,
        password: values.password,
        firstName: values.firstName,
        lastName: values.lastName,
        phoneNumber: values.phoneNumber,
        role: values.role
      };

      this.shopUserService.create(request).subscribe({
        next: (response) => {
          this.isSaving = false;
          if (isApiSuccess(response)) {
            this.toastr.success('User added successfully', 'Success');
            this.dialogRef.close(getApiData(response));
          } else {
            this.toastr.error(response.message || 'Failed to add user', 'Error');
          }
        },
        error: (err) => {
          this.isSaving = false;
          this.toastr.error(err?.error?.message || 'Failed to add user', 'Error');
        }
      });
    }
  }

  close(): void {
    this.dialogRef.close();
  }
}
