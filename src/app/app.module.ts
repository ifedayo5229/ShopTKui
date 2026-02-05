import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; 
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field'; 
import { MatInputModule } from '@angular/material/input'; 
import { MatCheckboxModule } from '@angular/material/checkbox'; 
import { MatRadioModule } from '@angular/material/radio';
import { MatIconModule } from '@angular/material/icon'; 
import { MatButtonModule } from '@angular/material/button'; 
import { MatCardModule } from '@angular/material/card';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthenticateComponent } from './authentication/authenticate/authenticate.component';
import { LayoutComponent } from './layout/layout-full/layout.component';
import { HeaderComponent } from './layout/header/header.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { FooterComponent } from './layout/footer/footer.component';
import { ForgotPasswordComponent } from './authentication/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './authentication/reset-password/reset-password.component';
import { ToastrModule } from 'ngx-toastr';
import { HttpClientModule } from '@angular/common/http';
import { RequestItemsComponent } from './pages/request/request-items/request-items.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatSelectModule } from '@angular/material/select';
import { AllFormsComponent } from './pages/request/all-requests/all-forms.component';
import { PendingFormsComponent } from './pages/request/pending-requests/pending-forms.component';
import { AllItemsComponent } from './pages/items/all-items/all-items.component';
import { ReportsComponent } from './pages/reports/reports.component';
import { ViewRoutesComponent } from './pages/routes/view-routes/view-routes.component';
import { SetRouteComponent } from './pages/routes/set-route/set-route.component';
import { ViewUsersComponent } from './pages/users/view-users/view-users.component';
import { ViewStoreUsersComponent } from './pages/users/view-store-users/view-store-users.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { CreateInventoryMovementComponent } from './pages/inventory-movement/create-inventory-movement/create-inventory-movement.component';
import { ViewInventoryMovementComponent } from './pages/inventory-movement/view-inventory-movement/view-inventory-movement.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { LoadingBarModule } from '@ngx-loading-bar/core';
import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client';
import { LoadingBarRouterModule } from '@ngx-loading-bar/router';
import { CreateStoreComponent } from './pages/store/create-store/create-store.component';
import { ViewStoresComponent } from './pages/store/view-stores/view-stores.component';
import { CreateItemComponent } from './pages/items/create-item/create-item.component';
import { AssignRoleComponent } from './pages/users/assign-role/assign-role.component';
import { MatDialogModule } from '@angular/material/dialog';
import { AssignRolesComponent } from './pages/users/assign-roles/assign-roles.component';
import { PendingRequestsComponent } from './pages/pending-approvals/pending-requests/pending-requests.component';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { ApproveRequestDialogComponent } from './pages/pending-approvals/approve-request-dialog/approve-request-dialog.component';
import { RejectRequestDialogComponent } from './pages/pending-approvals/reject-request-dialog/reject-request-dialog.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { IssueOutInventoryComponent } from './pages/inventory-movement/issue-out-inventory/issue-out-inventory.component';
import { OutwardMovementsComponent } from './pages/inventory-movement/outward-movements/outward-movements.component';
import { MyItemRequestsComponent } from './pages/request/my-item-requests/my-item-requests.component';
import { StoreRequestComponent } from './pages/request/store-request/store-request.component';
import { ViewStoreRequestComponent } from './pages/request/view-store-request/view-store-request.component';
import { PendingStoreRequestsComponent } from './pages/pending-approvals/pending-store-requests/pending-store-requests.component';
import { IssueStoreRequestComponent } from './pages/pending-approvals/issue-store-request/issue-store-request.component';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { IssueRequestsComponent } from './pages/pending-approvals/issue-requests/issue-requests.component';
import { ReceiveDisbursedItemsComponent } from './pages/inventory-movement/receive-disbursed-items/receive-disbursed-items.component';
import { ReceiveDisbursedItemDialogComponent } from './pages/items/receive-disbursed-item-dialog/receive-disbursed-item-dialog.component';
import { MainStoreConfirmationDialogComponent } from './pages/store/main-store-confirmation-dialog/main-store-confirmation-dialog.component';
import { CreateCategoryDialogComponent } from './pages/items/create-category-dialog/create-category-dialog.component';
import { AllInventoriesComponent } from './pages/report/all-inventories/all-inventories.component';
import { AllRequestsComponent } from './pages/report/all-requests/all-requests.component';
import { AllDisbursementsComponent } from './pages/report/all-disbursements/all-disbursements.component';
import { UnfulfilledAllocationsComponent } from './pages/report/unfulfilled-allocations/unfulfilled-allocations.component';
import { DirectIssueComponent } from './pages/inventory-movement/direct-issue/direct-issue.component';
import { ViewItStoresComponent } from './pages/store/view-it-stores/view-it-stores.component';
import { CreateItItemComponent } from './pages/items/create-it-item/create-it-item.component';
import { AllItItemComponent } from './pages/items/all-it-item/all-it-item.component';
import { ReceiveItInventoryComponent } from './pages/inventory-movement/receive-it-inventory/receive-it-inventory.component';
import { AllApprovedItRequestsComponent } from './pages/request/all-approved-it-requests/all-approved-it-requests.component';
import { FillEquipmentFormComponent } from './pages/equipment-form/fill-equipment-form/fill-equipment-form.component';
import { ItStoreRequestComponent } from './pages/request/it-store-request/it-store-request.component';
import { ViewItInventoryMovementComponent } from './pages/inventory-movement/view-it-inventory-movement/view-it-inventory-movement.component';
import { AllDirectIssuesComponent } from './pages/report/all-direct-issues/all-direct-issues.component';
import { AssignItManagerComponent } from './pages/users/assign-it-manager/assign-it-manager.component';
import { ItPendingRequestsComponent } from './pages/pending-approvals/it-pending-requests/it-pending-requests.component';
import { ItApproveDialogComponent } from './pages/pending-approvals/it-approve-dialog/it-approve-dialog.component';
import { ItRejectDialogComponent } from './pages/pending-approvals/it-reject-dialog/it-reject-dialog.component';
import { AllEquipmentFormsComponent } from './pages/report/all-equipment-forms/all-equipment-forms.component';
import { CreateGhetItemComponent } from './pages/items/create-ghet-item/create-ghet-item.component';
import { AllGhetItemsComponent } from './pages/items/all-ghet-items/all-ghet-items.component';
import { RequestGhetItemComponent } from './pages/request/request-ghet-item/request-ghet-item.component';
import { MyGhetItemRequestsComponent } from './pages/request/my-ghet-item-requests/my-ghet-item-requests.component';
import { GhetPendingRequestsComponent } from './pages/pending-approvals/ghet-pending-requests/ghet-pending-requests.component';
import { GhetApproveDialogComponent } from './pages/pending-approvals/ghet-approve-dialog/ghet-approve-dialog.component';
import { GhetRejectDialogComponent } from './pages/pending-approvals/ghet-reject-dialog/ghet-reject-dialog.component';
import { ViewAllGhetRequestsComponent } from './pages/request/view-all-ghet-requests/view-all-ghet-requests.component';
import { GhetRequestsForCpasdComponent } from './pages/request/ghet-requests-for-cpasd/ghet-requests-for-cpasd.component';
import { ReceiveGhetInventoryComponent } from './pages/inventory-movement/receive-ghet-inventory/receive-ghet-inventory.component';
import { ItemImagesDialogComponent } from './pages/items/item-images-dialog/item-images-dialog.component';
import { ViewGhetInventoriesComponent } from './pages/inventory-movement/view-ghet-inventories/view-ghet-inventories.component';



@NgModule({
  declarations: [
    AppComponent,
    AuthenticateComponent,
    LayoutComponent,
    RequestItemsComponent,
    HeaderComponent,
    SidebarComponent,
    FooterComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    AllFormsComponent,
    PendingFormsComponent,
    AllItemsComponent,
    ReportsComponent,
    ViewRoutesComponent,
    SetRouteComponent,
    ViewUsersComponent,
    ViewStoreUsersComponent,
    CreateInventoryMovementComponent,
    ViewInventoryMovementComponent,
    CreateStoreComponent,
    ViewStoresComponent,
    CreateItemComponent,
    AssignRoleComponent,
    AssignRolesComponent,
    PendingRequestsComponent,
    ApproveRequestDialogComponent,
    RejectRequestDialogComponent,
    DashboardComponent,
    IssueOutInventoryComponent,
    OutwardMovementsComponent,
    MyItemRequestsComponent,
    StoreRequestComponent,
    ViewStoreRequestComponent,
    PendingStoreRequestsComponent,
    IssueStoreRequestComponent,
    ReceiveDisbursedItemDialogComponent,
    ReceiveDisbursedItemsComponent,
    IssueRequestsComponent,
    MainStoreConfirmationDialogComponent,
    CreateCategoryDialogComponent,
    AllInventoriesComponent,
    AllRequestsComponent,
    AllDisbursementsComponent,
    UnfulfilledAllocationsComponent,
    DirectIssueComponent,
    ViewItStoresComponent,
    CreateItItemComponent,
    AllItItemComponent,
    ReceiveItInventoryComponent,
    AllApprovedItRequestsComponent,
    FillEquipmentFormComponent,
    ItStoreRequestComponent,
    ViewItInventoryMovementComponent,
    AllDirectIssuesComponent,
    AssignItManagerComponent,
    ItPendingRequestsComponent,
    ItApproveDialogComponent,
    ItRejectDialogComponent,
    AllEquipmentFormsComponent,
    CreateGhetItemComponent,
    AllGhetItemsComponent,
    RequestGhetItemComponent,
    MyGhetItemRequestsComponent,
    GhetPendingRequestsComponent,
    GhetApproveDialogComponent,
    GhetRejectDialogComponent,
    ViewAllGhetRequestsComponent,
    GhetRequestsForCpasdComponent,
    ReceiveGhetInventoryComponent,
    ItemImagesDialogComponent,
    ViewGhetInventoriesComponent,  
  ],
  imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    AppRoutingModule, 
    ReactiveFormsModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatCheckboxModule,
    MatRadioModule, 
    MatIconModule, 
    MatButtonModule,
    MatCardModule,
    HttpClientModule,
    FlexLayoutModule,
    MatSelectModule,
    MatPaginatorModule,
    MatTableModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ToastrModule.forRoot(),
    LoadingBarModule,
    LoadingBarHttpClientModule,
    LoadingBarRouterModule,
    MatDialogModule,
    MatListModule,
    MatMenuModule,
    NgxMatSelectSearchModule,
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }