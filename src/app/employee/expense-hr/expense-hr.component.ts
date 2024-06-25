import { Component, OnInit } from '@angular/core';
import { ApiCallService } from 'src/app/api-call.service';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/login.service';
import { JsonPipe, formatDate,DatePipe } from '@angular/common';
import { FormControl,FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-expense-hr',
  templateUrl: './expense-hr.component.html',
  styleUrls: ['./expense-hr.component.scss']
})
export class ExpenseHRComponent implements OnInit {

  item: any;
  paymentdetails: any;
  DISBURSEMENT_DATE: any;
  dsbMonth: any;
  dsbYear:any;
  validdate: any;
  currentmonth=this.datepipe.transform(new Date(), 'MMMM');
  currentyear=this.datepipe.transform(new Date(), 'Y');

  now = new Date();
  current = new Date(this.now.getFullYear(), this.now.getMonth()+1, 1);
  nextmonth=this.datepipe.transform(this.current, 'MM');
  currentmonthno=this.currentyear+ '-' +this.nextmonth;
expensedata: any;
docName: any;
selectedEmpcode: any;
emp_code: any;
req_Id: any;


  

isFormValid:boolean=false;
    remarks: any;
    NewInTime: any;
    NewOuTTime: any;
    selectedRequestID: any;
    selectedEmpCode: any;
   
    activereqid: any;
  
   
    userSession:any = this.session.getUserSession();
      empcode: any=this.userSession.empcode;
      grpname:any=this.userSession.grpname;  
      empid: any=this.userSession.id;
    
      Menu: string = 'payroll';
      subMenu: string = 'expense';
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
      
      isValid: boolean=false;
      convamunt:any = 0;
loan: any;
expense: any;
  desiredPage: any;
  
    
      constructor(private session:LoginService,private apicall:ApiCallService,private router:Router,private fb: FormBuilder,private datepipe:DatePipe) { 
       
      }
    
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
         this.apicall.Filter_FetchExpenseClaim_HR(data).subscribe((res) => {
          this.expensedata=res;         
          
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
        
     
        navigateToLoan() {
          this.router.navigate(['/loanHR']);
          this.subMenu='loan';
         
        }
        navigateToExpense(){
          this.router.navigate(['/expenseHR']);
          this.subMenu='expense';
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
    this.apicall.FetchPendingCount_HR(3,this.empcode).subscribe((res) => {        
     this.loan=res[0].LOAN;
     this.expense=res[0].CLAIM;        
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
             this.apicall.Filter_FetchExpenseClaim_HR(data).subscribe((res) => {
              this.expensedata=res;
              const maxPageFiltered = Math.ceil(this.expensedata.length / this.itemsPerPage);  

              if (this.currentPage > maxPageFiltered) {
                this.currentPage = 1;     
              }  
              console.log(JSON.stringify(this.expensedata)) 
              
             });
          }
           }
           isButtonDisabled(item: any): boolean {           
              
            if (item.PAYROLL_DATE) {    
              return true;
            } else {   
             return false;
            }   
            } 
          markFormGroupTouched(formGroup: FormGroup) {
            Object.values(formGroup.controls).forEach(control => {
              control.markAsTouched();
            });
          }
          approve(item: any) {              
            if( item.convamunt==0 || !item.convamunt){                
              (<HTMLInputElement>document.getElementById("openModalButton")).click();
              this.showModal = 2;
              this.failed = "Please enter converted amount!";
            }else{                     
            const data={
             empcode:item.EMP_CODE,
             reqId:item.REQ_ID,
             inDate:null,
             inTime:null,
             outTime:null,
             conv_Amount: item.convamunt,
             reject_reason: null,
             updated_by:this.empcode,
             mflag:1,
             Sflag:9,    
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
           }
           setSelectedRequestID(item: any) {
             this.item=item;
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
                Sflag:9,    
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
          selectreqId(reqid:any){
            this.selectedRequestID = reqid;
          }
    // Status Approve List
    Approvelist(requestID: any){
      this.reqID = requestID
      this.apicall.PayrollApproveList(1,this.reqID,'E').subscribe(res=>{
        this.approvelist = res;
      })
    }
    ActivereqID(reqid:any,docname:any){
      this.activereqid = reqid;
      this.docName = docname
    }
    
    download_to_excel()
      { 
       // alert(this.activereqid)
       let Excelname:any;
      //  this.apicall.ExportToExcel(this.listdailyatt).subscribe((res)=>{
      //   Excelname=res.Errormsg;
        let fileurl=this.apicall.GetExpenseclaimFile(this.activereqid,this.docName);
        let link = document.createElement("a");
          
            if (link.download !== undefined) {
           //   let url = URL.createObjectURL(blob);
              link.setAttribute("href", fileurl);
              link.setAttribute("download", "");
              link.setAttribute('target', '_blank');
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
       }
      // });
      
        }
        setSelectedvalues(requestID: any,empcode: any) {

          this.selectedRequestID = requestID;
          this.selectedEmpcode = empcode;
      
      }
     
      cancel(){
        const Data = {
          empcode:this.emp_code,
          reqid:this.req_Id,        
          updated_by:this.empcode,
          Sflag:9,
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
const totalResults = this.expensedata.filter((employee: any) => {
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

const filteredData = this.expensedata.filter((employee: any) =>
  Object.values(employee).some((value: any) =>
    typeof value === 'string' &&
    value.toLowerCase().startsWith(this.searchInput.toLowerCase())
  )
);

const start = (this.currentPage - 1) * this.itemsPerPage + 1;
return Math.min(start, filteredData.length);
}


getEntriesEnd(): number {  
const filteredData = this.expensedata.filter((employee: any) =>
  Object.values(employee).some((value: any) =>
    typeof value === 'string' &&
    value.toLowerCase().startsWith(this.searchInput.toLowerCase())
  )
);
const end = this.currentPage * this.itemsPerPage;
return Math.min(end, filteredData.length);
}
    }
    
