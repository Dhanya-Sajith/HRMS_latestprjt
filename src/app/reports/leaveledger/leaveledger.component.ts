import { Component, OnInit } from '@angular/core';
import { ApiCallService } from 'src/app/api-call.service';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/login.service';
import { jsDocComment } from '@angular/compiler';
import * as XLSX from 'xlsx'; 
import { HttpClient, HttpHeaders } from '@angular/common/http';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-leaveledger',
  templateUrl: './leaveledger.component.html',
  styleUrls: ['./leaveledger.component.scss']
})
export class LeaveledgerComponent implements OnInit {

  userSession:any = this.session.getUserSession();
  empcode: any=this.userSession.empcode;
  level: any=this.userSession.level;
  authorityflg:any =this.userSession.authorityflg;
  
  listEmployees: any;
  listYear: any;
  listlvetype: any;
  OpeningLeavebalance: any;
  ListleaveReport: any;
  listvalues: any;
  upd_dt: any;
  leavereport: any;
  mapper: any[] = [];
  adding: any;
  totalleaves: any;
  totalslno: any;
  slno: any;
  remarks: any;
  lve_Add: any;
  lve_ded: any;
  deduction: any;
  LeaveAddition: any;
  LeaveDeduction: any;
  Closingbalance: any;
  empexistance: any;
  searchInput: string = '';
  employee:any = -1;
  leavetype:any = -1;
  year:any = -1;
  fileName= 'LeaveLedger_Excel.xlsx'; 
  employeename: any;
  leave: any;
  yearvalue: any;
  companyName: any;

  constructor(private session:LoginService,private apicall:ApiCallService,private route:Router) { }

  ngOnInit(): void {
    this.ListEmployees();
    this.ListYear();
    this.ListLeaveTypes();
    const year = (<HTMLInputElement>document.getElementById("year")).value;
    const leavetype = (<HTMLInputElement>document.getElementById("leavetype")).value;
    const emp_code= (<HTMLInputElement>document.getElementById("employee")).value;
    
    this.apicall.ListLeaveLedgerReport(emp_code,year,leavetype).subscribe((res)=>{
      this.ListleaveReport=res;
    }) 
    
  }

  exportexcel(): void 
    {
       / table id is passed over here /   
       let element = document.getElementById('excel-table'); 
       const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(element);

       / generate workbook and add the worksheet /
       const wb: XLSX.WorkBook = XLSX.utils.book_new();
       XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

       / save to file /
       XLSX.writeFile(wb, this.fileName);
			
    }

  ListEmployees()
  {
  
    this.apicall.FetchEmployeeList(-1,-1,this.empcode).subscribe((res)=>{
      this.listEmployees=res;
      })
  }
  ListYear()
  {
    this.apicall.listYear().subscribe((res)=>{
    this.listYear=res;
    })
  }
  ListLeaveTypes()
  {
    this.apicall.FetchLeaveTypes().subscribe((res)=>{
      this.listlvetype=res; 
  }) 
  }
  LeaveReportData()
  {
    // const year = (<HTMLInputElement>document.getElementById("year")).value;
    // const leavetype = (<HTMLInputElement>document.getElementById("leavetype")).value;
    // const emp_code= (<HTMLInputElement>document.getElementById("employee")).value;
    if(this.year=="-1" || this.leavetype=="-1" ||this.employee =="-1")
    {
      this.empexistance="Please Select Fields";
    }
    else{
      this.empexistance="";
      this.employeename = this.employee.EMP_NAME;
      this.leave = this.leavetype.DATA_VALUE
      this.yearvalue = this.year.DISPLAY_FIELD
    this.apicall.ListLeaveLedgerReport(this.employee.EMP_CODE,this.year.DISPLAY_FIELD,this.leavetype.KEY_ID).subscribe((res)=>{
    this.ListleaveReport=res;
    //alert(JSON.stringify(this.ListleaveReport))

    if(this.ListleaveReport.length > 0)
    {
      this.OpeningLeavebalance  = this.ListleaveReport[0]['LEAVE_DEDUCTION']; 
      this.slno = 1; 
      this.totalslno = 0;
      this.LeaveAddition = 0;
      this.LeaveDeduction = 0;
      for (let i = 1; i < this.ListleaveReport.length; i++) {
        this.listvalues  =  this.ListleaveReport[i];
        this.mapper.push(this.ListleaveReport[i]);
        this.adding  = this.ListleaveReport[i]['LEAVE_ADDITION'];
        this.deduction  = this.ListleaveReport[i]['LEAVE_DEDUCTION'];
        this.LeaveAddition=this.LeaveAddition+this.adding;
        this.LeaveDeduction = this.LeaveDeduction + this.deduction;
      }
      this.Closingbalance = (this.LeaveAddition-this.LeaveDeduction)+this.OpeningLeavebalance;
      this.totalslno = this.totalslno+this.slno;
    } 
    
  })
  this.apicall.FetchCompanyName(this.employee.EMP_CODE).subscribe((res)=>{
    this.companyName = res[0].DISPLAY_FIELD;
    // alert(this.companyName)
  })
  this.employee=-1
  this.year=-1
  this.leavetype=-1
  this.mapper = [];
}

  }
  validation()
  {
    const year = (<HTMLInputElement>document.getElementById("year")).value;
    const leavetype = (<HTMLInputElement>document.getElementById("leavetype")).value;
    const employee = (<HTMLInputElement>document.getElementById("employee")).value;
    if(year=="-1" || leavetype=="-1" ||employee =="-1")
    {
      this.empexistance="Please Select Fields";
    }
    else
    {
      this.empexistance="";
    }
  }

  convertToPDF() {
    const element: HTMLElement = <HTMLDivElement>document.getElementById('htmlElementId'); // Replace with your HTML element's ID
    
    if (element) {
      html2canvas(element).then((canvas) => {

        //alert(canvas);

        const contentDataURL = canvas.toDataURL('image/jpeg');
        const pdf = new jsPDF('portrait', 'mm', 'a4'); // Portrait, millimeters, A4 size

        const imgWidth = 208;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        const xPosition = (pdf.internal.pageSize.width - imgWidth) / 2; // Center horizontally
        const yPosition = 10; // Center vertically

        // Draw a border around the entire page
        pdf.rect(0, 0, pdf.internal.pageSize.width, pdf.internal.pageSize.height);

        // Add the image inside the bordered area
       // pdf.addImage(contentDataURL, 'JPG', xPosition, yPosition, imgWidth, imgHeight);
        pdf.addImage(contentDataURL, 'JPEG', xPosition, yPosition, imgWidth, imgHeight);

        pdf.save('LeaveReport.pdf');
      }).catch((error) => {
        console.error('Error during html2canvas conversion:', error);
      });
    } else {
      console.error("Element with ID 'htmlElementId' not found");
    }
  }

}

