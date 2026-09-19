import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ShopUser, UserRole } from 'src/app/models/shop-user';
import { Shop } from 'src/app/models/shop';

@Component({
  selector: 'app-user-detail-dialog',
  templateUrl: './user-detail-dialog.component.html',
  styleUrls: ['./user-detail-dialog.component.scss']
})
export class UserDetailDialogComponent {

  user: ShopUser;
  shops: Shop[];

  constructor(
    private dialogRef: MatDialogRef<UserDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { user: ShopUser; shops: Shop[] }
  ) {
    this.user = data.user;
    this.shops = data.shops || [];
  }

  get initials(): string {
    return (this.user.firstName?.charAt(0) || '') + (this.user.lastName?.charAt(0) || '');
  }

  get fullName(): string {
    return `${this.user.firstName || ''} ${this.user.lastName || ''}`.trim();
  }

  getRoleLabel(role: string): string {
    const r = (role || '').toLowerCase();
    if (r === 'tenantowner') return 'Tenant Owner';
    if (r === 'shopmanager') return 'Shop Manager';
    if (r === 'cashier') return 'Cashier';
    if (r === 'stockkeeper') return 'Stock Keeper';
    if (r === 'superadmin') return 'Super Admin';
    if (r === 'viewer') return 'Viewer';
    return role || 'N/A';
  }

  getRoleBadgeClass(role: string): string {
    const r = (role || '').toLowerCase();
    if (r === 'tenantowner') return 'owner';
    if (r === 'shopmanager') return 'manager';
    if (r === 'cashier') return 'cashier';
    if (r === 'stockkeeper') return 'stockkeeper';
    return 'viewer';
  }

  getRoleIcon(role: string): string {
    const r = (role || '').toLowerCase();
    if (r === 'tenantowner') return 'business';
    if (r === 'shopmanager') return 'admin_panel_settings';
    if (r === 'cashier') return 'point_of_sale';
    if (r === 'stockkeeper') return 'inventory';
    if (r === 'superadmin') return 'shield';
    if (r === 'viewer') return 'visibility';
    return 'badge';
  }

  getUserShops(): Shop[] {
    const ids = this.user.shopIds || (this.user.shopId ? [this.user.shopId] : []);
    if (ids.length === 0) return [];
    return this.shops.filter(s => ids.some(id => +id === +s.id));
  }

  getUserShopNames(): string[] {
    if (this.user.shopNames && this.user.shopNames.length > 0) {
      return this.user.shopNames;
    }
    return this.getUserShops().map(s => s.name);
  }

  openEdit(): void {
    // Close with action flag — parent will open the edit dialog
    this.dialogRef.close({ action: 'edit', user: this.user });
  }

  close(): void {
    this.dialogRef.close();
  }
}
