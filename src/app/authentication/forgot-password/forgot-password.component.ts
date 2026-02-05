import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';


@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {

  forgotPasswordForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router) 
  { 
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required]], 
    }); 
  }

  sendResetMail(){

  }

  backTologin(){
    this.router.navigate(['']);
  }

}

