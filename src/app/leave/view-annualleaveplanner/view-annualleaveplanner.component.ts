import { Component, OnInit } from '@angular/core';
import { ApiCallService } from 'src/app/api-call.service';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/login.service';

@Component({
  selector: 'app-view-annualleaveplanner',
  templateUrl: './view-annualleaveplanner.component.html',
  styleUrls: ['./view-annualleaveplanner.component.scss']
})
export class ViewAnnualleaveplannerComponent implements OnInit {

  userSession:any = this.session.getUserSession();
  authorityflg:any =this.userSession.authorityflg;
  empcode: any=this.userSession.empcode;
  empid:any =this.userSession.id;
  level: any=this.userSession.level;
  roleid:any =this.userSession.level;
  company: any=this.userSession.companycode;
  grpname:any=this.userSession.grpname;  

  listYear: any;
  listMonth: any;
  currentyear: any;
  monthvalue: any;
  getMonthDays: any;
  currentmonth: any;
  month: any;
  days = [];
  companyId: any = -1;
  listleaves: any;
  comtypeid: any = 12;
  listCompany: any;
  newyear = (new Date()).getFullYear();
  currentPage: any=1;
  currentPagePersonal: any;
  totalreq: any;
  totalPages: any;
  searchInput: string='';
  itemsPerPage=10;
  listDepartment: any;
  department: any = -1;
  desiredPage: any; 
  showModal: any;
  failed: any;
  
  constructor(private apicall:ApiCallService,private route:Router,private session:LoginService) { }

  ngOnInit(): void {

    this.apicall.listYear().subscribe((res)=>{
      this.listYear=res;
    })
    this.apicall.FetchCompanyList(this.empcode).subscribe((res)=>{
      this.listCompany=res;
    })

    this.apicall.FetchDepartmentList(this.companyId,this.empcode).subscribe(res =>{
      this.listDepartment=res;
    })

    this.listmonth();
    this.AnnualLeavePlanner(this.newyear,-1);
  }

    // Department List
    DepartmentListFn(company_code:any): void {
      this.companyId = company_code;
      this.apicall.FetchDepartmentList(this.companyId,this.empcode).subscribe(res =>{
           this.listDepartment=res;
      })
  }

  listmonth()
  {
    // const year= (<HTMLInputElement>document.getElementById("year")).value;
    // if(year == ''){
    //   this.currentyear = (new Date()).getFullYear();
    // }else{
    //   this.currentyear = year;
    // }
    this.apicall.DisplayAllMonths().subscribe((res)=>{
    this.listMonth=res;
    this.monthvalue=this.listMonth[0].VALUE_FIELD;
    })
  }

  generateTimeline(start:any, end:any) {
    for (let d = start; d <= end; d.setDate(d.getDate() + 1)) {
    }
  }

  ChangeDepartment(department:any){
    this.department = department;
  }

  AnnualLeavePlanner(year:any,company:any){
    this.currentyear = year;
    this.companyId = company;
    this.apicall.FetchAnnualLeaves(this.currentyear,this.companyId,this.empcode,this.grpname,this.department).subscribe((res)=>{
      this.listleaves=res;
      const maxPageFiltered = Math.ceil(this.listleaves.length / this.itemsPerPage);  

        if (this.currentPage > maxPageFiltered) {
          this.currentPage = 1;     
        } 
    })
  }

  getAbbreviatedMonthName(fullMonthName: string): string {
    return fullMonthName.substring(0, 3);
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
  const totalResults = this.listleaves.filter((employee: any) => {
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
  
  const filteredData = this.listleaves.filter((employee: any) =>
    Object.values(employee).some((value: any) =>
      typeof value === 'string' &&
      value.toLowerCase().startsWith(this.searchInput.toLowerCase())
    )
  );

  const start = (this.currentPage - 1) * this.itemsPerPage + 1;
  return Math.min(start, filteredData.length);
}


getEntriesEnd(): number {  
  const filteredData = this.listleaves.filter((employee: any) =>
    Object.values(employee).some((value: any) =>
      typeof value === 'string' &&
      value.toLowerCase().startsWith(this.searchInput.toLowerCase())
    )
  );
  const end = this.currentPage * this.itemsPerPage;
  return Math.min(end, filteredData.length);
}
  
}
