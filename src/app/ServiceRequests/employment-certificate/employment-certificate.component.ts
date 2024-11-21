import { Component, OnInit } from '@angular/core';
import { ApiCallService } from 'src/app/api-call.service';
import { LoginService } from 'src/app/login.service';
import { GeneralService } from 'src/app/general.service';
import { ActivatedRoute } from '@angular/router';
import { TDocumentDefinitions } from 'pdfmake/interfaces';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { HttpClient } from '@angular/common/http';
import { DatePipe, JsonPipe } from '@angular/common';

@Component({
  selector: 'app-employment-certificate',
  templateUrl: './employment-certificate.component.html',
  styleUrls: ['./employment-certificate.component.scss']
})
export class EmploymentCertificateComponent implements OnInit {
  userSession:any = this.session.getUserSession();
  empdata: any=this.general.getEmpdetails_competency(); 
  empcode: any=this.userSession.empcode;
  company:any= this.userSession.companycode;
  companydata: any=[];
  hostname!: string;
  experiencedata: any=[];
  employmentdata: any=[];
  user: any;
  Status: any;
  logo: any;

  constructor(private apicall:ApiCallService,private datePipe: DatePipe,private session:LoginService,private general:GeneralService,private route: ActivatedRoute,private http: HttpClient) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.user = params['user'];
      this.Status = params['Status'];    
     
    }); 

    this.hostname=this.apicall.dotnetapi; 

    this.apicall.Fetch_Employment_Cert_Template(this.empdata.empcode,this.empdata.reqid).subscribe((res)=>{
       this.employmentdata=res;
       this.apicall.genCompanyData(this.employmentdata[0].DEPARTMENT).subscribe(async (res)=>{
        this.companydata=res;
        this.logo = this.hostname + this.companydata[0].DATA_VALUE
        this.logo = await this.getBase64ImageFromUrl(this.hostname + this.companydata[0].DATA_VALUE);
      }) 
    })
    
  }

  async getBase64ImageFromUrl(imageUrl: string): Promise<string | undefined> {
    try {
      const response = await this.http.get(imageUrl, { responseType: 'blob' }).toPromise();
  
      if (!response) {
        console.error(`Image not found at ${imageUrl}`);
        return undefined;
      }
  
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (reader.result) {
            resolve(reader.result as string);
          } else {
            reject(new Error("Failed to convert image to base64."));
          }
        };
        reader.onerror = () => {
          reject(new Error("Failed to read image file."));
        };
        reader.readAsDataURL(response);
      });
    } catch (error) {
      console.error(`Failed to fetch image from ${imageUrl}:`, error);
      return undefined;
    }
  }
  
  convertToPDF() {
    const docDefinition: TDocumentDefinitions = {
      content: [
        // Centered Header Section
          {
            stack: [
                {
                    // Logo
                    image: this.logo,
                    width: 150,
                    alignment: 'center',
                    margin: [0, 0, 0, 0] // margin [left, top, right, bottom]
                },
                {
                    // Company Information
                    text: this.companydata[0].COMPANY_ID,
                    style: 'header',
                    alignment: 'center',
                    margin: [0, 0, 0, 0] // margin [left, top, right, bottom]
                },
                {
                    text: this.companydata[0].DESCRIPTION,
                    style: 'subheader',
                    alignment: 'center',
                    margin: [0, 0, 0, 0] // margin [left, top, right, bottom]
                },
                {
                    text: `(UAE); ${this.companydata[0].PHONE_NO}; ${this.companydata[0].EMAI_ID}`,
                    style: 'subheader',
                    alignment: 'center'
                }
            ],
            margin: [0, 0, 0, 10] // Adding bottom margin to create space below the header
          },
          {
            canvas: [
              { type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1 }
            ],
            margin: [0, 5, 0, 10] 
          },
          {
            text: [
                { text: `${this.datePipe.transform(this.employmentdata[0].REQUEST_DATE,"MMMM d, y")}`, style: 'boldText' }
            ],
            margin: [0, 10, 0, 10]
          },
          { text: 'CERTIFICATE OF EMPLOYMENT', style: 'title', alignment: 'center', decoration: 'underline',margin: [0, 10, 0, 20] },
          {
              text: [
                  { text: 'This is to certify that ', style: 'normal' },
                  { text: `${this.employmentdata[0].GENDER === 'Female' ? 'Ms.' : 'Mr.'}`, style: 'boldText' },
                  { text: `${this.employmentdata[0].EMP_NAME}`, style: 'boldText' },
                  { text: ' holder of ', style: 'normal' },
                  { text: `${this.employmentdata[0].PLACE}`, style: 'boldText' },
                  { text: ' Passport number ', style: 'normal' },
                  { text: `${this.employmentdata[0].DOCUMENT_NO}`, style: 'boldText' },
                  { text: ' has been employed in ', style: 'normal' },
                  { text: `${this.employmentdata[0].EMP_WPS_COMPANY}`, style: 'boldText' },
                  { text: ' as a ', style: 'normal' },
                  { text: `${this.employmentdata[0].DESIGNATION}`, style: 'boldText' },
                  { text: ' since ', style: 'normal' },
                  { text: `${this.datePipe.transform(this.employmentdata[0].DATE_OF_JOINING,"dd-MM-yyyy")}.`, style: 'boldText' },
              ],
              margin: [0, 10, 0, 10]
          },
          {
              text: [
                  { text: 'This certificate is issued upon the employee’s request for whatever lawful purpose it may serve ', style: 'normal' },
                  { text: `${this.employmentdata[0].GENDER === 'Female' ? 'her' : 'him'}`, style: 'normal' },
                  { text: ' best.', style: 'normal' }
              ],
              margin: [0, 10, 0, 10]
          },
        {
          text: [
            { text: 'For ', style: 'normal' },
            { text: `${this.employmentdata[0].EMP_WPS_COMPANY}.`, style: 'boldText' },
          ],
          margin: [0, 10, 0, 10]
        },
        { text: 'Sincerely Yours,', style: 'normal',margin: [0, 10, 0, 30] },
        {
          canvas: [
              {
                  type: 'line',
                  x1: 0,
                  y1: 0,
                  x2: 200, // Adjust width as needed
                  y2: 0,
                  lineWidth: 1
              }
          ],
          margin: [0, 30, 0, 20] // Adjust margin as needed
        },
        { text: 'MERLIN VATHANA', style: 'normal', bold: true,margin: [0, 0, 0, 0]},
        { text: 'HR Manager', style: 'normal' }
      ],
      styles: {
        header: { fontSize: 14, bold: true },
        subheader: { fontSize: 10, bold: true },
        title: { fontSize: 12, bold: true },
        normal: { fontSize: 10, lineHeight: 1.3 },
        boldText: { fontSize: 10, bold: true } 
      }
    };

    pdfMake.createPdf(docDefinition).download('Employment Certificate.pdf');
  }

}

