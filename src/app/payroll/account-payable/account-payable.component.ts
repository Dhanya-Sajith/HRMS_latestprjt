import { Component, OnInit } from '@angular/core';
import { ApiCallService } from 'src/app/api-call.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from 'src/app/login.service';
import { JsonPipe, formatDate,DatePipe } from '@angular/common';
import { FormControl,FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AnyCatcher } from 'rxjs/internal/AnyCatcher';

@Component({
  selector: 'app-account-payable',
  templateUrl: './account-payable.component.html',
  styleUrls: ['./account-payable.component.scss']
})
export class AccountPayableComponent implements OnInit {
  userSession:any = this.session.getUserSession();
  authorityflg:any =this.userSession.authorityflg;
  empcode: any=this.userSession.empcode;
  empid:any =this.userSession.id;
  listCompanyacc:any
  listdates: any;
  fromdate = new FormControl();
  todate = new FormControl();
  lfromdate = new FormControl();
  ltodate = new FormControl();
  user: any='Expense';
  listemployee: any;
  listexpenseclaim: any;
  description: any;
  itemsPerPage=10;
  currentPage=1;
  currentPageloan=1;
  desiredPage: any; 
  desiredPageloan: any;
  searchInput: string='';
  searchInputloan: string='';
  totalPages:any;
  totalPagesloan:any;
  liststatusloan: any;
  showModal = 0; 
  
  failed!: string;
  success!: string;
  listloan: any;
  remarks: any;
  paymentdetails: any;
  DISBURSEMENT_DATE: any;
  activereqid: any;
  docName: any;

  constructor(private session:LoginService,private apicall:ApiCallService,private router:Router) { }

  ngOnInit(): void {
    this.FetchDates();
    this.ListstatusLoan();
    this.Listcompany();
    this.ExpenseClaimFilter();
  };;
  radioselection(user:any){
    this.user=user;
    if(this.user==='Loan')
      {
        this.FetchDates();
        this.Listcompany();
        this.LoanFilter();
        this.ListstatusLoan();
      }
      else
      {
        this.Listcompany();
        this.FetchDates();
        this.ExpenseClaimFilter();
      }
  }
Listcompany()
{
  this.apicall.FetchCompanyList(this.empcode).subscribe((res)=>{
    this.listCompanyacc=res;
    if(this.user==='Loan')
      {
      this.ListstatusLoan();
      this.LoanFilter();
      this.FetchEmployeeList();
  
  
      }
      else{
        this.FetchEmployeeList();
        this.ExpenseClaimFilter();
      }
  })
}
FetchDates()
{
  this.apicall.listFromToDates().subscribe(res=>{
    this.listdates = res;
    if(this.listdates.length > 0)
    {
      const listdatesdata = this.listdates[0];

      this.fromdate.setValue(formatDate(listdatesdata.FROM_DATE,'yyyy-MM-dd','en'));
      this.todate.setValue(formatDate(listdatesdata.TO_DATE,'yyyy-MM-dd','en'));
      this.lfromdate.setValue(formatDate(listdatesdata.FROM_DATE,'yyyy-MM-dd','en'));
      this.ltodate.setValue(formatDate(listdatesdata.TO_DATE,'yyyy-MM-dd','en'));
    }
    })
  
  }
FetchEmployeeList()
{
  const company_code= (<HTMLInputElement>document.getElementById("exp_company")).value;
  this.apicall.FetchEmployeeList(0,company_code,this.empcode).subscribe((res)=>{
    this.listemployee=res;
  })
  if(this.user==='Loan')
    {
    this.ListstatusLoan();
    this.LoanFilter();
    }
    else{
  this.ExpenseClaimFilter();
    }
}

ExpenseClaimFilter()
  {
    const comp= (<HTMLInputElement>document.getElementById("exp_company")).value;
    const emp = (<HTMLInputElement>document.getElementById("exp_employee")).value;
    if( this.fromdate.value > this.todate.value){
      (<HTMLInputElement>document.getElementById("openModalButton")).click();
      this.showModal = 2;
      this.failed = "Please Correct the Dates";
    }else{
    const data = {
      company:comp,
      emp_code: emp,
      fromdate: this.fromdate.value,
      todate: this.todate.value, 
      user:this.empcode,
      };
     this.apicall.AccountsExpenseClaimFilter(data).subscribe(res =>{
      this.listexpenseclaim=res;
      const maxPageFiltered = Math.ceil(this.listexpenseclaim.length / this.itemsPerPage);  

      if (this.currentPage > maxPageFiltered) {
        this.currentPage = 1;     
      }   
      })
  }
}
  selectDescription(reason:any){
    this.description=reason;
  }
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
  const totalResults = this.listexpenseclaim.filter((employee: any) => {
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
  
  const filteredData = this.listexpenseclaim.filter((employee: any) =>
    Object.values(employee).some((value: any) =>
      typeof value === 'string' &&
      value.toLowerCase().startsWith(this.searchInput.toLowerCase())
    )
  );

  const start = (this.currentPage - 1) * this.itemsPerPage + 1;
  return Math.min(start, filteredData.length);
}

getEntriesEnd(): number {  
  const filteredData = this.listexpenseclaim.filter((employee: any) =>
    Object.values(employee).some((value: any) =>
      typeof value === 'string' &&
      value.toLowerCase().startsWith(this.searchInput.toLowerCase())
    )
  );
  const end = this.currentPage * this.itemsPerPage;
  return Math.min(end, filteredData.length);
}
ListstatusLoan()
{
  this.apicall.listStatus(67).subscribe((res)=>{
    this.liststatusloan=res;
  })
}
LoanFilter()
  {
    const comp= (<HTMLInputElement>document.getElementById("ln_cmpny")).value;
    const emp = (<HTMLInputElement>document.getElementById("ln_employee")).value;
    const status = (<HTMLInputElement>document.getElementById("ln_status")).value;
    if( this.lfromdate.value > this.ltodate.value){
      (<HTMLInputElement>document.getElementById("openModalButton")).click();
      this.showModal = 2;
      this.failed = "Please Correct the Dates";
    }else{
    const data = {
      company:comp,
      emp_code: emp,
      status:status,
      fromdate: this.lfromdate.value,
      todate: this.ltodate.value, 
      user:this.empcode,
      };
      this.apicall.AccountsLoanFilter(data).subscribe(res =>{
      this.listloan=res;
      alert(JSON.stringify(this.listloan));
      const maxPageFiltered = Math.ceil(this.listloan.length / this.itemsPerPage);  
      if (this.currentPageloan > maxPageFiltered) {
        this.currentPageloan = 1;     
      }   
      })
  }
}
getTotalPagesLoan(): number {
  return Math.ceil(this.totalSearchResultsloan / this.itemsPerPage);
}

goToPageLoan() {
  const totalPages = Math.ceil(this.totalSearchResultsloan / this.itemsPerPage);
  if (this.desiredPageloan >= 1 && this.desiredPageloan <= totalPages) {
    this.currentPageloan = this.desiredPageloan;
  } else {  
    
    (<HTMLInputElement>document.getElementById("openModalButton")).click();
    this.showModal = 2; 
    this.failed='Invalid page number!'; 
    this.desiredPageloan=''; 
  }   
 
}
getPageNumbersLoan(currentPageloan: number): number[] {
  const totalPages = Math.ceil(this.totalSearchResultsloan / this.itemsPerPage);
  const maxPageNumbers = 5; // Number of page numbers to show
  const middlePage = Math.ceil(maxPageNumbers / 2);
  let startPage = Math.max(currentPageloan - middlePage, 1);
  let endPage = Math.min(startPage + maxPageNumbers - 1, totalPages);

  if (endPage - startPage + 1 < maxPageNumbers) {
    startPage = Math.max(endPage - maxPageNumbers + 1, 1);
  }

  return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
}

// Function to Calculate the total number of search results
get totalSearchResultsloan(): number {
const totalResults = this.listloan.filter((loan: any) => {
  return Object.values(loan).some((value: any) =>
    typeof value === 'string' && value.toLowerCase().startsWith(this.searchInputloan.toLowerCase())
  );
}).length;

const maxPageFiltered = Math.ceil(totalResults / this.itemsPerPage);  

if (this.currentPageloan > maxPageFiltered) {
  this.currentPageloan = 1; 
}

return totalResults;
}

// Function to change the current page
changePageLoan(page: number): void { 
  this.desiredPageloan = '';   
  this.currentPageloan = page;
  const maxPage = Math.ceil(this.totalSearchResultsloan / this.itemsPerPage);
  if (this.currentPageloan > maxPage) {
    this.currentPageloan = 1;
  }        
}
getEntriesStartLoan(): number {
if (this.currentPageloan === 1) {
  return 1;
}

const filteredData = this.listloan.filter((loan: any) =>
  Object.values(loan).some((value: any) =>
    typeof value === 'string' &&
    value.toLowerCase().startsWith(this.searchInputloan.toLowerCase())
  )
);

const start = (this.currentPageloan - 1) * this.itemsPerPage + 1;
return Math.min(start, filteredData.length);
}

getEntriesEndLoan(): number {  
const filteredData = this.listloan.filter((loan: any) =>
  Object.values(loan).some((value: any) =>
    typeof value === 'string' &&
    value.toLowerCase().startsWith(this.searchInputloan.toLowerCase())
  )
);
const end = this.currentPageloan * this.itemsPerPage;
return Math.min(end, filteredData.length);
}
selectRemarks(remarks:any){
  this.remarks=remarks;
}
Fetchloanpayments(ecd:any,reqid:any)
{
  this.apicall.LoanPaymentDetails(ecd,reqid).subscribe((res)=>{
    this.paymentdetails=res;
    this.DISBURSEMENT_DATE=this.paymentdetails[0].DISBURSEMENT_DATE;
  })
}
ActivereqID(reqid:any,docname:any){
  this.activereqid = reqid;
  this.docName = docname
}
download_to_excel()
  { 

   let Excelname:any;
    let fileurl=this.apicall.GetExpenseclaimFile(this.activereqid,this.docName);
    let link = document.createElement("a");
      
        if (link.download !== undefined) {
       //   let url = URL.createObjectURL(blob);
          link.setAttribute("href", fileurl);
          link.setAttribute("download", "");
          link.setAttribute('target', '_blank');
          document.body.appendChild(link);

          link.click();
          document.body.removeChild(link);

   }
  // });
  
    }
    download_to_excelExpenseandLoan()
  { 
   let Excelname:any;
   if(this.user=='Loan')
    {
   this.apicall.ExportToExcel(this.listloan).subscribe((res)=>{
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
else{
  this.apicall.ExportToExcel(this.listexpenseclaim).subscribe((res)=>{
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
  
 }
}