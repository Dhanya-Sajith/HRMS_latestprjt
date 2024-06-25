import { Component, OnInit } from '@angular/core';
import { ApiCallService } from 'src/app/api-call.service';
import { DatePipe } from '@angular/common';
import { FormGroup, FormControl, FormArray, FormBuilder, Validators } from '@angular/forms';
import { formatDate } from '@angular/common'; 
import { LoginService } from 'src/app/login.service';

@Component({
  selector: 'app-manhours-report',
  templateUrl: './manhours-report.component.html',
  styleUrls: ['./manhours-report.component.scss']
})
export class ManhoursReportComponent implements OnInit {
  showModal!: number;
  failed!: string;

  constructor(private apicall:ApiCallService,private datePipe: DatePipe,private session:LoginService) { }

  currentDate = new Date();
  NewloginDate=this.datePipe.transform(this.currentDate,"yyyy-MM-dd");

  userSession:any = this.session.getUserSession();
  empcode: any=this.userSession.empcode;
  level: any=this.userSession.level;
  authorityflg:any =this.userSession.authorityflg;

  listYear:any;
  listMonth:any;
 // year:any;
  listmanhours:any;
  empexistance:any;
  searchInput: string = ''; 
 
  itemsPerPage=10;
  currentPage=1;
  desiredPage: any; 

  cmonth = new Date().getMonth();
  cyear = new Date().getFullYear().toString(); 
 //curr_month = this.NewloginDate.getMonth();
 //curr_year = this.NewloginDate.getFullYear();
  monthnm = new Date().toLocaleString('default', { month: 'long' });


 //year= new FormControl();
 //month= new FormControl();

  ngOnInit(): void {


    //alert(this.monthnm);
    //alert(this.cyear);
    
    this.currentPage =1;
    this.apicall.listYear().subscribe((res)=>{
        this.listYear=res;
        })
     

    // this.year.setValue(this.cyear);
    // this.month.setValue(this.monthnm);
    

    this.apicall.listmanhour(this.cyear,this.cmonth+1,this.empcode).subscribe((res)=>{
    this.listmanhours=res;
    })


  }

  listmonth()
  {
    const year= (<HTMLInputElement>document.getElementById("year")).value;
    //alert(year);
    this.apicall.listMonth(year).subscribe((res)=>{
    this.listMonth=res;
    })

  }

  
  viewReport()
  {

    const year= (<HTMLInputElement>document.getElementById("year")).value;
    const month= (<HTMLInputElement>document.getElementById("month")).value;

    if(year=="-1" && month=="-1")
    {
      this.empexistance="Please Select Fields";
    }
    else{
  
        this.empexistance="" ;
    
        this.apicall.listmanhour(year,month,this.empcode).subscribe((res)=>{
        this.listmanhours=res;

        const maxPageFiltered = Math.ceil(this.listmanhours.length / this.itemsPerPage);  

        if (this.currentPage > maxPageFiltered) {
          this.currentPage = 1;     
        }  

        })

       
    }


  }
  download_to_excel()
  { 
   let Excelname:any;
   this.apicall.ExportToExcel(this.listmanhours).subscribe((res)=>{
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
  const totalResults = this.listmanhours.filter((employee: any) => {
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
  
  const filteredData = this.listmanhours.filter((employee: any) =>
    Object.values(employee).some((value: any) =>
      typeof value === 'string' &&
      value.toLowerCase().startsWith(this.searchInput.toLowerCase())
    )
  );

  const start = (this.currentPage - 1) * this.itemsPerPage + 1;
  return Math.min(start, filteredData.length);
}


getEntriesEnd(): number {  
  const filteredData = this.listmanhours.filter((employee: any) =>
    Object.values(employee).some((value: any) =>
      typeof value === 'string' &&
      value.toLowerCase().startsWith(this.searchInput.toLowerCase())
    )
  );
  const end = this.currentPage * this.itemsPerPage;
  return Math.min(end, filteredData.length);
}

}
