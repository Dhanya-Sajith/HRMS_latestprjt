import { Component, OnInit, ViewChild} from '@angular/core';
import { ApiCallService } from 'src/app/api-call.service';
import { FormGroup , FormBuilder , FormControl , Validators } from '@angular/forms';
import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule }   from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/login.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-compensation',
  templateUrl: './compensation.component.html',
  styleUrls: ['./compensation.component.scss']
})
export class CompensationComponent implements OnInit {

  @ViewChild('closebutton') closebutton:any;
  @ViewChild('cancelclosebutton') cancelclosebutton:any;
  @ViewChild('SuccessRecordModal') SuccessRecordModal: any;

  userSession:any = this.session.getUserSession();
  empcode: any=this.userSession.empcode;
  empId: any=this.userSession.id;
  level:any =this.userSession.level;
  authorityflg:any =this.userSession.authorityflg;
  user:any;
  
  listCompany:any;
  listDepartment:any;
  listEmployee:any;
  listReqdt:any;
  CompoffReqdatedtl:any;
  typeid:number=12;
  reqdate: any;
  tid:number=26;
  listStatus: any;
  companyid: any = -1;
  departmentid: any = -1;
  employeeid: any = -1;
  statusid: any = 1;
  company_code: any;
  fromtime: any;
  totime: any;
  clhours: any;
  CompensationReq: any;
  Reqfilterdata: any;
  requestdt: any = -1;
  comp_word_date: any;
  compoffId: any;
  remarks: any;
  reqid: any;
  emp_code: any = -1;
  compoff_id: any;
  mflag: any;
  CompoffReqFilter: any;
  company: any= -1;
  department: any= -1;
  // status: any= 1;
  PersonalCompoffReq: any;
  showModal = 0;
  success:any="";
  failed:any="";  
  totalreq: any;
  totalPages:any;
  CompoffRequests: any;
  
  PrtotalPages:any;
  Prtotalreq: any;
  fromdate: any;
  todate: any;
  listdates: any;
  Personallistdates: any;
  pfromdate: any;
  ptodate: any;
  pstatus: any;
  flag: any;
  status: any = 0;
  searchInput: string = '';
  date = new Date();
  firstDay1 = new Date(this.date.getFullYear(), this.date.getMonth(), 1);
  lastDay1 = new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0);

  firstDay=this.datePipe.transform(this.firstDay1,"yyyy-MM-dd");
  lastDay=this.datePipe.transform(this.lastDay1,"yyyy-MM-dd");
  isSubmitted = false;
  reqID: any;
  approvelist: any;
  itemsPerPage=10;
  currentPage=1;
  desiredPage: any; 
  desiredPagePersonal: any;
  currentPagePersonal: any;
  // showModalPopUp : boolean = false;

  constructor(private apicall:ApiCallService, private datePipe: DatePipe,private fb:FormBuilder,private session:LoginService,private router:Router,private route: ActivatedRoute) { }

  ngOnInit(): void {

    this.route.queryParams
      .subscribe(params => {
        this.user = params['user']; 
      }
    );

    if(this.authorityflg === 0 || this.user == 'personal' || this.user == undefined){
      this.user = 'personal';
      this.flag = 0;
      this.PersonalReqData();
    }else{
      this.user = 'team';
      this.flag = 1;
    }

    this.StatusList();
    this.FetchDates();
    this.PersonalFetchDates();
    this.CompensationRequests();
    this.currentPage = 1; 
    this.currentPagePersonal =1;
    this.apicall.FetchCompanyList(this.empcode).subscribe((res)=>{
      this.listCompany=res;
    })

    this.apicall.FetchDepartmentList(this.companyid,this.empcode).subscribe(res =>{
      this.listDepartment=res;
    })

    this.apicall.FetchEmployeeList(this.departmentid,this.companyid,this.empcode).subscribe(res =>{
      this.listEmployee=res;
    })

    this.apicall.listCompoffReqdt(this.empcode).subscribe((res)=>{
      this.listReqdt=res;      
    })
    // alert(this.authorityflg)
    // alert(this.user)
  }

  // Radio button selection
  SelectTeamorpersonal(selectuser:any){
    this.user=selectuser
    if (this.user === 'personal') {
      this.flag = 0;
      this.PersonalReqData();
    }else{
      this.flag = 1;
      this.CompensationRequests();
    }  
    this.CompanyList();
  }
  
  // Company List
  CompanyList(){
    this.apicall.FetchCompanyList(this.empcode).subscribe((res)=>{
      this.listCompany=res;
    })
  }

  // Department List
  DepartmentListFn(company_code:any): void {
      this.company = company_code;
      this.apicall.FetchDepartmentList(this.company,this.empcode).subscribe(res =>{
           this.listDepartment=res;
      })
      this.CompensationReqFilter();
  }

  // Employee List
  EmployeeListFn(department_code:any,company_code:any): void {
      this.department = department_code;
      this.apicall.FetchEmployeeList(this.department,company_code,this.empcode).subscribe(res =>{
      this.listEmployee=res;
      })
      this.CompensationReqFilter();
  }

  // Change the Employee Selection
  OnChangeEmployee(empcode:any){
    this.emp_code = empcode;
    this.CompensationReqFilter();
  }

  // Change the Status 
  OnChangeStatus(status:any){
    this.status = status;
    this.CompensationReqFilter();
  }

  // Status List
  StatusList(){
    this.apicall.listStatus(this.tid).subscribe((res)=>{
      this.listStatus=res;
    })
  }

  // Fetch fromdate and todate
  FetchDates()
  {
    this.apicall.listFromToDates().subscribe(res=>{
      this.listdates = res;
      this.fromdate=this.datePipe.transform(this.listdates[0].FROM_DATE,'yyyy-MM-dd','en');
      this.todate=this.datePipe.transform(this.listdates[0].TO_DATE,'yyyy-MM-dd','en');
    })
  }

  // Personal Page Fetch fromdate and todate
  PersonalFetchDates()
  {
    this.apicall.listFromToDates().subscribe(res=>{
      this.Personallistdates = res;
      this.pfromdate=this.datePipe.transform(this.Personallistdates[0].FROM_DATE,'yyyy-MM-dd','en');
      this.ptodate=this.datePipe.transform(this.Personallistdates[0].TO_DATE,'yyyy-MM-dd','en');
    })
  }

  // Model fill data in combo work date selection
  FillReqData(empcode:any,reqdate:any){
    if(reqdate == -1){
      this.clearmodel();
    }else{
      this.requestdt = this.datePipe.transform(reqdate,"yyyy-MM-dd")
      this.apicall.CompoffReqdatedtl(empcode,this.requestdt).subscribe(res =>{
      this.CompoffReqdatedtl = res;
      this.fromtime=this.CompoffReqdatedtl[0].INTIME;
      this.totime=this.CompoffReqdatedtl[0].OUTTIME;
      this.clhours=this.CompoffReqdatedtl[0].OTHOURS;
    })
  }
  }

  // Compoff ID
  compoffreqId(compoffId:any){
    this.reqid = compoffId;
  }

  // Team selction fill compoff requests
  CompensationRequests(){
  this.apicall.CompensationReq(this.empcode,this.status,this.flag,this.firstDay,this.lastDay).subscribe(res=>{
      this.CompensationReq = res;
      
    })
  }

  // Combo box Change filtering
  CompensationReqFilter(){
    if( this.fromdate > this.todate){
      (<HTMLInputElement>document.getElementById("openModalButton")).click();
      this.showModal = 2;
      this.failed = "Please Correct the Dates";
    }else{
      const filterdata = {
        company:this.company,
        department:this.department, 
        emp_code:this.emp_code,
        status:this.status,
        fromdate:this.fromdate,
        todate:this.todate,
        authority:this.empcode
      };
      this.apicall.CompensationReqFilter(filterdata).subscribe(res=>{
        this.CompensationReq = res;
        const maxPageFiltered = Math.ceil(this.CompensationReq.length / this.itemsPerPage);  

        if (this.currentPage > maxPageFiltered) {
          this.currentPage = 1;     
        }   
         
      })
    }
  }

 

  // Personal radio button fill compoff requests
  PersonalReqData(){
    this.apicall.CompensationReq(this.empcode,this.status,this.flag,this.firstDay,this.lastDay).subscribe(res=>{
      this.PersonalCompoffReq = res;
     
    })
  }

  // Personal filter requset view
  PersonalReqFilter(){
    if( this.pfromdate > this.ptodate){
      (<HTMLInputElement>document.getElementById("openModalButton")).click();
      this.showModal = 2;
      this.failed = "Please Correct the Dates";
    }else{
      const fillstatus= (<HTMLInputElement>document.getElementById("pstatus")).value;
      this.apicall.CompensationReq(this.empcode,fillstatus,this.flag,this.pfromdate,this.ptodate).subscribe(res=>{
        this.PersonalCompoffReq = res;
        const maxPageFiltered = Math.ceil(this.PersonalCompoffReq.length / this.itemsPerPage);  

        if (this.currentPage > maxPageFiltered) {
          this.currentPage = 1;     
        }   
       
       
      })  
    }  
  }
  


  // Save Compoff Request By Employee
  onSubmit(){
    // alert(this.requestdt)
    if(this.requestdt == -1 || this.requestdt == ""){
      this.showModal = 2;
      this.failed = "Please Select the Compensation Date";
    }else{
    const requestdata = {
      empcode:this.empcode,
      comp_word_date:this.requestdt,
      fromtime:this.fromtime,
      totime:this.totime,
      clhours:this.clhours,
      expiry_date:this.requestdt,
    };
    this.apicall.AddCompoffReq(requestdata).subscribe(res=>{
      if(res.Errorid=='1')
      {
        this.showModal = 1; 
        this.success = "Compensation Requested Successfully"
      }
      else
      {
        this.showModal = 2;
        this.failed = "Compensation Request Failed";
      }
      this.clearmodel();
      this.PersonalReqData();
      this.closebutton.nativeElement.click();
    }) 
  }
  }

  // Approve compoff request by HR
  approveData(EMP_CODE:any,COMP_OFF_ID:any,flag:any){
    this.emp_code=EMP_CODE;
    this.compoff_id=COMP_OFF_ID;
    this.mflag=flag;

    if(this.mflag == 1){
      const approvedata = {
        empcode:this.emp_code,
        verified_by: this.empId,  
        verified_remarks: "",   
        compoff_id: this.compoff_id,
        mflag:this.mflag 
      };
      this.apicall.ApproveCompoffReq(approvedata).subscribe(res=>{
        if(res.Errorid=='1')
        {
          this.showModal = 1;
          this.success = "Approved Successfully";
        }
        else
        {
          this.showModal = 2;
          this.failed = "Failed";
        } 
        this.CompensationRequests();
      })
      
    }
  }

  // Reject compoff request by HR
  onReject(){   
    const rejectdata = {
      empcode:this.emp_code,
      verified_by: this.empId,  
      verified_remarks: this.remarks,   
      compoff_id: this.compoff_id,
      mflag:2
    };

    this.apicall.ApproveCompoffReq(rejectdata).subscribe(res=>{
      if(res.Errorid=='1')
        {
          this.showModal = 1;
          this.success = "Reject Compensation Request";
        }
        else
        {
          this.showModal = 2;
          this.failed = "Rejection Failed";
        } 
        this.CompensationRequests();
        this.closebutton.nativeElement.click();
        this.remarks="";
    })
  }

 // Cancel Compoff request by employee
 CancelCompoffReq(compoffId:any){
  const req_category='C';
  this.apicall.CancelRequests(this.empcode,compoffId,req_category).subscribe(res=>{
    if(res.Errorid=='1')
    {
      this.showModal = 1;
      this.success = "Cancel Compensation Request";
    }
    else
    {
      this.showModal = 2;
      this.failed = "Failed to cancel request";
    }
    this.PersonalReqData();
    this.cancelclosebutton.nativeElement.click();
  })
}

  clearmodel(){
    // this.requestdt="-1";
    this.fromtime="";
    this.totime="";
    this.clhours="";
    this.reqdate = document.getElementById("comp_word_date");
    this.reqdate.selectedIndex = -1;
  }

  // Status Approve List
  Approvelist(requestID: any){
    this.reqID = requestID
    this.apicall.StatusApproveList(2,this.reqID,'C').subscribe(res=>{
      this.approvelist = res;
    })
  }
  //PaginationTeam
  getTotalPages(): number {
    return Math.ceil(this.totalSearchResults / this.itemsPerPage);
  }
  
  goToPage() {
    const totalPages = Math.ceil(this.totalSearchResults / this.itemsPerPage);
    if (this.desiredPage >= 1 && this.desiredPage <= totalPages) {
      this.currentPage = this.desiredPage;
    } else {  
      
      (<HTMLInputElement>document.getElementById("openModalButton")).click();
      this.showModal = 2; 
      this.failed='Invalid page number!'; 
      this.desiredPage=''; 
    }   
   
  }
  getPageNumbers(currentPage: number): number[] {
    const totalPages = Math.ceil(this.totalSearchResults / this.itemsPerPage);
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
get totalSearchResults(): number {
  const totalResults = this.CompensationReq.filter((employee: any) => {
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
  changePage(page: number): void { 
    this.desiredPage = '';   
    this.currentPage = page;
    const maxPage = Math.ceil(this.totalSearchResults / this.itemsPerPage);
    if (this.currentPage > maxPage) {
      this.currentPage = 1;
    }        
  }
getEntriesStart(): number {
  if (this.currentPage === 1) {
    return 1;
  }
  
  const filteredData = this.CompensationReq.filter((employee: any) =>
    Object.values(employee).some((value: any) =>
      typeof value === 'string' &&
      value.toLowerCase().startsWith(this.searchInput.toLowerCase())
    )
  );

  const start = (this.currentPage - 1) * this.itemsPerPage + 1;
  return Math.min(start, filteredData.length);
}


getEntriesEnd(): number {  
  const filteredData = this.CompensationReq.filter((employee: any) =>
    Object.values(employee).some((value: any) =>
      typeof value === 'string' &&
      value.toLowerCase().startsWith(this.searchInput.toLowerCase())
    )
  );
  const end = this.currentPage * this.itemsPerPage;
  return Math.min(end, filteredData.length);
}
//PaginationPersonal
getTotalPagesPersonal(): number {
  return Math.ceil(this.totalSearchResultsPersonal / this.itemsPerPage);
}

goToPagePersonal() {
  const totalPages = Math.ceil(this.totalSearchResultsPersonal / this.itemsPerPage);
  if (this.desiredPagePersonal >= 1 && this.desiredPagePersonal <= totalPages) {
    this.currentPagePersonal = this.desiredPagePersonal;
  } else {  
    
    (<HTMLInputElement>document.getElementById("openModalButton")).click();
    this.showModal = 2; 
    this.failed='Invalid page number!'; 
    this.desiredPagePersonal=''; 
  }   
 
}
getPageNumbersPersonal(currentPage: number): number[] {
  const totalPages = Math.ceil(this.totalSearchResultsPersonal / this.itemsPerPage);
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
get totalSearchResultsPersonal(): number {
const totalResults = this.PersonalCompoffReq.filter((policy: any) => {
  return Object.values(policy).some((value: any) =>
    typeof value === 'string' && value.toLowerCase().startsWith(this.searchInput.toLowerCase())
  );
}).length;

const maxPageFiltered = Math.ceil(totalResults / this.itemsPerPage);  

if (this.currentPagePersonal > maxPageFiltered) {
  this.currentPagePersonal = 1; 
}

return totalResults;
}

// Function to change the current page
changePagePersonal(page: number): void { 
  this.desiredPagePersonal = '';   
  this.currentPagePersonal = page;
  const maxPage = Math.ceil(this.totalSearchResultsPersonal / this.itemsPerPage);
  if (this.currentPagePersonal > maxPage) {
    this.currentPagePersonal = 1;
  }        
}
getEntriesStartPersonal(): number {
if (this.currentPage === 1) {
  return 1;
}

const filteredData = this.PersonalCompoffReq.filter((policy: any) =>
  Object.values(policy).some((value: any) =>
    typeof value === 'string' &&
    value.toLowerCase().startsWith(this.searchInput.toLowerCase())
  )
);

const start = (this.currentPagePersonal - 1) * this.itemsPerPage + 1;
return Math.min(start, filteredData.length);
}


getEntriesEndPersonal(): number {  
const filteredData = this.PersonalCompoffReq.filter((policy: any) =>
  Object.values(policy).some((value: any) =>
    typeof value === 'string' &&
    value.toLowerCase().startsWith(this.searchInput.toLowerCase())
  )
);
const end = this.currentPagePersonal * this.itemsPerPage;
return Math.min(end, filteredData.length);
}
}