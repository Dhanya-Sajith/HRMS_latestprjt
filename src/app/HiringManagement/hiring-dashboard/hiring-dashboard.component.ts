import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl,FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ApiCallService } from 'src/app/api-call.service';
import { LoginService } from 'src/app/login.service';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-hiring-dashboard',
  templateUrl: './hiring-dashboard.component.html',
  styleUrls: ['./hiring-dashboard.component.scss']
})
export class HiringDashboardComponent implements OnInit {

  userSession:any = this.session.getUserSession();
  empcode: any=this.userSession.empcode;
  grpname:any=this.userSession.grpname;

  companydata: any;
  yeardata: any;
  statusdata: any;
  joblist: any;
  status: any = -1;
  year: any = -1;
  company: any = -1;

  desiredPage: any;
  searchInput: string='';
  itemsPerPage=10;
  currentPage=1;
  countlist: any;
  TOTAL: any;
  PENDING: any;
  APPROVED: any;
  HOLD: any;
  IN_PROCESS: any;
  REJECTED: any;
  ActiveREQ: any;
  ActiveEXP: any;
  jobdesc: any;
  PushForm: FormGroup;   
  isValid: boolean=false;
  showModal = 0;
  success:any="";
  failed:any="";
  isDisabled: boolean = false;
  inputfield: any;

  designation:any = -1;
  ApplicantsList: any;
  remarks: any;
  designationdata: any;
  searchInput1: string='';
  expviewflag: any;
  ApplyForm: FormGroup; 
  canddata: any;
  sourcetype: any;
  selectedtypeValue: any;
  activereqid: any;
  internal_empcode: any;
  candidate_name: any;
  Candidates: any;
  listgender: any;
  candstatus: any = -1;
  candcompany: any = -1;
  candlist: any;
  candstatusdata: any;

  EvaluatorForm: FormGroup; 
  Acivecandreqid: any;
  emplist: any;
  offerviewflag: number = 0;
  OfferForm: FormGroup; 
  nameflag: number = 0;
  searchInput2: string='';
  TransferForm: FormGroup; 
  selectdesig: any;
  user: any;
  offerstatus: any;

  constructor(private apicall:ApiCallService,private session:LoginService,private fb:FormBuilder,private datePipe: DatePipe,private route: ActivatedRoute, private cdr: ChangeDetectorRef) { 
    this.PushForm = this.fb.group({
      comments: ['', Validators.required],
    });
    this.ApplyForm = this.fb.group({
      type: ['', Validators.required],
      name: ['', Validators.required],
      interviewer: ['', Validators.required],
      designation: [''],
      cv: ['', Validators.required],
      gender: ['', Validators.required],
      SourceDetail: ['']
    });
    this.EvaluatorForm = this.fb.group({
      Evaluator: ['', Validators.required],
    });
    this.OfferForm = this.fb.group({
      Accptdt: ['', Validators.required],
      joindt: ['', Validators.required],
      status: ['', Validators.required],
      empname: [''],
    });
    this.TransferForm = this.fb.group({
      company: [''],
      designation: [''],
      department: [''],
      effectdt: ['', Validators.required],
    });
  }

  ngOnInit(): void {

    this.route.queryParams
      .subscribe(params => {        
        this.user = params['user'] || 'tab1';   
        this.setTab(this.user); 
      }
    );
    //Replacement/New Status 
    this.apicall.listRegStatus(83).subscribe((res)=>{
      this.offerstatus=res;
    })
    //company combo box
    this.apicall.FetchCompanyList(this.empcode).subscribe((res) => {
      this.companydata=res;      
    });
    //Year
    this.apicall.listYear().subscribe((res) => {
      this.yeardata=res;  
    });
    //Status 
    this.apicall.listRegStatus(82).subscribe((res)=>{
     this.statusdata=res;
    })
    this.JobRequests();
    // Subscribe to changes in 'type' to handle conditional validation
    this.ApplyForm.get('type')?.valueChanges.subscribe((value) => {
      this.selectedtypeValue = value;
      this.setConditionalValidationForSourceDetail();
    });
    this.OfferForm.get('status')?.valueChanges.subscribe((value) => {
      this.nameflag = value;
      this.Statuschange();
    });
  }

  setTab(tab: string) {
    this.user = tab;
    if(this.user == 'tab1')
    {
      this.JobRequests();
    }else if(this.user == 'tab2')
    {
      this.ApplicationInfo();
    }else if(this.user == 'tab3')
    {
      this.CandidateDashboard();
    }
    this.cdr.detectChanges();
  }

  setConditionalValidationForSourceDetail() {
    const sourceDetailControl = this.ApplyForm.get('SourceDetail');
    if (this.selectedtypeValue === '2' || this.selectedtypeValue === '3') {
      sourceDetailControl?.setValidators(Validators.required);
    } else {
      sourceDetailControl?.clearValidators();
    }
    sourceDetailControl?.updateValueAndValidity();
  }

  JobRequests()
  {
    this.apicall.HireRequest_StatusCount(this.empcode).subscribe((res) => {
      this.countlist=res;
      this.IN_PROCESS  = this.countlist[0].IN_PROCESS;
      this.APPROVED  = this.countlist[0].APPROVED;
      this.HOLD  = this.countlist[0].HOLD;
    });
    this.JobRequest_ListHR();
  }

  ApplicationInfo()
  {
    this.apicall.listRegStatus(2).subscribe((res)=>{
      this.designationdata=res;
     })
    this.FetchApplicantsList(-1);
  }

  CandidateDashboard()
  {
    //Status 
    this.apicall.listRegStatus(78).subscribe((res)=>{
      this.candstatusdata=res;
    })
    this.Candidate_ListHR()
  }

  //tab 1

  JobRequest_ListHR()
  {
    this.apicall.JobRequest_ListHR(this.empcode,this.status,this.year,this.company).subscribe((res) => {
      this.joblist=res;
    });
  }

  Jobdetails(REQID:any)
  {
    this.apicall.ViewJob_Description(REQID).subscribe((res) => {
      this.jobdesc=res;
    });
  }

  Pushtocareer(REQID:any,EXP:any,FLAG:any)
  {
     this.ActiveREQ = REQID;
     this.ActiveEXP = EXP;
     this.PushForm.controls['comments'].setValue(EXP);

     if(FLAG == 1)
      {
        this.expviewflag = true;
      }
      else
      {
        this.expviewflag = false;
      }
  }

  validatePushForm()
  {
    if (this.PushForm.valid){
      this.isValid = true;
    }
    else{
      this.markFormGroupTouched(this.PushForm);   
    }
  }

  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
    });
  }

  Push()
  {
    if (this.PushForm.valid) {
      const comments = this.PushForm.get('comments')?.value; 
      const data = {
        empcode : this.empcode,
        id : this.ActiveREQ,
        mflag : 1,
        update_string: comments
      };
      this.apicall.Hiring_Updates(data).subscribe(res=>{
        if(res.Errorid==1)
          {
            this.showModal = 1; 
            this.success = "Push to Career Successfully";   
            this.JobRequest_ListHR();
          }
          else{          
            this.showModal = 2;
            this.failed = "Failed!";      
          }
        this.PushForm.reset(); 
     })
   } else {    
     this.markFormGroupTouched(this.PushForm);   
   }
  }

  CandidateSelection(reqid:any,desig:any)
  {
    this.activereqid = reqid
    this.selectdesig = desig 
    this.apicall.listRegStatus(81).subscribe((res)=>{
      this.sourcetype=res;
     })
    this.apicall.CandidateNameCombo(reqid).subscribe((res) => {
      this.canddata=res;
    });
    this.apicall.listgender(5).subscribe((res)=>{
      this.listgender=res;
      })
    this.ApplyForm.controls['designation'].setValue(this.selectdesig);
    this.HireRequestCandidates();
  }

  showEmployeeList(event: Event) 
  {
    this.selectedtypeValue = (event.target as HTMLSelectElement).value;
    this.ApplyForm.controls['name'].setValue("");
  }

  validateApplyForm()
  {
    if (this.ApplyForm.valid){
      this.isValid = true;
      }
      else{
        this.markFormGroupTouched(this.ApplyForm);   
      }
  }

  uploadCV()
  {
    if (this.ApplyForm.valid) {
      const docname = this.ApplyForm.get('cv')?.value; 
      const interviewer = this.ApplyForm.get('interviewer')?.value; 
      const designation = this.ApplyForm.get('designation')?.value;
      const name = this.ApplyForm.get('name')?.value;
      const type = this.ApplyForm.get('type')?.value;
      const gender = this.ApplyForm.get('gender')?.value;
      const SourceDetail = this.ApplyForm.get('SourceDetail')?.value;

      if( type == 0){
        this.internal_empcode = name;
        this.candidate_name= "";
      }else{
        this.candidate_name= name;
        this.internal_empcode = "";
      }

      const data = {
        reqId : this.activereqid,
        source_type : type,
        gender:gender,
        internal_empcode : this.internal_empcode,
        candidate_name: this.candidate_name,
        cv_fileName : docname,
        interviewers:interviewer,
        updated_by:this.empcode,
        source_detail:SourceDetail
      };
      
      this.apicall.HR_AddCandidateDetails(data).subscribe(res=>{
      if(res.Errorid > 0)
       {
         const input=document.getElementById("formFile");    
         const fdata = new FormData();
         this.onFileSelect(input,res.Errorid);
         this.JobRequest_ListHR();
       }
     })
   } else {    
     this.markFormGroupTouched(this.ApplyForm);   
   }
  }

  onFileSelect(input:any,id:any)
  {   
    if (input.files && input.files[0]) {
      const fdata = new FormData();
      fdata.append('filesup',input.files[0]);
      this.apicall.HR_CandidateDocUpload(fdata,id).subscribe((res)=>{
        if(res>=0)
        {   
          this.inputfield = document.getElementById("formFile");
          this.inputfield.selectedIndex = 0;
          // this.ApplyForm.reset(); 
          this.HireRequestCandidates();
          this.ApplyForm.reset(); 
        }
        else{          
          // this.ApplyForm.reset(); 
          this.HireRequestCandidates();    
        }
        this.ApplyForm.reset(); 
        this.ApplyForm.controls['designation'].setValue(this.selectdesig);
      })
    }
  }

  HireRequestCandidates()
  {
    this.apicall.HireRequestCandidates(this.activereqid).subscribe((res) => {
      this.Candidates=res;
    });
  }

  download_documents_cand(REQID:any)
  {
    let fileurl=this.apicall.GetCandidateCV(REQID,'C');
    let link = document.createElement("a");
      
       if (link.download !== undefined) {
          link.setAttribute("href", fileurl);
          link.setAttribute('target', '_blank');
          link.setAttribute("download", "ReportFile.xlsx");
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
       }
  }

  DeleteCand(reqid:any,candid:any)
  {
    this.apicall.HR_EditCandidateDetails(reqid,candid).subscribe((res) => {
      this.HireRequestCandidates();
    });
  }

  Activerequest(REQID:any)
  {
    this.ActiveREQ = REQID;
  }
  
  Discontinued()
  {
    const data = {
      empcode : this.empcode,
      id : this.ActiveREQ,
      mflag : 8,
      update_string: ""
    };
    this.apicall.Hiring_Updates(data).subscribe(res=>{
      if(res.Errorid==1)
        {
          this.showModal = 1; 
          this.success = "Discontinued job position";   
          this.JobRequest_ListHR();
        }
        else{  
          this.showModal = 2;
          this.failed = "Failed!";      
        }
    })
  }

  Hold(reqid:any)
  {
    const data = {
      empcode : this.empcode,
      id : reqid,
      mflag : 3,
      update_string: ""
    };
    this.apicall.Hiring_Updates(data).subscribe(res=>{
      if(res.Errorid==1)
        {
          this.showModal = 1; 
          this.success = "Hiring Hold Successfully";   
          this.JobRequest_ListHR();
        }
        else{  
          this.showModal = 2;
          this.failed = "Failed!";      
        }
    })
  }

  ResumeHiring(reqid:any)
  {
    const data = {
      empcode : this.empcode,
      id : reqid,
      mflag : 7,
      update_string: ""
    };
    this.apicall.Hiring_Updates(data).subscribe(res=>{
      if(res.Errorid==1)
        {
          this.showModal = 1; 
          this.success = "Resume Hiring Successfully";   
          this.JobRequest_ListHR();
        }
        else{  
          this.showModal = 2;
          this.failed = "Failed!";      
        }
    })
  }

  //tab 2

  FetchApplicants()
  {
    this.apicall.FetchApplicantsList(-1,this.designation, this.empcode).subscribe((res) => {
      this.ApplicantsList=res;
    });
  }

  FetchApplicantsList(reqid:any)
  {
    this.apicall.FetchApplicantsList(reqid,this.designation, this.empcode).subscribe((res) => {
      this.ApplicantsList=res;
    });
  }

  activateSecondTab(reqid:any) {
    this.user = 'tab2';
    this.FetchApplicantsList(reqid);
  }

  viewremarks(remark:any)
  {
    this.remarks = remark;
  }

  download_documents(req_id:any){
    let fileurl=this.apicall.GetCandidateCV(req_id,'J');
    let link = document.createElement("a");
      
       if (link.download !== undefined) {
          link.setAttribute("href", fileurl);
          link.setAttribute('target', '_blank');
          link.setAttribute("download", "ReportFile.xlsx");
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
       }
  }

 //tab 3
 Candidate_ListHR()
  {
    this.apicall.Candidate_ListHR(this.empcode,this.candstatus,this.candcompany).subscribe((res) => {
      this.candlist=res;
    });
  }

  CandidateActive(REQID:any)
  {
    this.Acivecandreqid = REQID;
    this.apicall.ResourceEmployeesComboData(-1,-1,this.empcode,1).subscribe((res) => {
      this.emplist=res;
    });
  }

  validateEvaluatorForm()
  {
    if (this.EvaluatorForm.valid){
      this.isValid = true;
      }
      else{
        this.markFormGroupTouched(this.EvaluatorForm);   
      }
  }

  Evaluator()
  {
    if (this.EvaluatorForm.valid) {
      const Evaluator = this.EvaluatorForm.get('Evaluator')?.value; 
      const data = {
        empcode : this.empcode,
        id : this.Acivecandreqid,
        mflag : 2,
        update_string: Evaluator
      };
      this.apicall.Hiring_Updates(data).subscribe(res=>{
        if(res.Errorid==1)
          {
            this.showModal = 1; 
            this.success = "Evaluator Saved Successfully"; 
            this.Candidate_ListHR();  
          }
          else{          
            this.showModal = 2;
            this.failed = "Failed!";      
          }
        this.EvaluatorForm.reset(); 
    })
    } else {    
    this.markFormGroupTouched(this.EvaluatorForm);   
    }
  }

  ConvertEmployee(candid:any,reqid:any,type:any)
  {
    // Convert to Employee Successfully!
    const data = {
      user : this.empcode,
      candid : candid,
      reqid : reqid,
      source_type: type
    };
    this.apicall.ConvertToEmployee_HR(data).subscribe(res=>{
      if(res.Errorid==1)
        {
          this.showModal = 1; 
          this.success = " Convert to Employee Successfully!";   
          this.Candidate_ListHR();
        }
        else{   
          this.showModal = 2;
          this.failed = "Failed!";      
        }
    })
  }

  offerLetterReleased()
  {
    this.offerviewflag = 0
    const data = {
      empcode : this.empcode,
      id : this.Acivecandreqid,
      mflag : 4,
      update_string: ""
    };
    this.apicall.Hiring_Updates(data).subscribe(res=>{
      if(res.Errorid==1)
        {
          (<HTMLInputElement>document.getElementById("openModalButton")).click();
          this.showModal = 1; 
          this.success = "Offer Letter Released";   
          this.Candidate_ListHR();
        }
        else{  
          (<HTMLInputElement>document.getElementById("openModalButton")).click();        
          this.showModal = 2;
          this.failed = "Failed!";      
        }
    })
  }

  validateOfferForm()
  {
    if (this.OfferForm.valid){
      this.isValid = true;
      }
      else{
        this.markFormGroupTouched(this.OfferForm);   
      }
  }

  offerLetterAccept()
  {
    this.offerviewflag = 1
    if (this.OfferForm.valid) {
      const Accptdt = this.OfferForm.get('Accptdt')?.value; 
      const joindt = this.OfferForm.get('joindt')?.value; 
      const status = this.OfferForm.get('status')?.value; 
      const empname = this.OfferForm.get('empname')?.value; 
      const data = {
        empcode : this.empcode,
        id : this.Acivecandreqid,
        mflag : 5,
        accept_date: Accptdt,
        expect_join_date : joindt,
        hiring_type : status,
        emp_name: empname,
      };
      this.apicall.Update_OfferAccept_Details(data).subscribe(res=>{
        if(res.Errorid==1)
          {
            this.showModal = 1; 
            this.success = "offer Letter Accept Successfully";   
            this.Candidate_ListHR();
          }
          else{          
            this.showModal = 2;
            this.failed = "Failed!";      
          }
        this.OfferForm.reset(); 
    })
    } else {    
    this.markFormGroupTouched(this.OfferForm);   
    }
  }

  clear(form: any)
  {
    form.reset(); 
  }

  OfferLetterNotAccepted()
  {
    this.offerviewflag = 0
    const data = {
      empcode : this.empcode,
      id : this.Acivecandreqid,
      mflag : 6,
      update_string: ""
    };
    this.apicall.Hiring_Updates(data).subscribe(res=>{
      if(res.Errorid==1)
        {
          (<HTMLInputElement>document.getElementById("openModalButton")).click();
          this.showModal = 1; 
          this.success = "Offer Letter Not Accepted";   
          this.Candidate_ListHR();
        }
        else{   
          (<HTMLInputElement>document.getElementById("openModalButton")).click();       
          this.showModal = 2;
          this.failed = "Failed!";      
        }
    })
  }

  Statuschange()
  {
    const sourceDetailControl = this.OfferForm.get('empname');
    if (this.selectedtypeValue === '1') {
      sourceDetailControl?.setValidators(Validators.required);
    } else {
      sourceDetailControl?.clearValidators();
    }
    sourceDetailControl?.updateValueAndValidity();
  }

  EmployeeDetails(data:any)
  {
    this.TransferForm.controls['company'].setValue(data.COMPANY_CODE);
    this.TransferForm.controls['department'].setValue(data.DEPARTMENT);
    this.TransferForm.controls['designation'].setValue(data.DESIGNATION);
    this.Acivecandreqid = data.EMP_CODE;
  }

  validateTransferForm()
  {
    if (this.TransferForm.valid){
      this.isValid = true;
    }
    else{
      this.markFormGroupTouched(this.TransferForm);   
    }
  }

  Transfer()
  {
    if (this.TransferForm.valid) {
      const effectdt = this.TransferForm.get('effectdt')?.value; 
      const data = {
        candid : this.Acivecandreqid,
        effectdate : effectdt,
        enterby : this.empcode
      };
      this.apicall.Save_Employee_Transfer(data).subscribe(res=>{
        if(res.Errorid==1)
          {
            this.showModal = 1; 
            this.success = "Employee Transfered Successfully";   
            this.Candidate_ListHR();
          }
          else{          
            this.showModal = 2;
            this.failed = "Failed!";      
          }
        this.TransferForm.reset(); 
    })
    } else {    
    this.markFormGroupTouched(this.TransferForm);   
    }
  }

//Pagination - tab3
getTotalPages3(): number {
  return Math.ceil(this.totalSearchResults3 / this.itemsPerPage);
}

goToPage3() {
  const totalPages = Math.ceil(this.totalSearchResults3 / this.itemsPerPage);
  if (this.desiredPage >= 1 && this.desiredPage <= totalPages) {
    this.currentPage = this.desiredPage;
  } else {  
    
    (<HTMLInputElement>document.getElementById("openModalButton")).click();
    this.showModal = 2; 
    this.failed='Invalid page number!'; 
    this.desiredPage=''; 
  }   
 
}
getPageNumbers3(currentPage: number): number[] {
  const totalPages = Math.ceil(this.totalSearchResults3 / this.itemsPerPage);
  const maxPageNumbers = 5; 
  const middlePage = Math.ceil(maxPageNumbers / 2);
  let startPage = Math.max(currentPage - middlePage, 1);
  let endPage = Math.min(startPage + maxPageNumbers - 1, totalPages);

  if (endPage - startPage + 1 < maxPageNumbers) {
    startPage = Math.max(endPage - maxPageNumbers + 1, 1);
  }

  return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
}

// Function to Calculate the total number of search results
get totalSearchResults3(): number {
    const totalResults = this.candlist.filter((employee: any) => {
      return Object.values(employee).some((value: any) =>
        typeof value === 'string' && value.toLowerCase().startsWith(this.searchInput2.toLowerCase())
      );
    }).length;

    const maxPageFiltered = Math.ceil(totalResults / this.itemsPerPage);  

    if (this.currentPage > maxPageFiltered) {
      this.currentPage = 1; 
    }

    return totalResults;
}

// Function to change the current page
changePage3(page: number): void { 
  this.desiredPage = '';   
  this.currentPage = page;
  const maxPage = Math.ceil(this.totalSearchResults3 / this.itemsPerPage);
  if (this.currentPage > maxPage) {
    this.currentPage = 1;
  }        
}
getEntriesStart3(): number {
if (this.currentPage === 1) {
  return 1;
}

const filteredData = this.candlist.filter((employee: any) =>
  Object.values(employee).some((value: any) =>
    typeof value === 'string' &&
    value.toLowerCase().startsWith(this.searchInput2.toLowerCase())
  )
);

const start = (this.currentPage - 1) * this.itemsPerPage + 1;
return Math.min(start, filteredData.length);
}


getEntriesEnd3(): number {  
const filteredData = this.candlist.filter((employee: any) =>
  Object.values(employee).some((value: any) =>
    typeof value === 'string' &&
    value.toLowerCase().startsWith(this.searchInput2.toLowerCase())
  )
);
const end = this.currentPage * this.itemsPerPage;
return Math.min(end, filteredData.length);
}

//Pagination - tab2
getTotalPages2(): number {
  return Math.ceil(this.totalSearchResults2 / this.itemsPerPage);
}

goToPage2() {
  const totalPages = Math.ceil(this.totalSearchResults2 / this.itemsPerPage);
  if (this.desiredPage >= 1 && this.desiredPage <= totalPages) {
    this.currentPage = this.desiredPage;
  } else {  
    
    (<HTMLInputElement>document.getElementById("openModalButton")).click();
    this.showModal = 2; 
    this.failed='Invalid page number!'; 
    this.desiredPage=''; 
  }   
 
}
getPageNumbers2(currentPage: number): number[] {
  const totalPages = Math.ceil(this.totalSearchResults2 / this.itemsPerPage);
  const maxPageNumbers = 5; 
  const middlePage = Math.ceil(maxPageNumbers / 2);
  let startPage = Math.max(currentPage - middlePage, 1);
  let endPage = Math.min(startPage + maxPageNumbers - 1, totalPages);

  if (endPage - startPage + 1 < maxPageNumbers) {
    startPage = Math.max(endPage - maxPageNumbers + 1, 1);
  }

  return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
}

// Function to Calculate the total number of search results
get totalSearchResults2(): number {
    const totalResults = this.ApplicantsList.filter((employee: any) => {
      return Object.values(employee).some((value: any) =>
        typeof value === 'string' && value.toLowerCase().startsWith(this.searchInput1.toLowerCase())
      );
    }).length;

    const maxPageFiltered = Math.ceil(totalResults / this.itemsPerPage);  

    if (this.currentPage > maxPageFiltered) {
      this.currentPage = 1; 
    }

    return totalResults;
}

// Function to change the current page
changePage2(page: number): void { 
  this.desiredPage = '';   
  this.currentPage = page;
  const maxPage = Math.ceil(this.totalSearchResults2 / this.itemsPerPage);
  if (this.currentPage > maxPage) {
    this.currentPage = 1;
  }        
}
getEntriesStart2(): number {
if (this.currentPage === 1) {
  return 1;
}

const filteredData = this.ApplicantsList.filter((employee: any) =>
  Object.values(employee).some((value: any) =>
    typeof value === 'string' &&
    value.toLowerCase().startsWith(this.searchInput1.toLowerCase())
  )
);

const start = (this.currentPage - 1) * this.itemsPerPage + 1;
return Math.min(start, filteredData.length);
}


getEntriesEnd2(): number {  
const filteredData = this.ApplicantsList.filter((employee: any) =>
  Object.values(employee).some((value: any) =>
    typeof value === 'string' &&
    value.toLowerCase().startsWith(this.searchInput1.toLowerCase())
  )
);
const end = this.currentPage * this.itemsPerPage;
return Math.min(end, filteredData.length);
}

//Pagination - tab1
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
  const maxPageNumbers = 5; 
  const middlePage = Math.ceil(maxPageNumbers / 2);
  let startPage = Math.max(currentPage - middlePage, 1);
  let endPage = Math.min(startPage + maxPageNumbers - 1, totalPages);

  if (endPage - startPage + 1 < maxPageNumbers) {
    startPage = Math.max(endPage - maxPageNumbers + 1, 1);
  }

  return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
}

get totalSearchResults(): number {
    const totalResults = this.joblist.filter((employee: any) => {
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

const filteredData = this.joblist.filter((employee: any) =>
  Object.values(employee).some((value: any) =>
    typeof value === 'string' &&
    value.toLowerCase().startsWith(this.searchInput.toLowerCase())
  )
);

const start = (this.currentPage - 1) * this.itemsPerPage + 1;
return Math.min(start, filteredData.length);
}


getEntriesEnd(): number {  
const filteredData = this.joblist.filter((employee: any) =>
  Object.values(employee).some((value: any) =>
    typeof value === 'string' &&
    value.toLowerCase().startsWith(this.searchInput.toLowerCase())
  )
);
const end = this.currentPage * this.itemsPerPage;
return Math.min(end, filteredData.length);
}
}
