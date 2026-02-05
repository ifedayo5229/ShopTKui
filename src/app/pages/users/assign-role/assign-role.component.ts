import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RolesService } from 'src/app/services/roles/roles.service';
import { RoleDto } from 'src/app/models/RoleDto';
import { StoreLocationService } from 'src/app/services/store-location/store-location.service';
import { StoreLocation } from 'src/app/models/store-location';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-assign-role',
  templateUrl: './assign-role.component.html',
  styleUrls: ['./assign-role.component.scss']
})
export class AssignRoleComponent {
  isLoading = false; // Simulating loading state
  currentStep: 'roles' | 'locations' = 'locations';
  selectedRole: number | null = null; 
  selectedLocation: number = 0; 
  roles: RoleDto[] = [];
  roleId: number = 0;
  locations: StoreLocation[] = []; 

  constructor(private rolesService: RolesService, private storeLocationService: StoreLocationService, private toastr: ToastrService,
    public dialogRef: MatDialogRef<AssignRoleComponent>, @Inject(MAT_DIALOG_DATA) public data: { userId: string; }

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
        this.locations = response.responseData;
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

      if(this.selectedLocation == 0)
        {
          this.toastr.error('No selected store');
          return;
        }

    const role = this.roles.find(
                  r => r.roleName?.toLowerCase() === 'store manager'
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

   this.rolesService.assignRoleToUser(addRolerequest).subscribe({
    next: (data) => {
      if (data.responseCode === "00") {
        // Handle successful response
        console.log("A role has been added succesfully");
        this.toastr.success('Role added successfully');
              setTimeout(() => {
                this.dialogRef.close();
                window.location.reload();
              }, 1000);

      } else {
        // Handle error response
        console.log("Adding a role is  not successful");
        this.toastr.success('Role assigned successful');
      }
    },
    error: (error: any) => {
      console.log(error.error);
      this.toastr.error('Error assigning role');
    }
   })
  }

  cancel(): void {
    console.log('Dialog canceled');
    // Logic to close the dialog
  }


}
