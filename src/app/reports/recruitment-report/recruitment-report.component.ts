import { Component, OnInit } from '@angular/core';
import { ApiCallService } from 'src/app/api-call.service';
import { LoginService } from 'src/app/login.service';
import { FormGroup, FormControl, FormArray, FormBuilder, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-recruitment-report',
  templateUrl: './recruitment-report.component.html',
  styleUrls: ['./recruitment-report.component.scss']
})
export class RecruitmentReportComponent implements OnInit {
  userSession:any = this.session.getUserSession();
  empcode: any=this.userSession.empcode;
  level: any=this.userSession.level;
  authorityflg:any =this.userSession.authorityflg;

  listCompany:any;
  comtypeid=12;
  failed: any;
  showModal: any;
  searchInput: string='';
  statustypeid = 78;
  liststatus: any;
  itemsPerPage=10;
  currentPage=1;
  desiredPage: any;
  listrecruitment:any;
  fromdt = new FormControl();
  todt = new FormControl();
  listdates: any;
  frmdt: any;
  tdt: any;

  constructor(private apicall:ApiCallService,private datePipe:DatePipe,private session:LoginService) { }

  ngOnInit(): void {
    

    this.apicall.FetchCompanyList(this.empcode).subscribe((res)=>{
      this.listCompany=res;
    })
    this.apicall.listStatus(this.statustypeid).subscribe((res)=>{
      this.liststatus=res;
      })
      this.apicall.listFromToDates().subscribe(res=>{
        this.listdates = res;
        if(this.listdates.length > 0)
        {
          const listdatesdata = this.listdates[0];
          this.fromdt.setValue(formatDate(listdatesdata.FROM_DATE,'yyyy-MM-dd','en'));
          this.todt.setValue(formatDate(listdatesdata.TO_DATE,'yyyy-MM-dd','en'));
          this.FetchRecruitmentData();
        };
        })
        
  }
FetchRecruitmentData()
{
  const compny= (<HTMLInputElement>document.getElementById("comcode")).value;
  const status= (<HTMLInputElement>document.getElementById("reqstatus")).value;
  const fromDate = this.fromdt.value;
  const toDate = this.todt.value;
  this.apicall.FetchRecruitmentData(this.empcode,compny,fromDate,toDate,status).subscribe((res)=>{
    this.listrecruitment=res;

    const maxPageFiltered = Math.ceil(this.listrecruitment.length / this.itemsPerPage);  
  
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
  const totalResults = this.listrecruitment.filter((policy: any) => {
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
  
  const filteredData = this.listrecruitment.filter((policy: any) =>
  Object.values(policy).some((value: any) =>
    typeof value === 'string' &&
    value.toLowerCase().startsWith(this.searchInput.toLowerCase())
  )
  );
  
  const start = (this.currentPage - 1) * this.itemsPerPage + 1;
  return Math.min(start, filteredData.length);
  }
  
  
  getEntriesEnd(): number {  
  const filteredData = this.listrecruitment.filter((policy: any) =>
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
 this.apicall.ExportToExcel(this.listrecruitment).subscribe((res)=>{
  Excelname=res.Errormsg;
  let fileurl=this.apicall.GetExcelFile(Excelname);
  let link = document.createElement("a");
    
      if (link.download !== undefined) {
     //   let url = URL.createObjectURL(blob);
        link.setAttribute("href", fileurl);
        link.setAttribute("download", "RecruitmentReportFile.xlsx");
        document.body.appendChild(link)
;
        link.click();
        document.body.removeChild(link)
;
 }
});
  }
}
