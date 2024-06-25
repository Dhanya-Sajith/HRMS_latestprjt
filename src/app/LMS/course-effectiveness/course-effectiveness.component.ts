import { Component, OnInit } from '@angular/core';
import { ApiCallService } from 'src/app/api-call.service';
import { LoginService } from 'src/app/login.service';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-course-effectiveness',
  templateUrl: './course-effectiveness.component.html',
  styleUrls: ['./course-effectiveness.component.scss']
})
export class CourseEffectivenessComponent implements OnInit {

  userSession:any = this.session.getUserSession();
  authorityflg:any =this.userSession.authorityflg;
  empcode: any=this.userSession.empcode;
  roleid:any =this.userSession.level;
  grpname:any=this.userSession.grpname;
  company: any=this.userSession.companycode;
  companyname: any;

  desiredPage: any;
  searchInput: string='';
  itemsPerPage=10;
  currentPage=1;
  showModal = 0;
  success:any="";
  failed:any="";
  listtrainings: any;
  status: any = -1;

  constructor(private apicall:ApiCallService,private session:LoginService, private datePipe: DatePipe,private router: Router) { }

  ngOnInit(): void {
    this.FetchTrainings();
  }

  navigateToNewPage(id: any,code:any,view:any): void 
  {
    this.router.navigate(
      ['/course_effectiveness_feedback'],
      { queryParams: { ID: id,CODE: code,VIEW: view} }
    );
  }

  FetchTrainings()
  {
    this.apicall.FetchTrainingEmpEffectiveness_LM(this.empcode,this.status).subscribe((res)=>{
      this.listtrainings = res
    })
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
    const totalResults = this.listtrainings.filter((employee: any) => {
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

const filteredData = this.listtrainings.filter((employee: any) =>
  Object.values(employee).some((value: any) =>
    typeof value === 'string' &&
    value.toLowerCase().startsWith(this.searchInput.toLowerCase())
  )
);

const start = (this.currentPage - 1) * this.itemsPerPage + 1;
return Math.min(start, filteredData.length);
}


getEntriesEnd(): number {  
const filteredData = this.listtrainings.filter((employee: any) =>
  Object.values(employee).some((value: any) =>
    typeof value === 'string' &&
    value.toLowerCase().startsWith(this.searchInput.toLowerCase())
  )
);
const end = this.currentPage * this.itemsPerPage;
return Math.min(end, filteredData.length);
}


}

