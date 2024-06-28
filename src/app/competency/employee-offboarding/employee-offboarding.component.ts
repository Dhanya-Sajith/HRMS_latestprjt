import { Component, OnInit  } from '@angular/core';
import { ApiCallService } from 'src/app/api-call.service';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/login.service';
import { JsonPipe, formatDate } from '@angular/common';
import { FormControl,FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-employee-offboarding',
  templateUrl: './employee-offboarding.component.html',
  styleUrls: ['./employee-offboarding.component.scss']
})
export class EmployeeOffboardingComponent implements OnInit {


  userSession:any = this.session.getUserSession();
  empcode: any=this.userSession.empcode;

  listaccesscompany: any;
  yearlist: any;
  offBoardingdtls: any;
  status: any;
  year: any;
  company: any;
  roleids:any =this.userSession.level;
  category: any;
  searchInput: string = '';
  desiredPage: any;
  itemsPerPage=10;
  currentPage=1;

  constructor(private datePipe: DatePipe,private session:LoginService,private apicall:ApiCallService,private router:Router,private fb: FormBuilder) { }

  ngOnInit(): void {

    this.ListCompany();
    this.listYear();

    if(this.roleids==17 ||  this.roleids==5 ||  this.roleids==13)
    {
      this.category=1;
    }
    else if(this.roleids==10 ||  this.roleids==1)
    {
      this.category=2;
    }


    this.listEmpOffBoadingdtls();

  }

  ListCompany()
  {
    this.apicall.FetchCompanyList(this.empcode).subscribe((res)=>{
      this.listaccesscompany=res;
      })
  }

  listYear()
  {
    this.apicall.listYear().subscribe((res)=>{
    this.yearlist=res;
      })
  }
  
  listEmpOffBoadingdtls()
  {  

    this.status=0;
    this.year=-1;
    this.company=-1;
    this.apicall.listOffboardingdtls(this.empcode,this.status,this.year,this.company,this.category).subscribe(res => {
      this.offBoardingdtls = res;

    })
  }

  listEmpOffBoadingdtlsfilter()
  {  
    this.status= (<HTMLInputElement>document.getElementById("statusnm")).value;
    this.year= (<HTMLInputElement>document.getElementById("year")).value;
    this.company= (<HTMLInputElement>document.getElementById("comname")).value;
    this.apicall.listOffboardingdtls(this.empcode,this.status,this.year,this.company,this.category).subscribe(res => {
    this.offBoardingdtls = res;
    })
  }



  // pagination 

getTotalPages(): number {
  return Math.ceil(this.totalSearchResults / this.itemsPerPage);
}

goToPage() {
  const totalPages = Math.ceil(this.totalSearchResults / this.itemsPerPage);
  if (this.desiredPage >= 1 && this.desiredPage <= totalPages) {
    this.currentPage = this.desiredPage;
  } else {  
    
    (<HTMLInputElement>document.getElementById("openModalButton")).click();
    // this.showModal = 2; 
    // this.failed='Invalid page number!'; 
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
const totalResults = this.offBoardingdtls.filter((employee: any) => {
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

const filteredData = this.offBoardingdtls.filter((employee: any) =>
  Object.values(employee).some((value: any) =>
    typeof value === 'string' &&
    value.toLowerCase().startsWith(this.searchInput.toLowerCase())
  )
);

const start = (this.currentPage - 1) * this.itemsPerPage + 1;
return Math.min(start, filteredData.length);
}


getEntriesEnd(): number { 
   
const filteredData = this.offBoardingdtls.filter((employee: any) =>
  Object.values(employee).some((value: any) =>
    typeof value === 'string' &&
    value.toLowerCase().startsWith(this.searchInput.toLowerCase())
  )
);
const end = this.currentPage * this.itemsPerPage;
return Math.min(end, filteredData.length);

}
  

collectDtls(compnyname:any,empnm:any,emp_code:any,lastworkdt:any,stsval:any,reqstId:any)
{
    localStorage.setItem('companynm',compnyname);
    localStorage.setItem('employeenm',empnm);
    localStorage.setItem('emp_code',emp_code);
    localStorage.setItem('lastwrkdt',lastworkdt);
    localStorage.setItem('stsval',stsval);
    localStorage.setItem('reqstId',reqstId);
}

  

}
