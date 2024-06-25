import { Component, OnInit } from '@angular/core';
import { ApiCallService } from 'src/app/api-call.service';
import { LoginService } from 'src/app/login.service';
import { DatePipe} from '@angular/common';
import { FormControl,FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router  } from '@angular/router';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-exitinterviewform',
  templateUrl: './exitinterviewform.component.html',
  styleUrls: ['./exitinterviewform.component.scss']
})
export class ExitinterviewformComponent implements OnInit {

  userSession:any = this.session.getUserSession();
  authorityflg:any =this.userSession.authorityflg;
  empcode: any=this.userSession.empcode;
  company: any=this.userSession.companycode;

  requestForm: FormGroup; 
  isFormValid:boolean=false;
  showModal = 0;
  failed!: string;
  success!: string;
  empdtl: any;
  companyData: any;
  reasons: { id: number, value: string }[] = [
    { id: 1,  value: 'Higher pay' },
    { id: 2,  value: 'Better benefits' },
    { id: 3,  value: 'Better career opportunity' },
    { id: 4,  value: 'Improved work life balance' },
    { id: 5,  value: 'Career change' },
    { id: 6,  value: 'Closer to home' },
    { id: 7,  value: 'Conflict with other employees' },
    { id: 8,  value: 'Conflict with managers' },
    { id: 9,  value: 'Family and/or personal reasons' },
    { id: 10,  value: 'Company instability' },
    { id: 11,  value: 'Other' },
  ];
  selectedReasons: string[] = [];
  fillform: any;
  questionnaireAnswers: any;
  isDisabled = false;
  empcd: any;
  view: any;
  reqid: any;

  constructor(private apicall:ApiCallService,private datePipe:DatePipe,private session:LoginService,private fb: FormBuilder,private route: ActivatedRoute,private router: Router) {
    this.requestForm = this.fb.group({
      // qus1: ['', Validators.required],
      qus2: ['', Validators.required],
      qus3: ['', Validators.required],
      qus4: ['', Validators.required],
      qus5: ['', Validators.required],
      qus6: ['', Validators.required],
      qus7: ['', Validators.required],
      qus8: ['', Validators.required],
      qus9: ['', Validators.required],
      qus10: ['', Validators.required],
      qus11: ['', Validators.required],
      qus12: ['', Validators.required],
      qus13: ['', Validators.required],
      qus14: ['', Validators.required],
      qus15: ['', Validators.required],
      qus16: ['', Validators.required],
      qus17: ['', Validators.required],
      qus18: ['', Validators.required],
      qus19: ['', Validators.required],
      qus20: ['', Validators.required],
      qus21: ['', Validators.required],
      qus22: ['', Validators.required],
      qus23: ['', Validators.required],
      qus24: ['', Validators.required],
      qus25: ['', Validators.required],
      qus26: ['', Validators.required],
      qus27: ['', Validators.required],
      qus28: ['', Validators.required],
      qus29: ['', Validators.required],
      qus30: ['', Validators.required],
      qus31: ['', Validators.required],
      qus32: ['', Validators.required],
      qus33: ['', Validators.required],
      qus34: ['', Validators.required],
      qus35: ['', Validators.required],
      qus36: ['', Validators.required],
      qus37: ['', Validators.required],
      qus38: ['', Validators.required],
      qus39: ['', Validators.required],
      qus40: ['', Validators.required],
      qus41: ['', Validators.required],
      qus42: ['', Validators.required],
      qus43: ['', Validators.required],
      qus44: ['', Validators.required],
      qus45: ['', Validators.required],
      qus46: ['', Validators.required],
      qus47: ['', Validators.required]
    });
   }

  ngOnInit(): void {

    this.route.queryParams
    .subscribe(params => {
      this.reqid = params['REQID'];
      this.empcd = params['CODE']; 
      this.view = params['VIEW']; 
    }
   );

    this.apicall.Fetch_EmpDetails_ExitInterview(this.empcode,this.reqid).subscribe((res)=>{
      this.empdtl = res;
    })
    this.apicall.genCompanyData(this.company).subscribe((res)=>{
      this.companyData=res; 
    })

    if(this.view == 1){
      this.FetchQuestions(this.empcd);
      this.isDisabled = true;
    }else{
      this.isDisabled = false;
    }
    
  }

  validateForm()
  {
    if (this.requestForm.valid){
      this.isFormValid = true;
      }
      else{
        this.markFormGroupTouched(this.requestForm);
      }
  }

  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
    });
  }

  getSelectedAnswers() {
    return this.requestForm.get('qus1')?.value || [];
  }
  
  updateSelectedReasons(value: string, event: any) {
    if (event.target.checked) {
        this.selectedReasons.push(value);
    } else {
        const index = this.selectedReasons.indexOf(value);
        if (index !== -1) {
            this.selectedReasons.splice(index, 1);
        }
    }
  }

  
  Submit()
  {
    if(this.requestForm.valid){

      const selectedReasonsString = this.selectedReasons.join(', ');

      interface QuestProperties {
        [key: string]: string | undefined; 
      }

      const questProperties: QuestProperties = {

       quest1: selectedReasonsString,
       quest2: this.requestForm.get('qus2')?.value,
       quest3: this.requestForm.get('qus3')?.value,
       quest4:this.requestForm.get('qus4')?.value,
       quest5: this.requestForm.get('qus5')?.value,
       quest6: this.requestForm.get('qus6')?.value,
       quest7: this.requestForm.get('qus7')?.value,
       quest8: this.requestForm.get('qus8')?.value,
       quest9: this.requestForm.get('qus9')?.value,
       quest10: this.requestForm.get('qus10')?.value,
       quest11: this.requestForm.get('qus11')?.value,
       quest12: this.requestForm.get('qus12')?.value,
       quest13: this.requestForm.get('qus13')?.value,
       quest14: this.requestForm.get('qus14')?.value,
       quest15: this.requestForm.get('qus15')?.value,
       quest16: this.requestForm.get('qus16')?.value,
       quest17: this.requestForm.get('qus17')?.value,
       quest18: this.requestForm.get('qus18')?.value,
       quest19: this.requestForm.get('qus19')?.value,
       quest20: this.requestForm.get('qus20')?.value,
       quest21: this.requestForm.get('qus21')?.value,
       quest22: this.requestForm.get('qus22')?.value,
       quest23: this.requestForm.get('qus23')?.value,
       quest24: this.requestForm.get('qus24')?.value,
       quest25: this.requestForm.get('qus25')?.value,
       quest26: this.requestForm.get('qus26')?.value,
       quest27: this.requestForm.get('qus27')?.value,
       quest28: this.requestForm.get('qus28')?.value,
       quest29: this.requestForm.get('qus29')?.value,
       quest30: this.requestForm.get('qus30')?.value,
       quest31: this.requestForm.get('qus31')?.value,
       quest32: this.requestForm.get('qus32')?.value,
       quest33: this.requestForm.get('qus33')?.value,
       quest34: this.requestForm.get('qus34')?.value,
       quest35: this.requestForm.get('qus35')?.value,
       quest36: this.requestForm.get('qus36')?.value,
       quest37: this.requestForm.get('qus37')?.value,
       quest38: this.requestForm.get('qus38')?.value,
       quest39: this.requestForm.get('qus39')?.value,
       quest40: this.requestForm.get('qus40')?.value,
       quest41: this.requestForm.get('qus41')?.value,
       quest42: this.requestForm.get('qus42')?.value,
       quest43: this.requestForm.get('qus43')?.value,
       quest44: this.requestForm.get('qus44')?.value,
       quest45: this.requestForm.get('qus45')?.value,
       quest46: this.requestForm.get('qus46')?.value,
       quest47: this.requestForm.get('qus47')?.value,
      };

      // Access properties from the questProperties object
      const questions = [];

      for (let i = 1; i <= 47; i++) {
        questions.push({
            questionID: i,
            answer: questProperties['quest' + i]
        });
      }


      const data = {
        empcode : this.empcode,
        reqid:1,
        questions : questions
        };

        alert(JSON.stringify(data))

        this.apicall.AddEmp_ExitInterviewForm(data).subscribe(res =>{
            
            if(res.Errorid == 1)
            {
              this.showModal = 1; 
              this.success = "Exit Interview Qustionnaire Submitted Successfully";
              this.Clear();
            }
            else        
            {
              this.showModal = 2; 
              this.failed = "Failed";
              this.Clear();
            }   
          })
    }
    else{
      this.markFormGroupTouched(this.requestForm); 
    }
  }

  Clear()
  {
    this.requestForm.reset();
  }

  isChecked(reason: string): boolean {
    return this.selectedReasons.includes(reason);
  }

  FetchQuestions(code:any)
  {
    this.apicall.View_ExitInterviewDetails(code).subscribe((res)=>{
      this.fillform = res
      this.questionnaireAnswers = this.fillform[0].Questionnaire;
      if (this.questionnaireAnswers['1']) {
        this.selectedReasons = this.questionnaireAnswers['1'].split(',').map((reason: string) => reason.trim());
        // alert(JSON.stringify( this.selectedReasons))
      }

      // this.requestForm.controls['qus1'].setValue(this.questionnaireAnswers['1']);
      this.requestForm.controls['qus2'].setValue(this.questionnaireAnswers['2']);
      this.requestForm.controls['qus3'].setValue(this.questionnaireAnswers['3']);
      this.requestForm.controls['qus4'].setValue(this.questionnaireAnswers['4']);
      this.requestForm.controls['qus5'].setValue(this.questionnaireAnswers['5']);
      this.requestForm.controls['qus6'].setValue(this.questionnaireAnswers['6']);
      this.requestForm.controls['qus7'].setValue(this.questionnaireAnswers['7']);
      this.requestForm.controls['qus8'].setValue(this.questionnaireAnswers['8']);
      this.requestForm.controls['qus9'].setValue(this.questionnaireAnswers['9']);
      this.requestForm.controls['qus10'].setValue(this.questionnaireAnswers['10']);
      this.requestForm.controls['qus11'].setValue(this.questionnaireAnswers['11']);
      this.requestForm.controls['qus12'].setValue(this.questionnaireAnswers['12']);
      this.requestForm.controls['qus13'].setValue(this.questionnaireAnswers['13']);
      this.requestForm.controls['qus14'].setValue(this.questionnaireAnswers['14']);
      this.requestForm.controls['qus15'].setValue(this.questionnaireAnswers['15']);
      this.requestForm.controls['qus16'].setValue(this.questionnaireAnswers['16']);
      this.requestForm.controls['qus17'].setValue(this.questionnaireAnswers['17']);
      this.requestForm.controls['qus18'].setValue(this.questionnaireAnswers['18']);
      this.requestForm.controls['qus19'].setValue(this.questionnaireAnswers['19']);
      this.requestForm.controls['qus20'].setValue(this.questionnaireAnswers['20']);
      this.requestForm.controls['qus21'].setValue(this.questionnaireAnswers['21']);
      this.requestForm.controls['qus22'].setValue(this.questionnaireAnswers['22']);
      this.requestForm.controls['qus23'].setValue(this.questionnaireAnswers['23']);
      this.requestForm.controls['qus24'].setValue(this.questionnaireAnswers['24']);
      this.requestForm.controls['qus25'].setValue(this.questionnaireAnswers['25']);
      this.requestForm.controls['qus26'].setValue(this.questionnaireAnswers['26']);
      this.requestForm.controls['qus27'].setValue(this.questionnaireAnswers['27']);
      this.requestForm.controls['qus28'].setValue(this.questionnaireAnswers['28']);
      this.requestForm.controls['qus29'].setValue(this.questionnaireAnswers['29']);
      this.requestForm.controls['qus30'].setValue(this.questionnaireAnswers['30']);
      this.requestForm.controls['qus31'].setValue(this.questionnaireAnswers['31']);
      this.requestForm.controls['qus32'].setValue(this.questionnaireAnswers['32']);
      this.requestForm.controls['qus33'].setValue(this.questionnaireAnswers['33']);
      this.requestForm.controls['qus34'].setValue(this.questionnaireAnswers['34']);
      this.requestForm.controls['qus35'].setValue(this.questionnaireAnswers['35']);
      this.requestForm.controls['qus36'].setValue(this.questionnaireAnswers['36']);
      this.requestForm.controls['qus37'].setValue(this.questionnaireAnswers['37']);
      this.requestForm.controls['qus38'].setValue(this.questionnaireAnswers['38']);
      this.requestForm.controls['qus39'].setValue(this.questionnaireAnswers['39']);
      this.requestForm.controls['qus40'].setValue(this.questionnaireAnswers['40']);
      this.requestForm.controls['qus41'].setValue(this.questionnaireAnswers['41']);
      this.requestForm.controls['qus42'].setValue(this.questionnaireAnswers['42']);
      this.requestForm.controls['qus43'].setValue(this.questionnaireAnswers['43']);
      this.requestForm.controls['qus44'].setValue(this.questionnaireAnswers['44']);
      this.requestForm.controls['qus45'].setValue(this.questionnaireAnswers['45']);
      this.requestForm.controls['qus46'].setValue(this.questionnaireAnswers['46']);
      this.requestForm.controls['qus47'].setValue(this.questionnaireAnswers['47']);
    })
  }

  convertToPDF() {
    const element = document.getElementById('htmlElementId'); 
    
    if (element) {
      html2canvas(element).then((canvas) => {
        const contentDataURL = canvas.toDataURL('image/jpeg');
        const pdf = new jsPDF('portrait', 'mm', 'a4'); 
  
        const imgWidth = 208;
        const pageHeight = 295;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
  
        let position = 10;
  
        pdf.rect(0, 0, pdf.internal.pageSize.width, pdf.internal.pageSize.height);
  
        pdf.addImage(contentDataURL, 'JPEG', (pdf.internal.pageSize.width - imgWidth) / 2, position, imgWidth, imgHeight);
        heightLeft -= pageHeight - position;
  
        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.rect(0, 0, pdf.internal.pageSize.width, pdf.internal.pageSize.height);
          pdf.addImage(contentDataURL, 'JPEG', (pdf.internal.pageSize.width - imgWidth) / 2, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }
  
        pdf.save('Exit Interview Questionnaire.pdf');
      }).catch((error) => {
        console.error('Error during html2canvas conversion:', error);
      });
    } else {
      console.error("Element with ID 'htmlElementId' not found");
    }
  }
  
  
  
  
  

}
