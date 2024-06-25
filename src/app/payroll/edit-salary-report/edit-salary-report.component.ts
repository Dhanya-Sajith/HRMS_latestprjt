  import { Component, OnInit } from '@angular/core';
  import { ApiCallService } from 'src/app/api-call.service';
  import { LoginService } from 'src/app/login.service';
  import { DatePipe } from '@angular/common';
  
  @Component({
    selector: 'app-edit-salary-report',
    templateUrl: './edit-salary-report.component.html',
    styleUrls: ['./edit-salary-report.component.scss']
  })
  export class EditSalaryReportComponent implements OnInit {
  
    userSession:any = this.session.getUserSession();
    authorityflg:any =this.userSession.authorityflg;
    empcode: any=this.userSession.empcode;
    empid:any =this.userSession.id;
    level: any=this.userSession.level;
    company: any=this.userSession.companycode;
    desig:any=this.userSession.desig.split('#', 1);
    desigID:any= this.desig[1]; 
    grpname:any=this.userSession.grpname;
  
    showModal:any
    success:any
    failed:any
    department: any = -1;
    companyId: any = -1;
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
  
    constructor(private session:LoginService,private apicall:ApiCallService,private datePipe: DatePipe) { }
  
    ngOnInit(): void {
      this.currentPage = 1; 
      //Employee combo box
      this.apicall.EmployeefilterComboData_Payroll(this.CompnyidStored,this.empcode,this.grpname,this.desig).subscribe(res =>{
        this.empdata=res;  
      });
      this.FetchSalaryReport();
    }
  
    onEmpSelected(selectedemp:any){ 
      this.emp_code = selectedemp;    
      this.FetchSalaryReport()  
     }
  
     FetchSalaryReport(){
      this.apicall.FetchSalaryReport(this.CompnyidStored,this.MonthstoredValue,this.emp_code,this.grpname,this.desig).subscribe(res =>{
        this.salarylist=res;
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
  
    getEntriesStart(): number
    {
      if (this.currentPage === 1) {
          return 1;
      }
      return (this.currentPage - 1) * this.itemsPerPage + 1;
    }
  
    getEntriesEnd(): number
    {  
        const end = this.currentPage * this.itemsPerPage;
        return end < this.salarylist.length ? end : this.salarylist.length;
    }
  
    Add_Addition(item:any)
    {
      if (item.NET_TOTAL == undefined){
        item.NET_TOTAL = item.NET_AMOUNT
      } 
      if (item.NEW_ADDITION == undefined){
        item.NEW_ADDITION = 0;
      } 
      if (item.NEW_DEDUCTION == undefined){
        item.NEW_DEDUCTION = 0;
      }
      const total = (item.NET_AMOUNT + item.NEW_ADDITION) - item.NEW_DEDUCTION;
      item.NET_TOTAL = total;
    }
  
    Add_Deduction(item:any)
    {
      if (item.NET_TOTAL == undefined){
        item.NET_TOTAL = item.NET_AMOUNT
      } 
      if (item.NEW_ADDITION == undefined){
        item.NEW_ADDITION = 0;
      } 
      if (item.NEW_DEDUCTION == undefined){
        item.NEW_DEDUCTION = 0;
      } 
      const total = (item.NET_AMOUNT + item.NEW_ADDITION) - item.NEW_DEDUCTION;
      item.NET_TOTAL = total;
    }
  
    SaveSalary(item:any)
    {
      if(item.NEW_ADDITION == undefined && item.NEW_DEDUCTION == undefined){
        this.showModal = 2;
        this.failed = "Please, Fill the fields";
      }else{
  
          if (item.COMMENTS == undefined){
            item.COMMENTS = '';
          }
          const data = {
            payrolid:item.PAYROLL_ID,
            empcode:item.EMP_CODE,
            ac_addition:item.NEW_ADDITION,
            ac_deduction:item.NEW_DEDUCTION,
            comments:item.COMMENTS,
            net_ammount:item.NET_TOTAL,  
            user:this.empcode,
            company:this.company,
            payroll_month:this.MonthstoredValue
          };
          this.apicall.UpdateSalaryReport(data).subscribe(res =>{
            if(res.Errorid==1){
              this.showModal = 1;         
              this.success = "Save Successfully";  
              item.NEW_ADDITION = 0;
              item.NEW_DEDUCTION = 0;
              item.COMMENTS = '';
              item.NET_TOTAL = '';
              this.FetchSalaryReport()
            }
            else{
              this.showModal = 2;
              this.failed = "Failed";
            } 
          })
          this.FetchSalaryReport()  
        }
    }
  
    DetailData(EMP_CODE:any,PROCESS_DATE:any,operation:any){
      const month  = this.datePipe.transform(PROCESS_DATE,'MM','en');
      this.apicall.FetchSalarySpiltUp_EditReport(operation,month,EMP_CODE).subscribe(res=>{
        this.Otherdtl = res;
      })
    }
  
  }
