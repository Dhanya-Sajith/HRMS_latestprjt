import { Component, OnInit } from '@angular/core';
import { ApiCallService } from 'src/app/api-call.service';
import { DatePipe } from '@angular/common';
import { LoginService } from 'src/app/login.service';

@Component({
  selector: 'app-training-expiry-report',
  templateUrl: './training-expiry-report.component.html',
  styleUrls: ['./training-expiry-report.component.scss']
})
export class TrainingExpiryReportComponent implements OnInit {

  userSession:any = this.session.getUserSession();
  empcode: any=this.userSession.empcode;
  level: any=this.userSession.level;
  authorityflg:any =this.userSession.authorityflg;

  listCompany:any;
  comtypeid=12;
  listYear:any;
  currentyear: any;

  failed: any;
  showModal: any;
  searchInput: string='';
  statustypeid = 67;
  liststatus: any;
  listexpiry: any;
  itemsPerPage=10;
  currentPage=1;
  desiredPage: any;
  hiddenValues: string[] = ['Cancelled', 'Rejected'];
  constructor(private apicall:ApiCallService,private datePipe:DatePipe,private session:LoginService) { }

  ngOnInit(): void {
    this.currentyear=this.datePipe.transform(new Date(), 'Y');

    this.apicall.FetchCompanyList(this.empcode).subscribe((res)=>{
      this.listCompany=res;
    })
    this.apicall.listStatus(this.statustypeid).subscribe((res)=>{
      this.liststatus=res;
      })
    this.apicall.listYear().subscribe((res)=>{
    this.listYear=res;
    })
    this.FetchExpiryData();
  }
  isHidden(value: string): boolean {
    return this.hiddenValues.includes(value);
  }
FetchExpiryData()
{

  const compny= (<HTMLInputElement>document.getElementById("comcode")).value;
  const status= (<HTMLInputElement>document.getElementById("reqstatus")).value;
  const year= (<HTMLInputElement>document.getElementById("year")).value;

  this.apicall.FetchTrainingExpiryData(this.empcode,compny,status,year).subscribe((res)=>{
    this.listexpiry=res;
    const maxPageFiltered = Math.ceil(this.listexpiry.length / this.itemsPerPage);  
  
      if (this.currentPage > maxPageFiltered) {
        this.currentPage = 1;     
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
  const totalResults = this.listexpiry.filter((policy: any) => {
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
  
  const filteredData = this.listexpiry.filter((policy: any) =>
  Object.values(policy).some((value: any) =>
    typeof value === 'string' &&
    value.toLowerCase().startsWith(this.searchInput.toLowerCase())
  )
  );
  
  const start = (this.currentPage - 1) * this.itemsPerPage + 1;
  return Math.min(start, filteredData.length);
  }
  
  
  getEntriesEnd(): number {  
  const filteredData = this.listexpiry.filter((policy: any) =>
  Object.values(policy).some((value: any) =>
    typeof value === 'string' &&
    value.toLowerCase().startsWith(this.searchInput.toLowerCase())
  )
  );
  const end = this.currentPage * this.itemsPerPage;
  return Math.min(end, filteredData.length);
  }  
  download_to_excel()
{ 
 let Excelname:any;
 this.apicall.ExportToExcel(this.listexpiry).subscribe((res)=>{
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
