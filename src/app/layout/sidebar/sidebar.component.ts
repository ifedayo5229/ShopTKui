import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, combineLatest } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { SidebarService } from 'src/app/services/sidebar/sidebar.service';
import { Router } from '@angular/router';
import { TokenService } from 'src/app/services/token/token.service';
import { LoginResponseData } from 'src/app/models/login-response-data';

interface MenuItem {
  label: string;
  image: string;
  route?: string; 
  subMenu?: MenuItem[]; 
  roles: string[];
  isSubMenuOpen?: boolean; 
}

interface SingleMenu {
  label: string;
  image: string;
  route: string;  
  roles: string[];  
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {

  isSidebarVisible$: Observable<boolean>;
  isSidebarOpen$ = this.sidebarService.sidebarOpen$;
  activeItem: any = null;
  filteredMenuItems: MenuItem[] = [];
  filteredSingleMenu: SingleMenu[] = [];

  constructor(
    private breakpointObserver: BreakpointObserver, 
    private sidebarService: SidebarService,
    private router: Router,
    private tokenService: TokenService
  ) 
  {
    const isHandset$ = this.breakpointObserver.observe(Breakpoints.Handset)
      .pipe(map(result => result.matches));

    this.isSidebarVisible$ = combineLatest([isHandset$, this.sidebarService.sidebarOpen$]).pipe(
      map(([isHandset, isOpen]) => !isHandset || isOpen)
    );
  } 


  ngOnInit(){
    this.getinfo();
    this.updateFilteredMenuItems();
    this.updateFilteredSingleMenu();
  }

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
  .pipe(
    map(result => result.matches),
    shareReplay()
  );

  isOpen = false ;
  currentUser: any;
  firstName: any;
  lastName: any;
  fullname: any;
  userRoles: string[] = []; 

  getinfo(){
    debugger
    
    const loginResponse: LoginResponseData = this.tokenService.getInfo();
    var datas = loginResponse.permission;

      this.currentUser = this.tokenService.getInfo(); 
      var roles = this.currentUser.roles;
      const userRoles = roles.map((role: { roleName: any; }) => role.roleName);
      if (userRoles.length == 0)
      {
        userRoles.push('Requester');
      }
      this.userRoles = userRoles;
      
    }

  // Menu items with roles
  // Possible roles: "Store Manager", "Admin", "Requester", "Store Approver", "Line Manager"
  menuItems: MenuItem[] = [
    
    {
      label: 'POSM Module',
      image: 'assets/images/icons/SVGs/arrow-autofit-content.svg',
       roles : ["Admin", "Store Manager", "Approver", "Requester", "Store Approver", "HOS", "Main Store Manager", "Issuer", "IT Support", "IT Store Manager", "CPASD Store Manager", "Head of Unit", "Super Admin", "IT Final Approver", "Line Manager"],
      isSubMenuOpen: false, 
      subMenu: [
        {
          label: 'POSM Item Request',
          image: 'assets/images/icons/SVGs/request_for_items.svg',
          roles: ['Admin', 'Requester', 'Line Manager', 'Store Manager', 'IT Store Manager'],
          route: '/home/requestItems',
          isSubMenuOpen: false,
        },
        {
          label: 'My POSM Requests',
          image: 'assets/images/icons/SVGs/request_for_items.svg',
          roles: ['Admin', 'Requester','Store Manager', 'Line Manager', 'IT Store Manager'],
          route: '/home/myItemRequests',
          isSubMenuOpen: false,
        },
        {
          label: 'Receive POSM Inventory',
          image: 'assets/images/icons/SVGs/request_for_items.svg',
          roles: ['Admin', 'Main Store Manager'],
          route: '/home/createInventoryMovement',
          isSubMenuOpen: false,
        },
        {
          label: 'Disburse Inventory',
          image: 'assets/images/icons/SVGs/request_for_items.svg',
          roles: ['Admin', 'Main Store Manager'],
          route: '/home/disburseItems',
          isSubMenuOpen: false,
        },
        {
          label: 'View POSM Inventories',
          image: 'assets/images/icons/SVGs/request_for_items.svg',
          roles: ['Admin', 'Store Manager'],
          route: '/home/viewInventoryMovement',
          isSubMenuOpen: false,
        },
        {
          label: 'Receive Disbursed Items',
          image: 'assets/images/icons/SVGs/request_for_items.svg',
          roles: ['Admin', 'Store Manager'],
          route: '/home/recieveDisbursedItems',
          isSubMenuOpen: false,
        },
        {
          label: 'Pending POSM Requests',
          image: 'assets/images/icons/SVGs/view_items.svg',
          roles: ['Admin', 'Line Manager','Store Manager','HOS', 'Store Approver'],
          route: '/home/pendingRequests',
          isSubMenuOpen: false,
        },
        {
          label: 'All POSM Inventories',
          image: 'assets/images/icons/SVGs/request_for_items.svg',
          roles: ['Admin', 'Main Store Manager'],
          route: '/home/allInventories',
          isSubMenuOpen: false,
        },
        {
          label: 'All POSM Requests',
          image: 'assets/images/icons/SVGs/request_for_items.svg',
          roles: ['Admin', 'Main Store Manager'],
          route: '/home/allRequests',
          isSubMenuOpen: false,
        },
        {
          label: 'All POSM Disbursements',
          image: 'assets/images/icons/SVGs/request_for_items.svg',
          roles: ['Admin', 'Main Store Manager'],
          route: '/home/allDisbursements',
          isSubMenuOpen: false,
        },  
      ],
    },

    // {
    //   label: 'IT Module',
    //   image: 'assets/images/icons/SVGs/checklist.svg',
    //    roles : ["Admin", "Store Manager", "Approver", "Requester", "Store Approver", "HOS", "Main Store Manager", "Issuer", "IT Support", "IT Store Manager", "CPASD Store Manager", "Head of Unit", "Super Admin", "IT Final Approver", "Line Manager"],
    //   isSubMenuOpen: false, 
    //   subMenu: [
    //     {
    //       label: 'Create IT Item Request',
    //       image: 'assets/images/icons/SVGs/request_for_items.svg',
    //       roles: ['Super Admin', 'IT Store Manager', 'IT Support'],
    //       route: '/home/directIssue',
    //       isSubMenuOpen: false,
    //     },
    //     {
    //       label: 'My Equipment Requests',
    //       image: 'assets/images/icons/SVGs/request_for_items.svg',
    //       roles: ['Admin', 'Requester', 'Line Manager','Store Manager','HOS', 'Store Approver', 'IT Store Manager', 'IT Support'],
    //       route: '/home/allApprovedItRequests',
    //       isSubMenuOpen: false,
    //     },
    //     {
    //       label: 'Receive IT Inventory',
    //       image: 'assets/images/icons/SVGs/request_for_items.svg',
    //       roles: ['Super Admin', 'IT Store Manager', 'IT Support'],
    //       route: '/home/receiveItInventory',
    //       isSubMenuOpen: false,
    //     },
    //     {
    //       label: 'Disburse IT Inventory',
    //       image: 'assets/images/icons/SVGs/request_for_items.svg',
    //       roles: ['Super Admin', 'IT Store Manager'],
    //       route: '/home/disburseITItems',
    //       isSubMenuOpen: false,
    //     },
    //     {
    //       label: 'View IT Inventories',
    //       image: 'assets/images/icons/SVGs/request_for_items.svg',
    //       roles: ['Super Admin', 'IT Store Manager', 'IT Support'],
    //       route: '/home/viewItInventoryMovement',
    //       isSubMenuOpen: false,
    //     },
    //     {
    //       label: 'All IT Items Requests',
    //       image: 'assets/images/icons/SVGs/request_for_items.svg',
    //       roles: ['Super Admin', 'IT Store Manager', 'IT Support'],
    //       route: '/home/allITDirectIssues',
    //       isSubMenuOpen: false,
    //     },
    //     {
    //       label: 'Pending IT Requests',
    //       image: 'assets/images/icons/SVGs/view_items.svg',
    //       roles: ['Super Admin', 'IT Store Manager'],
    //       route: '/home/itPendingRequests',
    //       isSubMenuOpen: false,
    //     },
    //     {
    //       label: 'All Equipment Forms',
    //       image: 'assets/images/icons/SVGs/request_for_items.svg',
    //       roles: ['Super Admin', 'IT Store Manager', 'IT Support'],
    //       route: '/home/allEquipmentForms',
    //       isSubMenuOpen: false,
    //     },
    //     {
    //       label: 'All IT Requests',
    //       image: 'assets/images/icons/SVGs/request_for_items.svg',
    //       roles: ['Super Admin', 'IT Store Manager'],
    //       route: '/home/allITDirectIssues',
    //       isSubMenuOpen: false,
    //     },

    //   ],
    // },

    // {
    //   label: 'GHET Module',
    //   image: 'assets/images/icons/SVGs/basket-plus.svg',
    //    roles : ["Admin", "Store Manager", "Approver", "Requester", "Store Approver", "HOS", "Main Store Manager", "Issuer", "IT Support", "IT Store Manager", "CPASD Store Manager", "Head of Unit", "Super Admin", "IT Final Approver", "Line Manager"],
    //   isSubMenuOpen: false, 
    //   subMenu: [
    //     {
    //       label: 'Ghet Item Request',
    //       image: 'assets/images/icons/SVGs/request_for_items.svg',
    //       roles: ['Admin', 'Requester'],
    //       route: '/home/createGhetItemRequest',
    //       isSubMenuOpen: false,
    //     },
    //     {
    //       label: 'My Ghet Item Requests',
    //       image: 'assets/images/icons/SVGs/request_for_items.svg',
    //       roles: ['Super Admin', 'Requester'],
    //       route: '/home/myGhetItemRequests',
    //       isSubMenuOpen: false,
    //     },
    //     {
    //       label: 'Receive GHET Inventory',
    //       image: 'assets/images/icons/SVGs/request_for_items.svg',
    //       roles: ['Super Admin', 'CPASD Store Manager'],
    //       route: '/home/receiveGhetInventory',
    //       isSubMenuOpen: false,
    //     },
    //     {
    //       label: 'View Ghet Inventories',
    //       image: 'assets/images/icons/SVGs/request_for_items.svg',
    //       roles: ['Super Admin', 'CPASD Store Manager'],
    //       route: '/home/allGhetInventories',
    //       isSubMenuOpen: false,
    //     },
    //     {
    //       label: 'All GHET Requests',
    //       image: 'assets/images/icons/SVGs/request_for_items.svg',
    //       roles: ['Super Admin', 'CPASD Store Manager'],
    //       route: '/home/allGhetRequests',
    //       isSubMenuOpen: false,
    //     },
    //     {
    //       label: 'Pending GHET Requests',
    //       image: 'assets/images/icons/SVGs/view_items.svg',
    //       roles: ['Super Admin', 'Head of Unit'],
    //       route: '/home/ghetPendingRequests',
    //       isSubMenuOpen: false,
    //     },
    //     {
    //       label: 'GHET Requests for CPASD',
    //       image: 'assets/images/icons/SVGs/request_for_items.svg',
    //       roles: ['Super Admin', 'CPASD Store Manager'],
    //       route: '/home/CPASDGhetRequests',
    //       isSubMenuOpen: false,
    //     }
        
    //   ],
    // },
    {
      label: 'Store Management',
      image: 'assets/images/icons/SVGs/building-store.svg',
      roles: ['Super Admin'],
      isSubMenuOpen: false, 
      subMenu: [
        {
          label: 'Create Store',
          image: 'assets/images/icons/SVGs/request_for_items.svg',
          roles: ['Super Admin'],
          route: '/home/createStore',
          isSubMenuOpen: false,
        },
        {
          label: 'View All Stores',
          image: 'assets/images/icons/SVGs/request_for_items.svg',
          roles: ['Super Admin'],
          route: '/home/viewStores',
          isSubMenuOpen: false,
        },
        {
          label: 'View All IT Stores',
          image: 'assets/images/icons/SVGs/request_for_items.svg',
          roles: ['Super Admin', 'IT Store Manager'],
          route: '/home/allItStores',
          isSubMenuOpen: false,
        }
      ],
    },

    {
      label: 'Item Management',
      image: 'assets/images/icons/SVGs/box.svg',
      roles: ['Admin', 'Store Manager'],
      isSubMenuOpen: false, 
      subMenu: [
        {
          label: 'Create POSM Item',
          image: 'assets/images/icons/SVGs/request_for_items.svg',
          roles: ['Admin'],
          route: '/home/createItem',
          isSubMenuOpen: false,
        },
        {
          label: 'Create IT Item',
          image: 'assets/images/icons/SVGs/request_for_items.svg',
          roles: ['Admin', 'IT Store Manager'],
          route: '/home/createItItem',
          isSubMenuOpen: false,
        },
        {
          label: 'Create GHET Item',
          image: 'assets/images/icons/SVGs/request_for_items.svg',
          roles: ['Super Admin'],
          route: '/home/createGhetItem',
          isSubMenuOpen: false,
        },
        {
          label: 'View All POSM Items',
          image: 'assets/images/icons/SVGs/request_for_items.svg',
          roles: ['Admin', 'Store Manager'],
          route: '/home/allItems',
          isSubMenuOpen: false,
        },
        {
          label: 'View All IT Items',
          image: 'assets/images/icons/SVGs/request_for_items.svg',
          roles: ['Super Admin', 'IT Store Manager'],
          route: '/home/allItItems',
          isSubMenuOpen: false,
        },
        {
          label: 'View All GHET Items',
          image: 'assets/images/icons/SVGs/request_for_items.svg',
          roles: ['Super Admin', 'CPASD Store Manager'],
          route: '/home/allGhetItems',
          isSubMenuOpen: false,
        },
      ],
    },
    
    {
      label: 'User Management',
      image: 'assets/images/icons/SVGs/users-group.svg',
      roles: ['Super Admin'],
      isSubMenuOpen: false, 
      subMenu: [
        {
          label: 'View Users',
          image: 'assets/images/icons/SVGs/request_for_items.svg',
          roles: ['Super Admin'],
          route: '/home/viewUsers',
          isSubMenuOpen: false,
        }
      ],
    },

      {
      label: 'Reports',
      image: 'assets/images/icons/SVGs/file-report.svg',
      roles: [ 'Super Admin','Admin', 'Main Store Manager', 'IT Store Manager'],
      isSubMenuOpen: false, 
      subMenu: [
        {
          label: 'All POSM Inventories',
          image: 'assets/images/icons/SVGs/request_for_items.svg',
          roles: ['Super Admin','Admin', 'Main Store Manager'],
          route: '/home/allInventories',
          isSubMenuOpen: false,
        },
        {
          label: 'All POSM Requests',
          image: 'assets/images/icons/SVGs/request_for_items.svg',
          roles: ['Super Admin','Admin', 'Main Store Manager'],
          route: '/home/allRequests',
          isSubMenuOpen: false,
        },
        {
          label: 'All POSM Disbursements',
          image: 'assets/images/icons/SVGs/request_for_items.svg',
          roles: ['Super Admin','Admin', 'Main Store Manager'],
          route: '/home/allDisbursements',
          isSubMenuOpen: false,
        },
        {
          label: 'All IT Requests',
          image: 'assets/images/icons/SVGs/request_for_items.svg',
          roles: ['Super Admin','Admin', 'IT Store Manager'],
          route: '/home/allITDirectIssues',
          isSubMenuOpen: false,
        },
        {
          label: 'Unfulfilled Allocations',
          image: 'assets/images/icons/SVGs/request_for_items.svg',
          roles: ['Super Admin','Admin', 'Main Store Manager'],
          route: '/home/unfulfilledAllocations',
          isSubMenuOpen: false,
        },
      ],
    },
  ];

  // menuItems: MenuItem[] = [
  //   {
  //     label: 'Store',
  //     image: 'assets/images/icons/SVGs/building-store.svg',
  //     roles: ['Admin', 'Store Manager', 'IT Store Manager'],
  //     isSubMenuOpen: false, 
  //     subMenu: [
  //       {
  //         label: 'Create Store',
  //         image: 'assets/images/icons/SVGs/request_for_items.svg',
  //         roles: ['Admin'],
  //         route: '/home/createStore',
  //       },
  //       {
  //         label: 'View All Stores',
  //         image: 'assets/images/icons/SVGs/request_for_items.svg',
  //         roles: ['Admin', 'Store Manager'],
  //         route: '/home/viewStores',
  //       },
  //       {
  //         label: 'View All IT Stores',
  //         image: 'assets/images/icons/SVGs/request_for_items.svg',
  //         roles: ['Admin', 'IT Store Manager'],
  //         route: '/home/allItStores',
  //       }
  //     ],
  //   },

  //   {
  //     label: 'Item',
  //     image: 'assets/images/icons/SVGs/box.svg',
  //     roles: ['Admin', 'Store Manager'],
  //     isSubMenuOpen: false, 
  //     subMenu: [
  //       {
  //         label: 'Create POSM Item',
  //         image: 'assets/images/icons/SVGs/request_for_items.svg',
  //         roles: ['Admin'],
  //         route: '/home/createItem',
  //       },
  //       {
  //         label: 'Create IT Item',
  //         image: 'assets/images/icons/SVGs/request_for_items.svg',
  //         roles: ['Admin', 'IT Store Manager'],
  //         route: '/home/createItItem',
  //       },
  //       {
  //         label: 'Create GHET Item',
  //         image: 'assets/images/icons/SVGs/request_for_items.svg',
  //         roles: ['Admin'],
  //         route: '/home/createGhetItem',
  //       },
  //       {
  //         label: 'View All POSM Items',
  //         image: 'assets/images/icons/SVGs/request_for_items.svg',
  //         roles: ['Admin', 'Store Manager'],
  //         route: '/home/allItems',
  //       },
  //       {
  //         label: 'View All IT Items',
  //         image: 'assets/images/icons/SVGs/request_for_items.svg',
  //         roles: ['Admin', 'IT Store Manager'],
  //         route: '/home/allItItems',
  //       },
  //       {
  //         label: 'View All GHET Items',
  //         image: 'assets/images/icons/SVGs/request_for_items.svg',
  //         roles: ['Admin'],
  //         route: '/home/allGhetItems',
  //       },
  //     ],
  //   },

  //   {
  //     label: 'Inventory Movement',
  //     image: 'assets/images/icons/SVGs/arrow-autofit-content.svg',
  //     roles: ['Admin', 'Store Manager', 'IT Store Manager', 'IT Support'],
  //     isSubMenuOpen: false, 
  //     subMenu: [
  //       {
  //         label: 'Receive POSM Inventory',
  //         image: 'assets/images/icons/SVGs/request_for_items.svg',
  //         roles: ['Admin', 'Main Store Manager'],
  //         route: '/home/createInventoryMovement',
  //       },
  //       {
  //         label: 'Receive IT Inventory',
  //         image: 'assets/images/icons/SVGs/request_for_items.svg',
  //         roles: ['Admin', 'IT Store Manager', 'IT Support'],
  //         route: '/home/receiveItInventory',
  //       },
  //       {
  //         label: 'Receive GHET Inventory',
  //         image: 'assets/images/icons/SVGs/request_for_items.svg',
  //         roles: ['Admin', 'CPASD Store Manager'],
  //         route: '/home/receiveGhetInventory',
  //         isSubMenuOpen: false,
  //       },
  //       {
  //         label: 'Disburse Inventory',
  //         image: 'assets/images/icons/SVGs/request_for_items.svg',
  //         roles: ['Admin', 'Main Store Manager'],
  //         route: '/home/disburseItems',
  //       },
  //       {
  //         label: 'Disburse IT Inventory',
  //         image: 'assets/images/icons/SVGs/request_for_items.svg',
  //         roles: ['Admin', 'IT Store Manager'],
  //         route: '/home/disburseITItems',
  //       },
  //       {
  //         label: 'View POSM Inventories',
  //         image: 'assets/images/icons/SVGs/request_for_items.svg',
  //         roles: ['Admin', 'Store Manager'],
  //         route: '/home/viewInventoryMovement',
  //       },
  //       {
  //         label: 'View IT Inventories',
  //         image: 'assets/images/icons/SVGs/request_for_items.svg',
  //         roles: ['Admin', 'IT Store Manager', 'IT Support'],
  //         route: '/home/viewItInventoryMovement',
  //       },
  //       {
  //         label: 'View Ghet Inventories',
  //         image: 'assets/images/icons/SVGs/request_for_items.svg',
  //         roles: ['Admin', 'CPASD Store Manager'],
  //         route: '/home/allGhetInventories',
  //       },
  //       {
  //         label: 'Receive Disbursed Items',
  //         image: 'assets/images/icons/SVGs/request_for_items.svg',
  //         roles: ['Admin', 'Store Manager'],
  //         route: '/home/recieveDisbursedItems',
  //       },
  //       {
  //         label: 'Create IT Item Request',
  //         image: 'assets/images/icons/SVGs/request_for_items.svg',
  //         roles: ['Admin', 'Store Manager', 'IT Store Manager', 'IT Support'],
  //         route: '/home/directIssue',
  //       },
  //       {
  //         label: 'All IT Items Requests',
  //         image: 'assets/images/icons/SVGs/request_for_items.svg',
  //         roles: ['Admin', 'Main Store Manager', 'IT Store Manager', 'IT Support'],
  //         route: '/home/allITDirectIssues',
  //         isSubMenuOpen: false,
  //       },
  //       {
  //         label: 'All GHET Requests',
  //         image: 'assets/images/icons/SVGs/request_for_items.svg',
  //         roles: ['Admin', 'CPASD Store Manager'],
  //         route: '/home/allGhetRequests',
  //         isSubMenuOpen: false,
  //       },
    
  //     ],
  //   },
  //   {
  //     label: 'Pending Approvals',
  //     image: 'assets/images/icons/SVGs/checklist.svg',
  //     roles: ['Admin', 'Store Manager', 'Line Manager','HOS', 'IT Store Manager', 'Head of Unit'],
  //     isSubMenuOpen: false, 
  //     subMenu: [
  //       {
  //         label: 'Pending POSM Requests',
  //         image: 'assets/images/icons/SVGs/view_items.svg',
  //         roles: ['Admin', 'Line Manager','Store Manager','HOS', 'Store Approver'],
  //         route: '/home/pendingRequests',
  //         isSubMenuOpen: false,
  //       },
  //       {
  //         label: 'Pending IT Requests',
  //         image: 'assets/images/icons/SVGs/view_items.svg',
  //         roles: ['Admin', 'IT Store Manager'],
  //         route: '/home/itPendingRequests',
  //         isSubMenuOpen: false,
  //       },
  //       {
  //         label: 'Pending GHET Requests',
  //         image: 'assets/images/icons/SVGs/view_items.svg',
  //         roles: ['Admin', 'Head of Unit'],
  //         route: '/home/ghetPendingRequests',
  //         isSubMenuOpen: false,
  //       },
  //       {
  //         label: 'GHET Requests for CPASD',
  //         image: 'assets/images/icons/SVGs/request_for_items.svg',
  //         roles: ['Admin', 'CPASD'],
  //         route: '/home/CPASDGhetRequests',
  //       }
  //     ],
  //   },

  //   {
  //     label: 'Request',
  //     image: 'assets/images/icons/SVGs/basket-plus.svg',
  //     roles: ['Admin','Store Manager', 'Requester', 'Store Approver', 'Line Manager', 'IT Store Manager'],
  //     isSubMenuOpen: false, 
  //     subMenu: [
  //       {
  //         label: 'POSM Item Request',
  //         image: 'assets/images/icons/SVGs/request_for_items.svg',
  //         roles: ['Admin', 'Requester', 'Line Manager', 'Store Manager', 'IT Store Manager'],
  //         route: '/home/requestItems',
  //       },
  //       {
  //         label: 'My POSM Requests',
  //         image: 'assets/images/icons/SVGs/request_for_items.svg',
  //         roles: ['Admin', 'Requester','Store Manager', 'Line Manager', 'IT Store Manager'],
  //         route: '/home/myItemRequests',
  //       },
  //       {
  //         label: 'Ghet Item Request',
  //         image: 'assets/images/icons/SVGs/request_for_items.svg',
  //         roles: ['Admin', 'Requester'],
  //         route: '/home/createGhetItemRequest',
  //       },
  //       {
  //         label: 'My Ghet Item Requests',
  //         image: 'assets/images/icons/SVGs/request_for_items.svg',
  //         roles: ['Admin', 'Requester'],
  //         route: '/home/myGhetItemRequests',
  //       },
        
  //     ],
  //   },
  //   {
  //     label: 'IT Equipment',
  //     image: 'assets/images/icons/SVGs/chisel.svg',
  //     roles: ['Admin','Store Manager', 'Requester', 'Store Approver', 'Line Manager', 'HoS', 'IT Store Manager', 'IT Support'],
  //     isSubMenuOpen: false, 
  //     subMenu: [
  //       {
  //         label: 'My Equipment Requests',
  //         image: 'assets/images/icons/SVGs/request_for_items.svg',
  //         roles: ['Admin', 'Requester', 'Line Manager','Store Manager','HOS', 'Store Approver', 'IT Store Manager', 'IT Support'],
  //         route: '/home/allApprovedItRequests',
  //       },
  //       {
  //         label: 'All Equipment Forms',
  //         image: 'assets/images/icons/SVGs/request_for_items.svg',
  //         roles: ['Admin', 'IT Store Manager', 'IT Support'],
  //         route: '/home/allEquipmentForms',
  //       }
  //     ],
  //   },

  //   {
  //     label: 'User',
  //     image: 'assets/images/icons/SVGs/users-group.svg',
  //     roles: ['Admin'],
  //     isSubMenuOpen: false, 
  //     subMenu: [
  //       {
  //         label: 'View Users',
  //         image: 'assets/images/icons/SVGs/request_for_items.svg',
  //         roles: ['Admin'],
  //         route: '/home/viewUsers',
  //       }
  //     ],
  //   },
  //   {
  //     label: 'Reports',
  //     image: 'assets/images/icons/SVGs/file-report.svg',
  //     roles: ['Admin', 'Main Store Manager', 'IT Store Manager'],
  //     isSubMenuOpen: false, 
  //     subMenu: [
  //       {
  //         label: 'All POSM Inventories',
  //         image: 'assets/images/icons/SVGs/request_for_items.svg',
  //         roles: ['Admin', 'Main Store Manager'],
  //         route: '/home/allInventories',
  //         isSubMenuOpen: false,
  //       },
  //       {
  //         label: 'All POSM Requests',
  //         image: 'assets/images/icons/SVGs/request_for_items.svg',
  //         roles: ['Admin', 'Main Store Manager'],
  //         route: '/home/allRequests',
  //         isSubMenuOpen: false,
  //       },
  //       {
  //         label: 'All POSM Disbursements',
  //         image: 'assets/images/icons/SVGs/request_for_items.svg',
  //         roles: ['Admin', 'Main Store Manager'],
  //         route: '/home/allDisbursements',
  //         isSubMenuOpen: false,
  //       },
  //       {
  //         label: 'All IT Requests',
  //         image: 'assets/images/icons/SVGs/request_for_items.svg',
  //         roles: ['Admin', 'Main Store Manager', 'IT Store Manager'],
  //         route: '/home/allITDirectIssues',
  //         isSubMenuOpen: false,
  //       },
  //       {
  //         label: 'Unfulfilled Allocations',
  //         image: 'assets/images/icons/SVGs/request_for_items.svg',
  //         roles: ['Admin', 'Main Store Manager'],
  //         route: '/home/unfulfilledAllocations',
  //         isSubMenuOpen: false,
  //       },
  //     ],
  //   },
  //   {
  //     label: 'Inventories',
  //     image: 'assets/images/icons/SVGs/view_items.svg',
  //     roles: ['Line Manager','HOS', 'Main Store Manager'],
  //     isSubMenuOpen: false, 
  //     subMenu: [
  //       {
  //         label: 'View Inventories',
  //         image: 'assets/images/icons/SVGs/request_for_items.svg',
  //         roles: ['Line Manager','HOS', 'Main Store Manager'],
  //         route: '/home/allInventories',
  //         isSubMenuOpen: false,
  //       }
  //     ],
  //   }

  // ];

  singleMenu: SingleMenu[] = [
    {
      label: 'Dashboard',
      image: 'assets/images/icons/SVGs/layout-dashboard.svg',
      route: '/home/dashboard', 
       roles : ["Admin", "Store Manager", "Approver", "Requester", "Store Approver", "HOS", "Main Store Manager", "Issuer", "IT Support", "IT Store Manager", "CPASD Store Manager", "Head of Unit", "Super Admin", "IT Final Approver", "Line Manager"]

    }   
  ];


  updateFilteredMenuItems(): void {
    this.filteredMenuItems = this.menuItems
      .filter(menu => menu.roles.some(role => this.userRoles.includes(role)))
      .map(menu => ({
        ...menu,
        subMenu: Array.isArray(menu.subMenu)
          ? menu.subMenu.filter(sub =>
              sub.roles.some(role => this.userRoles.includes(role))
            )
          : [],
      }));
  }

  updateFilteredSingleMenu(): void {
    this.filteredSingleMenu = this.singleMenu
      .filter(menu => menu.roles.some(role => this.userRoles.includes(role)));
}
  

  toggleSidebar() {
    this.isOpen = !this.isOpen;
  }

  toggleSubMenu(menuItem: MenuItem): void {
    menuItem.isSubMenuOpen = !menuItem.isSubMenuOpen;
  }
  

  onSubMenuItemClick(subItem: MenuItem) {
    this.activeItem = subItem;
    console.log(`Routing to: ${subItem.route}`);
    this.router.navigate([subItem.route]);
    
    // Collapse all submenus
    this.menuItems.forEach(item => (item.isSubMenuOpen = false));
    this.sidebarService.toggleSidebar(); // Optionally close the sidebar
  }

  isActive(item: any): boolean {
    return this.activeItem === item; 
  }

}