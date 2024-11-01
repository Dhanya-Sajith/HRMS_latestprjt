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
  empcd:any = localStorage.getItem('employee_code');
  grpname:any=this.userSession.grpname;  
  comcode:any=this.userSession.companycode;
  fetchempviewdirectoylist: any;
  hostname:any;
  photo:any;
  ename:any;
  chartUrl: any;
  urlval: any;
  currdate: any;
  
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

  this.apicall.GetCurrentDate(this.comcode).subscribe((res)=>{
    this.currdate=res[0].WORK_DATE;
  
       });


  }
  viewChart()
  {
    var port=window.location.port;
if(port!='')
{
  var hostname = window.location.hostname+':'+window.location.port;
}
else{
  var hostname = window.location.hostname;
}
localStorage.setItem("chrt_empcode",this.empcd);
localStorage.setItem("chrt_company",'MJ');
localStorage.setItem("chrt_ecount",'0');
localStorage.setItem("chrt_dd",this.currdate);
localStorage.setItem("chrt_ename",this.ename);
localStorage.setItem("chrt_viewtp",'0');
localStorage.setItem('chart_api',this.apicall.dotnetapi);
localStorage.setItem("emprole",this.grpname);
this.chartUrl=new URL('http://'+hostname+'/assets/organizationChart.html');
window.location.href = this.chartUrl;
       
  }

  fetchemployeedirView(empcd:any)
  {
    //alert(empcd);
    this.apicall.fetchempviewdirectoylist(empcd).subscribe((res)=>{
    this.fetchempviewdirectoylist=res;
    this.photo=res[0].PHOTO_PATH;
    this.ename=res[0].EMP_NAME;
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
