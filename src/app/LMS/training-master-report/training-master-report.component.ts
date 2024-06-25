import { Component, OnInit } from '@angular/core';
import { ApiCallService } from 'src/app/api-call.service';
import { DatePipe } from '@angular/common';
import { LoginService } from 'src/app/login.service';

@Component({
  selector: 'app-training-master-report',
  templateUrl: './training-master-report.component.html',
  styleUrls: ['./training-master-report.component.scss']
})
export class TrainingMasterReportComponent implements OnInit {

  userSession:any = this.session.getUserSession();
  empcode: any=this.userSession.empcode;
  companycode:any=this.userSession.companycode; 
    
    listCompany:any;
    comtypeid=12;
    listYear:any;    
    year:any;
    reportdata: any;
    currentPage: any=1; 
    searchInput: string='';
    itemsPerPage=10;    
    desiredPage: any;
    failed: any;
    showModal: any;
    constructor(private apicall:ApiCallService,private datePipe:DatePipe,private session:LoginService) { }
    ngOnInit(): void {  
      //Current year
      this.year=this.datePipe.transform(new Date(), 'Y');       
      this.apicall.FetchCompanyList(this.empcode).subscribe((res)=>{
        this.listCompany=res;
      })  
      this.apicall.listYear().subscribe((res)=>{
      this.listYear=res;
      })     
     this.viewReport();
    }  
    viewReport()
    {     
      this.apicall.FetchTrainingMasterReportData(this.companycode,this.year).subscribe((res)=>{
        this.reportdata=res;       
        console.log(JSON.stringify(res)) 
        const maxPageFiltered = Math.ceil(this.reportdata.length / this.itemsPerPage);  

        if (this.currentPage > maxPageFiltered) {
          this.currentPage = 1;     
        }
        
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
  

