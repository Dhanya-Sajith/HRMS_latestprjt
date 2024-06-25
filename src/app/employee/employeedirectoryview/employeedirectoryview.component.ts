import { Component, HostListener, OnInit  } from '@angular/core';
import { ApiCallService } from 'src/app/api-call.service'; 
import { ActivatedRoute,Router } from '@angular/router';
import { LoginService } from 'src/app/login.service';
import { FormGroup, FormControl, FormArray, FormBuilder, Validators } from '@angular/forms';
import { DatePipe, JsonPipe } from '@angular/common';
import * as feather from 'feather-icons';
import { formatDate } from '@angular/common';


@Component({
  selector: 'app-employeedirectoryview',
  templateUrl: './employeedirectoryview.component.html',
  styleUrls: ['./employeedirectoryview.component.scss']
})
export class EmployeedirectoryviewComponent implements OnInit {

  userSession:any = this.session.getUserSession();
  empcd = localStorage.getItem('employee_code');
  grpname:any=this.userSession.grpname;  
  fetchempviewdirectoylist: any;
  hostname:any;
  photo:any;
  urlval: any;
  constructor(private router: ActivatedRoute,private session:LoginService,private apicall:ApiCallService,private route:Router,private fb: FormBuilder,private datePipe: DatePipe) { }

  ngOnInit(): void {
     
   this.hostname=this.apicall.dotnetapi;
   const url = this.router.snapshot.url.join('/');
   //alert(url);
   this.urlval=url;
   //alert( this.urlval);
 
   if(url=='employee_profile_directory_view')
   {
    this.empcd=this.empcd;
   }

  this.fetchemployeedirView(this.empcd);


  }

  fetchemployeedirView(empcd:any)
  {
    //alert(empcd);
    this.apicall.fetchempviewdirectoylist(empcd).subscribe((res)=>{
    this.fetchempviewdirectoylist=res;
    this.photo=res[0].PHOTO_PATH;
   // alert(this.photo);
    const parts = this.photo.split('/');
    //alert(parts[6]);
    const imgCtrl=<HTMLImageElement>document.getElementById("emp_pic");

    if(parts[6]=="")
    {
      //alert("dsd")
    //  alert(imgCtrl)
      this.hostname="assets/styles/img/";
      this.photo="Admin 2.png";
        //imgCtrl.src="assets/styles/img/alert.png";
    }
    else
    {
      this.photo=res[0].PHOTO_PATH;
      
    }

    })
    
  }

  navigateToEditProfile(code:any)
  {

   localStorage.setItem('empl_code', code);
   localStorage.setItem('myprof', 'fromdirectory');

  }

  // exit()
  // {
  //   alert("DF");
  //   localStorage.clear();
  // }

//   @HostListener('window:beforeunload', ['$event'])
//  unloadHandler(event: Event): void {
//   localStorage.clear();
//  }

}
