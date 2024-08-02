import { Component, OnInit } from '@angular/core';
import { ApiCallService } from 'src/app/api-call.service';
import { LoginService } from 'src/app/login.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-goal-setting-nanalytics-hr',
  templateUrl: './goal-setting-nanalytics-hr.component.html',
  styleUrls: ['./goal-setting-nanalytics-hr.component.scss']
})
export class GoalSettingNanalyticsHRComponent implements OnInit {

  userSession:any = this.session.getUserSession();
  empcode: any=this.userSession.empcode;
  level: any=this.userSession.level;
  authorityflg:any =this.userSession.authorityflg;
  grpname:any=this.userSession.grpname; 
  desig:any=this.userSession.desig.split('#', 2);   
  desigid:any= this.desig[0]; 

  GoalSettingReqForm: FormGroup;
  EditGoalSettingForm: FormGroup;
  InitiateEvaluationForm: FormGroup;
  BulkUploadForm:FormGroup;
  dropdownSettings:IDropdownSettings={};
  companydata: any;
  yeardata: any;
  selectedCompanyid: any=-1;
  deptdata: any;
  empdata: any;
  selectedEmpcode: any;
  YearGoalSetting = new Date().getFullYear();
  CompanyGoalSetting:any=-1;
  GoalSettingData: any;
  GoalSettingstatus: any;
  SelectedGoalSettingstatus:any=0;
  showModal: any;
  success: any;
  failed: any;
  searchInput: string='';
  itemsPerPage=10;
  currentPage=1;
  desiredPage: any; 
  minDate: any;
  item: any;
  targetDate: any;
  statusData: any;
  updatedBy: any;
  reqStatus: any;
  StatusVal: any;
  target_Date: any;
  remarks: any;
  itemClicked: any;
  ReviewYear: any;
  Employee: any;
  Employee_title: any;
  GoalDetails: any;
  selectedYearAssessment:any= new Date().getFullYear();
  selectedCompanyAssessment:any=-1;
  selectedStatusAssessment:any=3;
  AssessmentData: any;
  currentPageAssessment: number=1;
  itemsPerPageAssessment: any=10;
  searchInputAssessment:string='';
  showUploadfile: boolean=false;
  requestStatus: any;
  showInitiateEvaluation: boolean=false;
  checkedItems: any;
  data: any;
  desiredPageAssessment: any;
  selectedDept: any=-1;
  selectedYearPerformance: any= new Date().getFullYear();
  selectedCompanyPerformance: any=-1;
  PerformanceData: any;
  currentPagePerformance: number=1;
  itemsPerPagePerformance: any=10;
  searchInputPerformance:string='';
  desiredPagePerformance: any;
  allChecked: boolean = false; 
  statusdata: any;
  user: any='tab1';
 

  constructor(private apicall:ApiCallService,private session:LoginService,private fb: FormBuilder,private datePipe: DatePipe,private route: ActivatedRoute,private router: Router) { 
    this.GoalSettingReqForm = this.fb.group({
      company_code: ['', Validators.required],
      employee: ['', Validators.required],
      targetDate: ['', Validators.required],      
    });
    this.EditGoalSettingForm = this.fb.group({     
      targetDate: ['', Validators.required],      
    });
    this.BulkUploadForm = this.fb.group({     
      doc: ['', Validators.required],      
    });
    this.InitiateEvaluationForm = this.fb.group({     
      targetDate: ['', Validators.required],      
    });
  }
  ngOnInit(): void {
    this.route.queryParams
    .subscribe(params => {        
      this.user = params['user']|| 'tab1';                     
    }
  ); 
    const today = new Date();   
    today.setDate(today.getDate() + 1); // Tomorrow's date
    this.minDate = today.toISOString().split('T')[0];
    this.dropdownSettings = {
      idField: 'EMP_CODE',
      textField: 'EMP_NAME',
      itemsShowLimit: 3,
      limitSelection: -1,
      allowSearchFilter: true,
      clearSearchFilter: true,
    };
     //company combo box
     this.apicall.FetchCompanyList(this.empcode).subscribe((res) => {
      this.companydata=res;      
    });
    //Year
    this.apicall.listYear().subscribe((res) => {
      this.yeardata=res;      
    }); 
    //Goal Setting Status
    this.apicall.listCompany(84).subscribe((res) => {
      this.GoalSettingstatus=res;      
    });  
    this.FetchGoalSettingData(1);    
  }
  onCompanySelected() {
    this.apicall.FetchDepartmentList(this.selectedCompanyPerformance,this.empcode).subscribe((res) => {
      this.deptdata=res; 
      // this.deptdata.unshift({ KEY_ID: -1, DATA_VALUE: 'All' });
      //alert(JSON.stringify(this.deptdata))   
    });
    this.FetchPerformanceAnalyticsData();    
   }
   onCompanySelectedGoalSetting(){
    this.selectedEmpcode=this.GoalSettingReqForm.get('company_code')?.value;
    //Employee drop down
    this.apicall.Employees_ForGoalAssign(this.selectedEmpcode,this.empcode).subscribe((res) => {
      this.empdata=res; 
     // alert(JSON.stringify(this.empdata))     
    });
   }
   FetchGoalSettingData(mflag:any){
    if(mflag==1){
   this.apicall.GoalSetting_ListHR(this.empcode,this.SelectedGoalSettingstatus,this.YearGoalSetting,this.CompanyGoalSetting,1).subscribe((res)=>{
    this.GoalSettingData=res;
    //alert(JSON.stringify(this.GoalSettingData));
    const maxPageFiltered = Math.ceil(this.GoalSettingData.length / this.itemsPerPage);  

      if (this.currentPage > maxPageFiltered) {
        this.currentPage = 1;     
      } 
    }); 
   }else{
    this.apicall.GoalSetting_ListHR(this.empcode,this.selectedStatusAssessment,this.selectedYearAssessment,this.selectedCompanyAssessment,2).subscribe((res)=>{
      this.AssessmentData=res;
      //alert(JSON.stringify(this.GoalSettingData));
      const maxPageFiltered = Math.ceil(this.AssessmentData.length / this.itemsPerPageAssessment);  
  
        if (this.currentPageAssessment > maxPageFiltered) {
          this.currentPageAssessment = 1;     
        } 
      });    

      this.allChecked = false;
      this.showInitiateEvaluation=false;
   }
   }
   AddGoalSettingReq(){
    if (this.GoalSettingReqForm.valid) {
      const data={
        ...this.GoalSettingReqForm.value,
        updatedBy:this.empcode
      };
      //alert(JSON.stringify(data)) 
      this.apicall.Add_GoalSetting_RequestHR(data).subscribe((res) => {
        //alert(JSON.stringify(res));
        if(res.Errorid==1){
          (<HTMLInputElement>document.getElementById("openModalButton")).click();
          this.showModal = 1;
          this.success = "Request added successfully!";
        }
        else{
          (<HTMLInputElement>document.getElementById("openModalButton")).click();
          this.showModal = 2;
          this.failed = "Failed!";
        }
        this.FetchGoalSettingData(1);
        this.cancelGoalSettingReqForm();           
        });
    } else{   
      this.markFormGroupTouched(this.GoalSettingReqForm);
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
  cancelGoalSettingReqForm(){
    this.GoalSettingReqForm.reset();
    this.GoalSettingReqForm.get('company_code')?.setValue('')
  }
  selectedItem(item:any){
   this.item=item; 
   this.requestStatus=item.REQUEST_STATUS;  
   this.targetDate=this.datePipe.transform(this.item.TARGET_DATE, 'yyyy-MM-dd');
   //alert(this.requestStatus)
   this.EditGoalSettingForm.get('targetDate')?.setValue(this.targetDate);
   this.InitiateEvaluationForm.get('targetDate')?.setValue(this.targetDate);
   this.itemClicked = item;
  }
  EditGoalSettingTargetDate(){
    if (this.EditGoalSettingForm.valid) {
      const data={
        updatedBy:this.empcode,
        ...this.EditGoalSettingForm.value,
        mflag:1,
        employee: [{ REQ_ID:this.item.REQUEST_ID, EMP_CODE:this.item.EMP_CODE }]
      }
     console.log((JSON.stringify(data)))
     this.apicall.Update_ReviewOrTargetDate_HR(data).subscribe((res) => {
      //alert(JSON.stringify(res));
      if(res.Errorid==1){
        (<HTMLInputElement>document.getElementById("openModalButton")).click();
        this.showModal = 1;
        this.success = "Changes saved successfully!";
      }
      else{
        (<HTMLInputElement>document.getElementById("openModalButton")).click();
        this.showModal = 2;
        this.failed = "Failed!";
      }
      this.FetchGoalSettingData(1); 
                 
      });
    }else{   
      this.markFormGroupTouched(this.EditGoalSettingForm);
    }
  }
  cancelEditTargetDate(){
    this.EditGoalSettingForm.get('targetDate')?.setValue(this.targetDate);
  }
  cancelGoalSettingReq(){
    const data={
      empcode:this.item.EMP_CODE,
      reqid:this.item.REQUEST_ID,
      updated_by:this.empcode,
      Sflag:11 
    };
    console.log((JSON.stringify(data)))
    this.apicall.CancelRequest_HR(data).subscribe((res) => {
     //alert(JSON.stringify(res));
     if(res.Errorid==1){
       (<HTMLInputElement>document.getElementById("openModalButton")).click();
       this.showModal = 1;
       this.success = "Cancelled successfully!";
     }
     else{
       (<HTMLInputElement>document.getElementById("openModalButton")).click();
       this.showModal = 2;
       this.failed = "Failed!";
     }
     this.FetchGoalSettingData(1);            
     });
  }
  Uploadfile(flag:any){
    this.showUploadfile=flag;
  }
  BulkUpload(){
    if (this.BulkUploadForm.valid) {        
      let input:any;
      input=document.getElementById("formFile");       
          
        if (input.files && input.files[0]) {      
         const fdata = new FormData();         
         fdata.append('postedFile',input.files[0]);     
         this.apicall.UploadGoal_BulkData(fdata,this.empcode).subscribe((res)=>{
           const result=res;
           //alert(JSON.stringify(res))
           if(res==1){
            (<HTMLInputElement>document.getElementById("openModalButton")).click();
            this.showModal = 1;
            this.success = "Document uploaded successfully!";
          }
          else{
            (<HTMLInputElement>document.getElementById("openModalButton")).click();
            this.showModal = 2;
            this.failed = "Failed!";
          }
          this.BulkUploadForm.reset();
          this.FetchGoalSettingData(1);
         })      
       }      
    }else{   
      this.markFormGroupTouched(this.BulkUploadForm);
    }
  }
  download_to_excel(){
    let fileurl=this.apicall.SalaryRevisionTemplate('P');
    let link = document.createElement("a");
      
       if (link.download !== undefined) {
          link.setAttribute("href", fileurl);
          link.setAttribute("download", "ReportFile.xlsx");
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
       }
  }
  viewStatusModel(item:any){
    // alert(JSON.stringify(item))
    this.apicall.Goal_Status_LogDetails(item.EMP_CODE,item.REQUEST_ID).subscribe((res)=>{ 
       console.log(JSON.stringify(res))   
       this.statusdata=res;      
       this.itemClicked = item;      
    })
  }
  clearHighlight() {
    setTimeout(() => {
    this.itemClicked = null;// Reset itemClicked to remove highlight
    }, 500); 
  }
  ViewGoalDetails(item:any){
    this.apicall.Goal_Details_Emp(item.EMP_CODE,item.REQUEST_ID).subscribe((res)=>{      
      this.ReviewYear=res[0].YEAR;
      this.Employee=res[0].EMP_NAME;
      this.Employee_title=res[0].DESIGNATION;
      this.GoalDetails=res;      
      this.itemClicked = item;      
    })
  }
  //Assessment tab
  InitiateEvaluation(){
    if (this.InitiateEvaluationForm.valid) {
      if(this.showInitiateEvaluation){
        this.data={
          updatedBy:this.empcode,
          ...this.InitiateEvaluationForm.value,
          mflag:2,
          employee: this.checkedItems,
        }
      }else{
      this.data={
        updatedBy:this.empcode,
        ...this.InitiateEvaluationForm.value,
        mflag:2,
        employee: [{ REQ_ID:this.item.REQUEST_ID, EMP_CODE:this.item.EMP_CODE }]
      }
    }
     console.log((JSON.stringify(this.data)))
     this.apicall.Update_ReviewOrTargetDate_HR(this.data).subscribe((res) => {
      //alert(JSON.stringify(res));
      if(res.Errorid==1){
        (<HTMLInputElement>document.getElementById("openModalButton")).click();
        this.showModal = 1;
        this.success = "Changes saved successfully!";
      }
      else{
        (<HTMLInputElement>document.getElementById("openModalButton")).click();
        this.showModal = 2;
        this.failed = "Failed!";
      }
      this.FetchGoalSettingData(2); 
                 
      });
    }else{   
      this.markFormGroupTouched(this.InitiateEvaluationForm);
    }
  }
  cancelInitiateEvaluationForm(){
    this.InitiateEvaluationForm.get('targetDate')?.setValue(this.targetDate);
  }
  clearInitiateEvaluationForm(){
    this.InitiateEvaluationForm.reset();
  }
  checkAll(event: any) {
    const isChecked = event.target.checked;
    if(isChecked){
      this.showInitiateEvaluation=true;
      this.InitiateEvaluationForm.get('targetDate')?.setValue('');
    }else{
      this.showInitiateEvaluation=false;
    }
    // Update only the items with REQUEST_STATUS == 3
    this.AssessmentData.forEach((item: { REQUEST_STATUS: number; checked: boolean; }) => {
      if (item.REQUEST_STATUS === 3) {
        item.checked = isChecked;        
      }
    });    
    //alert(JSON.stringify(this.AssessmentData))
    this.checkedItems = this.AssessmentData
    .filter((item: { checked: any; }) => item.checked) 
    .map((item: { REQUEST_ID: any; EMP_CODE: any; }) => ({               
      REQ_ID: item.REQUEST_ID,
      EMP_CODE: item.EMP_CODE
    })); 
  console.log(this.checkedItems);
  this.requestStatus=3;
  } 

  //Performance Analytics
  FetchPerformanceAnalyticsData(){
    this.apicall.PerformanceAnalytics_ListHR(this.empcode,this.selectedDept,this.selectedYearPerformance,this.selectedCompanyPerformance).subscribe((res)=>{
      this.PerformanceData=res;
      //alert(JSON.stringify(this.GoalSettingData));
      const maxPageFiltered = Math.ceil(this.PerformanceData.length / this.itemsPerPagePerformance);  
  
        if (this.currentPagePerformance > maxPageFiltered) {
          this.currentPagePerformance = 1;     
        } 
      }); 

  }
  //Goal Setting Pagination
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
  const totalResults = this.GoalSettingData.filter((employee: any) => {
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
  
  const filteredData = this.GoalSettingData.filter((employee: any) =>
    Object.values(employee).some((value: any) =>
      typeof value === 'string' &&
      value.toLowerCase().startsWith(this.searchInput.toLowerCase())
    )
  );

  const start = (this.currentPage - 1) * this.itemsPerPage + 1;
  return Math.min(start, filteredData.length);
}
getEntriesEnd(): number {  
  const filteredData = this.GoalSettingData.filter((employee: any) =>
    Object.values(employee).some((value: any) =>
      typeof value === 'string' &&
      value.toLowerCase().startsWith(this.searchInput.toLowerCase())
    )
  );
  const end = this.currentPage * this.itemsPerPage;
  return Math.min(end, filteredData.length);
}
//Assessment Pagination
getTotalPagesAssessment(): number {
  return Math.ceil(this.totalSearchResultsAssessment / this.itemsPerPageAssessment);
}

goToPageAssessment() {
  const totalPages = Math.ceil(this.totalSearchResultsAssessment / this.itemsPerPageAssessment);
  if (this.desiredPageAssessment >= 1 && this.desiredPageAssessment <= totalPages) {
    this.currentPageAssessment = this.desiredPageAssessment;
  } else {  
    
    (<HTMLInputElement>document.getElementById("openModalButton")).click();
    this.showModal = 2; 
    this.failed='Invalid page number!'; 
    this.desiredPageAssessment=''; 
  }   
 
}
getPageNumbersAssessment(currentPage: number): number[] {
  const totalPages = Math.ceil(this.totalSearchResultsAssessment / this.itemsPerPageAssessment);
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
get totalSearchResultsAssessment(): number {
const totalResults = this.AssessmentData.filter((employee: any) => {
  return Object.values(employee).some((value: any) =>
    typeof value === 'string' && value.toLowerCase().startsWith(this.searchInputAssessment.toLowerCase())
  );
}).length;

const maxPageFiltered = Math.ceil(totalResults / this.itemsPerPageAssessment);  

if (this.currentPageAssessment > maxPageFiltered) {
  this.currentPageAssessment = 1; 
}

return totalResults;
}

// Function to change the current page
changePageAssessment(page: number): void { 
  this.desiredPageAssessment = '';   
  this.currentPageAssessment = page;
  const maxPage = Math.ceil(this.totalSearchResultsAssessment / this.itemsPerPageAssessment);
  if (this.currentPageAssessment > maxPage) {
    this.currentPageAssessment = 1;
  }        
}
getEntriesStartAssessment(): number {
if (this.currentPageAssessment === 1) {
  return 1;
}

const filteredData = this.AssessmentData.filter((employee: any) =>
  Object.values(employee).some((value: any) =>
    typeof value === 'string' &&
    value.toLowerCase().startsWith(this.searchInputAssessment.toLowerCase())
  )
);

const start = (this.currentPageAssessment - 1) * this.itemsPerPageAssessment + 1;
return Math.min(start, filteredData.length);
}
getEntriesEndAssessment(): number {  
const filteredData = this.AssessmentData.filter((employee: any) =>
  Object.values(employee).some((value: any) =>
    typeof value === 'string' &&
    value.toLowerCase().startsWith(this.searchInputAssessment.toLowerCase())
  )
);
const end = this.currentPageAssessment * this.itemsPerPageAssessment;
return Math.min(end, filteredData.length);
}
//Performance Pagination
getTotalPagesPerformance(): number {
  return Math.ceil(this.totalSearchResultsPerformance / this.itemsPerPagePerformance);
}

goToPagePerformance() {
  const totalPages = Math.ceil(this.totalSearchResultsPerformance / this.itemsPerPagePerformance);
  if (this.desiredPagePerformance >= 1 && this.desiredPagePerformance <= totalPages) {
    this.currentPagePerformance = this.desiredPagePerformance;
  } else {  
    
    (<HTMLInputElement>document.getElementById("openModalButton")).click();
    this.showModal = 2; 
    this.failed='Invalid page number!'; 
    this.desiredPagePerformance=''; 
  }   
 
}
getPageNumbersPerformance(currentPage: number): number[] {
  const totalPages = Math.ceil(this.totalSearchResultsPerformance / this.itemsPerPagePerformance);
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
get totalSearchResultsPerformance(): number {
const totalResults = this.PerformanceData.filter((employee: any) => {
  return Object.values(employee).some((value: any) =>
    typeof value === 'string' && value.toLowerCase().startsWith(this.searchInputPerformance.toLowerCase())
  );
}).length;

const maxPageFiltered = Math.ceil(totalResults / this.itemsPerPagePerformance);  

if (this.currentPagePerformance > maxPageFiltered) {
  this.currentPagePerformance = 1; 
}

return totalResults;
}

// Function to change the current page
changePagePerformance(page: number): void { 
  this.desiredPagePerformance = '';   
  this.currentPagePerformance = page;
  const maxPage = Math.ceil(this.totalSearchResultsPerformance / this.itemsPerPagePerformance);
  if (this.currentPagePerformance > maxPage) {
    this.currentPagePerformance = 1;
  }        
}
getEntriesStartPerformance(): number {
if (this.currentPagePerformance === 1) {
  return 1;
}

const filteredData = this.PerformanceData.filter((employee: any) =>
  Object.values(employee).some((value: any) =>
    typeof value === 'string' &&
    value.toLowerCase().startsWith(this.searchInputPerformance.toLowerCase())
  )
);

const start = (this.currentPagePerformance - 1) * this.itemsPerPagePerformance + 1;
return Math.min(start, filteredData.length);
}
getEntriesEndPerformance(): number {  
const filteredData = this.PerformanceData.filter((employee: any) =>
  Object.values(employee).some((value: any) =>
    typeof value === 'string' &&
    value.toLowerCase().startsWith(this.searchInputPerformance.toLowerCase())
  )
);
const end = this.currentPagePerformance * this.itemsPerPagePerformance;
return Math.min(end, filteredData.length);
}

}
