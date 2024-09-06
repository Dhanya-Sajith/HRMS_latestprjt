import { Component, OnInit } from '@angular/core';
import { ApiCallService } from 'src/app/api-call.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from 'src/app/login.service';
import { JsonPipe, formatDate,DatePipe } from '@angular/common';
import { FormControl,FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-loan',
  templateUrl: './loan.component.html',
  styleUrls: ['./loan.component.scss']
})

export class LoanComponent implements OnInit {

  userSession:any = this.session.getUserSession();
  authorityflg:any =this.userSession.authorityflg;
  empcode: any=this.userSession.empcode;
  empid:any =this.userSession.id;
  level: any=this.userSession.level;
  roleid:any =this.userSession.level;
  grpname:any=this.userSession.grpname; 

  user = 'personal';
  GratuityAmount: any;
  InstallmentAmount:any;
  InstallmentNo:any;
  requestForm: FormGroup; 
  isFormValid:boolean=false;
  showModal = 0;
  failed!: string;
  success!: string;
  viewflag: any;
  currentPage=1;

  listLoanRequestPersonal: any;
  companydata: any;
  deptdata: any;
  empdata: any;
  comp_typeid:any=12; 
  dept_typeid: any = -1;
  status_typeid:any=26;
  selectedDept: any=-1;
  selectedCompanyid: any=-1;
  statusdata: any;
  date: any;
  fromdate: any;
  todate: any;  
  Date = new Date();
  firstDay1 = new Date(this.Date.getFullYear(), this.Date.getMonth(), 1);
  lastDay1 = new Date(this.Date.getFullYear(), this.Date.getMonth() + 1, 0);
  onfromdate=this.datepipe.transform(this.firstDay1,"yyyy-MM-dd");
  ontodate=this.datepipe.transform(this.lastDay1,"yyyy-MM-dd");
  selectedEmp: any=-1;
  selectedStatus: any=0;
  searchInput: string='';
  itemsPerPage=10;
  id: any;
  listLoanRequest: any;
  currentPagePersonal=1;
  reasonControl = new FormControl();  
  selectedRequestID: any;
  selectedEmpCode: any;
  isValid: boolean=false;
  EditForm: FormGroup; 
  DEDControl: any;
  DSBControl: any;
  dsbMonth: any;
  monthName: any;
  monthNumber: any;
  dsbYear: any;
  item: any;
  paymentdetails: any;
  DISBURSEMENT_DATE: any;
  approvelist: any;
  pstatus: any = 0;
  pfromdate: any;
  ptodate: any;
  currentmonth=this.datepipe.transform(new Date(), 'MMMM');
  currentyear=this.datepipe.transform(new Date(), 'Y');

  now = new Date();
  current = new Date(this.now.getFullYear(), this.now.getMonth(), 1);
  nextmonth=this.datepipe.transform(this.current, 'MM');
  currentmonthno=this.currentyear+ '-' +this.nextmonth;
  validdate: any;
  desiredPage: any;
  desiredPagePersonal: any;
  currentdate:any
  pdate: any;
  gratuity: any;
  validateMonth: any;
  month: any;

  constructor(private session:LoginService,private apicall:ApiCallService,private router:Router,private fb: FormBuilder,private datepipe:DatePipe,private route: ActivatedRoute) { 
    this.requestForm = this.fb.group({
      amount: ['', Validators.required],
      installmentno: ['', Validators.required],
      installmentamount: ['', Validators.required],
      deductmnthyr: ['', Validators.required],
    });
    this.EditForm = this.fb.group({
      DEDdate: ['', Validators.required],
      DSBdate: ['', Validators.required],      
    });
  }

  ngOnInit(): void {
    this.route.queryParams
    .subscribe(params => {
        this.user = params['user']; 
      }
    );

    if(this.authorityflg == 0 || this.user == 'personal' || this.user == undefined){
      this.user = 'personal';
      this.FetchLoanRequestsPersonal();
    }else{
      this.user = 'team';
      this.FetchLoanRequests();
    }
    this.currentPage = 1; 
    this.FetchGratuityAmount();

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
        //alert(JSON.stringify(this.fromdate))
      this.todate=this.datepipe.transform(this.date.TO_DATE, "yyyy-MM-dd");
      this.pfromdate=this.datepipe.transform(this.date.FROM_DATE, "yyyy-MM-dd");
        //alert(JSON.stringify(this.fromdate))
      this.ptodate=this.datepipe.transform(this.date.TO_DATE, "yyyy-MM-dd");
      // this.FetchLoanRequests();      
      // this.FetchLoanRequestsPersonal();
      
    });
    this.currentdate = this.datepipe.transform(new Date(), 'yyyy-MM-dd');
  }

  SelectTeamorpersonal(selectuser:any){
    this.user=selectuser;
    if (this.user == 'personal') {
      this.FetchLoanRequestsPersonal();

    }else{
      this.level = this.userSession.level;
      this.FetchLoanRequests();
    }  
  }

  onCompanySelected(selectedCompanyid: any) { 
    this.selectedCompanyid=selectedCompanyid;  
    //alert(this.selectedCompanyid)   
    this.apicall.FetchDepartmentList(selectedCompanyid,this.empcode).subscribe(res =>{
      this.deptdata=res;     
    }); 
    this.filter();
    this.apicall.FetchEmployeeList(this.selectedDept,this.selectedCompanyid,this.empcode).subscribe(res =>{
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

 filter(){
    if( this.fromdate > this.todate){
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
        status: this.selectedStatus,   // request sts
        authority:this.empcode,
        flag :-1,
        loan_active_status :-1,  // loan management sts

      }  


      // company:this.selectedCompanyid,
      // department:this.selectedDept,
      // emp_code:this.selectedEmp,
      // fromdate:this.fromdate,
      // todate:this.todate,
      // status: -1,
      // authority:this.empcode,
      // flag :1,
      // loan_active_status:this.selectedStatus,

      // console.log(data)
      // alert(JSON.stringify(data))
      this.apicall.FetchLoanRequest_Filter(data).subscribe((res) => {
        this.listLoanRequest=res;   
        const maxPageFiltered = Math.ceil(this.listLoanRequest.length / this.itemsPerPage);  

      if (this.currentPage > maxPageFiltered) {
        this.currentPage = 1;     
      } 
      });
    }
   }

   approve(reqid:any,empcode:any){ 
    const approvedata={
      req_id:reqid,
      empcode:empcode,
      verified_by:this.empcode,
      verified_remarks:'NULL',      
      mflag: 1
    }
      this.apicall.ApproveRejectLoanRequest(approvedata).subscribe((res) => {
        if(res.Errorid==1){
          this.showModal = 1;
          this.success='Request approved!';              
         
        }
        else{
          this.showModal = 2;
          this.failed='Failed!';         
        }     
        this.FetchLoanRequests();
        
    });
   }

   setSelectedRequestID(requestID: any,empCode:any,item:any) {
    this.selectedRequestID = requestID;
    this.selectedEmpCode = empCode;
    this.item=item;
    const payrolldt = this.item.PAYROLL_DATE
    this.pdate = this.datepipe.transform(payrolldt, 'yyyy-MM-dd');

    this.apicall.FetchDisbursmentMonth(empCode).subscribe((res) => {
      this.month = res.DISPLAY_FIELD;
      this.validateMonth = `${this.currentyear}-${this.month}`;
      (<HTMLInputElement>document.getElementById("openEditModal")).click();
    }, (error) => {
      console.error('Error fetching disbursement month:', error);
    });
   
    // if(this.pdate > this.currentdate) {
    //   this.current = new Date(this.now.getFullYear(), this.now.getMonth(), 1);
    //   this.nextmonth=this.datepipe.transform(this.current, 'MM');
    //   this.currentmonthno=this.currentyear+ '-' +this.nextmonth;
    // }else{
    //   this.current = new Date(this.now.getFullYear(), this.now.getMonth()+1, 1);
    //   this.nextmonth=this.datepipe.transform(this.current, 'MM');
    //   this.currentmonthno=this.currentyear+ '-' +this.nextmonth;
    // }
   }

   reject(reqid:any,reason:string){     
    const rejectdata={
      req_id:reqid,
      empcode:this.selectedEmpCode,
      verified_by:this.empcode,
      verified_remarks:reason,      
      mflag: 0
    }
    // alert(JSON.stringify(rejectdata))
      this.apicall.ApproveRejectLoanRequest(rejectdata).subscribe((res) => {
        // alert(JSON.stringify(res))      
        if(res.Errorid==1){
          this.showModal = 1;
          this.success='Request rejected!';   
           
         
        }
        else{
          this.showModal = 2;
          this.failed='Failed!';         
        }     
        this.FetchLoanRequests();         
        this.reasonControl.setValue('');
    });
   }

  clearReject(){
    this.reasonControl.setValue('');
  }

  FetchGratuityAmount()
  {
    this.apicall.GetGratuityAmount(this.empcode).subscribe((res)=>{
      this.gratuity = res
      this.GratuityAmount = this.gratuity.GRATUITY_AMOUNT;
      })
  }

  Clear()
  {
    (<HTMLInputElement>document.getElementById("amount")).value='';
    (<HTMLInputElement>document.getElementById("installmentno")).value='';
    (<HTMLInputElement>document.getElementById("installmentamount")).value='';
    (<HTMLInputElement>document.getElementById("deductmnthyr")).value='';
  }

  GetInstallmentAmount()
  {
    const amountvalue= this.requestForm.get('amount');
    const installmntNovalue= this.requestForm.get('installmentno');
    this.InstallmentAmount = (amountvalue?.value/installmntNovalue?.value).toFixed(2);
    this.requestForm.controls['installmentamount'].setValue(this.InstallmentAmount);
  }
  
  GetInstallmentNo()
  {
    const amountvalue= this.requestForm.get('amount');
    const installmentamountvalue= this.requestForm.get('installmentamount');
    this.InstallmentNo = (amountvalue?.value/installmentamountvalue?.value).toFixed(2);
    this.requestForm.controls['installmentno'].setValue(this.InstallmentNo);
  }

  AddLoanRequests()
  {
    if (this.requestForm.valid) {
      const amountvalue= this.requestForm.get('amount');
      const installmntNovalue= this.requestForm.get('installmentno'); 
      const installmentamountvalue= this.requestForm.get('installmentamount'); 
      const deductyrmnthvalue= this.requestForm.get('deductmnthyr');
      const yrmonth=deductyrmnthvalue?.value
      const year = yrmonth.split('-')[0];
      const month = yrmonth.split('-')[1];
      if(installmntNovalue?.value >= 24)
      {
        this.showModal = 2; 
        this.failed = " Maxium Repayment Period is 2 Years";
      }
      else{
       if (amountvalue && deductyrmnthvalue && installmntNovalue && installmentamountvalue) {
        const data = {

          empcode:this.empcode,
          amount:amountvalue.value,
          gratuityAmt:this.GratuityAmount,
          noOfInstal:installmntNovalue.value,
          instalAmt:installmentamountvalue.value,
          dSMonth:month,
          dSYear:year,  
        };
        // alert(JSON.stringify(data))
        this.apicall.AddLoanRequests(data).subscribe(res =>{
        //  alert(JSON.stringify(res))
          if(res.Errorid == -1)
          {
            this.showModal = 2; 
            this.failed = " Minimum three years of experience required";
          }
          else if(res.Errorid == -2)
          {
            this.showModal = 2; 
            this.failed = "Loan amount should not be less than 25% of the gratuity.";
          }
          else if(res.Errorid == -3)
          {
            this.showModal = 2; 
            this.failed = "Loan Amount should not be greater than 50% of gratuity";
          }
          else if(res.Errorid == -4)
          {
            this.showModal = 2; 
            this.failed = "Another active loan exists";
          }
          else if(res.Errorid == -5)
          {
            this.showModal = 2; 
            this.failed = "The loan cannot be processed as it hasn't been a year since the last one was taken.";
          }
          else if(res.Errorid == -7)
          {
            this.showModal = 2; 
            this.failed = "Another active request exists";
          }
          else if(res.Errorid == -6)
          {
            this.showModal = 2; 
            this.failed = "Can't submit loan request during disciplinary period";
          }
          else if(res.Errorid == 1)
          {
            this.showModal = 1; 
            this.success = "Loan Requested Successfully";
            this.FetchLoanRequestsPersonal();
            this.Clear();
          }
          else
          {
            this.showModal = 2; 
            this.failed = "Failed";
            this.Clear();

          }   
            //this.requestForm.reset();
     })
      }
    }
  }
    else{
      this.markFormGroupTouched(this.requestForm); 
    }
  }
  
  validateForm() {
    if (this.requestForm.valid){
    this.isFormValid = true;
    }
    else{
      this.markFormGroupTouched(this.requestForm);
    }
  }
  
  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
    });
  }

  FetchLoanRequestsPersonal()
  {
      this.viewflag = 0;
      this.apicall.LoanRequestListData(this.empcode,this.pstatus,this.viewflag,this.onfromdate,this.ontodate).subscribe((res)=>{
      this.listLoanRequestPersonal=res;
      console.log(this.listLoanRequestPersonal)

    })
  }

  Selectedpstatus(pstatus:any){
    this.pstatus = pstatus;
    this.personalfilter();
  }

  personalfilter(){
    if( this.pfromdate > this.ptodate){
      // (<HTMLInputElement>document.getElementById("openModalButton")).click();
      // this.showModal = 2;
      // this.failed = "Please Correct the Dates";
       alert("Please Correct the Dates")
    }else{
      this.viewflag = 0;
      this.apicall.LoanRequestListData(this.empcode,this.pstatus,this.viewflag,this.pfromdate,this.ptodate).subscribe((res)=>{
        this.listLoanRequestPersonal=res;
        const maxPageFiltered = Math.ceil(this.listLoanRequestPersonal.length / this.itemsPerPage);  

        if (this.currentPage > maxPageFiltered) {
          this.currentPage = 1;     
        } 
      })
    }
  }

  FetchLoanRequests()
  {
      this.viewflag = 1;
      this.apicall.LoanRequestListData(this.empcode,0,this.viewflag,this.onfromdate,this.ontodate).subscribe((res)=>{
      this.listLoanRequest=res;
      console.log(this.listLoanRequest)
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

  validateEditForm() {      
    if (this.EditForm.valid){
    this.isValid = true;
    }
    else{
      this.markFormGroupTouched(this.EditForm);
    
    }
  }

  Edit(reqId:any,item:any){   
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
      emp_code:this.selectedEmpCode,
      reqId: reqId,
      dedSMonth:dedMonth,
      dedSYear:dedYear,
      DisbSMonth:this.dsbMonth,
      DisbSYear:this.dsbYear,
      };
      this.apicall.EditLoan_ByHR(data).subscribe((res) => {  
        if(res.Errorid==1){
          this. approve(reqId,this.selectedEmpCode);
          // this.showModal = 1;
          // this.success='Changes saved successfully!';
          // this.FetchLoanRequests();   
        }
        else{
            this.showModal = 2; 
            this.failed='Failed!';     
        }
    
        this.FetchLoanRequests(); 
        this.EditForm.reset(); 
      
      });
    }
    } else {    
      this.markFormGroupTouched(this.EditForm);   
    }
  }

  clearEdit(){
    this.EditForm.reset(); 
    
  }

  selectreqId(reqid:any){
    this.selectedRequestID = reqid;
  }

  cancelRequest(reqid:any){
      const req_category='N';
      this.apicall.CancelRequests(this.empcode,reqid,req_category).subscribe(res=>{
        if(res.Errorid=='1')
        {
          this.showModal = 1;
          this.success = "Loan Request cancelled";
        }
        else
        {
          this.showModal = 2;
          this.failed = "Cancel request failed";
        }
        this.FetchLoanRequestsPersonal();
      })
  }

  Fetchloanpayments(reqid:any)
  {
    this.apicall.LoanPaymentDetails(this.empcode,reqid).subscribe((res)=>{
      this.paymentdetails=res;
      this.DISBURSEMENT_DATE=this.paymentdetails[0].DISBURSEMENT_DATE;
    })
  }

  Fetchloanpayments_team(ecd:any,reqid:any)
  {
    this.apicall.LoanPaymentDetails(ecd,reqid).subscribe((res)=>{
      this.paymentdetails=res;
      this.DISBURSEMENT_DATE=this.paymentdetails[0].DISBURSEMENT_DATE;
    })
  }

    // Status Approve List
    Approvelist(requestID: any){
      this.apicall.PayrollApproverDetails(1,requestID,'N').subscribe(res=>{
        this.approvelist = res;
      })
    }

    ClearInstallmentDetails()
    {
      (<HTMLInputElement>document.getElementById("installmentno")).value='';
      (<HTMLInputElement>document.getElementById("installmentamount")).value='';
      (<HTMLInputElement>document.getElementById("deductmnthyr")).value='';
    }
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
  getTotalPagesPersonal(): number {
    return Math.ceil(this.totalSearchResultsPersonal / this.itemsPerPage);
  }
  
  goToPagePersonal() {
    const totalPages = Math.ceil(this.totalSearchResultsPersonal / this.itemsPerPage);
    if (this.desiredPagePersonal >= 1 && this.desiredPagePersonal <= totalPages) {
      this.currentPagePersonal = this.desiredPagePersonal;
    } else {  
      
      (<HTMLInputElement>document.getElementById("openModalButton")).click();
      this.showModal = 2; 
      this.failed='Invalid page number!'; 
      this.desiredPagePersonal=''; 
    }   
   
  }
  getPageNumbersPersonal(currentPage: number): number[] {
    const totalPages = Math.ceil(this.totalSearchResultsPersonal / this.itemsPerPage);
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
  get totalSearchResultsPersonal(): number {
  const totalResults = this.listLoanRequestPersonal.filter((policy: any) => {
    return Object.values(policy).some((value: any) =>
      typeof value === 'string' && value.toLowerCase().startsWith(this.searchInput.toLowerCase())
    );
  }).length;
  
  const maxPageFiltered = Math.ceil(totalResults / this.itemsPerPage);  
  
  if (this.currentPagePersonal > maxPageFiltered) {
    this.currentPagePersonal = 1; 
  }
  
  return totalResults;
  }
  
  // Function to change the current page
  changePagePersonal(page: number): void { 
    this.desiredPagePersonal = '';   
    this.currentPagePersonal = page;
    const maxPage = Math.ceil(this.totalSearchResultsPersonal / this.itemsPerPage);
    if (this.currentPagePersonal > maxPage) {
      this.currentPagePersonal = 1;
    }        
  }
  getEntriesStartPersonal(): number {
  if (this.currentPage === 1) {
    return 1;
  }
  
  const filteredData = this.listLoanRequestPersonal.filter((policy: any) =>
    Object.values(policy).some((value: any) =>
      typeof value === 'string' &&
      value.toLowerCase().startsWith(this.searchInput.toLowerCase())
    )
  );
  
  const start = (this.currentPagePersonal - 1) * this.itemsPerPage + 1;
  return Math.min(start, filteredData.length);
  }
  
  
  getEntriesEndPersonal(): number {  
  const filteredData = this.listLoanRequestPersonal.filter((policy: any) =>
    Object.values(policy).some((value: any) =>
      typeof value === 'string' &&
      value.toLowerCase().startsWith(this.searchInput.toLowerCase())
    )
  );
  const end = this.currentPagePersonal * this.itemsPerPage;
  return Math.min(end, filteredData.length);
  }
  
}
  


