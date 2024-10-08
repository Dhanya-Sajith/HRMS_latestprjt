import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ApiCallService } from 'src/app/api-call.service';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { LoginService } from 'src/app/login.service';

@Component({
  selector: 'app-leave-hr',
  templateUrl: './leave-hr.component.html',
  styleUrls: ['./leave-hr.component.scss']
})
export class LeaveHRComponent implements OnInit {
  userSession:any = this.session.getUserSession();
  empcode: any=this.userSession.empcode;
  empid: any=this.userSession.id;

  Menu: string = 'leave';
  subMenu: string = 'leave';

  remarks: any;
  NewInTime: any;
  NewOuTTime: any;
  selectedRequestID: any;
  selectedEmpCode: any; 
  activereqid: any;   
    
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
    leavedata: any;
    searchInput: string='';
    itemsPerPage=10;
    currentPage=1;
    Activetype: any;
    showModal: any;
    failed: any;
    success: any;
    reqID: any;
    approvelist: any;
    reasondisp=new FormControl();
    LogdispInDate= new FormControl();
    reqid:any;
    inDate = new FormControl();
    updated_by:any;
    inTime = new FormControl();
    outTime = new FormControl();
    request_status:any;
  item: any;
  time: any;
  items: any;
  emp_code: any;
  req_Id: any;
  leave: any;
  compoff: any;
  business: any;
  permissions: any;
  desiredPage: any;
  formattedlastPayrollDay: any;
  startdate: any;
  showmessage: string='';
  
    constructor(private apicall:ApiCallService,private datepipe:DatePipe,private router: Router,private session:LoginService) { }
  
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
       this.apicall.Filter_FetchLeaveRequests_HR(data).subscribe((res) => {
        this.leavedata=res;
        
       });
    //Fetch count of pending requests
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
   
    ActivereqID(reqid:any){
      this.activereqid = reqid;
    }
      navigateToLeave() {
        //this.router.navigate(['/leaveHR']);
        this.subMenu='leave';
       
      }
      navigateToCompoffHR(){
        //this.router.navigate(['/compoffHR']);
        this.subMenu='compoff';
      }
      navigateToBusTrip(){
        //this.router.navigate(['/bustripHR']);
        this.subMenu='bustrip';
      }
      navigateToPermissions(){
        //this.router.navigate(['/permissionsHR']);
        this.subMenu='permissions';
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
      //Fetch count of pending requests
       FetchPendingCount(){      
        this.apicall.FetchPendingCount_HR(2,this.empcode).subscribe((res) => {        
          this.leave=res[0].LEAVE;
          this.compoff=res[0].COMPOFF;
          this.business=res[0].BUSINESS;
          this.permissions=res[0].PERMISSION;
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
           this.apicall.Filter_FetchLeaveRequests_HR(data).subscribe((res) => {
            this.leavedata=res;
            const maxPageFiltered = Math.ceil(this.leavedata.length / this.itemsPerPage);  

          if (this.currentPage > maxPageFiltered) {
            this.currentPage = 1;     
          } 
            //alert(JSON.stringify(this.leavedata.length)) 
            
            
           });
        }
         }
         // Status Approve List
         Approvelist(requestID: any){
  
          this.reqID = requestID
          this.apicall.StatusApproveList(1,this.reqID,'L').subscribe(res=>{
            this.approvelist = res;
          })
        }
        
        approve(item: any) {
          this.item=item;           
          const data={
           empcode:item.EMP_CODE,
           reqId:item.REQ_ID,
           inDate:null,
           inTime:null,
           outTime:null,
           conv_Amount: null,
           reject_reason: null,
           updated_by:this.empcode,
           mflag:1,
           Sflag:4,    
         } 
         //alert(JSON.stringify(data)) 
         this.apicall.ApproveRejectRequest_HR(data).subscribe(res=>{
           //alert(JSON.stringify(res));
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
           this.req_Id=item.REQ_ID;          
           }

           onReject() {              
             const data={
              empcode:this.emp_code,
              reqId:this.req_Id,
              inDate:null,
              inTime:null,
              outTime:null,
              conv_Amount: null,
              reject_reason: this.remarks,
              updated_by:this.empcode,
              mflag:2,
              Sflag:4,    
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
             cancelModal(item: any){
              this.items=item;
              this.emp_code=item.EMP_CODE;
              this.req_Id=item.REQ_ID;   
             if(this.isButtonDisabled(item)){
              (<HTMLInputElement>document.getElementById("CancelModalButton")).click();
              this.showmessage="Payroll is processed for these dates. Please check the employee's attendance before proceeding.";
             } else if(item.AIRTICKET_STATUS==1){
              (<HTMLInputElement>document.getElementById("CancelModalButton")).click();
              this.showmessage="An air ticket is associated with this leave request.Confirm 'Yes' to mark both the Air ticket and Leave request as Cancelled.";
             }else{
              (<HTMLInputElement>document.getElementById("CancelModalButton")).click();
              this.showmessage="You are about to cancel your request.";
              }
             }
             cancel(){
              const Data = {
                empcode:this.emp_code,
                reqid:this.req_Id,        
                updated_by:this.empcode,
                Sflag:4,
              };    
              this.apicall.CancelRequest_HR(Data).subscribe((res)=>{
                if(res.Errorid==1){
                  (<HTMLInputElement>document.getElementById("openModalButton")).click();
                  this.showModal = 1;
                  this.success = "Request Cancelled!";
                }
                else if (res.Errorid==-2){
                  (<HTMLInputElement>document.getElementById("openModalButton")).click();
                  this.showModal = 2;
                  this.failed = "Leave cancellation not possible; ticket's booked. Contact HR for assistance.";
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
            
            isButtonDisabled(item: any): boolean {      
              this.formattedlastPayrollDay = new Date(item.LEAVE_DATE); //last payroll date 
              if(item.START_DATE){  
              this.startdate = new Date(item.START_DATE); 
              }                
              if (this.startdate && this.startdate<this.formattedlastPayrollDay) {    
                return true;
              } else {   
               return false;
              }   
              } 
    reasonview(REMARKS:any)
    {
      //alert(REMARKS);
      this.reasondisp.setValue(REMARKS);
    }
    download_documents(){
      let fileurl=this.apicall.DownloadLeaveDocuments(this.activereqid);
      let link = document.createElement("a");
        
         if (link.download !== undefined) {
            link.setAttribute("href", fileurl);
            link.setAttribute("download", "ReportFile.xlsx");
            link.setAttribute('target', '_blank');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
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
const totalResults = this.leavedata.filter((employee: any) => {
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

const filteredData = this.leavedata.filter((employee: any) =>
  Object.values(employee).some((value: any) =>
    typeof value === 'string' &&
    value.toLowerCase().startsWith(this.searchInput.toLowerCase())
  )
);

const start = (this.currentPage - 1) * this.itemsPerPage + 1;
return Math.min(start, filteredData.length);
}


getEntriesEnd(): number {  
const filteredData = this.leavedata.filter((employee: any) =>
  Object.values(employee).some((value: any) =>
    typeof value === 'string' &&
    value.toLowerCase().startsWith(this.searchInput.toLowerCase())
  )
);
const end = this.currentPage * this.itemsPerPage;
return Math.min(end, filteredData.length);
}
  }
  