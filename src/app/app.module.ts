import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

// Angular Material
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatSortModule } from '@angular/material/sort';
import { MatChipsModule } from '@angular/material/chips';
import { MatExpansionModule } from '@angular/material/expansion';

// Third-party
import { ToastrModule } from 'ngx-toastr';

// Routing
import { AppRoutingModule } from './app-routing.module';

// Core
import { AppComponent } from './app.component';

// Layout
import { LayoutComponent } from './layout/layout-full/layout.component';
import { HeaderComponent } from './layout/header/header.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { FooterComponent } from './layout/footer/footer.component';

// Landing Page
import { LandingComponent } from './landing/landing.component';

// Authentication
import { LoginComponent } from './authentication/login/login.component';
import { RegisterComponent } from './authentication/register/register.component';
import { ForgotPasswordComponent } from './authentication/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './authentication/reset-password/reset-password.component';

// Dashboard
import { DashboardComponent } from './dashboard/dashboard.component';

// Shop Inventory
import { InventoryListComponent } from './pages/shop-inventory/inventory-list/inventory-list.component';
import { StockInDialogComponent } from './pages/shop-inventory/stock-in-dialog/stock-in-dialog.component';
import { StockOutDialogComponent } from './pages/shop-inventory/stock-out-dialog/stock-out-dialog.component';
import { AddProductDialogComponent } from './pages/shop-inventory/add-product-dialog/add-product-dialog.component';
import { HistoryDialogComponent } from './pages/shop-inventory/history-dialog/history-dialog.component';
import { EditProductDialogComponent } from './pages/shop-inventory/edit-product-dialog/edit-product-dialog.component';
import { ProductDetailsDialogComponent } from './pages/shop-inventory/product-details-dialog/product-details-dialog.component';

// Sales
import { PosComponent } from './pages/sales/pos/pos.component';
import { SalesListComponent } from './pages/sales/sales-list/sales-list.component';

// Settings
import { ShopSettingsComponent } from './pages/settings/shop-settings/shop-settings.component';
import { ShopDialogComponent } from './pages/settings/shop-dialog/shop-dialog.component';
import { UserDialogComponent } from './pages/settings/user-dialog/user-dialog.component';
import { UserDetailDialogComponent } from './pages/settings/user-detail-dialog/user-detail-dialog.component';

// Admin
import { AdminDashboardComponent } from './pages/admin/admin-dashboard/admin-dashboard.component';
import { TenantListComponent } from './pages/admin/tenant-list/tenant-list.component';
import { TenantDetailsComponent } from './pages/admin/tenant-details/tenant-details.component';
import { SubscriptionPlansComponent } from './pages/admin/subscription-plans/subscription-plans.component';
import { PlanDialogComponent } from './pages/admin/subscription-plans/plan-dialog/plan-dialog.component';
import { SubscriptionsComponent } from './pages/admin/subscriptions/subscriptions.component';
import { UserListComponent } from './pages/admin/user-list/user-list.component';

// Subscription/Upgrade
import { UpgradeComponent } from './pages/subscription/upgrade.component';
import { PaymentSuccessComponent } from './pages/subscription/payment-success.component';
import { PaymentCallbackComponent } from './pages/subscription/payment-callback.component';
import { OPayCheckoutComponent } from './pages/subscription/opay-checkout.component';

// Interceptors
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { SaleDetailsDialogComponent } from './pages/sales/sale-details-dialog/sale-details-dialog.component';

// Reports
import { ReportsComponent } from './pages/reports/reports.component';


@NgModule({
  declarations: [
    AppComponent,
    // Layout
    LayoutComponent,
    HeaderComponent,
    SidebarComponent,
    FooterComponent,
    // Landing
    LandingComponent,
    // Auth
    LoginComponent,
    RegisterComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    // Dashboard
    DashboardComponent,
    // Inventory
    InventoryListComponent,
    StockInDialogComponent,
    StockOutDialogComponent,
    AddProductDialogComponent,
    HistoryDialogComponent,
    EditProductDialogComponent,
    ProductDetailsDialogComponent,
    // Sales
    PosComponent,
    SalesListComponent,
    SaleDetailsDialogComponent,
    // Reports
    ReportsComponent,
    // Settings
    ShopSettingsComponent,
    ShopDialogComponent,
    UserDialogComponent,
    UserDetailDialogComponent,
    // Admin
    AdminDashboardComponent,
    TenantListComponent,
    TenantDetailsComponent,
    SubscriptionPlansComponent,
    PlanDialogComponent,
    SubscriptionsComponent,
    UserListComponent,
    // Subscription/Upgrade
    UpgradeComponent,
    PaymentSuccessComponent,
    PaymentCallbackComponent,
    OPayCheckoutComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    // Material
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatRadioModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatSlideToggleModule,
    MatProgressSpinnerModule,
    MatBadgeModule,
    MatTabsModule,
    MatTooltipModule,
    MatButtonToggleModule,
    MatSelectModule,
    MatPaginatorModule,
    MatTableModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogModule,
    MatListModule,
    MatMenuModule,
    MatDividerModule,
    MatSortModule,
    MatChipsModule,
    MatExpansionModule,
    // Third-party
    ToastrModule.forRoot()
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
