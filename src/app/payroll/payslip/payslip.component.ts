import { Component, OnInit } from '@angular/core';
import html2canvas from 'html2canvas';
import jspdf from 'jspdf';
import { ApiCallService } from 'src/app/api-call.service'; 
import { Router } from '@angular/router';
import { LoginService } from 'src/app/login.service';
import { FormGroup, FormControl, FormArray, FormBuilder, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common'; 



@Component({
  selector: 'app-payslip',
  templateUrl: './payslip.component.html',
  styleUrls: ['./payslip.component.scss']
})
export class PayslipComponent implements OnInit {


  userSession:any = this.session.getUserSession();
  empcode: any=this.userSession.empcode;
  companycode: any=this.userSession.companycode;
  companyData: any;
  hostname:any;
  paymonths: any;
  payslipdt: any;
  datedisp=new FormControl();

  constructor(private session:LoginService,private apicall:ApiCallService,private datePipe: DatePipe) { }

  ngOnInit(): void {

  this.hostname=this.apicall.dotnetapi;
  this.GeneratePayslip();
  this.fetch_payslipData();

  }


  GeneratePayslip()
  {

    this.apicall.genCompanyData(this.companycode).subscribe((res)=>{
      this.companyData=res;

     // alert(JSON.stringify(res))
      
      })

  }


  convertToPDF() {
    const element: HTMLElement = <HTMLDivElement>document.getElementById('htmlElementId'); // Replace with your HTML element's ID
    
    if (element) {
      html2canvas(element).then((canvas) => {
        const contentDataURL = canvas.toDataURL('image/png');
        const pdf = new jspdf('l', 'mm', 'a4'); // Portrait, millimeters, A4 size

        const imgWidth = 208;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        const xPosition = (pdf.internal.pageSize.width - imgWidth) / 2; // Center horizontally
        const yPosition = (pdf.internal.pageSize.height - imgHeight) / 2; // Center vertically

        // Draw a border around the entire page
        pdf.rect(0, 0, pdf.internal.pageSize.width, pdf.internal.pageSize.height);

        // Add the image inside the bordered area
        pdf.addImage(contentDataURL, 'PNG', xPosition, yPosition, imgWidth, imgHeight);

        pdf.save('Payslip.pdf');
      });
    } else {
      console.error("Element with ID 'htmlElementId' not found");
    }
  }


  fetch_payslipData()
  {
    const paymonth = localStorage.getItem('paymonth');

    const currentDate = new Date();
    const previousMonth = new Date(currentDate);
    previousMonth.setMonth(currentDate.getMonth() - 1);
    
    this.paymonths = previousMonth.toISOString().slice(0, 7);

    this.apicall.fetch_payslipData(this.empcode,paymonth).subscribe((res)=>{
    this.payslipdt=res;

    //alert(this.payslipdt[0].PAYROLL_DATE)

    const dateParts = this.payslipdt[0].PAYROLL_DATE.split(/[- :]/);
    const formattedDate = new Date(
    parseInt(dateParts[2], 10),
    parseInt(dateParts[1], 10) - 1,
    parseInt(dateParts[0], 10)
  ).toLocaleString('default', { month: 'long', year: 'numeric' });

  //alert(formattedDate);
  this.datedisp.setValue(formattedDate);

    })
  }


  convertToWords(num: number): string {
    const units = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    const teens = ['Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', 'Ten', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

    if (num === 0) {
      return 'Zero';
    }

    let result = '';

    if (num >= 1000) {
      result += this.convertToWords(Math.floor(num / 1000)) + ' Thousand ';
      num %= 1000;
    }

    if (num >= 100) {
      result += units[Math.floor(num / 100)] + ' Hundred ';
      num %= 100;
    }

    if (num > 0) {
      if (result !== '') {
        result += 'and ';
      }

      if (num < 10) {
        result += units[num];
      } else if (num < 20) {
        result += teens[num - 11];
      } else {
        result += tens[Math.floor(num / 10)] + ' ';
        if (num % 10 > 0) {
          result += units[num % 10];
        }
      }
    }

    return result.trim();
  }



}
