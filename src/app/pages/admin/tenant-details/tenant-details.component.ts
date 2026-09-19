import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from 'src/app/services/admin/admin.service';
import { TenantDetails } from 'src/app/models/admin';
import { isApiSuccess, getApiData } from 'src/app/models/api-response';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-tenant-details',
  templateUrl: './tenant-details.component.html',
  styleUrls: ['./tenant-details.component.scss']
})
export class TenantDetailsComponent implements OnInit {
  tenant: TenantDetails | null = null;
  isLoading = true;
  tenantId: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private adminService: AdminService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.tenantId = this.route.snapshot.paramMap.get('tenantId') || '';
    if (this.tenantId) {
      this.loadTenant();
    } else {
      this.router.navigate(['/home/admin/tenants']);
    }
  }

  loadTenant(): void {
    this.isLoading = true;
    this.adminService.getTenantById(this.tenantId).subscribe({
      next: (response) => {
        if (isApiSuccess(response)) {
          this.tenant = getApiData(response) || null;
        }
        if (!this.tenant) {
          this.toastr.error('Tenant not found');
          this.router.navigate(['/home/admin/tenants']);
        }
        this.isLoading = false;
      },
      error: () => {
        this.toastr.error('Failed to load tenant details');
        this.isLoading = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/home/admin/tenants']);
  }

  activateTenant(): void {
    if (!this.tenant) return;
    this.adminService.activateTenant(this.tenantId).subscribe({
      next: (response) => {
        if (isApiSuccess(response)) {
          this.toastr.success('Tenant activated successfully');
          this.loadTenant();
        } else {
          this.toastr.error(response.message || 'Failed to activate tenant');
        }
      },
      error: () => this.toastr.error('Failed to activate tenant')
    });
  }

  deactivateTenant(): void {
    if (!this.tenant) return;
    const reason = prompt('Enter reason for deactivation (optional):');
    this.adminService.deactivateTenant(this.tenantId, reason || undefined).subscribe({
      next: (response) => {
        if (isApiSuccess(response)) {
          this.toastr.success('Tenant deactivated successfully');
          this.loadTenant();
        } else {
          this.toastr.error(response.message || 'Failed to deactivate tenant');
        }
      },
      error: () => this.toastr.error('Failed to deactivate tenant')
    });
  }

  manageSubscription(): void {
    this.router.navigate(['/home/admin/subscriptions'], {
      queryParams: { tenantId: this.tenantId }
    });
  }

  getInitials(name: string): string {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  }

  formatDate(date: Date | string | undefined): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }

  getStatusColor(status: string | undefined): string {
    switch (status?.toLowerCase()) {
      case 'active': return 'success';
      case 'trial': return 'info';
      case 'expired': return 'warning';
      case 'cancelled':
      case 'suspended': return 'danger';
      default: return 'secondary';
    }
  }
}
