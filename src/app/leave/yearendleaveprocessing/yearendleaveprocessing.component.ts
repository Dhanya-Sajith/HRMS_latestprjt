import { Component, OnInit } from '@angular/core';
import { ApiCallService } from 'src/app/api-call.service';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/login.service';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-yearendleaveprocessing',
  templateUrl: './yearendleaveprocessing.component.html',
  styleUrls: ['./yearendleaveprocessing.component.scss']
})
export class YearendleaveprocessingComponent implements OnInit {
  user:any;
  userSession:any = this.session.getUserSession();
  authorityflg:any =this.userSession.authorityflg;
  empcode: any=this.userSession.empcode;
  empid:any =this.userSession.id;
  level: any=this.userSession.level;
  isChecked: boolean = false;
  txtCarryReadOnly: boolean | undefined;
  txtCarryBackgroundColor: string | undefined;
  txtCarryValue: string | undefined;
  storedValue = localStorage.getItem('CompanyName');
  YearstoredValue = localStorage.getItem('EndingYear');
  CompnyidStored = localStorage.getItem('CompanyID')
  listCompany: any;
  Year:any;
  listyearendleaveProcess: any;
  currentPage=1;
  currentPagePersonal=1;
  searchInput: string='';
  itemsPerPage=10;
  saveopeningbalance: any;
  carryleave:any;
  Openingbalancevalue:any;
  openLve:any;
  isclicked: boolean=false;
  msg: any;
  newyear :any;
  desiredPage: any;
  showModal: any;
  failed: any;

  constructor(private session:LoginService,private apicall:ApiCallService,private route:Router) { 
    
  }

  ngOnInit(): void {
    this.ListCompany();
    this.FetchLeaveProcessing();

    
  }
  ListCompany()
  {
    this.apicall.FetchCompanyList(this.empcode).subscribe((res)=>{
      this.listCompany=res;
    })
  }

  FetchLeaveProcessing()
  {
    var compnyid;
    const company= (<HTMLInputElement>document.getElementById("yrendCmpny")).value;
    if(company=='-1')
    {
      compnyid = this.CompnyidStored;
    }
    else
    {
      compnyid =company;
    }
    this.apicall.YearEndLeaveProcessing(this.empcode,compnyid,this.YearstoredValue).subscribe((res)=>{
      this.listyearendleaveProcess=res;
      this.newyear=this.listyearendleaveProcess[0].YEAR+1;
      const maxPageFiltered = Math.ceil(this.listyearendleaveProcess.length / this.itemsPerPage);  

        if (this.currentPage > maxPageFiltered) {
          this.currentPage = 1;     
        }   
       
      //alert(this.newyear)
    })
  }



  

 
  CalculateOpeningBalance()
  {
    // if(this.listyearendleaveProcess.length> 0)
    // {
    //   const forward_lve = this.listyearendleaveProcess[i]['FORWARDED_LEAVES'];
    //   const ELIGIBLE_LEAVES = this.listyearendleaveProcess[i]['FORWARDED_LEAVES'];

    // }
   
    //FORWARDED_LEAVES+ADDED_CARRY_LEAVES+ELIGIBLE_LEAVES--->Opening balance
  }
  Saveopeningleave(item:any)
  {
    this.isclicked=true;
   // alert(JSON.stringify(item))
    this.Openingbalancevalue = Number(item.FORWARDED_LEAVES) + Number(item.ELIGIBLE_LEAVES);
    // item.openLve=this.Openingbalancevalue;
    item.OPENING_BALANCE=this.Openingbalancevalue;
    const data={
      company:item.COMPANY_ID,
      empcode:item.EMP_CODE,
      updatedby:this.empcode,
      carry_forwarded:item.FORWARDED_LEAVES,
      openingBalance:this.Openingbalancevalue,
      year: this.YearstoredValue
      
    }  
    this.apicall.SaveYearEndLeaveProcessing(data).subscribe((res) => {
      this.saveopeningbalance=res; 
     // alert(res.Errorid)
      if(res.Errorid = 0){
        this.msg = "Failed"
      }else{
        item.isChecked = false;
      }
      item.msg = this.msg ;
    });
   
  }



  download_to_excel()
  { 
   let Excelname:any;
   this.apicall.ExportToExcel(this.listyearendleaveProcess).subscribe((res)=>{
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


 checkCarry() {
  if (this.isChecked) {
    this.applyCheckedStyle();
  } else {
    this.applyUncheckedStyle();
  }
}
  applyCheckedStyle() {
    // Apply styles or perform actions when the checkbox is checked
    this.txtCarryBackgroundColor = 'white';
    this.txtCarryReadOnly = false;
    this.txtCarryValue = '';
    let carryNo = document.getElementById("txtCarry");
  }

  applyUncheckedStyle() {
    // Apply styles or perform actions when the checkbox is unchecked
    this.txtCarryBackgroundColor = '#f5e5cb';
    this.txtCarryReadOnly = true;
    this.txtCarryValue = '';
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
  const totalResults = this.listyearendleaveProcess.filter((employee: any) => {
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
  
  const filteredData = this.listyearendleaveProcess.filter((employee: any) =>
    Object.values(employee).some((value: any) =>
      typeof value === 'string' &&
      value.toLowerCase().startsWith(this.searchInput.toLowerCase())
    )
  );

  const start = (this.currentPage - 1) * this.itemsPerPage + 1;
  return Math.min(start, filteredData.length);
}


getEntriesEnd(): number {  
  const filteredData = this.listyearendleaveProcess.filter((employee: any) =>
    Object.values(employee).some((value: any) =>
      typeof value === 'string' &&
      value.toLowerCase().startsWith(this.searchInput.toLowerCase())
    )
  );
  const end = this.currentPage * this.itemsPerPage;
  return Math.min(end, filteredData.length);
}

 }
