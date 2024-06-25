import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ApiCallService } from 'src/app/api-call.service';
import { LoginService } from 'src/app/login.service';

@Component({
  selector: 'app-overtime-hr',
  templateUrl: './overtime-hr.component.html',
  styleUrls: ['./overtime-hr.component.scss']
})
export class Overtime_HRComponent implements OnInit {
  
  userSession:any = this.session.getUserSession();
  empcode: any=this.userSession.empcode;
  empid: any=this.userSession.id;

  Menu: string = 'attendance';
  subMenu: string = 'overtime';

  remarks: any;
  otdetaillist: any;
  noData: any;
  emp_code: any;
  req_id: any;
  inDate: any;
  time: any;
  item: any;  
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
  OTdata: any;
  searchInput: string='';
  itemsPerPage=10;
  currentPage=1;
  Activetype: any;
  showModal: any;
  failed: any;
  success: any;
  reqID: any;
  approvelist: any;
  compensation: any;
  regularization: any;
  overtime: any;
  desiredPage: any;
  formattedlastPayrollDay: any;
  startdate: any;

  constructor(private apicall:ApiCallService,private datepipe:DatePipe,private session:LoginService) { }

  ngOnInit(): void {
    
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
    this.apicall.Filter_FetchOTHistory_HR(data).subscribe((res) => {
      this.OTdata = Object.values(res);     
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
      //this.router.navigate(['/regularizationHR']);
      this.subMenu='regularization';         
    }
    navigateToCompensation(){
      //this.router.navigate(['/reqMgmt']);
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
     }
     onEmpSelected(selectedEmp:any){
      this.selectedEmp = selectedEmp;  
      this.filter();      
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
        this.apicall.Filter_FetchOTHistory_HR(data).subscribe((res) => {
          this.OTdata = Object.values(res);
          const maxPageFiltered = Math.ceil(this.OTdata.length / this.itemsPerPage);  

          if (this.currentPage > maxPageFiltered) {
            this.currentPage = 1;     
          }  
          console.log(JSON.stringify(this.OTdata));
      });
      }
       }
       isButtonDisabled(item: any): boolean {      
        const formattedLastPayrollDay = new Date(item.LAST_PAYROLL_DATE); 
        const lastDayOfPreviousMonth = new Date(formattedLastPayrollDay);        
        // Setting the date to 1st of the current month
        lastDayOfPreviousMonth.setDate(1);        
        lastDayOfPreviousMonth.setDate(lastDayOfPreviousMonth.getDate() - 1);      
    
        if (item.OT_FROMDATE) {  
            const otFromDate = new Date(item.OT_FROMDATE);            
            
            if (otFromDate < lastDayOfPreviousMonth) {    
                return true; 
            } else {   
                return false; 
            }
        }
        
        return false;
    }
    
    
  // Status Approve List
  Approvelist(requestID: any){
    this.reqID = requestID;
    this.apicall.StatusApproveList(2,this.reqID,'O').subscribe(res=>{
      this.approvelist = res;
      //alert(JSON.stringify(this.approvelist))
    })
  }
  
  approve(item: any) {
    this.item=item;    
    const data={
     empcode:item.EMP_CODE,
     reqId:item.REQUEST_ID,
     inDate:null,
     inTime:null,
     outTime:null,
     conv_Amount: null,
     reject_reason: null,
     updated_by:this.empcode,
     mflag:1,
     Sflag:3,    
   } 
   console.log(JSON.stringify(data)) 
   this.apicall.ApproveRejectRequest_HR(data).subscribe(res=>{
    //  alert(JSON.stringify(res));
     if(res.Errorid==1){
        (<HTMLInputElement>document.getElementById("openModalButton")).click();
       this.showModal = 1;
       this.success = "Request approved!";
      //  alert(this.success);
      }
      else{
        (<HTMLInputElement>document.getElementById("openModalButton")).click();
       this.showModal = 2;
       this.failed = "Failed!";
      //  alert(this.failed);
      }
      this.FetchPendingCount();
      this.filter();
   })
   }
   setSelectedRequestID(item: any) {        
     this.emp_code=item.EMP_CODE;
     this.req_id=item.REQUEST_ID;  
    
    }
     onReject() {
        
       const data={
        empcode:this.emp_code,
        reqId:this.req_id,
        inDate:null,
        inTime:null,
        outTime:null,
        conv_Amount: null,
        reject_reason: this.remarks,
        updated_by:this.empcode,
        mflag:2,
        Sflag:3,    
      } 
      console.log(JSON.stringify(data)) 
      this.apicall.ApproveRejectRequest_HR(data).subscribe(res=>{
        // alert(JSON.stringify(res));
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
          reqid:this.req_id,        
          updated_by:this.empcode,
          Sflag:3,
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
  
  fillrequestdtl(reqid:any,fdate:any,tdate:any){
    const frdate =this.datepipe.transform(fdate, 'yyyy-MM-dd');
    const trdate=this.datepipe.transform(tdate, 'yyyy-MM-dd');
    this.apicall.EmpReq_OTDetails(reqid,frdate,trdate).subscribe(res=>{
      this.otdetaillist = res;
      //alert((JSON.stringify(this.otdetaillist)))
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
const totalResults = this.OTdata.filter((employee: any) => {
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

const filteredData = this.OTdata.filter((employee: any) =>
  Object.values(employee).some((value: any) =>
    typeof value === 'string' &&
    value.toLowerCase().startsWith(this.searchInput.toLowerCase())
  )
);

const start = (this.currentPage - 1) * this.itemsPerPage + 1;
return Math.min(start, filteredData.length);
}


getEntriesEnd(): number {  
const filteredData = this.OTdata.filter((employee: any) =>
  Object.values(employee).some((value: any) =>
    typeof value === 'string' &&
    value.toLowerCase().startsWith(this.searchInput.toLowerCase())
  )
);
const end = this.currentPage * this.itemsPerPage;
return Math.min(end, filteredData.length);
}

}
