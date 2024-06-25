import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiCallService } from 'src/app/api-call.service';
import { LoginService } from 'src/app/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-take-assessment',
  templateUrl: './take-assessment.component.html',
  styleUrls: ['./take-assessment.component.scss']
})
export class TakeAssessmentComponent implements OnInit {

  listTrainingDtls: any;
  id: any;
  userSession:any = this.session.getUserSession();
  empcode: any=this.userSession.empcode;
  takeassessmntdtls: any;

  constructor(private router:Router,private route: ActivatedRoute,private session:LoginService,private apicall:ApiCallService) { }

  ngOnInit(): void {
     
    this.route.queryParams.subscribe(params => {
      this.id = params['Id'];
      });
  
      this.apicall.GetTrainingDetails(this.id).subscribe((res)=>{
        this.listTrainingDtls=res;
      })
      
     this.fetchtakeAssessmentdtls() 
  }

  fetchtakeAssessmentdtls()
  {
    this.apicall.GetEmpAssessment_Details(this.id,this.empcode).subscribe((res)=>{
      this.takeassessmntdtls=res;
     // alert(JSON.stringify(this.takeassessmntdtls))
    })
  }

  navigateTo_Questionspage(TrainingId:any,atemptId:any)
  {
    this.router.navigate(['/assessment_questions'], { queryParams: { Id: TrainingId ,AId: atemptId} });
  }

}
