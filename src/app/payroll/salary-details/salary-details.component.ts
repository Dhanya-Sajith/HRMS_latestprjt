import { Component, OnInit} from '@angular/core';
import { ApiCallService } from 'src/app/api-call.service'; 
import { Router } from '@angular/router';
import { LoginService } from 'src/app/login.service';
import { FormGroup, FormControl, FormArray, FormBuilder, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common'; 
//import jsPDF from 'jspdf';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
// import  jsPDF from 'jspdf';
// import 'jspdf-autotable';

@Component({
  selector: 'app-salary-details',
  templateUrl: './salary-details.component.html',
  styleUrls: ['./salary-details.component.scss']
})
export class SalaryDetailsComponent implements OnInit {

  salarydetails: any;
  userSession:any = this.session.getUserSession();
  empcode: any=this.userSession.empcode;
  companycode: any=this.userSession.companycode;
  salaryhistory: any;
  maxdate: any;
  payslipdt: any;
  paymonths: any;
  yearlist: any;
  ann_earnings: any;
  totalearn=new FormControl();
  val: any;
  datedisplay=new FormControl();
  hostname:any;
  companyData: any;
  showModal: any;
  success: any;

  constructor(private datepipe:DatePipe,private http: HttpClient,private session:LoginService,private apicall:ApiCallService,private route:Router) { }

  ngOnInit(): void {


   this.hostname=this.apicall.dotnetapi;  
   this.val=0;
   const currentDate = new Date();
   const previousMonth = new Date(currentDate);
   previousMonth.setMonth(currentDate.getMonth() - 1);
   this.paymonths = previousMonth.toISOString().slice(0, 7);
   this.fetch_salary_structure();
   this.fetch_salary_revision_history();
   this.fetch_payslipData();
   this.listYear();
   this.GeneratePayslip();
  }

  GeneratePayslip()
  {

    this.apicall.genCompanyData(this.companycode).subscribe((res)=>{
      this.companyData=res;

     // alert(JSON.stringify(res))
      
      })

  }

  fetch_salary_structure()
  {
    this.apicall.fetch_salary_struct(this.empcode).subscribe((res)=>{
    this.salarydetails=res;
    // alert(JSON.stringify(res))
    this.maxdate = this.salarydetails[0].EFFECTIVE_DT;
    })
  }

  fetch_salary_revision_history()
  {
    this.apicall.fetch_salary_rev_history(this.empcode).subscribe((res)=>{
    this.salaryhistory=res;

    })
  }

 
  fetch_payslipData()
  {
  
    const currentDate = new Date();
    const previousMonth = new Date(currentDate);
    previousMonth.setMonth(currentDate.getMonth() - 1);
    
    this.paymonths = previousMonth.toISOString().slice(0, 7);

    this.apicall.fetch_payslipData(this.empcode,this.paymonths).subscribe((res)=>{
    this.payslipdt=res;

    
    const month_names: string[] = [
      'January', 'February', 'March', 'April',
      'May', 'June', 'July', 'August',
      'September', 'October', 'November', 'December'
  ];
  
  const input_date: string = this.paymonths;
  const [year, month] = input_date.split('-');
  
  const formatted_dates: string = `${month_names[parseInt(month) - 1]} ${year}`;
  
  this.datedisplay.setValue(formatted_dates.toUpperCase());

    })

  }



  fetch_payslipDatafilter()
  {

    const paymonth = (<HTMLInputElement>document.getElementById("paymonth")).value;

    const month_names: string[] = [
      'January', 'February', 'March', 'April',
      'May', 'June', 'July', 'August',
      'September', 'October', 'November', 'December'
  ];
  
  const input_date: string = paymonth;
  const [year, month] = input_date.split('-');
  
  const formatted_dates: string = `${month_names[parseInt(month) - 1]} ${year}`;
  
  this.datedisplay.setValue(formatted_dates.toUpperCase());

    this.apicall.fetch_payslipData(this.empcode,paymonth).subscribe((res)=>{
    this.payslipdt=res;

 if(this.payslipdt=="")
  {
    (<HTMLInputElement>document.getElementById("openModalButtonForalert")).click();
      this.showModal = 1;
      this.success = "Salary was not processed";
  }
    
    })
  }



  getDefaultMonth(): string {
    const currentDate = new Date();
    const previousMonth = new Date(currentDate);
    previousMonth.setMonth(currentDate.getMonth() - 1);
    
    // Format the previous month as "YYYY-MM" for input value
    return previousMonth.toISOString().slice(0, 7);

  }

  listYear()
  {
    this.apicall.listYear().subscribe((res)=>{
    this.yearlist=res;
      })
  }

  fetch_annual_earnings()
  {
    const year = (<HTMLInputElement>document.getElementById("year")).value;
    this.apicall.fetch_annual_earnings(this.empcode,year).subscribe((res)=>{
    this.ann_earnings=res;

    const sum = this.ann_earnings.reduce((total:any, item:any) => total + item.amount, 0);
   
    this.totalearn.setValue(sum);
   

    })
  }


    
  // genPayslip() {

  //     const paymonth = (<HTMLInputElement>document.getElementById("paymonth")).value;
  //   localStorage.setItem('paymonth', paymonth);
  

  // }



  async genPayslip() {
    const paymonth = (<HTMLInputElement>document.getElementById("paymonth")).value;
    localStorage.setItem('paymonth', paymonth);

    try {
      const response = await fetch('http://localhost:4200/Generate_Payslip', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/pdf',
        },
      });

      console.log('Response Status:', response.status);

      if (response.ok) {
        const blob = await response.blob();

        // Create a link element
        const link = document.createElement('a');
        link.download = 'payslip.pdf';
        link.href = window.URL.createObjectURL(blob);

        // Append the link to the body and trigger the click event
        document.body.appendChild(link);
        link.click();

        // Remove the link element after the download
        document.body.removeChild(link);
      } else {
        console.error('Failed to fetch payslip data:', await response.text());
      }
    } catch (error) {
      console.error('An error occurred while fetching payslip data:', error);
    }
  }


  convertToWords(num: number): string {

    const units = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    const teens = ['Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', 'Ten', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

    const convertIntegerToWords = (integerNum: number): string => {
      let result = '';

      if (integerNum >= 1000) {
        result += convertIntegerToWords(Math.floor(integerNum / 1000)) + ' Thousand ';
        integerNum %= 1000;
      }

      if (integerNum >= 100) {
        result += units[Math.floor(integerNum / 100)] + ' Hundred ';
        integerNum %= 100;
      }

      if (integerNum > 0) {
        if (result !== '') {
          result += 'and ';
        }

        if (integerNum < 10) {
          result += units[integerNum];
        } else if (integerNum < 20) {
          result += teens[integerNum - 11];
        } else {
          result += tens[Math.floor(integerNum / 10)] + ' ';
          if (integerNum % 10 > 0) {
            result += units[integerNum % 10];
          }
        }
      }

      return result.trim();
    };

    const integerPart = Math.floor(num);
    const decimalPart = Math.round((num - integerPart) * 100); // Extract two positions after the decimal point

    let result = convertIntegerToWords(integerPart);

    if (decimalPart > 0) {
      result += ' Point ' + convertIntegerToWords(decimalPart);
    }

    return result.trim();
  
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

        pdf.save('Payslip.pdf');
      }).catch((error) => {
        console.error('Error during html2canvas conversion:', error);
      });
    } else {
      console.error("Element with ID 'htmlElementId' not found");
    }
  }





  }






  



