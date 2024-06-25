import { Component, OnInit } from '@angular/core';
import { ApiCallService } from 'src/app/api-call.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from 'src/app/login.service';
import { JsonPipe, formatDate,DatePipe } from '@angular/common';
import { FormControl,FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-expense-claim',
  templateUrl: './expense-claim.component.html',
  styleUrls: ['./expense-claim.component.scss']
})
export class ExpenseClaimComponent implements OnInit {
  userSession:any = this.session.getUserSession();
  authorityflg:any =this.userSession.authorityflg;
  empcode: any=this.userSession.empcode;
  empid:any =this.userSession.id;
  level: any=this.userSession.level;
  grpname:any=this.userSession.grpname;  
  user = 'personal';
  flag: any;
  Compname=12;
  listCompany: any;
  listDepartment: any;
  listEmployee: any;
  deptypeid = -1;
  listdates: any;
  liststatus:any;
  statustypeid= 26;
  fromdate = new FormControl();
  todate = new FormControl();
  pfromdate = new FormControl();
  ptodate = new FormControl();
  fmdt: any;
  todt: any;
  sdate: any;
  edate: any;
  expensetypeid=14;
  listexpense: any;
  listcurrency: any;
  requestForm: FormGroup; 
  isFormValid:boolean=false;
  selectedRequestID: any;
  selectedEmpcode: any;
  listexpenseclaim: any;
  totalreq: any;
  totalPages:any;
  showModal = 0; 
  
  failed!: string;
  success!: string;
  reasonControl= new FormControl();
  viewflag: any;
  convamunt:any = 0;
  listexpenseclaimPersonal: any;
  convertedamunt: any;
  listmaxemp: any;
  approvelist: any;
  reqID: any;
  todayDate=this.datePipe.transform(new Date(), 'yyyy-MM-dd');
  msg: any;
  activereqid: any;
  docName: any;
  itemsPerPage=10;
  currentPage=1;
  currentPagePersonal=1;
  desiredPage: any; 
  desiredPagePersonal: any;
  searchInput: string='';
  // todayDate=(formatDate(new Date(),'yyyy-MM-dd','en'))
  constructor(private session:LoginService,private apicall:ApiCallService,private router:Router,private fb: FormBuilder,private datePipe: DatePipe,private route: ActivatedRoute) { 
    this.requestForm = this.fb.group({
      expense_category: ['-1', Validators.required],
      inputdes: ['', Validators.required],
      amount: ['', Validators.required],
      currency: ['-1', Validators.required],
      expincuredate: ['', Validators.required],
      doc : ['', Validators.required],
    });
  }

  ngOnInit(): void {

    this.route.queryParams
      .subscribe(params => {
        this.user = params['user']; 
      }
    );

    if(this.authorityflg === 0 || this.user == 'personal' || this.user == undefined){
      this.user = 'personal';
      this.FetchDatesPersonal();
    }else{
      this.user = 'team';
      this.ExpenseClaimDataTeam();
    }
    this.currentPage = 1; 
    this.ListCompany();
    this.ListDepartments();
    this.ListEmployees();
    this.FetchDates();
    this.ListStatus();
    this.FetchDatesPersonal();
    this.requestForm.controls['expincuredate'].setValue(this.todayDate);
  }
  get f()
  {
    return this.requestForm.controls;
  }
  SelectTeamorpersonal(selectuser:any){
    this.user=selectuser;
    if (this.user === 'personal') {
      this.ExpenseClaimDataPersonal();

    }else{
      this.level = this.userSession.level;
      this.ExpenseClaimDataTeam();
    }  
}
ListCompany()
  {
    this.apicall.FetchCompanyList(this.empcode).subscribe((res)=>{
      this.listCompany=res;
    })
  }

  ListDepartments()
  {
    this.apicall.FetchDepartmentList(this.deptypeid,this.empcode).subscribe(res =>{
      this.listDepartment=res;
    })
  }
  ListEmployees()
  {
    this.apicall.FetchEmployeeList(this.deptypeid,-1,this.empcode).subscribe(res =>{
      this.listEmployee=res;
      })
  }
  FetchDates()
{
  this.apicall.listFromToDates().subscribe(res=>{
    this.listdates = res;
    if(this.listdates.length > 0)
    {
      const listdatesdata = this.listdates[0];
      this.fromdate.setValue(formatDate(listdatesdata.FROM_DATE,'yyyy-MM-dd','en'));
      this.todate.setValue(formatDate(listdatesdata.TO_DATE,'yyyy-MM-dd','en'));
      this.pfromdate.setValue(formatDate(listdatesdata.FROM_DATE,'yyyy-MM-dd','en'));
      this.ptodate.setValue(formatDate(listdatesdata.TO_DATE,'yyyy-MM-dd','en'));
      this.fmdt =formatDate(listdatesdata.FROM_DATE,'yyyy-MM-dd','en');
      this.todt = formatDate(listdatesdata.TO_DATE,'yyyy-MM-dd','en');
    }
    this.ExpenseClaimDataTeam();
  })
}

  ListStatus()
  {
    this.apicall.listStatus(this.statustypeid).subscribe((res)=>{
      this.liststatus=res;
      })
  }
  ListDepByComId()
  { 
    const company_code= (<HTMLInputElement>document.getElementById("company")).value;
    this.apicall.FetchDepartmentList(company_code,this.empcode).subscribe(res =>{
    this.listDepartment=res;
    this.ExpenseClaimFilterTeam();
    })
  }

  ListEmpByComIdandDep()
  {
    const comp= (<HTMLInputElement>document.getElementById("company")).value;
    const dep= (<HTMLInputElement>document.getElementById("department")).value;
    this.apicall.FetchEmployeeList(dep,comp,this.empcode).subscribe(res =>{
    this.listEmployee=res;
    this.ExpenseClaimFilterTeam();
    })
  }
  ListExpenseCategory()
  {
    this.apicall.listExpenseCategory(this.expensetypeid).subscribe((res)=>{
      this.listexpense=res;
      })
  }
  ListcurrencyData()
  {
    this.apicall.listCurrency().subscribe((res)=>{
      this.listcurrency=res;
      })
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

    Clear()
    {
      //this.requestForm.controls['expincuredate'].setValue(this.todayDate);
      (<HTMLInputElement>document.getElementById("expense_category")).value='';
      (<HTMLInputElement>document.getElementById("inputdes")).value='';
      (<HTMLInputElement>document.getElementById("amount")).value='';
      (<HTMLInputElement>document.getElementById("currency")).value='';
      (<HTMLInputElement>document.getElementById("doc")).value='';

      this.requestForm.controls['expincuredate'].setValue(this.todayDate);
      //(<HTMLInputElement>document.getElementById("expincuredate")).value=this.todayDate;
    }



  AddExpenseRequests()
  {

  if (this.requestForm.valid) {
    const expcatgry = this.requestForm.get('expense_category');      
    const expdesc = this.requestForm.get('inputdes');
    const amunt = this.requestForm.get('amount');
    const currency = this.requestForm.get('currency');
    const doc = this.requestForm.get('doc');
    const incuredate = this.requestForm.get('expincuredate');

    if (expcatgry && expdesc && amunt && currency && doc && incuredate) { 
      const data = {
        empcode:this.empcode,
        expcategory:expcatgry.value,
        expdesc:expdesc.value,
        amount:amunt.value,
        incured_date:incuredate.value,
        currency:currency.value,
        docpath:doc.value,        
      };
      
      this.apicall.AddExpenseClaimRequests(data).subscribe(res =>{
      if(res.Errorid>0)
        {
          this.showModal = 1; 
          this.success = "Expense Claim Request Saved Successfully";
          this.ExpenseClaimFiterPersonal();
          this.upload(res.Errorid);
          this.Clear();
          
        }
        else
        {
          this.showModal = 2;
          this.failed = "Failed";
        }   
        this.requestForm.reset();
     })
    }
    }
    else {    
      this.markFormGroupTouched(this.requestForm);   
    }

  }
  upload(reqid:any)
{
 // alert("Gfgf")
  let input:any;
     input=document.getElementById("doc");
     const fdata = new FormData();
     this.onFileSelect(input,reqid);
 }
 onFileSelect(input:any,reqid:any) {
  
  if (input.files && input.files[0]) {
    
   const fdata = new FormData();
  
   fdata.append('filesup',input.files[0]);
   //alert(JSON.stringify(fdata))
  // alert("before")
   this.apicall.UploadExpenseDoc(fdata,reqid).subscribe((res)=>{
     const result=res;
     if(res==0)
     { 
       this.showModal = 2;
      this.failed = "Document uploading failed";
     }
   })

 }
}
  Reject(requestID:any,Empcode:any,Reason:string ){  
    const rejectdata={
      req_id:requestID,
      empcode:Empcode,
      verified_by:this.empcode,
      verified_remarks: Reason,
      mflag: 2,
      conv_amunt:0
    }
    this.apicall.ApproveorRejectExpenseClaim(rejectdata).subscribe((res) => {
      if(res.Errorid==1){

        this.showModal = 1;
        this.success = "Request Rejected!"; 
        this.ExpenseClaimFilterTeam();    
      }
      else{
        this.showModal = 2; 
        this.failed = "Request Rejection Failed";    
      }
     
      this.reasonControl.setValue('');
    });
   }

   approve(reqid:any,Empcode:any,convamunt:any){
    if(convamunt == undefined){
      convamunt = 0;
    }
    if(convamunt==0 && this.level == 2)
    {
      this.showModal = 2; 
      this.failed = "Plese Fill the Converted Amount in AED";
    }
    else{
      const approvedata={
      req_id:reqid,
      empcode:Empcode,
      verified_by:this.empcode,
      verified_remarks: 'null',
      mflag: 1,
      conv_amunt:convamunt,
    }
      this.apicall.ApproveorRejectExpenseClaim(approvedata).subscribe((res) => {      
        if(res.Errorid==1){
          this.showModal = 1; 
          this.success ="Expense Claim Request Approved"  ; 
          this.ExpenseClaimFilterTeam(); 
        }
        else{
        this.showModal = 2; 
        this.failed = "Failed";
     
        }  
            
    });
  }
}
  setSelectedvalues(requestID: any,empcode: any) {

    this.selectedRequestID = requestID;
    this.selectedEmpcode = empcode;

}

ExpenseClaimFilterTeam()
  {
    const comp= (<HTMLInputElement>document.getElementById("company")).value;
    const dep= (<HTMLInputElement>document.getElementById("department")).value;
    const emp = (<HTMLInputElement>document.getElementById("emp_code")).value;
    const reqststs = (<HTMLInputElement>document.getElementById("tstatus")).value;
    if( this.fromdate.value > this.todate.value){
      (<HTMLInputElement>document.getElementById("openModalButton")).click();
      this.showModal = 2;
      this.failed = "Please Correct the Dates";
    }else{

    const data = {
      company:comp,
      department: dep,
      emp_code: emp,
      status:reqststs,
      fromdate: this.fromdate.value,
      todate: this.todate.value, 
      authority:this.empcode,
      };
      this.apicall.ExpenseClaimFilter(data).subscribe(res =>{
      this.listexpenseclaim=res;
      const maxPageFiltered = Math.ceil(this.listexpenseclaim.length / this.itemsPerPage);  

      if (this.currentPage > maxPageFiltered) {
        this.currentPage = 1;     
      }   
     
      })
    }
  }
ExpenseClaimDataTeam()
  { 
    const reqstatus=0;
    this.viewflag = 1;
      this.apicall.ExpenseClaimListData(this.empcode,reqstatus,this.viewflag,this.fmdt,this.todt).subscribe((res)=>{
      this.listexpenseclaim=res;

      this.totalreq=this.listexpenseclaim.length;      
      const totalPages = Math.ceil(this.totalreq / 5);
      this.totalPages = Array(totalPages).fill(0).map((_, index) => index + 1); 
    })
  }
  ExpenseClaimDataPersonal()
  { 
    const reqstatus=0;
    this.viewflag = 0;
      this.apicall.ExpenseClaimListData(this.empcode,reqstatus,this.viewflag,this.fmdt,this.todt).subscribe((res)=>{
      this.listexpenseclaimPersonal=res;

      this.totalreq=this.listexpenseclaimPersonal.length;      
      const totalPages = Math.ceil(this.totalreq / 5);
      this.totalPages = Array(totalPages).fill(0).map((_, index) => index + 1); 
    })
  }
  FetchDatesPersonal()
  {
    this.apicall.listFromToDates().subscribe(res=>{
      this.listdates = res;
     
      if(this.listdates.length > 0)
      {
        const listdatesdata = this.listdates[0];
        this.pfromdate.setValue(formatDate(listdatesdata.FROM_DATE,'yyyy-MM-dd','en'));
        this.ptodate.setValue(formatDate(listdatesdata.TO_DATE,'yyyy-MM-dd','en'));
        this.fmdt =formatDate(listdatesdata.FROM_DATE,'yyyy-MM-dd','en');
        this.todt = formatDate(listdatesdata.TO_DATE,'yyyy-MM-dd','en');
      };
      this.ExpenseClaimDataPersonal();
    })
  }
  ExpenseClaimFiterPersonal()
  {
    const reqstatus=(<HTMLInputElement>document.getElementById("pstatus")).value;
    if(this.pfromdate.value > this.ptodate.value){
      (<HTMLInputElement>document.getElementById("openModalButton")).click();
      this.showModal = 2;
      this.failed = "Please Correct the Dates";
    }else{
      this.viewflag = 0;
        this.apicall.ExpenseClaimListData(this.empcode,reqstatus,this.viewflag,this.pfromdate.value,this.ptodate.value).subscribe((res)=>{
        this.listexpenseclaimPersonal=res;

        const maxPageFiltered = Math.ceil(this.listexpenseclaimPersonal.length / this.itemsPerPage);  

        if (this.currentPage > maxPageFiltered) {
          this.currentPage = 1;     
        }   
       
        })
    }
  }

  CancelRequest(Empcode:any,requestID:any)
{
  const req_category='E';
  this.apicall.CancelRequests(Empcode,requestID,req_category).subscribe((res) => {
    if(res.Errorid==1){
      this.showModal = 1; 
      this.success='Request cancelled!'; 
      this.ExpenseClaimFiterPersonal();   
    }
    else{
      this.showModal = 2; 
      this.failed='Failed!';      
    }  
  });
}
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
    const totalResults = this.listexpenseclaim.filter((employee: any) => {
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
    
    const filteredData = this.listexpenseclaim.filter((employee: any) =>
      Object.values(employee).some((value: any) =>
        typeof value === 'string' &&
        value.toLowerCase().startsWith(this.searchInput.toLowerCase())
      )
    );
  
    const start = (this.currentPage - 1) * this.itemsPerPage + 1;
    return Math.min(start, filteredData.length);
  }
  
  
  getEntriesEnd(): number {  
    const filteredData = this.listexpenseclaim.filter((employee: any) =>
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
  const totalResults = this.listexpenseclaimPersonal.filter((policy: any) => {
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
  
  const filteredData = this.listexpenseclaimPersonal.filter((policy: any) =>
    Object.values(policy).some((value: any) =>
      typeof value === 'string' &&
      value.toLowerCase().startsWith(this.searchInput.toLowerCase())
    )
  );
  
  const start = (this.currentPagePersonal - 1) * this.itemsPerPage + 1;
  return Math.min(start, filteredData.length);
  }
  
  
  getEntriesEndPersonal(): number {  
  const filteredData = this.listexpenseclaimPersonal.filter((policy: any) =>
    Object.values(policy).some((value: any) =>
      typeof value === 'string' &&
      value.toLowerCase().startsWith(this.searchInput.toLowerCase())
    )
  );
  const end = this.currentPagePersonal * this.itemsPerPage;
  return Math.min(end, filteredData.length);
  }
  
}



