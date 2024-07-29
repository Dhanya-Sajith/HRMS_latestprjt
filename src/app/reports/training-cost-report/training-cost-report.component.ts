import { Component, OnInit } from '@angular/core';
import { ApiCallService } from 'src/app/api-call.service';
import { LoginService } from 'src/app/login.service';
import { DatePipe, JsonPipe } from '@angular/common';


@Component({
  selector: 'app-training-cost-report',
  templateUrl: './training-cost-report.component.html',
  styleUrls: ['./training-cost-report.component.scss']
})
export class TrainingCostReportComponent implements OnInit {

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
  statustypeid = 67;
  liststatus: any;
  tr_report: any;

  constructor(private session:LoginService,private apicall:ApiCallService,private datePipe: DatePipe) { }

  ngOnInit(): void {
    //Year list
    this.apicall.listYear().subscribe((res)=>{
      this.yearlist=res;
    });
    //Company list
    this.apicall.FetchCompanyList(this.empcode).subscribe((res)=>{
      this.company=res;
    });

    this.ListStatus();
    this.fetch_tr_sts_report();
    
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
  fetch_tr_sts_report(){    
   
    const year=-1;
    const company=-1;
    this.apicall.fetchtraining_cost_rpt(this.empcode,company,this.year).subscribe((res)=>{
      this.tr_report=res;
      const maxPageFiltered = Math.ceil(this.tr_report.length / this.itemsPerPage);  

      if (this.currentPage > maxPageFiltered) {
        this.currentPage = 1;     
      } 
   
    });

  }

  fetch_tr_sts_reportfilter(){   

  
   const year =  (<HTMLInputElement>document.getElementById("year")).value;
   const company = (<HTMLInputElement>document.getElementById("comcode")).value;

      this.apicall.fetchtraining_cost_rpt(this.empcode,company,year).subscribe((res)=>{
      this.tr_report=res;
      const maxPageFiltered = Math.ceil(this.tr_report.length / this.itemsPerPage);  

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
// download_to_excel()
//   { 
//    let Excelname:any;
//    this.apicall.ExportToExcel(this.tr_report).subscribe((res)=>{
//     Excelname=res.Errormsg;
//     let fileurl=this.apicall.GetExcelFile(Excelname);
//     let link = document.createElement("a");
      
//         if (link.download !== undefined) {
//           link.setAttribute("href", fileurl);
//           link.setAttribute("download", "ReportFile.xlsx");
//           document.body.appendChild(link);
//           link.click();
//           document.body.removeChild(link);
//    }
//   });
  
//     }


download_to_excel()
  {
  interface detaildata {
    COMPANY: string;
    REMARKS: string;
    SUBJECT_NAME: string;
    SCHEDULED_DATE: string;
    EMP_CODE:string;
    EMP_NAME: string;
    LOCATION: string;
    PROVIDER_NAME: string;
    TOTAL_COST: string;

  }
  
  const Data: any[] = [];
  const datalength = this.tr_report.length;
  this.tr_report.forEach((data:detaildata) => { 
  
        const details = {
          Companyname: data.COMPANY ,
          Trainingtype: data.REMARKS,
          Course: data.SUBJECT_NAME,     
          Dateoftraining: this.datePipe.transform(data.SCHEDULED_DATE, "yyyy-MM-dd") ,
          Employeecode: data.EMP_CODE,
          Employeename :  data.EMP_NAME, 
          Department:data.LOCATION,
          Provider:data.PROVIDER_NAME,
          Trainingcost:data.TOTAL_COST
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
const totalResults = this.tr_report.filter((policy: any) => {
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

const filteredData = this.tr_report.filter((policy: any) =>
  Object.values(policy).some((value: any) =>
    typeof value === 'string' &&
    value.toLowerCase().startsWith(this.searchInput.toLowerCase())
  )
);

const start = (this.currentPage - 1) * this.itemsPerPage + 1;
return Math.min(start, filteredData.length);
}


getEntriesEnd(): number {  
const filteredData = this.tr_report.filter((policy: any) =>
  Object.values(policy).some((value: any) =>
    typeof value === 'string' &&
    value.toLowerCase().startsWith(this.searchInput.toLowerCase())
  )
);
const end = this.currentPage * this.itemsPerPage;
return Math.min(end, filteredData.length);
} 
  
}
