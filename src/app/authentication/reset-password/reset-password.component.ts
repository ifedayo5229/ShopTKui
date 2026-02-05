import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';


@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent {
  visible:boolean = true;
  changetype:boolean = true;
  resetPasswordForm: FormGroup;

  currentPassword: string = '';
  newPassword: string = '';
  confirmPassword: string = '';

  constructor(private fb: FormBuilder, private router: Router) 
  { 
    this.resetPasswordForm = this.fb.group({
      currentPassword: ['', [Validators.required]], 
      newPassword: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]]
    }); 
  }

     

  

  onLogin() {
    debugger;
    
  }

  viewpassword(){
    this.visible = !this.visible;
    this.changetype = !this.changetype;
  }

  backTologin(){
    this.router.navigate(['']);
  }

}

