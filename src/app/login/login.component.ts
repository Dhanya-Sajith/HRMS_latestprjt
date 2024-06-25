import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiCallService } from 'src/app/api-call.service';
import { LoginService } from '../login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements AfterViewInit,OnInit {
  @ViewChild('username')
  username!: ElementRef<HTMLInputElement>;  
  resetForm: FormGroup; 
  resetForm2: FormGroup;
  showAlert: any=0;
  message!: string;
  showOldPasword: any; 
  showreset: boolean=false;   
  Username: any;
  Password: any;  
  validoldpassword: number=0;
  disablesubmit: boolean=false;
  constructor(private route: Router, private fb: FormBuilder,private apicall:ApiCallService,private session:LoginService) {
    this.resetForm = this.fb.group({
      oldpassword: ['', Validators.required],
      newpassword: ['', Validators.required],
      confirmpassword: ['', Validators.required]
    });
    this.resetForm2 = this.fb.group({     
      newpassword2: ['', Validators.required],
      confirmpassword2: ['', Validators.required]
    });
  }
  ngAfterViewInit() {
    this.username.nativeElement.focus();
  }
  ngOnInit(): void {
    
    const loginMessage = this.session.getMessage();
          
    if (loginMessage) {    
      this.logout();

    } 
localStorage.clear();
  }

  onSubmit() {
    //alert('dsd')
    if (!this.Username||!this.Password) {
      this.showAlert=2;
      this.message='Please provide login credentials!';
      return;  
    }       
    else{  
      this.showAlert=0;
      this.message='';           
      const formData = {
        empcode: this.Username,
        password: this.Password
      };
       //alert(JSON.stringify(formData))
      this.apicall.Login(formData).subscribe((res) => {
        // alert(JSON.stringify(res));
        if(res.MSG=='1'){      
                            
            this.showAlert=1;  
            this.message='Login Successful! Redirecting...';          
                                
           
              setTimeout(()=>{                           
                this.session.setUserSession(res.id,res.empcode,res.name,res.companycode,res.desig,res.email,res.dept,res.level,res.authorityflg,res.otaccess,res.gradeid,res.grpname,res.profilepic);
                this.route.navigate(['DashboardEmp']);
              }, 300);
            
            }else if(res.MSG=='2'){
              this.showAlert=2;
              this.message='Password mismatch!';            
            }else if(res.MSG=='3'){
              this.showAlert=2;
              this.message='Your password has been reset!';
              this.disablesubmit=true;               
            }
            else{
              this.showAlert=2;
              this.message='Invalid user!'; 
              this.disablesubmit=true;             
            }
          });
        
      } 
    }
  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
    });
  }
  logout(){    
    
    this.message=this.session.getMessage();
    if(this.message.includes('session has expired'))
    {
      this.showAlert=2; 
    }
    else{
      this.showAlert=1;   

    setTimeout(() => {
      this.showAlert = null;
      this.message ='';
    }, 5000);
    }
  }
  checkPasswordNull2(){
    if (!this.Username) {  
      //this.showAlert=2;
      //this.message='Please enter username!';        
    }else{     
      this.showAlert=0;
      this.message='';
      const formData = {
        empcode: this.Username       
      };
    this.apicall.CheckPasswordNull(formData).subscribe((res) => {
    //   alert(JSON.stringify(res));
      if(res==0){
        this.showAlert=2;
        this.message='Your password has been reset!'; 
        this.disablesubmit=true;    
      }else if(res==-1){
        this.showAlert=2;
        this.message='Invalid username!'; 
        this.disablesubmit=true;
        // setTimeout(() => {
        //   this.showAlert = null;
        //   this.message ='';
        // }, 5000);    
      }
      else{
        this.disablesubmit=false;   
      }
    });
  }
  }
  CheckPasswordNull(){            
    if (!this.Username) {  
      this.showAlert=2;
      this.message='Please enter username!';        
    }else{     
      this.showAlert=0;
      this.message='';
      const formData = {
        empcode: this.Username       
      };
    this.apicall.CheckPasswordNull(formData).subscribe((res) => {
       //alert(JSON.stringify(res));
      if(res==1){                    
          this.showreset=true;         
          this.showOldPasword=1;           
        
      }else if(res==0){
        this.showreset=true;                
        this.showOldPasword=0;
              
      }else{
        this.showAlert=2;
        this.message='Invalid username!'; 
        setTimeout(() => {
          this.showAlert = null;
          this.message ='';
        }, 5000);    
      }
    });
  }
  }
  resetPassword(){     
      if (this.resetForm.valid) {        
        const oldpassword = this.resetForm.get('oldpassword');
        const newpassword = this.resetForm.get('newpassword');
        const confirmpassword = this.resetForm.get('confirmpassword');            
    
        if (oldpassword && newpassword && confirmpassword && this.validoldpassword==1) {
          if(newpassword.value!=confirmpassword.value){
            this.showAlert=2;  
            this.message='Password Mismatch!';    
          }else{            
          const formData = {
            empcode: this.Username,
            password: confirmpassword.value
          };
          //  alert(JSON.stringify(formData))
          this.apicall.ChangePassword(formData).subscribe((res) => {
              //alert(JSON.stringify(res));
            if(res.Errorid=='1'){ 
                                
                this.showAlert=1;  
                this.message='Your password has been changed!';            
                setTimeout(()=>{                         
                  window.location.reload();
                }, 400);
              
            }else{
              this.showAlert=2;
              this.message='Failed!';            
            }
          });
        }
      }
      
     }
     else {
         this.markFormGroupTouched(this.resetForm);
      }
    }
    resetPassword2(){    
      if (this.resetForm2.valid) {   
       
        const newpassword = this.resetForm2.get('newpassword2');
        const confirmpassword = this.resetForm2.get('confirmpassword2');            
    
        if (newpassword && confirmpassword) {
          if(newpassword.value!=confirmpassword.value){
            this.showAlert=2;  
            this.message='Password Mismatch!';    
          }else{            
          const formData = {
            empcode: this.Username,
            password: confirmpassword.value
          };
          //  alert(JSON.stringify(formData))
          this.apicall.ChangePassword(formData).subscribe((res) => {
              //alert(JSON.stringify(res));
            if(res.Errorid=='1'){        
                                
                this.showAlert=1;  
                this.message='Your password has been changed!';            
                setTimeout(()=>{                         
                  window.location.reload();
                }, 400);
              
            }else{
              this.showAlert=2;
              this.message='Failed!';            
            }
          });
        }
      }
      
     }
     else {
         this.markFormGroupTouched(this.resetForm2);
      }
    }
    
    ValidateOldPassword(){
      const oldpassword = this.resetForm.get('oldpassword');
      if(oldpassword && oldpassword.value.trim() !== ''){
      const formData = {
        empcode: this.Username,
        password: oldpassword.value
      };
      this.apicall.ValidateOldPassword(formData).subscribe((res) => {
         //alert(JSON.stringify(res));
      if(res=='0'){    
                         
          this.showAlert=2;  
          this.message='Incorrect password!'; 
          this.resetForm.controls['newpassword'].disable(); 
          this.resetForm.controls['confirmpassword'].disable();             
        
      }
      else{
          this.validoldpassword=1;
          this.showAlert=0;  
          this.message=''; 
          this.resetForm.controls['newpassword'].enable(); 
          this.resetForm.controls['confirmpassword'].enable();
      }
    });
    }
    }
    forgotPassword(){      
      this.showAlert=2;  
      this.message='Please contact HR!'; 
      // setTimeout(() => {
      //   this.showAlert = null;
      //   this.message ='';
      //   window.location.reload();
      // }, 2000); 
      
    }
    cancel(){
      window.location.reload();
    }
    
    
  }
    
  
    
