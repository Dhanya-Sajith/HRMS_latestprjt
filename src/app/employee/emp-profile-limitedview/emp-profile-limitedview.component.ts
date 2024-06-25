import { Component,HostListener,OnInit } from '@angular/core';
import { ApiCallService } from 'src/app/api-call.service';
import { DatePipe } from '@angular/common';
import { LoginService } from 'src/app/login.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AirticketApproveComponent } from 'src/app/leave/airticket-booking/airticket-booking.component';


@Component({
  selector: 'app-emp-profile-limitedview',
  templateUrl: './emp-profile-limitedview.component.html',
  styleUrls: ['./emp-profile-limitedview.component.scss']
})
export class EmpProfileLimitedviewComponent implements OnInit {

 
  userSession:any = this.session.getUserSession();
  empcode: any=this.userSession.empcode;
  level:any=this.userSession.level;  
  grpname:any=this.userSession.grpname;  
  empcd = localStorage.getItem('employee_code');

  hostname:any;
  nomineelist: any;
  assetlist: any;
  educationlist: any;
  certificationllist: any;
  worklist: any;
  contactlist: any;
  documentlist: any;
  salarylist: any;
  allowancelist: any;
  basiclist: any;
  reportesslist: any;
  reportees_count: any;
  lanuagelist: any;
  mapper:any[] = [];
  listvalues: any;
  latest: any;
  empcodes: any;

  gradeids:any;
  desig:any=this.userSession.desig.split('#', 2); 
  designame:any= this.desig[0];  
  dispbasicdet: any;
  employeeId: any;
  urlval: any;
  famlist: any;
  famsts: any;
  gradevw: any;


  constructor(private router: ActivatedRoute,private route: Router,private session:LoginService,private apicall:ApiCallService,private datePipe:DatePipe) {

    
   }

  ngOnInit(): void {

  // alert(this.empcd);
  // alert(this.designame);

  //this.fetchbasicdetails(this.empcd);

  this.hostname=this.apicall.dotnetapi;

  // if(this.empcd!="" && this.empcd != null)
  // {
  //     this.empcodes=this.empcd;
  // }
  // else
  // {
  //   this.empcodes=this.empcode;
  // }

  const url = this.router.snapshot.url.join('/');
  //alert(url);
  this.urlval=url;
 // alert( this.urlval);

  // if(url=='employee_profile_view')
  // {
  //   this.empcodes=this.empcode;
    
  // }
  if(url=='profile_limited_view')
  {
    this.empcodes=this.empcd;
  }


  if(url=='profile_limited_view')
  {
    this.gradevw=0;
  }
  // else if(url=='emp_profile_view_from_directory')
  // {
  //   this.gradevw=1;
  // }



   this.BasicDetails();
    this.ContactDetails();
    this.ReportessDetails();
    this.LanuageDetails();
    this.EducationDetails();
    this.fetchbasicdetails();

    
  }
  Idpassing(emp_code:any)
{
  
  localStorage.setItem('employee_code', emp_code);
  
}
  ProfessionalDetails(){
    this.EducationDetails();
    this.WorkDetails();
    this.CertificationDetails();
  }

  NomineeDetails(){

      this.apicall.listnomineedetails(this.empcodes).subscribe(res=>{
        this.nomineelist = res;
      })
      
  }

  AssetDetails(){

 
    this.apicall.listassetsdetails(this.empcodes).subscribe(res=>{
      this.assetlist = res;
    })
 

  }

  EducationDetails(){

   
    this.apicall.fetchperfesionaldtls(this.empcodes,1).subscribe(res=>{
      this.educationlist = res;
      this.latest = this.educationlist[0].CATEGORY_NAME;
    })
  }

  WorkDetails(){
   
    this.apicall.fetchperfesionaldtls(this.empcodes,2).subscribe(res=>{
      this.worklist = res;
    })

  }

  CertificationDetails(){
   
    this.apicall.fetchperfesionaldtls(this.empcodes,3).subscribe(res=>{
      this.certificationllist = res;
    })
    


  }

  LanuageDetails(){

   
    this.apicall.fetchperfesionaldtls(this.empcodes,4).subscribe(res=>{
      this.lanuagelist = res;
      for (let i = 0; i < this.lanuagelist.length; i++) {
        this.mapper.push(this.lanuagelist[i].CATEGORY_NAME);
      }
    })
  
  }

  ContactDetails(){

  
    this.apicall.listcontactdetails(this.empcodes).subscribe(res=>{
      //alert(JSON.stringify(res))
      this.contactlist = res;
    })

  }

  DocumentDetails(){

   
    this.apicall.listAlldocumentdetails(this.empcodes).subscribe(res=>{
      this.documentlist = res;
    })

  }

  FamDetails()
  {
    this.apicall.listAllfamilydetails(this.empcodes).subscribe(res=>{
      this.famlist = res;
    })

    this.apicall.listAllfamilysts(this.empcodes).subscribe(res=>{
      this.famsts = res;
    })

  }



  SalaryDetails(){

   
    this.apicall.listsalarydetails(this.empcodes).subscribe(res=>{
      this.salarylist = res;
    })
    this.AllowanceDetails();
    

  }

  AllowanceDetails(){
   
    this.apicall.listAllowance(this.empcodes).subscribe(res=>{
      this.allowancelist = res;
    })
    
  }



  BasicDetails()
  {
    

      this.apicall.EmployeeProfileBasicdetails(this.empcodes).subscribe(res=>{
       
        this.basiclist = res;
       // alert(JSON.stringify(res))

      })
 

  }
  


  ReportessDetails(){
   // alert("Fdf");
    this.apicall.FetchReportess(this.empcodes).subscribe(res=>{
      this.reportesslist = res;
      this.reportees_count=this.reportesslist.length; 
    })
  }

  fetchbasicdetails()
{
  
  //const nonactiveEmp= (<HTMLInputElement>document.getElementById("nonactiveEmp")).value;
  
  this.apicall.EmployeeProfileBasicdetails(this.empcodes).subscribe((res)=>{
  this.dispbasicdet=res;
  this.gradeids=this.dispbasicdet[0].GRADE_ID;

  //alert(this.gradeids);

  })

}

  // @HostListener('window:beforeunload', ['$event'])
  // unloadHandler(event: Event): void {
  //  //localStorage.clear();
  //  localStorage.removeItem('employee_code');
  // }



  navigateToEditProfile(code:any)
  {

   localStorage.setItem('empl_code', code);
   localStorage.setItem('myprof', 'fromdirectory');

  }

  ViewFiles(fpath:any,doctype:any,upflag:any)
{
  
  const url = this.router.snapshot.url.join('/');
  this.urlval=url;

  if(url=='employee_profile_view')
  {
    let fileurl=this.apicall.GetEmployeeDocs(this.empcode,doctype,upflag,fpath);
    //alert(fileurl)
    let link = document.createElement("a");
    link.setAttribute("href", fileurl);
    link.setAttribute("target", "_blank");
            link.setAttribute("download", "");
            document.body.appendChild(link)
;
            link.click();
            document.body.removeChild(link)

  }
  else if(url=='emp_profile_view_from_directory')
  {
    let fileurl=this.apicall.GetEmployeeDocs(this.empcd,doctype,upflag,fpath);
    //alert(fileurl)
    let link = document.createElement("a");
    link.setAttribute("href", fileurl);
    link.setAttribute("target", "_blank");
            link.setAttribute("download", "");
            document.body.appendChild(link)
;
            link.click();
            document.body.removeChild(link)

  }
  else if(url=='profile_limited_view')
  {
    let fileurl=this.apicall.GetEmployeeDocs(this.empcd,doctype,upflag,fpath);
    //alert(fileurl)
    let link = document.createElement("a");
    link.setAttribute("href", fileurl);
    link.setAttribute("target", "_blank");
            link.setAttribute("download", "");
            document.body.appendChild(link)
;
            link.click();
            document.body.removeChild(link)

  }

}



}
