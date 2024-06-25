import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ApiCallService } from 'src/app/api-call.service';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { LoginService } from 'src/app/login.service';
@Component({
  selector: 'app-regularization-hr',
  templateUrl: './regularization-hr.component.html',
  styleUrls: ['./regularization-hr.component.scss']
})
export class RegularizationHRComponent implements OnInit {
  remarks: any;
  NewInTime: any;
  NewOuTTime: any;
    item: any;
    time: any;
    emp_code: any;
  
  userSession:any = this.session.getUserSession();
    empcode: any=this.userSession.empcode;
    empid: any=this.userSession.id;
  
    Menu: string = 'attendance';
    subMenu: string = 'regularization';
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
    regularizationdata: any;
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
    req_id: any;
    compensation: any;
    regularization: any;
    overtime: any;
  desiredPage: any;
  formattedlastPayrollDay: any;
  startdate: any;
  
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
       this.apicall.Filter_FetchRegularizationReq_HR(data).subscribe((res) => {
        this.regularizationdata=res;
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
        //this.filterStatuscount(); 
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
           this.apicall.Filter_FetchRegularizationReq_HR(data).subscribe((res) => {
            this.regularizationdata=res;
            const maxPageFiltered = Math.ceil(this.regularizationdata.length / this.itemsPerPage);  

            if (this.currentPage > maxPageFiltered) {
              this.currentPage = 1;     
            }  
            console.log(JSON.stringify(this.regularizationdata)) 
            
           });
        }
         }
         isButtonDisabled(item: any): boolean {      
          this.formattedlastPayrollDay = new Date(item.LAST_PAYROLL_DATE); //last payroll date 
          if(item.IN_DATE){  
          this.startdate = new Date(item.IN_DATE); 
          }
            
          if (this.startdate && this.startdate<this.formattedlastPayrollDay) {    
            return true;
          } else {   
           return false;
          }   
          } 
         // Status Approve List
         Approvelist(requestID: any){
          this.reqID = requestID
          this.apicall.StatusApproveList(2,this.reqID,'R').subscribe(res=>{
            this.approvelist = res;
            //alert(JSON.stringify(res))
          })
        }
      
        approve(item: any) {
          this.item=item;
          this.time=item.OUTTIME.split("-", 2);    
          const data={
           empcode:item.EMP_CODE,
           reqId:item.REQUEST_ID,
           inDate:item.IN_DATE,
           inTime:this.time[0],
           outTime:this.time[1],
           conv_Amount: null,
           reject_reason: null,
           updated_by:this.empcode,
           mflag:1,
           Sflag:1,    
         } 
         console.log(JSON.stringify(data)) 
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
           this.emp_code=item.EMP_CODE;
           this.req_id=item.REQUEST_ID;
           this.inDate=item.IN_DATE;
           this.time=item.OUTTIME.split("-", 2); 
          }
           onReject() {
              
             const data={
              empcode:this.emp_code,
              reqId:this.req_id,
              inDate:this.inDate,
              inTime:this.time[0],
              outTime:this.time[1],
              conv_Amount: null,
              reject_reason: this.remarks,
              updated_by:this.empcode,
              mflag:2,
              Sflag:1,    
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
                reqid:this.req_id,        
                updated_by:this.empcode,
                Sflag:1,
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
  
    reasonview(REMARKS:any)
    {
      //alert(REMARKS);
      this.reasondisp.setValue(REMARKS);
    }
    editinTime(empid:any,request_Id:any,inDate:any,updated_by:any)
    {
  
      this.empid = empid;
      this.reqid = request_Id;
      this.inDate = inDate;
      this.updated_by = empid;
  
      const editData = {
        empid:empid,
        reqid :this.reqid,
        inDate :this.inDate,
        updated_by:this.empcode,
      };
  
      //alert(JSON.stringify(editData));
  
      const NewInDate=this.datepipe.transform(inDate,"dd-MM-yyyy");
  
      //alert(NewInDate);
  
      this.LogdispInDate.setValue(NewInDate);
  
      //this.LogdispInDate.setValue(NewInDate);
  
  
    }
    confirmeditinTime(empid:any,reqid:any,updated_by:any)
    {
  
      const inTime= (<HTMLInputElement>document.getElementById("NewInTime")).value;
      // alert(inTime);
      const outTime= (<HTMLInputElement>document.getElementById("NewOuTTime")).value;
  
      //alert(outTime);
  
      if(!inTime || !outTime)
      {   
        this.showModal = 1;
        this.success="Please select a time!";  
         
      }  
      else if(inTime === "00:00" || outTime==="00:00" )
        {
          this.showModal = 1;
          this.success="Please select a valid time!";     
        } 
        // else if(inTime>outTime)
        // {
        //   this.showModal = 1;
        //   this.success="Out time should be greater than in time!";       
        // } 
        else{
  
          const editDatas = {
            empid:empid,
            reqid :this.reqid,
            inTime :inTime,
            outTime :outTime,
            updated_by:this.empcode,
            mflag:3,
          };
      
         // alert(JSON.stringify(editDatas));
          this.apicall.ApproveRequestapi(editDatas).subscribe(res=>{
          //alert(JSON.stringify(res));
      
          if(res.Errorid==1)
          {
            //alert("Deleted!");
            this.showModal = 1;
            this.success = "Updated Successfully";
            this.ngOnInit();
          }
          else
          {
            this.showModal = 2;
            this.failed = "Failed";
          }   
      
          }) 
          this.clearEditForm();
  
        }
  
    }
    clearEditForm(){
      this.NewInTime='';
      this.NewOuTTime='';
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
const totalResults = this.regularizationdata.filter((employee: any) => {
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

const filteredData = this.regularizationdata.filter((employee: any) =>
  Object.values(employee).some((value: any) =>
    typeof value === 'string' &&
    value.toLowerCase().startsWith(this.searchInput.toLowerCase())
  )
);

const start = (this.currentPage - 1) * this.itemsPerPage + 1;
return Math.min(start, filteredData.length);
}


getEntriesEnd(): number {  
const filteredData = this.regularizationdata.filter((employee: any) =>
  Object.values(employee).some((value: any) =>
    typeof value === 'string' &&
    value.toLowerCase().startsWith(this.searchInput.toLowerCase())
  )
);
const end = this.currentPage * this.itemsPerPage;
return Math.min(end, filteredData.length);
}

  }
  