import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { RoleDto } from 'src/app/models/RoleDto';
import { RolesService } from 'src/app/services/roles/roles.service';

@Component({
  selector: 'app-assign-roles',
  templateUrl: './assign-roles.component.html',
  styleUrls: ['./assign-roles.component.scss']
})
export class AssignRolesComponent {
  roles: RoleDto[] = [];
  selectedRoles: number[] = [];
  isLoading: boolean = true;

  constructor(
    private rolesService: RolesService,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<AssignRolesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { userId: string, userRoles: RoleDto[] }
  ) {
    this.fetchRoles();
  }

  fetchRoles(): void {
    debugger
    this.rolesService.getRoles().subscribe({
      next: (response) => {
        this.roles = response.map(role => ({
          ...role,
          disabled: this.data.userRoles.some(userRole => userRole.roleName === role.roleName) 
                                              || role.roleName == 'Store Manager'
                                              || role.roleName == 'IT Store Manager'
        })) || [];
        // this.roles = response;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching roles:', error);
        this.isLoading = false;
      }
    });
  }

  saveRoles(){
    debugger;
    const selectedRoles = this.selectedRoles
    const userId = this.data.userId;


    if(selectedRoles.length === 0){
      this.toastr.error('No selected role');
      // this.dialogRef.close();
      return;
    }
    
    const roleRequest: any = {
      userId: userId,
      roleIds: selectedRoles,
    };
    debugger
   
      debugger
      // Assign multiple roles
      this.rolesService.assignRolesToUser(roleRequest).subscribe({
        next: (data) => {
          if (data.responseCode === "00") {
            this.toastr.success('Role assigned successful');
            this.dialogRef.close();
          location.reload();

          } else {
            console.log("Unable to add roles");
            // this.notification.sendMessage({
            //   message: 'Try again',
            //   type: NotificationType.error
            // });
          }
        },
        error: (error: any) => {
          console.log(error.error);
          this.toastr.error('Error assigning role(s)');
        }
      });

  }

  cancel(): void {
    console.log('Dialog canceled');
    // Logic to close the dialog
  }
}
