import { Component, OnInit } from '@angular/core';
import { ApiCallService } from 'src/app/api-call.service';
import { LoginService } from 'src/app/login.service';
import { DatePipe} from '@angular/common';
import { FormControl,FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router  } from '@angular/router';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-candidate-evaluation',
  templateUrl: './candidate-evaluation.component.html',
  styleUrls: ['./candidate-evaluation.component.scss']
})
export class CandidateEvaluationComponent implements OnInit {
  userSession:any = this.session.getUserSession();
  empcode: any=this.userSession.empcode;
  empId: any=this.userSession.id;
  level:any =this.userSession.level;
  listdetails: any;
  cand_id:any;
  requestForm: FormGroup; 
  isFormValid:boolean=false;
  counter: number = 2;
  view: any;
  isDisabled = false;
  req_Id: any;
  Candidate_Nme: any;
  candidate_Id: any;
  deprtment: any;
  evaluator_Id: any;
  evaluator_Name: any;
  evaluation_Date: any;
  designation: any;
  showModal = 0;
  failed!: string;
  success!: string;
  fillform: any;
  questionnaireAnswers: any;
  selectedReasons: any;
  qus1: any;
  qus2: any;
  com1: any;
  com2: any;
  com3: any;
  com4: any;
  com5: any;
  qus3: any;
  qus4: any;
  qus5: any;
  qus6: any;
  com6: any;
  com7: any;
  com8: any;
  com9: any;
  tempreqid:number=1;
  requst_Id: any;
  Page: any;


  constructor(private apicall:ApiCallService,private session:LoginService,private fb: FormBuilder,private route: ActivatedRoute,private router: Router) { 
    this.requestForm = this.fb.group({
 
      Radio1: ['', Validators.required],
      Radio2: ['', Validators.required],
      Radio3: ['', Validators.required],
      Radio4: ['', Validators.required],
      Radio5: ['', Validators.required],
      Radio6: ['', Validators.required],
      cmmt1: [''],
      cmmt2: [''],
      cmmt3: [''],
      cmmt4: [''],
      cmmt5: [''],
      cmmt6: [''],
      cmmt7: ['', Validators.required],
      cmmt8: ['', Validators.required],
      cmmt9: ['', Validators.required],
      resultt:['', Validators.required]

    });    
  }

  ngOnInit(): void {
    this.route.queryParams
      .subscribe(params => {
        this.cand_id= params['ID'];
        this.requst_Id= params['REQ_ID'];
        this.view = params['VIEW']; 
        this.Page = params['Page'];
      }
    );
    this.apicall.FetchCandidateDetails(this.cand_id).subscribe((res)=>{
      this.req_Id = res[0].REQUEST_ID;
      this.candidate_Id = res[0].CANDIDATE_ID;
      this.Candidate_Nme = res[0].CANDIDATE_NAME;
      this.designation = res[0].DESIGNATION;
      this.deprtment = res[0].DEPARTMENT;
      this.evaluator_Id = res[0].EVALUATOR_ID;
      this.evaluator_Name = res[0].EVALUATOR_NAME;
      this.evaluation_Date = res[0].EVALUATION_DATE;      

    })
    if(this.view == 1){
      this.ViewCandidateDetails();
      
      this.isDisabled = true;
    }else{
      this.isDisabled = false;
    }
  }
  ViewCandidateDetails(){
  this.apicall.ViewCandidateDetails(this.cand_id).subscribe((res)=>{
    this.fillform = res       
    this.questionnaireAnswers = this.fillform[0].EvaluationDetails;
    
    this.qus1 = this.questionnaireAnswers[0].ANSW_ID;
    this.com1 = this.questionnaireAnswers[0].COMMENTS;
    this.qus2 = this.questionnaireAnswers[1].ANSW_ID;
    this.com2 = this.questionnaireAnswers[1].COMMENTS;
    this.qus3 = this.questionnaireAnswers[2].ANSW_ID;
    this.com3 = this.questionnaireAnswers[2].COMMENTS;
    this.qus4 = this.questionnaireAnswers[3].ANSW_ID;
    this.com4 = this.questionnaireAnswers[3].COMMENTS;
    this.qus5 = this.questionnaireAnswers[4].ANSW_ID;
    this.com5 = this.questionnaireAnswers[4].COMMENTS;
    this.qus6 = this.questionnaireAnswers[5].ANSW_ID;
    this.com6 = this.questionnaireAnswers[5].COMMENTS;
    this.com7 = this.questionnaireAnswers[6].COMMENTS;
    this.com8 = this.questionnaireAnswers[7].COMMENTS;
    this.com9 = this.questionnaireAnswers[8].COMMENTS;


     this.requestForm.controls['resultt'].setValue(res[0].RESULT);
    this.requestForm.controls['Radio1'].setValue(this.qus1);
    this.requestForm.controls['cmmt1'].setValue(this.com1);
    this.requestForm.controls['Radio2'].setValue(this.qus2);
    this.requestForm.controls['cmmt2'].setValue(this.com2);
    this.requestForm.controls['Radio3'].setValue(this.qus3);
    this.requestForm.controls['cmmt3'].setValue(this.com3);
    this.requestForm.controls['Radio4'].setValue(this.qus4);
    this.requestForm.controls['cmmt4'].setValue(this.com4);
    this.requestForm.controls['Radio5'].setValue(this.qus5);
    this.requestForm.controls['cmmt5'].setValue(this.com5);
    this.requestForm.controls['Radio6'].setValue(this.qus6);
    this.requestForm.controls['cmmt6'].setValue(this.com6);
    this.requestForm.controls['cmmt7'].setValue(this.com7);
    this.requestForm.controls['cmmt8'].setValue(this.com8);
    this.requestForm.controls['cmmt9'].setValue(this.com9);
  })
}
  generateId(): number {
    this.counter++;
    return  this.counter;
  }
  
  validateForm()
  {   
    if (this.requestForm.valid){
      this.isFormValid = true;      
      (<HTMLInputElement>document.getElementById("cancelModalButton")).click();
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
  AddCandidateEvalution()
  {
    if(this.requestForm.valid){
    const candidateDetailsArray = [];

    const quest1= this.requestForm.get('Radio1')?.value;
    const quest2= this.requestForm.get('Radio2')?.value;
    const quest3= this.requestForm.get('Radio3')?.value;
    const quest4= this.requestForm.get('Radio4')?.value;
    const quest5= this.requestForm.get('Radio5')?.value;
    const quest6= this.requestForm.get('Radio6')?.value;
    const cmmt1= this.requestForm.get('cmmt1')?.value;
    const cmmt2= this.requestForm.get('cmmt2')?.value;
    const cmmt3= this.requestForm.get('cmmt3')?.value;
    const cmmt4= this.requestForm.get('cmmt4')?.value;
    const cmmt5= this.requestForm.get('cmmt5')?.value;
    const cmmt6= this.requestForm.get('cmmt6')?.value;
    const cmmt7= this.requestForm.get('cmmt7')?.value;
    const cmmt8= this.requestForm.get('cmmt8')?.value;
    const cmmt9= this.requestForm.get('cmmt9')?.value;
    const result= this.requestForm.get('resultt')?.value;


    
    const question1 = {
      categoryID: 1,
      answerID: quest1,
      comments:cmmt1
  };
  
  const question2 = {
    categoryID: 2,
    answerID: quest2,
    comments:cmmt2
  };
  
  const question3 = {
    categoryID: 3,
    answerID: quest3,
    comments:cmmt3
  };
  
  const question4 = {
    categoryID: 4,
    answerID: quest4,
    comments:cmmt4
  };
  
  const question5 = {
    categoryID: 5,
    answerID: quest5,
    comments:cmmt5
  };
  
  const question6 = {
    categoryID: 6,
    answerID: quest6,
    comments:cmmt6
  };

  const question7 = {
    categoryID: 7,
    comments:cmmt7
  };
  const question8 = {
    categoryID: 8,
    comments:cmmt8
  };
  const question9 = {
    categoryID: 9,
    comments:cmmt9
  };


  
  // Push each question detail object into the array
  candidateDetailsArray.push(question1);
  candidateDetailsArray.push(question2);
  candidateDetailsArray.push(question3);
  candidateDetailsArray.push(question4);
  candidateDetailsArray.push(question5);
  candidateDetailsArray.push(question6);
  candidateDetailsArray.push(question7);
  candidateDetailsArray.push(question8);
  candidateDetailsArray.push(question9);

  const data = {
    reqid :this.requst_Id,
    candidate_id :this.cand_id,
    result :result ,
    questions : candidateDetailsArray,
    };
    //alert(JSON.stringify(data))
    this.apicall.SaveCandidateDetails(data).subscribe(res =>{
      if(res.Errorid == 1)
      {
        (<HTMLInputElement>document.getElementById("openModalButton")).click();
        this.showModal = 1;
        this.success = "Evaluation Form Submitted Successfully";
        this.ViewCandidateDetails();
        this.isDisabled = true;
        this.view=1;
      }
      else        
      {
        (<HTMLInputElement>document.getElementById("openModalButton")).click();
        this.showModal = 2; 
        this.failed = "Failed";
        this.Clear();
      }   
    })
  }
  else
  {
    this.markFormGroupTouched(this.requestForm); 
  }
  }
  Clear()
  {
    this.requestForm.reset();
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
  
        pdf.save('CandidateEvaluation.pdf');
      }).catch((error) => {
        console.error('Error during html2canvas conversion:', error);
      });
    } else {
      console.error("Element with ID 'htmlElementId' not found");
    }
  }
}
