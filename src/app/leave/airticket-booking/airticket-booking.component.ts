import { Component, OnInit } from '@angular/core';
import { ApiCallService } from 'src/app/api-call.service';
import { FormGroup , FormBuilder , FormControl , Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { LoginService } from 'src/app/login.service';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-airticket-booking',
  templateUrl: './airticket-booking.component.html',
  styleUrls: ['./airticket-booking.component.scss']
})
export class AirticketApproveComponent implements OnInit {

  userSession:any = this.session.getUserSession();
  empcode: any=this.userSession.empcode;
  empId: any=this.userSession.id;
  level:any =this.userSession.level;
  authorityflg:any =this.userSession.authorityflg;
  
  typeid: any = 12;
  listCompany: any;
  listDepartment: any;
  companyid: any = -1;
  departmentid: any = -1;
  listEmployee: any;
  emp_code: any = -1;
  fromdate: any;
  todate: any;
  showModal = 0;
  success:any="";
  failed:any="";
  EditForm: FormGroup; 
  isValid: boolean=false;
  currentPage=1;
  currentPagePersonal=1;
  searchInput: string='';
  itemsPerPage=10;
  listairtickets: any;
  activereqid: any;
  inputfield: any;
  status: any=-1;
  costControl: FormControl<any>;
  DocControl: FormControl<any>;
  leavesummary: any;
  leave_emp: any = -1;
  listdates: any;
  fmdt: any;
  todt: any;
  sdate = new FormControl();
  edate = new FormControl();  
  desiredPage: any; 
  Activereqid: any;
  passengerslist: any;
  activeflag: any;

  constructor(private apicall:ApiCallService, private datePipe: DatePipe,private fb:FormBuilder,private session:LoginService) {
    this.EditForm = this.fb.group({
      cost: ['', Validators.required],
      AirticketDocControl: ['', Validators.required],
    });

    this.costControl = this.EditForm.get('cost') as FormControl;
    this.DocControl = this.EditForm.get('AirticketDocControl') as FormControl;
   }

  ngOnInit(): void {
    
    this.apicall.FetchCompanyList(this.empcode).subscribe((res)=>{
      this.listCompany=res;
    })

    this.apicall.FetchDepartmentList(this.companyid,this.empcode).subscribe(res =>{
      this.listDepartment=res;
    })

    this.apicall.FetchEmployeeList(this.departmentid,this.companyid,this.empcode).subscribe(res =>{
      this.listEmployee=res;
    })
    this.FetchDates();
    this.FetchAirtickets();
  }

    // Department List
    DepartmentListFn(company_code:any): void {
      this.companyid = company_code;
      this.apicall.FetchDepartmentList(this.companyid,this.empcode).subscribe(res =>{
        this.listDepartment=res;
      })
      this.FetchdataFilter();
  }

  // Employee List
  EmployeeListFn(department_code:any,company_code:any): void {
      this.departmentid = department_code;
      this.apicall.FetchEmployeeList(this.departmentid,company_code,this.empcode).subscribe(res =>{
        this.listEmployee=res;
      })
      this.FetchdataFilter();
  }

  // Change the Employee Selection
  OnChangeEmployee(empcode:any){
    this.emp_code = empcode;
    this.FetchdataFilter();
  }

  // change the status
  OnChangeStatus(status:any){
    this.status = status;
    this.FetchdataFilter();
  }

  FetchdataFilter(){

    const data = {
      company:this.companyid,
      department:this.departmentid, 
      emp_code:this.emp_code,
      status: this.status,
      authority:this.empcode
    };
    this.apicall.FetchAirtickets_Filter(data).subscribe(res=>{
      this.listairtickets=res;
      const maxPageFiltered = Math.ceil(this.listairtickets.length / this.itemsPerPage);  

      if (this.currentPage > maxPageFiltered) {
        this.currentPage = 1;     
      }   
     
    }) 
  }

  FetchAirtickets(){
    this.apicall.FetchAirtickets(this.empcode).subscribe(res =>{
      this.listairtickets=res;
    })
  }

  ActivereqID(reqid:any,flag:any){
    this.activereqid = reqid;
    this.activeflag = flag;
  }

  Editempcode(emp_code:any,req_id:any,document:any,cost:any,flag:any){
    this.emp_code = emp_code;
    this.activereqid = req_id;
    this.activeflag = flag;
    this.costControl.setValue(cost);
    this.DocControl.setValue(document);
    // this.EditForm.controls['AirticketDocControl'].setValue(document);
    // this.EditForm.controls['cost'].setValue(cost);
  }

  validateEditForm() {      
    if (this.EditForm.valid){
    this.isValid = true;
    }
    else{
      this.markFormGroupTouched(this.EditForm);   
    }
  }

  uploaddocument(){   
    if (this.EditForm.valid) {
       const docname = this.EditForm.get('AirticketDocControl')?.value; 
       const cost = this.EditForm.get('cost')?.value; 
       const data = {
        reqId : this.activereqid,
        empcode : this.emp_code,
        verified_by : this.empcode,
        cost: cost,
        upfile : docname,
        mflag:this.activeflag
       };
       this.apicall.UploadAirticket(data).subscribe(res=>{
       if(res.Errorid = 1)
        {
          const input=document.getElementById("AirticketDocControl");    
          const fdata = new FormData();   
          this.onFileSelect(input);
          this.FetchAirtickets();
        }
      })
    } else {    
      this.markFormGroupTouched(this.EditForm);   
    }
  }

  onFileSelect(input:any)
  {   
    if (input.files && input.files[0]) {
      const fdata = new FormData();
      fdata.append('filesup',input.files[0]);
      this.apicall.AirTicketDocUpload(fdata,this.activereqid,this.activeflag).subscribe((res)=>{
        if(res>=0)
        {
        
          this.showModal = 1; 
          this.success = "Uploading Successfully";       
          this.inputfield = document.getElementById("AirticketDocControl");
          this.inputfield.selectedIndex = 0;
        }
        else{          
          this.showModal = 2;
          this.failed = "Uploading failed!";      
        }
        this.EditForm.reset(); 
      })
    }
  }

  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
    });
  }

  clearEdit(){
    this.EditForm.reset(); 
  }

  download_documents(){
    let fileurl=this.apicall.ViewAirticket(this.activereqid,this.activeflag);
    let link = document.createElement("a");
      
       if (link.download !== undefined) {
          link.setAttribute("href", fileurl);
          // link.setAttribute('target', '_blank');
          // link.target = '_blank';
          link.setAttribute('target', '_blank');
          link.setAttribute("download", "ReportFile.xlsx");
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
       }
 }

  
  FetchDates()
  {   
    this.apicall.listFromToDates().subscribe(res=>{
      this.listdates = res;
      if(this.listdates.length > 0)
      {
        const listdatesdata = this.listdates[0];
        this.fmdt =formatDate(listdatesdata.FROM_DATE,'yyyy-MM-dd','en');
        this.todt = formatDate(listdatesdata.TO_DATE,'yyyy-MM-dd','en');       
        this.sdate.setValue(formatDate(listdatesdata.FROM_DATE,'yyyy-MM-dd','en'));
        this.edate.setValue(formatDate(listdatesdata.TO_DATE,'yyyy-MM-dd','en'));
      };
    })
  }

  FetchLeaveDetails()
  {
    this.apicall.FetchLeaveDetails(this.sdate.value,this.edate.value,this.empcode,this.leave_emp).subscribe(res=>{
      this.leavesummary = res;
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
  const totalResults = this.listairtickets.filter((employee: any) => {
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
  
  const filteredData = this.listairtickets.filter((employee: any) =>
    Object.values(employee).some((value: any) =>
      typeof value === 'string' &&
      value.toLowerCase().startsWith(this.searchInput.toLowerCase())
    )
  );

  const start = (this.currentPage - 1) * this.itemsPerPage + 1;
  return Math.min(start, filteredData.length);
}


getEntriesEnd(): number {  
  const filteredData = this.listairtickets.filter((employee: any) =>
    Object.values(employee).some((value: any) =>
      typeof value === 'string' &&
      value.toLowerCase().startsWith(this.searchInput.toLowerCase())
    )
  );
  const end = this.currentPage * this.itemsPerPage;
  return Math.min(end, filteredData.length);
}

passengerdetails(reqid:any,empcode:any,flag:any)
{
  this.Activereqid = reqid;
  this.apicall.ViewFamilyAirTicketDetails(reqid,empcode).subscribe(res => {
    this.passengerslist = res;
  })
}

}
