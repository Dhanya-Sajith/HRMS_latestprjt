import { Component, OnInit } from '@angular/core';
import { ApiCallService } from 'src/app/api-call.service';
import { FormGroup, FormControl, FormArray, FormBuilder, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { formatDate } from '@angular/common'; 
import { LoginService } from 'src/app/login.service';
import * as XLSX from 'xlsx'; 

@Component({
  selector: 'app-airticket-cost-report',
  templateUrl: './airticket-cost-report.component.html',
  styleUrls: ['./airticket-cost-report.component.scss']
})
export class AirticketCostReportComponent implements OnInit {

  userSession:any = this.session.getUserSession();
  empcode: any=this.userSession.empcode;
  listCompany: any;

  listairtickets:any;
  totalreqPersonal: any; 
  totalPagesPersonal!: number[];
  
  listdates:any;
  fromdt:any;
  todt:any;

  date = new Date();
  firstDay1 = new Date(this.date.getFullYear(), this.date.getMonth(), 1);
  lastDay1 = new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0);

  firstDay=this.datePipe.transform(this.firstDay1,"yyyy-MM-dd");
  lastDay=this.datePipe.transform(this.lastDay1,"yyyy-MM-dd");
  searchInput: string = '';

  showModal = 0;
  success:any="";
  failed:any="";
  itemsPerPage=10;
  currentPage=1;
  desiredPage: any; 
  comcode: any = -1;
  fileName= 'AirticketCostReport_Excel.xlsx'; 

  constructor(private apicall:ApiCallService,private datePipe: DatePipe,private session:LoginService) { }

  ngOnInit(): void {
    this.apicall.FetchCompanyList(this.empcode).subscribe((res)=>{
      this.listCompany=res;
    })

    this.apicall.listFromToDates().subscribe(res=>{
      this.listdates = res;
      if(this.listdates.length > 0)
      {
        const listdatesdata = this.listdates[0];
        this.fromdt = this.datePipe.transform(listdatesdata.FROM_DATE,'yyyy-MM-dd','en');
        this.todt = this.datePipe.transform(listdatesdata.TO_DATE,'yyyy-MM-dd','en');
      };
    })
    this.apicall.FetchAirticketsCostReport(this.empcode,this.comcode,this.firstDay,this.lastDay).subscribe((res)=>{
      this.listairtickets=res;     
     })
  }

  viewReport()
  {
      this.apicall.FetchAirticketsCostReport(this.empcode,this.comcode,this.fromdt,this.todt).subscribe((res)=>{
       this.listairtickets=res;    
       const maxPageFiltered = Math.ceil(this.listairtickets.length / this.itemsPerPage);  

       if (this.currentPage > maxPageFiltered) {
         this.currentPage = 1;     
       }  
      })
  }

  download_to_excel()
  {
  interface detaildata {
    EMP_CODE: string;
    EMP_NAME: string;
    COMPANY: string;
    DEPT: string;
    TYPE: string;
    STATUS_VAL: string;
    START_DATE: string;
    END_DATE: string;
    PASSENGERS: string;
    COST: Float32Array;
  }
  
  const Data: any[] = [];
  const datalength = this.listairtickets.length;
  this.listairtickets.forEach((data:detaildata) => { 
  
        const details = {
          EMPCODE: data.EMP_CODE ,
          EMPNAME: data.EMP_NAME,
          COMPANY: data.COMPANY,
          DEPARTMENT: data.DEPT,      
          DEPARTURE: data.TYPE ,
          DESTINATION: data.STATUS_VAL,
          DEPARTING: this.datePipe.transform(data.START_DATE, "yyyy-MM-dd") ,
          RETURNING: this.datePipe.transform(data.END_DATE, "yyyy-MM-dd") ,
          PASSENGERS: 'Self',
          COST: data.COST,     
        };
  
        Data.push(details);
  });
  
   let Excelname:any;
   this.apicall.ExportToExcel(Data).subscribe((res)=>{
    Excelname=res.Errormsg;
    let fileurl=this.apicall.GetExcelFile(Excelname);
    let link = document.createElement("a");
      
        if (link.download !== undefined) {
          link.setAttribute("href", fileurl);
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
const totalResults = this.listairtickets.filter((policy: any) => {
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

const filteredData = this.listairtickets.filter((policy: any) =>
  Object.values(policy).some((value: any) =>
    typeof value === 'string' &&
    value.toLowerCase().startsWith(this.searchInput.toLowerCase())
  )
);

const start = (this.currentPage - 1) * this.itemsPerPage + 1;
return Math.min(start, filteredData.length);
}


getEntriesEnd(): number {  
const filteredData = this.listairtickets.filter((policy: any) =>
  Object.values(policy).some((value: any) =>
    typeof value === 'string' &&
    value.toLowerCase().startsWith(this.searchInput.toLowerCase())
  )
);
const end = this.currentPage * this.itemsPerPage;
return Math.min(end, filteredData.length);
}

}
