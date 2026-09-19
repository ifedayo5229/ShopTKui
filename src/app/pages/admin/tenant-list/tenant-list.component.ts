import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { AdminService } from 'src/app/services/admin/admin.service';
import { TenantListItem, TenantDetails } from 'src/app/models/admin';
import { SubscriptionPlan } from 'src/app/models/subscription';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { isApiSuccess, getApiData } from 'src/app/models/api-response';

@Component({
  selector: 'app-tenant-list',
  templateUrl: './tenant-list.component.html',
  styleUrls: ['./tenant-list.component.scss']
})
export class TenantListComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns = ['tenant', 'subscription', 'usage', 'status', 'createdDate', 'actions'];
  dataSource = new MatTableDataSource<TenantListItem>([]);
  
  isLoading = true;
  totalCount = 0;
  pageSize = 20;
  currentPage = 0;
  
  searchQuery = '';
  statusFilter: 'all' | 'active' | 'inactive' = 'all';
  
  plans: SubscriptionPlan[] = [];
  
  private searchSubject = new Subject<string>();

  constructor(
    private adminService: AdminService,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private router: Router
  ) {
    this.searchSubject.pipe(debounceTime(400)).subscribe(() => {
      this.currentPage = 0;
      this.loadTenants();
    });
  }

  ngOnInit(): void {
    this.loadTenants();
    this.loadPlans();
  }

  loadTenants(): void {
    this.isLoading = true;
    this.adminService.getTenants(
      this.currentPage + 1,
      this.pageSize,
      this.searchQuery || undefined,
      this.statusFilter
    ).subscribe({
      next: (response) => {
        const data = getApiData(response);
        if (isApiSuccess(response) && data) {
          this.dataSource.data = data.items || [];
          this.totalCount = data.totalCount || 0;
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load tenants:', err);
        this.toastr.error('Failed to load tenants', 'Error');
        this.isLoading = false;
      }
    });
  }

  loadPlans(): void {
    this.adminService.getPlans().subscribe({
      next: (response) => {
        const data = getApiData(response);
        if (isApiSuccess(response) && data) {
          this.plans = data;
        }
      }
    });
  }

  onSearch(event: Event): void {
    this.searchQuery = (event.target as HTMLInputElement).value;
    this.searchSubject.next(this.searchQuery);
  }

  onStatusFilterChange(status: 'all' | 'active' | 'inactive'): void {
    this.statusFilter = status;
    this.currentPage = 0;
    this.loadTenants();
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadTenants();
  }

  toggleStatus(tenant: TenantListItem): void {
    const newStatus = !tenant.isActive;
    const action = newStatus ? 'activate' : 'deactivate';
    
    if (confirm(`Are you sure you want to ${action} ${tenant.name}?`)) {
      this.adminService.updateTenantStatus(tenant.tenantId, { 
        isActive: newStatus,
        reason: newStatus ? 'Activated by admin' : 'Deactivated by admin'
      }).subscribe({
        next: () => {
          tenant.isActive = newStatus;
          this.toastr.success(`Tenant ${action}d successfully`);
        },
        error: () => {
          this.toastr.error(`Failed to ${action} tenant`);
        }
      });
    }
  }

  viewDetails(tenant: TenantListItem): void {
    this.router.navigate(['/home/admin/tenants', tenant.tenantId]);
  }

  manageSubscription(tenant: TenantListItem): void {
    this.router.navigate(['/home/admin/subscriptions'], { 
      queryParams: { tenantId: tenant.tenantId } 
    });
  }

  activateSubscription(tenant: TenantListItem): void {
    this.adminService.activateSubscription(tenant.tenantId).subscribe({
      next: () => {
        tenant.subscriptionStatus = 'Active';
        this.toastr.success(`Subscription activated for ${tenant.name}`);
      },
      error: () => {
        this.toastr.error('Failed to activate subscription');
      }
    });
  }

  suspendSubscription(tenant: TenantListItem): void {
    const reason = prompt('Enter reason for suspension (optional):');
    this.adminService.suspendSubscription(tenant.tenantId, reason || undefined).subscribe({
      next: () => {
        tenant.subscriptionStatus = 'Suspended';
        this.toastr.success(`Subscription suspended for ${tenant.name}`);
      },
      error: () => {
        this.toastr.error('Failed to suspend subscription');
      }
    });
  }

  getInitials(name: string): string {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  }

  getStatusColor(status: string): string {
    switch (status?.toLowerCase()) {
      case 'active': return 'success';
      case 'trial': return 'info';
      case 'expired': return 'warning';
      case 'cancelled':
      case 'suspended': return 'danger';
      default: return 'secondary';
    }
  }

  formatDate(date: Date | string | undefined): string {
    if (!date) return 'Never';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }
}
