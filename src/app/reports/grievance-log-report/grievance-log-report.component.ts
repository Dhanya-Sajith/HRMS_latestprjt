// import { Component, OnInit } from '@angular/core';

// @Component({
//   selector: 'app-grievance-log-report',
//   templateUrl: './grievance-log-report.component.html',
//   styleUrls: ['./grievance-log-report.component.scss']
// })
// export class GrievanceLogReportComponent implements OnInit {

//   constructor() { }

//   ngOnInit(): void {
//   }

// }
import { Component, OnInit } from '@angular/core';
import { ApiCallService } from 'src/app/api-call.service';
import { LoginService } from 'src/app/login.service';
import { JsonPipe, formatDate,DatePipe } from '@angular/common';
import { FormControl,FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-grievance-log-report',
  templateUrl: './grievance-log-report.component.html',
  styleUrls: ['./grievance-log-report.component.scss']
})
export class GrievanceLogReportComponent implements OnInit {
  userSession:any = this.session.getUserSession();
  empcode: any=this.userSession.empcode;
  level: any=this.userSession.level;
  authorityflg:any =this.userSession.authorityflg;

  searchInput: string='';
  itemsPerPage=10;
  currentPage=1;
  yearlist: any;
  year: any=-1;
  monthlist: any;
  listCompany: any;
  company: any;
  salarydata: any;
  companycode: any=-1;
  statusval: any=-1; 
  message: any;
  failed: any;
  desiredPage: any;
  showModal: any;
  statustypeid = 76;
  liststatus: any;
  //tr_report: any;
  griev_report: any;

  constructor(private session:LoginService,private apicall:ApiCallService,private datePipe: DatePipe) { }

  ngOnInit(): void {//Year list
    this.apicall.listYear().subscribe((res)=>{
      this.yearlist=res;
    });
    //Company list
    this.apicall.FetchCompanyList(this.empcode).subscribe((res)=>{
      this.company=res;
    });

    this.ListStatus();
    //this.fetch_tr_sts_report();
    this.fetch_griev_report();
    
  }

  ListStatus()
  {
    this.apicall.listStatus(this.statustypeid).subscribe((res)=>{
      this.liststatus=res;
      })
  }

  onYearSelected() {
    this.apicall.listMonth(this.year).subscribe((res)=>{
      this.monthlist=res;
    });
  }

  fetch_griev_report(){  
    
    this.apicall.fetch_Grievance_Report(this.empcode,this.statusval,this.year,this.companycode).subscribe((res)=>{
      this.griev_report=res;
      const maxPageFiltered = Math.ceil(this.griev_report.length / this.itemsPerPage);  

      if (this.currentPage > maxPageFiltered) {
        this.currentPage = 1;     
      } 
     // console.log(JSON.stringify(this.salarydata))
    });
 // }
  }

  fetch_griev_reportfilter(){  
   
    const year =  (<HTMLInputElement>document.getElementById("comcode")).value;
    const statusval = (<HTMLInputElement>document.getElementById("year")).value;
    const companycode =(<HTMLInputElement>document.getElementById("statusval")).value;
 
     this.apicall.fetch_Grievance_Report(this.empcode,this.statusval,this.year,this.companycode).subscribe((res)=>{
       this.griev_report=res;
       const maxPageFiltered = Math.ceil(this.griev_report.length / this.itemsPerPage);  
 
       if (this.currentPage > maxPageFiltered) {
         this.currentPage = 1;     
       } 
     
     });
 
   }
 
  getGroupItemValue(groups: any[], groupName: string, itemName: string): any {
    const group = groups.find(group => group.GROUP_NAME === groupName);
    if (group) {
        const item = group.Item.find((item: { ITEM: string; }) => item.ITEM === itemName);
        return item ? item.ITEM_VALUE : '';
    }
    return '';
}

download_to_excel()
  {
    // REQUEST_ID,EMP_CODE,EMP_NAME,REQUEST_DATE,DESCRIPTION,CLOSURE_COMMENT,CLOSURE_DATE,CLOSURE_BY,REQ_STATUS,STATUS_VAL 
  interface detaildata {
    REQUEST_ID: string;
    EMP_CODE: string;
    EMP_NAME: string;
    REQUEST_DATE: string;
    DESCRIPTION: string;
    CLOSURE_COMMENT: string;
    STATUS_VAL: string;
    CLOSURE_DATE: string;
    CLOSURE_BY: string; 
  }
  
  const Data: any[] = [];
  const datalength = this.griev_report.length;
  this.griev_report.forEach((data:detaildata) => { 
  // GrievenceId, ReportedDate, Emp Name , EMp id , Issue,  Resolution, status, ResolvedDate, Resolvedby
        const details = {
          GrievenceId: data.REQUEST_ID ,
          EmployeeCode: data.EMP_CODE ,
          EmployeeName: data.EMP_NAME,
          ReportedDate: this.datePipe.transform(data.REQUEST_DATE, "dd-MM-yyyy") ,
          Issue : data.DESCRIPTION, 
          Resolution : data.CLOSURE_COMMENT,
          status :  data.STATUS_VAL,     
          ResolvedDate: this.datePipe.transform(data.CLOSURE_DATE, "dd-MM-yyyy") ,
          Resolvedby: data.CLOSURE_BY,          
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
const totalResults = this.griev_report.filter((policy: any) => {
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

const filteredData = this.griev_report.filter((policy: any) =>
  Object.values(policy).some((value: any) =>
    typeof value === 'string' &&
    value.toLowerCase().startsWith(this.searchInput.toLowerCase())
  )
);

const start = (this.currentPage - 1) * this.itemsPerPage + 1;
return Math.min(start, filteredData.length);
}


getEntriesEnd(): number {  
const filteredData = this.griev_report.filter((policy: any) =>
  Object.values(policy).some((value: any) =>
    typeof value === 'string' &&
    value.toLowerCase().startsWith(this.searchInput.toLowerCase())
  )
);
const end = this.currentPage * this.itemsPerPage;
return Math.min(end, filteredData.length);
  }

}

