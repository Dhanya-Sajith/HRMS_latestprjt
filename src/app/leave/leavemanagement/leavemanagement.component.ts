import { Component, OnInit } from '@angular/core';
import { ApiCallService } from 'src/app/api-call.service';
import { LoginService } from 'src/app/login.service';
import { FormGroup, FormControl, FormArray, FormBuilder, Validators } from '@angular/forms';
import { DatePipe, JsonPipe } from '@angular/common';
import { formatDate } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-leavemanagement',
  templateUrl: './leavemanagement.component.html',
  styleUrls: ['./leavemanagement.component.scss']
})
export class LeavemanagementComponent implements OnInit {

  userSession:any = this.session.getUserSession();
  authorityflg:any =this.userSession.authorityflg;
  empcode: any=this.userSession.empcode;
  empid:any =this.userSession.id;
  level: any=this.userSession.level;
  roleid:any =this.userSession.level;
  company: any=this.userSession.companycode;
  empname: any=this.userSession.name;

  user:any = 'personal';
  Activetype: any = 'Leave';
  leavesummary: any;
  leavetype: any = -1;
  listdates: any;
  sdate = new FormControl();
  edate = new FormControl();
  viewflag: any = 0;
  tdt: any;
  frdt: any;
  reqstatus: any;
  listmatrix: any;
  listCompany: any;
  listDepartment: any;
  listEmployee: any;
  listRegStatus: any;
  listleaveRequest: any;
  currentPage=1;
  currentPagePersonal=1;
  searchInput: string='';
  itemsPerPage=10;
  Reason: any;
  leavebalance: any;
  activereqid: any;
  selectedRequestID: any;
  selectedEmpCode: any;
  showModal = 0;
  failed!: string;
  success!: string;
  tm_fromdate: any;
  tm_todate : any;
  fmdt: any;
  todt: any;
  date = new Date();
  mindate = this.datePipe.transform(this.date,"yyyy-MM-dd");
  firstDay1 = new Date(this.date.getFullYear(), this.date.getMonth(), 1);
  lastDay1 = new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0);

  firstDay=this.datePipe.transform(this.firstDay1,"yyyy-MM-dd");
  lastDay=this.datePipe.transform(this.lastDay1,"yyyy-MM-dd");
  status: any = 0;
  emp_code: any = -1;
  department: any= -1;
  companyID: any= -1;
  reqID: any;
  approvelist: any;
  remarks:any;
  Activestyle: any;
  pl_fromdate:any;
  pl_todate:any;
  listpersonal: any;
  pstatus: any = 0;
  requestForm: FormGroup;
  isFormValid: boolean=false;
  validdate!: string;
  validdates: any;
  listleavetype: any;
  listduration: any;
  listsession: any;
  listcountry: any;
  dur_typeid=19;
  LvSession_typeid=20;
  dateDiff: any;
  dateDiffinc:any;
  airticketstatus:any;
  noofleaves = new FormControl();
  lvduration=new FormControl();
  lvsession=new FormControl();
  hidedur_div:any;
  sessaction:any;
  anual:any;
  costdoc:any;

  reqreasonControl = new FormControl();
  DocFileControl = new FormControl();
  airticket=new FormControl();
  NoofDaysControl=new FormControl();
  costcontrol=new FormControl();
  AirticketDocControl=new FormControl();
  reqleavetype=new FormControl();
  availabledays: any;
  ReasonControl: any;
  leavetypeControl: any;

  listcompoffRequest: any;
  listCompoffDates: any;
  compoffdate = new FormControl();
  availeddate = new FormControl();
  reason = new FormControl();
  req_category: any = 'L';
  listBussinesstrip: any;
  BusinesstripForm: FormGroup;
  isBusinessTripFormValid: boolean=false;
  bvaliddate: any;
  bdateDiff: any;
  PermissionDataPersonal: any;
  PermissionForm: FormGroup;
  permissionlimit: any;
  sessiondata: any;
  session_typeid: any=20;
  selectedsession!: any;
  value_type:any=1;
  duration!: any;
  PermissionData: any;
  LEAVE: any;
  COMPOFF: any;
  BUSINESS: any;
  PERMISSION: any;
  leavetypes: any;
  listleaveRequestPersonal: any;
  gender: any;
  probation_period: any;
  DOJ: any;
  ADD: any = 0;
  leave_emp: any = -1;
  data: any; 
  desiredPage: any; 

  constructor(private fb: FormBuilder,private datePipe: DatePipe,private session:LoginService,private apicall:ApiCallService,private route: ActivatedRoute)
   { 
    this.requestForm = this.fb.group({
      reqleavetype: ['', Validators.required],
      startdate: ['', Validators.required],
      enddate: ['', Validators.required],
      reqreasonControl: ['', Validators.required],
      NoofDaysControl: ['', Validators.required],
    });
    this.BusinesstripForm = this.fb.group({
      bstartdate: ['', Validators.required],
      benddate: ['', Validators.required],
      reqreason: ['', Validators.required],
      leaveNo: ['', Validators.required],
    });
    this.PermissionForm = this.fb.group({
      date: ['', Validators.required],
      session: ['', Validators.required],
      duration: ['', [Validators.required, this.durationValidator.bind(this)]],
      reason: ['', Validators.required]
    });
  }

  ngOnInit(): void {

    this.route.queryParams
      .subscribe(params => {
        this.user = params['user'];
        // this.Activetype = params['active'];
      }
    );

    //Status combo box
    //alert(localStorage.getItem('selectedRootMenu'))
    this.apicall.listStatus(26).subscribe((res) => {
      this.listRegStatus=res;     
    });

    if(this.authorityflg === 0 || this.user == 'personal' || this.user == undefined){
      this.user = 'personal';
      this.viewflag = 0; 
    }
    else{
      this.user = 'team';
      this.viewflag = 1;    
    }
    this.FetchDates(); 
    this.ListLeaveRequests();
    this.Fetchcounts();

    //company combo box
    this.apicall.FetchCompanyList(this.empcode).subscribe((res)=>{
      this.listCompany=res;
    });
    //Department combo box
    this.apicall.FetchDepartmentList(-1,this.empcode).subscribe(res =>{
      this.listDepartment=res;
    })
    //Employee combo box
    this.apicall.FetchEmployeeList(-1,-1,this.empcode).subscribe(res =>{
      this.listEmployee=res;    
    }); 
    //Employee personal detils
    this.apicall.FetchPersonalDetails(this.empcode).subscribe(res =>{
      this.gender=res[0].GENDER;    
      this.probation_period=res[0].PROBATION_PERIOD;
      this.DOJ=res[0].DATE_OF_JOINING;
      const probationEndDate = new Date(this.DOJ);
      probationEndDate.setMonth(probationEndDate.getMonth() + this.probation_period);
      if(this.date >= probationEndDate){
        this.ADD = 1;
      }
    });
  }

  // team or personal selection
  teamselection(selectuser:any){
    this.user = selectuser;
    this.Activetype = 'Leave'
    if (this.user === 'team') {   
      this.viewflag = 1;   
      this.Fetchcounts();
      this.ListLeaveRequests();     
    } 
    else {
      this.viewflag = 0;
      this.Fetchcounts();
      this.ListLeaveRequests();
    } 
  }

  //Active Button
  Activetable(type:any){
    this.Activetype=type;
    this.clear_teamfilter();
    this.clear_personalfilter();
    this.Fetchcounts();
    if(this.Activetype == 'Compo Off'){
      this.Fetchcompoff();
      this.req_category='F';
      this.desiredPage=''; 
      this.currentPage=1;

    } else if(this.Activetype == 'Leave'){
      this.ListLeaveRequests();
      this.req_category='L';
      this.desiredPage=''; 
      this.currentPage=1;
    }else if(this.Activetype == 'Business Trip'){
      this.FetchBussinesstrip();
      this.req_category='B';
      this.desiredPage=''; 
      this.currentPage=1;
    }else if(this.Activetype == 'Permissions'){
      this.FetchPermissions();
      this.req_category='P';
      this.desiredPage=''; 
      this.currentPage=1;
    }
  }

  // total pending for approvals
  Fetchcounts(){
    this.apicall.FetchPendingCount_LeaveMngment(this.viewflag,this.empcode).subscribe(res=>{
      this.LEAVE = res[0].LEAVE;
      this.COMPOFF = res[0].COMPOFF;
      this.BUSINESS = res[0].BUSINESS;
      this.PERMISSION = res[0].PERMISSION;
    }) 
  }

  // Department List
  DepartmentListFn(): void {
    this.apicall.FetchDepartmentList(this.companyID,this.empcode).subscribe(res =>{
          this.listDepartment=res;
    })
    this.FetchLeaveReq_Filter();
  }

  // Employee List
  EmployeeListFn(): void {
      this.apicall.FetchEmployeeList(this.department,this.companyID,this.empcode).subscribe(res =>{
      this.listEmployee=res;
      })
      this.FetchLeaveReq_Filter();
  }

  // Change the Employee Selection
  OnChangeEmployee(empcode:any){
    this.emp_code = empcode;
    this.FetchLeaveReq_Filter();
  }

  // Change the Status 
  // OnChangeStatus(status:any){
  //   this.status = status;
  //   this.FetchLeaveReq_Filter();
  // }

  //Dates
  FetchDates()
  {   
    this.apicall.listFromToDates().subscribe(res=>{
      this.listdates = res;
      if(this.listdates.length > 0)
      {
        const listdatesdata = this.listdates[0];
        this.tm_fromdate=this.datePipe.transform(listdatesdata.FROM_DATE,'yyyy-MM-dd','en');
        this.tm_todate=this.datePipe.transform(listdatesdata.TO_DATE,'yyyy-MM-dd','en');
        this.pl_fromdate=this.datePipe.transform(listdatesdata.FROM_DATE,'yyyy-MM-dd','en');
        this.pl_todate=this.datePipe.transform(listdatesdata.TO_DATE,'yyyy-MM-dd','en');
        this.fmdt =formatDate(listdatesdata.FROM_DATE,'yyyy-MM-dd','en');
        this.todt = formatDate(listdatesdata.TO_DATE,'yyyy-MM-dd','en');       
        this.sdate.setValue(formatDate(listdatesdata.FROM_DATE,'yyyy-MM-dd','en'));
        this.edate.setValue(formatDate(listdatesdata.TO_DATE,'yyyy-MM-dd','en'));
      };
    })
  }

  // Fetch leave Balance
  leavesummarystatus(value:any){
    this.leavetype=value; 
    this.fetchleavesummary();
  }

  fetchleavesummary(){
    this.apicall.FetchLeaveSummary(this.leavetype,this.sdate.value,this.edate.value,this.empcode,this.leave_emp).subscribe(res=>{
      this.leavesummary = res;
    })
  }

  // upcoming Matrix
  MatrixList()
    {
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
        this.listmatrix=res;   
      })
  }

  // Leave team and personal on load View Listing
  ListLeaveRequests()
  {  
    this.apicall.listLeaveRequest(this.empcode,0,this.viewflag,this.firstDay,this.lastDay).subscribe((res)=>{ 
      this.listleaveRequest=res;
    })
  }

  //Leave team filter
  FetchLeaveReq_Filter()
  {
    if (this.viewflag==1){
      this.frdt= this.tm_fromdate
      this.tdt= this.tm_todate
    }
    else{
      this.frdt= (<HTMLInputElement>document.getElementById("pl_fromdate")).value;
      this.tdt= (<HTMLInputElement>document.getElementById("pl_todate")).value; 
    }  

    if( this.frdt > this.tdt){
      alert("Please Correct the Dates")
    }else{
      const fillData = {
        company:this.companyID,
        department:this.department, 
        emp_code:this.emp_code,
        status:this.status,      
        fromdate: this.frdt,
        todate: this.tdt,
        authority:this.empcode, 
      };
      if(this.Activetype == 'Leave')
      {
        this.apicall.FetchLeaveReq_Filterapi(fillData).subscribe(res=>{
         this.listleaveRequest=res;
         const maxPageFiltered = Math.ceil(this.listleaveRequest.length / this.itemsPerPage);  

         if (this.currentPage > maxPageFiltered) {
           this.currentPage = 1;     
         } 
        }) 
      }else if(this.Activetype == 'Compo Off')
      {
        this.apicall.Fetchcompoff_Filterapi(fillData).subscribe(res=>{
          this.listcompoffRequest=res;
          const maxPageFiltered = Math.ceil(this.listcompoffRequest.length / this.itemsPerPage);  

         if (this.currentPage > maxPageFiltered) {
           this.currentPage = 1;     
         } 
        })
      }else if(this.Activetype == 'Business Trip')
      {
        this.apicall.ListBusinessTripFilter(fillData).subscribe(res =>{
          this.listBussinesstrip=res;
          const maxPageFiltered = Math.ceil(this.listBussinesstrip.length / this.itemsPerPage);  

         if (this.currentPage > maxPageFiltered) {
           this.currentPage = 1;     
         } 
        })
      }else if(this.Activetype == 'Permissions')
      {
        this.apicall.FetchPermissionRequest_Filter(fillData).subscribe((res) => {
          this.PermissionData=res;
          const maxPageFiltered = Math.ceil(this.PermissionData.length / this.itemsPerPage);  

         if (this.currentPage > maxPageFiltered) {
           this.currentPage = 1;     
         } 
        })
      }
    }
    this.Fetchcounts();
  }

  //personal filter status change
  // PersonalStatus(pstatus:any){
  //   this.pstatus =pstatus;
  //   this.ListLeaveRequests_Personal();
  // }

  //personal filter
  ListLeaveRequests_Personal()
  {     
    if( this.pl_fromdate > this.pl_todate){
      alert("Please Correct the Dates")
    }else{
      if(this.Activetype == 'Leave')
      {
        this.apicall.listLeaveRequest(this.empcode,this.pstatus,this.viewflag,this.pl_fromdate,this.pl_todate).subscribe((res)=>{
          this.listleaveRequest=res;   
          const maxPageFiltered = Math.ceil(this.listleaveRequest.length / this.itemsPerPage);  

          if (this.currentPage > maxPageFiltered) {
            this.currentPage = 1;     
          } 
        })
      }else if(this.Activetype == 'Compo Off')
      {
        this.apicall.listcompoffRequest(this.empcode,this.pstatus,this.viewflag,this.pl_fromdate,this.pl_todate).subscribe((res)=>{
          this.listcompoffRequest=res;
          const maxPageFiltered = Math.ceil(this.listcompoffRequest.length / this.itemsPerPage);  

          if (this.currentPage > maxPageFiltered) {
            this.currentPage = 1;     
          } 
        })
      }else if(this.Activetype == 'Business Trip')
      {
        this.apicall.ListBusinessTripLevelwise(this.empcode,this.pstatus,this.viewflag,this.pl_fromdate,this.pl_todate).subscribe((res)=>{
          this.listBussinesstrip=res;
          const maxPageFiltered = Math.ceil(this.listBussinesstrip.length / this.itemsPerPage);  

          if (this.currentPage > maxPageFiltered) {
            this.currentPage = 1;     
          } 
        })
      }else if(this.Activetype == 'Permissions')
      {
        this.apicall.FetchPermissionRequest(this.empcode,this.pstatus,this.viewflag,this.pl_fromdate,this.pl_todate).subscribe((res)=>{
          this.PermissionDataPersonal=res;
          const maxPageFiltered = Math.ceil(this.PermissionDataPersonal.length / this.itemsPerPage);  

          if (this.currentPage > maxPageFiltered) {
            this.currentPage = 1;     
          } 
        })
      }
    }
    this.Fetchcounts();
  }

  selectreason(reason:string){
    this.Reason=reason;
  }

  leavebalancedtl(){
    this.apicall.FetchLeaveBalance(this.empcode).subscribe(res=>{
      this.leavebalance = res;
    })
  }
  
  ActivereqID(reqid:any){
    this.activereqid = reqid;
  }

  setSelectedRequestID(requestID: any,empCode:any) {
    this.selectedRequestID = requestID;
    this.selectedEmpCode= empCode; 
  }

  // Approve Leave request by team
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
          this.success = "Approved Successfully";   
          this.Fetchcounts();   
        }
        else{
          this.showModal = 2;
          this.failed = "Failed";
        }     
        this.ListLeaveRequests();   
        this.Fetchcounts();       
    });
  }

  // Reject leave request by team
  onReject(reqid:any,empcode:any){  
    if(this.Activetype == 'Leave')
    {
      const rejectdata={ 
          leavereq_id:reqid,
          empcode:empcode,
          verified_by:this.empid,
          verified_remarks: this.remarks,
          level:this.userSession.level,
          mflag: 2,
      }
      this.apicall.ApproveRejectLeaveReq(rejectdata).subscribe((res) => {
        if(res.Errorid==1){
          this.showModal = 1;
          this.success='Request Rejected!'; 
        }
        else{
          this.showModal = 2;
          this.failed = "Failed";
        }
        this.ListLeaveRequests();
        this.Fetchcounts();
      });
    }else if(this.Activetype == 'Compo Off')
    {
        const rejectdata={
          req_id:reqid,
          empcode:this.selectedEmpCode,
          verified_by:this.empcode,
          verified_remarks:this.remarks,     
          mflag: 0
        }
        this.apicall.ApproveRejectLeaveCompoff(rejectdata).subscribe((res) => {
            if(res.Errorid==1){
              this.showModal = 1;
              this.success='Request Rejected!';     
            }
            else{
              this.showModal = 2;
              this.failed='Failed!';         
            }  
            this.Fetchcompoff();   
            this.Fetchcounts();  
        });
      }else if(this.Activetype == 'Business Trip')
      {
        const rejectdata={
          req_id:reqid,
          empcode:this.selectedEmpCode,
          verified_by:this.empcode,
          verified_remarks:this.remarks, 
          mflag: 2
        }
        this.apicall.ApproveRejectBusinesstripReq(rejectdata).subscribe((res) => {
          if(res.Errorid==1){
      
            this.showModal = 1;  
            this.success='Request Rejected!';   
          }
          else{
            this.showModal = 2;  
            this.failed='Failed!';   
          }
          this.FetchBussinesstrip();  
          this.Fetchcounts();
        });
      }else if(this.Activetype == 'Permissions')
      {
        const rejectdata={
          req_id:reqid,
          empcode:this.selectedEmpCode,
          verified_by:this.empcode,
          verified_remarks:this.remarks,      
          mflag: 0
        }
          this.apicall.ApproveRejectLeavePermissions(rejectdata).subscribe((res) => {
            if(res.Errorid==1){
              this.showModal = 1;
              this.success='Request rejected!';   
            }
            else{
              this.showModal = 2;
              this.failed='Failed!';         
            }     
            this.FetchPermissions();   
            this.Fetchcounts();       
        });
    }
    this.Fetchcounts();
  }

  // Cancel request by employee
  CancelRequest(activereqid:any){
    this.apicall.CancelRequests(this.empcode,activereqid,this.req_category).subscribe(res=>{
      if(res.Errorid=='1')
      {
        this.showModal = 1;
        this.success = "Cancel Request Successfully";
        this.Fetchcounts();
      }
      else
      {
        this.showModal = 2;
        this.failed = "Failed to cancel request";
      }
      this.ListLeaveRequests();
      this.Fetchcompoff(); 
      this.FetchBussinesstrip(); 
      this.FetchPermissions();
      this.Fetchcounts();
    })
  }

  //Leave Add new Request Start
  LeaveRequestLoad(){
    // this.clearaddreq();
    this.apicall.FetchLeaveTypes_CompanyWise(this.empcode).subscribe((res)=>{
      this.listleavetype=res;
      })

    this.apicall.LeaveDuration(this.dur_typeid).subscribe((res)=>{
      this.listduration=res;          
    })

    this.apicall.LeaveSession(this.LvSession_typeid).subscribe((res)=>{
      this.listsession=res;          
    })

    this.apicall.CountryDetails().subscribe((res)=>{
      this.listcountry=res;          
    })
    this.anual='0'; 
    this.reqstatus=0; 
    this.costdoc='0';   
    this.airticketstatus='1';  
    this.sessaction='0';
    (<HTMLInputElement>document.getElementById("reqleavetype")).value='0';
  }

  FetchAvailableLeaves()
    {    
      this.noofleaves.setValue("");
      this.dateDiff='';
      this.requestForm.controls['NoofDaysControl'].setValue(this.dateDiff);
      this.leavetypes = this.requestForm.get('reqleavetype')?.value;  
        this.apicall.FetchAvailableLeaves(this.empcode,this.leavetypes).subscribe((res)=>{
        this.availabledays=res; 
        this.noofleaves.setValue(this.availabledays[0].PERMITTED_DAYS);
        if(this.leavetypes=='10')
        {
          if(this.availabledays[0].LEAVE_TYPE == 1)
          {
            this.anual='0';
          }else
          {
            this.anual='1';
          }
        }
        else
        {
          this.anual='0';
        }
          this.hidedur_div='1';
          this.sessaction='0';
          
          (<HTMLInputElement>document.getElementById("startdate")).value='';
          (<HTMLInputElement>document.getElementById("enddate")).value='';
          (<HTMLInputElement>document.getElementById("reqreason")).value='';
          (<HTMLInputElement>document.getElementById("duration")).value='0';
          (<HTMLInputElement>document.getElementById("session")).value='0';
          (<HTMLInputElement>document.getElementById("formFile")).value='';
          (<HTMLInputElement>document.getElementById("departure")).value='';
          (<HTMLInputElement>document.getElementById("arrival")).value='';      
          (<HTMLInputElement>document.getElementById("departuredt")).value='';
          (<HTMLInputElement>document.getElementById("arrivaldt")).value='';

          this.ReasonControl.setValue('');      
          this.DocFileControl.setValue('');
          this.lvduration.setValue('0');
          this.lvsession.setValue('0');      
          this.airticket.setValue(false); 
          this.airticketstatus=1;   
      }) 
  }

  getDiffDays(value:any) {
    let startdate = (<HTMLInputElement>document.getElementById("startdate")).value; 
    this.leavetypes = this.requestForm.get('reqleavetype')?.value; 
      const dtStart = new Date(startdate);
      if(this.leavetypes == '1'){
        const endDateObj = new Date(dtStart.getTime() + (60 * 24 * 60 * 60 * 1000) - 1 ); // Add 60 days in milliseconds
        const newenddate = endDateObj.toISOString().split('T')[0]; 
        this.requestForm.controls['enddate'].setValue(newenddate);
        (<HTMLInputElement>document.getElementById("enddate")).value = newenddate;
        this.dateDiff='60';
        this.requestForm.controls['NoofDaysControl'].setValue(this.dateDiff);
      }
      let enddate = (<HTMLInputElement>document.getElementById("enddate")).value;
      
      if(startdate != '' && enddate != ''){
        if( startdate > enddate){
          this.validdate="Please enter valid dates";
          this.dateDiff='';
      }  
      else{
        // alert('inside')
        this.validdate="";
        const leavetype= (<HTMLSelectElement>  document.getElementById("reqleavetype")).value;
        if(value == 0){
          this.data = {
            empcode: this.empcode,
            fromdate: startdate,
            todate: enddate, 
            leavetype: leavetype, 
            company:this.company,
            leaveduration:value
          };
        }else{
          this.data = {
            empcode: this.empcode,
            fromdate: startdate,
            todate: enddate, 
            leavetype: leavetype, 
            company:this.company,
            leaveduration:value
          };
        }
          this.apicall.Checkleavepolicy(this.data).subscribe((res)=>{ 
            // alert(JSON.stringify(res)) 
          const errid = res.Errormsg.split('#', 2); 
          const errno = errid[0];  
          const annvalue = errid[1];
          // alert(annvalue)
          if(annvalue == 0)
          {
            this.anual='0';
          }else
          {
            this.anual='1';
          }
          if(errno==-2)
          {
            this.validdates='Another active request for the specified period..!'
            this.dateDiff=''
          }
          else if(errno==-3)
          {
            this.validdates='Another pending request for the same leave type..!'
            this.dateDiff=''
          }
          else if(errno==-4)
          {
            this.validdates='Cannot Club annual leave with other leave..!'
            this.dateDiff=''
          }
          else if(errno==-5)
          {
            this.validdates='Cannot apply for leave before last payroll processed date..!'
            this.dateDiff=''
          }
          else if(errno==-6)
          {
            this.validdates='Maternity leave of 60 calendar days can only be availed together..!'
            this.dateDiff=''
          }
          else if(errno==-7)
          {
            this.validdates='Check the available leaves..!'
            this.dateDiff=''
          }
          else if(errno>=0)
          {
            this.validdates="";
            this.dateDiff=errno;
            if(this.availabledays[0].PERMITTED_DAYS<this.dateDiff)
            {
              this.validdates='Check the available leaves..!'
              this.dateDiff=''
            }
            else{
              // this.requestForm.controls['NoofDaysControl'].setValue(this.dateDiff);
            }
            this.requestForm.controls['NoofDaysControl'].setValue(this.dateDiff);
            if(this.dateDiff>'1')
          this.hidedur_div='0'
          else
          this.hidedur_div='1'
          }else{
            this.dateDiff='';
            this.requestForm.controls['NoofDaysControl'].setValue(this.dateDiff);
        }  
    })
    if(isNaN(this.dateDiff))
    {
      this.dateDiff='';
    }
    
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

  validation()
  {
    const duration= (<HTMLInputElement>document.getElementById("duration")).value;
    const session= (<HTMLInputElement>document.getElementById("session")).value; 
    if(this.dateDiff == 1){
      if(duration == '0'){
        // alert('Please, Select Leave Duration')
        this.validdates='Please, Select Leave Duration'
        this.dateDiff = '';
        this.requestForm.controls['NoofDaysControl'].setValue(this.dateDiff);
      }else if(duration == '2'){
        if(session == '0'){
          // alert('Please, Select Leave Session')
          this.validdates='Please, Select Leave Session'
          this.dateDiff = '';
          this.requestForm.controls['NoofDaysControl'].setValue(this.dateDiff);
        }
      }
    }
  }

  addLeaveRequest()
  {
    if (this.requestForm.valid) {
      const startdateControl = this.requestForm.get('startdate');      
      this.leavetypeControl = this.requestForm.get('reqleavetype');
      this.ReasonControl = this.requestForm.get('reqreasonControl');
      const enddateControl = this.requestForm.get('enddate');
      const duration= (<HTMLInputElement>document.getElementById("duration")).value;
      const session= (<HTMLInputElement>document.getElementById("session")).value; 
      const  departure=(<HTMLInputElement>document.getElementById("departure")).value;
      const  arrival=(<HTMLInputElement>document.getElementById("arrival")).value;
      const  departuredt=(<HTMLInputElement>document.getElementById("departuredt")).value;
      const  arrivaldt=(<HTMLInputElement>document.getElementById("arrivaldt")).value;

      const selectedValue = this.requestForm.get('reqleavetype')?.value;
      const dropdownOptions = Array.from(document.querySelectorAll(`[formControlName="reqleavetype"] option`)) as HTMLOptionElement[];
      const selectedOption = dropdownOptions.find(option => option.value === selectedValue);
      const leave =  selectedOption ? selectedOption.textContent || '' : '';
      
      const Leavestartdt = this.datePipe.transform(startdateControl?.value,'dd-MM-yyyy','en');
      const Leaveenddt = this.datePipe.transform(enddateControl?.value,'dd-MM-yyyy','en');

      if(this.dateDiff == 1){
        if(duration == '0'){
          alert('Please, Select Leave Duration')
          this.dateDiff = '';
          this.requestForm.controls['NoofDaysControl'].setValue(this.dateDiff);
        }else if(duration == '2'){
          if(session == '0'){
            alert('Please, Select Leave Session')
            this.dateDiff = '';
            this.requestForm.controls['NoofDaysControl'].setValue(this.dateDiff);
          }
        }
      }
      if(this.airticket.value==true)
        this.airticketstatus=1;
      else
        this.airticketstatus=0;
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
          departuredate:departuredt,
          arrivaldate:arrivaldt,
          document:this.DocFileControl.value,
        };
        // alert(JSON.stringify(leavereqdata))
      this.apicall.addLeaveReq(leavereqdata).subscribe(res=>{
        if(res.Errorid>0)
          {
            this.apicall.SendEMail(1,this.empcode,this.empname,leave,Leavestartdt,Leaveenddt).subscribe((res)=>{
              if(res.Errorid = 1)
              {
                this.showModal = 1;
                this.success = "Mail Send Successfully";
              }else{
                this.showModal = 1;
                this.failed = "failed";
              }
            })
            this.showModal = 1;
            this.success = "Leave Requested Successfully";
            this.ListLeaveRequests_Personal();
            this.upload(res.Errorid,1);
            if(this.airticket.value==true)
            {
              this.upload(res.Errorid,2);
            }
            this.ListLeaveRequests();
            this.ListLeaveRequests_Personal();      
            this.clearaddreq();
          }
          else if(res.Errorid==-1)
          {
          this.showModal = 2;
          this.failed = "Cannot apply for leave during probation period";
          this.ListLeaveRequests_Personal();
          this.clearaddreq();
          }
          else if(res.Errorid==-2)
          {
          this.showModal = 2;
          this.failed = "Upload documents for appliying for medical leave more than one day";
          
          this.ListLeaveRequests_Personal();
          this.clearaddreq();
          }
          else if(res.Errorid==-3)
          {
          this.showModal = 2;
          this.failed = "You have to upload document,for appliying for parental leave";
          
          this.ListLeaveRequests_Personal();
          this.clearaddreq();
          }
          else if(res.Errorid==-4)
          {
          this.showModal = 2;
          this.failed = "You have to upload document,for appliying continuos sick leave";
          
          this.ListLeaveRequests_Personal();
          this.clearaddreq();
          }
          else if(res.Errorid==-6)
          {
          this.showModal = 2;
          this.failed = "Cannot club annual leave and sick leave";
          
          this.ListLeaveRequests_Personal();
          this.clearaddreq();
          }
          else if(res.Errorid==-7)
          {
            this.showModal = 2;
            this.failed = 'Check the available leaves..!'

            this.ListLeaveRequests_Personal();
            this.clearaddreq();
          }
          else
          {
            this.showModal = 2;
            this.failed = "Leave Request Failed";
            
            this.ListLeaveRequests_Personal();
            this.clearaddreq();
          }   
          // this.clearaddreq();
      }) 
    }
    } else {    
      this.markFormGroupTouched(this.requestForm);   
    }
    // this.clearaddreq();
    this.Fetchcounts();
  }

  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
    });
  } 

  clearaddreq(){
    this.airticket.setValue(false); 
    this.airticketstatus=1;  
    this.validdates="";
    this.requestForm.reset();
    this.anual='0';
    this.hidedur_div='1';
    this.dateDiff='';
    this.sessaction='0';
    (<HTMLInputElement>document.getElementById("reqleavetype")).value='0';
    (<HTMLInputElement>document.getElementById("duration")).value='0';
    (<HTMLInputElement>document.getElementById("session")).value='0';
    (<HTMLInputElement>document.getElementById("formFile")).value='';
    (<HTMLInputElement>document.getElementById("departure")).value='';
    (<HTMLInputElement>document.getElementById("arrival")).value='';  
    (<HTMLInputElement>document.getElementById("departuredt")).value='';
    (<HTMLInputElement>document.getElementById("arrivaldt")).value='';  
    this.noofleaves.setValue("");
    this.ReasonControl.setValue('');      
    this.NoofDaysControl.setValue('');
    this.DocFileControl.setValue('');
    this.lvduration.setValue('0');
    this.lvsession.setValue('0');            
  }

  Checksize(data:any)
  {
    const file=data.files[0];
    const fsize=file.size/1024/1024;//Convert to mb  
    if(fsize>10)
    {
      alert('File size should not be greater than 10MB');
      data.value=null;
    }
  }

  upload(reqid:any,flag:any)
  {
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
     
      this.apicall.Uploadleavedoc(fdata,reqid).subscribe((res)=>{
        const result=res;
        if(res==0)
        { 
          this.showModal = 2;
        this.failed = "Leave document uploading failed";
        }
        
      })
    }
  }

  enable(){ 
    if(this.airticket.value==null||this.airticket.value==false){  
      this.airticketstatus=0;     
    }
    else{
      this.airticketstatus=1; 
    }
  }

  sessionaction(){
    this.getDiffDays(this.lvduration.value);
    if(this.lvduration.value==1)
    {
      this.sessaction='1'
      // this.dateDiff='1';
    }else{
      this.sessaction='0'
    }
    if(this.lvduration.value == 2){
      this.dateDiff='.5';
    }
    else{
      this.dateDiff='';
    }
    this.requestForm.controls['NoofDaysControl'].setValue(this.dateDiff);
    this.validdates='';
  }

  diffchange()
  {
    this.dateDiff='.5';
    this.requestForm.controls['NoofDaysControl'].setValue(this.dateDiff); 
  }

  download_documents(){
    let fileurl=this.apicall.DownloadLeaveDocuments(this.activereqid);
    let link = document.createElement("a");
      
       if (link.download !== undefined) {
          link.setAttribute("href", fileurl);
          link.setAttribute("download", "ReportFile.xlsx");
          link.setAttribute('target', '_blank');
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
       }
 }

 download_airticket(){
  let fileurl=this.apicall.ViewAirticket(this.activereqid,'L');
  let link = document.createElement("a");
    
     if (link.download !== undefined) {
        link.setAttribute("href", fileurl);
        link.setAttribute('target', '_blank');
        // link.setAttribute("download", "ReportFile.xlsx");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
     }
}
  //Leave Add new Request End

  // Status Approve List
  Approvelist(requestID: any){
    this.reqID = requestID
    this.apicall.StatusApproveList(1,this.reqID,this.req_category).subscribe(res=>{
      this.approvelist = res;
    })
  }
 
//PaginationLeave
getTotalPagesLeave(): number {
  return Math.ceil(this.totalSearchResultsLeave / this.itemsPerPage);
}

goToPageLeave() {
  const totalPages = Math.ceil(this.totalSearchResultsLeave / this.itemsPerPage);
  if (this.desiredPage >= 1 && this.desiredPage <= totalPages) {
    this.currentPage = this.desiredPage;
  } else {  
    
    (<HTMLInputElement>document.getElementById("openModalButton")).click();
    this.showModal = 2; 
    this.failed='Invalid page number!'; 
    this.desiredPage=''; 
  }   
 
}
getPageNumbersLeave(currentPage: number): number[] {
  const totalPages = Math.ceil(this.totalSearchResultsLeave / this.itemsPerPage);
  const maxPageNumbers = 5; // Number of page numbers to show
  const middlePage = Math.ceil(maxPageNumbers / 2);
  let startPage = Math.max(currentPage - middlePage, 1);
  let endPage = Math.min(startPage + maxPageNumbers - 1, totalPages);

  if (endPage - startPage + 1 < maxPageNumbers) {
    startPage = Math.max(endPage - maxPageNumbers + 1, 1);
  }

  return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
}

// Function to Calculate the total number of search results
get totalSearchResultsLeave(): number {
const totalResults = this.listleaveRequest.filter((employee: any) => {
  return Object.values(employee).some((value: any) =>
    typeof value === 'string' && value.toLowerCase().startsWith(this.searchInput.toLowerCase())
  );
}).length;

const maxPageFiltered = Math.ceil(totalResults / this.itemsPerPage);  

if (this.currentPage > maxPageFiltered) {
  this.currentPage = 1; 
}

return totalResults;
}

// Function to change the current page
changePageLeave(page: number): void { 
  this.desiredPage = '';   
  this.currentPage = page;
  const maxPage = Math.ceil(this.totalSearchResultsLeave / this.itemsPerPage);
  if (this.currentPage > maxPage) {
    this.currentPage = 1;
  }        
}
getEntriesStartLeave(): number {
if (this.currentPage === 1) {
  return 1;
}

const filteredData = this.listleaveRequest.filter((employee: any) =>
  Object.values(employee).some((value: any) =>
    typeof value === 'string' &&
    value.toLowerCase().startsWith(this.searchInput.toLowerCase())
  )
);

const start = (this.currentPage - 1) * this.itemsPerPage + 1;
return Math.min(start, filteredData.length);
}


getEntriesEndLeave(): number {  
const filteredData = this.listleaveRequest.filter((employee: any) =>
  Object.values(employee).some((value: any) =>
    typeof value === 'string' &&
    value.toLowerCase().startsWith(this.searchInput.toLowerCase())
  )
);
const end = this.currentPage * this.itemsPerPage;
return Math.min(end, filteredData.length);
}
//PaginationLeavePersonal
getTotalPagesLeavePersonal(): number {
  return Math.ceil(this.totalSearchResultsLeave / this.itemsPerPage);
}

goToPageLeavePersonal() {
  const totalPages = Math.ceil(this.totalSearchResultsLeave / this.itemsPerPage);
  if (this.desiredPage >= 1 && this.desiredPage <= totalPages) {
    this.currentPage = this.desiredPage;
  } else {  
    
    (<HTMLInputElement>document.getElementById("openModalButton")).click();
    this.showModal = 2; 
    this.failed='Invalid page number!'; 
    this.desiredPage=''; 
  }   
 
}
getPageNumbersLeavePersonal(currentPage: number): number[] {
  const totalPages = Math.ceil(this.totalSearchResultsLeave / this.itemsPerPage);
  const maxPageNumbers = 5; // Number of page numbers to show
  const middlePage = Math.ceil(maxPageNumbers / 2);
  let startPage = Math.max(currentPage - middlePage, 1);
  let endPage = Math.min(startPage + maxPageNumbers - 1, totalPages);

  if (endPage - startPage + 1 < maxPageNumbers) {
    startPage = Math.max(endPage - maxPageNumbers + 1, 1);
  }

  return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
}

// Function to Calculate the total number of search results
get totalSearchResultsLeavePersonal(): number {
const totalResults = this.listleaveRequest.filter((employee: any) => {
  return Object.values(employee).some((value: any) =>
    typeof value === 'string' && value.toLowerCase().startsWith(this.searchInput.toLowerCase())
  );
}).length;

const maxPageFiltered = Math.ceil(totalResults / this.itemsPerPage);  

if (this.currentPage > maxPageFiltered) {
  this.currentPage = 1; 
}

return totalResults;
}

// Function to change the current page
changePageLeavePersonal(page: number): void { 
  this.desiredPage = '';   
  this.currentPage = page;
  const maxPage = Math.ceil(this.totalSearchResultsLeave / this.itemsPerPage);
  if (this.currentPage > maxPage) {
    this.currentPage = 1;
  }        
}
getEntriesStartLeavePersonal(): number {
if (this.currentPage === 1) {
  return 1;
}

const filteredData = this.listleaveRequest.filter((employee: any) =>
  Object.values(employee).some((value: any) =>
    typeof value === 'string' &&
    value.toLowerCase().startsWith(this.searchInput.toLowerCase())
  )
);

const start = (this.currentPage - 1) * this.itemsPerPage + 1;
return Math.min(start, filteredData.length);
}


getEntriesEndLeavePersonal(): number {  
const filteredData = this.listleaveRequest.filter((employee: any) =>
  Object.values(employee).some((value: any) =>
    typeof value === 'string' &&
    value.toLowerCase().startsWith(this.searchInput.toLowerCase())
  )
);
const end = this.currentPage * this.itemsPerPage;
return Math.min(end, filteredData.length);
}
//PaginationCompoff
getTotalPagesCompoff(): number {
  return Math.ceil(this.totalSearchResultsCompoff / this.itemsPerPage);
}

goToPageCompoff() {
  const totalPages = Math.ceil(this.totalSearchResultsCompoff / this.itemsPerPage);
  if (this.desiredPage >= 1 && this.desiredPage <= totalPages) {
    this.currentPage = this.desiredPage;
  } else {  
    
    (<HTMLInputElement>document.getElementById("openModalButton")).click();
    this.showModal = 2; 
    this.failed='Invalid page number!'; 
    this.desiredPage=''; 
  }   
 
}
getPageNumbersCompoff(currentPage: number): number[] {
  const totalPages = Math.ceil(this.totalSearchResultsCompoff / this.itemsPerPage);
  const maxPageNumbers = 5; // Number of page numbers to show
  const middlePage = Math.ceil(maxPageNumbers / 2);
  let startPage = Math.max(currentPage - middlePage, 1);
  let endPage = Math.min(startPage + maxPageNumbers - 1, totalPages);

  if (endPage - startPage + 1 < maxPageNumbers) {
    startPage = Math.max(endPage - maxPageNumbers + 1, 1);
  }

  return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
}

// Function to Calculate the total number of search results
get totalSearchResultsCompoff(): number {
const totalResults = this.listcompoffRequest.filter((employee: any) => {
  return Object.values(employee).some((value: any) =>
    typeof value === 'string' && value.toLowerCase().startsWith(this.searchInput.toLowerCase())
  );
}).length;

const maxPageFiltered = Math.ceil(totalResults / this.itemsPerPage);  

if (this.currentPage > maxPageFiltered) {
  this.currentPage = 1; 
}

return totalResults;
}

// Function to change the current page
changePageCompoff(page: number): void { 
  this.desiredPage = '';   
  this.currentPage = page;
  const maxPage = Math.ceil(this.totalSearchResultsCompoff / this.itemsPerPage);
  if (this.currentPage > maxPage) {
    this.currentPage = 1;
  }        
}
getEntriesStartCompoff(): number {
if (this.currentPage === 1) {
  return 1;
}

const filteredData = this.listcompoffRequest.filter((employee: any) =>
  Object.values(employee).some((value: any) =>
    typeof value === 'string' &&
    value.toLowerCase().startsWith(this.searchInput.toLowerCase())
  )
);

const start = (this.currentPage - 1) * this.itemsPerPage + 1;
return Math.min(start, filteredData.length);
}


getEntriesEndCompoff(): number {  
const filteredData = this.listcompoffRequest.filter((employee: any) =>
  Object.values(employee).some((value: any) =>
    typeof value === 'string' &&
    value.toLowerCase().startsWith(this.searchInput.toLowerCase())
  )
);
const end = this.currentPage * this.itemsPerPage;
return Math.min(end, filteredData.length);
}
//PaginationCompoffPersonal
getTotalPagesCompoffPersonal(): number {
  return Math.ceil(this.totalSearchResultsCompoffPersonal / this.itemsPerPage);
}

goToPageCompoffPersonal() {
  const totalPages = Math.ceil(this.totalSearchResultsCompoffPersonal / this.itemsPerPage);
  if (this.desiredPage >= 1 && this.desiredPage <= totalPages) {
    this.currentPage = this.desiredPage;
  } else {  
    
    (<HTMLInputElement>document.getElementById("openModalButton")).click();
    this.showModal = 2; 
    this.failed='Invalid page number!'; 
    this.desiredPage=''; 
  }   
 
}
getPageNumbersCompoffPersonal(currentPage: number): number[] {
  const totalPages = Math.ceil(this.totalSearchResultsCompoffPersonal / this.itemsPerPage);
  const maxPageNumbers = 5; // Number of page numbers to show
  const middlePage = Math.ceil(maxPageNumbers / 2);
  let startPage = Math.max(currentPage - middlePage, 1);
  let endPage = Math.min(startPage + maxPageNumbers - 1, totalPages);

  if (endPage - startPage + 1 < maxPageNumbers) {
    startPage = Math.max(endPage - maxPageNumbers + 1, 1);
  }

  return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
}

// Function to Calculate the total number of search results
get totalSearchResultsCompoffPersonal(): number {
const totalResults = this.listcompoffRequest.filter((employee: any) => {
  return Object.values(employee).some((value: any) =>
    typeof value === 'string' && value.toLowerCase().startsWith(this.searchInput.toLowerCase())
  );
}).length;

const maxPageFiltered = Math.ceil(totalResults / this.itemsPerPage);  

if (this.currentPage > maxPageFiltered) {
  this.currentPage = 1; 
}

return totalResults;
}

// Function to change the current page
changePageCompoffPersonal(page: number): void { 
  this.desiredPage = '';   
  this.currentPage = page;
  const maxPage = Math.ceil(this.totalSearchResultsCompoffPersonal / this.itemsPerPage);
  if (this.currentPage > maxPage) {
    this.currentPage = 1;
  }        
}
getEntriesStartCompoffPersonal(): number {
if (this.currentPage === 1) {
  return 1;
}

const filteredData = this.listcompoffRequest.filter((employee: any) =>
  Object.values(employee).some((value: any) =>
    typeof value === 'string' &&
    value.toLowerCase().startsWith(this.searchInput.toLowerCase())
  )
);

const start = (this.currentPage - 1) * this.itemsPerPage + 1;
return Math.min(start, filteredData.length);
}


getEntriesEndCompoffPersonal(): number {  
const filteredData = this.listcompoffRequest.filter((employee: any) =>
  Object.values(employee).some((value: any) =>
    typeof value === 'string' &&
    value.toLowerCase().startsWith(this.searchInput.toLowerCase())
  )
);
const end = this.currentPage * this.itemsPerPage;
return Math.min(end, filteredData.length);
}
  //PaginationBusinessTripPersonal
getTotalPagesBusinessTripPersonal(): number {
  return Math.ceil(this.totalSearchResultsBusinessTripPersonal / this.itemsPerPage);
}

goToPageBusinessTripPersonal() {
  const totalPages = Math.ceil(this.totalSearchResultsBusinessTripPersonal / this.itemsPerPage);
  if (this.desiredPage >= 1 && this.desiredPage <= totalPages) {
    this.currentPage = this.desiredPage;
  } else {  
    
    (<HTMLInputElement>document.getElementById("openModalButton")).click();
    this.showModal = 2; 
    this.failed='Invalid page number!'; 
    this.desiredPage=''; 
  }   
 
}
getPageNumbersBusinessTripPersonal(currentPage: number): number[] {
  const totalPages = Math.ceil(this.totalSearchResultsBusinessTripPersonal / this.itemsPerPage);
  const maxPageNumbers = 5; // Number of page numbers to show
  const middlePage = Math.ceil(maxPageNumbers / 2);
  let startPage = Math.max(currentPage - middlePage, 1);
  let endPage = Math.min(startPage + maxPageNumbers - 1, totalPages);

  if (endPage - startPage + 1 < maxPageNumbers) {
    startPage = Math.max(endPage - maxPageNumbers + 1, 1);
  }

  return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
}

// Function to Calculate the total number of search results
get totalSearchResultsBusinessTripPersonal(): number {
const totalResults = this.listBussinesstrip.filter((employee: any) => {
  return Object.values(employee).some((value: any) =>
    typeof value === 'string' && value.toLowerCase().startsWith(this.searchInput.toLowerCase())
  );
}).length;

const maxPageFiltered = Math.ceil(totalResults / this.itemsPerPage);  

if (this.currentPage > maxPageFiltered) {
  this.currentPage = 1; 
}

return totalResults;
}

// Function to change the current page
changePageBusinessTripPersonal(page: number): void { 
  this.desiredPage = '';   
  this.currentPage = page;
  const maxPage = Math.ceil(this.totalSearchResultsBusinessTripPersonal / this.itemsPerPage);
  if (this.currentPage > maxPage) {
    this.currentPage = 1;
  }        
}
getEntriesStartBusinessTripPersonal(): number {
if (this.currentPage === 1) {
  return 1;
}

const filteredData = this.listBussinesstrip.filter((employee: any) =>
  Object.values(employee).some((value: any) =>
    typeof value === 'string' &&
    value.toLowerCase().startsWith(this.searchInput.toLowerCase())
  )
);

const start = (this.currentPage - 1) * this.itemsPerPage + 1;
return Math.min(start, filteredData.length);
}


getEntriesEndBusinessTripPersonal(): number {  
const filteredData = this.listBussinesstrip.filter((employee: any) =>
  Object.values(employee).some((value: any) =>
    typeof value === 'string' &&
    value.toLowerCase().startsWith(this.searchInput.toLowerCase())
  )
);
const end = this.currentPage * this.itemsPerPage;
return Math.min(end, filteredData.length);
}
 //PaginationBusinessTrip
 getTotalPagesBusinessTrip(): number {
  return Math.ceil(this.totalSearchResultsBusinessTrip / this.itemsPerPage);
}

goToPageBusinessTrip() {
  const totalPages = Math.ceil(this.totalSearchResultsBusinessTrip / this.itemsPerPage);
  if (this.desiredPage >= 1 && this.desiredPage <= totalPages) {
    this.currentPage = this.desiredPage;
  } else {  
    
    (<HTMLInputElement>document.getElementById("openModalButton")).click();
    this.showModal = 2; 
    this.failed='Invalid page number!'; 
    this.desiredPage=''; 
  }   
 
}
getPageNumbersBusinessTrip(currentPage: number): number[] {
  const totalPages = Math.ceil(this.totalSearchResultsBusinessTrip / this.itemsPerPage);
  const maxPageNumbers = 5; // Number of page numbers to show
  const middlePage = Math.ceil(maxPageNumbers / 2);
  let startPage = Math.max(currentPage - middlePage, 1);
  let endPage = Math.min(startPage + maxPageNumbers - 1, totalPages);

  if (endPage - startPage + 1 < maxPageNumbers) {
    startPage = Math.max(endPage - maxPageNumbers + 1, 1);
  }

  return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
}

// Function to Calculate the total number of search results
get totalSearchResultsBusinessTrip(): number {
const totalResults = this.listBussinesstrip.filter((employee: any) => {
  return Object.values(employee).some((value: any) =>
    typeof value === 'string' && value.toLowerCase().startsWith(this.searchInput.toLowerCase())
  );
}).length;

const maxPageFiltered = Math.ceil(totalResults / this.itemsPerPage);  

if (this.currentPage > maxPageFiltered) {
  this.currentPage = 1; 
}

return totalResults;
}

// Function to change the current page
changePageBusinessTrip(page: number): void { 
  this.desiredPage = '';   
  this.currentPage = page;
  const maxPage = Math.ceil(this.totalSearchResultsBusinessTrip / this.itemsPerPage);
  if (this.currentPage > maxPage) {
    this.currentPage = 1;
  }        
}
getEntriesStartBusinessTrip(): number {
if (this.currentPage === 1) {
  return 1;
}

const filteredData = this.listBussinesstrip.filter((employee: any) =>
  Object.values(employee).some((value: any) =>
    typeof value === 'string' &&
    value.toLowerCase().startsWith(this.searchInput.toLowerCase())
  )
);

const start = (this.currentPage - 1) * this.itemsPerPage + 1;
return Math.min(start, filteredData.length);
}


getEntriesEndBusinessTrip(): number {  
const filteredData = this.listBussinesstrip.filter((employee: any) =>
  Object.values(employee).some((value: any) =>
    typeof value === 'string' &&
    value.toLowerCase().startsWith(this.searchInput.toLowerCase())
  )
);
const end = this.currentPage * this.itemsPerPage;
return Math.min(end, filteredData.length);
}
//PaginationPermissions
getTotalPagesPermissions(): number {
  return Math.ceil(this.totalSearchResultsPermissions/ this.itemsPerPage);
}

goToPagePermissions() {
  const totalPages = Math.ceil(this.totalSearchResultsPermissions / this.itemsPerPage);
  if (this.desiredPage >= 1 && this.desiredPage <= totalPages) {
    this.currentPage = this.desiredPage;
  } else {  
    
    (<HTMLInputElement>document.getElementById("openModalButton")).click();
    this.showModal = 2; 
    this.failed='Invalid page number!'; 
    this.desiredPage=''; 
  }   
 
}
getPageNumbersPermissions(currentPage: number): number[] {
  const totalPages = Math.ceil(this.totalSearchResultsPermissions / this.itemsPerPage);
  const maxPageNumbers = 5; // Number of page numbers to show
  const middlePage = Math.ceil(maxPageNumbers / 2);
  let startPage = Math.max(currentPage - middlePage, 1);
  let endPage = Math.min(startPage + maxPageNumbers - 1, totalPages);

  if (endPage - startPage + 1 < maxPageNumbers) {
    startPage = Math.max(endPage - maxPageNumbers + 1, 1);
  }

  return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
}

// Function to Calculate the total number of search results
get totalSearchResultsPermissions(): number {
const totalResults = this.PermissionData.filter((employee: any) => {
  return Object.values(employee).some((value: any) =>
    typeof value === 'string' && value.toLowerCase().startsWith(this.searchInput.toLowerCase())
  );
}).length;

const maxPageFiltered = Math.ceil(totalResults / this.itemsPerPage);  

if (this.currentPage > maxPageFiltered) {
  this.currentPage = 1; 
}

return totalResults;
}

// Function to change the current page
changePagePermissions(page: number): void { 
  this.desiredPage = '';   
  this.currentPage = page;
  const maxPage = Math.ceil(this.totalSearchResultsPermissions / this.itemsPerPage);
  if (this.currentPage > maxPage) {
    this.currentPage = 1;
  }        
}
getEntriesStartPermissions(): number {
if (this.currentPage === 1) {
  return 1;
}

const filteredData = this.listBussinesstrip.filter((employee: any) =>
  Object.values(employee).some((value: any) =>
    typeof value === 'string' &&
    value.toLowerCase().startsWith(this.searchInput.toLowerCase())
  )
);

const start = (this.currentPage - 1) * this.itemsPerPage + 1;
return Math.min(start, filteredData.length);
}


getEntriesEndPermissions(): number {  
const filteredData = this.PermissionData.filter((employee: any) =>
  Object.values(employee).some((value: any) =>
    typeof value === 'string' &&
    value.toLowerCase().startsWith(this.searchInput.toLowerCase())
  )
);
const end = this.currentPage * this.itemsPerPage;
return Math.min(end, filteredData.length);
}
//PaginationPermissionsPersonal
getTotalPagesPermissionsPersonal(): number {
  return Math.ceil(this.totalSearchResultsPermissionsPersonal/ this.itemsPerPage);
}

goToPagePermissionsPersonal() {
  const totalPages = Math.ceil(this.totalSearchResultsPermissionsPersonal / this.itemsPerPage);
  if (this.desiredPage >= 1 && this.desiredPage <= totalPages) {
    this.currentPage = this.desiredPage;
  } else {  
    
    (<HTMLInputElement>document.getElementById("openModalButton")).click();
    this.showModal = 2; 
    this.failed='Invalid page number!'; 
    this.desiredPage=''; 
  }   
 
}
getPageNumbersPermissionsPersonal(currentPage: number): number[] {
  const totalPages = Math.ceil(this.totalSearchResultsPermissionsPersonal / this.itemsPerPage);
  const maxPageNumbers = 5; // Number of page numbers to show
  const middlePage = Math.ceil(maxPageNumbers / 2);
  let startPage = Math.max(currentPage - middlePage, 1);
  let endPage = Math.min(startPage + maxPageNumbers - 1, totalPages);

  if (endPage - startPage + 1 < maxPageNumbers) {
    startPage = Math.max(endPage - maxPageNumbers + 1, 1);
  }

  return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
}

// Function to Calculate the total number of search results
get totalSearchResultsPermissionsPersonal(): number {
const totalResults = this.PermissionDataPersonal.filter((employee: any) => {
  return Object.values(employee).some((value: any) =>
    typeof value === 'string' && value.toLowerCase().startsWith(this.searchInput.toLowerCase())
  );
}).length;

const maxPageFiltered = Math.ceil(totalResults / this.itemsPerPage);  

if (this.currentPage > maxPageFiltered) {
  this.currentPage = 1; 
}

return totalResults;
}

// Function to change the current page
changePagePermissionsPersonal(page: number): void { 
  this.desiredPage = '';   
  this.currentPage = page;
  const maxPage = Math.ceil(this.totalSearchResultsPermissionsPersonal / this.itemsPerPage);
  if (this.currentPage > maxPage) {
    this.currentPage = 1;
  }        
}
getEntriesStartPermissionsPersonal(): number {
if (this.currentPage === 1) {
  return 1;
}

const filteredData = this.PermissionDataPersonal.filter((employee: any) =>
  Object.values(employee).some((value: any) =>
    typeof value === 'string' &&
    value.toLowerCase().startsWith(this.searchInput.toLowerCase())
  )
);

const start = (this.currentPage - 1) * this.itemsPerPage + 1;
return Math.min(start, filteredData.length);
}


getEntriesEndPermissionsPersonal(): number {  
const filteredData = this.PermissionDataPersonal.filter((employee: any) =>
  Object.values(employee).some((value: any) =>
    typeof value === 'string' &&
    value.toLowerCase().startsWith(this.searchInput.toLowerCase())
  )
);
const end = this.currentPage * this.itemsPerPage;
return Math.min(end, filteredData.length);
}
  // compo off start
  // team and personal on load filter
  Fetchcompoff(){
    this.apicall.listcompoffRequest(this.empcode,this.status,this.viewflag,this.firstDay,this.lastDay).subscribe((res)=>{
      this.listcompoffRequest=res;
    })
    this.Fetchcounts();
  }

  // Approve compoff request by team
  approvecompoff(reqid:any,empcodes:any){ 
    const approvedata={
      req_id:reqid,
      empcode:empcodes,
      verified_by:this.empcode,
      verified_remarks:'NULL',      
      mflag: 1
    }
      this.apicall.ApproveRejectLeaveCompoff(approvedata).subscribe((res) => {
        if(res.Errorid==1){
          this.showModal = 1;
          this.success='Request approved!';     
        }
        else{
          this.showModal = 2;
          this.failed='Failed!';         
        }  
        this.Fetchcompoff();  
        this.Fetchcounts(); 
    });
  }

  // on load the request button click
  CompoffRequestLoad(){
    this.apicall.compoffdate(this.empcode).subscribe((res)=>{
      this.listCompoffDates=res;
    })
  }

  // Add compoff request
  addCompoffRequest()
  {
    if(this.compoffdate.value == null){
      this.showModal = 2;
      this.failed = "Please select the date";
    }else{
    const compreqdata = {
      compoff_id:this.compoffdate.value,
      emp_code : this.userSession.empcode,
      availed_date:this.availeddate.value,
      reason:this.reason.value,
    };

      this.apicall.addcompoffReq(compreqdata).subscribe(res=>{
      if(res.Errorid==1)
        {
          this.showModal = 1;
          this.success = "Compoff Requested Successfully";
        }
        else
        {
          this.showModal = 2;
          this.failed = "Compoff Request Failed";    
        }  
        this.Fetchcompoff();
        this.compoffdate.setValue('');
        this.availeddate.setValue('');
        this.reason.setValue('');
        this.Fetchcounts();
      }) 
    }
  }

  // Approve list view
  Approvelistcompoff(requestID: any){
    this.reqID = requestID
    this.apicall.StatusApproveList(1,this.reqID,'C').subscribe(res=>{
      this.approvelist = res;
    })
  }
  // compo off end

  // Bussiness trip start
  //Fetch team and personal business trip
  FetchBussinesstrip(){
    this.apicall.ListBusinessTripLevelwise(this.empcode,this.status,this.viewflag,this.firstDay,this.lastDay).subscribe((res)=>{
      this.listBussinesstrip=res;
    })
    this.Fetchcounts();
  }

  //Approve Business trip
  approvebussinesstrip(reqid:any,Empcode:any)
  { 
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
          this.success='Request approved!';   
        }
        else{
          this.showModal = 2;   
          this.success='Failed';  
        }  
        this.FetchBussinesstrip();   
        this.Fetchcounts();
    });
  }

  validateBusinessTripForm()
  {
    if (this.BusinesstripForm.valid){
      this.isBusinessTripFormValid = true;
    }
    else{
      this.markFormGroupTouched(this.BusinesstripForm);
    }
  }

  // Add Business trip request
  AddBusinessTripRequest()
  {
    if (this.BusinesstripForm.valid) {
      const inTimeControl = this.BusinesstripForm.get('bstartdate');      
      const outTimeControl = this.BusinesstripForm.get('benddate');
      const remarksControl = this.BusinesstripForm.get('reqreason');
  
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
          }
          else
          {
            this.showModal = 2;
            this.failed = "Failed";
          }   
          this.FetchBussinesstrip();   
          this.BusinesstripForm.reset();
          this.Fetchcounts();
       })
      }
    }
    else {    
      this.markFormGroupTouched(this.BusinesstripForm);   
    }
  }

  getDiffDaysBusinesstrip() {
    let bstartdate = (<HTMLInputElement>document.getElementById("bstartdate")).value;
    let benddate = (<HTMLInputElement>document.getElementById("benddate")).value;
    if(bstartdate != '' && benddate != ''){
  
      if( bstartdate > benddate){
        this.bvaliddate="Please enter valid dates";
        this.bdateDiff='';
        this.BusinesstripForm.controls['leaveNo'].setValue(this.bdateDiff);
      }else{
        this.validdate="";
        const dtStart = new Date(bstartdate);
        const Dtlast= new Date(benddate);
        this.bdateDiff=Math.floor((Date.UTC(Dtlast.getFullYear(), Dtlast.getMonth(), Dtlast.getDate()) - Date.UTC(dtStart.getFullYear(), dtStart.getMonth(), dtStart.getDate()) ) /(1000 *60  *60 * 24)+1);
        this.BusinesstripForm.controls['leaveNo'].setValue(this.bdateDiff);
      } 
    }
  }


  Clear()
  {
    this.BusinesstripForm.reset();
  }
  // Bussiness trip end

  //permission start
  //fetch permission requests
  FetchPermissions()
  {
    this.apicall.FetchPermissionRequest(this.empcode,this.status,this.viewflag,this.firstDay,this.lastDay).subscribe((res) => {
      if(this.user == 'personal'){
        this.PermissionDataPersonal = res;
      }else{
        this.PermissionData = res; 
      }
    })
    this.Fetchcounts();
  }

  // Approve request permisssion
  approvepermission(reqid:any,empcode:any)
  {
    const approvedata={
      req_id:reqid,
      empcode:empcode,
      verified_by:this.empcode,
      verified_remarks:'NULL',      
      mflag: 1
    }
      this.apicall.ApproveRejectLeavePermissions(approvedata).subscribe((res) => {
        if(res.Errorid==1){
          this.showModal = 1;
          this.success='Request approved!';    
        }
        else{
          this.showModal = 2;
          this.failed='Failed!';         
        }     
        this.FetchPermissions();  
        this.Fetchcounts();
    });
  }

  BusinessTriponLoad(){
      //list leave session
      this.apicall.listStatus(this.session_typeid).subscribe((res) => {
        this.sessiondata=res;     
      });
      //Permission limit
      this.apicall.displayGeneralData(this.company,this.value_type).subscribe((res) => {
        this.permissionlimit=res[0].DATA_VALUE;
      });
  }

  onsessionSelected(value:string){
    this.selectedsession=value; 
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

  ValidatePermissionForm(){
    if (this.PermissionForm.valid){
      this.isFormValid = true;
    }
    else{
      this.markFormGroupTouched(this.PermissionForm);
      this.durationValidator(this.duration);
    }
  }

  Clear_Permisssion(){
    this.PermissionForm.reset();   
    this.PermissionForm.get('session')?.setValue("");   
  }

  addPermissionRequest(){
    if (this.PermissionForm.valid) {
      const dateControl = this.PermissionForm.get('date');      
      const durationControl = this.PermissionForm.get('duration');
      const ReasonControl = this.PermissionForm.get('reason');
      
    if (dateControl && durationControl && ReasonControl) {  
      const data = {
        empcode:this.empcode,
        availed_date: dateControl.value,
        permission_duration: durationControl.value,
        permission_session:this.selectedsession,
        reason: ReasonControl.value, 
        };
      this.apicall.AddLeavePermission(data).subscribe((res) => {  
        if(res.Errorid==1){
          this.showModal = 1;
          this.success='Request saved successfully!';
        }
        else{
            this.showModal = 2; 
            this.failed='Failed!';     
        }
        this.FetchPermissions(); 
        this.PermissionForm.reset(); 
        this.PermissionForm.get('session')?.setValue(""); 
        this.Fetchcounts();
      });
    }
    } else {    
      this.markFormGroupTouched(this.PermissionForm);   
      this.durationValidator(this.duration);
    }
  }
  //permission end

  clear_teamfilter(){
    this.companyID = -1;
    this.department = -1;
    this.emp_code = -1;
    this.status = 0;
    this.FetchDates();
  }

  clear_personalfilter(){
    this.pstatus = 0;
    this.FetchDates();
  }
}
