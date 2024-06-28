import { Component, OnInit } from '@angular/core';
import { ApiCallService } from 'src/app/api-call.service';
import { LoginService } from 'src/app/login.service';
import { DatePipe} from '@angular/common';
import { ActivatedRoute, Router  } from '@angular/router';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-eosdocument',
  templateUrl: './eosdocument.component.html',
  styleUrls: ['./eosdocument.component.scss']
})
export class EOSDocumentComponent implements OnInit {

  userSession:any = this.session.getUserSession();
  authorityflg:any =this.userSession.authorityflg;
  empcode: any=this.userSession.empcode;
  dept: any=this.userSession.dept;
  roleid:any =this.userSession.level;
  grpname:any=this.userSession.grpname;
  company: any=this.userSession.companycode;

  // empcode:any ='MJ00008'
  companyData: any;
  hostname = this.apicall.dotnetapi; 
  gratuity: any;
  Empdetails: any;
  yearofservice: any;
  gratuityamount: any;
  salarydetails: any;
  eosdetails: any;
  payType1Data: any;
  payType2Data: any;
  TOTAL_ADDITION: any;
  TOTAL_DEDUCTION: any;
  NET_AMOUNT: any; 
  GROSS_SALARY: any;
  LAST_WORKING_DATE: any;
  EMPNAME: any;
  reqid: any;

  constructor(private apicall:ApiCallService,private datePipe:DatePipe,private session:LoginService,private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.queryParams
      .subscribe(params => {
        this.reqid = params['reqid']; 
      }
    );

    this.apicall.genCompanyData(this.company).subscribe((res)=>{
      this.companyData=res; 
    })
    
    this.apicall.GetGratuityAmount(this.empcode).subscribe((res) => {  
      this.gratuity = res
      this.yearofservice = this.gratuity.YEARS_OF_SERVICE;
      this.gratuityamount = this.gratuity.GRATUITY_AMOUNT;
     });
 
     this.apicall.Fetch_EmpDetails_ExitInterview(this.empcode,this.reqid).subscribe((res) => {  
       this.Empdetails = res
       this.EMPNAME = this.Empdetails[0].EMP_NAME
       this.LAST_WORKING_DATE = this.Empdetails[0].LAST_WORKING_DATE
      });
       
      this.apicall.FetchEOS_EmpSal_Details(this.empcode).subscribe((res) => {  
       this.salarydetails = res
       this.GROSS_SALARY = this.salarydetails[0].GROSS_SALARY;
      });
 
      this.apicall.FetchEOS_AdditionDeduction_Details(this.empcode).subscribe((res) => {  
       this.eosdetails = res
       this.payType1Data = this.eosdetails.filter((data: { PAY_TYPE: number; }) => data.PAY_TYPE === 1);
       this.payType2Data = this.eosdetails.filter((data: { PAY_TYPE: number; }) => data.PAY_TYPE === 2);
       this.TOTAL_ADDITION = this.eosdetails[0].TOTAL_ADDITION;
       this.TOTAL_DEDUCTION = this.eosdetails[0].TOTAL_DEDUCTION;
       this.NET_AMOUNT = this.eosdetails[0].NET_AMOUNT;
      });
  }

  convertToPDF() {
    const element = document.getElementById('htmlElementId'); // Replace with your HTML element's ID
  
    if (element) {
        html2canvas(element, {
            scale: 3, // Increase scale for better quality
            useCORS: true // Use CORS to handle images from different origins
        }).then((canvas) => {
            const contentDataURL = canvas.toDataURL('image/jpeg');
            const pdf = new jsPDF('portrait', 'mm', 'a4'); // Portrait, millimeters, A4 size
  
            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();
            const imgWidth = pageWidth - 20; // Leave some margin
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
  
            const xPosition = 10; // Left margin
            const yPosition = 10; // Top margin
  
            // Check if the image height is greater than the page height
            if (imgHeight > pageHeight - 20) {
                let remainingHeight = imgHeight;
                let yPosition = 10;
  
                // Add multiple pages if the content exceeds one page
                while (remainingHeight > 0) {
                    pdf.addImage(contentDataURL, 'JPEG', xPosition, yPosition, imgWidth, imgHeight);
                    remainingHeight -= pageHeight - 20;
                    if (remainingHeight > 0) {
                        pdf.addPage();
                        yPosition = 10;
                    }
                }
            } else {
                // Add the image to the PDF
                pdf.addImage(contentDataURL, 'JPEG', xPosition, yPosition, imgWidth, imgHeight);
            }
  
            // Save the PDF
            pdf.save('EOS Statement.pdf');
        }).catch((error) => {
            console.error('Error during html2canvas conversion:', error);
        });
    } else {
        console.error("Element with ID 'htmlElementId' not found");
    }
  }

}
