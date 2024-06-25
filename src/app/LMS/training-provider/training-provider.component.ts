import { Component, OnInit } from '@angular/core';
import { ApiCallService } from 'src/app/api-call.service';
import { LoginService } from 'src/app/login.service';
import { DatePipe} from '@angular/common';
import { FormControl,FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-training-provider',
  templateUrl: './training-provider.component.html',
  styleUrls: ['./training-provider.component.scss']
})
export class TrainingProviderComponent implements OnInit {

  userSession:any = this.session.getUserSession();
  authorityflg:any =this.userSession.authorityflg;
  empcode: any=this.userSession.empcode;
  empid:any =this.userSession.id;
  dept: any=this.userSession.dept;
  roleid:any =this.userSession.level;
  grpname:any=this.userSession.grpname;
  company: any=this.userSession.companycode;

  listYear: any;
  liststatus: any;
  status: any = -1;
  year: any = -1;
  listTrainings: any;
  searchInput: string='';
  itemsPerPage=10;
  currentPage=1;
  desiredPage: any; 
  showModal: any;
  failed: any;

  constructor(private apicall:ApiCallService,private datePipe:DatePipe,private session:LoginService,private fb: FormBuilder,private router:Router) { }

  ngOnInit(): void {
    this.ListYear();
    this.apicall.listRegStatus(67).subscribe(res =>{
      this.liststatus = res;
    })
    this.FetchTrainings();
  }

  ListYear()
  {
    this.apicall.listYear().subscribe((res)=>{
    this.listYear=res;
    })
  }

  FetchTrainings()
  {
    this.apicall.FetchProviderTrainings(this.empcode,this.year,this.status).subscribe((res)=>{
      this.listTrainings=res;
      const maxPageFiltered = Math.ceil(this.listTrainings.length / this.itemsPerPage);  
  
      if (this.currentPage > maxPageFiltered) {
        this.currentPage = 1;   
        
      }
    })
  }

  navigateTo_assessPage(TrainingId:any)
  {
   this.router.navigate(['/add_assessment'], { queryParams: { Id: TrainingId } });
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
    const totalResults = this.listTrainings.filter((employee: any) => {
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

const filteredData = this.listTrainings.filter((employee: any) =>
  Object.values(employee).some((value: any) =>
    typeof value === 'string' &&
    value.toLowerCase().startsWith(this.searchInput.toLowerCase())
  )
);

const start = (this.currentPage - 1) * this.itemsPerPage + 1;
return Math.min(start, filteredData.length);
}


getEntriesEnd(): number {  
const filteredData = this.listTrainings.filter((employee: any) =>
  Object.values(employee).some((value: any) =>
    typeof value === 'string' &&
    value.toLowerCase().startsWith(this.searchInput.toLowerCase())
  )
);
const end = this.currentPage * this.itemsPerPage;
return Math.min(end, filteredData.length);
}

}

