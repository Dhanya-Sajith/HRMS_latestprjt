import { Component, OnInit } from '@angular/core';
import { ApiCallService } from 'src/app/api-call.service';
import { DatePipe } from '@angular/common';
import { LoginService } from 'src/app/login.service';
import * as XLSX from 'xlsx'; 

@Component({
  selector: 'app-monthly-attendance-report',
  templateUrl: './monthly-attendance-report.component.html',
  styleUrls: ['./monthly-attendance-report.component.scss']
})
export class MonthlyAttendanceReportComponent implements OnInit {

  userSession:any = this.session.getUserSession();
  empcode: any=this.userSession.empcode;
  level: any=this.userSession.level;
  authorityflg:any =this.userSession.authorityflg;

  yesterday: any;
  currentmonth: any;
  currentyear: any;
  monthdays: any;

  currentDate = new Date();
  listCompany:any;
  comtypeid=12;
  listYear:any;
  listMonth:any;
  year:any;
  reportdata: any;
  currentPage: any=1;
  currentPagePersonal: any;
  totalreq: any;
  totalPages: any;
  searchInput: string='';
  itemsPerPage=10;
  uniqueDates: any = [];
  reportdatas: any;
  fileName= 'MonthlyAttendancereport_Excel.xlsx'; 
  desiredPage: any;
    failed: any;
    showModal: any;

  constructor(private apicall:ApiCallService,private datePipe:DatePipe,private session:LoginService) { }


  ngOnInit(): void {

    this.currentmonth=this.datePipe.transform(new Date(), 'MM');
    this.currentyear=this.datePipe.transform(new Date(), 'Y');

    this.apicall.FetchCompanyList(this.empcode).subscribe((res)=>{
      this.listCompany=res;
    })

    this.apicall.listYear().subscribe((res)=>{
    this.listYear=res;
    })
    this.viewReport(this.currentyear,this.currentmonth,-1);
    
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

  listmonth()
  {
    const year= (<HTMLInputElement>document.getElementById("year")).value;
    this.apicall.listMonth(year).subscribe((res)=>{
    this.listMonth=res;
    })
  }

  viewReport(year:any,month:any,company:any)
  {
    this.uniqueDates = [];
    if(year == this.currentyear && month == this.currentmonth){
      const datedur = this.currentDate.getDate();
      this.monthdays = datedur - 1;
    }else{
      this.monthdays = new Date(year, month,0).getDate();
    }
    const Data: any[] = [];
    this.apicall.FetchMonthlyAttendance(month,year,company,this.empcode).subscribe((res)=>{
      this.reportdata=res;
      const maxPageFiltered = Math.ceil(this.reportdata.length / this.itemsPerPage);  

      if (this.currentPage > maxPageFiltered) {
        this.currentPage = 1;     
      }
      this.processDates();   
    })
    this.apicall.WriteExcelFileMonthlyAttendance(month,year,company,this.empcode).subscribe((res)=>{
      this.reportdatas=res;
    })
  }

  processDates() {
    this.reportdata.forEach((employee: { Attendance: any[]; }) => {
      employee.Attendance.forEach(attendance => {
        const date = attendance.IN_DATE;
        if (!this.uniqueDates.includes(date)) {
          this.uniqueDates.push(date);  
        }
      });
    });
  }
  
  hasAttendance(employee: any, date: string): boolean {
    return employee.Attendance.some((a:any) => a.IN_DATE === date);
  }

  getAttendance(employee: any, date: string): any | undefined {
    return employee.Attendance.find((a: any) => a.IN_DATE === date);
  }

 
  download_to_excel()
  { 
   let Excelname:any;
    Excelname=this.reportdatas.Errormsg;
    let fileurl=`${this.apicall.dotnetapi}/File/GetExcelFeedbackEffectivenessData/${Excelname}`;
    let link = document.createElement("a");
      
    if (link.download !== undefined) {       
      link.setAttribute("href", fileurl);
      link.setAttribute("download", "");
      document.body.appendChild(link);

      link.click();
      document.body.removeChild(link)
      }
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
  const totalResults = this.reportdata.filter((employee: any) => {
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
  
  const filteredData = this.reportdata.filter((employee: any) =>
    Object.values(employee).some((value: any) =>
      typeof value === 'string' &&
      value.toLowerCase().startsWith(this.searchInput.toLowerCase())
    )
  );

  const start = (this.currentPage - 1) * this.itemsPerPage + 1;
  return Math.min(start, filteredData.length);
}


getEntriesEnd(): number {  
  const filteredData = this.reportdata.filter((employee: any) =>
    Object.values(employee).some((value: any) =>
      typeof value === 'string' &&
      value.toLowerCase().startsWith(this.searchInput.toLowerCase())
    )
  );
  const end = this.currentPage * this.itemsPerPage;
  return Math.min(end, filteredData.length);
}


}
