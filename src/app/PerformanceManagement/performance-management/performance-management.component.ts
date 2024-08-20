import { Component, OnInit, ViewChild} from '@angular/core';
import { ApiCallService } from 'src/app/api-call.service';
import { FormGroup , FormBuilder , FormControl , Validators, FormArray } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Router, ActivatedRoute, ResolveEnd } from '@angular/router';
import { LoginService } from 'src/app/login.service';

@Component({
  selector: 'app-performance-management',
  templateUrl: './performance-management.component.html',
  styleUrls: ['./performance-management.component.scss']
})
export class PerformanceManagementComponent implements OnInit {

  userSession:any = this.session.getUserSession();
  empcode: any=this.userSession.empcode;

  user:any = 'personal';
  companydata: any;
  yeardata: any;
  statusdata: any;
  year:any = -1;
  status:any = -1;
  teamyear:any = -1;
  teamstatus:any = 0;
  isValid: boolean=false;
  showModal = 0;
  success:any="";
  failed:any="";
  isDisabled: boolean = false;
  searchInput: string='';
  AcceptanceForm:any = FormGroup;
  RejectForm:any = FormGroup;
  selectyear: any;
  Evaluationdata: any;
  Reqid: any;
  emp_code: any;
  Activeyear: any;
  EvaluationdataLM: any;
  TargetForm:any = FormGroup;
  emname: any;
  empyear: any;
  desig: any;
  period: any;
  EmpGoalList: any;
  GoalList: any;

  itemsPerPage=10;
  currentPage=1;
  desiredPage: any;
  viewflag: number = 0;
  vstatus: any;

  constructor(private apicall:ApiCallService, private datePipe: DatePipe,private fb:FormBuilder,private session:LoginService,private router:Router,private route: ActivatedRoute) { 
    this.AcceptanceForm = this.fb.group({
      comment: ['', Validators.required],
    });
    this.RejectForm = this.fb.group({
      reason: ['', Validators.required],
    });
    this.TargetForm = this.fb.group({
      tableRows: this.fb.array([])
    });
  }

  ngOnInit(): void {

    this.route.queryParams
      .subscribe(params => {
        this.user = params['user']; 
      }
    );
    if( this.user == 'personal' || this.user == undefined){
      this.user = 'personal';
      this.Fetch_EmpGoalRequest();
    }else{
      this.user = 'team';
      this.Fetch_EmpGoalRequestsLM();
    }

    //company combo box
    this.apicall.FetchCompanyList(this.empcode).subscribe((res) => {
      this.companydata=res;      
    });
    //Year
    this.apicall.listYear().subscribe((res) => {
      this.yeardata=res;  
      if (this.yeardata.length > 0) {
        this.year = this.yeardata[0].DISPLAY_FIELD;
        this.teamyear  = this.yeardata[0].DISPLAY_FIELD;
        this.Fetch_EmpGoalRequest();
      } 
    });
    //Status 
    this.apicall.listRegStatus(84).subscribe((res)=>{
      this.statusdata=res;
    })
    //Goal Progress period
    this.apicall.listRegStatus(85).subscribe((res)=>{
      this.period=res;
    })
    let j=0;
    for(j=0;j<1;j++)
    {
      this.addTableRow();
    }
  }

  // Radio button selection
  SelectTeamorpersonal(selectuser:any){
    this.user=selectuser
      if (this.user === 'personal') {
        this.Fetch_EmpGoalRequest();
      }else{
        this.Fetch_EmpGoalRequestsLM();
      }  
  }

  get tableRows(): FormArray {
    return this.TargetForm.get('tableRows') as FormArray;
  }

  addTableRow() {
    this.tableRows.push(this.fb.group({
      description: [''],
      weight: [''],
      reviewPeriod: [''],
      id: [null] 
    }));
  }

  removeFromTable(index: number) {
    const control = <FormArray>this.TargetForm.controls['tableRows'];
    const row = control.at(index).value;
    if (row.id) {
      this.Remove(row.id);
    } else {
      control.removeAt(index);
    }
  }

  ActiveData(data:any)
  {
    this.emname = data.EMP_NAME;
    this.empyear = data.YEAR;
    this.desig = data.REMARKS;
    this.emp_code = data.EMP_CODE
    this.Reqid = data.REQUEST_ID;
    if(data.REQUEST_STATUS == 4 || data.REQUEST_STATUS == 0 )
    {
      this.viewflag = 1;
    }
    else{
      this.viewflag = 0;
    }
    this.apicall.Fetch_GoalDetails(this.emp_code,this.empyear,this.Reqid).subscribe((res) => {
      this.GoalList = res; 
      this.populateForm(this.GoalList);
    });
  }

  populateForm(GoalList:any) {
    const control = <FormArray>this.TargetForm.controls['tableRows'];
    control.clear(); 
    
    GoalList.forEach((goal: any) => {
      control.push(this.fb.group({
        description: [goal.GOAL_DESCRIPTION || '', Validators.required], 
        weight: [goal.WEIGTAGE || '', Validators.required], 
        reviewPeriod: [goal.REVIEW_PERIOD || '', Validators.required] ,
        id: [goal.GOAL_ID || null]
      }));
    });
    console.log('Form after population:', this.TargetForm.value); 
  }

  Remove(goal_id: string) {
    const data = {
      reqID: this.Reqid,
      year: this.empyear,
      emp_code: this.emp_code,
      updatedby: this.empcode,
      goal_id: goal_id
    };
    this.apicall.RemoveEmpGoal(data).subscribe(res => {
      // Remove the row from the form array after successful deletion
      const control = <FormArray>this.TargetForm.controls['tableRows'];
      const index = control.controls.findIndex(x => x.value.id === goal_id);
      if (index > -1) {
        control.removeAt(index);
      }
    });
  }

  ActiveRequest(reqid:any,empcode:any,year:any)
  {
    this.Reqid = reqid;
    this.emp_code = empcode;
    this.Activeyear = year;
  }

  Fetch_EmpGoalRequest(){
    this.apicall.Fetch_EmpGoalRequest(this.empcode,this.year).subscribe((res) => {
      this.Evaluationdata = res;    
      this.vstatus = this.Evaluationdata[0].REQUEST_STATUS;
    });
    this.Fetch_EmpGoalDetails();
  }

  Fetch_EmpGoalDetails()
  {
    this.apicall.Fetch_EmpGoalDetails(this.empcode,this.year).subscribe((res) => {
      this.EmpGoalList= res;    
    });
  }

  Fetch_EmpGoalRequestsLM(){
    this.apicall.Fetch_EmpGoalRequestsLM(this.empcode,this.teamyear,this.teamstatus).subscribe((res) => {
      this.EvaluationdataLM = res;   
    });
  }

  getStatusClass(status: number) {
    if ([0, 5, 13].includes(status)) {
      return 'bg-info-subtle text-blue';
    } else if ([1, 3, 6, 10, 8].includes(status)) {
      return 'bg-success-subtle text-success';
    } else if ([2, 4, 7, 11,12].includes(status)) {
      return 'bg-danger-subtle text-danger';
    } else if (status === 9) {
      return 'bg-warning-subtle text-warning';
    } else {
      return ''; // Default class if none of the cases match
    }
  }
  

  validateAcceptanceForm()
  {
    if (this.AcceptanceForm.valid){
      this.isValid = true;
    }
    else{
      this.markFormGroupTouched(this.AcceptanceForm);   
    }
  }

  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
    });
  }

  Acceptance()
  {
    if (this.AcceptanceForm.valid) {
      const comments = this.AcceptanceForm.get('comment')?.value; 
      const data = {
        reqID : this.Reqid,
        year : this.Activeyear,
        mflag : 1,
        emp_code : this.emp_code,
        comments: comments
      };
      this.apicall.EmpGoalApproveReject(data).subscribe(res=>{
        if(res.Errorid==1)
          {
            this.showModal = 1; 
            this.success = "Accept Successfully";   
            this.Fetch_EmpGoalRequest();
          }
          else{          
            this.showModal = 2;
            this.failed = "Failed!";      
          }
        this.AcceptanceForm.reset(); 
     })
   } else {    
     this.markFormGroupTouched(this.AcceptanceForm);   
   }
  }

  validateRejectForm()
  {
    if (this.RejectForm.valid){
      this.isValid = true;
    }
    else{
      this.markFormGroupTouched(this.RejectForm);   
    }
  }

  Reject()
  {
    if (this.RejectForm.valid) {
      const comments = this.RejectForm.get('reason')?.value; 
      const data = {
        reqID : this.Reqid,
        year : this.Activeyear,
        mflag : 7,
        emp_code : this.emp_code,
        comments: comments
      };
      this.apicall.EmpGoalApproveReject(data).subscribe(res=>{
        if(res.Errorid==1)
          {
            this.showModal = 1; 
            this.success = "Reject Successfully";   
            this.Fetch_EmpGoalRequest();
          }
          else{          
            this.showModal = 2;
            this.failed = "Failed!";      
          }
        this.RejectForm.reset(); 
     })
   } else {    
     this.markFormGroupTouched(this.RejectForm);   
   }
  }

  clear(form: any)
  {
    form.reset(); 
  }

  validateTargetForm()
  {
    if (this.TargetForm.valid){
      this.isValid = true;
    }
    else{
      this.markFormGroupTouched(this.TargetForm);   
    }
  }

  SaveGoal()
  {
    if (this.TargetForm.valid) {
      const data = {
        reqID : this.Reqid,
        year : this.empyear,
        emp_code : this.emp_code,
        updatedby : this.empcode,
        goals : this.TargetForm.value
      };
      this.apicall.GoalSettingByLM(data).subscribe(res=>{
        if(res.Errorid==1)
          {
            this.showModal = 1; 
            this.success = "Saved Successfully";   
            this.Fetch_EmpGoalRequest();
            this.Fetch_EmpGoalRequestsLM();
          }
          else{          
            this.showModal = 2;
            this.failed = "Failed!";      
          }
        this.TargetForm.reset(); 
     })
   } else {    
     this.markFormGroupTouched(this.TargetForm);   
   }
  }

  clearGoalList(form: FormGroup) {
    form.reset();
    this.EmpGoalList = [];
    const control = <FormArray>this.TargetForm.controls['tableRows'];
    control.clear();
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
const totalResults = this.EvaluationdataLM.filter((employee: any) => {
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

const filteredData = this.EvaluationdataLM.filter((employee: any) =>
  Object.values(employee).some((value: any) =>
    typeof value === 'string' &&
    value.toLowerCase().startsWith(this.searchInput.toLowerCase())
  )
);

const start = (this.currentPage - 1) * this.itemsPerPage + 1;
return Math.min(start, filteredData.length);
}


getEntriesEnd(): number {  
const filteredData = this.EvaluationdataLM.filter((employee: any) =>
  Object.values(employee).some((value: any) =>
    typeof value === 'string' &&
    value.toLowerCase().startsWith(this.searchInput.toLowerCase())
  )
);
const end = this.currentPage * this.itemsPerPage;
return Math.min(end, filteredData.length);
}

}
