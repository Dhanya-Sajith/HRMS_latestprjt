import { Component, OnInit } from '@angular/core';
import { ApiCallService } from 'src/app/api-call.service';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/login.service';
import { JsonPipe, formatDate,DatePipe } from '@angular/common';
import { FormControl,FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-loan-management',
  templateUrl: './loan-management.component.html',
  styleUrls: ['./loan-management.component.scss']
})
export class LoanManagementComponent implements OnInit {
  
  userSession:any = this.session.getUserSession();
  authorityflg:any =this.userSession.authorityflg;
  empcode: any=this.userSession.empcode;
  empid:any =this.userSession.id;
  level: any=this.userSession.level;
  roleid:any =this.userSession.level;

  comp_typeid:any=12; 
  dept_typeid: any = -1;
  status_typeid:any=68;
  selectedDept: any=-1;
  selectedCompanyid: any=-1;
  companydata: any;
  deptdata: any;
  empdata: any;
  statusdata: any;
  date: any;
  fromdate: any;
  todate: any;
  selectedEmp: any = -1;
  selectedStatus: any = -1;
  listLoanRequest: any;
  Date = new Date();
  firstDay1 = new Date(this.Date.getFullYear(), this.Date.getMonth(), 1);
  lastDay1 = new Date(this.Date.getFullYear(), this.Date.getMonth() + 1, 0);
  onfromdate=this.datepipe.transform(this.firstDay1,"yyyy-MM-dd");
  ontodate=this.datepipe.transform(this.lastDay1,"yyyy-MM-dd");
  paymentdetails: any;
  DISBURSEMENT_DATE: any;
  statusupdate: any;
  showModal = 0;
  failed!: string;
  success!: string;
  reasondisp=new FormControl();
  currentPagePersonal: any;
  totalreq: any;
  totalPages: any;
  searchInput: string='';
  itemsPerPage=10;
  currentPage=1;
  desiredPage: any; 
  selectedecode: any;
  selectedreqtid: any;
  holdsts: any;
  remarks: any;
  noofinstallments: any;
  installamnt: any;
  showModals= 0;
  successs!: string;
  faileds!: string;
  balamt: any;
  effectivedt: any;
  dateObj: any;
  monthYear: any;
  month: any;
  year: any;
  curdate: any;
  curmonth: any;
  curyear: any;
  effdt: any;
  yearnm: any;
  

  constructor(private session:LoginService,private apicall:ApiCallService,private route:Router,private fb: FormBuilder,private datepipe:DatePipe) { }

  ngOnInit(): void {

    this.currentPage = 1; 
    this.currentPagePersonal =1;
    //company combo box
    this.apicall.FetchCompanyList(this.empcode).subscribe((res)=>{
      this.companydata=res;
    });
    //Department combo box
    this.apicall.FetchDepartmentList(this.dept_typeid,this.empcode).subscribe(res =>{
      this.deptdata=res;     
    }); 
    //Employee combo box
    this.apicall.FetchEmployeeList(this.selectedDept,this.selectedCompanyid,this.empcode).subscribe(res =>{
      this.empdata=res;    
    });
    //Status combo box
    this.apicall.listStatus(this.status_typeid).subscribe((res) => {
      this.statusdata=res;     
    });
    //Dates 
    this.apicall.listFromToDates().subscribe((res) => {
      this.date=res[0]; 
      this.fromdate=this.datepipe.transform(this.date.FROM_DATE, "yyyy-MM-dd");
      this.todate=this.datepipe.transform(this.date.TO_DATE, "yyyy-MM-dd");   
    });
    this.FetchLoanRequests();
  }

  onCompanySelected(selectedCompanyid: any) { 
    this.selectedCompanyid=selectedCompanyid;  
    this.apicall.FetchDepartmentList(selectedCompanyid,this.empcode).subscribe(res =>{
      this.deptdata=res;     
    }); 
    this.filter();
    
    this.apicall.listEmployee(this.selectedDept,this.selectedCompanyid).subscribe((res) => {
      this.empdata=res;    
    });   
  }

  onDeptSelected(selectedDept:any){ 
    this.selectedDept = selectedDept; 
    this.apicall.FetchEmployeeList(selectedDept,this.selectedCompanyid,this.empcode).subscribe(res =>{
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

 FetchLoanRequests()
 {
  const data={
    company:-1,
    department:-1,
    emp_code:-1,
    fromdate:-1,
    todate:-1,
    status: -1,
    authority:this.empcode,
    flag :1,
    loan_active_status:-1
  }  
  
  console.log(JSON.stringify(data));
  this.apicall.FetchLoanRequest_Filter(data).subscribe((res) => {
    this.listLoanRequest=res;
    console.log(JSON.stringify(data));
    this.totalreq = this.listLoanRequest.length;  
    const totalPages = Math.ceil(this.totalreq / 10);
    this.totalPages = Array(totalPages).fill(0).map((_, index) => index + 1);  
    
  });
 }

 
 
  filter(){
    if( this.fromdate > this.todate){
      alert("Please Correct the Dates");
    }else{
      const data={
        company:this.selectedCompanyid,
        department:this.selectedDept,
        emp_code:this.selectedEmp,
        fromdate:this.fromdate,
        todate:this.todate,
        status: -1,
        authority:this.empcode,
        flag :1,
        loan_active_status:this.selectedStatus,
      }  

      // alert(JSON.stringify(data))
      console.log(JSON.stringify(data));
      this.apicall.FetchLoanRequest_Filter(data).subscribe((res) => {
        this.listLoanRequest=res;
        const maxPageFiltered = Math.ceil(this.listLoanRequest.length / this.itemsPerPage);  

        if (this.currentPage > maxPageFiltered) {
          this.currentPage = 1;     
        }  
        
      });
    }
   }

   Fetchloanpayments(ecd:any,reqid:any)
   {
     this.apicall.LoanPaymentDetails(ecd,reqid).subscribe((res)=>{
       this.paymentdetails=res;
       this.DISBURSEMENT_DATE=this.paymentdetails[0].DISBURSEMENT_DATE;
     })
   }

   holdstatusSelected(ecode:any,reqid:any,holdstatus:any){

    this.selectedecode = ecode;
    this.selectedreqtid = reqid;
    this.holdsts = holdstatus;
    this.remarks="null";

    if(holdstatus == -1){
        this.showModal = 2; 
        this.failed='Please, select loan status!';
    }
    else if(holdstatus == 3)
    {
      (<HTMLInputElement>document.getElementById("openModalButtonForalert")).click();
    }
    else{
      this.apicall.UpdateLoanStatus_ByHR(ecode,reqid,holdstatus,this.remarks).subscribe((res)=>{
        this.statusupdate=res;
        if(res.Errorid==1){
          (<HTMLInputElement>document.getElementById("openModalButtonForalertsuccess")).click();
          this.showModals = 1;
          this.successs = "Changes saved successfully!";
          this.FetchLoanRequests(); 
        }
        else{
          (<HTMLInputElement>document.getElementById("openModalButtonForalertsuccess")).click();
          this.showModals = 2;
          this.faileds = "Failed!";
          this.FetchLoanRequests();     
        }
      })
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
  const totalResults = this.listLoanRequest.filter((employee: any) => {
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
  
  const filteredData = this.listLoanRequest.filter((employee: any) =>
    Object.values(employee).some((value: any) =>
      typeof value === 'string' &&
      value.toLowerCase().startsWith(this.searchInput.toLowerCase())
    )
  );

  const start = (this.currentPage - 1) * this.itemsPerPage + 1;
  return Math.min(start, filteredData.length);
}

reasonview(REMARKS:any)
{
  this.reasondisp.setValue(REMARKS);
}



getEntriesEnd(): number {  
  const filteredData = this.listLoanRequest.filter((employee: any) =>
    Object.values(employee).some((value: any) =>
      typeof value === 'string' &&
      value.toLowerCase().startsWith(this.searchInput.toLowerCase())
    )
  );
  const end = this.currentPage * this.itemsPerPage;
  return Math.min(end, filteredData.length);
}

// closestatusChange(loanstatus:any)
// {
//   if(loanstatus==3)
//     {
//       (<HTMLInputElement>document.getElementById("openModalButtonForalert")).click();
//     }
// }

closestatusChange(empcode:any,reqId:any,holdsts:any,closereas:any)
{

 if(closereas!="")
{
  this.apicall.UpdateLoanStatus_ByHR(empcode,reqId,holdsts,closereas).subscribe((res)=>{
    this.statusupdate=res;

   // alert(JSON.stringify(res))
    
    if(res.Errorid==1){
      (<HTMLInputElement>document.getElementById("openModalButtonForalertsuccess")).click();
      this.showModals = 1;
      this.successs = "Changes saved successfully!";
      var textarea = (<HTMLInputElement>document.getElementById('closereason'));
      // Clear the text inside the textarea
      textarea.value = '';
      this.FetchLoanRequests();

    }
    else{
      (<HTMLInputElement>document.getElementById("openModalButtonForalertsuccess")).click();
      this.showModals = 2;
      this.faileds = "Failed!";
      this.FetchLoanRequests();  
    }
  })
}
else{
  (<HTMLInputElement>document.getElementById("openModalButtonForalertsuccess")).click();
  this.showModals = 2;
  this.faileds = "Please enter reason";
  this.FetchLoanRequests();  
}

}

forloanamtEdit(ecode:any,reqid:any,holdstatus:any,noOfInstal:any,Instal_Amnt:any,balamount:any,effctivedt:any){

  this.selectedecode = ecode;
  this.selectedreqtid = reqid;
  this.holdsts = holdstatus;
  this.noofinstallments = noOfInstal;
  this.installamnt= Instal_Amnt;
  this.balamt= balamount;
  this.effectivedt= effctivedt;

  // var effectivedt = "2024-04-20T00:00:00";
  // var dateObj = new Date(effectivedt);
  // var monthNames = ["January", "February", "March", "April", "May", "June",
  //                   "July", "August", "September", "October", "November", "December"];
  // var monthName = monthNames[dateObj.getMonth()];
  //  this.yearnm = dateObj.getFullYear();

  
  


  var dateObj = new Date(effctivedt);
  this.month = dateObj.getMonth() + 1;
  this.year = dateObj.getFullYear();
  this.date = dateObj.getDate();

  
  var currentDate = new Date();
  this.curdate = currentDate.getDate();
  this.curmonth = currentDate.getMonth() + 1; // Adding 1 since getMonth() returns zero-based month
  this.curyear = currentDate.getFullYear();

  let effdt;

  if (this.date > this.curdate) {
      effdt = this.month + 1;
  } else {
      effdt = this.month;
  }

  var date = new Date(2000, effdt - 1, 1);
  var monthName = date.toLocaleString('default', { month: 'long' });


  (<HTMLInputElement>document.getElementById("oldinstallment")).value = this.noofinstallments;
  (<HTMLInputElement>document.getElementById("oldAmount")).value = this.installamnt;
  (<HTMLInputElement>document.getElementById("balanceamnt")).value =  this.balamt;

  (<HTMLInputElement>document.getElementById("effmnth")).value =  effdt;
  (<HTMLInputElement>document.getElementById("effyear")).value =  this.year;

  (<HTMLInputElement>document.getElementById("effectivedt")).value =  monthName + ' , '+ this.year;

}

editloanAmount(empcode:any,reqId:any,holdsts:any,noofinst:any,newamnt:any)
{


  const efmnth= (<HTMLInputElement>document.getElementById("effmnth")).value;
  const efyr= (<HTMLInputElement>document.getElementById("effyear")).value;

  const updateloanData={
 
    revisedAmount :newamnt,
    revised_noOfInstallments: noofinst,
    effectiveFromYear : efyr,
    effectiveFromMonth : efmnth,
    empcode : empcode,
    updated_by : this.empcode,
    reqId:reqId 

  };

  if(noofinst!="" && newamnt!="")
    {

      this.apicall.Loan_RevisePaymentTerms(updateloanData).subscribe((res)=>{
       // this.statusupdate=res;
        if(res.Errorid==1){
          (<HTMLInputElement>document.getElementById("openModalButtonForalertsuccess")).click();
          this.showModals = 1;
          this.successs = "Changes saved successfully!";
          this.FetchLoanRequests();
          var newist = (<HTMLInputElement>document.getElementById('newinstallment'));
          newist.value = '';
          var newamnt = (<HTMLInputElement>document.getElementById('newAmount'));
          newamnt.value = '';
    
        }
        else{
          (<HTMLInputElement>document.getElementById("openModalButtonForalertsuccess")).click();
          this.showModals = 2;
          this.faileds = "Failed!";
          this.FetchLoanRequests();  
        }
      })

    }
    else
    {
      (<HTMLInputElement>document.getElementById("openModalButtonForalertsuccess")).click();
      this.showModals = 2;
      this.faileds = "Please enter new installment number and amount";
    }

  // this.apicall.CloseLoansts(empcode,reqId,holdsts,closereas).subscribe((res)=>{
  //   this.statusupdate=res;
  //   if(res.Errorid==1){
  //     this.showModal = 1;
  //     this.success='Changes saved successfully!';
  //     this.FetchLoanRequests();   
  //   }
  //   else{
  //       this.showModal = 2; 
  //       this.failed='Failed!';     
  //   }
  // })

}

}
