import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppConstants } from 'src/app/models/app-constants';
import { ErrorResponse } from 'src/app/models/error-response';
import { LoginRequest } from 'src/app/models/login-request';
import { LoginResponseData } from 'src/app/models/login-response-data';
import { NotificationType } from 'src/app/models/notification.message';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { SharedService } from 'src/app/services/shared/shared.service';
import { TokenService } from 'src/app/services/token/token.service';
import { UserService } from 'src/app/services/user/user.service';
import { ToastrService } from 'ngx-toastr';
import { RequestCode } from 'src/app/models/requestCode';
import { AuthService } from 'src/app/services/auth/auth.service';


@Component({
  selector: 'app-authenticate',
  templateUrl: './authenticate.component.html',
  styleUrls: ['./authenticate.component.scss']
})
export class AuthenticateComponent {
  isRemberMeChecked=false;
  visible:boolean = true;
  changetype:boolean = true;
  loginForm: FormGroup;

  //added this
  codeRequestForm: FormGroup;
  isSubmitting: boolean = false;
  email: string = '';
  submitDisabled: boolean = false;
  isLoginFailed = false;
  loginPage: boolean = true;
  token?: string;
  currentUser: any;

  @Output() emitData = new EventEmitter<LoginResponseData>();

  today = new Date();
  loginRequest: LoginRequest = {
    email: "",
    password: ""
  };

  //added this
  requestCode: RequestCode = {
    email: "",
  };

  

  loginResponseData: LoginResponseData | undefined;
  isLoggedIn = false;

  error: ErrorResponse = { error: '', errorCode: 0 };

  constructor(private fb: FormBuilder, private router: Router, private tokenService: TokenService,
              private notification: NotificationService, private userService: UserService, 
              private sharedService: SharedService, private toastr: ToastrService,
              private authService: AuthService
            ) 
  { 
    this.loginForm = this.fb.group({
      email: ['', [Validators.required]], 
      password: ['', [Validators.required]],
      rememberMe:[]
    }); 
    
    //added this
    this.codeRequestForm = this.fb.group({
      email: ['', [Validators.required]]
    });

  }



  ngOnInit(){
  } 

  async getinfo(){
    debugger
    
    const loginResponse: LoginResponseData = this.tokenService.getInfo();
    var datas = loginResponse.permission;

      this.currentUser = this.tokenService.getInfo(); 
  
      // this.router.navigate(['']).then(() => {window.location.reload()});
      this.router.navigate(['/home/dashboard']).then(() => {window.location.reload()});


      return true; 
    }
  
  stayLoggedIn(){
    debugger;
    if(JSON.parse(localStorage.getItem('isRemberMeChecked')!) !== null)
      {
       // this.name = localStorage.getItem('Name');
        this.isRemberMeChecked = JSON.parse(localStorage.getItem('isRemberMeChecked')!);
      
        if(this.isRemberMeChecked)
        {
          let accessToken = this.tokenService.getSession()?.accessToken;
          if(accessToken!.length>0)
          {
            if (this.tokenExpired(accessToken!)) {
              // token expired
            } else {
              // token valid
            }
            
            let decodedJWT = JSON.parse(window.atob(accessToken!.split('.')[1]));
            let email= decodedJWT.email;
            this.autoLogin(email);
          }
        }
    }
  }

  //When login button is clicked
  onLogin() {
    debugger;
        const remembermeControl = this.loginForm.get('rememberMe');
        const rememberMelogin = remembermeControl?.value as boolean | null;
        if(rememberMelogin){
          this.isRemberMeChecked = true;
            localStorage.setItem('isRemberMeChecked', JSON.stringify(this.isRemberMeChecked));
          }

        const usernameControl = this.loginForm.get('email');
        const passwordControl = this.loginForm.get('password');

      if (usernameControl && passwordControl) {
        const username = usernameControl.value as string | null;
        const password = passwordControl.value as string | null;

        if (username !== null && password !== null) {
          this.loginRequest.email = username;
          this.loginRequest.password = password;
        }
      }

    this.userService.login(this.loginRequest).subscribe({
      next: (data => {
        debugger
        if (data.responseCode == "00") {
          this.toastr.success('Login successful');

          this.loginResponseData = data.responseData;

          this.sharedService.loginResponseData = data.responseData;
          this.tokenService.saveSession(data.responseData);
          this.tokenService.setInfo(data.responseData);
          this.isLoggedIn = true;
          this.isLoginFailed = false;
          AppConstants.UserPermission = data.responseData.permission;
          AppConstants.IsSuperAdmin = data.responseData.profile.isSuperAdmin;
          debugger;

          if (this.loginResponseData.profile.mustChangePassword == true) {
            this.router.navigate(['resetPassword']);
          }
          else {

            debugger;
            if(rememberMelogin){
              this.isRemberMeChecked = true;
           //  localStorage.setItem('Name', credentials.firstName);
              localStorage.setItem('isRemberMeChecked', JSON.stringify(this.isRemberMeChecked));
            }
            else
            {  localStorage.removeItem('isRemberMeChecked');}


            this.router.navigate(['/home/dashboard']).then(() => {window.location.reload()});
          }

        }
        else {
          this.toastr.error(data.message);
        }

      }),
      error: ((error: any) => {
        console.log(error.error);
        debugger;
        this.error = error;
        this.isLoggedIn = false;
        this.isLoginFailed = true;

        this.toastr.error(error.error.message)
        
      })

    });
    
      // this.router.navigate(['/home']);
    
  }

  // For the eye icon toggle in the input box
  viewpassword(){
    this.visible = !this.visible;
    this.changetype = !this.changetype;
  }

  //For navigating to forgot password page.
  forgotPassword(){
    this.router.navigate(['/forgotPassword']);
  }

  private tokenExpired(token: string) {
    const expiry = (JSON.parse(atob(token.split('.')[1]))).exp;
    let result = (Math.floor((new Date).getTime() / 1000)) >= expiry;
    return (Math.floor((new Date).getTime() / 1000)) >= expiry;

  }

  autoLogin(emai:string): void {
    let obt = {
    email:emai
    };
        this.userService.passwordlessSignIn(obt).subscribe({
          next: (data => {
            debugger
            if (data.responseCode == "00") {
              this.notification.sendMessage({
                message: data.message,
                type: NotificationType.success
              });
    
                console.debug(`logged in successfully ${data}`);
    
              this.loginResponseData = data.responseData;
    
              this.sharedService.loginResponseData = data.responseData;
              this.tokenService.saveSession(data.responseData);
              this.tokenService.setInfo(data.responseData);
              this.isLoggedIn = true;
              this.isLoginFailed = false;
              AppConstants.UserPermission = data.responseData.permission;
              AppConstants.IsSuperAdmin = data.responseData.profile.isSuperAdmin;
    
              if (this.loginResponseData.profile.mustChangePassword == true) {
                this.router.navigate(['accountconfirmation']);
              }
              else {
    
                if(this.isRemberMeChecked){
               //  localStorage.setItem('Name', credentials.firstName);
                  localStorage.setItem('isRemberMeChecked', JSON.stringify(this.isRemberMeChecked));
                }
                else
                {  localStorage.removeItem('isRemberMeChecked');}
    
    
                this.router.navigate(['']).then(() => {window.location.reload()});
              }
    
            }
            else {
    
              this.notification.sendMessage({
                message: data.message,
                type: NotificationType.error
              });
    
            }
    
          }),
          error: ((error: any) => {
            console.log(error.error);
            debugger;
            this.error = error;
            this.isLoggedIn = false;
            this.isLoginFailed = true;
    
            this.notification.sendMessage({
              message: error.error.message,
              type: NotificationType.error
            });
          })
    
        });
      }

      //New login implementation starts here

      ngResetForm = this.fb.group({
        Code: ['', [Validators.required,]],
        });

      private domainCheck(email: string): boolean {
        if (email.endsWith('@lafarge.com') || email.endsWith('@holcim.com') || email.endsWith('@geocycle.com') || email.endsWith('@yopmail.com')) { return true }
        return false;
      }

      toggleForm() {
          this.submitDisabled = false;
          this.loginPage = !this.loginPage;
        }

        toggleFormBack() {
          this.loginPage = true;
          this.ngResetForm.get('Code')?.reset();
        }

      getCode() {
        debugger
        this.isSubmitting = true;
        const email = this.codeRequestForm.get('email');
        
        if (email){
          // const username = email.value as string | null;
          const username = email.value ? email.value.trim() : null;

          if (username !== null) {
            this.email = username;
          }
        }
      
        if(!this.domainCheck(this.email)){
          this.toastr.error("Email does not exist")
          this.isSubmitting = false;
          return;
        }   
        
        this.userService.requestLoginCode(this.email).subscribe(
          data => {
            debugger;
            // console.log(data.responseCode);
            // console.log(data);
              if (data.requestSuccessful) {
                debugger;
                this.toggleForm();
                this.isSubmitting = false;
                this.toastr.success('Code request successful');
              } else {
                debugger;
                this.toastr.error(data.message);
                this.isSubmitting = false;
              }
            }, 
          
          error => {
           
            console.error('Error requesting login code', error);
            this.toastr.error(error.error.message);
            this.isSubmitting = false;
          }
        );
      }  
      
      

      verifyCode(): void {
        debugger
        this.isSubmitting = true;
         const codeControl = this.ngResetForm.get('Code');
         this.token = codeControl?.value as string;


         this.userService.validateLoginCode(this.token).subscribe(
          data => {
            debugger;
            // console.log(data.responseCode);
            // console.log(data);
              if (data.requestSuccessful) {

                this.authService.saveSession(data.responseData);
              this.authService.setInfo(data.responseData);
                        this.isLoggedIn = true;
                        this.isLoginFailed = false;
              
                        this.getinfo();
                        this.isSubmitting = false;

                this.toastr.success('Code is valid');
              } else {
                debugger;
                this.toastr.error(data.message);
                this.isSubmitting = false;
              }
            }, 
          
          error => {
           
            console.error('Login Error', error);
            this.toastr.error(error.error.message);
            this.isSubmitting = false;
          }
        );
         
         //this.forgotpassword.Email = code;
        //  this.userService.validateLoginCode(this.token).subscribe({
        //   next: (data => {
        //     debugger
        //     if (data.responseCode == "00") {
        //       this.authService.saveSession(data.responseData);
        //       this.authService.setInfo(data.responseData);
        //                 this.isLoggedIn = true;
        //                 this.isLoginFailed = false;
              
        //                 this.getinfo();
        //                 this.isSubmitting = false;
                   
        //               }
        //     else {
        //       this.isSubmitting = false;
        //       this.notification.sendMessage({
        //         message: data.message,
        //         type: NotificationType.error
        //       });
    
        //     }
    
        //   }),
        //   error: ((error: any) => {
        //     console.log(error.error);
        //     debugger;
        //     this.error = error;
        //     this.isSubmitting = false;
    
        //     this.notification.sendMessage({
        //       message: error.error.message,
        //       type: NotificationType.error
        //     });
        //   })
    
        // });
      }


}

