import { Component, OnInit } from '@angular/core';
import { ApiCallService } from 'src/app/api-call.service';
import { FormGroup , FormBuilder , FormControl , Validators, FormArray, AbstractControl } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { LoginService } from 'src/app/login.service';


@Component({
  selector: 'app-employee-transfer-promotion',
  templateUrl: './employee-transfer-promotion.component.html',
  styleUrls: ['./employee-transfer-promotion.component.scss']
})
export class EmployeeTransferPromotionComponent implements OnInit {

  userSession:any = this.session.getUserSession();
  empcode: any=this.userSession.empcode;
  grpname:any=this.userSession.grpname;

  companydata: any;
  listDepartment: any;
  company: any;
  listEmployee: any;
  Action: any;
  department: any;
  WorkSchedule: any;
  listshift: any;
  listgrade: any;
  AirTicketEligibility: any;
  SalaryComponent: any;
  SelectCompany:any = -1;
  SelectEmployee:any = -1;
  SelectAction:any = -1;
  companylist: any;
  departmentlist: any;
  designationlist: any;

  TransferForm: FormGroup;
  SalaryForm: FormGroup;
  isValid: boolean=false;
  showModal = 0;
  success:any="";
  failed:any="";
  data: any;
  listManagers: any;
  Allowance: any;
  grosssalary: number = 0;
  amount: number = 0;
  newgrosssalary: number = 0;
  today:any = new Date();
  mindate = this.datePipe.transform(this.today,"yyyy-MM-dd");
  yeardata: any;
  teamyear: any = -1;
  teamDesignation:any = -1;
  teamCompany:any = -1;
  searchInput: string = '';
  Historydata: any;
  descdata: any;
  salarydata: any;
  grosstotal: any;

  itemsPerPage=10;
  currentPage=1;
  desiredPage: any;
  viewflag: number = 0;
  Ename: any;
  empdetails: any;
  errorMessage: any;

  constructor(private apicall:ApiCallService, private datePipe: DatePipe,private fb:FormBuilder,private session:LoginService) { 
    this.TransferForm = this.fb.group({
      company: ['', this.SelectAction === 1 ? Validators.required : []],
      department: ['', Validators.required, ],
      designation: ['', Validators.required],      
      Manager: ['', Validators.required],
      grade: [null, Validators.required],
      effdate: ['', Validators.required],
      Accommodation: [false],
      Transportation: [false],
      OvertimeEligible: [false],
      MedicalInsurance: [false],
      LifeInsurance: [false],
      FamilyInsurance: [false],
      FamilyAirticket: [false],
      FamilyVisa: [false],
      shift: ['', Validators.required],
      work_schedule: ['', Validators.required],
      AirTicketEligibility: [null, Validators.required],
      ProbationPeriod: ['', Validators.required],
      NoticePeriod: ['', Validators.required],
      Non_CompeteClause: [false],
    });
    this.SalaryForm = this.fb.group({
      tableRows: this.fb.array([]) // Initialize the form array
    });
  }

  ngOnInit(): void {

      //Year
      this.apicall.listYear().subscribe((res) => {
        this.yeardata=res;  
        if (this.yeardata.length > 0) {
          this.teamyear  = this.yeardata[0].DISPLAY_FIELD;
        } 
      });

    //Company list
    this.apicall.FetchCompanyList(this.empcode).subscribe((res) => {
      this.companydata=res;      
    });

    //Department list
    this.FetchDepartments();

    //Action list
    this.apicall.listRegStatus(86).subscribe((res)=>{
      this.Action=res;
    })

    //Company
    this.apicall.listCompany(12).subscribe((res)=>{
      this.companylist=res;
    })

    //Department
    this.apicall.listCompany(1).subscribe((res)=>{
      this.departmentlist=res;
    })

    //Designation
    this.apicall.listCompany(2).subscribe((res)=>{
      this.designationlist=res;
    })

    //Work Schedule
    this.apicall.listCompany(9).subscribe((res)=>{
      this.WorkSchedule=res;
    })

    //Shift Timings
    this.apicall.listshift().subscribe((res)=>{
      this.listshift=res;
    })

    //Grade
    this.apicall.listCompany(8).subscribe((res)=>{
      this.listgrade=res;
    })

    //Air Ticket Eligibility
    this.apicall.listCompany(36).subscribe((res)=>{
      this.AirTicketEligibility=res;
    })
    
    //Salary Component
    this.apicall.listCompany(44).subscribe((res)=>{
      this.SalaryComponent=res;
    })
    
    this.Fetch_Employees();

    //salary components
    let j=0;
    for(j=0;j<1;j++)
    {
      this.addTableRow();
    }

  }

  FetchDepartments()
  {
     //Department list
     this.apicall.FetchDepartmentList(this.teamCompany,this.empcode).subscribe(res =>{
      this.listDepartment=res;
    })
    this.FetchActionHistory();
  }

  Fetch_Employees()
  {
    //Employee list
    this.apicall.FetchEmployees(-1,this.SelectCompany,this.empcode).subscribe(res =>{
      this.listEmployee=res;
    })
  }

  FetchLineManagers(comp:any)
  {            
    this.apicall.FetchLineManagers(comp).subscribe(res =>{
      this.listManagers=res;
    })
  }

  get tableRows() {
    return this.SalaryForm.get('tableRows') as FormArray;
  }

  FetchSalaryAllowance() {
    this.apicall.listAllowance(this.SelectEmployee).subscribe(res => {
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

  CheckValidations()
  {
    if(this.SelectAction == 2)
    {
      this.apicall.FetchEmployeeDetails(this.SelectEmployee).subscribe(res =>{
        this.empdetails=res;      
        const selectedDepartment = this.TransferForm.get('department')?.value;
        const selectedDesignation = this.TransferForm.get('designation')?.value;
        if (this.empdetails[0].DEPARTMENT_ID == selectedDepartment && this.empdetails[0].DESIGNATION_ID == selectedDesignation) {
          this.TransferForm.get('designation')?.setErrors({ match: true });
          this.errorMessage = "Selected department and designation are the same as the employee's current records.";
      } else {
          this.TransferForm.get('designation')?.setErrors(null);
          this.errorMessage = null;
      }
      })
    }
  }
  
  onAmountChange(i: number) {
    const control = this.tableRows.at(i) as FormGroup;
  
    if (control) {
      const oldAmount = control.get('oldamount')?.value ?? null;
      const newAmount = control.get('amount')?.value ?? null;
  
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
    this.newgrosssalary = 0;
    this.tableRows.controls.forEach((control: AbstractControl) => {
      const amount = control.get('amount')?.value ?? 0;
      this.newgrosssalary += amount;
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
  
  validateTransferForm() {
    this.markFormGroupTouched(this.TransferForm);
    this.markFormGroupTouched(this.SalaryForm);
  
    if (this.TransferForm.valid && this.isFormValid()) {
      this.isValid = true;
    } else {
      this.isValid = false;
    }
  }

  SubmitForm()
  {
    this.validateTransferForm(); 

    if (this.TransferForm.valid && this.isFormValid()) {

      this.tableRows.controls.forEach((control: AbstractControl) => {
        control.get('allowanceId')?.enable();
      });

      const data = {
        empcode: this.SelectEmployee,
        company: this.SelectCompany,
        category : this.SelectAction,
        companyTo : this.TransferForm.get('company')?.value,
        department : this.TransferForm.get('department')?.value,
        designation : this.TransferForm.get('designation')?.value,
        lineManager : this.TransferForm.get('Manager')?.value,
        grade: this.TransferForm.get('grade')?.value,
        effectiveDate : this.TransferForm.get('effdate')?.value,
        accommodation : this.TransferForm.get('Accommodation')?.value ?? false,
        transportation: this.TransferForm.get('Transportation')?.value ?? false,
        overtimeEligibility : this.TransferForm.get('OvertimeEligible')?.value ?? false,
        medicalInsurance : this.TransferForm.get('MedicalInsurance')?.value ?? false,
        lifeInsurance : this.TransferForm.get('LifeInsurance')?.value ?? false,
        familyInsurance : this.TransferForm.get('FamilyInsurance')?.value ?? false,
        familyAirticket : this.TransferForm.get('FamilyAirticket')?.value ?? false,
        familyVisa : this.TransferForm.get('FamilyVisa')?.value ?? false,
        shiftId : this.TransferForm.get('shift')?.value,
        workingDays: this.TransferForm.get('work_schedule')?.value,
        airticketEligibility : this.TransferForm.get('AirTicketEligibility')?.value,
        probationPeriod : this.TransferForm.get('ProbationPeriod')?.value,
        noticePeriod : this.TransferForm.get('NoticePeriod')?.value,
        ncClause : this.TransferForm.get('Non_CompeteClause')?.value ?? false,
        enterBy  : this.empcode,
        allowanceArray: {
          tableRows: this.SalaryForm.value.tableRows.map((row: any) => ({
              allowanceId: row.allowanceId,
              amount: row.amount,
          }))
      }
      };

      this.apicall.Add_EmpTransferPromotion_Details(data).subscribe(res=>{
        if(res.Errorid==1)
          {
            this.showModal = 1; 
            this.success = "Completed Successfully";   
          }
          else if(res.Errorid==2)
          {
            this.showModal = 2;
            this.failed = "Transfer or promotion has already been initiated for this employee on the mentioned date."; 
          }
          else{          
            this.showModal = 2;
            this.failed = "Failed!";      
          }
        this.TransferForm.reset(); 
     })
   } else {    
     this.markFormGroupTouched(this.TransferForm);   
     this.markFormGroupTouched(this.SalaryForm);
   }
  }
  
  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      } else if (control instanceof FormArray) {
        control.controls.forEach(c => this.markFormGroupTouched(c as FormGroup));
      } else {
        control.markAsTouched();
      }
    });
  }

  FetchActionHistory()
  {
    this.apicall.EmpTransferPromotion_ActionHistory(this.empcode,this.teamCompany,this.teamDesignation,this.teamyear).subscribe(res =>{
      this.Historydata=res;
    })
  }

  Activedescription(id:any,name:any)
  {
    this.Ename = name;
    this.apicall.EmpTransferPromotion_Details(id).subscribe(res =>{
      this.descdata=res;
    })
    this.apicall.EmpTransferPromotion_SalDetails(id).subscribe(res =>{
      this.salarydata=res;
      this.grosstotal = this.salarydata[0].GROSS_SALARY;
    })
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
const totalResults = this.Historydata.filter((employee: any) => {
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

const filteredData = this.Historydata.filter((employee: any) =>
  Object.values(employee).some((value: any) =>
    typeof value === 'string' &&
    value.toLowerCase().startsWith(this.searchInput.toLowerCase())
  )
);

const start = (this.currentPage - 1) * this.itemsPerPage + 1;
return Math.min(start, filteredData.length);
}


getEntriesEnd(): number {  
const filteredData = this.Historydata.filter((employee: any) =>
  Object.values(employee).some((value: any) =>
    typeof value === 'string' &&
    value.toLowerCase().startsWith(this.searchInput.toLowerCase())
  )
);
const end = this.currentPage * this.itemsPerPage;
return Math.min(end, filteredData.length);
}

}
