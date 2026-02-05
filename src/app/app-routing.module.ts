import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout-full/layout.component';
import { RequestItemsComponent } from './pages/request/request-items/request-items.component';
import { ForgotPasswordComponent } from './authentication/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './authentication/reset-password/reset-password.component';
import { AuthGuard } from './interceptors/auth.guard';
import { AuthenticateComponent } from './authentication/authenticate/authenticate.component';
import { AllItemsComponent } from './pages/items/all-items/all-items.component';
import { AllFormsComponent } from './pages/request/all-requests/all-forms.component';
import { PendingFormsComponent } from './pages/request/pending-requests/pending-forms.component';
import { ReportsComponent } from './pages/reports/reports.component';
import { ViewRoutesComponent } from './pages/routes/view-routes/view-routes.component';
import { SetRouteComponent } from './pages/routes/set-route/set-route.component';
import { ViewUsersComponent } from './pages/users/view-users/view-users.component';
import { ViewStoreUsersComponent } from './pages/users/view-store-users/view-store-users.component';
import { ViewInventoryMovementComponent } from './pages/inventory-movement/view-inventory-movement/view-inventory-movement.component';
import { CreateInventoryMovementComponent } from './pages/inventory-movement/create-inventory-movement/create-inventory-movement.component';
import { CreateStoreComponent } from './pages/store/create-store/create-store.component';
import { ViewStoresComponent } from './pages/store/view-stores/view-stores.component';
import { CreateItemComponent } from './pages/items/create-item/create-item.component';
import { PendingRequestsComponent } from './pages/pending-approvals/pending-requests/pending-requests.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { IssueOutInventoryComponent } from './pages/inventory-movement/issue-out-inventory/issue-out-inventory.component';
import { OutwardMovementsComponent } from './pages/inventory-movement/outward-movements/outward-movements.component';
import { MyItemRequestsComponent } from './pages/request/my-item-requests/my-item-requests.component';
import { StoreRequestComponent } from './pages/request/store-request/store-request.component';
import { ViewStoreRequestComponent } from './pages/request/view-store-request/view-store-request.component';
import { PendingStoreRequestsComponent } from './pages/pending-approvals/pending-store-requests/pending-store-requests.component';
import { ReceiveDisbursedItemsComponent } from './pages/inventory-movement/receive-disbursed-items/receive-disbursed-items.component';
import { IssueRequestsComponent } from './pages/pending-approvals/issue-requests/issue-requests.component';
import { AllInventoriesComponent } from './pages/report/all-inventories/all-inventories.component';
import { AllRequestsComponent } from './pages/report/all-requests/all-requests.component';
import { AllDisbursementsComponent } from './pages/report/all-disbursements/all-disbursements.component';
import { UnfulfilledAllocationsComponent } from './pages/report/unfulfilled-allocations/unfulfilled-allocations.component';
import { DirectIssueComponent } from './pages/inventory-movement/direct-issue/direct-issue.component';
import { ViewItStoresComponent } from './pages/store/view-it-stores/view-it-stores.component';
import { CreateItItemComponent } from './pages/items/create-it-item/create-it-item.component';
import { AllItItemComponent } from './pages/items/all-it-item/all-it-item.component';
import { AllApprovedItRequestsComponent } from './pages/request/all-approved-it-requests/all-approved-it-requests.component';
import { FillEquipmentFormComponent } from './pages/equipment-form/fill-equipment-form/fill-equipment-form.component';
import { ReceiveItInventoryComponent } from './pages/inventory-movement/receive-it-inventory/receive-it-inventory.component';
import { ItStoreRequestComponent } from './pages/request/it-store-request/it-store-request.component';
import { ViewItInventoryMovementComponent } from './pages/inventory-movement/view-it-inventory-movement/view-it-inventory-movement.component';
import { AllDirectIssuesComponent } from './pages/report/all-direct-issues/all-direct-issues.component';
import { ItPendingRequestsComponent } from './pages/pending-approvals/it-pending-requests/it-pending-requests.component';
import { AllEquipmentFormsComponent } from './pages/report/all-equipment-forms/all-equipment-forms.component';
import { CreateGhetItemComponent } from './pages/items/create-ghet-item/create-ghet-item.component';
import { AllGhetItemsComponent } from './pages/items/all-ghet-items/all-ghet-items.component';
import { RequestGhetItemComponent } from './pages/request/request-ghet-item/request-ghet-item.component';
import { MyGhetItemRequestsComponent } from './pages/request/my-ghet-item-requests/my-ghet-item-requests.component';
import { GhetPendingRequestsComponent } from './pages/pending-approvals/ghet-pending-requests/ghet-pending-requests.component';
import { ViewAllGhetRequestsComponent } from './pages/request/view-all-ghet-requests/view-all-ghet-requests.component';
import { GhetRequestsForCpasdComponent } from './pages/request/ghet-requests-for-cpasd/ghet-requests-for-cpasd.component';
import { ReceiveGhetInventoryComponent } from './pages/inventory-movement/receive-ghet-inventory/receive-ghet-inventory.component';
import { ViewGhetInventoriesComponent } from './pages/inventory-movement/view-ghet-inventories/view-ghet-inventories.component';

const routes: Routes = [
  { path: "", component: AuthenticateComponent },
  { path: "forgotPassword", component: ForgotPasswordComponent },
  { path: "resetPassword", component: ResetPasswordComponent },
  {
    path: "home",
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: "dashboard", component: DashboardComponent},
      { path: "requestItems", component: RequestItemsComponent }, 
      { path: "createItem", component: CreateItemComponent }, 
      { path: "allItems", component: AllItemsComponent }, 
      { path: "allForms", component: AllFormsComponent }, 
      { path: "pendingForms", component: PendingFormsComponent },
      { path: "reports", component: ReportsComponent },
      { path: "viewRoutes", component: ViewRoutesComponent },
      { path: "setRoute", component: SetRouteComponent },
      { path: "viewUsers", component: ViewUsersComponent },
      { path: "viewStoreUsers", component: ViewStoreUsersComponent },
      { path: "createInventoryMovement", component: CreateInventoryMovementComponent },
      { path: "viewInventoryMovement", component: ViewInventoryMovementComponent },
      { path: "createStore", component: CreateStoreComponent },
      { path: "viewStores", component: ViewStoresComponent },
      { path: "pendingRequests", component: PendingRequestsComponent },
      { path: "issueOutInventory", component: IssueOutInventoryComponent },
      { path: "outwardMovements", component: OutwardMovementsComponent },
      { path: "myItemRequests", component: MyItemRequestsComponent },
      { path: "disburseItems", component: StoreRequestComponent },
      { path: "recieveDisbursedItems", component: ReceiveDisbursedItemsComponent },
      { path: "viewStoreRequest", component: ViewStoreRequestComponent },
      { path: "pendingStoreRequest", component: PendingStoreRequestsComponent },
      { path: "issueRequests", component: IssueRequestsComponent },
      { path: "allInventories", component: AllInventoriesComponent },
      { path: "allRequests", component: AllRequestsComponent },
      { path: "allDisbursements", component: AllDisbursementsComponent },
      { path: "unfulfilledAllocations", component: UnfulfilledAllocationsComponent },
      { path: "directIssue", component: DirectIssueComponent },
      { path: "allItStores", component: ViewItStoresComponent },
      { path: "createItItem", component: CreateItItemComponent },
      { path: "allItItems", component: AllItItemComponent },
      { path: "allApprovedItRequests", component: AllApprovedItRequestsComponent },
      { path: "equipmentForm", component: FillEquipmentFormComponent },
      { path: "receiveItInventory", component: ReceiveItInventoryComponent },
      { path: "disburseITItems", component: ItStoreRequestComponent },
      { path: "viewItInventoryMovement", component: ViewItInventoryMovementComponent },
      { path: "allITDirectIssues", component: AllDirectIssuesComponent },
      { path: "itPendingRequests", component: ItPendingRequestsComponent },
      { path: "allEquipmentForms", component: AllEquipmentFormsComponent },
      { path: "createGhetItem", component: CreateGhetItemComponent },
      { path: "allGhetItems", component: AllGhetItemsComponent },
      { path: "createGhetItemRequest", component: RequestGhetItemComponent },
      { path: "myGhetItemRequests", component: MyGhetItemRequestsComponent },
      { path: "ghetPendingRequests", component: GhetPendingRequestsComponent },
      { path: "allGhetRequests", component: ViewAllGhetRequestsComponent },
      { path: "CPASDGhetRequests", component: GhetRequestsForCpasdComponent },
      { path: "receiveGhetInventory", component: ReceiveGhetInventoryComponent },
      { path: "allGhetInventories", component: ViewGhetInventoriesComponent },

    ]
  },
  { path: "**", redirectTo: "/home", pathMatch: "full" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

