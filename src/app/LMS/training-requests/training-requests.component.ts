import { Component, OnInit } from '@angular/core';
import { ApiCallService } from 'src/app/api-call.service';
import { LoginService } from 'src/app/login.service';
import { DatePipe} from '@angular/common';
import { FormControl,FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-training-requests',
  templateUrl: './training-requests.component.html',
  styleUrls: ['./training-requests.component.scss']
})
export class TrainingRequestsComponent implements OnInit {

  userSession:any = this.session.getUserSession();
  authorityflg:any =this.userSession.authorityflg;
  empcode: any=this.userSession.empcode;
  empid:any =this.userSession.id;
  dept: any=this.userSession.dept;
  roleid:any =this.userSession.level;
  grpname:any=this.userSession.grpname;
  company: any=this.userSession.companycode;

  user: any = 'personal';
  dropdownSettings:IDropdownSettings={};
  selectedItems: any = [];
  listYear: any = -1;
  filter_year:any = -1;
  filter_status:any = 0;
  listQuarter: any = -1;
  requestForm: FormGroup; 

  isFormValid:boolean=false;
  showModal = 0;
  failed!: string;
  success!: string;
  listtraining: any;
  listprovider: any;
  listarea: any;
  listtrainings: any;
  liststatus: any;
  viewflag: any = 0;
  status: any = -1;
  listEmployee: any;
  flag:any = 2;
  HODrequestForm: FormGroup; 
  selectedRequestID: any;
  EditrequestForm: FormGroup; 
  selectedplanId: any;
  rejectresaon:any;
  HOD_year: any = -1;
  HOD_status: any = 0;
  listtrainings_HOD: any;

  searchInput: string='';
  itemsPerPage=10;
  currentPage=1;
  desiredPage: any; 
  desiredPagePersonal: any;
  currentPagePersonal: any =1;
  trainingdtl: any;
  Upcomingdt: any;
  Upcomingtraining: any;
  assignedhrs: any;
  pendinghrs: any;
  viewdtl: any;
  BtnActive: any;

  constructor(private apicall:ApiCallService,private datePipe:DatePipe,private session:LoginService,private fb: FormBuilder,private route: ActivatedRoute) { 
    this.requestForm = this.fb.group({
      trainingname: ['', Validators.required],
      schedule: ['', Validators.required],
      provider: ['', Validators.required],
      area: ['', Validators.required],
    });
    this.HODrequestForm = this.fb.group({
      htrainingname: ['', Validators.required],
      hschedule: ['', Validators.required],
      hprovider: ['', Validators.required],
      harea: ['', Validators.required],
      hemployee: ['', Validators.required],
      remarks: ['', Validators.required]
    });
    this.EditrequestForm = this.fb.group({
      eschedule: ['', Validators.required],
      eprovider: ['', Validators.required],
      eremarks: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.route.queryParams
    .subscribe(params => {
      this.user = params['user'];
    }
    );
    
    if(this.user == 'personal' || this.user == undefined){
      this.user = 'personal';
      this.viewflag = 0; 
      this.FetchTrainingRequest();
    }
    else{
      this.user = 'team';
      this.viewflag = 1;   
      this.FetchTrainingRequest_HOD();  
    }

    this.ListYear();
    this.apicall.listRegStatus(16).subscribe(res =>{
      this.listQuarter = res;
    })
    this.apicall.FetchTrainingSubjects().subscribe(res =>{
      this.listtraining = res;
    })
    this.apicall.listRegStatus(17).subscribe(res =>{
      this.listprovider = res;
    })
    this.apicall.listRegStatus(15).subscribe(res =>{
      this.listarea = res;
    })
    this.apicall.listRegStatus(67).subscribe(res =>{
      this.liststatus = res;
    })

    this.EmployeeListFn();
    this.dropdownSettings = {
      idField: 'EMP_CODE',
      textField: 'EMP_NAME',
      itemsShowLimit: 3,
      limitSelection: -1,
      allowSearchFilter: true,
      clearSearchFilter: true,
    };
    this.FetchTrainingRequest();
    this.checktrainingprovider();
    this.Training();
  }

  EmployeeListFn(): void {
    this.apicall.FetchEmployeeList(this.dept,this.company,this.empcode).subscribe(res => {
      this.listEmployee = res;
    })
  }

    // team or personal selection
    teamselection(selectuser:any){
      this.user = selectuser;
      if (this.user === 'team') {   
        this.viewflag = 1;   
        this.FetchTrainingRequest_HOD();     
      } 
      else {
        this.viewflag = 0;
        this.FetchTrainingRequest();
      } 
    }

    
    checktrainingprovider(){
      this.apicall.CheckTrainingProvider(this.empcode).subscribe((res)=>{
         this.BtnActive = res.Errorid;
      })
    }

    ListYear()
    {
      this.apicall.listYear().subscribe((res)=>{
      this.listYear=res;
      })
    }
    
    Training(){
      this.apicall.EmployeeUpcomingTraining(this.empcode).subscribe((res)=>{
        this.trainingdtl=res;
         this.Upcomingdt = this.trainingdtl[0].TRAINING_DATE;
         this.Upcomingtraining = this.trainingdtl[0].SUBJECT_NAME;
         this.assignedhrs = this.trainingdtl[0].trainingDurationModels[0].TOTAL_DURATION;
         this.pendinghrs = this.trainingdtl[0].trainingDurationModels[0].PENDING_DURATION;

      })
    }

    FetchTrainingRequest()
    {
      this.apicall.FetchTrainingRequest(this.empcode,this.filter_status,this.viewflag,this.filter_year).subscribe((res)=>{
        this.listtrainings=res;
        const maxPageFiltered = Math.ceil(this.listtrainings.length / this.itemsPerPage);  
  
        if (this.currentPage > maxPageFiltered) {
          this.currentPage = 1;   
          
        }
      })
    }

    FetchTrainingRequest_HOD()
    {
      this.apicall.FetchTrainingRequest(this.empcode,this.HOD_status,this.viewflag,this.HOD_year).subscribe((res)=>{
        this.listtrainings_HOD=res;
        const maxPageFiltered = Math.ceil(this.listtrainings_HOD.length / this.itemsPerPage);  
  
        if (this.currentPage > maxPageFiltered) {
          this.currentPage = 1;   
          
        }
      })
    }

    getStatusStyles(status:any) {    
      let styles = {
        'background-color': status === 0 ? '#54b4e4' : 
                            (status === 2 ? '#54b4e4' : 
                            (status === 4 ? '#f7b84b' : 
                            (status === 6 ? '#212529' : 
                            (status === 7 ? '#f06548' :
                            (status === 9 ? '#405189' : '#0ab39c'))))),
                          
        'color': 'white',
      };
      
      return styles;
    }

    validateForm() {
      if (this.requestForm.valid){
      this.isFormValid = true;
      }
      else{
        this.markFormGroupTouched(this.requestForm);
      }
    }
    
    markFormGroupTouched(formGroup: FormGroup) {
      Object.values(formGroup.controls).forEach(control => {
        control.markAsTouched();
      });
    }

    AddRequests()
    {
      if (this.requestForm.valid) {
        const trainingname= this.requestForm.get('trainingname');
        const schedule= this.requestForm.get('schedule'); 
        const provider= this.requestForm.get('provider'); 
        const area= this.requestForm.get('area');
       
          const data = {
            empcode : this.empcode,
            area_id : area?.value,
            training_subject : trainingname?.value,
            proposed_quarter : schedule?.value,
            training_type : provider?.value,
            updated_by : this.empcode,
            eflag : 1,
            remarks : ""
            };
          // alert(JSON.stringify(data))
          this.apicall.SaveTrainingRequest(data).subscribe(res =>{
            
            if(res.Errorid == 1)
            {
              this.showModal = 1; 
              this.success = "Training  Requested Successfully";
              this.FetchTrainingRequest();
              this.Clear();
            }
            else        
            {
              this.showModal = 2; 
              this.failed = "Failed";
              this.Clear();
            }   
          })
      }
      else{
        this.markFormGroupTouched(this.requestForm); 
      }
    }

    Clear()
    {
      this.requestForm.reset();
    }

    HODvalidateForm()
    {
      if (this.HODrequestForm.valid){
          this.isFormValid = true;
        }
      else{
        this.markFormGroupTouched(this.HODrequestForm);
      }
    }

    HODRequests()
    {
      if (this.HODrequestForm.valid) {
        const trainingname= this.HODrequestForm.get('htrainingname');
        const schedule= this.HODrequestForm.get('hschedule'); 
        const provider= this.HODrequestForm.get('hprovider'); 
        const area= this.HODrequestForm.get('harea');
        const remarks= this.HODrequestForm.get('remarks');
        const emplist = this.HODrequestForm.get('hemployee')?.value
        const empname = emplist.map((item: {
          EMP_CODE: any; id: any; 
          }) => item.EMP_CODE).join(',');

          const data = {
            empcode : empname,
            area_id : area?.value,
            training_subject : trainingname?.value,
            proposed_quarter : schedule?.value,
            training_type : provider?.value,
            updated_by : this.empcode,
            eflag : 0,
            remarks :  remarks?.value
            };
          // alert(JSON.stringify(data))
          this.apicall.SaveTrainingRequest(data).subscribe(res =>{
            
            if(res.Errorid == 1)
            {
              this.showModal = 1; 
              this.success = "Training  Requested Successfully";
              this.FetchTrainingRequest_HOD();
              this.hClear();
            }
            else        
            {
              this.showModal = 2; 
              this.failed = "Failed";
              this.hClear();
            }   
          })
      }
      else{
        this.markFormGroupTouched(this.HODrequestForm); 
      }
    }

    hClear()
    {
      this.HODrequestForm.reset();
    }

    SelectPlanID(id:any)
    {
      this.selectedplanId=id
    }

    EditvalidateForm()
    {
      if (this.EditrequestForm.valid){
        this.isFormValid = true;
      }
    else{
        this.markFormGroupTouched(this.EditrequestForm);
      }
    }

    EditRequests()
    {
      if (this.EditrequestForm.valid) {
        const schedule= this.EditrequestForm.get('eschedule'); 
        const provider= this.EditrequestForm.get('eprovider'); 
        const remarks= this.EditrequestForm.get('eremarks');

          const data = {
            proposed_quarter : schedule?.value,
            training_provider : provider?.value,
            updated_by : this.empcode,
            remarks : remarks?.value,
            mflag : -1,
            reqid : this.selectedplanId,
            };
          // alert(JSON.stringify(data))
          this.apicall.ApproveRejectEdit_trainingRequestByHOD(data).subscribe(res =>{
            
            if(res.Errorid == 1)
            {
              this.showModal = 1; 
              this.success = "Updated Successfully";
              this.FetchTrainingRequest_HOD();
              this.EditClear();
            }
            else        
            {
              this.showModal = 2; 
              this.failed = "Failed";
              this.EditClear();
            }   
          })
      }
      else{
        this.markFormGroupTouched(this.EditrequestForm); 
      }
    }

    EditClear()
    {
      this.EditrequestForm.reset();
    }

    setSelectedRequestID(req:any)
    {
      this.selectedRequestID = req  
    }

    CancelRequest(id:any)
    {
      const approvedata={
        proposed_quarter:'',
        training_provider:'',
        updated_by:this.empcode,
        remarks: '',
        mflag:6,
        reqid: this.selectedRequestID,
      }    
        this.apicall.ApproveRejectEdit_trainingRequestByHOD(approvedata).subscribe((res) => {      
          if(res.Errorid==1){
            this.showModal = 1;         
            this.success = "Cancel Request Successfully";   
            this.FetchTrainingRequest_HOD();  
          }
          else{
            this.showModal = 2;
            this.failed = "Failed";
          }     
          this.FetchTrainingRequest_HOD();
      });
    }

  // Approve Leave request by team
  approve(reqid:any){     
    const approvedata={
      proposed_quarter:'',
      training_provider:'',
      updated_by:this.empcode,
      remarks: '',
      mflag:1,
      reqid: reqid,
    }    
      this.apicall.ApproveRejectEdit_trainingRequestByHOD(approvedata).subscribe((res) => {      
        if(res.Errorid==1){
          this.showModal = 1;         
          this.success = "Approved Successfully";   
          this.FetchTrainingRequest_HOD();   
        }
        else{
          this.showModal = 2;
          this.failed = "Failed";
        }     
        this.FetchTrainingRequest_HOD();   
    });
  }

  onReject(id:any)
  {
    const approvedata={
      proposed_quarter:'',
      training_provider:'',
      updated_by:this.empcode,
      remarks: this.rejectresaon,
      mflag:7,
      reqid: id,
    }    
      this.apicall.ApproveRejectEdit_trainingRequestByHOD(approvedata).subscribe((res) => {      
        if(res.Errorid==1){
          this.showModal = 1;         
          this.success = "Reject Request Successfully";   
          this.FetchTrainingRequest_HOD();   
        }
        else{
          this.showModal = 2;
          this.failed = "Failed";
        }     
        this.FetchTrainingRequest_HOD();  
    });
  }

  ViewTrainingDtl(id:any)
  {
    this.apicall.ViewUpcomingTrainingDetails(id).subscribe((res) => {
      this.viewdtl = res
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
const totalResults = this.listtrainings_HOD.filter((employee: any) => {
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

const filteredData = this.listtrainings_HOD.filter((employee: any) =>
  Object.values(employee).some((value: any) =>
    typeof value === 'string' &&
    value.toLowerCase().startsWith(this.searchInput.toLowerCase())
  )
);

const start = (this.currentPage - 1) * this.itemsPerPage + 1;
return Math.min(start, filteredData.length);
}


getEntriesEnd(): number {  
const filteredData = this.listtrainings_HOD.filter((employee: any) =>
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
const totalResults = this.listtrainings.filter((policy: any) => {
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

const filteredData = this.listtrainings.filter((policy: any) =>
Object.values(policy).some((value: any) =>
  typeof value === 'string' &&
  value.toLowerCase().startsWith(this.searchInput.toLowerCase())
)
);

const start = (this.currentPagePersonal - 1) * this.itemsPerPage + 1;
return Math.min(start, filteredData.length);
}


getEntriesEndPersonal(): number {  
const filteredData = this.listtrainings.filter((policy: any) =>
Object.values(policy).some((value: any) =>
  typeof value === 'string' &&
  value.toLowerCase().startsWith(this.searchInput.toLowerCase())
)
);
const end = this.currentPagePersonal * this.itemsPerPage;
return Math.min(end, filteredData.length);
}
  

}

