// import { Component, OnInit } from '@angular/core';

// @Component({
//   selector: 'app-eos-report',
//   templateUrl: './eos-report.component.html',
//   styleUrls: ['./eos-report.component.scss']
// })
// export class EosReportComponent implements OnInit {

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
  selector: 'app-eos-report',
  templateUrl: './eos-report.component.html',
  styleUrls: ['./eos-report.component.scss']
})
export class EosReportComponent implements OnInit {
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
 //griev_report: any;
  fromdt = new FormControl();
  todt = new FormControl();
  listdates: any;
  date = new Date();
  firstDay1 = new Date(this.date.getFullYear(), this.date.getMonth(), 1);
  lastDay1 = new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0);
  firstDay=this.datePipe.transform(this.firstDay1,"yyyy-MM-dd");
  lastDay=this.datePipe.transform(this.lastDay1,"yyyy-MM-dd");
  report: any;
  
  constructor(private session:LoginService,private apicall:ApiCallService,private datePipe: DatePipe) { }

  ngOnInit(): void {

    //Company list
    this.apicall.FetchCompanyList(this.empcode).subscribe((res)=>{
      this.company=res;
    });

    this.apicall.listFromToDates().subscribe(res=>{
      this.listdates = res;
      if(this.listdates.length > 0)
      {
        const listdatesdata = this.listdates[0];
        this.fromdt.setValue(formatDate(listdatesdata.FROM_DATE,'yyyy-MM-dd','en'));
        this.todt.setValue(formatDate(listdatesdata.TO_DATE,'yyyy-MM-dd','en'));
      };
      })
    //this.ListStatus();    
    this.fetch_EOS_Report();
    
  }
  onYearSelected() {
    this.apicall.listMonth(this.year).subscribe((res)=>{
      this.monthlist=res;
    });
  }

  fetch_EOS_Report(){  
    //string company,string fromdate,string todate,string user    
    this.apicall.fetch_EOS_Report(this.companycode,this.firstDay,this.lastDay,this.empcode,).subscribe((res)=>{
      this.report=res;
      //alert(JSON.stringify(res))
      const maxPageFiltered = Math.ceil(this.report.length / this.itemsPerPage);  

      if (this.currentPage > maxPageFiltered) {
        this.currentPage = 1;     
      } 
     // console.log(JSON.stringify(this.salarydata))
    });
 // }
  }

  fetch_eos_reportfilter(){  
   
    const fromdt= (<HTMLInputElement>document.getElementById("fromdt")).value;
    const todt= (<HTMLInputElement>document.getElementById("todt")).value;
    if( fromdt > todt){
      (<HTMLInputElement>document.getElementById("openModalButton")).click();
      this.showModal = 2;
      this.failed = "Please Correct the Dates";
    }else{
 
    this.apicall.fetch_EOS_Report(this.companycode,fromdt,todt,this.empcode,).subscribe((res)=>{
      this.report=res;
       const maxPageFiltered = Math.ceil(this.report.length / this.itemsPerPage);  
 
       if (this.currentPage > maxPageFiltered) {
         this.currentPage = 1;     
       } 
     
     });
    }
 
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
    //EmpCode Emp Name Department Designation Date of JoiningDate of Leaving Resignation dateEOS Amount Status
  interface detaildata {  
    EMP_CODE: string;
    EMP_NAME: string;
    DEPARTMENT: string;
    DESIGNATION: string;
    DATE_OF_JOINING: string;
    LEAVING_DATE: string;
    RESIGNATION_DATE: string;
    EOS_AMOUNT: string; 
    STATUS_VALUE: string;
  }
 
  const Data: any[] = [];
  const datalength = this.report.length;
  this.report.forEach((data:detaildata) => { 
  // GrievenceId, ReportedDate, Emp Name , EMp id , Issue,  Resolution, status, ResolvedDate, Resolvedby
        const details = {          
          EmployeeCode: data.EMP_CODE ,
          EmployeeName: data.EMP_NAME,
          Department: data.DEPARTMENT,
          Designation: data.DESIGNATION,
          DateOfJoining: this.datePipe.transform(data.DATE_OF_JOINING, "dd-MM-yyyy") ,
          LeavingDate: this.datePipe.transform(data.LEAVING_DATE, "dd-MM-yyyy") ,
          ResignationDate: this.datePipe.transform(data.RESIGNATION_DATE, "dd-MM-yyyy") ,
          EOSAmount : data.EOS_AMOUNT,          
          Status :  data.STATUS_VALUE,
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
const totalResults = this.report.filter((policy: any) => {
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

const filteredData = this.report.filter((policy: any) =>
  Object.values(policy).some((value: any) =>
    typeof value === 'string' &&
    value.toLowerCase().startsWith(this.searchInput.toLowerCase())
  )
);

const start = (this.currentPage - 1) * this.itemsPerPage + 1;
return Math.min(start, filteredData.length);
}


getEntriesEnd(): number {  
const filteredData = this.report.filter((policy: any) =>
  Object.values(policy).some((value: any) =>
    typeof value === 'string' &&
    value.toLowerCase().startsWith(this.searchInput.toLowerCase())
  )
);
const end = this.currentPage * this.itemsPerPage;
return Math.min(end, filteredData.length);
  }

}


