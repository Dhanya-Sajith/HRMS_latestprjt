import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiCallService } from 'src/app/api-call.service';
import { LoginService } from 'src/app/login.service'; 

@Component({
  selector: 'app-add-questionnaire',
  templateUrl: './add-questionnaire.component.html',
  styleUrls: ['./add-questionnaire.component.scss']
})
export class AddQuestionnaireComponent implements OnInit {

  id: any;
  userSession:any = this.session.getUserSession();
  empcode: any=this.userSession.empcode;
  assessmentid: any;
  listTrainingDtls: any;
  showModals: any;
  successs: any;
  faileds: any;
  listquestions: any;
  trngid: any;
  assessid: any;
  questid: any;
  desiredPage: any;
  itemsPerPage=10;
  currentPage=1;
  searchInput: string = '';
  showModal: any;
  failed: any;
  noQuest: any;
  addUpdateSts: any;

  constructor(private route: ActivatedRoute,private session:LoginService,private apicall:ApiCallService) { }

  ngOnInit(): void {

    this.addUpdateSts=0;
    
    this.route.queryParams.subscribe(params => {
      this.id = params['Id'];
      this.assessmentid = params['AId'];
      this.noQuest = params['nQId'];
    });

    this.apicall.GetTrainingDetails(this.id).subscribe((res)=>{
      this.listTrainingDtls=res;
    })
    
    this.fetchquestionsOnload();
  }

  addquestions()
  {

    const training_id=  (<HTMLInputElement>document.getElementById("training_id")).value;
    const assessid=  (<HTMLInputElement>document.getElementById("assessmentid")).value;
    const question=  (<HTMLInputElement>document.getElementById("question")).value;
    const option_a=  (<HTMLInputElement>document.getElementById("option_a")).value;
    const option_b=  (<HTMLInputElement>document.getElementById("option_b")).value;
    const option_c=  (<HTMLInputElement>document.getElementById("option_c")).value;
    const option_d=  (<HTMLInputElement>document.getElementById("option_d")).value;
    const answer=  (<HTMLInputElement>document.getElementById("answer")).value;

    const assessdata = {
      actiontype:1,
      training_id: training_id,
      assessid:assessid,
      question: question,
      questionid: 0,
      option_a: option_a,
      option_b: option_b,
      option_c: option_c,
      option_d: option_d,
      answer:answer,
      updated_by: this.empcode

      };
  
  
       // alert(JSON.stringify(assessdata))
  
       this.apicall.AddAssessmentQuest(assessdata).subscribe(res =>{
       // this.listrainingplan=res;
   
        if(res.Errorid==1){
          (<HTMLInputElement>document.getElementById("openModalButtonForalertsuccess")).click();
          this.showModals = 1;
          this.successs = "Added Successfully";
          this.fetchquestionsOnload();
    
        }
        else{
          (<HTMLInputElement>document.getElementById("openModalButtonForalertsuccess")).click();
          this.showModals = 2;
          this.faileds = "Failed";
          this.fetchquestionsOnload();  
        }
      
        })

  }

  updatequestionDetails()
  {
    const training_id=  (<HTMLInputElement>document.getElementById("training_id")).value;
    const assessid=  (<HTMLInputElement>document.getElementById("assessmentid")).value;
    const question=  (<HTMLInputElement>document.getElementById("question")).value;
    const option_a=  (<HTMLInputElement>document.getElementById("option_a")).value;
    const option_b=  (<HTMLInputElement>document.getElementById("option_b")).value;
    const option_c=  (<HTMLInputElement>document.getElementById("option_c")).value;
    const option_d=  (<HTMLInputElement>document.getElementById("option_d")).value;
    const answer=  (<HTMLInputElement>document.getElementById("answer")).value;
    const questId=  (<HTMLInputElement>document.getElementById("questId")).value;

    const assessdata = {
      actiontype:2,
      training_id: training_id,
      assessid:assessid,
      question: question,
      questionid: questId,
      option_a: option_a,
      option_b: option_b,
      option_c: option_c,
      option_d: option_d,
      answer:answer,
      updated_by: this.empcode

      };
  
  
       // alert(JSON.stringify(assessdata))
  
       this.apicall.AddAssessmentQuest(assessdata).subscribe(res =>{
       // this.listrainingplan=res;
   
        if(res.Errorid==1){
          (<HTMLInputElement>document.getElementById("openModalButtonForalertsuccess")).click();
          this.showModals = 1;
          this.successs = "Updated Successfully";
          this.fetchquestionsOnload();
          this.addUpdateSts=0;
    
        }
        else{
          (<HTMLInputElement>document.getElementById("openModalButtonForalertsuccess")).click();
          this.showModals = 2;
          this.faileds = "Failed";
          this.fetchquestionsOnload();  
        }
      
        })

  }

  fetchquestionsOnload()
  {
    
    this.apicall.Getquestions(this.assessmentid).subscribe((res)=>{
    this.listquestions=res;
    })
  }

  dataforEdit(listquest:any)
  {
    this.addUpdateSts=1;
    this.listquestions = listquest;
  }

  removeQuestion(trId:any,assessId:any,questId:any)
  {
    this.trngid=trId;
    this.assessid=assessId;
    this.questid=questId;
  }
  confirmRemoveQuest(trId:any,assessId:any,questId:any)
  {

    
    const assessdata = {
      actiontype:3,
      training_id: trId,
      assessid:assessId,
      question: 0,
      questionid: questId,
      option_a: 0,
      option_b: 0,
      option_c: 0,
      option_d: 0,
      answer:0,
      updated_by: this.empcode

      };
  
  
       // alert(JSON.stringify(assessdata))
  
       this.apicall.AddAssessmentQuest(assessdata).subscribe(res =>{
       // this.listrainingplan=res;
   
        if(res.Errorid==1){
          (<HTMLInputElement>document.getElementById("openModalButtonForalertsuccess")).click();
          this.showModals = 1;
          this.successs = "Deleted Successfully";
          this.fetchquestionsOnload();
    
        }
        else{
          (<HTMLInputElement>document.getElementById("openModalButtonForalertsuccess")).click();
          this.showModals = 2;
          this.faileds = "Failed";
          this.fetchquestionsOnload();  
        }
      
        })

  }


  
getTotalPages(): number {
  return Math.ceil(this.totalSearchResults / this.itemsPerPage);
}

goToPage() {
  const totalPages = Math.ceil(this.totalSearchResults / this.itemsPerPage);
  if (this.desiredPage >= 1 && this.desiredPage <= totalPages) {
    this.currentPage = this.desiredPage;
  } else {  
    
    (<HTMLInputElement>document.getElementById("openModalButton")).click();
    this.showModal = 2; 
    this.failed='Invalid page number!'; 
    this.desiredPage=''; 
  }   
 
}
getPageNumbers(currentPage: number): number[] {
  const totalPages = Math.ceil(this.totalSearchResults / this.itemsPerPage);
  const maxPageNumbers = 5; 
  const middlePage = Math.ceil(maxPageNumbers / 2);
  let startPage = Math.max(currentPage - middlePage, 1);
  let endPage = Math.min(startPage + maxPageNumbers - 1, totalPages);

  if (endPage - startPage + 1 < maxPageNumbers) {
    startPage = Math.max(endPage - maxPageNumbers + 1, 1);
  }

  return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
}

// Function to Calculate the total number of search results
get totalSearchResults(): number {
const totalResults = this.listquestions.filter((employee: any) => {
  return Object.values(employee).some((value: any) =>
    typeof value === 'string' && value.toLowerCase().startsWith(this.searchInput.toLowerCase())
  );
}).length;

const maxPageFiltered = Math.ceil(totalResults / this.itemsPerPage);  

if (this.currentPage > maxPageFiltered) {
  this.currentPage = 1; 
}

return totalResults;
}

// Function to change the current page
changePage(page: number): void { 
  this.desiredPage = '';   
  this.currentPage = page;
  const maxPage = Math.ceil(this.totalSearchResults / this.itemsPerPage);
  if (this.currentPage > maxPage) {
    this.currentPage = 1;
  }        
}
getEntriesStart(): number {
if (this.currentPage === 1) {
  return 1;
}

const filteredData = this.listquestions.filter((employee: any) =>
  Object.values(employee).some((value: any) =>
    typeof value === 'string' &&
    value.toLowerCase().startsWith(this.searchInput.toLowerCase())
  )
);

const start = (this.currentPage - 1) * this.itemsPerPage + 1;
return Math.min(start, filteredData.length);
}


getEntriesEnd(): number {  
const filteredData = this.listquestions.filter((employee: any) =>
  Object.values(employee).some((value: any) =>
    typeof value === 'string' &&
    value.toLowerCase().startsWith(this.searchInput.toLowerCase())
  )
);
const end = this.currentPage * this.itemsPerPage;
return Math.min(end, filteredData.length);
}

 

}
