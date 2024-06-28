import { Component, OnInit } from '@angular/core';
import { ApiCallService } from 'src/app/api-call.service';
import { LoginService } from 'src/app/login.service';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
@Component({
  selector: 'app-experience-letter',
  templateUrl: './experience-letter.component.html',
  styleUrls: ['./experience-letter.component.scss']
})
export class ExperienceLetterComponent implements OnInit {

  userSession:any = this.session.getUserSession();
  empcode: any=this.userSession.empcode;
  company:any= this.userSession.companycode;
  companydata: any=[];
  hostname!: string;
  experiencedata: any=[];
  constructor(private apicall:ApiCallService,private session:LoginService) { }

  ngOnInit(): void {
    this.hostname=this.apicall.dotnetapi; 
    this.apicall.genCompanyData(this.company).subscribe((res)=>{
      this.companydata=res;      
      //alert(JSON.stringify(this.companydata))
    })
    this.apicall.Fetch_ResgExperienceTemplate(this.empcode).subscribe((res)=>{
      this.experiencedata=res;
      //alert(JSON.stringify(this.experiencedata))
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
            pdf.save('Experience Letter.pdf');
        }).catch((error) => {
            console.error('Error during html2canvas conversion:', error);
        });
    } else {
        console.error("Element with ID 'htmlElementId' not found");
    }
  }

}
