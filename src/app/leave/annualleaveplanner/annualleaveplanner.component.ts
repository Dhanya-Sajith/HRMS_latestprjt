import { Component, OnInit } from '@angular/core';
import { ApiCallService } from 'src/app/api-call.service';
import { LoginService } from 'src/app/login.service';
import { DatePipe } from '@angular/common';
import { FormGroup , FormBuilder , FormControl , Validators } from '@angular/forms';
import { Router } from '@angular/router';
@Component({
  selector: 'app-annualleaveplanner',
  templateUrl: './annualleaveplanner.component.html',
  styleUrls: ['./annualleaveplanner.component.scss']
})
export class AnnualleaveplannerComponent implements OnInit {

  userSession:any = this.session.getUserSession();
  empcode: any=this.userSession.empcode;
  empId: any=this.userSession.id;
  level:any =this.userSession.level;
  companycode:any =this.userSession.companycode;
  listleaves: any;
  planid: any;
  showModal: any;
  success: any;
  failed: any;
  todt: any;
  fromdt: any;
  reason: any;
  currentPage=1;
  currentPagePersonal=1;
  searchInput: string='';
  itemsPerPage=10;
  year = (new Date()).getFullYear();
  finaldate: any;
  restricteddt: any;
  myDate:Date = new Date();
  datevalue: any;
  restrictedvalue: any;  
  desiredPage: any; 

  constructor(private apicall:ApiCallService, private datePipe: DatePipe,private fb:FormBuilder,private session:LoginService,) {}

  ngOnInit(): void {
    this.currentPage = 1; 
    this.currentPagePersonal =1;
    this.annualleaveplanner();

    this.apicall.LeaveApplyFinalDate(this.companycode,6).subscribe((res)=>{
      this.restricteddt=res[0].DATA_VALUE;
      this.finaldate=res[1].DATA_VALUE;
      this.datevalue = this.datePipe.transform(this.myDate,"yyyy-MM-dd")
      if((this.datevalue <= this.finaldate && this.datevalue >= this.restricteddt)) {
        this.restrictedvalue = 1;
      } 
    })
  }

  //Fetch Annual leaves
  annualleaveplanner(){
    this.apicall.FetchAnnualLeavePLanner(this.empcode).subscribe((res)=>{
      this.listleaves=res;
    })
  }

 

  leaveplanId(planId:any){
    this.planid = planId;
  }

  // Cancel Annual Leave Planner
  CancelannualLeave(planId:any){
    
    this.apicall.CancelAnnualLeavePLanner(this.empcode,this.planid).subscribe(res=>{
      if(res.Errorid=='1')
      {
        this.showModal = 1;
        this.success = "Cancel the leave Request";
      }
      else
      {
        this.showModal = 2;
        this.failed = "Failed to cancel request";
      }
      this.annualleaveplanner();
    })
  }

  //Save New Leave
  addLeave(){

    const fromdate= (<HTMLInputElement>document.getElementById("fromdt")).value;
    const todate= (<HTMLInputElement>document.getElementById("todt")).value;
    const leavereason= (<HTMLInputElement>document.getElementById("reason")).value;
    //Check Validation
    if(fromdate == '' || todate == '') 
    {    
      this.showModal = 2;
      this.failed = "Please Fill the Fields";
    }
    else if( fromdate > todate){
      this.showModal = 2;
      this.failed = "Please Correct the Dates";
    }else
    {
      const leavedata = {
        emp_code:this.empcode,
        from_date:fromdate,
        to_date:todate,
        reason:leavereason,
      };
      this.apicall.SaveAnnualLeave(leavedata).subscribe(res=>{
        if(res.Errorid=='1')
        {
          this.showModal = 1; 
          this.success = "Leave Saved Successfully"
          this.annualleaveplanner();
          this.clear();
        }
        else
        {
          this.showModal = 2;
          this.failed = "Failed";
          this.clear();
        }      
      }) 
    }
  }

  //Clear the fields
  clear() {

    (<HTMLInputElement>document.getElementById("fromdt")).value = "this.year-01-01";
    (<HTMLInputElement>document.getElementById("todt")).value = "this.year-01-01";
    (<HTMLInputElement>document.getElementById("reason")).value = "";
    
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
  const totalResults = this.listleaves.filter((employee: any) => {
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
  
  const filteredData = this.listleaves.filter((employee: any) =>
    Object.values(employee).some((value: any) =>
      typeof value === 'string' &&
      value.toLowerCase().startsWith(this.searchInput.toLowerCase())
    )
  );

  const start = (this.currentPage - 1) * this.itemsPerPage + 1;
  return Math.min(start, filteredData.length);
}


getEntriesEnd(): number {  
  const filteredData = this.listleaves.filter((employee: any) =>
    Object.values(employee).some((value: any) =>
      typeof value === 'string' &&
      value.toLowerCase().startsWith(this.searchInput.toLowerCase())
    )
  );
  const end = this.currentPage * this.itemsPerPage;
  return Math.min(end, filteredData.length);
}
}
