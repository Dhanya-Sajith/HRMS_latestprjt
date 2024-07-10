import { Component, OnInit } from '@angular/core';
import { FormControl,FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiCallService } from 'src/app/api-call.service';
import { LoginService } from 'src/app/login.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-career',
  templateUrl: './career.component.html',
  styleUrls: ['./career.component.scss']
})
export class CareerComponent implements OnInit {

  userSession:any = this.session.getUserSession();
  empcode: any=this.userSession.empcode;
  grpname:any=this.userSession.grpname;

  yeardata: any;
  selectyear = new FormControl();  
  companydata: any;
  hiringstatus: any;
  company:any = -1;
  status:any = -1;
  year = new FormControl();  
  careerstatus: any;
  joblist: any;
  ApplyForm: FormGroup;   
  isValid: boolean=false;
  showModal = 0;
  success:any="";
  failed:any="";
  activereqid: any;
  activecompany: any;
  emp_code: any;
  inputfield: any;
  jobcount: any;
  appliedjoblist: any;
  desiredPage: any;
  searchInput: string='';
  itemsPerPage=10;
  currentPage=1;
  searchInput1: string='';
  reqExp: any;

  constructor(private apicall:ApiCallService,private session:LoginService,private fb:FormBuilder,private datePipe: DatePipe) { 
    this.ApplyForm = this.fb.group({
      type: ['', Validators.required],
      cv: ['', Validators.required],
      comments: ['', Validators.required],
    });
  }

  
  ngOnInit(): void {
    //company combo box
     this.apicall.FetchCompanyList(this.empcode).subscribe((res) => {
       this.companydata=res;      
     });
     //Year
     this.apicall.listYear().subscribe((res) => {
       this.yeardata=res;  
       if (this.yeardata.length > 0) {
         this.selectyear.setValue(this.yeardata[0].DISPLAY_FIELD);
         this.year.setValue(this.yeardata[0].DISPLAY_FIELD);
       } 
       this.apicall.Get_eligible_openings(this.selectyear.value).subscribe((res) => {
         this.joblist=res;     
         this.jobcount =  this.joblist.length
       }); 
       this.apicall.Get_applied_jobs(this.year.value,this.company,this.status,this.empcode).subscribe((res) => {
         this.appliedjoblist=res;     
       });
     });
     //Status 
     this.apicall.listRegStatus(78).subscribe((res)=>{
      this.hiringstatus=res;
     })
     //Career Status 
     this.apicall.listRegStatus(81).subscribe((res)=>{
       this.careerstatus=res;
      })
 
   }
 
   FetchJobs(){
     this.apicall.Get_eligible_openings(this.selectyear.value).subscribe((res) => {
       this.joblist=res;     
       this.jobcount =  this.joblist.length 
     });
   }
 
   AppliedJobs()
   {
     this.apicall.Get_applied_jobs(this.year.value,this.company,this.status,this.empcode).subscribe((res) => {
       this.appliedjoblist=res;     
       const maxPageFiltered = Math.ceil(this.appliedjoblist.length / this.itemsPerPage);  
   
       if (this.currentPage > maxPageFiltered) {
         this.currentPage = 1;   
         
       }
     });
   }
 
   ActiveJob(jobdata: any)
   {
     this.activereqid = jobdata.REQID;
     this.activecompany = jobdata.COMPANY_CODE;
     this.emp_code = jobdata.EMP_CODE;
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
 
   markFormGroupTouched(formGroup: FormGroup) {
     Object.values(formGroup.controls).forEach(control => {
       control.markAsTouched();
     });
   }

clear(){
  this.ApplyForm.reset(); 
}

uploadCV()
{
  if (this.ApplyForm.valid) {
    const docname = this.ApplyForm.get('cv')?.value; 
    const comment = this.ApplyForm.get('comments')?.value; 
    const type = this.ApplyForm.get('type')?.value;

    const data = {
     reqid : this.activereqid,
     company : this.activecompany,
     ecode : this.empcode,
     applytype: type,
     cvpath : docname,
     remarks:comment
    };
    this.apicall.Apply_for_job(data).subscribe(res=>{
    if(res.Errorid > 0)
     {
       const input=document.getElementById("formFile");    
       const fdata = new FormData();
       this.onFileSelect(input);
       this.FetchJobs();
     }
   })
 } else {    
   this.markFormGroupTouched(this.ApplyForm);   
 }
}

onFileSelect(input:any)
{   
  if (input.files && input.files[0]) {
    const fdata = new FormData();
    fdata.append('filesup',input.files[0]);
    this.apicall.Job_CV_upload(fdata,this.activereqid).subscribe((res)=>{
      if(res>=0)
      {
      
        this.showModal = 1; 
        this.success = "Uploading Successfully";       
        this.inputfield = document.getElementById("cv");
        this.inputfield.selectedIndex = 0;
      }
      else{          
        this.showModal = 2;
        this.failed = "Uploading failed!";      
      }
      this.ApplyForm.reset(); 
    })
  }
}

ViewExperience(exp:any)
{
  this.reqExp = exp;
}

//Pagination
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

// Function to Calculate the total number of search results
get totalSearchResults(): number {
  const totalResults = this.appliedjoblist.filter((employee: any) => {
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

const filteredData = this.appliedjoblist.filter((employee: any) =>
Object.values(employee).some((value: any) =>
  typeof value === 'string' &&
  value.toLowerCase().startsWith(this.searchInput.toLowerCase())
)
);

const start = (this.currentPage - 1) * this.itemsPerPage + 1;
return Math.min(start, filteredData.length);
}


getEntriesEnd(): number {  
const filteredData = this.appliedjoblist.filter((employee: any) =>
Object.values(employee).some((value: any) =>
  typeof value === 'string' &&
  value.toLowerCase().startsWith(this.searchInput.toLowerCase())
)
);
const end = this.currentPage * this.itemsPerPage;
return Math.min(end, filteredData.length);
}

}
