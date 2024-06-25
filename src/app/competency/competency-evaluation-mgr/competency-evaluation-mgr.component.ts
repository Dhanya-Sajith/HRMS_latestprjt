import { Component, OnInit } from '@angular/core';
import { ApiCallService } from 'src/app/api-call.service';
import { LoginService } from 'src/app/login.service';
import { DatePipe} from '@angular/common';
import { FormControl,FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GeneralService } from 'src/app/general.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-competency-evaluation-mgr',
  templateUrl: './competency-evaluation-mgr.component.html',
  styleUrls: ['./competency-evaluation-mgr.component.scss']
})
export class CompetencyEvaluationMgrComponent implements OnInit {

  userSession:any = this.session.getUserSession();
  authorityflg:any =this.userSession.authorityflg;
  empcode: any=this.userSession.empcode;
  empid:any =this.userSession.id;
  dept: any=this.userSession.dept;
  roleid:any =this.userSession.level;
  grpname:any=this.userSession.grpname;
  company: any=this.userSession.companycode;

  status: any = -1;
  year: any = -1;
  listdetails: any;
  listyear: any;
  total: any;
  submitted: any;
  pending: any;
  overdue: any;
  liststatus: any;
  desiredPage: any;
  searchInput: string='';
  itemsPerPage=10;
  currentPage=1;
  showModal = 0;
  success:any="";
  failed:any="";

  constructor(private apicall:ApiCallService,private datePipe:DatePipe,private session:LoginService,private fb: FormBuilder,private general:GeneralService,private router: Router) { }

  ngOnInit(): void {
    this.FetchEvaluations();
    this.ListYear();
    this.apicall.listRegStatus(70).subscribe(res =>{
      this.liststatus = res;
    })
    this.FetchStatus();
  }

  
  ListYear()
  {
    this.apicall.listYear().subscribe((res)=>{
    this.listyear=res;
    })
  }

  FetchEvaluations()
  {
    this.apicall.Fetch_CompetencyEvaluationReq_LM(this.empcode,this.status,this.year).subscribe((res)=>{
      this.listdetails=res;
      const maxPageFiltered = Math.ceil(this.listdetails.length / this.itemsPerPage);  
  
        if (this.currentPage > maxPageFiltered) {
          this.currentPage = 1;   
          
        }
    })
  }

  FetchStatus()
  {
    this.apicall.Fetch_CompetencyEvaluationReq_LM_StatusCount(this.empcode).subscribe((res)=>{
      this.total=res[0].TOTAL;
      this.submitted=res[0].APPROVED;
      this.pending=res[0].PENDING_UP;
      this.overdue=res[0].OVERDUE;
    })
  }

  getStatusStyles(status:any) {    
    let styles = {
      'background-color': status === 0 ? '#54b4e4' : 
                          (status === 1 ? '#0ab39c' : 
                          (status === 2 ? '#0ab39c' : 
                          (status === 3 ? '#f06548' : '#0ab39c'))),
                        
      'color': 'white',
    };
    
    return styles;
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
    const totalResults = this.listdetails.filter((employee: any) => {
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

const filteredData = this.listdetails.filter((employee: any) =>
  Object.values(employee).some((value: any) =>
    typeof value === 'string' &&
    value.toLowerCase().startsWith(this.searchInput.toLowerCase())
  )
);

const start = (this.currentPage - 1) * this.itemsPerPage + 1;
return Math.min(start, filteredData.length);
}


getEntriesEnd(): number {  
const filteredData = this.listdetails.filter((employee: any) =>
  Object.values(employee).some((value: any) =>
    typeof value === 'string' &&
    value.toLowerCase().startsWith(this.searchInput.toLowerCase())
  )
);
const end = this.currentPage * this.itemsPerPage;
return Math.min(end, filteredData.length);
}

TakeAssessment(item:any)
{
  const data={
    reqid:item.REQUEST_ID,
    empcode:item.EMP_CODE,
    empname:item.EMP_NAME,
    desig:item.DESIGNATION,
    desigid:item.DESIGNATION_ID,
    company:item.COMPANY,
    department:item.DEPARTMENT,
    Purpose:item.PURPOSE
  }
  this.general.setEmpdetails_competency(data); 
  this.router.navigate(['/CompetencyAssessmentManager']);
}

}
