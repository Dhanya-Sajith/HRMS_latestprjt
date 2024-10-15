import { Component, OnInit } from '@angular/core';
import { ApiCallService } from 'src/app/api-call.service';
import { LoginService } from 'src/app/login.service';
import { JsonPipe, formatDate,DatePipe } from '@angular/common';

@Component({
  selector: 'app-documents-report',
  templateUrl: './documents-report.component.html',
  styleUrls: ['./documents-report.component.scss']
})
export class DocumentsReportComponent implements OnInit {

  showModal: any;
  userSession:any = this.session.getUserSession();
  empcode: any=this.userSession.empcode;
  level: any=this.userSession.level;
  authorityflg:any =this.userSession.authorityflg;
  company: any;
  message: any;
  failed!: string;
  success!: string;
  searchInput: string='';
  companycode: any=-1;
  employee: any=-1;
  listemployee: any;
  itemsPerPage=10;
  currentPage=1;
  desiredPage: any;
documentdata: any;

constructor(private session:LoginService,private apicall:ApiCallService,private datePipe: DatePipe) { }

ngOnInit(): void {
  this.apicall.FetchCompanyList(this.empcode).subscribe((res)=>{
    this.company=res;
  });

  
}
FetchEmployeeList()
{
this.apicall.listEmployee(-1,this.companycode).subscribe((res)=>{
this.listemployee=res;
});
}
DocumentReport()
{
  this.apicall.ViewDocumentReports(this.companycode,this.employee).subscribe((res)=>{
    this.documentdata=res;
    const maxPageFiltered = Math.ceil(this.documentdata.length / this.itemsPerPage);  

    if (this.currentPage > maxPageFiltered) {
      this.currentPage = 1;     
    } 
  });
}
download_to_excel()
{ 
  interface detaildata {
    EMP_CODE: string;
    EMP_NAME: string;
    DOC_TYPE: string;
    DOC_NO: string;
    RENEWAL_DATE: string;
    EXP_DATE: string;
    
  }
  const Data: any[] = [];
  const datalength = this.documentdata.length;
  this.documentdata.forEach((data:detaildata) => { 
  
        const details = {
          EMPID: data.EMP_CODE,
          NAME: data.EMP_NAME,
          DOCUMENTNAME: data.DOC_TYPE,      
          DOCUMENTNO: data.DOC_NO ,
          RENEWALDATE: this.datePipe.transform(data.RENEWAL_DATE, "yyyy-MM-dd") ,
          EXPIRYDATE: this.datePipe.transform(data.EXP_DATE, "yyyy-MM-dd") ,
              
        };
  
        Data.push(details);
  });
let Excelname:any;
this.apicall.ExportToExcel(Data).subscribe((res)=>{
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
const totalResults = this.documentdata.filter((policy: any) => {
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

const filteredData = this.documentdata.filter((policy: any) =>
Object.values(policy).some((value: any) =>
typeof value === 'string' &&
value.toLowerCase().startsWith(this.searchInput.toLowerCase())
)
);

const start = (this.currentPage - 1) * this.itemsPerPage + 1;
return Math.min(start, filteredData.length);
}


getEntriesEnd(): number {  
const filteredData = this.documentdata.filter((policy: any) =>
Object.values(policy).some((value: any) =>
typeof value === 'string' &&
value.toLowerCase().startsWith(this.searchInput.toLowerCase())
)
);
const end = this.currentPage * this.itemsPerPage;
return Math.min(end, filteredData.length);
}  
}
