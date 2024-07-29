import { Component, OnInit } from '@angular/core';
import { ApiCallService } from 'src/app/api-call.service';
import { LoginService } from 'src/app/login.service';
import { DatePipe} from '@angular/common';
import { TDocumentDefinitions } from 'pdfmake/interfaces';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router, NavigationExtras  } from '@angular/router';

// Initialize virtual file system for pdfMake
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;

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
  logo: any;
  sign: any;

  constructor(private apicall:ApiCallService,private datePipe:DatePipe,private session:LoginService,private route: ActivatedRoute,private http: HttpClient) { }

  ngOnInit(): void {

    this.route.queryParams
      .subscribe(params => {
        this.empcode = params['code']; 
      }
    );

    this.hostname=this.apicall.dotnetapi;
    // this.apicall.genCompanyData(this.company).subscribe(async (res)=>{
    //   this.companyData=res; 
    //   this.logo = this.hostname + this.companyData[0].DATA_VALUE
    //   this.logo = await this.getBase64ImageFromUrl(this.hostname + this.companyData[0].DATA_VALUE);
    // })
    this.FetchEmployeeDetail();
  }

  FetchEmployeeDetail()
  {
    this.apicall.Fetch_ResgAcceptanceTemplate(this.empcode).subscribe((res)=>{
      this.EmpDetail=res; 
      this.apicall.genCompanyData(this.EmpDetail[0].EMP_WPS_COMPANY).subscribe(async (res)=>{
        this.companyData=res; 
        this.logo = this.hostname + this.companyData[0].DATA_VALUE
        this.logo = await this.getBase64ImageFromUrl(this.hostname + this.companyData[0].DATA_VALUE);
        this.sign = await this.getBase64ImageFromUrl('assets/styles/img/e-signature Merlin.png');
      })
    })
  }

  formatDate(date: Date) {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: '2-digit' };
    return new Date(date).toLocaleDateString('en-GB', options);
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
                    text: this.companyData[0].COMPANY_ID,
                    style: 'header',
                    alignment: 'center',
                    margin: [0, 0, 0, 0] // margin [left, top, right, bottom]
                },
                {
                    text: this.companyData[0].DESCRIPTION,
                    style: 'subheader',
                    alignment: 'center',
                    margin: [0, 0, 0, 0] // margin [left, top, right, bottom]
                },
                {
                    text: `(UAE); ${this.companyData[0].PHONE_NO}; ${this.companyData[0].EMAI_ID}`,
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
          { text: 'Private & Confidential', style: 'title', alignment: 'center', decoration: 'underline',margin: [0, 10, 0, 10] },
          // { text: `Date: ${this.formatDate(this.EmpDetail[0].LAST_WORKING_DATE)}`, style: 'normal',margin: [0, 5, 0, 5] },
          {
            text: [
                { text: 'Date: ', style: 'normal' },
                { text: `${this.formatDate(this.EmpDetail[0].LAST_WORKING_DATE)}`, style: 'boldText' }
            ],
            margin: [0, 5, 0, 5]
          },
          {
            text: [
              { text: this.EmpDetail[0].EMP_NAME+ '\n', style: 'boldText' },
              { text: this.EmpDetail[0].DESIGNATION+ '\n', style: 'boldText' },
              { text: this.EmpDetail[0].DEPARTMENT+ '\n', style: 'boldText' },
              { text: this.EmpDetail[0].COMPANY+ '\n', style: 'boldText' },
              { text: this.EmpDetail[0].PLACE+ '\n', style: 'boldText' }
            ],
            margin: [0, 5, 0, 5]
          },
          {
            text: [
                { text: 'Dear: ', style: 'normal' },
                { text: `${this.EmpDetail[0].EMP_CODE},`, margin: [0, 5, 0, 5] , style: 'boldText' }
            ],
            margin: [0, 5, 0, 5]
          },
          {
            text: 'Re: Resignation Acceptance and Exit Interview Requirements',
            style: 'subheader',
            decoration: 'underline',
            margin: [0, 10, 0, 10]
          },
          {
              text: [
                  { text: 'I write to confirm receipt of your resignation letter, dated ', style: 'normal' },
                  { text: `${this.formatDate(this.EmpDetail[0].REQUEST_DATE)}`, style: 'boldText' },
                  { text: ', of which we accept.', style: 'normal' }
              ],
              margin: [0, 10, 0, 10]
          },
          {
              text: [
                  { text: 'As agreed, your last date of employment with the Company will be ', style: 'normal' },
                  { text: `${this.formatDate(this.EmpDetail[0].LAST_WORKING_DATE)}`, style: 'boldText' },
                  { text: ' and your EOSB (final settlement) will be prepared as below. Your EOSB will be paid within 14 days from your agreed last working day.', style: 'normal' }
              ],
              margin: [0, 10, 0, 10]
          },
          {
            ol: [
              {
                  text: [
                      { text: `Salary up to and including your last working day, `, style: 'normal' },
                      { text: `${this.formatDate(this.EmpDetail[0].LAST_WORKING_DATE)}`, style: 'boldText' }
                  ],
              },
              {
                  text: [
                      { text: `Any outstanding leave balance, overtime and in lieu days as of, `, style: 'normal' },
                      { text: `${this.formatDate(this.EmpDetail[0].LAST_WORKING_DATE)}`, style: 'boldText' }
                  ],
              },
              {
                  text: [
                      { text: `Gratuity as per the UAE Labour Law, calculated as of, `, style: 'normal' },
                      { text: `${this.formatDate(this.EmpDetail[0].LAST_WORKING_DATE)}`, style: 'boldText' }
                  ],
              }
          ],
          style: 'normal',
          margin: [0, 10, 0, 10]
        },
        {
          text: `The exit interview form will be available in HRZone under your login, one week prior to your last working day. Please note that the completion of an Exit Interview is part of your Final clearance process and requires to be done prior to the cancellation of your visa, i.e. your last day of work.`,
          style: 'normal',
          margin: [0, 5, 0, 5]
        },
        {
          text: 'Should you have any queries relating to your resignation or the content of this letter, then please do not hesitate to contact a member of the HR team.',
          style: 'normal',
          margin: [0, 5, 0, 5]
        },
        {
          text: [
            { text: 'We would like to take this opportunity to thank you for the contribution you have made within your role at the ', style: 'normal' },
            { text: `${this.EmpDetail[0].COMPANY}.`, style: 'boldText' },
          ],
          margin: [0, 10, 0, 10]
        },
        { text: 'Wish you success in all your future endeavours.', style: 'normal',margin: [0, 10, 0, 10] },
        { text: 'Yours sincerely,', style: 'normal',margin: [0, 10, 0, 10] },
        {
          image: this.sign,
          width: 150,
          height: 50 
        },
        { text: 'MERLIN VATHANA', style: 'normal', bold: true, margin: [0, 10, 0, 0] },
        { text: 'Human Resources Manager', style: 'normal', bold: true,margin: [0, 10, 0, 10] }
      ],
      styles: {
        header: { fontSize: 14, bold: true },
        subheader: { fontSize: 10, bold: true },
        title: { fontSize: 12, bold: true },
        normal: { fontSize: 10, lineHeight: 1.3 },
        boldText: { fontSize: 10, bold: true } 
      }
    };

    pdfMake.createPdf(docDefinition).download('Resignation Acceptance Letter.pdf');
  }

}
