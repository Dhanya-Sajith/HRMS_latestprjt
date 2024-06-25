import { Component, AfterViewInit, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ApiCallService } from 'src/app/api-call.service';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/login.service';
@Component({
  selector: 'app-request-management',
  templateUrl: './requestmanagement.component.html',
  styleUrls: ['./requestmanagement.component.scss']
})
export class RequestManagementComponent implements AfterViewInit, OnInit {
  userSession:any = this.session.getUserSession();
  empcode: any=this.userSession.empcode;
  empid: any=this.userSession.id;

remarks: any;
  item: any;
  intime: any;
  time: any;

  Menu: string = 'attendance';
  subMenu: string = 'compensation';
  Date = new Date();
  firstDay1 = new Date(this.Date.getFullYear(), this.Date.getMonth(), 1);
  lastDay1 = new Date(this.Date.getFullYear(), this.Date.getMonth() + 1, 0);
  fromdate=this.datepipe.transform(this.firstDay1,"yyyy-MM-dd");
  todate=this.datepipe.transform(this.lastDay1,"yyyy-MM-dd");
  companydata: any;
  deptdata: any;
  empdata: any;
  selectedDept: any=-1;
  selectedCompanyid: any=-1;
  selectedEmp: any=-1;
  selectedStatus: any=0;
  statusdata: any;
  compensationdata: any[] = [];

  searchInput: string='';
  itemsPerPage=10;
  currentPage=1;
  Activetype: any;
  showModal: any;
  failed: any;
  success: any;
  reqID: any;
  approvelist: any;
  items: any;
  emp_code: any;
  compoffid: any;
  inDate: any;
  compensation: any;
  regularization: any;
  overtime: any;
  desiredPage: any;

  constructor(private apicall:ApiCallService,private datepipe:DatePipe,private router: Router,private session:LoginService) { }
  ngAfterViewInit(): void {
    //Button selection
    var buttons = document.querySelectorAll('.toggle-button');        
        buttons.forEach(function(button) {
            button.addEventListener('click', function() {                
                buttons.forEach(function(btn) {
                    btn.classList.remove('selected');
                });                
                button.classList.add('selected');
            });
        });
  }

  ngOnInit(): void {   
    //company combo box
    this.apicall.FetchCompanyList(this.empcode).subscribe((res) => {
      this.companydata=res;
      
    });
    //Department combo box
    this.apicall.FetchDepartmentList(-1,this.empcode).subscribe((res) => {
      this.deptdata=res;  
      
    }); 
    //Employee combo box
    this.apicall.FetchEmployeeList(-1,-1,this.empcode).subscribe((res) => {
      this.empdata=res; 
     
    }); 
    //Status combo box
    this.apicall.listStatus(26).subscribe((res) => {
      this.statusdata=res;     
    });       
    const data={
      company:this.selectedCompanyid,
      department:this.selectedDept,
      emp_code:this.selectedEmp,
      fromdate:-1,
      todate:-1,
      status: this.selectedStatus,
      user:this.empcode
      
    }  
    //alert(JSON.stringify(data))
     this.apicall.FetchCompReq_Filter_HR(data).subscribe((res) => {        
      console.log(JSON.stringify(this.compensationdata)) 
      this.compensationdata = res;
     
     }); 
     this.FetchPendingCount();   
  }
 
  selectmenu(value: string) {
   this.Menu=value;
  //  alert(this.menu)
  }
  selectsubmenu(value: string) {
    this.subMenu=value;
    //alert(this.subMenu)
    }
    navigateToRegularizationHR() {
      // this.router.navigate(['/regularizationHR']);
      this.subMenu='regularization';         
    }
    navigateToCompensation(){
      // this.router.navigate(['/reqMgmt']);
      this.subMenu='compensation';        
    }
    navigateToOvertime(){
       //this.router.navigate(['/overtimeHR']);
      this.subMenu='overtime';
    }
    
    onCompanySelected(selectedCompanyid: any) { 
      this.selectedCompanyid=selectedCompanyid;     
      this.apicall.FetchDepartmentList(selectedCompanyid,this.empcode).subscribe((res) => {
        this.deptdata=res; 
        //alert(JSON.stringify(this.deptdata))   
      }); 
      this.filter();     
      this.apicall.FetchEmployeeList(this.selectedDept,this.selectedCompanyid,this.empcode).subscribe((res) => {
        this.empdata=res;    
      });
      
     }
     onDeptSelected(selectedDept:any){ 
      this.selectedDept = selectedDept; 
      this.apicall.FetchEmployeeList(selectedDept,this.selectedCompanyid,this.empcode).subscribe((res) => {
        this.empdata=res;    
        });
        this.filter();
        //this.filterStatuscount();
          
     }
     onEmpSelected(selectedEmp:any){
      this.selectedEmp = selectedEmp;  
      this.filter(); 
      //this.filterStatuscount(); 
      
     }
     onStatSelected(value:any){
      this.selectedStatus=value;  
      this.filter();   
     }
     FetchPendingCount(){
     //Fetch count of pending requests
     this.apicall.FetchPendingCount_HR(1,this.empcode).subscribe((res) => {        
      this.compensation=res[0].COMPENSATION;
      this.regularization=res[0].REGULARIZATION;
      this.overtime=res[0].OVERTIME;
      //  alert(JSON.stringify(this.compensation))   
    }); 
  }
     filter(){
     
      if( this.fromdate && this.todate && this.fromdate > this.todate){
        (<HTMLInputElement>document.getElementById("openModalButton")).click();
        this.showModal = 2;
        this.failed = "Please Correct the Dates";
        // alert("Please Correct the Dates");
      }else{
       
        const data={
          company:this.selectedCompanyid,
          department:this.selectedDept,
          emp_code:this.selectedEmp,
          fromdate:this.fromdate,
          todate:this.todate,
          status: this.selectedStatus,
          user:this.empcode
          
        }  
        //alert(JSON.stringify(data))
         this.apicall.FetchCompReq_Filter_HR(data).subscribe((res) => {        
          console.log(JSON.stringify(this.compensationdata)) 
          this.compensationdata = res;
          const maxPageFiltered = Math.ceil(this.compensationdata.length / this.itemsPerPage);  

          if (this.currentPage > maxPageFiltered) {
            this.currentPage = 1;     
          }  
          // alert(JSON.stringify(this.compensationdata))
         });
      }
       }
       isButtonDisabled(item: any): boolean { 
        
        if (item.AVAILED_DATE) {    
          return true;
        } else {   
         return false;
        }   
        } 

  // Status Approve List
  Approvelist(requestID: any){
    this.reqID = requestID
    this.apicall.StatusApproveList(2,this.reqID,'C').subscribe(res=>{
      this.approvelist = res;
    })
  }
  approve(item: any) {
   this.item=item;
   this.time=item.WORK_TIME.split("-", 2);    
   const data={
    empcode:item.EMP_CODE,
    reqId:item.COMP_OFF_ID,
    inDate:item.COMP_WORK_DATE,
    inTime:this.time[0],
    outTime:this.time[1],
    conv_Amount: null,
    reject_reason: null,
    updated_by:this.empcode,
    mflag:1,
    Sflag:2,    
  } 
  console.log(JSON.stringify(data)) 
  this.apicall.ApproveRejectRequest_HR(data).subscribe(res=>{
    // alert(JSON.stringify(res));
    if(res.Errorid==1){
      (<HTMLInputElement>document.getElementById("openModalButton")).click();
      this.showModal = 1;
      this.success = "Request approved!";
     }
     else{
      (<HTMLInputElement>document.getElementById("openModalButton")).click();
      this.showModal = 2;
      this.failed = "Failed!";
     }
     this.FetchPendingCount(); 
     this.filter();  
  })
  }
  setSelectedRequestID(item: any) {
    this.items=item;
    this.emp_code=item.EMP_CODE;
    this.compoffid=item.COMP_OFF_ID;
    this.inDate=item.COMP_WORK_DATE;
    this.time=item.WORK_TIME.split("-", 2); 
    }
    onReject() {
       
      const data={
       empcode:this.emp_code,
       reqId:this.compoffid,
       inDate:this.inDate,
       inTime:this.time[0],
       outTime:this.time[1],
       conv_Amount: null,
       reject_reason: this.remarks,
       updated_by:this.empcode,
       mflag:2,
       Sflag:2,    
     } 
     console.log(JSON.stringify(data)) 
     this.apicall.ApproveRejectRequest_HR(data).subscribe(res=>{
       //alert(JSON.stringify(res));
       if(res.Errorid==1){
        (<HTMLInputElement>document.getElementById("openModalButton")).click();
        this.showModal = 1;
        this.success = "Request rejected!";
       }
       else{
        (<HTMLInputElement>document.getElementById("openModalButton")).click();
        this.showModal = 2;
        this.failed = "Failed!";
       }
      this.remarks='';
      this.FetchPendingCount(); 
      this.filter();  
     })
      }
      cancel(){
        const Data = {
          empcode:this.emp_code,
          reqid:this.compoffid,        
          updated_by:this.empcode,
          Sflag:2,
        };  
        this.apicall.CancelRequest_HR(Data).subscribe((res)=>{
          if(res.Errorid==1){
            (<HTMLInputElement>document.getElementById("openModalButton")).click();
            this.showModal = 1;
            this.success = "Request Cancelled!";
           }
           else{
            (<HTMLInputElement>document.getElementById("openModalButton")).click();
            this.showModal = 2;
            this.failed = "Failed!";
           }          
          this.FetchPendingCount(); 
          this.filter();  
         })  
  
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
const totalResults = this.compensationdata.filter((employee: any) => {
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

const filteredData = this.compensationdata.filter((employee: any) =>
  Object.values(employee).some((value: any) =>
    typeof value === 'string' &&
    value.toLowerCase().startsWith(this.searchInput.toLowerCase())
  )
);

const start = (this.currentPage - 1) * this.itemsPerPage + 1;
return Math.min(start, filteredData.length);
}


getEntriesEnd(): number {  
const filteredData = this.compensationdata.filter((employee: any) =>
  Object.values(employee).some((value: any) =>
    typeof value === 'string' &&
    value.toLowerCase().startsWith(this.searchInput.toLowerCase())
  )
);
const end = this.currentPage * this.itemsPerPage;
return Math.min(end, filteredData.length);
}

  
}
