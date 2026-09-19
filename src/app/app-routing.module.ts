import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Layout
import { LayoutComponent } from './layout/layout-full/layout.component';

// Landing Page
import { LandingComponent } from './landing/landing.component';

// Authentication
import { LoginComponent } from './authentication/login/login.component';
import { RegisterComponent } from './authentication/register/register.component';
import { ForgotPasswordComponent } from './authentication/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './authentication/reset-password/reset-password.component';

// Guards
import { AuthGuard } from './interceptors/auth.guard';

// Dashboard
import { DashboardComponent } from './dashboard/dashboard.component';

// Shop Management
import { InventoryListComponent } from './pages/shop-inventory/inventory-list/inventory-list.component';
import { PosComponent } from './pages/sales/pos/pos.component';
import { SalesListComponent } from './pages/sales/sales-list/sales-list.component';
import { ShopSettingsComponent } from './pages/settings/shop-settings/shop-settings.component';

// Reports
import { ReportsComponent } from './pages/reports/reports.component';

// Admin
import { AdminDashboardComponent } from './pages/admin/admin-dashboard/admin-dashboard.component';
import { TenantListComponent } from './pages/admin/tenant-list/tenant-list.component';
import { TenantDetailsComponent } from './pages/admin/tenant-details/tenant-details.component';
import { SubscriptionPlansComponent } from './pages/admin/subscription-plans/subscription-plans.component';
import { SubscriptionsComponent } from './pages/admin/subscriptions/subscriptions.component';
import { UserListComponent } from './pages/admin/user-list/user-list.component';

// Subscription/Upgrade
import { UpgradeComponent } from './pages/subscription/upgrade.component';
import { PaymentSuccessComponent } from './pages/subscription/payment-success.component';
import { PaymentCallbackComponent } from './pages/subscription/payment-callback.component';
import { OPayCheckoutComponent } from './pages/subscription/opay-checkout.component';

const routes: Routes = [
  // Landing page (default)
  { path: '', component: LandingComponent },

  // Auth routes
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'forgotPassword', redirectTo: 'forgot-password', pathMatch: 'full' },
  { path: 'reset-password', component: ResetPasswordComponent },

  // Protected routes
  {
    path: 'home',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'inventory', component: InventoryListComponent },
      { path: 'pos', component: PosComponent },
      { path: 'sales', component: SalesListComponent },
      { path: 'reports', component: ReportsComponent },
      { path: 'settings', component: ShopSettingsComponent },
      // Admin routes
      { path: 'admin', component: AdminDashboardComponent },
      { path: 'admin/tenants', component: TenantListComponent },
      { path: 'admin/tenants/:tenantId', component: TenantDetailsComponent },
      { path: 'admin/plans', component: SubscriptionPlansComponent },
      { path: 'admin/subscriptions', component: SubscriptionsComponent },
      { path: 'admin/users', component: UserListComponent },
      // Subscription/Upgrade routes
      { path: 'subscription/upgrade', component: UpgradeComponent },
      { path: 'subscription/success', component: PaymentSuccessComponent },
      { path: 'subscription/payment-callback', component: PaymentCallbackComponent },
      { path: 'subscription/opay-checkout', component: OPayCheckoutComponent },
    ]
  },

  // Fallback
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
