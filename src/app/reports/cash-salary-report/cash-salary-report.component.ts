import { Component, OnInit } from '@angular/core';
import { ApiCallService } from 'src/app/api-call.service';
import { DatePipe } from '@angular/common';
import { LoginService } from 'src/app/login.service';
import * as XLSX from 'xlsx'; 

@Component({
  selector: 'app-cash-salary-report',
  templateUrl: './cash-salary-report.component.html',
  styleUrls: ['./cash-salary-report.component.scss']
})
export class CashSalaryReportComponent implements OnInit {

  userSession:any = this.session.getUserSession();
  empcode: any=this.userSession.empcode;
  level: any=this.userSession.level;
  authorityflg:any =this.userSession.authorityflg;
 
    yesterday: any;
    currentmonth: any;
    currentyear: any;
    monthdays: any;  
    currentDate = new Date();
    listCompany:any;
    comtypeid=12;
    listYear:any;
    listMonth:any;
    year:any;
    reportdata: any;
    currentPage: any=1; 
    searchInput: string='';
    itemsPerPage=10;
    grosssalary: any = 0;
    amount: any;
    rondedGrosssalary : any = 0;
    roundingDiff : any = 0;
    monthValue: any;
    monthDisplay : any;
    selctedMonth: any = -1;
    selctedYear: any = -1;
    companyValue: any;
    selctedCompany: any = -1;
    companyDisplay: any;
    YearDisplay :any;
    showColumn: boolean = false;
    fileName= 'CashSalaryReport_Excel.xlsx';

    constructor(private apicall:ApiCallService,private datePipe:DatePipe,private session:LoginService) { }
  
  
    ngOnInit(): void {
  
      this.currentmonth=this.datePipe.transform(new Date(), 'MM');
      this.currentyear=this.datePipe.transform(new Date(), 'Y');
  
      this.apicall.FetchCompanyList(this.empcode).subscribe((res)=>{
        this.listCompany=res;
      })
  
      this.apicall.listYear().subscribe((res)=>{
      this.listYear=res;
      })
      
    }
  
    listmonth()
    {
      this.year= this.selctedYear;
      this.apicall.listMonth(this.year).subscribe((res)=>{
      this.listMonth=res;
      })
    }
    
    exportexcel(): void 
    {
      /* table id is passed over here */   
      let element = document.getElementById('excel-table'); 
      const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(element);

      /* generate workbook and add the worksheet */
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

      /* save to file */
      XLSX.writeFile(wb, this.fileName);
      
    }

    viewReport(year:any)
    {
      if(this.selctedMonth == -1 || this.YearDisplay == -1 || this.selctedCompany == -1)
      {
        this.showColumn = false;
        this.reportdata=null;
        this.rondedGrosssalary = 0;
        this.roundingDiff = 0;
      }
      else {
      this.showColumn = true;
      this.monthValue = this.selctedMonth.VALUE_FIELD;
      this.monthDisplay = this.selctedMonth.DISPLAY_FIELD;
      this.companyValue = this.selctedCompany.KEY_ID
      this.companyDisplay = this.selctedCompany.DATA_VALUE;
      this.YearDisplay = year;   

      this.grosssalary = 0;
      this.roundingDiff = 0;
      
      this.apicall.CashSalaryReport(this.empcode,year,this.monthValue,this.companyValue).subscribe((res)=>{
        this.reportdata=res;
        //const MonthName = selectedMonth.DISPLAY_FIELD;
        for(let i=0;i<this.reportdata.length;i++){
          this.amount = this.reportdata[i].AMOUNT;
          this.grosssalary = this.grosssalary + this.amount;
        }
               
        this.rondedGrosssalary = Math.round(this.grosssalary);
        this.roundingDiff = (Math.abs(this.rondedGrosssalary - this.grosssalary)).toFixed(2);
        // this.selctedYear = -1;
        // this.selctedMonth= -1;
        // this.selctedCompany= -1;
          
        console.log(JSON.stringify(res)) 
      
      })  
      }
    } 


      
     // Function to Calculate the total number of search results
     get totalSearchResults(): number {
      return this.reportdata.filter((employee: { EMP_NAME: string | any[]; }) => {   
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
        return end < this.reportdata.length ? end : this.reportdata.length;
    }

  

}


