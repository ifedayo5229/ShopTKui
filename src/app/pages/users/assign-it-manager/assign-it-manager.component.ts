import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RolesService } from 'src/app/services/roles/roles.service';
import { RoleDto } from 'src/app/models/RoleDto';
import { StoreLocationService } from 'src/app/services/store-location/store-location.service';
import { StoreLocation } from 'src/app/models/store-location';
import { ToastrService } from 'ngx-toastr';
import { isNullOrUndef } from 'chart.js/dist/helpers/helpers.core';

@Component({
  selector: 'app-assign-it-manager',
  templateUrl: './assign-it-manager.component.html',
  styleUrls: ['./assign-it-manager.component.scss']
})
export class AssignItManagerComponent {
  isLoading = false; // Simulating loading state
  currentStep: 'roles' | 'locations' = 'locations';
  selectedRole: number | null = null; 
  selectedLocation: number = 0; 
  roles: RoleDto[] = [];
  roleId: number = 0;
  roleSelected!: RoleDto; 
  locations: StoreLocation[] = []; 

  constructor(private rolesService: RolesService, private storeLocationService: StoreLocationService, private toastr: ToastrService,
    public dialogRef: MatDialogRef<AssignItManagerComponent>, @Inject(MAT_DIALOG_DATA) public data: { userId: string; }

  ) {
    this.fetchRoles();
    this.fetchStoreLocations();
   }



  fetchRoles(): void {
    debugger
    this.rolesService.getRoles().subscribe({
      next: (response) => {
        // this.roles = response.responseData?.map(role => ({
          // ...role,
          // disabled: this.data.userRoles.some(userRole => userRole.id === role.id) // Disable already assigned roles
        // })) || [];
        this.roles = response;
        console.log(this.roles);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching roles:', error);
        this.isLoading = false;
      }
    });
  }

  fetchStoreLocations(): void {
    this.storeLocationService.getallStoreLocations().subscribe({
      next: (response) => {
        // Filter locations to only include those where storeManagerEmail is empty or null
        // this.locations = response.responseData.filter(location => !location.storeManagerEmail);
        this.locations = response.responseData.filter(
                          (location: StoreLocation) => location.functionName === 'FINANCE & IT'
                        );
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching store locations:', error);
        this.isLoading = false;
      }
    });
  }

  goToLocations(): void {
    if (this.selectedRole !== null) {
      this.currentStep = 'locations';
    } else {
      alert('Please select a role.');
    }
  }

  goToRoles(): void {
    this.currentStep = 'roles';
  }

  
  saveSelections(): void {
    debugger;

    console.log(this.locations)

    if(this.selectedLocation == 0)
      {
        this.toastr.error('No selected store');
        return;
      }

    const role = this.roles.find(
                  r => r.roleName?.toLowerCase() === 'it store manager'
                );

                if (role) {
                  this.roleId = role.id;
                } else {
                  console.log('Role not found.');
                }
    
   const addRolerequest = {
    userId: this.data.userId,
    roleId: this.roleId,
    storeId: this.selectedLocation 
   }

   this.rolesService.assignItManagerRoleToUser(addRolerequest).subscribe({
    next: (data) => {
      if (data.responseCode === "00") {
        // Handle successful response
        this.toastr.success('Role added successfully');
              setTimeout(() => {
                this.dialogRef.close();
                window.location.reload();
              }, 1000);

      } else {
        // Handle error response
        console.log("Adding a role is  not successful");
        // this.notification.sendMessage({
        //   message: 'Try again',
        //   type: NotificationType.error
        // });
      }
    },
    error: (error: any) => {
      console.log(error.error);
      // Handle error
      // this.notification.sendMessage({
      //   message: 'Try again',
      //   type: NotificationType.error
      // });
      
    }
   })
  }

  cancel(): void {
    console.log('Dialog canceled');
    // Logic to close the dialog
  }


}
