import { Component, OnInit } from '@angular/core';
import { ApiCallService } from 'src/app/api-call.service';
import { DatePipe } from '@angular/common';
import { LoginService } from 'src/app/login.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { FormControl,FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-emp-skill-matrix',
  templateUrl: './emp-skill-matrix.component.html',
  styleUrls: ['./emp-skill-matrix.component.scss']
})
export class EmpSkillMatrixComponent implements OnInit {

 
  userSession:any = this.session.getUserSession();
  empcode: any=this.userSession.empcode;
  level: any=this.userSession.level;
  authorityflg:any =this.userSession.authorityflg;

  listCompany: any;
  comcode:any = -1;
  employee:any = -1;
  year:any;
  listemployees:any
  yearlist: any;
  listDepartment: any;
  company: any;
  companyid: any = -1;
  listDesignation: any;
  HODrequestForm : FormGroup;
  desigid=2;

  dropdownSettings:IDropdownSettings={};

  constructor(private apicall:ApiCallService,private datePipe:DatePipe,private session:LoginService,private fb: FormBuilder) { 

    this.dropdownSettings = {
      idField: 'KEY_ID',
      textField: 'DATA_VALUE',
      itemsShowLimit: 3,
      limitSelection: -1,
      allowSearchFilter: true,
      clearSearchFilter: true,
    };


    this.HODrequestForm = this.fb.group({
      hemployee: [null] // Initialize your form control here
    });


  }

  ngOnInit(): void {
    this.apicall.FetchCompanyList(this.empcode).subscribe((res)=>{
      this.listCompany=res;
    })
    this.EmployeeListFn();
    // this.apicall.Generate_Trainingmatrix(this.employee,this.empcode,this.comcode,0).subscribe(res =>{
    //   this.download_to_excel(res.Errormsg)
    // })

    this.apicall.listDesignation(this.desigid).subscribe((res)=>{
      this.listDesignation=res;
        })

    this.listYear();
    this.fetchDepartmentlist();


    

  }

  fetchDepartmentlist()
  {
    this.apicall.FetchDepartmentList(this.companyid,this.empcode).subscribe(res =>{
      this.listDepartment=res;
    })
  }

  DepartmentListFn(company_code:any): void {
    this.company = company_code;
    this.apicall.FetchDepartmentList(this.company,this.empcode).subscribe(res =>{
         this.listDepartment=res;
    })
  }

  EmployeeDesignation(departmnt:any): void {
  {
    this.apicall.DesignationCombo_Company_Dept_Wise(departmnt,this.empcode).subscribe(res =>{
      this.listDesignation=res;
    })
  }

  }
 
  EmployeeListFn(): void {
    this.apicall.FetchEmployeeList(-1,this.comcode,this.empcode).subscribe(res =>{
      this.listemployees=res;
    })
  }

  viewReport()
  {

    const comcode = (<HTMLInputElement>document.getElementById("comcode")).value;
    const department = (<HTMLInputElement>document.getElementById("depatment")).value;
    //const desination = (<HTMLInputElement>document.getElementById("desination")).value;
    const employee = (<HTMLInputElement>document.getElementById("employee")).value;
    const year = (<HTMLInputElement>document.getElementById("year")).value;

    const emplist = this.HODrequestForm.get('hemployee')?.value
        const empname = emplist.map((item: {
          KEY_ID: any; id: any; 
          }) => item.KEY_ID).join(',');

    //     alert(empname)

    const designationElements = document.getElementsByName("designation");

    if (designationElements.length > 0) {
      const designationElement = <HTMLInputElement>designationElements[0];
      try {
        const designation = JSON.parse(designationElement.value);
        if (Array.isArray(designation)) {
          const empname = designation.map((item: { KEY_ID: any; id: any; }) => item.KEY_ID).join(',');
          alert(empname);
        }
      } catch (e) {
        console.error("Failed to parse designation value", e);
      }
    }

    this.apicall.Generate_skillmatrix(department,empname,year,employee,this.empcode,comcode).subscribe(res =>{
      this.download_to_excel(res.Errormsg)
    })

  }

  download_to_excel(filename:any)
  { 
    let fileurl=`${this.apicall.dotnetapi}/File/GetExcelFeedbackEffectivenessData/${filename}`;
    let link = document.createElement("a");
      
    if (link.download !== undefined) {       
      link.setAttribute("href", fileurl);
      link.setAttribute("download", "");
      document.body.appendChild(link);

      link.click();
      document.body.removeChild(link)
      }
  }

  listYear()
  {
    this.apicall.listYear().subscribe((res)=>{
    this.yearlist=res;
      })
  }

}
