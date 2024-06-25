import { Component, OnInit } from '@angular/core';
import { ApiCallService } from 'src/app/api-call.service';
import { LoginService } from 'src/app/login.service';
import { DatePipe} from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-generate-payment',
  templateUrl: './generate-payment.component.html',
  styleUrls: ['./generate-payment.component.scss']
})
export class GeneratePaymentComponent implements OnInit {

  userSession:any = this.session.getUserSession(); 
  empcode: any=this.userSession.empcode;
  company_code: any=this.userSession.companycode;
  listMonth: any;
  listCompany: any;
  listYear: any;
  filter_year: any = -1;
  filter_month: any = -1;
  month: any = -1;
  company: any = -1;
  payment_type: any = -1;
  bank: any = -1;
  report_type: any = -1;
  listReports: any;
  showModal = 0;
  success:any="";
  failed:any="";
  listpaytype: any;
  listbank: any;
  searchInput: string='';
  itemsPerPage=10;
  currentPage=1;
  desiredPage: any;
  
  constructor(private apicall:ApiCallService,private datePipe:DatePipe,private session:LoginService) { }

  ngOnInit(): void {

    this.apicall.DisplayAllMonths().subscribe((res)=>{
      this.listMonth=res;
    })
    this.apicall.listRegStatus(63).subscribe(res =>{
      this.listpaytype = res;
    })
    this.apicall.listRegStatus(64).subscribe(res =>{
      this.listbank = res;
    })
    this.fetchCompanylist();
    this.FetchPayment_Reports_Summary();
    this.ListYear();
  }

  fetchCompanylist()
  {
    this.apicall.FetchCompanyList(this.empcode).subscribe((res)=>{
      this.listCompany=res;
      })
  }

  ListYear()
  {
    this.apicall.listYear().subscribe((res)=>{
    this.listYear=res;
    })
  }

  GenerateReport(){
    if(this.company == '' || this.payment_type == undefined || this.bank == undefined || this.report_type == undefined || this.month == undefined){
      this.showModal = 2;
      this.failed = 'Please, Fill the fields.';
    }else{
      const newData = {
        company_code : this.company,
        payment_type : this.payment_type,
        bank : this.bank,
        report_type : this.report_type,
        month : this.month,
      };
      
      this.apicall.GeneratePayment(newData).subscribe((res)=>{
      if(res.Errorid == 1)
      {
        this.showModal = 1;
        this.success = "Report Generated Successfully.";
        this.Clear();
        this.FetchPayment_Reports_Summary();
      }
      else
        {
          this.showModal = 2;
          this.failed = "Failed";
        }
      })
      this.FetchPayment_Reports_Summary();
    }
  }

  FetchPayment_Reports_Summary()
  {
    this.apicall.FetchPayment_Reports_Summary(this.empcode,this.filter_month,this.filter_year).subscribe((res)=>{
      this.listReports=res;
    })
  }

  Clear()
  {
    this.company = -1;
    this.month = -1;
    this.report_type = -1;
    this.bank = -1;
    this.payment_type = -1;
  }

  Get_WPS_File(data:any)
  {
    let Excelname:any;
    this.apicall.Get_WPS_File(data.COMPANY,data.MONTH_ID,data.BANK,data.REPORT_TYPE,data.PAYMENT_TYPE).subscribe((res)=>{
    // alert(res.Errormsg)
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
  const maxPageNumbers = 5; 
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
    const totalResults = this.listReports.filter((employee: any) => {
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

const filteredData = this.listReports.filter((employee: any) =>
  Object.values(employee).some((value: any) =>
    typeof value === 'string' &&
    value.toLowerCase().startsWith(this.searchInput.toLowerCase())
  )
);

const start = (this.currentPage - 1) * this.itemsPerPage + 1;
return Math.min(start, filteredData.length);
}


getEntriesEnd(): number {  
const filteredData = this.listReports.filter((employee: any) =>
  Object.values(employee).some((value: any) =>
    typeof value === 'string' &&
    value.toLowerCase().startsWith(this.searchInput.toLowerCase())
  )
);
const end = this.currentPage * this.itemsPerPage;
return Math.min(end, filteredData.length);
}

}
