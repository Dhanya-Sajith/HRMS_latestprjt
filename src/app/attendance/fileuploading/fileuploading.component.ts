import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiCallService } from 'src/app/api-call.service';
import { LoginService } from 'src/app/login.service';
import { ViewChild } from '@angular/core';

@Component({
  selector: 'app-fileuploading',
  templateUrl: './fileuploading.component.html',
  styleUrls: ['./fileuploading.component.scss']
})
export class FileuploadingComponent implements OnInit {
  @ViewChild('SuccessRecordModal')
  private modal!: { open: () => void; };
  userSession:any = this.session.getUserSession();
  empcode: any=this.userSession.empcode;
  showModal = 0;
  success:any="";
  failed:any="";
  inputfield: any;
  showProgressBar = false;
  showsuccessmodal: number=0;
  validation!: string;
  fileuploadForm: any =  FormGroup;
  isFormValid: boolean=false;
  submitted = false;
  constructor(private apicall:ApiCallService,private session:LoginService,private fb: FormBuilder) {
   
   }
   get f() { return this.fileuploadForm.controls; }
  ngOnInit(): void {
    this.fileuploadForm = this.fb.group({     
      myFile: ['', [Validators.required]],
      
    });
  }
  
  upload()
  {
    const input=document.getElementById("myFile");    
    const fdata = new FormData();   
    this.onFileSelect(input);
    
  } 

  onFileSelect(input:any) {   
    this.submitted = true;
    if (this.fileuploadForm.invalid) {
      return;
  }
 
  if(this.submitted){   
    if (input.files && input.files[0]) {
      const fdata = new FormData();
      fdata.append('postedFile',input.files[0]);
      this.showProgressBar = true;
      
      this.apicall.Uploadbiometricdata(fdata,this.empcode).subscribe((res)=>{
     //  alert(res)
        if(res>=0)
        {
         
          this.showModal = 1; 
          this.success = "Biometric data uploaded successfully,Attendance processed & updated "+ res +" records";
          //alert(this.success)
         // this.modal.open();
          this.showProgressBar = false;          
          this.inputfield = document.getElementById("myFile");
          this.inputfield.selectedIndex = 0;
        }
        else{          
          this.showModal = 2;
          this.failed = "Uploading failed!";
          //this.modal.open();
        //  alert(this.failed)
          this.showProgressBar = false;         
          
        }
      //  console.log(JSON.stringify(res));
      })

    }
  }
   
  }
 
  onImageChangeFromFile($event:any)
  {
      if ($event.target.files && $event.target.files[0]) {
        let file = $event.target.files[0];
        console.log(file);
          if(file.type === "CSV") {
            console.log("correct");
           
          }
          else {
            //call validation
            this.fileuploadForm.reset();
            this.fileuploadForm.controls["myFile"].setValidators([Validators.required]);
            this.fileuploadForm.get('myFile').updateValueAndValidity();
          }
      }
  } 
}
