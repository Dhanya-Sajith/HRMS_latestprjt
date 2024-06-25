import { Component, OnInit } from '@angular/core';
import { ApiCallService } from 'src/app/api-call.service';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/login.service';
import { JsonPipe, formatDate } from '@angular/common';
import { FormControl,FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-businesstrip',
  templateUrl: './businesstrip.component.html',
  styleUrls: ['./businesstrip.component.scss']
})
export class BusinesstripComponent implements OnInit {
  

  user:any;
  userSession:any = this.session.getUserSession();
  authorityflg:any =this.userSession.authorityflg;
  empcode: any=this.userSession.empcode;
  empid:any =this.userSession.id;
  level: any=this.userSession.level;
  Compname=12;
  listCompany:any;
  deptypeid = 1;
  listDepartment: any;
  listdates: any;
  fromdate = new FormControl();
  todate = new FormControl();
  fromdatePrsnl = new FormControl();
  todatePrsnl = new FormControl();
  reasonControl= new FormControl();
  startdate:any;
  enddate:any;
  dateDiff:any;
  fmdt:any;
  todt:any;
  statustypeid = 26;
  liststatus: any;
  listBussinesstrip: any;
  reason!: string;
  listEmployee: any;
  currentPage: any;
  totalreq: any;
  totalPages:any;
  showModal = 0; 
  selectedRequestID: any;
  selectedEmpcode: any;
  listBussinesstrip_personal: any;
  listcompoffmatrix: any;
  viewflag:any;
  listleaveCounts: any;
  listleaveCountsPersonal: any;
  failed!: string;
  success!: string;
  leavesummary: any;
  leavetype: any=-1;
  sdate = new FormControl();
  edate = new FormControl();
  searchInput: string = '';
  reqID: any;
  approvelist: any;
  PersonalReqData: any;
  requestForm: FormGroup; 
  isFormValid:boolean=false;
  leavebalance: any;
  validdate: any;
  leaveNo = new FormControl();

  constructor(private session:LoginService,private apicall:ApiCallService,private route:Router,private fb: FormBuilder) { 
    this.requestForm = this.fb.group({
      startdate: ['', Validators.required],
      enddate: ['', Validators.required],
      reqreason: ['', Validators.required],
      leaveNo: ['', Validators.required],
    });
  }


  ngOnInit(): void {
    if(this.authorityflg === 0){
      this.user = 'personal';
      this.BusinessTripDataPersonal();
    }else{
      this.user = 'team';
    }

    this.currentPage = 1; 
    this.ListCompany();
    this.ListDepartments();
    this.ListEmployees();
    this.ListStatus();
    this.FetchDates();
    this.FetchDatesPersonal();
    
  }

  selection(user:string){ 
    this.user = user;
    if (this.user === 'personal') {
      this.BusinessTripDataPersonal();
      this.FetchStatusCounts_Personal()
      
    } else {
      this.level = this.userSession.level; 
    }      
   }

  ListCompany()
  {
    this.apicall.listCompany(this.Compname).subscribe((res)=>{
      this.listCompany=res;
    })
  }

  ListDepartments()
  {
  
    this.apicall.listDepartment(this.deptypeid).subscribe((res)=>{
      this.listDepartment=res;
      })
  }
  ListEmployees()
  {
  
    this.apicall.listallEmployee().subscribe((res)=>{
      this.listEmployee=res;
      })
  }
  FetchDates()
{
  this.apicall.listFromToDates().subscribe(res=>{
    this.listdates = res;
    if(this.listdates.length > 0)
    {
      const listdatesdata = this.listdates[0];
      this.fromdate.setValue(formatDate(listdatesdata.FROM_DATE,'yyyy-MM-dd','en'));
      this.todate.setValue(formatDate(listdatesdata.TO_DATE,'yyyy-MM-dd','en'));
      this.fmdt =formatDate(listdatesdata.FROM_DATE,'yyyy-MM-dd','en');
      this.todt = formatDate(listdatesdata.TO_DATE,'yyyy-MM-dd','en');
      this.sdate.setValue(formatDate(listdatesdata.FROM_DATE,'yyyy-MM-dd','en'));
      this.edate.setValue(formatDate(listdatesdata.TO_DATE,'yyyy-MM-dd','en'));
      // alert()
      // this.apicall.FetchLeaveSummary(-1,this.sdate.value,this.edate.value,this.empcode).subscribe(res=>{
      //   this.leavesummary = res;
      // })
    };
    this.BusinessTripDataTeam();
    this.FetchStatusCounts_Team();

  })
  
}

  ListStatus()
  {
    this.apicall.listStatus(this.statustypeid).subscribe((res)=>{
      this.liststatus=res;
      })
  }

BusinessTripDataTeam()
  { 
    const reqstatus=0;
    this.viewflag = 1;
      this.apicall.ListBusinessTripLevelwise(this.empcode,reqstatus,this.viewflag,this.fmdt,this.todt).subscribe((res)=>{
      this.listBussinesstrip=res;

      this.totalreq=this.listBussinesstrip.length;      
      const totalPages = Math.ceil(this.totalreq / 5);
      this.totalPages = Array(totalPages).fill(0).map((_, index) => index + 1); 
    })
  }
FetchStatusCounts_Team()
{
  const fillsData = {
    viewflag: 1,
    emp_code: this.userSession.empcode,
    fromdate: this.fmdt, 
    todate: this.todt, 
    absent_category:"B",
    reqstatus:0,
  };

    this.apicall.FetchStatusCounts_Leave(fillsData).subscribe((res)=>{
    this.listleaveCounts=res;
    })
}
FetchStatusCounts_TeamFilter()
{
  const comname= (<HTMLInputElement>document.getElementById("Compname")).value;
  const depname= (<HTMLInputElement>document.getElementById("dept")).value;
  const empname= (<HTMLInputElement>document.getElementById("empname")).value;
  const reqstatus= (<HTMLInputElement>document.getElementById("reqstatus")).value;
  const fromdate= this.fromdate.value;
  const todate= this.todate.value
  if( fromdate > todate){
    (<HTMLInputElement>document.getElementById("openModalButton")).click();
    this.showModal = 2;
    this.failed = "Please Correct the Dates";
  }else{
    const compData = {
      company: comname,
      department: depname,
      emp_code: empname, 
      status: reqstatus,
      fromdate: fromdate,      
      todate: todate, 
      absent_category:'B',
      authority:this.empcode,
    };
    this.apicall.FetchStatusCounts_LeaveFilter(compData).subscribe(res=>{
    this.listleaveCounts=res;
    }) 
  }
}

  selectreason(reason:string){
    this.reason=reason;
  }

ListDepByComId()
  { 
    const company_code= (<HTMLInputElement>document.getElementById("Compname")).value;
    this.apicall.listdepByComCode(company_code).subscribe(res =>{
    this.listDepartment=res;
    this.BusinessTripFilterTeam();
    })
  }

  ListEmpByComIdandDep()
  {
    const comp= (<HTMLInputElement>document.getElementById("Compname")).value;
    const dep= (<HTMLInputElement>document.getElementById("dept")).value;
    this.apicall.ListEmpByComIdandDep(dep,comp).subscribe(res =>{
    this.listEmployee=res;
    this.BusinessTripFilterTeam();
    })
  }
  BusinessTripFilterTeam()
  {
    const comp= (<HTMLInputElement>document.getElementById("Compname")).value;
    const dep= (<HTMLInputElement>document.getElementById("dept")).value;
    const emp = (<HTMLInputElement>document.getElementById("empname")).value;
    const reqststs = (<HTMLInputElement>document.getElementById("reqstatus")).value;

    if( this.fromdate.value > this.todate.value){
      (<HTMLInputElement>document.getElementById("openModalButton")).click();
      this.showModal = 2;
      this.failed = "Please Correct the Dates";
    }else{

    const data = {
      company:comp,
      department: dep,
      emp_code: emp,
      status:reqststs,
      fromdate: this.fromdate.value,
      todate: this.todate.value, 
      authority:this.empcode,
      };
      
      this.apicall.ListBusinessTripFilter(data).subscribe(res =>{
        this.listBussinesstrip=res;
      this.totalreq=this.listBussinesstrip.length;    
      const totalPages = Math.ceil(this.totalreq / 5);
      this.totalPages = Array(totalPages).fill(0).map((_, index) => index + 1); 
      })
    }
  }

  get PagedListBusinessTrip() {
    const pageSize = 5;
    const startIndex = (this.currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return this.listBussinesstrip.slice(startIndex, endIndex);
  }
  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }
  nextPage() {
    const totalPages = Math.ceil(this.listBussinesstrip.length / 5);
    if (this.currentPage < totalPages) {
      this.currentPage++;
    }
  }

  approve(reqid:any,Empcode:any){ 
    
    const approvedata={
      req_id:reqid,
      empcode:Empcode,
      verified_by:this.empcode,
      verified_remarks: 'null',
      mflag: 1,
    }
      this.apicall.ApproveRejectBusinesstripReq(approvedata).subscribe((res) => {      
        if(res.Errorid==1){
          this.showModal = 1;     
          this.BusinessTripFilterTeam();
          this.FetchStatusCounts_Team();
        }
        else{
          this.showModal = 2;   
          this.BusinessTripFilterTeam();     
        }  
            
    });
  }

Reject(requestID:any,Empcode:any,Reason:string ){  
  const rejectdata={
    req_id:requestID,
    empcode:Empcode,
    verified_by:this.empcode,
    verified_remarks: Reason,
    mflag: 2
  }
  this.apicall.ApproveRejectBusinesstripReq(rejectdata).subscribe((res) => {
    if(res.Errorid==1){

      this.showModal = 1;  
      this.BusinessTripFilterTeam();
          this.FetchStatusCounts_Team();    
    }
    else{
      this.showModal = 2;  
      this.BusinessTripFilterTeam();    
    }
   
    this.reasonControl.setValue('');
  });
 }

getDiffDays() {
  let startdate = (<HTMLInputElement>document.getElementById("startdate")).value;
  let enddate = (<HTMLInputElement>document.getElementById("enddate")).value;

  if(startdate != '' && enddate != ''){

    if( startdate > enddate){
      this.validdate="Please enter valid dates";
      this.dateDiff='';
      this.requestForm.controls['leaveNo'].setValue(this.dateDiff);
  }else{
    this.validdate="";
    const dtStart = new Date(startdate);
    const Dtlast= new Date(enddate);
    this.dateDiff=Math.floor((Date.UTC(Dtlast.getFullYear(), Dtlast.getMonth(), Dtlast.getDate()) - Date.UTC(dtStart.getFullYear(), dtStart.getMonth(), dtStart.getDate()) ) /(1000 *60  *60 * 24)+1);
    this.requestForm.controls['leaveNo'].setValue(this.dateDiff);
  } 
}
}

validateForm() {
  if (this.requestForm.valid){
  this.isFormValid = true;
  }
  else{
    this.markFormGroupTouched(this.requestForm);
  }
}

AddRequests()
{

  if (this.requestForm.valid) {
    const inTimeControl = this.requestForm.get('startdate');      
    const outTimeControl = this.requestForm.get('enddate');
    const remarksControl = this.requestForm.get('reqreason');

    if (inTimeControl && outTimeControl && remarksControl) { 
      const data = {
        emp_code:this.empcode,
        start_date: inTimeControl.value,
        end_date: outTimeControl.value,
        reason: remarksControl.value,   
        
      };
    
      this.apicall.AddBussinessTripRequest(data).subscribe(res =>{
      if(res.Errorid==1)
        {
          this.showModal = 1; 
          this.success = "Business Trip Saved Successfully";
          this.BusinessTripFilterPersonal(); 
          this.FetchStatusCounts_Personal();
          this.Clear();
          
        }
        else
        {
          this.showModal = 2;
          this.failed = "Failed";
        }   
  
        this.requestForm.reset();
  
     })
    }
    }
    else {    
      this.markFormGroupTouched(this.requestForm);   
    }

  }


markFormGroupTouched(formGroup: FormGroup) {
  Object.values(formGroup.controls).forEach(control => {
    control.markAsTouched();
  });
}

CancelRequest(Empcode:any,requestID:any)
{
  const req_category='B'
  this.apicall.CancelRequests(Empcode,requestID,req_category).subscribe((res) => {
    if(res.Errorid==1){
      this.showModal = 1; 
      this.success='Request cancelled!'; 
      this.BusinessTripFilterPersonal(); 
      this.FetchStatusCounts_Personal();   
    }
    else{
      this.showModal = 2; 
      
      this.failed='Failed!';      
    }  
  });
}
BusinessTripFilterPersonal()
  {
    const reqstatus=(<HTMLInputElement>document.getElementById("prsnlstatus")).value;
    if( this.fmdt > this.todt){
      (<HTMLInputElement>document.getElementById("openModalButton")).click();
      this.showModal = 2;
      this.failed = "Please Correct the Dates";
    }else{
      this.viewflag = 0;
        this.apicall.ListBusinessTripLevelwise(this.empcode,reqstatus,this.viewflag,this.fmdt,this.todt).subscribe((res)=>{
        this.listBussinesstrip_personal=res;

        this.totalreq=this.listBussinesstrip_personal.length;      
        const totalPages = Math.ceil(this.totalreq / 3);
        this.totalPages = Array(totalPages).fill(0).map((_, index) => index + 1); 
        })
    }
  }
  get PagedListBusinessTripPersonal() {
    const pageSize = 5;
    const startIndex = (this.currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return this.listBussinesstrip_personal.slice(startIndex, endIndex);
  }
  previousPagePersonal() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }
  nextPagePersonal() {
    const totalPages = Math.ceil(this.listBussinesstrip_personal.length / 5);
    if (this.currentPage < totalPages) {
      this.currentPage++;
    }
  }
  BusinessTripDataPersonal()
  { 
    const reqstatus=0;
    this.viewflag = 0;
      this.apicall.ListBusinessTripLevelwise(this.empcode,reqstatus,this.viewflag,this.fmdt,this.todt).subscribe((res)=>{
      this.listBussinesstrip_personal=res;
      this.totalreq=this.listBussinesstrip_personal.length;      
      const totalPages = Math.ceil(this.totalreq / 5);
      this.totalPages = Array(totalPages).fill(0).map((_, index) => index + 1); 
    })
  }
  FetchDatesPersonal()
{
  this.apicall.listFromToDates().subscribe(res=>{
    this.listdates = res;
   
    if(this.listdates.length > 0)
    {
      const listdatesdata = this.listdates[0];
      this.fromdatePrsnl.setValue(formatDate(listdatesdata.FROM_DATE,'yyyy-MM-dd','en'));
      this.todatePrsnl.setValue(formatDate(listdatesdata.TO_DATE,'yyyy-MM-dd','en'));
      this.fmdt =formatDate(listdatesdata.FROM_DATE,'yyyy-MM-dd','en');
      this.todt = formatDate(listdatesdata.TO_DATE,'yyyy-MM-dd','en');
    };
    this.BusinessTripDataPersonal();
    this.FetchStatusCounts_Personal();
  })
}
FetchStatusCounts_Personal()
{
  const fillsData = {
    viewflag: 0,
    emp_code: this.userSession.empcode,
    fromdate: this.fmdt, 
    todate: this.todt, 
    absent_category:"B",
    reqstatus:0,
  };

    this.apicall.FetchStatusCounts_Leave(fillsData).subscribe((res)=>{
    this.listleaveCountsPersonal=res;
    })
}
FetchStatusCounts_PersonalFilter()
{
  const comname= -1;
  const depname= -1;
  const empname= this.empcode;
  const reqstatus= (<HTMLInputElement>document.getElementById("prsnlstatus")).value;
  const fromdate= this.fromdatePrsnl.value;
  const todate= this.todatePrsnl.value
  if( fromdate > todate){
    (<HTMLInputElement>document.getElementById("openModalButton")).click();
    this.showModal = 2;
    this.failed = "Please Correct the Dates";
  }else{
    const compData = {
      company: comname,
      department: depname,
      emp_code: empname, 
      status: reqstatus,
      fromdate: fromdate,      
      todate: todate, 
      absent_category:'B',
      authority:this.empcode,
    };
    this.apicall.FetchStatusCounts_LeaveFilter(compData).subscribe(res=>{
    this.listleaveCountsPersonal=res;
    }) 
  }
}



FetchLeaveMatrixData()
{ 
  const matrixjason={ 
  viewflag :1,
   emp_code:this.empcode,
   reqstatus:0,
   fromdate: this.fromdate.value,
   todate: this.todate.value,
};    
this.apicall.FetchLeaveMatrixData(matrixjason).subscribe(res=>{
   this.listcompoffmatrix=res;
  
})
}
 
   setSelectedvalues(requestID: any,empcode: any) {

    this.selectedRequestID = requestID;
    this.selectedEmpcode = empcode;

}

leavesummarystatus(value:any){
  this.leavetype=value; 
  
  this.fetchleavesummary();
 }

fetchleavesummary(){
    // this.apicall.FetchLeaveSummary(this.leavetype,this.sdate.value,this.edate.value,this.empcode).subscribe(res=>{
    //   this.leavesummary = res;
    // })
}
Clear()
{
  (<HTMLInputElement>document.getElementById("startdate")).value='';
  (<HTMLInputElement>document.getElementById("enddate")).value='';
  (<HTMLInputElement>document.getElementById("leaveNo")).value='';
  (<HTMLInputElement>document.getElementById("reqreason")).value='';
}
// Status Approve List
Approvelist(requestID: any){
  this.reqID = requestID
  this.apicall.StatusApproveList(1,this.reqID,'B').subscribe(res=>{
    this.approvelist = res;
  })
}
leavebalancedtl(){
  this.apicall.FetchLeaveBalance(this.empcode).subscribe(res=>{
    this.leavebalance = res;
  })
}
}
