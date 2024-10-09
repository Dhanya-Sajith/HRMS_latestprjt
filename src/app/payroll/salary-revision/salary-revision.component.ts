import { Component, OnInit } from '@angular/core';
import { ApiCallService } from 'src/app/api-call.service';
import { FormGroup , FormBuilder , FormControl , Validators, FormArray, AbstractControl, ValidatorFn } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { LoginService } from 'src/app/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-salary-revision',
  templateUrl: './salary-revision.component.html',
  styleUrls: ['./salary-revision.component.scss']
})
export class SalaryRevisionComponent implements OnInit {

  userSession:any = this.session.getUserSession();
  empcode: any=this.userSession.empcode;
  empId: any=this.userSession.id;
  level:any =this.userSession.level;
  authorityflg:any =this.userSession.authorityflg;
  user: any='individual'
  grpname:any=this.userSession.grpname;
  desig:any=this.userSession.desig.split('#', 1);

  typeid: any = 12;
  listCompany: any;
  company: any;
  listDepartment: any;
  department: any;
  listEmployee: any;
  emp_code: any;
  companyid: any = -1;
  departmentid: any = -1;
  employeeid: any = -1;
  showModal = 0;
  success:any="";
  failed:any="";
  Allowance: any;
  EmployeeDtl: any;
  emp_name: any;
  EMP_NAME: any;
  DESIGNATION: any;
  DOJ: any;
  today:any = new Date();
  nextfirstday = new Date(this.today.getFullYear(), this.today.getMonth()+1, 1);
  //mindate = this.datePipe.transform(this.nextfirstday,"yyyy-MM-dd");
  //effectivedt = this.datePipe.transform(this.nextfirstday,"yyyy-MM-dd");
  mindate:any;
  effectivedt:any
  yearofservice: any;
  currentyear: any;
  DOJyear: any;
  EMP_CODE: any;
  grosssalary: any = 0;
  amount: any;
  oldsalary: any;
  newsalary: any;
  percent: any;
  diffsalary: any;
  EditForm: FormGroup; 
  isValid: boolean=false;
  SalaryComponent: any;
  salcompid=44;
  listsalarydtls: any;
  itemData: any;
  newgross: any;
  rows: any[] = [];
  validation!: string;
  fileuploadForm: any =  FormGroup;
  submitted = false;
  inputfield: any;
  FROM_DATE: any;
  fetchedData: any;

  effdate:any = -1;
  searchInput:string = '';
  SalaryForm: FormGroup;
  Selectedcompany:any = "";
  Selectedemployee:any = "";
  historydtls: any;
  itemsPerPage=10;
  currentPage=1;
  desiredPage: any;
  statusdata: any;

  
  constructor(private apicall:ApiCallService, private datePipe: DatePipe,private fb:FormBuilder,private session:LoginService,private route:Router) {
    this.EditForm = this.fb.group({
      salcomponent: ['', Validators.required],
      // salaryamnt: ['', Validators.required],      
    });
    this.SalaryForm = this.fb.group({
      tableRows: this.fb.array([]) // Initialize the form array
    });
   }

  get f() { return this.fileuploadForm.controls; }

  ngOnInit(): void {

    this.apicall.FetchCompanyList(this.empcode).subscribe((res)=>{
      this.listCompany=res;
    })

    this.apicall.listdepByComCode(this.companyid).subscribe(res =>{
      this.listDepartment=res;
    })

    this.apicall.EmployeefilterComboData_Payroll(this.companyid,this.empcode,this.grpname,this.desig).subscribe(res =>{
      this.listEmployee=res;  
    });

    // this.apicall.listEmployee(this.departmentid,this.companyid).subscribe(res =>{
    //   this.listEmployee=res;
    // })

    this.apicall.listsalarycomp(this.salcompid).subscribe((res)=>{
      this.SalaryComponent=res;
      })   

    this.fileuploadForm = this.fb.group({     
      myFile: ['', [Validators.required]],  
    });

    //salary components
    let j=0;
    for(j=0;j<1;j++)
    {
      this.addTableRow();
    }

  }

  get tableRows() {
    return this.SalaryForm.get('tableRows') as FormArray;
  }

  onAmountChange(i: number) {
    const control = this.tableRows.at(i) as FormGroup;
  
    if (control) {
      const allowanceId = control.get('allowanceId')?.value;
      const oldAmount = control.get('oldamount')?.value ?? null;
      const newAmount = control.get('amount')?.value ?? null;

      if (allowanceId === 1 && (!newAmount || newAmount <= 0)) {
        control.get('amount')?.setErrors({ zeroAmountForBasic: true });
        return; 
      } else {
        control.get('amount')?.setErrors(null); 
      }
  
      // if (oldAmount && newAmount) {
        const incrementSalary = newAmount - oldAmount;
        const percentIncrease = ((incrementSalary / oldAmount) * 100).toFixed(2) + '%';
  
        control.get('incrementsalary')?.setValue(incrementSalary);
        control.get('percentincrease')?.setValue(percentIncrease);
      // }

       this.updateGrossSalary();
    }
  }
  
  updateGrossSalary() {
    this.newgross = 0;
    this.tableRows.controls.forEach((control: AbstractControl) => {
      const amount = control.get('amount')?.value ?? 0;
      this.newgross += amount;
    });
  }

  populateForm(Allowance: any) {
    const control = this.tableRows;
    control.clear(); // Clear the form array before populating
  
    Allowance.forEach((goal: any) => {
      control.push(this.fb.group({
        allowanceId: [{ value: goal.ALLOWANCE_ID || '', disabled: true }, Validators.required],
        oldamount: [{ value: goal.AMOUNT || '', disabled: true }, Validators.required],
        amount: ['', Validators.required],
        incrementsalary: [{ value: 0, disabled: true }],
        percentincrease: [{ value: '0%', disabled: true }]
      }));
    });
    console.log('Form after population:', this.SalaryForm.value);
  }
  
  addTableRow() {
    this.tableRows.push(this.fb.group({
      allowanceId: ['', Validators.required],
      oldamount: [''],
      amount: ['', Validators.required],
      incrementsalary: [{ value: 0, disabled: true }],
      percentincrease: [{ value: '0%', disabled: true }]
    }));
  }
  
 
  FetchSalaryAllowance() {
    this.apicall.listAllowance(this.emp_code).subscribe(res => {
      this.Allowance = res;
      for (let i = 0; i < this.Allowance.length; i++) {
        this.amount = this.Allowance[i].AMOUNT;
        this.grosssalary += this.amount;
      }
      this.populateForm(this.Allowance);
    });
  }

  getAvailableAllowanceOptions(index: number): any[] {
    const selectedAllowanceIds = this.tableRows.controls
      .map((control, i) => i !== index ? control.get('allowanceId')?.value : null)
      .filter(id => id !== null)
      .map(id => id.toString());

    console.log('Selected Allowance IDs:', selectedAllowanceIds);

    return this.SalaryComponent.filter((allowance: { KEY_ID: any; }) => 
      !selectedAllowanceIds.includes(allowance.KEY_ID.toString())
    );
  }
  

  radioselection(user:any){
    this.user=user;
    this.fetchedData = 0;
  }

  upload()
  {
    const input=document.getElementById("myFile");    
    const fdata = new FormData();   
    this.onFileSelect(input);  
  }  

  onFileSelect(input:any) {   
    this.submitted = true;
    if (this.fileuploadForm.invalid) {
      return;
  }
 
  if(this.submitted){ 
    this.fetchedData = 0;
    if (input.files && input.files[0]) {
      const fdata = new FormData();
      fdata.append('postedFile',input.files[0]);
      // this.showProgressBar = true;
      this.apicall.SalaryRevisionBulkUpload(fdata,this.empcode).subscribe((res)=>{
        if(res.returnVal>0)
        {
          if(res.returnVal == 1)
            {
              this.fetchedData = res.returntable
              this.showModal = 3;
              this.success = "Excel uploaded successfully";
            }
          this.inputfield = document.getElementById("myFile");
          this.inputfield.selectedIndex = 0;
          (<HTMLInputElement>document.getElementById("myFile")).value = '';
        }
        else{          
          this.showModal = 2;
          this.failed = "Uploading Failed!";      

        }
      })
    }
  }
   
  }
 
  onImageChangeFromFile($event:any)
  {
      if ($event.target.files && $event.target.files[0]) {
        let file = $event.target.files[0];
        console.log(file);
          if(file.type == "") {
            console.log("correct");
           
          }
          else {
            //call validation
            this.fileuploadForm.reset();
            this.fileuploadForm.controls["myFile"].setValidators([Validators.required]);
            this.fileuploadForm.get('myFile').updateValueAndValidity();
          }
      }
  } 

  // Department List
  DepartmentListFn(company_code:any): void {
    this.company = company_code;
      this.apicall.listdepByComCode(this.company).subscribe(res =>{
        this.listDepartment=res;
        })
        this.FetchAllowanceDtl(-1);
  }

  // Employee List
  EmployeeListFn(department_code:any,company_code:any): void {
      this.department = department_code;
      this.apicall.listEmployee(this.department,company_code).subscribe(res =>{
      this.listEmployee=res;
      })
      this.FetchAllowanceDtl(-1);
  }

  FetchAllowanceDtl(empcode:any){
    this.grosssalary = 0;
    this.emp_code = empcode;
    this.apicall.FetchEmployeeDesignationAndDOJ(this.emp_code).subscribe(res =>{
      this.EmployeeDtl=res;
      this.EMP_CODE =  this.EmployeeDtl[0].EMP_CODE;
      this.EMP_NAME = this.EmployeeDtl[0].EMP_NAME;
      this.DESIGNATION = this.EmployeeDtl[0].DESIGNATION;
      this.DOJ = this.EmployeeDtl[0].DOJ;
      this.DOJyear= this.datePipe.transform(this.DOJ,"yyyy");
      this.currentyear = this.datePipe.transform(this.today,"yyyy");
      this.yearofservice = this.currentyear -this.DOJyear;
    })
    this.apicall.Fetch_EffectiveDate_SalRevision(this.emp_code).subscribe(res =>{
      this.effectivedt=this.datePipe.transform(res.FROM_DATE,"yyyy-MM-dd");
    })
    this.FetchSalaryAllowance();
  }

  validateSalaryForm() {
    this.markFormGroupTouched(this.SalaryForm);
    this.tableRows.controls.forEach((control: AbstractControl) => {
      control.markAsTouched();
    });
  }
  
  isFormValid(): boolean {
    let isValid = true;
    this.tableRows.controls.forEach((control: AbstractControl) => {
      if (control.get('allowanceId')?.invalid || control.get('amount')?.invalid) {
        isValid = false;
      }
    });
    return isValid;
  }

  // validateTransferForm() {
  //   alert('inside')
  //   this.markFormGroupTouched(this.SalaryForm);
  
  //   if (this.SalaryForm.valid && this.isFormValid()) {
  //     this.isValid = true;
  //   } else {
  //     this.isValid = false;
  //   }
  // }

  amountValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const parent = control.parent;
      if (!parent) {
        return null;
      }
  
      const allowanceId = parent.get('allowanceId')?.value;
      const amount = control.value;
  
      if (allowanceId === 1 && amount <= 0) {
        return { amountZeroForBasic: true }; // Validation error if amount is zero or negative
      }
  
      return null; // No error
    };
  }
  

  validateTransferForm()
  {
    if (this.SalaryForm.invalid) {
      // Mark all fields as touched to trigger validation messages
      this.SalaryForm.markAllAsTouched();
      return; // Exit the function if the form is invalid
    }
  }


  SaveSalaryRevision()
  {
    //  this.validateTransferForm(); 

    if(this.emp_code == undefined){
      this.showModal = 2;
      this.failed = "Please, select the Employee.";
    }else if (this.SalaryForm.valid) {

      this.tableRows.controls.forEach((control: AbstractControl) => {
        control.get('allowanceId')?.enable();
      });

      const Data = {
        emp_code: this.emp_code,
        effective_date: this.effectivedt,
        gross_salary: this.newgross,  
        updated_by: this.empcode,
        allowanceArray: {
          tableRows: this.SalaryForm.value.tableRows.map((row: any) => ({
              allowanceId: row.allowanceId,
              amount: row.amount,
          }))
        }
      };
      this.apicall.SaveSalaryRevision(Data).subscribe((res) => {
        if(res.Errorid == 1){
            this.showModal = 1;
            this.success='Salary Revision Saved Succesfully!'; 
            this.FetchAllowanceDtl(this.emp_code);    
            this.newgross = 0; 
          }
          else if(res.Errorid == 5){
              this.showModal = 2; 
              this.failed='Salary revision for a forward date already exists.';
          }
          else{
              this.showModal = 2; 
              this.failed='Failed!';   
          } 
          this.cancel();             
      });
    }
  }

  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
    });
  }

  cancel(){
    (<HTMLInputElement>document.getElementById("emp_code")).value = '-1';
    (<HTMLInputElement>document.getElementById("company")).value = '-1';
    (<HTMLInputElement>document.getElementById("department")).value = '-1';
    this.FetchAllowanceDtl(-1);
    this.EmployeeDtl= '';
    this.EMP_CODE = '';
    this.EMP_NAME = '';
    this.DESIGNATION = '';
    this.yearofservice = '';

  }
  
  download_to_excel(){
     let fileurl=this.apicall.SalaryRevisionTemplate('S');
     let link = document.createElement("a");
       
        if (link.download !== undefined) {
           link.setAttribute("href", fileurl);
           link.setAttribute("download", "ReportFile.xlsx");
           document.body.appendChild(link);
           link.click();
           document.body.removeChild(link);
        }
  }

  ViewHistory()
  {
    this.apicall.FetchSalaryRevisionDetailsHR(this.Selectedemployee,this.Selectedcompany,this.effdate,this.empcode).subscribe(res =>{
      this.historydtls=res;
    })
  }

  ViewCompoents(code:any,effdate:any)
  {
    this.apicall.FetchSalaryComponent_emp(code,effdate).subscribe(res =>{
      this.statusdata=res;
    })
  }

  clearHighlight() {
    setTimeout(() => {
    this.statusdata = null;// Reset itemClicked to remove highlight
    }, 500); 
  }

  //PaginationTeam
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
    const maxPageNumbers = 5; 
    const middlePage = Math.ceil(maxPageNumbers / 2);
    let startPage = Math.max(currentPage - middlePage, 1);
    let endPage = Math.min(startPage + maxPageNumbers - 1, totalPages);
  
    if (endPage - startPage + 1 < maxPageNumbers) {
      startPage = Math.max(endPage - maxPageNumbers + 1, 1);
    }
  
    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  }
  
  get totalSearchResults(): number {
      const totalResults = this.historydtls.filter((employee: any) => {
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
  
  const filteredData = this.historydtls.filter((employee: any) =>
    Object.values(employee).some((value: any) =>
      typeof value === 'string' &&
      value.toLowerCase().startsWith(this.searchInput.toLowerCase())
    )
  );
  
  const start = (this.currentPage - 1) * this.itemsPerPage + 1;
  return Math.min(start, filteredData.length);
  }
  
  
  getEntriesEnd(): number {  
  const filteredData = this.historydtls.filter((employee: any) =>
    Object.values(employee).some((value: any) =>
      typeof value === 'string' &&
      value.toLowerCase().startsWith(this.searchInput.toLowerCase())
    )
  );
  const end = this.currentPage * this.itemsPerPage;
  return Math.min(end, filteredData.length);
  }


}