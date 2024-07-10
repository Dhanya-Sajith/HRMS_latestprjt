// import { Component, OnInit } from '@angular/core';
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
  selector: 'app-salary-transfer-certificate',
  templateUrl: './salary-transfer-certificate.component.html',
  styleUrls: ['./salary-transfer-certificate.component.scss']
}) 

export class SalaryTransferCertificateComponent implements OnInit {
  userSession:any = this.session.getUserSession();
  empcode: any=this.userSession.empcode;
  empdata: any=this.general.getEmpdetails_competency(); 
  company:any= this.userSession.companycode;
  companydata: any=[];
  hostname!: string;
  experiencedata: any=[];
  //employmentdata: any=[];
  salarytransferdata:  any=[];
  bankname: any;
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

    this.apicall.Fetch_Salary_Transfer_Cert_Template(this.empdata.empcode,this.empdata.reqid).subscribe((res)=>{
        this.salarytransferdata=res;
        this.bankname=res[0].BANK_NAME;
        this.apicall.genCompanyData(this.salarytransferdata[0].LOCATION).subscribe(async (res)=>{
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
                { text: `${this.datePipe.transform(this.salarytransferdata[0].REQUEST_DATE,"MMMM d, y")}`, style: 'boldText' }
            ],
            margin: [0, 10, 0, 10]
          },
          {
            text: [
              { text: 'To:'+ '\n', style: 'normal' },
              { text: 'The Manager'+ '\n', style: 'boldText' },
              { text: this.salarytransferdata[0].BANK_NAME + '\n', style: 'boldText' },
              { text: 'UAE' + '\n', style: 'boldText' },

            ],
            margin: [0, 10, 0, 10]
          },
          {
            text: [
                { text: 'Dear Ma’am/Sir, ', style: 'normal' },
            ],
            margin: [0, 10, 0, 10]
          },
{
          text: [
            { text: 'Subject: SALARY TRANSFER- A/C No. ', style: 'boldText' },
            { text: `${this.salarytransferdata[0].ACCOUNT_NO}.`, style: 'boldText' },
          ],
          margin: [0, 10, 0, 10]
        },

          {
              text: [
                  { text: 'This is to certify that ', style: 'normal' },
                  { text: `${this.salarytransferdata[0].GENDER === 'Female' ? 'Ms.' : 'Mr.'}`, style: 'boldText' },
                  { text: `${this.salarytransferdata[0].EMP_NAME}`, style: 'boldText' },
                  { text: ' holder of ', style: 'normal' },
                  { text: `${this.salarytransferdata[0].PLACE}`, style: 'boldText' },
                  { text: ' Passport number ', style: 'normal' },
                  { text: `${this.salarytransferdata[0].DOCUMENT_NO}`, style: 'boldText' },
                  { text: ' is employed by ', style: 'normal' },
                  { text: `${this.salarytransferdata[0].EMP_WPS_COMPANY}`, style: 'boldText' },
                  { text: ' as a ', style: 'normal' },
                  { text: `${this.salarytransferdata[0].DESIGNATION}`, style: 'boldText' },
                  { text: ' since ', style: 'normal' },
                  { text: `${this.datePipe.transform(this.salarytransferdata[0].DATE_OF_JOINING,"dd-MM-yyyy")}`, style: 'boldText' },
                  { text: ' and draws a gross monthly salary of AED ', style: 'normal' },
                  { text: `${this.salarytransferdata[0].GROSS_SALARY}/-`, style: 'boldText' },


              ],
              margin: [0, 10, 0, 10]
          },
          {
              text: [
                  { text: 'We confirm that ', style: 'normal' },
                  { text: `${this.salarytransferdata[0].GENDER === 'Female' ? 'her' : 'his'}`, style: 'normal' },
                  { text: ' salary is being transferred to the A/C No. ', style: 'normal' },
                  { text: `${this.salarytransferdata[0].ACCOUNT_NO}`, style: 'boldText' },
                  { text: ' (IBAN No. ', style: 'normal' },
                  { text: `${this.salarytransferdata[0].IBAN_NO}`, style: 'boldText' },
                  { text: ' ) in  ', style: 'normal' },
                  { text: `${this.salarytransferdata[0].BANK_NAME}`, style: 'boldText' },
                  { text: ' and will continue to do that until  ', style: 'normal' },
                  { text: `${this.salarytransferdata[0].GENDER === 'Female' ? 'she' : 'he'}`, style: 'normal' },
                  { text: '  submits a clearance letter from you.', style: 'normal' },

              ],
              margin: [0, 10, 0, 10]
          },
        {
          text: [
            { text: 'In case of ', style: 'normal' },
            { text: `${this.salarytransferdata[0].GENDER === 'Female' ? 'her' : 'him'}.`, style: 'normal' },
            { text: ' resignation or termination we will inform you accordingly and will transfer the final settlement of ', style: 'normal' },
            { text: `${this.salarytransferdata[0].GENDER === 'Female' ? 'her' : 'him'}.`, style: 'normal' },
            { text: ' dues to the above-mentioned account. ', style: 'normal' },
          
          ],
          margin: [0, 10, 0, 10]
        },
        { text: 'Sincerely Yours,', style: 'normal',margin: [0, 20, 0, 20] },
        { text: 'MERLIN VATHANA', style: 'normal', bold: true,margin: [0, 20, 0, 0] },
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

    pdfMake.createPdf(docDefinition).download('Salary Transfer Letter.pdf');
  }


}

