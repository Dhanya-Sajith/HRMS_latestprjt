import { Component, OnInit } from '@angular/core';
import { ApiCallService } from 'src/app/api-call.service';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/login.service';
import { FormGroup, FormControl, FormArray, FormBuilder, Validators } from '@angular/forms';
import { DatePipe, JsonPipe } from '@angular/common';
import * as feather from 'feather-icons';
import { formatDate } from '@angular/common';


@Component({
  selector: 'app-leave-management',
  templateUrl: './leave-management.component.html',
  styleUrls: ['./leave-management.component.scss']
})
export class LeaveManagementComponent implements OnInit {

  user:string ="team";
  listCompany: any;
  comtypeid=12;
  deptypeid=1;
  stattypeid=26;
  abs_categ='L';
  listDepartment: any;
  listEmployee: any;
  listRegStatus: any;
  listleaveRequest: any;
  tm_fromdate = new FormControl();
  tm_todate = new FormControl();
  pl_fromdate = new FormControl();
  pl_todate = new FormControl();
  reasonControl = new FormControl();

  listdates: any;
  fmdt: any;
  todt: any;

  userSession:any = this.session.getUserSession();
  empcode: any=this.userSession.empcode;
  empid: any=this.userSession.id;
  company: any=this.userSession.companycode;
  level: any=this.userSession.level;
  from_date:any;
  to_date:any;
  LeaveReqEmp: any;
  showModal = 0;
  EmployeeList: any;
  selectedRequestID: any;
  selectedEmpCode: any;
  currentPage: any;
  totalreq: any;
  totalPages:any;
  reason: any;
  Reason!: string;
  matrixdata: any;
  listmatrix: any;
  listleavetypes: any;
  availabledays: any;
  noofleaves = new FormControl();
  lvduration=new FormControl();
  lvsession=new FormControl();
  dur_typeid=19;
  listduration: any;
  LvSession_typeid=20;
  listsession: any;
  dateDiff: any;
  dateDiffinc:any;
  airticketstatus:any;

 reqreasonControl = new FormControl();
 DocFileControl = new FormControl();
 airticket=new FormControl();
 NoofDaysControl=new FormControl();
 costcontrol=new FormControl();
 AirticketDocControl=new FormControl();
 reqleavetype=new FormControl();

  listcountry: any;
  success: any;
  failed: any;
  liscounts: any;

  REQ:any;
  REQ_PRIOR:any;
  REQ_UP:any;
  LEVEL2_APPROVED:any;
  LEVEL2_PRIOR:any;
  LEVEL2_UP:any;
  REJECTED:any;
  REJ_PRIOR:any;
  REJ_UP:any;
  anual:any;
  hidedur_div:any;
  viewflag=1;
  frdt:any;
  tdt:any;
  reqstatus:any;
  listLeavecounts: any;
  filteredCurrentPage: number = 1;
  listleavetype: any;
  lfromdate:any;
  ltodate:any;
  leavesummary: any;
  leavetype: any=-1;
  listleaveRequest_prsnl: any;
  sdate = new FormControl();
  edate = new FormControl();
  reqID: any;
  approvelist: any;
  searchInput: string = '';  
  requestForm: FormGroup;
  isFormValid: boolean=false;
  ReasonControl:any;
  validdate!: string;
  leavetypeControl: any;
  costdoc:any;
  sessaction:any;
  authorityflg:any =this.userSession.authorityflg;
  todayDate=this.datePipe.transform(new Date(), 'yyyy-MM-dd');
  validdates: any;
  leavebalance: any;
  activereqid: any;

  constructor(private fb: FormBuilder,private datePipe: DatePipe,private session:LoginService,private apicall:ApiCallService,private route:Router) { 

    this.requestForm = this.fb.group({
      reqleavetype: ['', Validators.required],
      startdate: ['', Validators.required],
      enddate: ['', Validators.required],
      reqreasonControl: ['', Validators.required],
      NoofDaysControl: ['', Validators.required],

    });
  }

teamselection(user:string){    
  this.user = user;  
  
  if (this.user === 'personal') {   
    this.viewflag = 0;   
     //alert("hai") 
     //alert(this.viewflag)
     this.FetchDates(); 
     this.StatusCounts();
      
  } 
  else {
    this.level = this.userSession.level;
    this.viewflag = 1;
    this.FetchDates();     
  }   
  //this.FetchDates();
 }
 ListDepByComId()
  { 
    const company_code= (<HTMLInputElement>document.getElementById("comname")).value;
    // alert(company_code);
    this.apicall.listdepByComCode(company_code).subscribe(res =>{
    this.listDepartment=res;
    })
  }
  ListEmpByComIdandDep()
  {
    const comp= (<HTMLInputElement>document.getElementById("comname")).value;
    const dep= (<HTMLInputElement>document.getElementById("depname")).value;
    // alert(comp);
    // alert(dep);
    this.apicall.ListEmpByComIdandDep(dep,comp).subscribe(res =>{
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
        this.tm_fromdate.setValue(formatDate(listdatesdata.FROM_DATE,'yyyy-MM-dd','en'));
        this.tm_todate.setValue(formatDate(listdatesdata.TO_DATE,'yyyy-MM-dd','en'));
        this.pl_fromdate.setValue(formatDate(listdatesdata.FROM_DATE,'yyyy-MM-dd','en'));
        this.pl_todate.setValue(formatDate(listdatesdata.TO_DATE,'yyyy-MM-dd','en'));
        this.fmdt =formatDate(listdatesdata.FROM_DATE,'yyyy-MM-dd','en');
        this.todt = formatDate(listdatesdata.TO_DATE,'yyyy-MM-dd','en');       
        this.sdate.setValue(formatDate(listdatesdata.FROM_DATE,'yyyy-MM-dd','en'));
        this.edate.setValue(formatDate(listdatesdata.TO_DATE,'yyyy-MM-dd','en'));
        

      };
      if (this.viewflag==1){
      this.ListLeaveRequests();
      this.MatrixList();
      this.StatusCounts();
      }
    else{
      //alert(this.viewflag);
      this.StatusCounts();
      this.ListLeaveRequests();
      this.MatrixList();      
    }

    })
  }
   ListLeaveRequests()
  {
    if (this.viewflag==1){
    this.frdt= (<HTMLInputElement>document.getElementById("tm_fromdate")).value;
    this.tdt= (<HTMLInputElement>document.getElementById("tm_todate")).value; 
    this.reqstatus=0;
    }
    else{
      this.frdt= (<HTMLInputElement>document.getElementById("pl_fromdate")).value;
      this.tdt= (<HTMLInputElement>document.getElementById("pl_todate")).value; 
      this.reqstatus=0;
      }    
        this.apicall.listLeaveRequest(this.empcode,this.reqstatus,this.viewflag,this.frdt,this.tdt).subscribe((res)=>{
        this.listleaveRequest=res;
        this.listleaveRequest_prsnl=res;   

        if (this.viewflag==1){
        this.totalreq=this.listleaveRequest.length; 
        const totalPages = Math.ceil(this.totalreq /7);
      this.totalPages = Array(totalPages).fill(0).map((_, index) => index + 1); 
      this.currentPage = 1;
        }
        else{
          this.totalreq=this.listleaveRequest_prsnl.length;
          const totalPages = Math.ceil(this.totalreq /7);
          this.totalPages = Array(totalPages).fill(0).map((_, index) => index + 1); 
          this.currentPage = 1;
        }     
      

    })
    //this.MatrixList();
  }

  ListLeaveRequests_Personal()
  {

    //alert(this.viewflag)
    if (this.viewflag==1){
    this.frdt= (<HTMLInputElement>document.getElementById("tm_fromdate")).value;
    this.tdt= (<HTMLInputElement>document.getElementById("tm_todate")).value; 
    this.reqstatus=0;
    }
    else{
      this.frdt= (<HTMLInputElement>document.getElementById("pl_fromdate")).value;
      this.tdt= (<HTMLInputElement>document.getElementById("pl_todate")).value; 
      this.reqstatus= (<HTMLInputElement>document.getElementById("status_prsnl")).value;
      }     
           
         this.apicall.listLeaveRequest(this.empcode,this.reqstatus,this.viewflag,this.frdt,this.tdt).subscribe((res)=>{
        this.listleaveRequest_prsnl=res;        
        //alert(JSON.stringify(res));
        this.totalreq=this.listleaveRequest_prsnl.length;  
      //alert(this.totalreq)     
      const totalPages = Math.ceil(this.totalreq /7);
      this.totalPages = Array(totalPages).fill(0).map((_, index) => index + 1); 
      this.currentPage = 1;

    })
    //this.MatrixList();
  }
  FetchLeaveReq_Filter()
  {
    //alert(this.viewflag);
    const comname= (<HTMLInputElement>document.getElementById("comname")).value;
    const depname= (<HTMLInputElement>document.getElementById("depname")).value;
    const empname= (<HTMLInputElement>document.getElementById("empname")).value;
    const fillstatus= (<HTMLInputElement>document.getElementById("fillstatus")).value;

    if (this.viewflag==1){
      this.frdt= (<HTMLInputElement>document.getElementById("tm_fromdate")).value;
      this.tdt= (<HTMLInputElement>document.getElementById("tm_todate")).value; 
      //this.reqstatus=0;
      }
      else{
        this.frdt= (<HTMLInputElement>document.getElementById("pl_fromdate")).value;
        this.tdt= (<HTMLInputElement>document.getElementById("pl_todate")).value; 
        //this.reqstatus= (<HTMLInputElement>document.getElementById("fillstatus")).value;
        }      
    if( this.frdt > this.tdt){
      (<HTMLInputElement>document.getElementById("openModalButton")).click();
      this.showModal = 2;
      this.failed = "Please Correct the Dates";
    }else{
      const fillData = {
        company: comname,
        department: depname,
        emp_code: empname, 
        status: fillstatus,       
        fromdate: this.frdt,
        todate: this.tdt,
        authority:this.empcode, 
      };
      
      this.apicall.FetchLeaveReq_Filterapi(fillData).subscribe(res=>{
      //alert(JSON.stringify(res));
      this.listleaveRequest=res;
      this.totalreq=this.listleaveRequest.length;        
        const totalPages = Math.ceil(this.totalreq / 7);
        this.totalPages = Array(totalPages).fill(0).map((_, index) => index + 1);
        //this.filteredCurrentPage = Math.min(this.currentPage, totalPages);     
        this.currentPage = 1; 
        
      }) 
    }
  }  
   approve(reqid:any,empcode:any){ 
    
    const approvedata={
      leavereq_id:reqid,
      empcode:empcode,
      verified_by:this.empid,
      verified_remarks: 'null',
      level:this.userSession.level,
      mflag: 1,
    }    
      this.apicall.ApproveRejectLeaveReq(approvedata).subscribe((res) => {      
        if(res.Errorid==1){
          this.showModal = 1;     
          this. ListLeaveRequests(); 
          this.StatusCounts();
          
        }
        else{
          this.showModal = 2;
          this. ListLeaveRequests();   
          this.StatusCounts();       
        }     
        this. ListLeaveRequests();  
        this.StatusCounts();
        
    });
   }

   setSelectedRequestID(requestID: any,empCode:any) {
    this.selectedRequestID = requestID;
    this.selectedEmpCode= empCode;
    
}
 reject(reqid:any,empcode:any,reason:string){ 
  const rejectdata={ 
       leavereq_id:reqid,
      empcode:empcode,
      verified_by:this.empid,
      verified_remarks: reason,
      level:this.userSession.level,
      mflag: 2,
  }
  this.apicall.ApproveRejectLeaveReq(rejectdata).subscribe((res) => {
    if(res.Errorid==1){
      this.showModal = 1;
      this. ListLeaveRequests();  
      this.StatusCounts();   
    }
    else{
      this.showModal = 2;
      this. ListLeaveRequests();  
      this.StatusCounts();    
    }
    this. ListLeaveRequests();
    this.reasonControl.setValue('');
    this.StatusCounts();
  });
 }
 
 get PagedleaveRequest() {
  const pageSize = 7;
  const startIndex = (this.currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  return this.listleaveRequest.slice(startIndex, endIndex);
}

previousPage() {
  if (this.currentPage > 1) {
    this.currentPage--;
  }
}

nextPage() {
  const totalPages = Math.ceil(this.listleaveRequest.length / 7);
  if (this.currentPage < totalPages) {
    this.currentPage++;
  }
}
get PagedleaveRequestPersonal() {
  const pageSize = 5;
  const startIndex = (this.currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  return this.listleaveRequest_prsnl.slice(startIndex, endIndex);
}
previousPagePersonal() {
  if (this.currentPage > 1) {
    this.currentPage--;
  }
}
nextPagePersonal() {
  const totalPages = Math.ceil(this.listleaveRequest_prsnl.length / 5);
  if (this.currentPage < totalPages) {
    this.currentPage++;
  }
}
selectreason(reason:string){
  this.Reason=reason;
  //alert(this.Reason)
}
MatrixList()
{

  //alert("hlo") 
  if (this.viewflag==1){
    this.frdt= (<HTMLInputElement>document.getElementById("tm_fromdate")).value;
    this.tdt= (<HTMLInputElement>document.getElementById("tm_todate")).value; 
    this.reqstatus=0;
    }
    else{
      this.frdt= (<HTMLInputElement>document.getElementById("pl_fromdate")).value;
      this.tdt= (<HTMLInputElement>document.getElementById("pl_todate")).value; 
      this.reqstatus= (<HTMLInputElement>document.getElementById("fillstatus")).value;
      }    
  const matrixjason={ 
  viewflag:this.viewflag,
  reqstatus:this.reqstatus,
   emp_code:this.empcode,
   level:this.userSession.level,
   fromdate: this.frdt,
   todate: this.tdt,
};    
this.apicall.FetchLeaveMatrixData(matrixjason).subscribe(res=>{
  //alert(JSON.stringify(res));
   this.listmatrix=res;   

})
}
MatrixListFilter()
{
  //alert("hlo") 
    const comname= (<HTMLInputElement>document.getElementById("comname")).value;
    const depname= (<HTMLInputElement>document.getElementById("depname")).value;
    const empname= (<HTMLInputElement>document.getElementById("empname")).value;  

    if (this.viewflag==1){
      this.frdt= (<HTMLInputElement>document.getElementById("tm_fromdate")).value;
      this.tdt= (<HTMLInputElement>document.getElementById("tm_todate")).value; 
      //this.reqstatus=0;
      }
      else{
        this.frdt= (<HTMLInputElement>document.getElementById("pl_fromdate")).value;
        this.tdt= (<HTMLInputElement>document.getElementById("pl_todate")).value; 
        //this.reqstatus= (<HTMLInputElement>document.getElementById("fillstatus")).value;
        }    
      

    const matrixData = {
      company: comname,
      department: depname,
      emp_code: empname,       
      fromdate: this.frdt,
      todate: this.tdt, 
      authority:this.empcode,
    };
    //alert(JSON.stringify(fillData));
    this.apicall.FetchLeaveMatrixDataFilter(matrixData).subscribe(res=>{
      //alert(JSON.stringify(res));
       this.listmatrix=res;     
       }) 

}
FetchAvailableLeaves()
{    
  this.noofleaves.setValue("");
const leavetype= (<HTMLSelectElement>  document.getElementById("reqleavetype")).value;
//alert(leavetype);      
      
  if(leavetype=='10')
      this.anual='1';
    else
    this.anual='0';

  this.apicall.FetchAvailableLeaves(this.empcode,leavetype).subscribe((res)=>{
    this.availabledays=res; 
    this.noofleaves.setValue(this.availabledays[0].PERMITTED_DAYS);
    //alert(this.noofleaves) 
     
     
      this.hidedur_div='1';
      this.dateDiff='';
      this.sessaction='0';
      
      (<HTMLInputElement>document.getElementById("startdate")).value='';
      (<HTMLInputElement>document.getElementById("enddate")).value='';
      (<HTMLInputElement>document.getElementById("reqreason")).value='';
      (<HTMLInputElement>document.getElementById("duration")).value='0';
      (<HTMLInputElement>document.getElementById("session")).value='0';
      (<HTMLInputElement>document.getElementById("formFile")).value='';
      (<HTMLInputElement>document.getElementById("departure")).value='0';
      (<HTMLInputElement>document.getElementById("arrival")).value='0';      
      
      this.ReasonControl.setValue('');      
      this.NoofDaysControl.setValue('');
      this.DocFileControl.setValue('');
      this.lvduration.setValue('0');
      this.lvsession.setValue('0');      
      this.airticket.setValue(false); 
      this.airticketstatus=1;   
})
  
}
getDiffDays() {
 // alert("h")
  let startdate = (<HTMLInputElement>document.getElementById("startdate")).value;
  let enddate = (<HTMLInputElement>document.getElementById("enddate")).value;

    const dtStart = new Date(startdate);
    const Dtlast= new Date(enddate);
  
    if(startdate != '' && enddate != ''){

      if( startdate > enddate){
        this.validdate="Please enter valid dates";
        //alert("Please enter valid dates");
        this.dateDiff='';
    }  
    else{
      this.validdate="";
      const leavetype= (<HTMLSelectElement>  document.getElementById("reqleavetype")).value;
       const data = {
        empcode: this.empcode,
        fromdate: startdate,
        todate: enddate, 
        leavetype: leavetype, 
        company:this.company
      };
   // alert(JSON.stringify(data));
        this.apicall.Checkleavepolicy(data).subscribe((res)=>{
      //  alert(res.Errorid);
      
      if(res.Errorid==-2)
      {
        this.validdates='Another active request for the specified period..!'
        this.dateDiff=''
      }
      else if(res.Errorid==-3)
      {
        this.validdates='Another pending request for the same leave type..!'
        this.dateDiff=''
      }
      else if(res.Errorid==-4)
      {
        this.validdates='Cannot Club annual leave with other leave..!'
        this.dateDiff=''
      }
      else if(res.Errorid==-5)
      {
        this.validdates='Cannot apply for leave before last payroll processed date..!'
        this.dateDiff=''
      }
      else if(res.Errorid==-6)
      {
        this.validdates='Maternity leave of 60 calendar days can only be availed together..!'
        this.dateDiff=''
      }
      else if(res.Errorid>=0)
      {
        this.validdates="";
        this.dateDiff=res.Errorid;
       
        if(this.availabledays[0].PERMITTED_DAYS<this.dateDiff)
        {
          this.validdates='Check the available leaves..!'
          this.dateDiff=''
        }
        else{
          //alert(this.dateDiff);
          this.requestForm.controls['NoofDaysControl'].setValue(this.dateDiff);
        }
        this.requestForm.controls['NoofDaysControl'].setValue(this.dateDiff);
        if(this.dateDiff>'1')
       this.hidedur_div='0'
       
      
      else
      this.hidedur_div='1'
      }
     
      else{
        this.dateDiff='';
        this.requestForm.controls['NoofDaysControl'].setValue(this.dateDiff);
      // this.validdates="Validate dates";
    }
      
        })



//this.dateDiff=Math.floor((Date.UTC(Dtlast.getFullYear(), Dtlast.getMonth(), Dtlast.getDate()) - Date.UTC(dtStart.getFullYear(), dtStart.getMonth(), dtStart.getDate()) ) /(1000 *60*60 * 24)+1);
 if(isNaN(this.dateDiff))
 {
  this.dateDiff='';
 }
 
 
}

    }
}
addLeaveRequest()
 {
  //alert("fdf")
  // const doc= (<HTMLInputElement>document.getElementById("duration")).value;
  // let chkdoc=0; 
  // if(this.dateDiff>1 && (this.leavetype==2 ||this.leavetype==3) && doc=='')
  // {
  //   chkdoc=1;
  // }
  
  if (this.requestForm.valid) {
    const startdateControl = this.requestForm.get('startdate');      
    this.leavetypeControl = this.requestForm.get('reqleavetype');
    this.ReasonControl = this.requestForm.get('reqreasonControl');
    const enddateControl = this.requestForm.get('enddate');
  const duration= (<HTMLInputElement>document.getElementById("duration")).value;
  const session= (<HTMLInputElement>document.getElementById("session")).value; 
  const  departure=(<HTMLInputElement>document.getElementById("departure")).value;
  const  arrival=(<HTMLInputElement>document.getElementById("arrival")).value;
  

  if(this.airticket.value==true)
  
    this.airticketstatus=1;
  else
    this.airticketstatus=0;
    //alert(this.leavetypeControl)
    if(this.leavetypeControl && startdateControl && enddateControl && this.ReasonControl){
   const leavereqdata = {    
     emp_code : this.userSession.empcode,
     leavetype:this.leavetypeControl.value,
     leaveduration:duration,
     leavesession:session,
     Leavestart_time:startdateControl.value,
     Leaveend_time:enddateControl.value,
     noofleaves:this.dateDiff,     
     reason:this.ReasonControl.value,
     airticketstatus:this.airticketstatus,
     departureairport:departure,
     arrivalairport:arrival,
     document:this.DocFileControl.value,
   };

  //alert(JSON.stringify(leavereqdata));

  this.apicall.addLeaveReq(leavereqdata).subscribe(res=>{

   //alert(JSON.stringify(res));

   if(res.Errorid>0)
     {
       this.showModal = 1;
       this.success = "Leave Requested Successfully";
       this.ListLeaveRequests_Personal();
       this.upload(res.Errorid,1);
       if(this.airticket.value==true)
       {
        //alert("air")
       this.upload(res.Errorid,2);

       }
     
       this.StatusCounts();
       this.ListLeaveRequests();
      this.ListLeaveRequests_Personal();      
      this.clearaddreq();
          
      
     }
     else if(res.Errorid==-1)
     {
      this.showModal = 2;
      this.failed = "Cannot apply for leave during probation period";
      
      this.ListLeaveRequests_Personal();
      this.StatusCounts();
      this.clearaddreq();
     }
     else if(res.Errorid==-2)
     {
      this.showModal = 2;
      this.failed = "Upload documents for appliying for medical leave more than one day";
      
      this.ListLeaveRequests_Personal();
      this.StatusCounts();+
      this.clearaddreq();
     }
     else if(res.Errorid==-3)
     {
      this.showModal = 2;
      this.failed = "You have to upload document,for appliying for parental leave";
      
      this.ListLeaveRequests_Personal();
      this.StatusCounts();
      this.clearaddreq();
     }
     else if(res.Errorid==-4)
     {
      this.showModal = 2;
      this.failed = "You have to upload document,for appliying continuos sick leave";
      
      this.ListLeaveRequests_Personal();
      this.StatusCounts();
      this.clearaddreq();
     }
     else if(res.Errorid==-6)
     {
      this.showModal = 2;
      this.failed = "Cannot club annual leave and sick leave";
      
      this.ListLeaveRequests_Personal();
      this.StatusCounts();
      this.clearaddreq();
     }
     else
     {
       this.showModal = 2;
       this.failed = "Leave Request Failed";
       
       this.ListLeaveRequests_Personal();
       this.StatusCounts();
       this.clearaddreq();
     }   

  }) 
}
  
} else {    
  this.markFormGroupTouched(this.requestForm);   
}
}
StatusCounts()
{
  //alert(this.viewflag)  
  if (this.viewflag==1){
    this.frdt= (<HTMLInputElement>document.getElementById("tm_fromdate")).value;
    this.tdt= (<HTMLInputElement>document.getElementById("tm_todate")).value;     
  
    }
    else{
      this.frdt= (<HTMLInputElement>document.getElementById("pl_fromdate")).value;
      this.tdt= (<HTMLInputElement>document.getElementById("pl_todate")).value; 
      
      }    
  const countsjason={ 
   emp_code:this.empcode,
   viewflag:this.viewflag,
   fromdate: this.frdt,
   todate: this.tdt,
   absent_category:this.abs_categ,
};    
this.apicall.FetchStatusCounts_Leave(countsjason).subscribe(res=>{
  //alert(JSON.stringify(res));
   this.listLeavecounts=res;
})
}
Checksize(data:any)
{
  const file=data.files[0];
  //alert(file.size);
  // const resultfile="";
  const fsize=file.size/1024/1024;//Convert to mb  
  if(fsize>10)
  {
    alert('File size should not be greater than 10MB');
    data.value=null;
  }
  // this.total = duration++;

}
FetchStatusCounts_LeaveFilter()
{

  //alert("test");

  const comname= (<HTMLInputElement>document.getElementById("comname")).value;
  const depname= (<HTMLInputElement>document.getElementById("depname")).value;
  const empname= (<HTMLInputElement>document.getElementById("empname")).value;
  const fillstatus= (<HTMLInputElement>document.getElementById("fillstatus")).value;  
  if (this.viewflag==1){
    this.frdt= (<HTMLInputElement>document.getElementById("tm_fromdate")).value;
    this.tdt= (<HTMLInputElement>document.getElementById("tm_todate")).value; 
  
    }
    else{
      this.frdt= (<HTMLInputElement>document.getElementById("pl_fromdate")).value;
      this.tdt= (<HTMLInputElement>document.getElementById("pl_todate")).value; 
      
      }

      if( this.frdt > this.tdt){
        (<HTMLInputElement>document.getElementById("openModalButton")).click();
        this.showModal = 2;
        this.failed = "Please Correct the Dates";
      }else{
          const Data = {
            company: comname,
            department: depname,
            emp_code: empname, 
            status: fillstatus,
            fromdate: this.frdt,      
            todate: this.tdt, 
            absent_category:'L',
            authority:this.empcode,
          };

          //alert(JSON.stringify(Data));
          this.apicall.FetchStatusCounts_LeaveFilter(Data).subscribe(res=>{
          //alert(JSON.stringify(res));
          this.listLeavecounts=res;

          }) 
  }
}
cancelLeaveReq(reqid:any){  
  const req_category='L'
this.apicall.CancelRequests(this.empcode,reqid,req_category).subscribe((res) => {
  if(res.Errorid==1){
    this.showModal = 1;
    this.ListLeaveRequests_Personal();  
    this.StatusCounts();    
  }
  else{
    this.showModal = 2;
    this.ListLeaveRequests_Personal(); 
    this.StatusCounts();     
  }
  this. ListLeaveRequests();
  this.ListLeaveRequests_Personal();
  this.StatusCounts();

});
}
clearaddreq(){

      this.airticket.setValue(false); 
      this.airticketstatus=1;  

      this.requestForm.reset();
      this.anual='0';
      this.hidedur_div='1';
      this.dateDiff='';
      this.sessaction='0';
      (<HTMLInputElement>document.getElementById("reqleavetype")).value='0';
      (<HTMLInputElement>document.getElementById("duration")).value='0';
      (<HTMLInputElement>document.getElementById("session")).value='0';
      (<HTMLInputElement>document.getElementById("formFile")).value='';
      (<HTMLInputElement>document.getElementById("departure")).value='0';
      (<HTMLInputElement>document.getElementById("arrival")).value='0';
      
      this.noofleaves.setValue("");
      this.ReasonControl.setValue('');      
      this.NoofDaysControl.setValue('');
      this.DocFileControl.setValue('');
      this.lvduration.setValue('0');
      this.lvsession.setValue('0');    
            
}

  ngOnInit(): void {

        this.currentPage=1;
    
    this.apicall.listCompany(this.comtypeid).subscribe((res)=>{
      this.listCompany=res; 
      })

      this.apicall.listDepartment(this.deptypeid).subscribe((res)=>{
        this.listDepartment=res;
        })
    
        this.apicall.listRegStatus(this.stattypeid).subscribe((res)=>{
        this.listRegStatus=res;
        })

        this.apicall.listallEmployee().subscribe(res =>{
          this.listEmployee=res;
          
        })
        this.apicall.listLeaveTypes().subscribe((res)=>{
          this.listleavetype=res;
         // alert(JSON.stringify(res));
          })
          this.apicall.LeaveDuration(this.dur_typeid).subscribe((res)=>{
          this.listduration=res;          
          //alert(JSON.stringify(res));
          })
          this.apicall.LeaveSession(this.LvSession_typeid).subscribe((res)=>{
          this.listsession=res;          
            //alert(JSON.stringify(res));
            })
            this.apicall.CountryDetails().subscribe((res)=>{
              this.listcountry=res;          
                //alert(JSON.stringify(res));
                })
                this.anual='0';
                this.reqstatus=0; 
                this.costdoc='0';   
                this.airticketstatus='1';  
                this.sessaction='0';       
      
     this.FetchDates();
    //  this.fetchleavesummary();
     if(this.authorityflg == 0){
      this.user = 'personal';
      this.viewflag=0;
      this.StatusCounts();
       this.ListLeaveRequests();
      this.ListLeaveRequests_Personal();
    }else{
      this.user = 'team';
    }
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


upload(reqid:any,flag:any)
{
 // alert("Gfgf")
  let input:any;
  if(flag=1)
  {
     input=document.getElementById("formFile");
     const fdata = new FormData();
     this.onFileSelect(input,reqid);
  }
  if(flag=2)
  {    
    input=document.getElementById("airformFile");
    const fdata = new FormData();
     this.onFileSelect(input,reqid);
  }
    
}
onFileSelect(input:any,reqid:any) {
  
   if (input.files && input.files[0]) {
     
    const fdata = new FormData();
   
    fdata.append('filesup',input.files[0]);
    //alert(JSON.stringify(fdata))
   // alert("before")
    this.apicall.Uploadleavedoc(fdata,reqid).subscribe((res)=>{
      const result=res;
     // alert("hj");
      if(res==0)
      { 
        this.showModal = 2;
       this.failed = "Leave document uploading failed";
      }
      
    })

  }
}
Approvelist(requestID: any){
  
  this.reqID = requestID
  this.apicall.StatusApproveList(1,this.reqID,'L').subscribe(res=>{
    this.approvelist = res;
  })
}
validateForm() {
      
  if (this.requestForm.valid){
  this.isFormValid = true;
  }
  else{
    this.markFormGroupTouched(this.requestForm);
    //this.durationValidator(this.duration);
  }
}
markFormGroupTouched(formGroup: FormGroup) {
  Object.values(formGroup.controls).forEach(control => {
    control.markAsTouched();
  });
} 
enable(){ 
  //alert(this.airticket.value)
  if(this.airticket.value==null||this.airticket.value==false){  
    this.airticketstatus=0;     
  }
  else
    this.airticketstatus=1; 
}
sessionaction(){
  //alert(this.lvduration.value);
  if(this.lvduration.value==1)
       this.sessaction='1'
      else
      this.sessaction='0'
}
leavebalancedtl(){
  this.apicall.FetchLeaveBalance(this.empcode).subscribe(res=>{
    this.leavebalance = res;
  })
}

ActivereqID(reqid:any){
  this.activereqid = reqid;
}

} 
  