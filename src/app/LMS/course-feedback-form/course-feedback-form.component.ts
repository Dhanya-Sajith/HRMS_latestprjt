import { Component, OnInit } from '@angular/core';
import { ApiCallService } from 'src/app/api-call.service';
import { LoginService } from 'src/app/login.service';
import { DatePipe} from '@angular/common';
import { FormControl,FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router  } from '@angular/router';

@Component({
  selector: 'app-course-feedback-form',
  templateUrl: './course-feedback-form.component.html',
  styleUrls: ['./course-feedback-form.component.scss']
})
export class CourseFeedbackFormComponent implements OnInit {

  userSession:any = this.session.getUserSession();
  authorityflg:any =this.userSession.authorityflg;
  empcode: any=this.userSession.empcode;
  empname: any=this.userSession.name;
  empid:any =this.userSession.id;
  desig: any=this.userSession.desig.split('#', 2);    
  designame:any= this.desig[1]; 
  roleid:any =this.userSession.level;
  grpname:any=this.userSession.grpname;
  company: any=this.userSession.companycode;
  companyname: any;

  requestForm: FormGroup; 
  isFormValid:boolean=false;
  showModal = 0;
  failed!: string;
  success!: string;
  trainingID: any;
  triningName: any;
  triningDate: any;


  constructor(private apicall:ApiCallService,private datePipe:DatePipe,private session:LoginService,private fb: FormBuilder,private route: ActivatedRoute,private router: Router) {
    this.requestForm = this.fb.group({
      qus1: ['', Validators.required],
      qus2: ['', Validators.required],
      qus3: ['', Validators.required],
      qus5: ['', Validators.required],
      Radio1: ['', Validators.required],
      Radio2: ['', Validators.required],
      Radio3: ['', Validators.required],
      Radio4: ['', Validators.required],
      Radio5: ['', Validators.required],
      Radio6: ['', Validators.required]
    });
   }

  ngOnInit(): void {

    this.route.queryParams
      .subscribe(params => {
        this.trainingID = params['ID'];
      }
    );

    // this.apicall.FetchCompanyName(this.empcode).subscribe((res)=>{
    //   this.companyname = res[0].DISPLAY_FIELD;
    // })

    this.apicall.GetTrainingDetails(this.trainingID).subscribe((res)=>{
      this.triningName = res.SUBJECT_NAME;
      this.triningDate = res.TRAINING_DATE;
      this.companyname = res.COMPANY_NAME;
    })
    
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

  Submit()
  {
    if (this.requestForm.valid) {

        const questionDetailsArray = [];

        const quest1= this.requestForm.get('qus1')?.value;
        const quest2= this.requestForm.get('qus2')?.value; 
        const quest3= this.requestForm.get('qus3')?.value; 
        const quest5= this.requestForm.get('qus5')?.value;
        const quest6= this.requestForm.get('Radio1')?.value;
        const quest7= this.requestForm.get('Radio2')?.value;
        const quest8= this.requestForm.get('Radio3')?.value;
        const quest9= this.requestForm.get('Radio4')?.value;
        const quest10= this.requestForm.get('Radio5')?.value;
        const quest11= this.requestForm.get('Radio6')?.value;

        const question1 = {
            questionID: 1,
            answer: [quest1]
        };
        
        const question2 = {
            questionID: 2,
            answer: [quest2,quest3]
        };
        
        const question3 = {
            questionID: 3,
            answer: [quest6]
        };
        
        const question5 = {
            questionID: 4,
            answer: [quest7]
        };
        
        const question6 = {
            questionID: 5,
            answer: [quest8]
        };
        
        const question7 = {
            questionID: 6,
            answer: [quest9]
        };
        
        const question8 = {
            questionID: 7,
            answer: [quest10]
        };
        
        const question9 = {
            questionID: 8,
            answer: [quest11]
        };
        
        const question10 = {
            questionID: 10,
            answer: [quest5]
        };
        
        // Push each question detail object into the array
        questionDetailsArray.push(question1);
        questionDetailsArray.push(question2);
        questionDetailsArray.push(question3);
        questionDetailsArray.push(question5);
        questionDetailsArray.push(question6);
        questionDetailsArray.push(question7);
        questionDetailsArray.push(question8);
        questionDetailsArray.push(question9);
        questionDetailsArray.push(question10);

        const data = {
          empcode : this.empcode,
          category : 'F',
          trainingID : this.trainingID,
          questions : questionDetailsArray,
          };

          this.apicall.AddEmpFeedback(data).subscribe(res =>{

            if(res.Errorid == 1)
            {
              this.showModal = 1; 
              this.success = "Feedback Form Submitted Successfully";
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
}
