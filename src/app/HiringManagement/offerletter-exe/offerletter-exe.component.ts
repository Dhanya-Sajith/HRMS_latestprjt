import { Component, OnInit } from '@angular/core';
import { ApiCallService } from 'src/app/api-call.service';
import { LoginService } from 'src/app/login.service';
import { DatePipe} from '@angular/common';
import { ContentStack, TDocumentDefinitions } from 'pdfmake/interfaces';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

// Initialize virtual file system for pdfMake
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;


@Component({
  selector: 'app-offerletter-exe',
  templateUrl: './offerletter-exe.component.html',
  styleUrls: ['./offerletter-exe.component.scss']
})
export class OfferletterExeComponent implements OnInit {

  userSession:any = this.session.getUserSession();
  //empcode: any=this.userSession.empcode;
  company:any= this.userSession.companycode;

  companydata: any;
  hostname = this.apicall.dotnetapi;  
  logo: any;
  empcode: any;
  //candidateId: any = 1;
  offerletterdt: any;
  salarydtls: any;
  candidateId: any;


  constructor(private apicall:ApiCallService,private datePipe:DatePipe,private session:LoginService,private http: HttpClient,private route: ActivatedRoute) { }

  ngOnInit(): void {

    this.route.queryParams.subscribe(params => {
      this.candidateId = params['CandidateId'];
    }); 

   // alert(this.candidateId);

    this.hostname=this.apicall.dotnetapi; 
    
    this.fetchOfferletterdtls();
    this.fetchOfferlettersalarydtls();

  }

  fetchOfferletterdtls()
  {
    this.apicall.fetchofferletterdtlsApi(this.candidateId).subscribe((res)=>{
      this.offerletterdt=res;

    // alert(JSON.stringify(res));
      
      this.apicall.genCompanyData(this.offerletterdt[0].COMPANY_CODE).subscribe(async (res)=>{
        this.companydata=res; 
        this.logo = this.hostname + this.companydata[0].DATA_VALUE;
        this.logo = await this.getBase64ImageFromUrl(this.hostname + this.companydata[0].DATA_VALUE);
      })
    })
  }

  fetchOfferlettersalarydtls()
  {
    this.apicall.fetchsalarydtlsApi(this.candidateId).subscribe((res)=>{
      this.salarydtls=res;
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
  const salaryDetails = this.salarydtls.map((detail: { ALLOWANCE_NAME: any; AMOUNT: any; }) => [
      { text: detail.ALLOWANCE_NAME, style: 'boldText' },
      { text: ':', style: 'boldText' },
      { text: `AED ${detail.AMOUNT} / month`, style: 'boldText' }
  ]);
  console.log('Company Data:', this.companydata);

  const docDefinition: TDocumentDefinitions = {
        header: (currentPage, pageCount) => {
          return {
            stack: [
              {
                  image: this.logo,
                  width: 150,
                  alignment: 'center',
                  margin: [0, 5, 0, 0] 
              },
              {
                  text: this.companydata[0].COMPANY_ID,
                  style: 'header',
                  alignment: 'center',
                  margin: [0, 0, 0, 0]  
              },
              {
                  text: this.companydata[0].DESCRIPTION,
                  style: 'subheader',
                  alignment: 'center',
                  margin: [0, 0, 0, 0] 
              },
              {
                  text: `(UAE); ${this.companydata[0].PHONE_NO}; ${this.companydata[0].EMAI_ID}`,
                  style: 'subheader',
                  alignment: 'center'
              },
              {
                  canvas: [
                      { type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1 }
                  ],
                  margin: [40, 10, 40, 10]  // Adjust margins to add more space around the line
              }
          ],
              
          } as ContentStack;
      },
      content: [
          { text: 'Private and Confidential', style: 'title', alignment: 'center', decoration: 'underline', margin: [0, 10, 0, 10] },  
          {
              text: [
                  { text: 'Date : ', style: 'normal' },
                  { text: `${this.datePipe.transform(this.offerletterdt[0].ENTER_DATE,"dd-MM-yyyy")}`, style: 'boldText' }
              ],
              margin: [0, 10, 0, 10]
          },
          {
              text: [
                  { text: 'To ,'+ '\n', style: 'boldText', margin: [0, 10, 0, 10] },
                  { text: `${this.offerletterdt[0].GENDER === 2 ? 'Ms. ' : 'Mr. '}`, style: 'boldText' },
                  { text: this.offerletterdt[0].CANDIDATE_NAME + '\n', style: 'boldText', margin: [0, 10, 0, 10] }
              ]
          },
          {
              table: {
                  widths: ['25%', '5%', '70%'],
                  body: [
                      [
                          { text: 'Passport Number', style: 'normal' },
                          { text: ':', style: 'normal' },
                          { text: ` ${this.offerletterdt[0].PASSPORT_NO}`, style: 'normal' }
                      ],
                      [
                          { text: 'Mobile Number', style: 'normal' },
                          { text: ':', style: 'normal' },
                          { text: ` ${this.offerletterdt[0].MOBILE_NO}`, style: 'normal' }
                      ],
                      [
                          { text: 'Address', style: 'normal' },
                          { text: ':', style: 'normal' },
                          { text: ` ${this.offerletterdt[0].CANDIDATE_ADDRESS}`, style: 'normal' }
                      ]
                  ].filter(row => row.length) // Filter out empty rows
              },
              layout: 'noBorders',
              margin: [0, 10, 0, 10]
          },
          {
              text: [
                  { text: 'Dear ', style: 'normal' },
                  { text: `${this.offerletterdt[0].CANDIDATE_NAME}`, style: 'boldText' }
              ],
              margin: [0, 10, 0, 10]
          },
          {
              text: [
                  { text: 'On behalf of ', style: 'normal' },
                  { text: ' Worldwide Oilfield Machine M.E. ', style: 'boldText' },
                  { text: `(${this.offerletterdt[0].COMPANY}) , `, style: 'boldText' },
                  { text: ' It is my pleasure to offer you the position of ', style: 'normal' },
                  { text: `${this.offerletterdt[0].DESIGNATION}.`, style: 'boldText' }
              ],
              margin: [0, 5, 0, 5]
          },
          {
              table: {
                  widths: ['25%', '5%', '70%'],
                  body: [
                      [
                          { text: 'Location of Employement', style: 'normal' },
                          { text: ':', style: 'normal' },
                          { text: 'WOM Group Middle East (Dubai & Sharjah)', style: 'normal' }
                      ],
                      [
                          { text: 'Employment Start Date', style: 'normal' },
                          { text: ':', style: 'normal' },
                          { text: 'TBC', style: 'normal' }
                      ]
                  ].filter(row => row.length) // Filter out empty rows
              },
              layout: 'noBorders',
              margin: [0, 5, 0, 10]
          },
          { text: 'You will be entitled to the following remuneration:', style: 'normal', margin: [0, 10, 0, 5] },
          {
              table: {
                widths: ['25%', '5%', '70%'],
                body: [
                    ...salaryDetails,
                    [
                      {
                        canvas: [
                          {
                            type: 'line',
                            x1: 0,
                            y1: 0,
                            x2: 300, // Adjust this value for the line length
                            y2: 0,
                            lineWidth: 0.5, // Adjust line thickness
                            lineColor: '#000' // Line color
                          }
                        ],
                        colSpan: 3,
                        margin: [0, 5, 0, 5] // Margin around the line
                      },
                      {}, // Placeholder for the second column
                      {}  // Placeholder for the third column
                    ],
                    [
                      { text: 'Total', style: 'boldText' }, 
                      { text: ':', style: 'boldText' }, 
                      { text: `AED ${this.salarydtls[0].GROSS_SALARY} / month`, style: 'boldText' }
                  ]
                ]
              },
              layout: {
                hLineWidth: function (i) {
                  return 0; // Prevent default horizontal lines
                },
                vLineWidth: function () {
                  return 0; // No vertical lines
                }
              },
              style: 'tableExample',
              margin: [0, 10, 0, 10]
          },
            // Conditional salary revision message
            (this.offerletterdt[0]?.probationCompletionSalary != null ? [
              
              {
                text: [
                  { text: 'The total salary will be revised to  ', style: 'normal' },
                  { text: `AED ${this.offerletterdt[0].probationCompletionSalary}/-`, style: 'boldText' },
                  { text: '  upon completion of your probation period.', style: 'normal' },
              ],
              margin: [0, 5, 0, 10]
              },
            ] : []),
          
          { text: 'The employment status of this position is full time and the other benefits will include :', style: 'normal', margin: [0, 10, 0, 10] },
          {
              table: {
                  widths: ['25%', '5%', '70%'],
                  body: [
                      this.offerletterdt[0].OVERTIME ? [
                          { text: 'Overtime', bold: true, style: 'boldText' },
                          { text: ':', bold: true, style: 'boldText' },
                          'Eligible for overtime paid as per UAE Labour Law'
                      ] : [],
                      this.offerletterdt[0].ACCOMMODATION ? [
                          { text: 'Accommodation', bold: true, style: 'boldText' },
                          { text: ':', bold: true, style: 'boldText' },
                          'Shared accommodation provided by the company'
                      ] : [],
                      this.offerletterdt[0].TRANSPORTATION ? [
                          { text: 'Transportation', bold: true, style: 'boldText' },
                          { text: ':', bold: true, style: 'boldText' },
                          'To and from work place provided by the company'
                      ] : [],
                      this.offerletterdt[0].FAMILY_INSURANCE==1 && this.offerletterdt[0].MEDICAL_INSURANCE==1 ?[
                          { text: 'Medical Insurance', bold: true, style: 'boldText' },
                          { text: ':', bold: true, style: 'boldText' },
                          'Private medical insurance to self, spouse and two kids below 18 years of age by the company'
                      ] : [],
                      this.offerletterdt[0].FAMILY_INSURANCE==0 && this.offerletterdt[0].MEDICAL_INSURANCE==1 ? [
                        { text: 'Medical Insurance', bold: true, style: 'boldText' },
                        { text: ':', bold: true, style: 'boldText' },
                        'Private medical insurance to self by the company'
                    ] : [],
                      this.offerletterdt[0].LIFE_INSURANCE ? [
                          { text: 'Life Insurance', bold: true, style: 'boldText' },
                          { text: ':', bold: true, style: 'boldText' },
                          'Group life insurance to self by the company'
                      ] : [],
                      [
                          { text: 'Visa/Work permit', bold: true, style: 'boldText' },
                          { text: ':', bold: true, style: 'boldText' },
                          'Provided by the company'
                      ],
                      this.offerletterdt[0].AIRTICKET_ELIGIBILITY==1 ? [
                          { text: 'Home Ticket', bold: true, style: 'boldText' },
                          { text: ':', bold: true, style: 'boldText' },
                          'Not Eligible.'
                      ] : [],
                      this.offerletterdt[0].AIRTICKET_ELIGIBILITY==2 &&  this.offerletterdt[0].FAMILY_AIRTICKET==1 ? [
                        { text: 'Home Ticket', bold: true, style: 'boldText' },
                        { text: ':', bold: true, style: 'boldText' },
                        'One economy class air ticket to and from the home country for self, spouse and two kids below 18 years of age once every 12 months of employment.'
                      ] : [],
                      this.offerletterdt[0].AIRTICKET_ELIGIBILITY==2 &&  this.offerletterdt[0].FAMILY_AIRTICKET==0 ? [
                          { text: 'Home Ticket', bold: true, style: 'boldText' },
                          { text: ':', bold: true, style: 'boldText' },
                          'One economy class air ticket to and from the home country for self once every 12 months of employment.'
                      ] : [],
                      this.offerletterdt[0].AIRTICKET_ELIGIBILITY==3 &&  this.offerletterdt[0].FAMILY_AIRTICKET==1 ? [
                        { text: 'Home Ticket', bold: true, style: 'boldText' },
                        { text: ':', bold: true, style: 'boldText' },
                        'One economy class air ticket to and from the home country for self, spouse and two kids below 18 years of age once every 24 months of employment.'
                      ] : [],
                      this.offerletterdt[0].AIRTICKET_ELIGIBILITY==3 &&  this.offerletterdt[0].FAMILY_AIRTICKET==0 ? [
                          { text: 'Home Ticket', bold: true, style: 'boldText' },
                          { text: ':', bold: true, style: 'boldText' },
                          'One economy class air ticket to and from the home country for self once every 24 months of employment.'
                      ] : [],
                      
                  ].filter(row => row.length) // Filter out empty rows
              },
              style: 'normal',
              layout: 'noBorders',
              margin: [0, 10, 0, 10]
          },
          { text: '', pageBreak: 'after' },
          { text: 'Other terms of employment are :', style: 'normal', margin: [0, 10, 0, 10] },
          {
              table: {
                  widths: ['25%', '5%', '70%'],
                  body: [
                      [
                          { text: 'Work Schedule', style: 'boldText' },
                          { text: ':', style: 'normal' },
                          { text: `${this.offerletterdt[0].WORKINGTIME}, ${this.offerletterdt[0].WORKINGDAYS}`, style: 'normal' }
                      ],
                      [
                          { text: 'Probation period', style: 'boldText' },
                          { text: ':', style: 'normal' },
                          { text: this.offerletterdt[0].PROBATION_PERIOD + ' Months from the date of joining', style: 'normal' }
                      ],
                      [
                          { text: 'Notice period', style: 'boldText' },
                          { text: ':', style: 'normal' },
                          { text: this.offerletterdt[0].NOTICE_PERIOD + ' Days in writing by either party', style: 'normal' }
                      ],
                      [
                          { text: 'Vacation', style: 'boldText' },
                          { text: ':', style: 'normal' },
                          { text: 'As per UAE law', style: 'normal' }
                      ],
                      [
                          { text: 'Termination Clause', style: 'boldText' },
                          { text: ':', style: 'normal' },
                          {
                              text: `The company or the employee shall be entitled to terminate the existing employment contract by giving, at any time, one month notice in writing or salary in lieu as per the UAE Labor Law. The employee agrees to pay the recruitment cost to company if he decides to terminate the employment contract within one year of service with the company.`,
                              style: 'normal',
                              alignment: 'justify'
                          }
                      ],
                      this.offerletterdt[0].NC_CLAUSE ? [
                          { text: 'Non-Compete Clause', style: 'boldText' },
                          { text: ':', style: 'normal' },
                          {
                              text: `The Second Party commits to refraining from participating in competitive activities with the employer or seeking employment with a competing organization for a period of two calendar years after the conclusion or termination of the Employment Contract, regardless of whether the termination is initiated by the Second Party or mutually agreed upon.`,
                              style: 'normal',
                              alignment: 'justify'
                          }
                      ] : []
                  ].filter(row => row.length) // Filter out empty rows
              },
              layout: 'noBorders',
              margin: [0, 10, 0, 20]
          },
          { text: 'Yours Sincerely,', style: 'normal', margin: [0, 10, 0, 30] },
          {
            canvas: [
                {
                    type: 'line',
                    x1: 0,
                    y1: 0,
                    x2: 100, // Adjust width as needed
                    y2: 0,
                    lineWidth: 1
                }
            ],
            margin: [0, 30, 0, 0] // Adjust margin as needed
          },
          { text: 'MERLIN VATHANA', style: 'normal', bold: true, margin: [0, 10, 0, 0] },
          { text: 'HR Manager', style: 'normal', bold: true, margin: [0, 0, 0, 10] },
          { text: 'If you choose to accept this offer, please sign a copy of this offer and return it to us within 3 days from the receipt of this offer.', style: 'normal', margin: [0, 5, 0, 5] },
          {
              text: [
                  { text: 'Name :', style: 'normal' },
                  { text: this.offerletterdt[0].CANDIDATE_NAME + '\n', style: 'boldText' },
              ],
              margin: [0, 10, 0, 30]
          },
          {
            canvas: [
                {
                    type: 'line',
                    x1: 0,
                    y1: 0,
                    x2: 150, // Adjust width as needed
                    y2: 0,
                    lineWidth: 1
                }
            ],
            margin: [0, 30, 0, 0] // Adjust margin as needed
          },
          { text: 'I confirm acceptance after reading and understanding all the terms and conditions of the employment.', style: 'normal', margin: [0, 10, 0, 10] },
      ],
      footer: function(currentPage, pageCount) {
        return {
          text: `Page ${currentPage} of ${pageCount}`,
          alignment: 'center',
          style: 'normal',
          margin: [0, 10]
        };
      },
      pageMargins: [40, 140, 40, 60],
      styles: {
          header: { fontSize: 14, bold: true },
          subheader: { fontSize: 10, bold: true },
          title: { fontSize: 12, bold: true },
          normal: { fontSize: 9, lineHeight: 1.0 },
          boldText: { fontSize: 9, bold: true } 
      }
  };

  pdfMake.createPdf(docDefinition).download('Offer Letter.pdf');
}


}
