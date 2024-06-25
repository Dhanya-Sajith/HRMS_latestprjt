import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiCallService } from 'src/app/api-call.service';
import { LoginService } from 'src/app/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-assessment-questions',
  templateUrl: './assessment-questions.component.html',
  styleUrls: ['./assessment-questions.component.scss']
})
export class AssessmentQuestionsComponent implements OnInit {

  listTrainingDtls: any;
  id: any;
  userSession:any = this.session.getUserSession();
  empcode: any=this.userSession.empcode;
  takeassessmntdtls: any;
  //listquestions: any;
  listquestions: any[] = [];
 // currentQuestionIndex: number = 0;

  currentQuestionIndex: number = 0;
//  questions: any[] = [];

  timer: any;
  timeInSeconds: number = 0;

  selectedOptions: string[] = [];

  selectedAnswers: { questionId: string, answer: string }[] = [];
  showModals: any;
  successs: any;
  faileds: any;
  Atid: any;

  constructor(private router:Router,private route: ActivatedRoute,private session:LoginService,private apicall:ApiCallService) { }

  ngOnInit(): void {

    this.route.queryParams.subscribe(params => {
      this.id = params['Id'];
      this.Atid = params['AId'];
      });
  

      this.apicall.GetTrainingDetails(this.id).subscribe((res)=>{
        this.listTrainingDtls=res;
      })

      this.fetchquestions();
      this.startTimer();

  }

  fetchquestions()
  {
    this.apicall.GetTrainingQuestions(this.id).subscribe((res)=>{
      this.listquestions=res;
      this.selectedOptions = new Array(res.length).fill(null);
    })
  }


  onNextButtonClick() {
    this.currentQuestionIndex++;
  }

  // fetchQuestions() {
  //   this.apiService.GetTrainingQuestions(this.id).subscribe((res) => {
  //     this.questions = res;
  //   });
  // }

  get currentQuestion() {
    return this.listquestions[this.currentQuestionIndex];
  }

  nextQuestion() {

    const assessmentid =(<HTMLInputElement>document.getElementById("assessid")).value;
    //alert(assessmentid);
    var thisAtid = parseInt(this.Atid); // Convert this.Atid to a number
    var attempt_no = thisAtid + 1;

    // Clear radio button selection
    const radioButtons = document.getElementsByName('formradio');
    for (let i = 0; i < radioButtons.length; i++) {
      (radioButtons[i] as HTMLInputElement).checked = false;
    }

    if (this.currentQuestionIndex < this.listquestions.length - 1) {
      this.currentQuestionIndex++;
    } else {

      const jsonData = {
        empcode: this.empcode,
        trainingid: this.id,
        assessid: assessmentid,
        time_taken: this.calculateTimeTaken(), // Assuming you have a method to calculate time taken
        attempt_no: attempt_no,
        assessmentdtl: this.generateAssessmentDetail() // Assuming you have a method to generate assessment detail
      };
  
      //alert(JSON.stringify(jsonData)); // Output the JSON data

      this.apicall.Saveassessmentqts(jsonData).subscribe(res =>{

        
      //alert(JSON.stringify(res));
           
        if(res.Errorid!=0){

          // (<HTMLInputElement>document.getElementById("openModalButtonForalertsuccess")).click();
          // this.showModals = 1;
          // this.successs = "Submit Successfully";
          // this.fetchOnlineTrainings();
          // this.hClear();

         //alert(res.NO_OF_QUESTIONS);

          localStorage.setItem('passing_score', res.TRAINING_ID);
          localStorage.setItem('passing_status', res.ATTEMPT_STATUS );
          localStorage.setItem('time_taken', res.EMP_CODE );
          localStorage.setItem('emp_no_of_attempt', res.EMP_NO_OF_ATTEMPTS );
          localStorage.setItem('no_of_attempt', res.NO_OF_ATTEMPTS );

          this.router.navigate(['/assessment_finalresult']);
    
        }
        else{
          (<HTMLInputElement>document.getElementById("openModalButtonForalertsuccess")).click();
          this.showModals = 2;
          this.faileds = "Failed!";
         // this.fetchOnlineTrainings();
         // this.hClear(); 
        }  

      })


    }
    
  }

  startTimer() {
    this.timer = setInterval(() => {
      this.timeInSeconds++;
      const minutes = Math.floor(this.timeInSeconds / 60);
      const seconds = this.timeInSeconds % 60;
      const formattedTime = `${this.formatTime(minutes)}:${this.formatTime(seconds)}`;
      (<HTMLInputElement>document.getElementById('timer')).textContent = formattedTime;
    }, 1000);
  }

  formatTime(time: number): string {
    return time < 10 ? `0${time}` : `${time}`;
  }

  previousQuestion() {
    // Move to the previous question
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
    } else {
      // Handle beginning of questions
    }
  }

  selectOption(option: string, questionId: string) {

    // alert(option)
    // alert(questionId)
    // Store selected option for the current question
    this.selectedOptions[this.currentQuestionIndex] = option;

    this.selectedAnswers[this.currentQuestionIndex] = { questionId: questionId, answer: option };
  }


  //  {
  //   "empcode":"WS00014",
  //   "trainingid":"2",
  //   "assessid":"2",
  //   "time_taken":"5",
  //   "attempt_no":"1",
  //   "assessmentdtl":"1,aaa ! 2,bbb ! 3,ccc"
  //   } 

  calculateTimeTaken(): string {
    // Your logic to calculate time taken
    return "5"; // Example value
  }

  generateAssessmentDetail(): string {
    let assessmentDetail = "";
    this.selectedAnswers.forEach((selectedAnswer, index) => {
      if (index > 0) {
        assessmentDetail += " ! ";
      }
      assessmentDetail += `${selectedAnswer.questionId},${selectedAnswer.answer}`;
    });
    return assessmentDetail;
  }


}
