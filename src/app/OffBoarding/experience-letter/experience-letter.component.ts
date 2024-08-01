import { Component, OnInit } from '@angular/core';
import { ApiCallService } from 'src/app/api-call.service';
import { LoginService } from 'src/app/login.service';
import { TDocumentDefinitions } from 'pdfmake/interfaces';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

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
  reqid: any;
  empcd: any;
  logo: any;
  sign: any;

  constructor(private apicall:ApiCallService,private datePipe:DatePipe,private session:LoginService,private http: HttpClient,private route: ActivatedRoute) { }

  ngOnInit(): void {

    this.route.queryParams
    .subscribe(params => {
      this.reqid = params['REQID'];
      this.empcd = params['CODE']; 

    }
   );

    this.hostname=this.apicall.dotnetapi; 

    this.apicall.Fetch_ResgExperienceTemplate(this.empcd).subscribe((res)=>{
      this.experiencedata=res;
      this.apicall.genCompanyData(this.experiencedata[0].EMP_WPS_COMPANY).subscribe(async (res)=>{
        this.companydata=res;   
        this.logo = this.hostname + this.companydata[0].DATA_VALUE
        this.logo = await this.getBase64ImageFromUrl(this.hostname + this.companydata[0].DATA_VALUE);  
        this.sign = await this.getBase64ImageFromUrl('assets/styles/img/e-signature Merlin.png'); 
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
                { text: 'Date : ', style: 'normal' },
                { text: `${this.datePipe.transform(this.experiencedata[0].REQUEST_DATE,"MMMM d, y")}`, style: 'boldText' }
            ],
            margin: [0, 10, 0, 10]
          },
          { text: 'EXPERIENCE CERTIFICATE', style: 'title', alignment: 'center', decoration: 'underline',margin: [0, 10, 0, 20] },
          {
              text: [
                  { text: 'This is to certify that ', style: 'normal' },
                  { text: `${this.experiencedata[0].GENDER === 'Female' ? 'Ms.' : 'Mr.'}`, style: 'boldText' },
                  { text: `${this.experiencedata[0].EMP_NAME}`, style: 'boldText' },
                  { text: ' holder of ', style: 'normal' },
                  { text: `${this.experiencedata[0].PLACE}`, style: 'boldText' },
                  { text: ' Passport number ', style: 'normal' },
                  { text: `${this.experiencedata[0].DOCUMENT_NO}`, style: 'boldText' },
                  { text: ' has worked in ', style: 'normal' },
                  { text: `${this.experiencedata[0].COMPANY}`, style: 'boldText' },
                  { text: ' from ', style: 'normal' },
                  { text: `${this.datePipe.transform(this.experiencedata[0].DATE_OF_JOINING,"dd-MM-yyyy")}`, style: 'boldText' },
                  { text: ' to ', style: 'normal' },
                  { text: `${this.datePipe.transform(this.experiencedata[0].LAST_WORKING_DATE,"dd-MM-yyyy")}.`, style: 'boldText' },
                  { text: 'At the time of leaving the company ', style: 'normal' },
                  { text: `${this.experiencedata[0]?.GENDER === '1' ? 'he' : 'she'}`, style: 'normal' },
                  { text: '  was designated as ', style: 'normal' },
                  { text: `${this.experiencedata[0].DESIGNATION}.`, style: 'boldText' },
              ],
              margin: [0, 10, 0, 10]
          },
          {
              text: [
                  { text: 'During ', style: 'normal' },
                  { text: `${this.experiencedata[0]?.GENDER === '1' ? 'his' : 'her'}`, style: 'normal' },
                  { text: ' tenure with us we found ', style: 'normal' },
                  { text: `${this.experiencedata[0]?.GENDER === '1' ? 'him' : 'her'}`, style: 'normal' },
                  { text: ' sincere, trustworthy and hardworking.  We wish ', style: 'normal' },
                  { text: `${this.experiencedata[0]?.GENDER === '1' ? 'him' : 'her'}`, style: 'normal' },
                  { text: ' all the best in ', style: 'normal' },
                  { text: `${this.experiencedata[0]?.GENDER === '1' ? 'his' : 'her'}`, style: 'normal' },
                  { text: ' future endeavors.', style: 'normal' },
              ],
              margin: [0, 10, 0, 10]
          },
        {
          text: [
            { text: 'For ', style: 'normal' },
            { text: `${this.experiencedata[0].COMPANY}.`, style: 'boldText' },
          ],
          margin: [0, 10, 0, 20]
        },
        {
          image: this.sign,
          width: 100,
          height: 96 
        },
        { text: 'MERLIN VATHANA',  style: 'normal', bold: true,margin: [0, 10, 0, 5]},
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

    pdfMake.createPdf(docDefinition).download('Experience Letter.pdf');
  }

  
}
