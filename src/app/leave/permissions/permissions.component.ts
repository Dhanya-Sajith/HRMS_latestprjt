import { Component, OnInit } from '@angular/core';
import { ApiCallService } from 'src/app/api-call.service';
import { LoginService } from 'src/app/login.service';
import { FormControl,FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { formatDate } from '@angular/common';



@Component({
  selector: 'app-permissions',
  templateUrl: './permissions.component.html',
  styleUrls: ['./permissions.component.scss']
})
export class PermissionsComponent implements OnInit {
  userSession:any = this.session.getUserSession();
  empcode: any=this.userSession.empcode;
  authorityflg:any =this.userSession.authorityflg;
  level: any=this.userSession.level; 
  name:any=this.userSession.name;  
  desig:any=this.userSession.desig.split('#', 2);       
  desigid = this.desig[0];       
  designame= this.desig[1];  
  
  requestForm: FormGroup;  
  reasonControl = new FormControl();  

  user:string ="team";
  comp_typeid:any=12;
  status_typeid:any=26;
  dept_typeid: any = 1;
  companydata: any;
  deptdata: any;
  statusdata: any;
  date: any;
  empdata: any;
  selectedCompanyid: any=-1;
  selectedDept: any = -1;
  currentPage!: number;
  currentPagePersonal!: number;
 
  selectedCompany: any = -1;
  selectedEmp: any =-1;
  selectedStatus: any=0;
  PermissionData: any;
  totalreq: any;
  totalPages!: number[];
  PermissionDataPersonal: any;
  totalreqPersonal: any;
  totalPagesPersonal!: number[];
  reason!: string;
  StatusCount: any;
  showModal: number=0;
  sessiondata: any;
  session_typeid: any=20;
  selectedsession!: any;
  value_type:any=1;
  permissionlimit: any;
  success!: string;
  failed!: string;
  viewflag: number = 1;
  fromdate!: any;
  todate!: any;
  
  selectedStatusEmp: any=0;
  StatusCountPersonal: any;
  MatrixData: any;
  MatrixDataPersonal: any;
  selectedRequestID: any;
  selectedEmpCode: any;
  Reason!: string;
  filteredCurrentPage: number = 1;
  filteredCurrentPagePersonal: number = 1;
  req_category!: string;
  leavesummary: any;
  leavetype: any=-1;
  sdate = new FormControl();
  edate = new FormControl();
  listdates: any;
  isFormValid: boolean = false;
  searchInput: string = '';
  sessionvalid!: number;
  reqID: any;
  approvelist: any;
  duration!: any;
  Date = new Date();
  firstDay1 = new Date(this.Date.getFullYear(), this.Date.getMonth(), 1);
  lastDay1 = new Date(this.Date.getFullYear(), this.Date.getMonth() + 1, 0);
  pfromdate=this.datepipe.transform(this.firstDay1,"yyyy-MM-dd");
  ptodate=this.datepipe.transform(this.lastDay1,"yyyy-MM-dd");
  leavebalance: any;
  

  constructor(private apicall:ApiCallService,private session:LoginService,private datepipe:DatePipe,private fb: FormBuilder) {
    
    this.requestForm = this.fb.group({
      date: ['', Validators.required],
      session: ['', Validators.required],
      duration: ['', [Validators.required, this.durationValidator.bind(this)]],
      reason: ['', Validators.required]
    });
     
  }

  ngOnInit(): void {

    if(this.authorityflg === 0){
      this.user = 'personal';   
      this.FetchPermissionPersonal();
      this.fetchStatusCountPersonal();
      this.FetchLeaveMatrixDataPersonal();
    }else{
      this.user = 'team';
    }
    
    //company combo box
    this.apicall.listCompany(this.comp_typeid).subscribe((res) => {
      this.companydata=res;
    });
    //Department combo box
    this.apicall.listDepartment(this.dept_typeid).subscribe((res) => {
      this.deptdata=res;     
    }); 
    //Employee combo box
    this.apicall.listEmployee(this.selectedDept,this.selectedCompanyid).subscribe((res) => {
      this.empdata=res;    
    });
    //Status combo box
    this.apicall.listStatus(this.status_typeid).subscribe((res) => {
      this.statusdata=res;     
    });
    //Dates 
    this.apicall.listFromToDates().subscribe((res) => {
      this.date=res[0]; 
      this.fromdate=this.datepipe.transform(this.date.FROM_DATE, "yyyy-MM-dd");
        //alert(JSON.stringify(this.fromdate))
      this.todate=this.datepipe.transform(this.date.TO_DATE, "yyyy-MM-dd");
      this.pfromdate=this.datepipe.transform(this.date.FROM_DATE, "yyyy-MM-dd");
        //alert(JSON.stringify(this.fromdate))
      this.ptodate=this.datepipe.transform(this.date.TO_DATE, "yyyy-MM-dd");
      this.FetchPermission();
      this.fetchStatusCount();
      this.FetchPermissionPersonal();
      this.FetchLeaveMatrixData();
    });
    //list leave session
    this.apicall.listStatus(this.session_typeid).subscribe((res) => {
      this.sessiondata=res;     
    });
    //Permission limit
    this.apicall.displayGeneralData(this.userSession.companycode,this.value_type).subscribe((res) => {
      this.permissionlimit=res[0].DATA_VALUE;
      //alert(this.permissionlimit);
    
    });
    this.currentPage = 1; 
    this.currentPagePersonal =1; 
     this.FetchDates();   
  }
  teamselection(user:string){    
    this.user = user;  
    if (this.user === 'personal') {       
      this.viewflag = 0;   
      this.FetchPermissionPersonal();
      this.fetchStatusCountPersonal();
      this.FetchLeaveMatrixDataPersonal();      
    } else {
      this.level = this.userSession.level;
      this.viewflag = 1;
      this.FetchPermission();
    }   
     
   }
   onCompanySelected(selectedCompanyid: any) { 
    this.selectedCompanyid=selectedCompanyid;     
    this.apicall.DepartmentCombo_CompanyWise(selectedCompanyid).subscribe((res) => {
      this.deptdata=res;     
    }); 
    this.filter();
    this.filterStatuscount(); 
    this.apicall.listEmployee(this.selectedDept,this.selectedCompanyid).subscribe((res) => {
      this.empdata=res;    
    });
    
   }
   onDeptSelected(selectedDept:any){ 
    this.selectedDept = selectedDept; 
    this.apicall.EmployeefilterComboData(selectedDept,this.selectedCompanyid).subscribe((res) => {
      this.empdata=res;    
      });
      this.filter();
      this.filterStatuscount();
        
   }
   onEmpSelected(selectedEmp:any){
    this.selectedEmp = selectedEmp;  
    this.filter(); 
    this.filterStatuscount(); 
    
   }
   onStatSelected(value:any){
    this.selectedStatus=value;  
    this.filter();   
   }
   onStatSelectedEmp(value:any){
    //alert(value);
    this.selectedStatusEmp=value;  
    this.filterPersonal(); 
   }
   selectreason(value:string){
    this.Reason=value;
   }
   onsessionSelected(value:string){
     this.selectedsession=value;
     
   }
   FetchPermission() {    
    // alert(this.empcode)
    // alert(this.selectedStatus)
    // alert(this.viewflag)    
    // alert(this.fromdate);
    // alert(this.todate)
    this.apicall.FetchPermissionRequest(this.empcode,this.selectedStatus,this.viewflag,this.fromdate,this.todate).subscribe((res) => {
    this.PermissionData = res; 
    this.totalreq=this.PermissionData.length;       
    const totalPages = Math.ceil(this.totalreq / 10);
    this.totalPages = Array(totalPages).fill(0).map((_, index) => index + 1);  
    console.log(JSON.stringify(this.PermissionData));
  });
}
FetchPermissionPersonal() { 
    // alert(this.empcode)
    // alert(this.selectedStatus)
    // alert(this.viewflag)    
   //alert(this.pfromdate);
     //alert(this.ptodate)
    this.viewflag=0;
  this.apicall.FetchPermissionRequest(this.empcode,this.selectedStatus,this.viewflag,this.pfromdate,this.ptodate).subscribe((res) => {
  this.PermissionDataPersonal = res; 
  this.totalreqPersonal=this.PermissionDataPersonal.length;       
  const totalPagesPersonal = Math.ceil(this.totalreqPersonal / 10);
  this.totalPagesPersonal = Array(totalPagesPersonal).fill(0).map((_, index) => index + 1);  
  console.log(JSON.stringify(this.PermissionDataPersonal));
});
}
filter(){

  if( this.fromdate > this.todate){
    (<HTMLInputElement>document.getElementById("openModalButton")).click();
    this.showModal = 2;
    this.failed = "Please Correct the Dates";
  }else{
    const data={
      company:this.selectedCompanyid,
      department:this.selectedDept,
      emp_code:this.selectedEmp,
      fromdate:this.fromdate,
      todate:this.todate,
      status: this.selectedStatus,
      authority:this.empcode
    }  
    //alert(JSON.stringify(data))
     this.apicall.FetchPermissionRequest_Filter(data).subscribe((res) => {
      this.PermissionData=res;
      console.log(JSON.stringify(this.PermissionData)) 
      this.totalreq=this.PermissionData.length;       
      const totalPages = Math.ceil(this.totalreq / 10);
      this.totalPages = Array(totalPages).fill(0).map((_, index) => index + 1);  
      const lastPage = this.totalPages[this.totalPages.length - 1];    
        if(this.currentPage>lastPage){      
          this.currentPage = 1;
        }   
    });
  }
   }
   filterPersonal(){

     this.apicall.FetchPermissionRequest(this.empcode,this.selectedStatusEmp,this.viewflag,this.pfromdate,this.ptodate).subscribe((res) => {
      this.PermissionDataPersonal=res;
      console.log(JSON.stringify(this.PermissionDataPersonal)) 
      this.totalreqPersonal=this.PermissionDataPersonal.length;       
      const totalPagesPersonal = Math.ceil(this.totalreqPersonal / 10);
      this.totalPagesPersonal = Array(totalPagesPersonal).fill(0).map((_, index) => index + 1);  
      const lastPage = this.totalPagesPersonal[this.totalPagesPersonal.length - 1];    
        if(this.currentPagePersonal>lastPage){      
        this.currentPagePersonal = 1;
        }
    });
  
   }
   fetchStatusCount(){
    const data={
      viewflag:this.viewflag,
      emp_code:this.empcode,
      fromdate:this.fromdate,
      todate:this.todate,
      absent_category:"P"
      
    }  
    //alert(JSON.stringify(data))
     this.apicall.FetchStatusCounts_Leave(data).subscribe((res) => {
      this.StatusCount=res;
      console.log(JSON.stringify(this.StatusCount));     
      
    });
   }
   fetchStatusCountPersonal(){
    const data={
      viewflag:this.viewflag,
      emp_code:this.empcode,
      fromdate:this.pfromdate,
      todate:this.ptodate,
      absent_category:"P"
      
    }  
    //alert(JSON.stringify(data))
     this.apicall.FetchStatusCounts_Leave(data).subscribe((res) => {
      this.StatusCountPersonal=res;
      console.log(JSON.stringify(this.StatusCountPersonal));     
      
    });
   }
   filterStatuscount(){    
    const data={
      absent_category:"P",
      company:this.selectedCompanyid,
      department:this.selectedDept,
      emp_code:this.selectedEmp,
      fromdate:this.fromdate,
      todate:this.todate,      
      authority:this.empcode
    }  
    //alert(JSON.stringify(data))
     this.apicall.FetchStatusCounts_LeaveFilter(data).subscribe((res) => {
      this.StatusCount=res;
      console.log(JSON.stringify(this.StatusCount))    
      
    });
   }
   filterStatuscountPersonal(){   
    const data={
      viewflag:this.viewflag,
      emp_code:this.empcode,
      fromdate:this.pfromdate,
      todate:this.ptodate,
      absent_category:"P"
    }  
    //alert(JSON.stringify(data))
     this.apicall.FetchStatusCounts_Leave(data).subscribe((res) => {
      this.StatusCountPersonal=res;
      console.log(JSON.stringify(this.StatusCountPersonal)) 
     });
   }
   FetchLeaveMatrixData(){   
    const data={
      viewflag:this.viewflag,
      emp_code:this.empcode,
      fromdate:this.fromdate,
      todate:this.todate      
    }  
    //alert(JSON.stringify(data))
     this.apicall.FetchLeaveMatrixData(data).subscribe((res) => {
      this.MatrixData=res;
      console.log(JSON.stringify(this.MatrixData)) 
     });
   }
   FetchLeaveMatrixDataPersonal(){   
    const data={
      viewflag:this.viewflag,
      emp_code:this.empcode,
      fromdate:this.pfromdate,
      todate:this.ptodate      
    }  
    //alert(JSON.stringify(data))
     this.apicall.FetchLeaveMatrixData(data).subscribe((res) => {
      this.MatrixDataPersonal=res;
      console.log(JSON.stringify(this.MatrixDataPersonal)) 
     });
   }
   validateForm() {
      
    if (this.requestForm.valid){
    this.isFormValid = true;
    }
    else{
      this.markFormGroupTouched(this.requestForm);
      this.durationValidator(this.duration);
    }
}
   addRequest(){   
      
    if (this.requestForm.valid) {
      const dateControl = this.requestForm.get('date');      
      const durationControl = this.requestForm.get('duration');
      const ReasonControl = this.requestForm.get('reason');
      
    if (dateControl && durationControl && ReasonControl) {  
    const data = {
      empcode:this.empcode,
      availed_date: dateControl.value,
      permission_duration: durationControl.value,
      permission_session:this.selectedsession,
      reason: ReasonControl.value, 
      };
      //alert(JSON.stringify(data))
     this.apicall.AddLeavePermission(data).subscribe((res) => {  
      //alert(JSON.stringify(res))  
      if(res.Errorid==1){
        this.showModal = 1;
        this.success='Request saved successfully!';
        this.fetchStatusCountPersonal();
        
        //alert(this.showModal)  
        
      }
      else{
          this.showModal = 2; 
          this.failed='Failed!';     
      }
   
       this.FetchPermissionPersonal(); 
       this.filterPersonal();
       this.requestForm.reset(); 
       this.requestForm.get('session')?.setValue(""); 
                 
       
    
    });
  }
  } else {    
    this.markFormGroupTouched(this.requestForm);   
  }
}
markFormGroupTouched(formGroup: FormGroup) {
  Object.values(formGroup.controls).forEach(control => {
    control.markAsTouched();
  });
}   
durationValidator(control: FormControl): { [key: string]: any } | null {
  this.duration = control.value;
  if (this.duration && this.duration > this.permissionlimit) {
    return { 'exceedsLimit': true };
  }
  if(this.duration){
  const [hours, minutes] = this.duration.split(':').map(Number); 
  const totalMinutes = (hours * 60) + minutes;

  if (!isNaN(totalMinutes) && totalMinutes < 15) {
    return { durationLessThan15Minutes: true };  
  }
  }
  return null;
}

   approve(reqid:any,empcode:any){ 
    const approvedata={
      req_id:reqid,
      empcode:empcode,
      verified_by:this.empcode,
      verified_remarks:'NULL',      
      mflag: 1
    }
    // alert(JSON.stringify(approvedata))
      this.apicall.ApproveRejectLeavePermissions(approvedata).subscribe((res) => {
        // alert(JSON.stringify(res))      
        if(res.Errorid==1){
          this.showModal = 1;
          this.success='Request approved!';
          this.fetchStatusCount();     
         
        }
        else{
          this.showModal = 2;
          this.failed='Failed!';         
        }     
        this.filter();  
        
    });
   }
   setSelectedRequestID(requestID: any,empCode:any) {
    this.selectedRequestID = requestID;
    this.selectedEmpCode = empCode;
    // alert(requestID)
    
}
   reject(reqid:any,reason:string){  
    
    const rejectdata={
      req_id:reqid,
      empcode:this.selectedEmpCode,
      verified_by:this.empcode,
      verified_remarks:reason,      
      mflag: 0
    }
    // alert(JSON.stringify(rejectdata))
      this.apicall.ApproveRejectLeavePermissions(rejectdata).subscribe((res) => {
        // alert(JSON.stringify(res))      
        if(res.Errorid==1){
          this.showModal = 1;
          this.success='Request rejected!';   
          this.fetchStatusCount();  
         
        }
        else{
          this.showModal = 2;
          this.failed='Failed!';         
        }     
        this.filter();          
        this.reasonControl.setValue('');
    });
   }
   
   get pagedPermision() {
    if (!this.PermissionData) {
      return [];  
    }
  
    const pageSize = 10;
    const startIndex = (this.filteredCurrentPage  - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    
    return this.PermissionData.slice(startIndex, endIndex);
  }
  get pagedPermissionEmp() {
    if (!this.PermissionDataPersonal) {
      return [];  
    }
    const pageSize = 10;
    const startIndex = (this.filteredCurrentPagePersonal - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return this.PermissionDataPersonal.slice(startIndex, endIndex);
  }
  previousPage() {
    if (this.filteredCurrentPage > 1) {
      this.filteredCurrentPage--;
    }
  }
  previousPagePersonal() {
    if (this.filteredCurrentPagePersonal > 1) {
      this.filteredCurrentPagePersonal--;
    }
  }
  nextPage() {
    const totalPages = Math.ceil(this.PermissionData.length / 10);
    if (this.filteredCurrentPage < totalPages) {
      this.filteredCurrentPage++;
    }
  }
  nextPagePersonal() {
    const totalPagesPersonal = Math.ceil(this.PermissionDataPersonal.length / 10);
    if (this.filteredCurrentPagePersonal < totalPagesPersonal) {
      this.filteredCurrentPagePersonal++;
    }
  }  
  cancel(reqid:any){  
    //alert(reqid)
    this.req_category = 'P'; 
    this.apicall.CancelRequests(this.empcode,reqid,this.req_category).subscribe((res) => {
      if(res.Errorid==1){
        this.showModal = 1; 
        this.success='Request cancelled!';     
      }
      else{
        this.showModal = 2; 
        this.failed='Failed!';      
      }
      this.FetchPermissionPersonal();
      this.fetchStatusCountPersonal();
      this.filterPersonal();
    });
   }
 
   FetchDates()
   {
     this.apicall.listFromToDates().subscribe(res=>{
       this.listdates = res;
       if(this.listdates.length > 0)
       {
         const listdatesdata = this.listdates[0];
         this.sdate.setValue(formatDate(listdatesdata.FROM_DATE,'yyyy-MM-dd','en'));
         this.edate.setValue(formatDate(listdatesdata.TO_DATE,'yyyy-MM-dd','en'));
       };   
     })
     
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
  clearAddRequest(){
    this.requestForm.reset();   
    this.requestForm.get('session')?.setValue("");    
  }
  clearReject(){
    this.reasonControl.setValue('');
  }
  // Status Approve List
Approvelist(requestID: any){
  this.reqID = requestID
  this.apicall.StatusApproveList(1,this.reqID,'P').subscribe(res=>{
    this.approvelist = res;
  })
}
// Helper function to pad single-digit numbers with leading zero
private pad(num: number): string {
  return num < 10 ? `0${num}` : `${num}`;
}
leavebalancedtl(){
  this.apicall.FetchLeaveBalance(this.empcode).subscribe(res=>{
    this.leavebalance = res;
  })
}
}
