import { Component, OnInit } from '@angular/core';
import { ApiCallService } from 'src/app/api-call.service';
import { LoginService } from 'src/app/login.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

@Component({
  selector: 'app-hiring-center',
  templateUrl: './hiring-center.component.html',
  styleUrls: ['./hiring-center.component.scss']
})
export class HiringCenterComponent implements OnInit {

  userSession:any = this.session.getUserSession();
  empcode: any=this.userSession.empcode;
  level: any=this.userSession.level;
  authorityflg:any =this.userSession.authorityflg;
  grpname:any=this.userSession.grpname; 
  desig:any=this.userSession.desig.split('#', 2);   
  desigid:any= this.desig[0]; 

  addJobPostForm: FormGroup;
  dropdownSettings:IDropdownSettings={};
  companylist: any;
  deptlist: any;
  desiglist: any;
  showDesig: boolean=false;
  selectedDesig:any=-2;
  locationlist: any;
  employementTypes: any;
  WorkSchedule: any;
  showNoOfDays: boolean=false;
  showModal: any;
  success: any;
  failed: any;
  HireRequests: any;
  selectedStatusReq: any=0;
  yearReq: any=new Date().getFullYear();
  item: any;
  JobDescription: any;
  company: any;
  department: any;
  designation: any;
  work_location: any;
  no_of_openings: any;
  employment_type: any;
  contract_work_days: any;
  employment_type_id: any;
  work_schedule: any;
  comments: any;
  approver: any;
  Primary_resp: any;
  required_education: any;
  required_exp: any;
  required_skills: any;
  Statusreq: any;
  yeardata: any;
  searchInput:string='';
  searchInputApproval:string='';
  searchInputCandidate:string='';
  currentPagePersonal=1;
  itemsPerPagePersonal=4;
  itemsPerPageApproval=10;
  currentPageApproval=1;
  desiredPageApproval: any; 
  desiredPagePersonal: any;
  itemsPerPageCandidate=10;
  currentPageCandidate=1;
  desiredPageCandidate: any; 
  mflag: any=1;
  selectedStatusApproval:any=0;
  yearApproval:any=new Date().getFullYear();
  HireRequestsApproval: any;
  empdata: any;
  position_flag: any;
  StatusCandidate: any;
  selectedStatusCandidate:any=0;
  yearCandidate=new Date().getFullYear();
  CandidateEvaluationList: any;


  constructor(private apicall:ApiCallService,private session:LoginService,private fb: FormBuilder) {
    this.addJobPostForm = this.fb.group({
      company_code: ['', Validators.required],
      desig: ['', Validators.required],
      dept: ['', Validators.required],
      no_of_opening: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      work_location: ['', Validators.required],
      employment_type: ['', Validators.required],
      work_schedule: ['', Validators.required],
      comments: ['', Validators.required],
      approver_id: [''],
      job_title: [''],
      no_of_days: [''],
      prime_resp: [''],
      req_education: [''],
      reqd_exp: [''],
      req_keyskill: ['']
    });
   }

  ngOnInit(): void {
    this.dropdownSettings = {
      idField: 'EMP_CODE',
      textField: 'EMP_NAME',
      itemsShowLimit: 1,
      limitSelection: 1,
      allowSearchFilter: true,
      clearSearchFilter: true,
    };
    //Company
    this.apicall.FetchCompanyList_Resource(this.empcode).subscribe((res) => {
      this.companylist=res;      
    }); 
    //Department
    this.apicall.listCompany(1).subscribe((res)=>{
      this.deptlist=res;
    })
    //Designation
    this.apicall.listCompany(2).subscribe((res)=>{
      this.desiglist=res;
    })
    //Work Location
    this.apicall.listCompany(32).subscribe((res)=>{
      this.locationlist=res;
    })
    //Employement Type
    this.apicall.listCompany(79).subscribe((res)=>{
      this.employementTypes=res;
    })
    //Work Schedule
    this.apicall.listCompany(9).subscribe((res)=>{
      this.WorkSchedule=res;
    })    
    //Status new hire request
    this.apicall.listCompany(82).subscribe((res)=>{
      this.Statusreq=res;
    })
    //Status candidate evaluation
    this.apicall.listCompany(70).subscribe((res)=>{
      this.StatusCandidate=res;
    })
   //Year
   this.apicall.listYear().subscribe((res) => {
    this.yeardata=res;      
  });
  //Employee drop down
  this.apicall.ResourceEmployeesComboData(-1,-1,this.empcode,1).subscribe((res)=>{
    this.empdata=res;
   }) 
    
    if(!this.grpname.includes('HR') && !this.grpname.includes('HOD')){
      this.addJobPostForm.get('approver_id')?.setValidators(Validators.required);
    }else{
      this.addJobPostForm.get('approver_id')?.clearValidators();
    }
    this.addJobPostForm.get('approver_id')?.updateValueAndValidity();
    if(!this.grpname.includes('HR') && !this.grpname.includes('HOD') && !this.grpname.includes('LM')){
      this.ontabSelected(2);
    }else{
      this.FetchHireRequests();
    }
  }
   //New hire requests
  FetchHireRequests(){
    this.apicall.Fetch_HireRequest(this.empcode,this.selectedStatusReq,this.yearReq,1).subscribe((res)=>{
      this.HireRequests=res;
      //alert(JSON.stringify(res))
      const maxPageFiltered = Math.ceil(this.HireRequests.length / this.itemsPerPagePersonal);  

      if (this.currentPagePersonal > maxPageFiltered) {
        this.currentPagePersonal = 1;     
      } 
    }) 
  }
  ontabSelected(mflag:any){
    //Hiring Requests
    if(mflag==1){
      this.apicall.Fetch_HireRequest(this.empcode,this.selectedStatusReq,this.yearReq,1).subscribe((res)=>{
        this.HireRequests=res;
        //alert(JSON.stringify(res))
        const maxPageFiltered = Math.ceil(this.HireRequests.length / this.itemsPerPagePersonal);  

      if (this.currentPagePersonal > maxPageFiltered) {
        this.currentPagePersonal = 1;     
      } 
      })  
    }else if(mflag==2){ //Approval Requests
      this.apicall.Fetch_HireRequest(this.empcode,this.selectedStatusApproval,this.yearApproval,2).subscribe((res)=>{
        this.HireRequestsApproval=res;
       //alert(JSON.stringify(res))
       const maxPageFiltered = Math.ceil(this.HireRequestsApproval.length / this.itemsPerPageApproval);  

      if (this.currentPageApproval > maxPageFiltered) {
        this.currentPageApproval = 1;     
      } 
      })  
    }else{ //Candidate Evaluation Process
      this.apicall.Fetch_HireRequest(this.empcode,this.selectedStatusCandidate,this.yearCandidate,3).subscribe((res)=>{
        this.CandidateEvaluationList=res;
        //alert(JSON.stringify(res))
        const maxPageFiltered = Math.ceil(this.CandidateEvaluationList.length / this.itemsPerPageCandidate);  

        if (this.currentPageCandidate > maxPageFiltered) {
          this.currentPageCandidate = 1;     
        } 
      }) 
    }   

  }
  onDesigSelected() {
    const designation = this.addJobPostForm.get('desig')?.value;
    const employmenttype = this.addJobPostForm.get('employment_type')?.value;
    if (designation === '-1') {
      this.showDesig = true;
      this.addJobPostForm.get('job_title')?.setValidators(Validators.required);
      this.addJobPostForm.get('prime_resp')?.setValidators(Validators.required);
      this.addJobPostForm.get('req_education')?.setValidators(Validators.required);
      this.addJobPostForm.get('reqd_exp')?.setValidators([Validators.required]);
      this.addJobPostForm.get('req_keyskill')?.setValidators(Validators.required);
    } else {
      this.showDesig = false;
      this.addJobPostForm.get('job_title')?.clearValidators();
      this.addJobPostForm.get('prime_resp')?.clearValidators();
      this.addJobPostForm.get('req_education')?.clearValidators();
      this.addJobPostForm.get('reqd_exp')?.clearValidators();
      this.addJobPostForm.get('req_keyskill')?.clearValidators();
    }
    if(employmenttype==2||employmenttype==3){
      this.showNoOfDays = true;
      this.addJobPostForm.get('no_of_days')?.setValidators([Validators.required, Validators.pattern('^[0-9]+$')]);
    }else{
      this.showNoOfDays = false;
      this.addJobPostForm.get('no_of_days')?.clearValidators();
    }
    this.addJobPostForm.get('no_of_days')?.updateValueAndValidity();
    this.addJobPostForm.get('job_title')?.updateValueAndValidity();
    this.addJobPostForm.get('prime_resp')?.updateValueAndValidity();
    this.addJobPostForm.get('req_education')?.updateValueAndValidity();
    this.addJobPostForm.get('reqd_exp')?.updateValueAndValidity();
    this.addJobPostForm.get('req_keyskill')?.updateValueAndValidity();
  }

  onSubmit() {    
    if (this.addJobPostForm.valid) {     
      const data={
        req_by:this.empcode,
        grpname:this.grpname,        
        ...this.addJobPostForm.value           
    };
    console.log(JSON.stringify(data));
    this.apicall.Add_NewHire_request(data).subscribe((res) => {
      //alert(JSON.stringify(res));   
      if (res.Errorid == 1) {
        (<HTMLInputElement>document.getElementById("openModalButton")).click();
          this.showModal = 1;
          this.success = "Request added successfully!";                
      } else{
        (<HTMLInputElement>document.getElementById("openModalButton")).click();
          this.showModal = 2;
          this.failed = "Failed!";
      } 
        this.FetchHireRequests();
        this.ClearAddJobPostForm(); 
          
    });
    } else{   
      this.markFormGroupTouched(this.addJobPostForm);
    }
  }
  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
  ClearAddJobPostForm() {
    this.addJobPostForm.reset();   
    this.addJobPostForm.get('company_code')?.setValue("");
    this.addJobPostForm.get('desig')?.setValue("");
    this.addJobPostForm.get('dept')?.setValue("");
    this.addJobPostForm.get('work_location')?.setValue("");
    this.addJobPostForm.get('employment_type')?.setValue("");
    this.addJobPostForm.get('work_schedule')?.setValue("");
    this.addJobPostForm.get('approver_id')?.setValue("");
    this.showDesig = false;   
    this.showNoOfDays = false;
  }
  selectedItem(item:any){
   this.item=item;
  }
  ViewJobDetails(reqId:any){
    this.apicall.ViewJob_Description(reqId).subscribe((res)=>{
      this.JobDescription=res;
      //alert(JSON.stringify(res));
      this.company=res[0].COMPANY;
      this.designation=res[0].DESIGNATION;
      this.department=res[0].DEPARTMENT;
      this.no_of_openings=res[0].NO_OF_POSITIONS;
      this.work_location=res[0].WORK_LOCATION;
      this.employment_type=res[0].EMPLOYMENT_TYPE;
      this.employment_type_id=res[0].EMPLOYMENT_TYPE_ID;
      this.contract_work_days=res[0].CONTRACT_WORKDAYS;
      this.work_schedule=res[0].WORK_SCHEDULE;
      this.comments=res[0].COMMENTS;
      this.approver=res[0].APPROVER;
      this.Primary_resp=res[0].PRIM_RESP;
      this.required_education=res[0].REQD_EDUC;
      this.required_exp=res[0].REQD_EXPER;
      this.required_skills=res[0].REQD_SKILLS;
      this.position_flag=res[0].POSITION_FLAG;
    });
  }
  CancelReq(){
    this.apicall.CancelRequests(this.empcode,this.item.REQID,'H').subscribe((res)=>{
      if (res.Errorid == 1) {
        (<HTMLInputElement>document.getElementById("openModalButton")).click();
          this.showModal = 1;
          this.success = "Request cancelled successfully!";                
      } else{
        (<HTMLInputElement>document.getElementById("openModalButton")).click();
          this.showModal = 2;
          this.failed = "Failed!";
      } 
      this.FetchHireRequests();       
    })
  }
  //Approval Page 
  ApproveReject(item:any,status:any,messaage:any){       
      const data={
        req_id:item.REQID,
        status:status,
        updated_by:this.empcode,
        requested_by:item.EMP_CODE,     
          
       };
    console.log(JSON.stringify(data));
    this.apicall.ApproveReject_HiringRequest(data).subscribe((res) => {
      //alert(JSON.stringify(res));   
      if (res.Errorid == 1) {
        (<HTMLInputElement>document.getElementById("openModalButton")).click();
          this.showModal = 1;
          this.success = "Request "+ messaage +" successfully!";                
      } else{
        (<HTMLInputElement>document.getElementById("openModalButton")).click();
          this.showModal = 2;
          this.failed = "Failed!";
      } 
        this.ontabSelected(2);     
          
    });
  }

  //Requests Page
  getTotalPagesPersonal(): number {
    return Math.ceil(this.totalSearchResultsPersonal / this.itemsPerPagePersonal);
    }
    
    goToPagePersonal() {
    const totalPages = Math.ceil(this.totalSearchResultsPersonal / this.itemsPerPagePersonal);
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
    const totalPages = Math.ceil(this.totalSearchResultsPersonal / this.itemsPerPagePersonal);
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
    const totalResults = this.HireRequests.filter((employee: any) => {
    return Object.values(employee).some((value: any) =>
      typeof value === 'string' && value.toLowerCase().startsWith(this.searchInput.toLowerCase())
    );
    }).length;
    
    const maxPageFiltered = Math.ceil(totalResults / this.itemsPerPagePersonal);  
    
    if (this.currentPagePersonal > maxPageFiltered) {
    this.currentPagePersonal = 1; 
    }
    
    return totalResults;
    }
    
    // Function to change the current page
    changePagePersonal(page: number): void { 
    this.desiredPagePersonal = '';   
    this.currentPagePersonal = page;
    const maxPage = Math.ceil(this.totalSearchResultsPersonal / this.itemsPerPagePersonal);
    if (this.currentPagePersonal > maxPage) {
      this.currentPagePersonal = 1;
    }        
    }
    getEntriesStartPersonal(): number {
    if (this.currentPagePersonal === 1) {
    return 1;
    }
    
    const filteredData = this.HireRequests.filter((employee: any) =>
    Object.values(employee).some((value: any) =>
      typeof value === 'string' &&
      value.toLowerCase().startsWith(this.searchInput.toLowerCase())
    )
    );
    
    const start = (this.currentPagePersonal - 1) * this.itemsPerPagePersonal + 1;
    return Math.min(start, filteredData.length);
    }  
    
    getEntriesEndPersonal(): number {  
    const filteredData = this.HireRequests.filter((employee: any) =>
    Object.values(employee).some((value: any) =>
      typeof value === 'string' &&
      value.toLowerCase().startsWith(this.searchInput.toLowerCase())
    )
    );
    const end = this.currentPagePersonal * this.itemsPerPagePersonal;
    return Math.min(end, filteredData.length);
    }

    //Approval Page
    getTotalPagesApproval(): number {
      return Math.ceil(this.totalSearchResultsApproval / this.itemsPerPageApproval);
      }
      
      goToPageApproval() {
      const totalPages = Math.ceil(this.totalSearchResultsApproval / this.itemsPerPageApproval);
      if (this.desiredPageApproval >= 1 && this.desiredPageApproval <= totalPages) {
        this.currentPageApproval = this.desiredPageApproval;
      } else {  
        
        (<HTMLInputElement>document.getElementById("openModalButton")).click();
        this.showModal = 2; 
        this.failed='Invalid page number!'; 
        this.desiredPageApproval=''; 
      }   
      
      }
      getPageNumbersApproval(currentPage: number): number[] {
      const totalPages = Math.ceil(this.totalSearchResultsApproval / this.itemsPerPageApproval);
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
      get totalSearchResultsApproval(): number {
      const totalResults = this.HireRequestsApproval.filter((employee: any) => {
      return Object.values(employee).some((value: any) =>
        typeof value === 'string' && value.toLowerCase().startsWith(this.searchInputApproval.toLowerCase())
      );
      }).length;
      
      const maxPageFiltered = Math.ceil(totalResults / this.itemsPerPageApproval);  
      
      if (this.currentPageApproval > maxPageFiltered) {
      this.currentPageApproval = 1; 
      }
      
      return totalResults;
      }
      
      // Function to change the current page
      changePageApproval(page: number): void { 
      this.desiredPageApproval = '';   
      this.currentPageApproval = page;
      const maxPage = Math.ceil(this.totalSearchResultsApproval / this.itemsPerPageApproval);
      if (this.currentPageApproval > maxPage) {
        this.currentPageApproval = 1;
      }        
      }
      getEntriesStartApproval(): number {
      if (this.currentPageApproval === 1) {
      return 1;
      }
      
      const filteredData = this.HireRequestsApproval.filter((employee: any) =>
      Object.values(employee).some((value: any) =>
        typeof value === 'string' &&
        value.toLowerCase().startsWith(this.searchInputApproval.toLowerCase())
      )
      );
      
      const start = (this.currentPageApproval - 1) * this.itemsPerPageApproval + 1;
      return Math.min(start, filteredData.length);
      }  
      
      getEntriesEndApproval(): number {  
      const filteredData = this.HireRequestsApproval.filter((employee: any) =>
      Object.values(employee).some((value: any) =>
        typeof value === 'string' &&
        value.toLowerCase().startsWith(this.searchInputApproval.toLowerCase())
      )
      );
      const end = this.currentPageApproval * this.itemsPerPageApproval;
      return Math.min(end, filteredData.length);
      }
     //Candidate Evaluation Page
     getTotalPagesCandidate(): number {
      return Math.ceil(this.totalSearchResultsCandidate / this.itemsPerPageCandidate);
      }
      
      goToPageCandidate() {
      const totalPages = Math.ceil(this.totalSearchResultsCandidate / this.itemsPerPageCandidate);
      if (this.desiredPageCandidate >= 1 && this.desiredPageCandidate <= totalPages) {
        this.currentPageCandidate = this.desiredPageCandidate;
      } else {  
        
        (<HTMLInputElement>document.getElementById("openModalButton")).click();
        this.showModal = 2; 
        this.failed='Invalid page number!'; 
        this.desiredPageCandidate=''; 
      }   
      
      }
      getPageNumbersCandidate(currentPage: number): number[] {
      const totalPages = Math.ceil(this.totalSearchResultsCandidate / this.itemsPerPageCandidate);
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
      get totalSearchResultsCandidate(): number {
      const totalResults = this.CandidateEvaluationList.filter((employee: any) => {
      return Object.values(employee).some((value: any) =>
        typeof value === 'string' && value.toLowerCase().startsWith(this.searchInputCandidate.toLowerCase())
      );
      }).length;
      
      const maxPageFiltered = Math.ceil(totalResults / this.itemsPerPageCandidate);  
      
      if (this.currentPageCandidate > maxPageFiltered) {
      this.currentPageCandidate = 1; 
      }
      
      return totalResults;
      }
      
      // Function to change the current page
      changePageCandidate(page: number): void { 
      this.desiredPageCandidate = '';   
      this.currentPageCandidate = page;
      const maxPage = Math.ceil(this.totalSearchResultsCandidate / this.itemsPerPageCandidate);
      if (this.currentPageCandidate > maxPage) {
        this.currentPageCandidate = 1;
      }        
      }
      getEntriesStartCandidate(): number {
      if (this.currentPageCandidate === 1) {
      return 1;
      }
      
      const filteredData = this.CandidateEvaluationList.filter((employee: any) =>
      Object.values(employee).some((value: any) =>
        typeof value === 'string' &&
        value.toLowerCase().startsWith(this.searchInputCandidate.toLowerCase())
      )
      );
      
      const start = (this.currentPageCandidate - 1) * this.itemsPerPageCandidate + 1;
      return Math.min(start, filteredData.length);
      }  
      
      getEntriesEndCandidate(): number {  
      const filteredData = this.CandidateEvaluationList.filter((employee: any) =>
      Object.values(employee).some((value: any) =>
        typeof value === 'string' &&
        value.toLowerCase().startsWith(this.searchInputCandidate.toLowerCase())
      )
      );
      const end = this.currentPageCandidate * this.itemsPerPageCandidate;
      return Math.min(end, filteredData.length);
      }
    
}


