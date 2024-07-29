import { Component, OnInit  } from '@angular/core';
import { ApiCallService } from 'src/app/api-call.service';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/login.service';
import { JsonPipe, formatDate } from '@angular/common';
import { FormControl,FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-goal-progress-tracker',
  templateUrl: './goal-progress-tracker.component.html',
  styleUrls: ['./goal-progress-tracker.component.scss']
})
export class GoalProgressTrackerComponent implements OnInit {


  userSession:any = this.session.getUserSession();
  empcode: any=this.userSession.empcode;
  roleids:any =this.userSession.level;
  grpname:any=this.userSession.grpname; 
  assessmentdtls: any;
 // goalassessmentdtls: any;
  goalprogressdtls: any;
  //averageScore: any;
 // averageScoreLM: any;
  showModals: any;
  successs: any;
  faileds: any;
  category: any;
  weightagemark: any;
  reqId: any;
  empcodes: any;
  goalassessmentdtls: any[] = [];
  averageScore: number = 0;
  averageScoreLM: number = 0;
  currentDate: any;
  today: any;
  isButtonDisabled: boolean = false;
  backcate: any;
  


  constructor(private datePipe: DatePipe,private session:LoginService,private apicall:ApiCallService,private router:Router,private fb: FormBuilder,private route: ActivatedRoute) { }

  ngOnInit(): void {


    this.route.queryParams.subscribe(params => {
       this.empcodes = params['empcode'];
       this.reqId = params['reqId'];
       this.category = params['flag'];
       this.backcate = params['view'];
    }); 


  this.listassessmentDetails();

  this.currentDate = new Date();

  const now = new Date();
  this.today = now.toISOString().split('T')[0];

  // if(this.roleids==15 ||  this.roleids==11 ||  this.roleids==3 || this.roleids==6 || this.roleids==5 || this.roleids==2 || this.roleids==1 || this.roleids==12|| this.roleids==13)
  //   {
  //     this.category=2;
  //   }
  //   else
  //   {
  //     this.category=1;
  //   }

// if(this.grpname.includes('LM') && (!this.grpname.includes('LM-HR') ) ) 
// if(this.grpname.includes('LM')) 
//  {
//     this.category=2;
//  }
//  else if (this.grpname.includes('HR') && this.grpname.includes('LM-HR'))
//  {
//     this.category=2;
//  }
//  else
//  {
//     this.category=1;
//  }

 //alert(this.category)

  }


  // listassessmentDetails()
  // {
 
  
  //     this.apicall.goalassessmentdetails(this.empcodes,this.reqId).subscribe((res) => {
  //     this.goalassessmentdtls = res;

  //     if (this.goalassessmentdtls && this.goalassessmentdtls.length > 0) {
  //       let totalScore = this.goalassessmentdtls.reduce((sum:any, item:any) => sum + item.EMP_GOAL_SCORE, 0);
  //       this.averageScore = totalScore / this.goalassessmentdtls.length;
  //   } else {
  //       this.averageScore = 0; 
  //   }

  //   if (this.goalassessmentdtls && this.goalassessmentdtls.length > 0) {
  //     let totalScore = this.goalassessmentdtls.reduce((sum:any, item:any) => sum + item.LM_GOAL_SCORE, 0);
  //     this.averageScoreLM = totalScore / this.goalassessmentdtls.length;
  // } else {
  //     this.averageScoreLM = 0; 
  // }

  //   })
  // }

  listassessmentDetails() {
    this.apicall.goalassessmentdetails(this.empcodes,this.reqId).subscribe((res) => {
      this.goalassessmentdtls = res;
      this.calculateAverages(); // Calculate averages when data is fetched
    });
  }

  calculateAverages() {
    if (this.goalassessmentdtls && this.goalassessmentdtls.length > 0) {
      let totalScore = this.goalassessmentdtls.reduce((sum: number, item: any) => 
        sum + (Number(item.EMP_GOAL_SCORE) || 0), 0);
      this.averageScore = totalScore / this.goalassessmentdtls.length;

      let totalScoreLM = this.goalassessmentdtls.reduce((sum: number, item: any) => 
        sum + (Number(item.LM_GOAL_SCORE) || 0), 0);
      this.averageScoreLM = totalScoreLM / this.goalassessmentdtls.length;
    } else {
      this.averageScore = 0; // Handle the case where there are no scores
      this.averageScoreLM = 0; // Handle the case where there are no scores
    }
  }

  onScoreChange() {
    this.calculateAverages(); // Recalculate averages when scores are changed
  }



  goalprogressdtl(goalId:any)
  {
    this.apicall.goalpogressdetails(this.empcodes,this.reqId,goalId).subscribe((res) => {
    this.goalprogressdtls = res;
    })
  }


  updateprogresstrack(stageId:any,goalId:any,weightage:any,emp_cmmt:any,lm_comment:any)
  {

    let commentdtls: any; // Declare commentdtls variable outside the if-else block

    if (this.category == 1) {
      commentdtls = emp_cmmt; // Assign value to commentdtls for category 1
    } else {
      commentdtls = lm_comment; // Assign value to commentdtls for other categories
    }
  
      const data = {
        reqid : this.reqId,
        empcode : this.empcodes,
        updatedby : this.empcode,
        viewflag : this.category,
        goalid :  goalId,
        stageid :  stageId,
        comments : commentdtls,
        weightage : weightage,
        };

        this.apicall.updateProgresstrack(data).subscribe(res =>{
          //  alert(res.Errorid);
            if(res.Errorid!=0){
              (<HTMLInputElement>document.getElementById("openModalButtonForalertsuccess")).click();
              this.showModals = 1;
              this.successs = "Updated Successfully";
            }
            else{
              (<HTMLInputElement>document.getElementById("openModalButtonForalertsuccess")).click();
              this.showModals = 2;
              this.faileds = "Failed!";
            }  

          })   
      

  }






  // {"reqid": "1",
  //   "empcode": "MH00127",
  //   "updatedby": "MJ00012",
  //   "viewflag": "2",
  //   "remarks": "Goals are completed successfully",
  //   "avg_score": "9.5",
  //   "ScoreDetails":[{"goalid":1,"comment":"Good work","score":10},{"goalid":2,"comment":"completed","score":9}]}
    
    
  updateassessmenttrack() {

    let avgScore: any;
    let ScoreDtls: any[] = []; // Initialize ScoreDtls as an empty array

    // Determine avgScore based on category
    if (this.category == 1) {
        avgScore = (<HTMLInputElement>document.getElementById("avgscoreEmp")).value;
    } else {
        avgScore = (<HTMLInputElement>document.getElementById("avgscoreLm")).value;
    }

    // Iterate through goalassessmentdtls to capture updated values
    this.goalassessmentdtls.forEach((assessdtl: any) => {
        let comment: string;
        let score: string;

        // Determine comment and score based on category
        if (this.category == 1) {
            comment = assessdtl.EMP_GOAL_COMMENT;
            score = assessdtl.EMP_GOAL_SCORE;
        } else {
            comment = assessdtl.LM_GOAL_COMMENT;
            score = assessdtl.LM_GOAL_SCORE;
        }

        // Push updated values to ScoreDtls
        ScoreDtls.push({
            goalid: assessdtl.GOAL_ID,
            comment: comment,
            score: score
        });
    });

    // Prepare data object for API call
    const data = {
        reqid: this.reqId,
        empcode: this.empcodes, // Replace with actual empcode
        updatedby: this.empcode, // Ensure empcode is properly set in your component
        viewflag: this.category,
        avg_score: avgScore,
        ScoreDetails: ScoreDtls
    };

    alert(JSON.stringify(data)); // For testing purposes

    // Make API call to update assessment track
    this.apicall.updateassessmenttrack(data).subscribe(res => {
        if (res.Errorid != 0) {
            // Success alert
            (<HTMLInputElement>document.getElementById("openModalButtonForalertsuccess")).click();
            this.showModals = 1;
            this.successs = "Updated Successfully";
        } else {
            // Failure alert
            (<HTMLInputElement>document.getElementById("openModalButtonForalertsuccess")).click();
            this.showModals = 2;
            this.faileds = "Failed!";
        }
    });
}


  sendForassessment()
  {

    const sendremarks = (<HTMLInputElement>document.getElementById("sendremarks")).value;
    const checkbox = (<HTMLInputElement>document.getElementById("formCheck10"))
    const markasvalue = checkbox.checked ? checkbox.value : "0";

    const data = {
      empcode: this.empcodes,
      verified_by: this.empcode,
      remarks: sendremarks,
      reqid:this.reqId,
      mflag:markasvalue,
  };

  alert(JSON.stringify(data));

  this.apicall.appRejGoalEvaluation(data).subscribe(res =>{
    //  alert(res.Errorid);
      if(res.Errorid!=0){
        (<HTMLInputElement>document.getElementById("openModalButtonForalertsuccess")).click();
        this.showModals = 1;
        this.successs = "Send Successfully";
      }
      else{
        (<HTMLInputElement>document.getElementById("openModalButtonForalertsuccess")).click();
        this.showModals = 2;
        this.faileds = "Failed!";
      }  

    }) 


  }

  markcheck() {
    const checkbox = document.getElementById('formCheck10') as HTMLInputElement;
    if (checkbox) {
      const markasvalue = checkbox.checked ? checkbox.value : '0';
      this.isButtonDisabled = markasvalue == '1'; // Enable button if value is '1'
    } 
  }


}
