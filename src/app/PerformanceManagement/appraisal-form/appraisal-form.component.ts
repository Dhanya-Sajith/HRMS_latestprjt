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
  selector: 'app-appraisal-form',
  templateUrl: './appraisal-form.component.html',
  styleUrls: ['./appraisal-form.component.scss']
})
export class AppraisalFormComponent implements OnInit {

  userSession:any = this.session.getUserSession();
  //empcode: any=this.userSession.empcode;
  company:any= this.userSession.companycode;

  companydata: any;
  hostname = this.apicall.dotnetapi;  
  logo: any;
  appraisalFormdatadtls: any;
  empcodes: any;
  reqId: any;
  backcate: any;


  constructor(private datePipe: DatePipe,private session:LoginService,private apicall:ApiCallService,private route: ActivatedRoute,private http: HttpClient) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.empcodes = params['empcode'];
      this.reqId = params['reqId'];
      this.backcate = params['view'];
    }); 

    this.hostname=this.apicall.dotnetapi; 
    this.fetchAppraisalFormData();
  }

  fetchAppraisalFormData()
  {
    this.apicall.appraisalFormdata(this.empcodes,this.reqId).subscribe((res) => {
      this.appraisalFormdatadtls = res;

      this.apicall.genCompanyData(this.appraisalFormdatadtls[0].COMPANY_CODE).subscribe(async (res)=>{
        this.companydata=res; 
        this.logo = this.hostname + this.companydata[0].DATA_VALUE;
        this.logo = await this.getBase64ImageFromUrl(this.logo);
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

    // Mapping appraisal details to PDF rows
    const evaluationRows = this.appraisalFormdatadtls.map((appraisaldtl: any ) => [
      appraisaldtl.GOAL_ID,
      appraisaldtl.GOAL_DESCRIPTION,
      appraisaldtl.EMP_GOAL_SCORE.toString(),
      appraisaldtl.LM_GOAL_SCORE.toString()
    ]);

    const goalsDetails = this.appraisalFormdatadtls.map((appraisaldtl: any) => {
      return {
        table: {
          widths: ['*'],
          body: [
            [
              {
                stack: [
                  { text: appraisaldtl.GOAL_DESCRIPTION, style: 'goalDescription' },
                  { text: 'Answer', style: 'goalDetailsHeader' },
                  { text: appraisaldtl.EMP_GOAL_COMMENT, style: 'goalDetailsContent' },
                  { text: 'Line Manager Review', style: 'goalDetailsHeader' },
                  { text: appraisaldtl.LM_GOAL_COMMENT, style: 'goalDetailsContent' }
                ],
                border: [true, true, true, true], // Border on all sides
                margin: [5, 5], // Margin to create space inside the cell
              }
            ]
          ],
        },
        style: 'goalDetailsTable',
        margin: [0, 10] // Margin to separate each section
      };
    });    
    
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
                margin: [40, 10, 40, 0]  // Adjust margins to add more space around the line
            }
        ],
            
        } as ContentStack;
    },
     content: [
      {
        table: {
            widths: ['50%', '50%'],
            body: [
                [
                    { text: 'Employee Code', style: 'normal' },
                    { text: this.appraisalFormdatadtls[0].EMP_CODE, style: 'boldText' }
                ],
                [
                  { text: 'Employee', style: 'normal' },
                  { text: this.appraisalFormdatadtls[0].EMP_NAME, style: 'boldText' }
                ],
                [
                  { text: 'Joining Date', style: 'normal' },
                  { text: this.datePipe.transform(this.appraisalFormdatadtls[0].REVIEW_DATE,"dd-MM-yyyy"), style: 'boldText' }
                ],
                [
                  { text: 'Department', style: 'normal' },
                  { text: this.appraisalFormdatadtls[0].DEPARTMENT, style: 'boldText' }
                ],
                [
                  { text: 'Designation', style: 'normal' },
                  { text: this.appraisalFormdatadtls[0].DESIGNATION, style: 'boldText' }
                ],
                [
                  { text: 'Appraisal Details', style: 'normal' },
                  { text: this.appraisalFormdatadtls[0].REQUEST_STATUS, style: 'boldText' }
                ],
            ].filter(row => row.length) // Filter out empty rows
        },
        // layout: 'noBorders',
        margin: [0, 0, 0, 10]
    }, 
      // Evaluation Details
      {
        text: 'EVALUATION',
        style: 'sectionHeader',
        alignment: 'center'
      },
      // Evaluation Details
      {
        table: {
          headerRows: 1,
          widths: ['auto', '*', 'auto', 'auto'],
          body: [
            // Table Header
            [{ text: 'No', style: 'boldText' }, { text: 'Goal', style: 'boldText' }, { text: 'Self Assessment(10)', style: 'boldText' }, { text: 'LM Review', style: 'boldText' }],
            // Table Body
            ...evaluationRows,
            // Table Footer
            [{ text: 'Total Score', colSpan: 3, style: 'boldText' }, {}, {}, { text: this.appraisalFormdatadtls[0].LM_FINAL_SCORE.toString(), style: 'normal' }]
          ]
        },
        // Table Style
        style: 'normal'
      },
      ...goalsDetails,
        ],
        pageMargins: [40, 150, 40, 60],
        styles: {
            header: { fontSize: 14, bold: true },
            subheader: { fontSize: 10, bold: true },
            title: { fontSize: 12, bold: true },
            normal: { fontSize: 10, lineHeight: 1.3 },
            boldText: { fontSize: 10, bold: true } ,
            sectionHeader: { fontSize: 12, bold: true, margin: [0, 10] },
            goalDescription: { fontSize: 12, margin: [0, 5] },
            goalDetailsHeader: { fontSize: 10, bold: true, margin: [0, 5] },
            goalDetailsContent: { fontSize: 10, margin: [0, 5] },
            goalDetailsSection: { margin: [0, 10] }
        }
   };
   
   // Generate the PDF document
   pdfMake.createPdf(docDefinition).download('Appraisal Form.pdf');
   }


}
