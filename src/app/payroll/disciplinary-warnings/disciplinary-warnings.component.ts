import { Component, OnInit } from '@angular/core';
import { ApiCallService } from 'src/app/api-call.service';
import { FormGroup , FormBuilder , FormControl , Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { LoginService } from 'src/app/login.service';

@Component({
  selector: 'app-disciplinary-warnings',
  templateUrl: './disciplinary-warnings.component.html',
  styleUrls: ['./disciplinary-warnings.component.scss']
})
export class DisciplinaryWarningsComponent implements OnInit {
  
  userSession:any = this.session.getUserSession();
  empcode: any=this.userSession.empcode;
  empId: any=this.userSession.id;
  level:any =this.userSession.level;
  authorityflg:any =this.userSession.authorityflg;
  
  companyid: any = -1;
  departmentid: any = -1;
  employeeid: any = -1;
  typeid: any = 12;
  department: any;
  listEmployee: any;
  company: any;
  listDepartment: any;
  listCompany: any;
  showModal = 0;
  success:any="";
  failed:any="";
  SaveForm: FormGroup; 
  isValid: boolean=false;
  startdt: any;
  enddt: any;
  today:any = new Date();
  mindate:any;
  validdate: any;
  listdata: any;
  currentPage: any=1;
  currentPagePersonal: any;
  totalreq: any;
  totalPages: any;
  searchInput: string='';
  itemsPerPage=10;
  isFormValid: boolean=false;
  EditForm: FormGroup; 
  emp_code: any;
  warning_id: any;
  REMARKS: any;
  issuedt: any;
  validdates: any;
  Activestatus: any = -1;
  companycd: any;
  desiredPage: any;

  constructor(private apicall:ApiCallService, private datePipe: DatePipe,private fb:FormBuilder,private session:LoginService) {
    this.SaveForm = this.fb.group({
      reason: [''],
      emp_code: ['', Validators.required],
      fromdt: ['',Validators.required],  
      todt: ['', Validators.required],    
    });
    this.EditForm = this.fb.group({
      reversaldt: ['', Validators.required],
      remarks: ['', Validators.required],      
    });
   }

   ngOnInit(): void {
    this.mindate = this.datePipe.transform(this.today,"yyyy-MM-dd");

    this.apicall.FetchCompanyList(this.empcode).subscribe((res)=>{
      this.listCompany=res;
    })

    this.apicall.FetchDepartmentList(this.companyid,this.empcode).subscribe(res =>{
      this.listDepartment=res;
    })

    this.apicall.FetchEmployeeList(this.departmentid,-1,this.empcode).subscribe(res =>{
      this.listEmployee=res;
    })
    this.apicall.FetchDisciplinaryWarnings(-1,-1,this.empcode).subscribe(res =>{
      this.listdata=res;
    })
  }

  // Department List
  DepartmentListFn(company_code:any): void {
    (<HTMLInputElement>document.getElementById("emp_code")).value = "";
    this.company = company_code;
    this.apicall.FetchDepartmentList(this.company,this.empcode).subscribe(res =>{
      this.listDepartment=res;
    }) 
  }

  // Employee List
  EmployeeListFn(department_code:any,company_code:any): void {
      this.department = department_code;
      this.apicall.FetchEmployeeList(this.department,company_code,this.empcode).subscribe(res =>{
        this.listEmployee=res;
      })
  }

  Activewarnings(activestatus:any){
    this.Activestatus = activestatus;
    this.FetchDisciplinaryWarnings(this.companycd);
  }

  validateSaveForm() {      
    if (this.SaveForm.valid){
    this.isValid = true;
    }
    else{
      this.markFormGroupTouched(this.SaveForm);   
    }
  }

  datevalidation(){
    const startdate = this.SaveForm.get('fromdt')?.value; 
    const enddate = this.SaveForm.get('todt')?.value; 
    if(startdate != '' && enddate != ''){

      if( startdate > enddate){
        this.validdate="Please enter valid dates";
        this.SaveForm.controls['fromdt'].setValue('');
        this.SaveForm.controls['todt'].setValue('');
      }
      else{
        this.validdate=''; 
      }
    }
  }

  SaveDisciplinary(){
    if (this.SaveForm.valid) {
      const emp_code = this.SaveForm.get('emp_code')?.value;      
      const startdate = this.SaveForm.get('fromdt')?.value; 
      const enddate = this.SaveForm.get('todt')?.value; 
      const reason = this.SaveForm.get('reason')?.value; 

      this.startdt =  this.datePipe.transform(startdate,"yyyy-MM-dd");
      this.enddt =  this.datePipe.transform(enddate,"yyyy-MM-dd");

      const newData = {
        empcode: emp_code,
        startdate:  this.startdt,
        enddate: this.enddt,
        reason: reason,
        updated_by: this.empcode,
      };
      this.apicall.SaveDisciplinaryWarnings(newData).subscribe((res)=>{
      if(res.Errorid==1)
      {
        this.showModal = 1;
        this.success = "Saved Successfully...";
        this.SaveForm.reset();
        this.FetchDisciplinaryWarnings(-1);
        (<HTMLInputElement>document.getElementById("company")).value = "";
        (<HTMLInputElement>document.getElementById("department")).value = "";
      }
      else
        {
          this.showModal = 2;
          this.failed = "Failed";
        }
      })
    } else {    
      this.markFormGroupTouched(this.SaveForm);   
    }
  }

  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
    });
  }

  clear(){
    this.SaveForm.reset(); 
  }

  FetchDisciplinaryWarnings(company:any){
    this.companycd = company;
    this.apicall.FetchDisciplinaryWarnings(this.companycd,this.Activestatus,this.empcode).subscribe(res =>{
      this.listdata=res;
      const maxPageFiltered = Math.ceil(this.listdata.length / this.itemsPerPage);  

      if (this.currentPage > maxPageFiltered) {
        this.currentPage = 1;     
      }   
     
    })
  }

  selectreason(remark:any){
    this.REMARKS =remark;
  }

  Deletewarnings(wid:any,empcd:any){
    this.apicall.DeleteDisciplinaryWarnings(wid,empcd).subscribe(res =>{
      if(res==1){
        this.showModal = 1;
        this.success='Deleted successfully!';
        this.FetchDisciplinaryWarnings(-1);
      }
      else{
          this.showModal = 2; 
          this.failed='Failed!';     
      }
    })
  }

  validateEditForm() {      
    if (this.EditForm.valid){
    this.isFormValid = true;
    }
    else{
      this.markFormGroupTouched(this.EditForm);
    
    }
  }

  Editempcode(empcd:any,warnid:any,rdate:any,remarks:any,issuedt:any){
    this.emp_code = empcd;
    this.warning_id = warnid;
    this.issuedt = issuedt;
    const todate = this.datePipe.transform(rdate,"yyyy-MM-dd");
    this.EditForm.controls['reversaldt'].setValue(todate);
    this.EditForm.controls['remarks'].setValue(remarks);
  }

  Editdatevalidation(){
    const enddate = this.EditForm.get('reversaldt')?.value;
    if(this.issuedt != '' && enddate != ''){

      if( this.issuedt > enddate){
        this.validdates="Please enter valid dates";
        this.EditForm.controls['reversaldt'].setValue('');
      }
      else{
        this.validdates='';
      }
    }
  }

  Edit(){   
    if (this.EditForm.valid) {
      const enddate = this.EditForm.get('reversaldt')?.value;      
      const remarks = this.EditForm.get('remarks')?.value;    
      
    const data = {
      empcode:this.emp_code,
      enddate:enddate,
      reason: remarks,
      updated_by:this.empcode,
      warning_id:this.warning_id,
      };
      this.apicall.UpdateDisciplinaryWarnings(data).subscribe((res) => {  
        if(res.Errorid==1){
          this.showModal = 1;
          this.success='Changes saved successfully!';
          this.FetchDisciplinaryWarnings(-1);   
        }
        else{
            this.showModal = 2; 
            this.failed='Failed!';     
        }
    
        this.FetchDisciplinaryWarnings(-1); 
        this.EditForm.reset(); 
      
      });
    } else {    
      this.markFormGroupTouched(this.EditForm);   
    }
  }

  clearEdit(){
    this.EditForm.reset(); 
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
  const totalResults = this.listdata.filter((employee: any) => {
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
  
  const filteredData = this.listdata.filter((employee: any) =>
    Object.values(employee).some((value: any) =>
      typeof value === 'string' &&
      value.toLowerCase().startsWith(this.searchInput.toLowerCase())
    )
  );

  const start = (this.currentPage - 1) * this.itemsPerPage + 1;
  return Math.min(start, filteredData.length);
}


getEntriesEnd(): number {  
  const filteredData = this.listdata.filter((employee: any) =>
    Object.values(employee).some((value: any) =>
      typeof value === 'string' &&
      value.toLowerCase().startsWith(this.searchInput.toLowerCase())
    )
  );
  const end = this.currentPage * this.itemsPerPage;
  return Math.min(end, filteredData.length);
}
}
