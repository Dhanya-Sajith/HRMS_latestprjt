import { Component, OnInit } from '@angular/core';
import { ApiCallService } from 'src/app/api-call.service';
import { FormGroup, FormControl, FormArray, FormBuilder, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { formatDate } from '@angular/common'; 
import { LoginService } from 'src/app/login.service';

@Component({
  selector: 'app-daily-attendance-report',
  templateUrl: './daily-attendance-report.component.html',
  styleUrls: ['./daily-attendance-report.component.scss']
})
export class DailyAttendanceReportComponent implements OnInit {

  constructor(private apicall:ApiCallService,private datePipe: DatePipe,private session:LoginService) { }

  userSession:any = this.session.getUserSession();
  empcode: any=this.userSession.empcode;
  level: any=this.userSession.level;
  authorityflg:any =this.userSession.authorityflg;

  currentDate = new Date();
  //NewcurrDate:any;
  listCompany:any;
  comtypeid=12;
  //fromdt:any;
  //todt:any;
  companynm:any;
  listdailyatt:any;
  totalreqPersonal: any; 
  totalPagesPersonal!: number[];
  
  listdates:any;
  fromdt = new FormControl();
  todt = new FormControl();

  date = new Date();
  firstDay1 = new Date(this.date.getFullYear(), this.date.getMonth(), 1);
  lastDay1 = new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0);

  firstDay=this.datePipe.transform(this.firstDay1,"yyyy-MM-dd");
  lastDay=this.datePipe.transform(this.lastDay1,"yyyy-MM-dd");
  searchInput: string = '';

  showModal = 0;
  success:any="";
  failed:any="";
  itemsPerPage=10;
  currentPage=1;
  desiredPage: any; 


  ngOnInit(): void {


    this.currentPage =1;

    const NewcurrDate=this.datePipe.transform(this.currentDate,"yyyy-MM-dd");
    const companynm= (<HTMLInputElement>document.getElementById("comcode")).value;

    // alert(companynm);

    this.apicall.FetchCompanyList(this.empcode).subscribe((res)=>{
      this.listCompany=res;
      })

    this.apicall.listdailyattendance(this.firstDay,this.lastDay,companynm,this.empcode).subscribe((res)=>{
        this.listdailyatt=res;
       
        })

        this.apicall.listFromToDates().subscribe(res=>{
          this.listdates = res;
          if(this.listdates.length > 0)
          {
            const listdatesdata = this.listdates[0];
            this.fromdt.setValue(formatDate(listdatesdata.FROM_DATE,'yyyy-MM-dd','en'));
            this.todt.setValue(formatDate(listdatesdata.TO_DATE,'yyyy-MM-dd','en'));
          };
        })
    
  }

  viewReport()
  {

    //alert("test");
    const fromdts= (<HTMLInputElement>document.getElementById("fromdt")).value;
    const todts= (<HTMLInputElement>document.getElementById("todt")).value;
    const companynm= (<HTMLInputElement>document.getElementById("comcode")).value;

    if( fromdts > todts){
      (<HTMLInputElement>document.getElementById("openModalButton")).click();
      this.showModal = 2;
      this.failed = "Please Correct the Dates";
    }else{
      this.apicall.listdailyattendance(fromdts,todts,companynm,this.empcode).subscribe((res)=>{
      this.listdailyatt=res;     
      const maxPageFiltered = Math.ceil(this.listdailyatt.length / this.itemsPerPage);  

      if (this.currentPage > maxPageFiltered) {
        this.currentPage = 1;     
      }  
      })
    }


  }



  
  download_to_excel()
  { 
   let Excelname:any;
   this.apicall.ExportToExcel(this.listdailyatt).subscribe((res)=>{
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
    const totalResults = this.listdailyatt.filter((employee: any) => {
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
    
    const filteredData = this.listdailyatt.filter((employee: any) =>
      Object.values(employee).some((value: any) =>
        typeof value === 'string' &&
        value.toLowerCase().startsWith(this.searchInput.toLowerCase())
      )
    );
  
    const start = (this.currentPage - 1) * this.itemsPerPage + 1;
    return Math.min(start, filteredData.length);
  }
  
  
  getEntriesEnd(): number {  
    const filteredData = this.listdailyatt.filter((employee: any) =>
      Object.values(employee).some((value: any) =>
        typeof value === 'string' &&
        value.toLowerCase().startsWith(this.searchInput.toLowerCase())
      )
    );
    const end = this.currentPage * this.itemsPerPage;
    return Math.min(end, filteredData.length);
  }
  
      
}
