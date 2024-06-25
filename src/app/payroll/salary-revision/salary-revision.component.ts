import { Component, OnInit } from '@angular/core';
import { ApiCallService } from 'src/app/api-call.service';
import { FormGroup , FormBuilder , FormControl , Validators } from '@angular/forms';
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
  mindate = this.datePipe.transform(this.nextfirstday,"yyyy-MM-dd");
  effectivedt = this.datePipe.transform(this.nextfirstday,"yyyy-MM-dd");
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
  listsalarycomp: any;
  salcompid=44;
  listsalarydtls: any;
  itemData: any;
  newgross: any;
  rows: any[] = [];
  validation!: string;
  fileuploadForm: any =  FormGroup;
  isFormValid: boolean=false;
  submitted = false;
  inputfield: any;
  
  constructor(private apicall:ApiCallService, private datePipe: DatePipe,private fb:FormBuilder,private session:LoginService,private route:Router) {
    this.EditForm = this.fb.group({
      salcomponent: ['', Validators.required],
      // salaryamnt: ['', Validators.required],      
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

    this.apicall.listEmployee(this.departmentid,this.companyid).subscribe(res =>{
      this.listEmployee=res;
    })

    this.apicall.listsalarycomp(this.salcompid).subscribe((res)=>{
      this.listsalarycomp=res;
      })   

    this.fileuploadForm = this.fb.group({     
      myFile: ['', [Validators.required]],  
    });
  }

  radioselection(user:any){
    this.user=user;
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
     
    if (input.files && input.files[0]) {
      const fdata = new FormData();
      fdata.append('postedFile',input.files[0]);
      alert(fdata) 
      // this.showProgressBar = true;
      this.apicall.SalaryRevisionBulkUpload(fdata,this.empcode).subscribe((res)=>{
        alert(JSON.stringify(res))
        if(res>=0)
        {
      
          this.showModal = 1; 
          this.success = "Excel uploaded successfully";
          this.inputfield = document.getElementById("myFile");
          this.inputfield.selectedIndex = 0;
          (<HTMLInputElement>document.getElementById("myFile")).value = '';
        }
        else{          
          this.showModal = 2;
          this.failed = "Uploading failed!";      

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
    this.apicall.listAllowance(this.emp_code).subscribe(res =>{
      this.Allowance=res;
      for(let i=0;i<this.Allowance.length;i++){
        this.amount = this.Allowance[i].AMOUNT;
        this.grosssalary = this.grosssalary + this.amount;
      }
    })
  }

  percentagecalc(item:any,rowno:any){
    this.itemData = item;
    this.oldsalary = this.itemData.AMOUNT;
    this.newsalary =  this.itemData.newsalary;
    if( this.newsalary == ""){
      (<HTMLInputElement>document.getElementById("diffsalary"+rowno)).value =  "";
      (<HTMLInputElement>document.getElementById("percent"+rowno)).value = "";
    }else{
      this.diffsalary = this.newsalary - this.oldsalary;
      this.percent = ((this.diffsalary / this.oldsalary)*100).toFixed(2);
      (<HTMLInputElement>document.getElementById("diffsalary"+rowno)).value =  this.diffsalary;
      (<HTMLInputElement>document.getElementById("percent"+rowno)).value = this.percent;
    }
    const itemData: any[] = [];
    this.Allowance.forEach((data:any) => { 
        if(data.newsalary !== undefined){
          const salary = data.newsalary           
          itemData.push(salary);
        }
    });
    this.newgross = itemData.reduce((acc, cur) => acc +  Number(cur), 0);
  }

  validateEditForm() {      
    if (this.EditForm.valid){
    this.isValid = true;
    }
    else{
      this.markFormGroupTouched(this.EditForm);   
    }
  }

  addsalarydtl(){   
    if(this.emp_code == undefined){
      this.showModal = 2;
      this.failed = "Please, select the Employee.";
    }else{
      if (this.EditForm.valid) {
        const component = this.EditForm.get('salcomponent')?.value;      
        // const amount = this.EditForm.get('salaryamnt')?.value;     

        const newData = {
          emp_code: this.emp_code,
          allow_id: component,
          updated_by: this.empcode,
          mflag: 1,
          effective_date: this.effectivedt,
          gross_salary: 0,
        };
        this.apicall.AddnewAllowance(newData).subscribe((res)=>{
        this.listsalarydtls=res;
        if(res.Errorid==1)
        {
          this.showModal = 1;
          this.success = "Added Successfully...";
          this.EditForm.reset();
          this.FetchAllowanceDtl(this.emp_code);
        }
        else
          {
            this.showModal = 2;
            this.failed = "Failed";
          }
        })
      } else {    
        this.markFormGroupTouched(this.EditForm);   
      }
    }
    this.newgross = 0;
  }

  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
    });
  }

  clearEdit(){
    this.EditForm.reset(); 
  }

  SaveSalaryRevision(){
    const basic= (<HTMLInputElement>document.getElementById("newsalary1")).value;
    if(this.emp_code == undefined){
      this.showModal = 2;
      this.failed = "Please, select the Employee.";
    }else if(basic == ""){
      this.showModal = 2;
      this.failed = "Please, select the basic salary.";
    }else{
      interface detaildata {
        ALLOWANCE_ID: string;
        newsalary: string;
      }
      const SalaryData: any[] = [];
      this.Allowance.forEach((data:detaildata) => { 
        if(!data.hasOwnProperty('newsalary')  ){
          data.newsalary = '0';
        }
          const newdetails = {
            allowanceid: data.ALLOWANCE_ID,
            new_amount: data.newsalary
          };
          SalaryData.push(newdetails);
      });

      const Data = {
        emp_code: this.emp_code,
        effective_date: this.effectivedt,
        gross_salary: this.newgross,  
        updated_by: this.empcode,
        AllowanceDetails: SalaryData
      };
      this.apicall.SaveSalaryRevision(Data).subscribe((res) => {
        if(res.Errorid==1){
                this.showModal = 1;
                this.success='Salary Revision Saved Succesfully!'; 
                this.FetchAllowanceDtl(this.emp_code);    
                this.newgross = 0; 
              }else{
                  this.showModal = 2; 
                  this.failed='Failed!';   
              }              
      });
    }
  }

  cancel(){
    (<HTMLInputElement>document.getElementById("emp_code")).value = '-1';
    (<HTMLInputElement>document.getElementById("company")).value = '-1';
    (<HTMLInputElement>document.getElementById("department")).value = '-1';
    this.FetchAllowanceDtl(-1);
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

}
