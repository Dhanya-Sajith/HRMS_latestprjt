import { Component, OnInit } from '@angular/core';
import { ApiCallService } from 'src/app/api-call.service';
import { DatePipe } from '@angular/common';
import { LoginService } from 'src/app/login.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-biometric-data',
  templateUrl: './biometric-data.component.html',
  styleUrls: ['./biometric-data.component.scss']
})
export class BiometricDataComponent implements OnInit {

  userSession:any = this.session.getUserSession();
  empcode: any=this.userSession.empcode;
  level: any=this.userSession.level;
  authorityflg:any =this.userSession.authorityflg;
  
  comtypeid=12;
  listCompany: any;
  currentDate = new Date();
  biometricdata: any; 
  totaldata: any;
  totalPages: any;
  listDepartment: any;
  listEmployee: any;
  companyid: any = -1;
  departmentid: any = -1;
  employeeid: any = -1;
  company: any;
  department: any;
  showModal: any;
  failed: any;
  currentPagePersonal: any;
  searchInput: string = '';
  processdates:any;
  success:any="";
  itemsPerPage=10;
  currentPage=1;
  desiredPage: any; 
  


  
  constructor(private apicall:ApiCallService,private datePipe: DatePipe,private session:LoginService,private route:Router) { }

  ngOnInit(): void {
//alert('fg')
    this.currentPage = 1; 
    this.currentPagePersonal =1;
    const NewcurrDate=this.datePipe.transform(this.currentDate,"yyyy-MM-dd");
   //// alert(NewcurrDate)
   // alert(this.empcode)
    this.apicall.FetchPunchingDetailsofEmployee(NewcurrDate,NewcurrDate,this.empcode).subscribe((res)=>{
      this.biometricdata=res;
     // alert(JSON.stringify(this.biometricdata))      
    })

    this.apicall.FetchCompanyList(this.empcode).subscribe((res)=>{
      this.listCompany=res;
     // alert(JSON.stringify(this.listCompany))
    })

    this.apicall.FetchDepartmentList(this.companyid,this.empcode).subscribe(res =>{
      this.listDepartment=res;
    })

    this.apicall.FetchEmployeeList(this.departmentid,this.companyid,this.empcode).subscribe(res =>{
      this.listEmployee=res;
    })
    this.apicall.attendanceprocessdateApi().subscribe(res =>{
     // alert(res[0].FROM_DATE);
      this.processdates=res;
    })
  }

  DepartmentListFn(company_code:any): void {
    this.company = company_code;
    this.apicall.FetchDepartmentList(this.company,this.empcode).subscribe(res =>{
         this.listDepartment=res;
    })
    this.viewbiometricdata_filter();
}

// Employee List
EmployeeListFn(department_code:any,company_code:any): void {
    this.department = department_code;
    this.apicall.FetchEmployeeList(this.department,company_code,this.empcode).subscribe(res =>{
    this.listEmployee=res;
    })
    this.viewbiometricdata_filter();
}

  viewbiometricdata_filter(){
    const comname= (<HTMLInputElement>document.getElementById("company")).value;
    const depname= (<HTMLInputElement>document.getElementById("department")).value;
    const empname= (<HTMLInputElement>document.getElementById("emp_code")).value;
    const fromdt= (<HTMLInputElement>document.getElementById("fromdt")).value;
    const todt= (<HTMLInputElement>document.getElementById("todt")).value;

    if( fromdt > todt){
      // (<HTMLInputElement>document.getElementById("openModalButton")).click();
      // this.showModal = 2;
      // this.failed = "Please Correct the Dates";
      alert("Please Correct the Dates")
    }else{
      const filterdata = {
        fromdate:fromdt,
        todate:todt,
        company:comname,
        department:depname, 
        emp_code:empname,
        user:this.empcode 
      };
      this.apicall.FetchPunchingDetailsofEmployee_filter(filterdata).subscribe(res=>{
        this.biometricdata = res;
        const maxPageFiltered = Math.ceil(this.biometricdata.length / this.itemsPerPage);  

        if (this.currentPage > maxPageFiltered) {
          this.currentPage = 1;     
        }   
       
      })
    }
  }

 
  viewReport(){
    this.viewbiometricdata_filter();
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
  const totalResults = this.biometricdata.filter((employee: any) => {
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
  
  const filteredData = this.biometricdata.filter((employee: any) =>
    Object.values(employee).some((value: any) =>
      typeof value === 'string' &&
      value.toLowerCase().startsWith(this.searchInput.toLowerCase())
    )
  );

  const start = (this.currentPage - 1) * this.itemsPerPage + 1;
  return Math.min(start, filteredData.length);
}


getEntriesEnd(): number {  
  const filteredData = this.biometricdata.filter((employee: any) =>
    Object.values(employee).some((value: any) =>
      typeof value === 'string' &&
      value.toLowerCase().startsWith(this.searchInput.toLowerCase())
    )
  );
  const end = this.currentPage * this.itemsPerPage;
  return Math.min(end, filteredData.length);
}
}
