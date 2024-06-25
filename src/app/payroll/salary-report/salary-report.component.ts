  import { Component, OnInit } from '@angular/core';
  import { ApiCallService } from 'src/app/api-call.service';
  import { LoginService } from 'src/app/login.service';
  import { DatePipe} from '@angular/common';
  
  @Component({
    selector: 'app-salary-report',
    templateUrl: './salary-report.component.html',
    styleUrls: ['./salary-report.component.scss']
  })
  export class SalaryReportComponent implements OnInit {
  
    userSession:any = this.session.getUserSession();
    authorityflg:any =this.userSession.authorityflg;
    empcode: any=this.userSession.empcode;
    empid:any =this.userSession.id;
    level: any=this.userSession.level;
    desig:any=this.userSession.desig.split('#', 1);
    desigID:any= this.desig[1]; 
    grpname:any=this.userSession.grpname;
  
    showModal:any
    success:any
    failed:any
    department: any = -1;
    company: any = -1;
    empdata: any;
    Activecompany: any;
    month: any;
    salarylist: any;
    currentPage:any;
    searchInput: string='';
    itemsPerPage=10;
    emp_code: any=-1;
    Otherdtl: any;
    CompanystoredValue = localStorage.getItem('CompanyName');
    MonthstoredValue = localStorage.getItem('Month');
    CompnyidStored = localStorage.getItem('CompanyID')
    // searchInput:any
  
    constructor(private session:LoginService,private apicall:ApiCallService,private datePipe: DatePipe) { }
  
    ngOnInit(): void {
      // alert(this.MonthstoredValue)
      // alert(this.CompnyidStored)
      this.currentPage = 1; 
      //Employee combo box
      this.apicall.EmployeefilterComboData_Payroll(this.CompnyidStored,this.empcode,this.grpname,this.desig).subscribe(res =>{
        this.empdata=res;  
      });
      this.FetchSalaryReport();
    }
  
    onEmpSelected(selectedemp:any){ 
      this.emp_code = selectedemp;
      this.FetchSalaryReport();     
     }
  
     FetchSalaryReport(){
      this.apicall.FetchSalaryReport(this.CompnyidStored,this.MonthstoredValue,this.emp_code,this.grpname,this.desig).subscribe(res =>{
        this.salarylist=res;   
      });
     }
  
     download_to_excel()
    { 
     let Excelname:any;
     this.apicall.ExportToExcel(this.salarylist).subscribe((res)=>{
      Excelname=res.Errormsg;
      let fileurl=this.apicall.GetExcelFile(Excelname);
      let link = document.createElement("a");
        
          if (link.download !== undefined) {
            link.setAttribute("href", fileurl);
            link.setAttribute("download", "ReportFile.xlsx");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }
      });
    }
  
     // Function to Calculate the total number of search results
    get totalSearchResults(): number {
      return this.salarylist.filter((employee: { EMP_NAME: string | any[]; }) => {   
        return employee.EMP_NAME.includes(this.searchInput);
      }).length;
    }
  
    // Function to change the current page
    changePage(page: number): void {    
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
      return (this.currentPage - 1) * this.itemsPerPage + 1;
    }
  
    getEntriesEnd(): number {  
        const end = this.currentPage * this.itemsPerPage;
        return end < this.salarylist.length ? end : this.salarylist.length;
    }
  
    DetailData(EMP_CODE:any,PROCESS_DATE:any,operation:any){
      const month  = this.datePipe.transform(PROCESS_DATE,'MM','en');
      this.apicall.FetchSalarySpiltUp(operation,month,EMP_CODE).subscribe(res=>{
        this.Otherdtl = res;
      })
    }
  
  }
  