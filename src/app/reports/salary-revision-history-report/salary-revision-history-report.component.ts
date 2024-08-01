import { Component, OnInit } from '@angular/core';
import { ApiCallService } from 'src/app/api-call.service';
import { FormGroup, FormControl, FormArray, FormBuilder, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { formatDate } from '@angular/common'; 
import { LoginService } from 'src/app/login.service';
import * as XLSX from 'xlsx'; 

@Component({
  selector: 'app-salary-revision-history-report',
  templateUrl: './salary-revision-history-report.component.html',
  styleUrls: ['./salary-revision-history-report.component.scss']
})
export class SalaryRevisionHistoryReportComponent implements OnInit {

  userSession:any = this.session.getUserSession();
  empcode: any=this.userSession.empcode;
  listCompany: any;

  showModal = 0;
  success:any="";
  failed:any="";
  itemsPerPage=10;
  currentPage=1;
  desiredPage: any; 
  toyear: any = -1;
  searchInput: string = '';
  fromyear :any = -1;
  company: any;
  yearlist: any;
  revisiondata: any;
  comcode:any = -1;
  displayedYears: number[] = [];
  fileName= 'Salary Revision History Report.xlsx'; 

  constructor(private apicall:ApiCallService,private datePipe: DatePipe,private session:LoginService) { }

  ngOnInit(): void {
    //Year list
    this.apicall.listYear().subscribe((res)=>{
      this.yearlist=res;
      if (this.yearlist.length > 0) {
        this.fromyear = this.yearlist[0].DISPLAY_FIELD;
        this.toyear  = this.yearlist[0].DISPLAY_FIELD;
      } 
    }); 
    //Company list
     this.apicall.FetchCompanyList(this.empcode).subscribe((res)=>{
      this.listCompany=res;
    });
  }

  download_to_excel()
  {
    // let Excelname:any;
    // this.apicall.ExportToExcel(this.revisiondata).subscribe((res)=>{
    // Excelname=res.Errormsg;
    // let fileurl=this.apicall.GetExcelFile(Excelname);
    // let link = document.createElement("a");
      
    //     if (link.download !== undefined) {
    //       link.setAttribute("href", fileurl);
    //       document.body.appendChild(link);
    //       link.click();
    //       document.body.removeChild(link);
    //   }
    // });
    this.exportexcel();
  }

  exportexcel(): void 
  {
   /* table id is passed over here */   
   let element = document.getElementById('excel-table'); 
   const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(element);

   /* generate workbook and add the worksheet */
   const wb: XLSX.WorkBook = XLSX.utils.book_new();
   XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

   /* save to file */
   XLSX.writeFile(wb, this.fileName);
  }

  viewReport()
  {
    if( this.fromyear > this.toyear){
      (<HTMLInputElement>document.getElementById("openModalButton")).click();
      this.showModal = 2;
      this.failed = "Please Correct the Dates";
    }else{

      this.apicall.Fetch_Salary_Revision_History_Report(this.empcode,this.comcode,this.fromyear,this.toyear).subscribe((res)=>{
        this.revisiondata=res;  
        this.extractAndFilterYears();
        const maxPageFiltered = Math.ceil(this.revisiondata.length / this.itemsPerPage);  

        if (this.currentPage > maxPageFiltered) {
          this.currentPage = 1;     
        }  
      })
    }
  }

  extractAndFilterYears() {
    const yearsSet = new Set<number>();

    this.revisiondata.forEach((employee: { yearSalaryModels: any[]; }) => {
      employee.yearSalaryModels.forEach((model: any) => {
        yearsSet.add(model.YEAR);
      });
    });

    const allYears = Array.from(yearsSet).sort((a, b) => a - b);

    if (this.fromyear !== -1 && this.toyear !== -1) {
      this.displayedYears = allYears.filter(year => year >= this.fromyear && year <= this.toyear);
    } else {
      this.displayedYears = [];
    }

    // if (this.displayedYears.length === 0) {
    //   alert('No years found in the selected range');
    // }
  }

  getSalary(yearSalaryModels: any[], year: number): number | string {
    if (yearSalaryModels && yearSalaryModels.length > 0) {
      const model = yearSalaryModels.find(y => y.YEAR === year);
      return model ? model.SALARY : '';
    }
    return '';
  }

  getDesignation(yearSalaryModels: any[], year: number): string {
    if (yearSalaryModels && yearSalaryModels.length > 0) {
      const model = yearSalaryModels.find(y => y.YEAR === year);
      return model ? model.DESIGNATION : '';
    }
    return '';
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
const totalResults = this.revisiondata.filter((policy: any) => {
  return Object.values(policy).some((value: any) =>
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

const filteredData = this.revisiondata.filter((policy: any) =>
  Object.values(policy).some((value: any) =>
    typeof value === 'string' &&
    value.toLowerCase().startsWith(this.searchInput.toLowerCase())
  )
);

const start = (this.currentPage - 1) * this.itemsPerPage + 1;
return Math.min(start, filteredData.length);
}


getEntriesEnd(): number {  
const filteredData = this.revisiondata.filter((policy: any) =>
  Object.values(policy).some((value: any) =>
    typeof value === 'string' &&
    value.toLowerCase().startsWith(this.searchInput.toLowerCase())
  )
);
const end = this.currentPage * this.itemsPerPage;
return Math.min(end, filteredData.length);
}

}
