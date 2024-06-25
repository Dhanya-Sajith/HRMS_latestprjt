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

        pdf.save('Resignation acceptance letter.pdf');
      }).catch((error) => {
        console.error('Error during html2canvas conversion:', error);
      });
    } else {
      console.error("Element with ID 'htmlElementId' not found");
    }
  }

}
