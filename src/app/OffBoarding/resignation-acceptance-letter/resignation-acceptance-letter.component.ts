import { Component, OnInit } from '@angular/core';
import { ApiCallService } from 'src/app/api-call.service';
import { LoginService } from 'src/app/login.service';
import { DatePipe} from '@angular/common';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { ActivatedRoute, Router, NavigationExtras  } from '@angular/router';

@Component({
  selector: 'app-resignation-acceptance-letter',
  templateUrl: './resignation-acceptance-letter.component.html',
  styleUrls: ['./resignation-acceptance-letter.component.scss']
})
export class ResignationAcceptanceLetterComponent implements OnInit {

  userSession:any = this.session.getUserSession();
  authorityflg:any =this.userSession.authorityflg;
  // empcode: any=this.userSession.empcode;
  dept: any=this.userSession.dept;
  roleid:any =this.userSession.level;
  grpname:any=this.userSession.grpname;
  company: any=this.userSession.companycode;

  companyData: any;
  hostname = this.apicall.dotnetapi;  
  EmpDetail: any;
  empcode:any

  constructor(private apicall:ApiCallService,private datePipe:DatePipe,private session:LoginService,private route: ActivatedRoute) { }

  ngOnInit(): void {

    this.route.queryParams
      .subscribe(params => {
        this.empcode = params['code']; 
      }
    );

    this.apicall.genCompanyData(this.company).subscribe((res)=>{
      this.companyData=res; 
    })
    this.FetchEmployeeDetail();
  }

  FetchEmployeeDetail()
  {
    this.apicall.Fetch_ResgAcceptanceTemplate(this.empcode).subscribe((res)=>{
      this.EmpDetail=res; 
    })
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
            pdf.save('Resignation Acceptance Letter.pdf');
        }).catch((error) => {
            console.error('Error during html2canvas conversion:', error);
        });
    } else {
        console.error("Element with ID 'htmlElementId' not found");
    }
  }

}
