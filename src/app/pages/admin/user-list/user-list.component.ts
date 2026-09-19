import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { AdminService } from 'src/app/services/admin/admin.service';
import { AdminUserListItem, TenantListItem } from 'src/app/models/admin';
import { ToastrService } from 'ngx-toastr';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { isApiSuccess, getApiData } from 'src/app/models/api-response';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  dataSource = new MatTableDataSource<AdminUserListItem>([]);
  displayedColumns = ['user', 'tenant', 'shop', 'role', 'status', 'lastLogin', 'actions'];
  
  isLoading = true;
  totalCount = 0;
  pageSize = 20;
  currentPage = 0;
  
  searchQuery = '';
  roleFilter = '';
  statusFilter: 'all' | 'active' | 'inactive' = 'all';
  
  roles = ['Admin', 'Manager', 'Cashier', 'Staff'];
  
  private searchSubject = new Subject<string>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private adminService: AdminService,
    private toastr: ToastrService
  ) {
    this.searchSubject.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe(query => {
      this.searchQuery = query;
      this.currentPage = 0;
      this.loadUsers();
    });
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;
    
    this.adminService.getUsers(
      this.currentPage + 1,
      this.pageSize,
      undefined,
      undefined,
      this.roleFilter || undefined
    ).subscribe({
      next: (response) => {
        const data = getApiData(response);
        if (isApiSuccess(response) && data) {
          let users = data.items || [];
          
          // Client-side filtering for status (if API doesn't support it)
          if (this.statusFilter === 'active') {
            users = users.filter(u => u.isActive);
          } else if (this.statusFilter === 'inactive') {
            users = users.filter(u => !u.isActive);
          }
          
          // Client-side search filtering
          if (this.searchQuery) {
            const query = this.searchQuery.toLowerCase();
            users = users.filter(u => 
              u.fullName?.toLowerCase().includes(query) ||
              u.email?.toLowerCase().includes(query) ||
              u.tenantName?.toLowerCase().includes(query)
            );
          }
          
          this.dataSource.data = users;
          this.totalCount = data.totalCount || 0;
        }
        this.isLoading = false;
      },
      error: () => {
        this.toastr.error('Failed to load users', 'Error');
        this.isLoading = false;
      }
    });
  }

  onSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchSubject.next(value);
  }

  onRoleFilterChange(role: string): void {
    this.roleFilter = role;
    this.currentPage = 0;
    this.loadUsers();
  }

  onStatusFilterChange(status: 'all' | 'active' | 'inactive'): void {
    this.statusFilter = status;
    this.currentPage = 0;
    this.loadUsers();
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadUsers();
  }

  toggleUserStatus(user: AdminUserListItem): void {
    const newStatus = !user.isActive;
    const reason = newStatus ? undefined : prompt('Enter reason for deactivation (optional):');
    
    this.adminService.updateUserStatus(user.id, { 
      isActive: newStatus, 
      reason: reason || undefined 
    }).subscribe({
      next: () => {
        user.isActive = newStatus;
        this.toastr.success(`User ${newStatus ? 'activated' : 'deactivated'}`, 'Success');
      },
      error: () => {
        this.toastr.error('Failed to update user status', 'Error');
      }
    });
  }

  getInitials(name: string): string {
    if (!name) return '?';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  getRoleColor(role: string): string {
    switch (role?.toLowerCase()) {
      case 'admin': return 'admin';
      case 'manager': return 'manager';
      case 'cashier': return 'cashier';
      case 'staff': return 'staff';
      default: return 'default';
    }
  }

  getRoleIcon(role: string): string {
    switch (role?.toLowerCase()) {
      case 'admin': return 'admin_panel_settings';
      case 'manager': return 'manage_accounts';
      case 'cashier': return 'point_of_sale';
      case 'staff': return 'person';
      default: return 'person_outline';
    }
  }

  formatDate(date: Date | string | undefined): string {
    if (!date) return 'Never';
    const d = new Date(date);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: d.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  }
}
