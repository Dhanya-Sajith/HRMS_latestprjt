import { Component, OnInit } from '@angular/core';
import { ApiCallService } from 'src/app/api-call.service';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/login.service';
import { JsonPipe, formatDate } from '@angular/common';
import { FormControl,FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { DatePipe } from '@angular/common';
import { GeneralService } from 'src/app/general.service';

@Component({
  selector: 'app-evaluation-by-hr',
  templateUrl: './evaluation-by-hr.component.html',
  styleUrls: ['./evaluation-by-hr.component.scss']
})
export class EvaluationByHRComponent implements OnInit {

  userSession:any = this.session.getUserSession();
  empcode: any=this.userSession.empcode;
  dropdownSettings:IDropdownSettings={};
  listaccesscompany: any;
  statustypeid=70;
  deptypeid=1;
  yearlist: any;
  liststatus: any;
  HRrequestForm : FormGroup;
  isFormValid:boolean=false;
  showModals: any;
  successs: any;
  faileds: any;
  department: any;
  listEmployee: any;
  listevaluationreq: any;
  reqstatus: any;
  year: any;
  company: any;
  searchInput: string = '';
  desiredPage: any;
  itemsPerPage=10;
  currentPage=1;
  showModal: any;
  failed: any;
  emplcode: any;
  reqID: any;

  constructor(private general:GeneralService,private datePipe: DatePipe,private session:LoginService,private apicall:ApiCallService,private router:Router,private fb: FormBuilder) { 

    this.dropdownSettings = {
      idField: 'EMP_CODE',
      textField: 'EMP_NAME',
      itemsShowLimit: 3,
      limitSelection: -1,
      allowSearchFilter: true,
      clearSearchFilter: true,
    };

    this.HRrequestForm = this.fb.group({
      comcompany: ['', Validators.required],
      comdepartment: ['', Validators.required],
      hemployee: ['', Validators.required],
      compurpose: ['', Validators.required],
      comtargetdate: ['', Validators.required]
    });


  }

  ngOnInit(): void {
    this.ListCompany();
    this.listYear();
    this.ListStatus();
    this.listdepartment();
    this.fetchevaluationdata();
  }


  ListCompany()
  {
    this.apicall.FetchCompanyList(this.empcode).subscribe((res)=>{
      this.listaccesscompany=res;
      })
  }

  listYear()
  {
    this.apicall.listYear().subscribe((res)=>{
    this.yearlist=res;
      })
  }

  ListStatus()
  {
    this.apicall.listStatus(this.statustypeid).subscribe((res)=>{
      this.liststatus=res;
      })
  }
  DepartmentList(companynm:any)
  {
    this.apicall.FetchDepartmentList(companynm,this.empcode).subscribe((res)=>{
      this.department=res;
      })
  }

  listdepartment()
  {
    this.apicall.listStatus(this.deptypeid).subscribe((res)=>{
      this.department=res;
      })
  }


  EmployeeList(companynm:any, departmentnm:any)
  {   

      this.apicall.FetchEmployeeList(departmentnm,companynm,this.empcode).subscribe(res => {
        this.listEmployee = res;
      })
   
  }
  HRvalidateForm()
    {
      if (this.HRrequestForm.valid){
          this.isFormValid = true;
        }
      else{
        this.markFormGroupTouched(this.HRrequestForm);
      }
    }

    markFormGroupTouched(formGroup: FormGroup) {
      Object.values(formGroup.controls).forEach(control => {
        control.markAsTouched();
      });
    }


    HRRequests()
    {
      if (this.HRrequestForm.valid) {
        const comcompany= this.HRrequestForm.get('comcompany');
        const comdepartment= this.HRrequestForm.get('comdepartment'); 
        const compurpose= this.HRrequestForm.get('compurpose');
        const comtargetdate= this.HRrequestForm.get('comtargetdate');
        const emplist = this.HRrequestForm.get('hemployee')?.value
        const empname = emplist.map((item: {
          EMP_CODE: any; id: any; 
          }) => item.EMP_CODE).join(',');

          const data = {
            employees : empname,
            company : comcompany?.value,
            dept : comdepartment?.value,
            purpose  : compurpose?.value,
            target_date  : comtargetdate?.value,
            updatedby : this.empcode,
            };

          console.log(JSON.stringify(data))

          this.apicall.SaveEvaluationRequest(data).subscribe(res =>{
            
            if(res.Errorid == 1)
            {
              (<HTMLInputElement>document.getElementById("openModalButtonForalertsuccess")).click();
              this.showModals = 1;
              this.successs = "Requested Successfully!";
              this.listevaluationreq();
              this.hClear();
            }
            else        
            {
              (<HTMLInputElement>document.getElementById("openModalButtonForalertsuccess")).click();
              this.showModals = 2;
              this.faileds = "Failed!";
              this.listevaluationreq();
              this.hClear();
            }   
          })
      }
      else{
        this.markFormGroupTouched(this.HRrequestForm); 
      }
    }


    
    fetchevaluationdata()
    {   
        this.reqstatus=0;
        this.year=-1;
        this.company=-1;
        this.apicall.fetchevaluationdata(this.empcode,this.reqstatus,this.year,this.company).subscribe(res => {
          this.listevaluationreq = res;
          // alert(JSON.stringify(res))
        })
    }

    fetchevaluationdatafilter()
    {   
        const reqstatus=(<HTMLInputElement>document.getElementById("trainingstatus")).value;
        const year=(<HTMLInputElement>document.getElementById("year")).value;
        const company=(<HTMLInputElement>document.getElementById("accesscompany")).value;

        this.apicall.fetchevaluationdata(this.empcode,reqstatus,year,company).subscribe(res => {
          this.listevaluationreq = res;
          //alert(JSON.stringify(res))
        })
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
      const maxPageNumbers = 5; 
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
    const totalResults = this.listevaluationreq.filter((employee: any) => {
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
    
    const filteredData = this.listevaluationreq.filter((employee: any) =>
      Object.values(employee).some((value: any) =>
        typeof value === 'string' &&
        value.toLowerCase().startsWith(this.searchInput.toLowerCase())
      )
    );
    
    const start = (this.currentPage - 1) * this.itemsPerPage + 1;
    return Math.min(start, filteredData.length);
    }
    
    
    getEntriesEnd(): number {  
    const filteredData = this.listevaluationreq.filter((employee: any) =>
      Object.values(employee).some((value: any) =>
        typeof value === 'string' &&
        value.toLowerCase().startsWith(this.searchInput.toLowerCase())
      )
    );
    const end = this.currentPage * this.itemsPerPage;
    return Math.min(end, filteredData.length);
    }
    
    hClear()
    {
      this.HRrequestForm.reset();
    }

    editData(Iempcode:any,reqid:any)
    {
         this.emplcode=Iempcode;
         this.reqID=reqid;
    }

    cofirmEdit(Iempcode:any,reqid:any)
    {

      this.apicall.cancelEvRquest(Iempcode,reqid).subscribe(res =>{
        if(res== 1)
        {
          (<HTMLInputElement>document.getElementById("openModalButtonForalertsuccess")).click();
          this.showModals = 1;
          this.successs = "Cancelled Successfully!";
          this.listevaluationreq();
        }
        else        
        {
          (<HTMLInputElement>document.getElementById("openModalButtonForalertsuccess")).click();
          this.showModals = 2;
          this.faileds = "Failed!";
          this.listevaluationreq();
        }   
      })
  

    }

    fetchfromlocalstorage(empname:any,purpose:any,designation:any,company:any,department:any,emp_code:any,reqId:any,desigId:any)
    {
      // localStorage.setItem('emplname', empname);
      // localStorage.setItem('purpose', purpose);
      // localStorage.setItem('designation', designation);
      // localStorage.setItem('company', company);
      // localStorage.setItem('department', department);
      // localStorage.setItem('department', department);
      // localStorage.setItem('department', department);

      const data={
        reqid:reqId,
        empcode:emp_code,
        empname:empname,
        desig:designation,
        desigid:desigId,
        company:company,
        department:department,
        Purpose:purpose
      }

      // alert(JSON.stringify(data))

      this.general.setEmpdetails_competency(data); 
      this.router.navigate(['/CompetencyAssessmentresultbyHR']);


    }
  

}
