import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AdminService } from 'src/app/services/admin/admin.service';
import { SubscriptionPlan, CreatePlanRequest } from 'src/app/models/subscription';
import { isApiSuccess, getApiData } from 'src/app/models/api-response';
import { ToastrService } from 'ngx-toastr';
import { PlanDialogComponent } from './plan-dialog/plan-dialog.component';

@Component({
  selector: 'app-subscription-plans',
  templateUrl: './subscription-plans.component.html',
  styleUrls: ['./subscription-plans.component.scss']
})
export class SubscriptionPlansComponent implements OnInit {
  plans: SubscriptionPlan[] = [];
  isLoading = true;

  constructor(
    private adminService: AdminService,
    private dialog: MatDialog,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.loadPlans();
  }

  loadPlans(): void {
    this.isLoading = true;
    this.adminService.getPlans().subscribe({
      next: (response) => {
        const data = getApiData(response);
        if (isApiSuccess(response) && data) {
          this.plans = (Array.isArray(data) ? data : []).sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
        }
        this.isLoading = false;
      },
      error: () => {
        this.toastr.error('Failed to load plans', 'Error');
        this.isLoading = false;
      }
    });
  }

  togglePlanStatus(plan: SubscriptionPlan): void {
    const newStatus = !plan.isActive;
    this.adminService.updatePlan({ id: plan.id, isActive: newStatus }).subscribe({
      next: () => {
        plan.isActive = newStatus;
        this.toastr.success(`Plan ${newStatus ? 'activated' : 'deactivated'}`);
      },
      error: () => {
        this.toastr.error('Failed to update plan status');
      }
    });
  }

  formatPrice(plan: SubscriptionPlan): string {
    if (plan.price === 0) return 'Free';
    return `₦${plan.price.toFixed(2)}/${plan.billingCycle === 'Monthly' ? 'mo' : plan.billingCycle === 'Yearly' ? 'yr' : 'qtr'}`;
  }

  formatLimit(limit: number): string {
    if (limit === -1) return 'Unlimited';
    return limit.toLocaleString();
  }

  getPlanIcon(code: string): string {
    switch (code?.toUpperCase()) {
      case 'FREE': return 'star_border';
      case 'STARTER': return 'star_half';
      case 'PRO':
      case 'PROFESSIONAL': return 'star';
      case 'ENTERPRISE': return 'workspace_premium';
      default: return 'loyalty';
    }
  }

  getPlanColor(code: string): string {
      switch (code?.toUpperCase()) {
        case 'FREE': return 'gray';
        case 'STARTER': return 'cyan';
        case 'PRO':
        case 'PROFESSIONAL': return 'professional';
        case 'ENTERPRISE': return 'gold';
        default: return 'gray';
      }
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(PlanDialogComponent, {
      width: '600px',
      panelClass: 'custom-dialog',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.action === 'create') {
        this.adminService.createPlan(result.data).subscribe({
          next: (response) => {
            if (isApiSuccess(response)) {
              this.toastr.success('Plan created successfully');
              this.loadPlans();
            } else {
              this.toastr.error(response.message || 'Failed to create plan');
            }
          },
          error: (err) => {
            this.toastr.error(err.error?.message || 'Failed to create plan');
          }
        });
      }
    });
  }

  openEditDialog(plan: SubscriptionPlan): void {
    const dialogRef = this.dialog.open(PlanDialogComponent, {
      width: '600px',
      panelClass: 'custom-dialog',
      data: { plan }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.action === 'update') {
        this.adminService.updatePlan(result.data).subscribe({
          next: (response) => {
            if (isApiSuccess(response)) {
              this.toastr.success('Plan updated successfully');
              this.loadPlans();
            } else {
              this.toastr.error(response.message || 'Failed to update plan');
            }
          },
          error: (err) => {
            this.toastr.error(err.error?.message || 'Failed to update plan');
          }
        });
      }
    });
  }

  deletePlan(plan: SubscriptionPlan): void {
    if (!confirm(`Are you sure you want to delete the "${plan.name}" plan?`)) return;

    this.adminService.deletePlan(plan.id).subscribe({
      next: (response) => {
        if (isApiSuccess(response)) {
          this.toastr.success('Plan deleted');
          this.loadPlans();
        } else {
          this.toastr.error(response.message || 'Failed to delete plan');
        }
      },
      error: (err) => {
        this.toastr.error(err.error?.message || 'Failed to delete plan');
      }
    });
  }
}
