import { Component, OnInit } from '@angular/core';
import { ApiCallService } from 'src/app/api-call.service';
import { DatePipe } from '@angular/common';
import { LoginService } from 'src/app/login.service';
import * as XLSX from 'xlsx'; 

@Component({
  selector: 'app-overtimereport',
  templateUrl: './overtimereport.component.html',
  styleUrls: ['./overtimereport.component.scss']
})
export class OvertimereportComponent implements OnInit {

  userSession:any = this.session.getUserSession();
  empcode: any=this.userSession.empcode;
  level: any=this.userSession.level;
  authorityflg:any =this.userSession.authorityflg;

  searchInput: string = '';
  listCompany: any;
  week: any;
  year: any;
  weekdays: any;
  startDay: any;
  endDay: any;
  daylength: any;
  reportdata: any;  
  currentPagePersonal: any;
  totalreq: any;
  totalPages: any;  
  uniqueDates: any = [];
  fromdt: any;
  todt: any;
  currentmonth: any;
  currentyear: any;
  listYear: any;
  listMonth: any;
  dateAttendanceMap: Map<string, any[]> = new Map<string, any[]>();
  fileName= 'OvertimeReport_Excel.xlsx'; 
  itemsPerPage=10;
  currentPage=1;
  desiredPage: any; 
  // processedAttendance: any;

  processedAttendance: any[] = [];
  showModal: any;
  failed: any;

  constructor(private apicall:ApiCallService, private datePipe: DatePipe,private session:LoginService) { }
  
 // Update the processDates function
 processDates() {
  this.reportdata.forEach((employee: { OTDETAIL: any[] }) => {
    employee.OTDETAIL.forEach(attendance => {
      const date = attendance.OT_DATE;
      if (!this.uniqueDates.includes(date)) {
        this.uniqueDates.push(date);
      }

      if (!this.dateAttendanceMap.has(date)) {
        this.dateAttendanceMap.set(date, []);
      }

      this.dateAttendanceMap.get(date)?.push(attendance);
    });
  });

  this.uniqueDates.sort();

  this.uniqueDates.forEach((date: any) => {
    const attendanceArray = this.dateAttendanceMap.get(date) || [];
    console.log(`Date: ${date}, Attendance: `, attendanceArray);
  });

  // Populate processedAttendance
  this.processedAttendance = this.uniqueDates.map((date: string) => ({
    date,
    attendance: this.dateAttendanceMap.get(date) || []
  }));
}

// exportexcel(): void 
// {
//    /* table id is passed over here */   
//    let element = document.getElementById('excel-table'); 
//    const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(element);

//    /* generate workbook and add the worksheet */
//    const wb: XLSX.WorkBook = XLSX.utils.book_new();
//    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

//    /* save to file */
//    XLSX.writeFile(wb, this.fileName);
  
// }

exportexcel(): void {
  // Get the table element by its ID
  const element = document.getElementById('excel-table');

  // Check if the element is null before proceeding
  if (!element) {
    console.error('Element not found!');
    return;  // Exit the function if element is null
  }

  // Convert the HTML table to a worksheet
  const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

  // Iterate over all cells and convert time-like strings to Excel time format
  for (const cell in ws) {
    if (ws.hasOwnProperty(cell)) {
      const cellValue = ws[cell].v;

      // Check if the value is a string and matches the time format 'hh:mm' or 'hh:mm:ss'
      const timeRegex = /^([0-9]{1,3}):([0-9]{2})(?::([0-9]{2}))?$/; // Allow up to 3 digits for hours
      const match = typeof cellValue === 'string' && timeRegex.test(cellValue);

      if (match) {
        // Extract hours, minutes, and seconds (if available)
        const [hours, minutes, seconds] = cellValue.split(':').map(Number);
        const finalSeconds = seconds || 0; // If no seconds part, set to 0

        let excelTime: number;

        if (hours >= 24) {
          // For hours >= 24, calculate the total fraction of a day
          excelTime = (hours * 60 + minutes + finalSeconds / 60) / (24 * 60);  // Total hours converted to fraction of a day
          // Apply a custom format to allow hours to exceed 24 (handles up to 3-digit hours)
          ws[cell] = { t: 'n', v: excelTime, z: '[h]:mm' };  // Total accumulated hours format
        } else {
          // For regular time (within 24 hours), convert to Excel time
          excelTime = (hours * 60 + minutes + finalSeconds / 60) / (24 * 60); // Fraction of a 24-hour day
          ws[cell] = { t: 'n', v: excelTime, z: 'hh:mm' };  // Standard time format (within 24 hours)
        }
      }
    }
  }

  // Create a new workbook and append the worksheet
  const wb: XLSX.WorkBook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

  // Save the Excel file
  XLSX.writeFile(wb, this.fileName);
}


// Helper function to dynamically set column widths based on table content




viewReport(year: any, month: any, company: any) {
  this.uniqueDates = [];
  this.apicall.FetchOvertimeReport(month, year, company,this.empcode).subscribe((res) => {
    this.reportdata = res;
    console.log('Report Data for Rendering:', this.reportdata);
    this.processDates();
    const maxPageFiltered = Math.ceil(this.reportdata.length / this.itemsPerPage);  

    if (this.currentPage > maxPageFiltered) {
      this.currentPage = 1;     
    }  

  });
}
ngOnInit(): void {
  this.currentmonth = this.datePipe.transform(new Date(), 'MM');
  this.currentyear = this.datePipe.transform(new Date(), 'Y');

  this.apicall.FetchCompanyList(this.empcode).subscribe((res)=>{
    this.listCompany = res;
  });
  this.apicall.listYear().subscribe((res) => {
    this.listYear = res;
  });

  // Comment out the following line
  this.viewReport(this.currentyear, this.currentmonth, -1);
}

// Add this function to initialize processedAttendance
initializeProcessedAttendance() {
  this.processedAttendance = [];
}

hasAttendance(employee: any, date: string): boolean {
  return employee.OTDETAIL.some((a: any) => a.OT_DATE === date);
}

getAttendance(employee: any, date: string): any | undefined {
  return employee.OTDETAIL.find((a: any) => a.OT_DATE === date);
}

  listmonth()
  {
    const year= (<HTMLInputElement>document.getElementById("year")).value;
    this.apicall.listMonth(year).subscribe((res)=>{
    this.listMonth=res;
    })
  }

  download_to_excel()
  { 
   let Excelname:any;
   this.apicall.ExportToExcel(this.reportdata).subscribe((res)=>{
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
