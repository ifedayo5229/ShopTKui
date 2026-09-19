import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/services/admin/admin.service';
import { AdminDashboardStats, TenantListItem } from 'src/app/models/admin';
import { ToastrService } from 'ngx-toastr';
import { isApiSuccess, getApiData } from 'src/app/models/api-response';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  stats: AdminDashboardStats | null = null;
  isLoading = true;

  constructor(
    private adminService: AdminService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.isLoading = true;
    this.adminService.getDashboardStats().subscribe({
      next: (response) => {
        const data = getApiData(response);
        if (isApiSuccess(response) && data) {
          this.stats = data;
        }
        this.isLoading = false;
      },
      error: (error) => {
        this.toastr.error('Failed to load dashboard stats', 'Error');
        this.isLoading = false;
      }
    });
  }

  getPercentage(count: number, total: number): number {
    if (total === 0) return 0;
    return Math.round((count / total) * 100);
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
  }
}
