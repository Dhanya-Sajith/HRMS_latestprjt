import { Component, OnInit } from '@angular/core';
import { ApiCallService } from 'src/app/api-call.service';
import { LoginService } from 'src/app/login.service';

@Component({
  selector: 'app-yearlyleave-report',
  templateUrl: './yearlyleave-report.component.html',
  styleUrls: ['./yearlyleave-report.component.scss']
})
export class YearlyleaveReportComponent implements OnInit {

  userSession:any = this.session.getUserSession();
  empcode: any=this.userSession.empcode;
  level: any=this.userSession.level;
  authorityflg:any =this.userSession.authorityflg;

  listYear: any;
  listlvetype: any;
  searchInput: string = '';
  ListYrleaveReport: any;
 
  totaldata: any;
  totalPages: any;
  itemsPerPage=10;
  currentPage=1;
  desiredPage: any; 
  empexistance: any;
  showModal: any;
  failed: any;

  constructor(private apicall:ApiCallService,private session:LoginService) { }

  ngOnInit(): void {
    this.currentPage = 1; 
    
    this.ListYear();
    this.ListLeaveTypes();
    const year = (<HTMLInputElement>document.getElementById("year")).value;
    const leavetype = (<HTMLInputElement>document.getElementById("leavetype")).value;
      this.apicall.ListYearlyLeaveReport(year,leavetype,this.empcode).subscribe((res)=>{
        this.ListYrleaveReport=res;
        this.totaldata = this.ListYrleaveReport.length;  
        const totalPages = Math.ceil(this.totaldata / 10);
        this.totalPages = Array(totalPages).fill(0).map((_, index) => index + 1);
      })
  }

  ListYear()
  {
    this.apicall.listYear().subscribe((res)=>{
    this.listYear=res;
    })
  }

  ListLeaveTypes()
  {
    this.apicall.FetchLeaveTypes().subscribe((res)=>{
      this.listlvetype=res; 
    }) 
  }

  ListYearlyLeaveReport(){
    const year = (<HTMLInputElement>document.getElementById("year")).value;
    const leavetype = (<HTMLInputElement>document.getElementById("leavetype")).value;
    if(year=="-1" || leavetype=="-1")
    {
      this.empexistance="Please Select Fields";
      this.apicall.ListYearlyLeaveReport(year,leavetype,this.empcode).subscribe((res)=>{
        this.ListYrleaveReport=res;
        const maxPageFiltered = Math.ceil(this.ListYrleaveReport.length / this.itemsPerPage);  

        if (this.currentPage > maxPageFiltered) {
          this.currentPage = 1;     
        }   
       
      })
    }
    else{
        this.empexistance="" ;
    
        this.apicall.ListYearlyLeaveReport(year,leavetype,this.empcode).subscribe((res)=>{
          this.ListYrleaveReport=res;
          this.totaldata = this.ListYrleaveReport.length;  
          const totalPages = Math.ceil(this.totaldata / 10);
          this.totalPages = Array(totalPages).fill(0).map((_, index) => index + 1);  
        })
    }
    
   }
 
   download_to_excel()
   { 
    let Excelname:any;
    this.apicall.ExportToExcel(this.ListYrleaveReport).subscribe((res)=>{
     Excelname=res.Errormsg;
     let fileurl=this.apicall.GetExcelFile(Excelname);
     let link = document.createElement("a");
       
         if (link.download !== undefined) {
        //   let url = URL.createObjectURL(blob);
           link.setAttribute("href", fileurl);
           link.setAttribute("download", "ReportFile.xlsx");
           document.body.appendChild(link);
           link.click();
           document.body.removeChild(link);
    }
   });
   
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
const totalResults = this.ListYrleaveReport.filter((employee: any) => {
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

const filteredData = this.ListYrleaveReport.filter((employee: any) =>
  Object.values(employee).some((value: any) =>
    typeof value === 'string' &&
    value.toLowerCase().startsWith(this.searchInput.toLowerCase())
  )
);

const start = (this.currentPage - 1) * this.itemsPerPage + 1;
return Math.min(start, filteredData.length);
}


getEntriesEnd(): number {  
const filteredData = this.ListYrleaveReport.filter((employee: any) =>
  Object.values(employee).some((value: any) =>
    typeof value === 'string' &&
    value.toLowerCase().startsWith(this.searchInput.toLowerCase())
  )
);
const end = this.currentPage * this.itemsPerPage;
return Math.min(end, filteredData.length);
}
}
