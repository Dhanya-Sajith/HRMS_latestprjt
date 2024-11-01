import { Component, OnInit } from '@angular/core';
import { ApiCallService } from 'src/app/api-call.service';
import { FormGroup, FormControl, FormArray, FormBuilder, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { LoginService } from 'src/app/login.service';

@Component({
  selector: 'app-turnover-report',
  templateUrl: './turnover-report.component.html',
  styleUrls: ['./turnover-report.component.scss']
})
export class TurnoverReportComponent implements OnInit {
  listCompany: any;
  listMonth: any;
  listYear:any;
  endyear:any;
  startyr:any;
  turnoverlist: any;


  showModal = 0;
  success:any="";
  failed:any="";
  itemsPerPage=10;
  currentPage=1;
  desiredPage: any; 
  searchInput: string = '';

  constructor(private apicall:ApiCallService,private datePipe: DatePipe,private session:LoginService) { }
  userSession:any = this.session.getUserSession();
  empcode: any=this.userSession.empcode;
  level: any=this.userSession.level;
  authorityflg:any =this.userSession.authorityflg;



  ngOnInit(): void {

    this.currentPage =1;
    this.apicall.FetchCompanyList(this.empcode).subscribe((res)=>{
      this.listCompany=res;
      })

      this.apicall.DisplayAllMonths().subscribe((res)=>{
        this.listMonth=res;
        })

        this.apicall.listYear().subscribe((res)=>{
          this.listYear=res;
          this.startyr = this.listYear[0]?.DISPLAY_FIELD;
          this.endyear = this.listYear[0]?.DISPLAY_FIELD;
      })
    }
    GenerateReport()
    {
    const cmpny= (<HTMLInputElement>document.getElementById("comcode")).value;
    const startmnth= (<HTMLInputElement>document.getElementById("startmnth")).value;
    const endmnth= (<HTMLInputElement>document.getElementById("endmnth")).value;
    if(this.startyr>this.endyear)
      {
        (<HTMLInputElement>document.getElementById("openModalButton")).click();
          this.showModal = 2;
          this.failed = "Please Correct the Years";
      }
      else
      {

        this.apicall.viewTurnoverReport(cmpny,startmnth,endmnth,this.startyr,this.endyear).subscribe((res)=>{
        this.turnoverlist=res; 
        const maxPageFiltered = Math.ceil(this.turnoverlist.length / this.itemsPerPage);  
          if (this.currentPage > maxPageFiltered) {
            this.currentPage = 1; 
          }

        })
    }
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
        const totalResults = this.turnoverlist.filter((employee: any) => {
      return Object.values(employee).some((value: any) =>
        typeof value === 'string' && value.toLowerCase().startsWith(this.searchInput.toLowerCase())
      );
    }).length;
  
    const maxPageFiltered = Math.ceil(totalResults / this.itemsPerPage);  
  
    if (this.currentPage > maxPageFiltered) {
      this.currentPage = 1; 
    }
   //alert(totalResults)
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
    
    const filteredData = this.turnoverlist.filter((employee: any) =>
      Object.values(employee).some((value: any) =>
        typeof value === 'string' &&
        value.toLowerCase().startsWith(this.searchInput.toLowerCase())
      )
    );
  
    const start = (this.currentPage - 1) * this.itemsPerPage + 1;
    return Math.min(start, filteredData.length);
  }
  
  
  getEntriesEnd(): number {  
    const filteredData = this.turnoverlist.filter((employee: any) =>
      Object.values(employee).some((value: any) =>
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
   this.apicall.ExportToExcel(this.turnoverlist).subscribe((res)=>{
    Excelname=res.Errormsg;
    let fileurl=this.apicall.GetExcelFile(Excelname);
    //alert(fileurl);
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
