import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { SelectionModel } from '@angular/cdk/collections';
import { AdminService } from 'src/app/services/admin/admin.service';
import { TenantSubscription, SubscriptionStatus, SubscriptionPlan } from 'src/app/models/subscription';
import { isApiSuccess, getApiData } from 'src/app/models/api-response';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-subscriptions',
  templateUrl: './subscriptions.component.html',
  styleUrls: ['./subscriptions.component.scss']
})
export class SubscriptionsComponent implements OnInit {
  dataSource = new MatTableDataSource<TenantSubscription>([]);
  displayedColumns = ['select', 'tenant', 'plan', 'status', 'dates', 'usage', 'actions'];
  selection = new SelectionModel<TenantSubscription>(true, []);
  
  isLoading = true;
  totalCount = 0;
  pageSize = 20;
  currentPage = 0;
  
  statusFilter: string = 'all';
  expiringSubscriptions: TenantSubscription[] = [];
  expiredTrials: TenantSubscription[] = [];
  expiredSubscriptions: TenantSubscription[] = [];
  plans: SubscriptionPlan[] = [];
  
  isBatchProcessing = false;
  
  statusOptions = [
    { value: 'all', label: 'All Subscriptions' },
    { value: 'Active', label: 'Active' },
    { value: 'Trial', label: 'Trial' },
    { value: 'PendingActivation', label: 'Pending Activation' },
    { value: 'Expired', label: 'Expired' },
    { value: 'Suspended', label: 'Suspended' },
    { value: 'Cancelled', label: 'Cancelled' }
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private adminService: AdminService,
    private dialog: MatDialog,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.loadSubscriptions();
    this.loadExpiringSubscriptions();
    this.loadExpiredTrials();
    this.loadExpiredSubscriptions();
    this.loadPlans();
  }

  loadSubscriptions(): void {
    this.isLoading = true;
    this.selection.clear();
    
    const request$ = this.statusFilter === 'all'
      ? this.adminService.getAllSubscriptions()
      : this.adminService.getSubscriptionsByStatus(this.statusFilter);

    request$.subscribe({
      next: (response) => {
        const data = getApiData(response);
        if (isApiSuccess(response) && data) {
          this.dataSource.data = Array.isArray(data) ? data : [];
          this.totalCount = this.dataSource.data.length;
        }
        this.isLoading = false;
      },
      error: () => {
        this.toastr.error('Failed to load subscriptions', 'Error');
        this.isLoading = false;
      }
    });
  }

  loadExpiringSubscriptions(): void {
    this.adminService.getExpiringSubscriptions(7).subscribe({
      next: (response) => {
        const data = getApiData(response);
        if (isApiSuccess(response) && data) {
          this.expiringSubscriptions = Array.isArray(data) ? data : [];
        }
      }
    });
  }

  loadExpiredTrials(): void {
    this.adminService.getExpiredTrials().subscribe({
      next: (response) => {
        const data = getApiData(response);
        if (isApiSuccess(response) && data) {
          this.expiredTrials = Array.isArray(data) ? data : [];
        }
      }
    });
  }

  loadExpiredSubscriptions(): void {
    this.adminService.getExpiredSubscriptions().subscribe({
      next: (response) => {
        const data = getApiData(response);
        if (isApiSuccess(response) && data) {
          this.expiredSubscriptions = Array.isArray(data) ? data : [];
        }
      }
    });
  }

  loadPlans(): void {
    this.adminService.getPlans().subscribe({
      next: (response) => {
        const data = getApiData(response);
        if (isApiSuccess(response) && data) {
          this.plans = Array.isArray(data) ? data : [];
        }
      }
    });
  }

  // Selection methods
  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle(): void {
    if (this.isAllSelected()) {
      this.selection.clear();
    } else {
      this.dataSource.data.forEach(row => this.selection.select(row));
    }
  }

  // Batch operations
  batchSuspendSelected(): void {
    const selected = this.selection.selected;
    if (selected.length === 0) {
      this.toastr.warning('No subscriptions selected');
      return;
    }

    const reason = prompt(`Enter reason for suspending ${selected.length} subscription(s):`);
    if (reason === null) return; // Cancelled

    this.isBatchProcessing = true;
    const tenantIds = selected.map(s => s.tenantId);

    this.adminService.batchSuspendExpired(tenantIds, reason || 'Suspended by admin').subscribe({
      next: (response) => {
        const data = getApiData(response);
        if (isApiSuccess(response) && data) {
          this.toastr.success(`Suspended ${data.suspended} subscription(s)`);
          if (data.failed > 0) {
            this.toastr.warning(`Failed to suspend ${data.failed} subscription(s)`);
          }
          this.loadSubscriptions();
          this.loadExpiredTrials();
          this.loadExpiredSubscriptions();
        }
        this.isBatchProcessing = false;
      },
      error: () => {
        this.toastr.error('Batch suspension failed');
        this.isBatchProcessing = false;
      }
    });
  }

  suspendAllExpiredTrials(): void {
    if (this.expiredTrials.length === 0) {
      this.toastr.info('No expired trials to suspend');
      return;
    }

    if (!confirm(`Suspend all ${this.expiredTrials.length} expired free trial(s)? These users will be locked out.`)) {
      return;
    }

    this.isBatchProcessing = true;
    const tenantIds = this.expiredTrials.map(s => s.tenantId);

    this.adminService.batchSuspendExpired(tenantIds, 'Free trial period ended').subscribe({
      next: (response) => {
        const data = getApiData(response);
        if (isApiSuccess(response) && data) {
          this.toastr.success(`Suspended ${data.suspended} expired trial(s)`);
          this.loadSubscriptions();
          this.loadExpiredTrials();
        }
        this.isBatchProcessing = false;
      },
      error: () => {
        this.toastr.error('Failed to suspend expired trials');
        this.isBatchProcessing = false;
      }
    });
  }

  suspendAllExpiredSubscriptions(): void {
    if (this.expiredSubscriptions.length === 0) {
      this.toastr.info('No expired subscriptions to suspend');
      return;
    }

    if (!confirm(`Suspend all ${this.expiredSubscriptions.length} expired subscription(s)? These users will be locked out.`)) {
      return;
    }

    this.isBatchProcessing = true;
    const tenantIds = this.expiredSubscriptions.map(s => s.tenantId);

    this.adminService.batchSuspendExpired(tenantIds, 'Subscription period ended').subscribe({
      next: (response) => {
        const data = getApiData(response);
        if (isApiSuccess(response) && data) {
          this.toastr.success(`Suspended ${data.suspended} expired subscription(s)`);
          this.loadSubscriptions();
          this.loadExpiredSubscriptions();
        }
        this.isBatchProcessing = false;
      },
      error: () => {
        this.toastr.error('Failed to suspend expired subscriptions');
        this.isBatchProcessing = false;
      }
    });
  }

  onStatusFilterChange(status: string): void {
    this.statusFilter = status;
    this.currentPage = 0;
    this.loadSubscriptions();
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadSubscriptions();
  }

  activateSubscription(sub: TenantSubscription): void {
    this.adminService.activateSubscription(sub.tenantId).subscribe({
      next: (response) => {
        if (isApiSuccess(response)) {
          sub.status = SubscriptionStatus.Active;
          this.toastr.success(`Subscription for ${sub.tenantName} activated`, 'Success');
          this.loadSubscriptions();
        }
      },
      error: () => {
        this.toastr.error('Failed to activate subscription', 'Error');
      }
    });
  }

  suspendSubscription(sub: TenantSubscription): void {
    const reason = prompt('Enter reason for suspension (optional):');
    this.adminService.suspendSubscription(sub.tenantId, reason || undefined).subscribe({
      next: (response) => {
        if (isApiSuccess(response)) {
          sub.status = SubscriptionStatus.Suspended;
          this.toastr.success(`Subscription for ${sub.tenantName} suspended`, 'Success');
          this.loadSubscriptions();
          this.loadExpiredTrials();
          this.loadExpiredSubscriptions();
        }
      },
      error: () => {
        this.toastr.error('Failed to suspend subscription', 'Error');
      }
    });
  }

  endFreeTrial(sub: TenantSubscription): void {
    if (!confirm(`End free trial for ${sub.tenantName}? They will be locked out until they subscribe.`)) {
      return;
    }

    this.adminService.endFreeTrial(sub.tenantId).subscribe({
      next: (response) => {
        if (isApiSuccess(response)) {
          sub.status = SubscriptionStatus.Expired;
          this.toastr.success(`Free trial ended for ${sub.tenantName}`);
          this.loadSubscriptions();
          this.loadExpiredTrials();
        }
      },
      error: () => {
        this.toastr.error('Failed to end free trial');
      }
    });
  }

  extendTrial(sub: TenantSubscription): void {
    const daysStr = prompt('Enter number of days to extend trial:', '30');
    if (daysStr === null) return;
    const days = parseInt(daysStr, 10);
    if (isNaN(days) || days <= 0) {
      this.toastr.warning('Please enter a valid number of days');
      return;
    }

    this.adminService.extendTrial(sub.tenantId, days).subscribe({
      next: (response) => {
        if (isApiSuccess(response)) {
          this.toastr.success(`Trial extended by ${days} days for ${sub.tenantName}`);
          this.loadSubscriptions();
        }
      },
      error: () => {
        this.toastr.error('Failed to extend trial');
      }
    });
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'Active': return 'success';
      case 'Trial': return 'info';
      case 'PendingActivation': return 'pending';
      case 'Expired': return 'warning';
      case 'Suspended': return 'error';
      case 'Cancelled': return 'muted';
      default: return 'muted';
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'Active': return 'check_circle';
      case 'Trial': return 'hourglass_empty';
      case 'PendingActivation': return 'pending';
      case 'Expired': return 'schedule';
      case 'Suspended': return 'pause_circle';
      case 'Cancelled': return 'cancel';
      default: return 'help_outline';
    }
  }

  getPlanIcon(code: string): string {
    switch (code?.toUpperCase()) {
      case 'FREE': return 'star_border';
      case 'STA':
      case 'STARTER': return 'star_half';
      case 'PRO':
      case 'PROFESSIONAL': return 'star';
      case 'ENTERPRISE': return 'workspace_premium';
      default: return 'loyalty';
    }
  }

  formatDate(date: Date | string | undefined): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }

  formatPrice(price: number | undefined): string {
    if (!price || price === 0) return 'Free';
    return `₦${price.toLocaleString()}`;
  }

  formatLimit(limit: number | undefined): string {
    if (limit === undefined) return 'N/A';
    if (limit === -1) return 'Unlimited';
    return limit.toLocaleString();
  }

  getDaysRemaining(endDate: Date | string): number {
    const end = new Date(endDate);
    const now = new Date();
    const diff = end.getTime() - now.getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  }

  getDaysRemainingClass(days: number): string {
    if (days <= 3) return 'critical';
    if (days <= 7) return 'warning';
    if (days <= 14) return 'attention';
    return '';
  }

  getInitials(name: string | undefined): string {
    if (!name) return '?';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }
}
