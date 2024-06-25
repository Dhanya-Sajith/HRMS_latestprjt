import { Component, OnInit } from '@angular/core';
import { ApiCallService } from 'src/app/api-call.service';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/login.service';
import { JsonPipe, formatDate,DatePipe } from '@angular/common';
import { FormControl,FormBuilder, FormGroup, Validators } from '@angular/forms';
  
 

@Component({
  selector: 'app-loan-hr',
  templateUrl: './loan-hr.component.html',
  styleUrls: ['./loan-hr.component.scss']
})
export class LoanHRComponent implements OnInit {
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

isFormValid:boolean=false;
    remarks: any;
    NewInTime: any;
    NewOuTTime: any;
   
    selectedEmpCode: any;
   
    activereqid: any;
    loandata: any;
   
    userSession:any = this.session.getUserSession();
      empcode: any=this.userSession.empcode;
      empid: any=this.userSession.id;
    
      Menu: string = 'payroll';
      subMenu: string = 'loan';
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
      EditForm: FormGroup;
      isValid: boolean=false;
  emp_code: any;
  req_Id: any;
  leave: any;
  compoff: any;
  business: any;
  permissions: any;
  loan: any;
  expense: any;
  desiredPage: any;
    
      constructor(private session:LoginService,private apicall:ApiCallService,private router:Router,private fb: FormBuilder,private datepipe:DatePipe) { 
        
        this.EditForm = this.fb.group({
          DEDdate: ['', Validators.required],
          DSBdate: ['', Validators.required],      
        });
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
         this.apicall.Filter_FetchLoanRequests_HR(data).subscribe((res) => {
          this.loandata=res;
          const maxPageFiltered = Math.ceil(this.loandata.length / this.itemsPerPage);  

          if (this.currentPage > maxPageFiltered) {
            this.currentPage = 1;     
          }  
          console.log(JSON.stringify(this.loandata)) 
          
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
       
     
      ActivereqID(reqid:any){
        this.activereqid = reqid;
      }
        navigateToLoan() {
          //this.router.navigate(['/loanHR']);
          this.subMenu='loan';
         
        }
        navigateToExpense(){
          //this.router.navigate(['/expenseHR']);
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
             this.apicall.Filter_FetchLoanRequests_HR(data).subscribe((res) => {
              this.loandata=res;
              const maxPageFiltered = Math.ceil(this.loandata.length / this.itemsPerPage);  

              if (this.currentPage > maxPageFiltered) {
                this.currentPage = 1;     
              }  
              console.log(JSON.stringify(this.loandata)) 
              
             });
          }
           }
           validateEditForm() {              
            if (this.EditForm.valid){
            this.isValid = true;            
            }
            else{
              this.markFormGroupTouched(this.EditForm);
            
            }
          }
          markFormGroupTouched(formGroup: FormGroup) {
            Object.values(formGroup.controls).forEach(control => {
              control.markAsTouched();
            });
          }
           Edit(item:any){               
            if (this.EditForm.valid) {
              const DEDControl = this.EditForm.get('DEDdate');      
              const DSBControl = this.EditForm.get('DSBdate');    
            if (DEDControl && DSBControl) { 
              const dedDateValue: string = DEDControl.value;
                const dedMonth: string = dedDateValue.split('-')[1]; 
                const dedYear: string = dedDateValue.split('-')[0];       
                const dsbDateValue: string = DSBControl.value;
                this.dsbMonth = dsbDateValue.split('-')[1]; 
                this.dsbYear= dsbDateValue.split('-')[0];
              
            const data = {
              emp_code:item.EMP_CODE,
              reqId: item.REQ_ID,
              dedSMonth:dedMonth,
              dedSYear:dedYear,
              DisbSMonth:this.dsbMonth,
              DisbSYear:this.dsbYear,
              };
              //alert(JSON.stringify(data))
              this.apicall.EditLoan_ByHR(data).subscribe((res) => { 
                //alert(JSON.stringify(res))
                if(res.Errorid==1){
                   this.approve(item);                  
                }
                else{
                    this.showModal = 2; 
                    this.failed='Failed!';     
                }
            
                this.filter(); 
                this.EditForm.reset(); 
              
              });
            }
            } else {    
              this.markFormGroupTouched(this.EditForm);   
            }
          }
  
          approve(item:any) {                      
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
             Sflag:8    
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
                Sflag:8,    
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
          datevalidation(){         
            let startdate = (<HTMLInputElement>document.getElementById("DSB")).value;
            let enddate = (<HTMLInputElement>document.getElementById("DED")).value;
        
              if(startdate != '' && enddate != ''){
          
                if( startdate > enddate){
                  this.validdate="Please enter valid dates";                 
                }
                else{
                  this.validdate="";
                }
              }
          }
        
        
           clearEdit(){
            this.EditForm.reset(); 
            
          }
        
    // Status Approve List
  Approvelist(requestID: any){
      this.apicall.PayrollApproveList(1,requestID,'N').subscribe(res=>{
        this.approvelist = res;
      })
    }
  Fetchloanpayments(item:any)
  {
    this.apicall.LoanPaymentDetails(item.EMP_CODE,item.REQ_ID).subscribe((res)=>{
      this.paymentdetails=res;
      this.DISBURSEMENT_DATE=this.paymentdetails[0].this.DISBURSEMENT_DATE;
    })
  }
  cancel(){
    const Data = {
      empcode:this.emp_code,
      reqid:this.req_Id,        
      updated_by:this.empcode,
      Sflag:8,
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
    
  isButtonDisabled(item: any): boolean {      
    
              
    if (item.DISBURSEMENT_DATE) {    
      return true;
    } else {   
     return false;
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
const totalResults = this.loandata.filter((employee: any) => {
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

const filteredData = this.loandata.filter((employee: any) =>
  Object.values(employee).some((value: any) =>
    typeof value === 'string' &&
    value.toLowerCase().startsWith(this.searchInput.toLowerCase())
  )
);

const start = (this.currentPage - 1) * this.itemsPerPage + 1;
return Math.min(start, filteredData.length);
}


getEntriesEnd(): number {  
const filteredData = this.loandata.filter((employee: any) =>
  Object.values(employee).some((value: any) =>
    typeof value === 'string' &&
    value.toLowerCase().startsWith(this.searchInput.toLowerCase())
  )
);
const end = this.currentPage * this.itemsPerPage;
return Math.min(end, filteredData.length);
}

    }
    
