import { Component, OnInit } from '@angular/core';
import { ApiCallService } from 'src/app/api-call.service';
import { LoginService } from 'src/app/login.service';
import { DatePipe} from '@angular/common';
import { FormControl,FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router  } from '@angular/router';

@Component({
  selector: 'app-course-effectiveness-feedback',
  templateUrl: './course-effectiveness-feedback.component.html',
  styleUrls: ['./course-effectiveness-feedback.component.scss']
})
export class CourseEffectivenessFeedbackComponent implements OnInit {

  userSession:any = this.session.getUserSession();
  authorityflg:any =this.userSession.authorityflg;
  empcode: any=this.userSession.empcode;
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
  empcd: any;
  triningName: any;
  triningDate: any;
  empname: any;
  designame: any;
  fillform: any;
  view: any;
  isDisabled = false;

  constructor(private apicall:ApiCallService,private datePipe:DatePipe,private session:LoginService,private fb: FormBuilder,private route: ActivatedRoute,private router: Router) { 
    this.requestForm = this.fb.group({
      qus1: ['', Validators.required],
      qus2: ['', Validators.required],
      Radio1: ['', Validators.required],
      Radio2: ['', Validators.required],
      Radio3: ['', Validators.required],
      Radio4: ['', Validators.required]
    });
  }

  ngOnInit(): void {

    this.route.queryParams
      .subscribe(params => {
        this.trainingID = params['ID']; 
        this.empcd = params['CODE']; 
        this.view = params['VIEW']; 
      }
    );

    this.apicall.FetchEmployeeDesignationAndDOJ(this.empcd).subscribe((res)=>{
      this.empname = res[0].EMP_NAME;
      this.designame = res[0].DESIGNATION;
    })

    this.apicall.GetTrainingDetails(this.trainingID).subscribe((res)=>{
      this.triningName = res.SUBJECT_NAME;
      this.triningDate = res.TRAINING_DATE;
      this.companyname = res.COMPANY_NAME;
    })

    if(this.view == 1){
      this.apicall.ViewEmpEffectivenessDetails(this.trainingID,this.empcd).subscribe((res)=>{
        this.fillform = res
        this.requestForm.controls['qus1'].setValue(this.fillform.Q1);
        this.requestForm.controls['qus2'].setValue(this.fillform.Q6);
        this.requestForm.controls['Radio1'].setValue(this.fillform.Q2);
        this.requestForm.controls['Radio2'].setValue(this.fillform.Q3);
        this.requestForm.controls['Radio3'].setValue(this.fillform.Q4);
        this.requestForm.controls['Radio4'].setValue(this.fillform.Q5);
      })
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

  Submit()
  {
    if(this.requestForm.valid){
      const questionDetailsArray = [];

      const quest1= this.requestForm.get('qus1')?.value;
      const quest2= this.requestForm.get('Radio1')?.value;
      const quest3= this.requestForm.get('Radio2')?.value;
      const quest4= this.requestForm.get('Radio3')?.value;
      const quest5= this.requestForm.get('Radio4')?.value;
      const quest6= this.requestForm.get('qus2')?.value;

      const question1 = {
          questionID: 1,
          answer: quest1
      };
      
      const question2 = {
          questionID: 2,
          answer: quest2
      };
      
      const question3 = {
          questionID: 3,
          answer: quest3
      };
      
      const question4 = {
          questionID: 4,
          answer: quest4
      };
      
      const question5 = {
          questionID: 5,
          answer: quest5
      };
      
      const question6 = {
          questionID: 6,
          answer: quest6
      };
  
      
      // Push each question detail object into the array
      questionDetailsArray.push(question1);
      questionDetailsArray.push(question2);
      questionDetailsArray.push(question3);
      questionDetailsArray.push(question4);
      questionDetailsArray.push(question5);
      questionDetailsArray.push(question6);

      const data = {
        empcode : this.empcd,
        category : 'E',
        trainingID : this.trainingID,
        questions : questionDetailsArray,
        updatedby  : this.empcode
        };

        this.apicall.AddEmpEffectiveForm(data).subscribe(res =>{
            
            if(res.Errorid == 1)
            {
              this.showModal = 1; 
              this.success = "Effectiveness Feedback Form Submitted Successfully";
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
    // this.router.navigateByUrl('/course_effectiveness');
  }

  Clear()
  {
    this.requestForm.reset();
  }

}
