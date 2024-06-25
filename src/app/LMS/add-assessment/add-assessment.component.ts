import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiCallService } from 'src/app/api-call.service';
import { LoginService } from 'src/app/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-assessment',
  templateUrl: './add-assessment.component.html',
  styleUrls: ['./add-assessment.component.scss']
})
export class AddAssessmentComponent implements OnInit {

  listTrainingDtls: any;
  userSession:any = this.session.getUserSession();
  empcode: any=this.userSession.empcode;
  id: any;
  fetchTrainingOnload: any;
  showModals: any;
  successs: any;
  faileds: any;
  assemntId: any;
  trId: any;
  editingData: any;
  desiredPage: any;
  itemsPerPage=10;
  currentPage=1;
  searchInput: string = '';
  showModal: any;
  failed: any;
  addUpdateSts: any;

  constructor(private router:Router,private route: ActivatedRoute,private session:LoginService,private apicall:ApiCallService) { }

  ngOnInit(): void {

    this.addUpdateSts=0;

    this.route.queryParams.subscribe(params => {
      this.id = params['Id'];
      //alert(id)
    });

    this.apicall.GetTrainingDetails(this.id).subscribe((res)=>{
      this.listTrainingDtls=res;
    })

    this.fetchassessmentDetails();

  }

  addassessmentDetails()
  {
    
    const training_id = parseFloat((<HTMLInputElement>document.getElementById("training_id")).value);
    const noquestion = parseFloat((<HTMLInputElement>document.getElementById("noquestion")).value);
    const passscore = parseFloat((<HTMLInputElement>document.getElementById("passscore")).value);
    const noattempts = parseFloat((<HTMLInputElement>document.getElementById("noattempts")).value);
    const duration = parseFloat((<HTMLInputElement>document.getElementById("duration")).value);
  
    // Check if any of the input fields are not numeric
    if (isNaN(training_id) || isNaN(noquestion) || isNaN(passscore) || isNaN(noattempts) || isNaN(duration)) {

      (<HTMLInputElement>document.getElementById("openModalButtonForalertsuccess")).click();
      this.showModals = 2;
      this.faileds = "All field must be numeric and mandatory";
      return; // Exit the function if any field is not numeric
    }

    // if (!training_id || !noquestion || !passscore || !noattempts || !duration) {
    //   (<HTMLInputElement>document.getElementById("openModalButtonForalertsuccess")).click();
    //   this.showModals = 2;
    //   this.faileds = "Please fill all fields";
    //   return; // Exit the function if any field is empty
    // }
  

    const assessdata = {
      actiontype:1,
      training_id: training_id,
      noquestion: noquestion,
      passscore: passscore,
      noattempts: noattempts,
      assessid: 0,
      duration: duration,
      updated_by: this.empcode

      };
  

       // alert(JSON.stringify(assessdata))
  
       this.apicall.AddAssessmentDtls(assessdata).subscribe(res =>{
       // this.listrainingplan=res;
   
        if(res.Errorid==1){
          (<HTMLInputElement>document.getElementById("openModalButtonForalertsuccess")).click();
          this.showModals = 1;
          this.successs = "Added Successfully";
          this.fetchassessmentDetails();
    
        }
        else{
          (<HTMLInputElement>document.getElementById("openModalButtonForalertsuccess")).click();
          this.showModals = 2;
          this.faileds = "Failed";
          this.fetchassessmentDetails();  
        }
      
        })
    
  }

  isNumeric(value: any): boolean {
    return !isNaN(parseFloat(value)) && isFinite(value);
  }
 
  updateassessmentDetails()
  {
    const training_id=  parseFloat((<HTMLInputElement>document.getElementById("training_id")).value);
    const noquestion=  parseFloat((<HTMLInputElement>document.getElementById("noquestion")).value);
    const passscore=  parseFloat((<HTMLInputElement>document.getElementById("passscore")).value);
    const noattempts=  parseFloat((<HTMLInputElement>document.getElementById("noattempts")).value);
    const duration=  parseFloat((<HTMLInputElement>document.getElementById("duration")).value);
    const assmId=  parseFloat((<HTMLInputElement>document.getElementById("assmId")).value);
 
    // Check if any of the input fields are not numeric
    if (isNaN(noquestion) || isNaN(passscore) || isNaN(noattempts) || isNaN(duration)) {

      (<HTMLInputElement>document.getElementById("openModalButtonForalertsuccess")).click();
      this.showModals = 2;
      this.faileds = "All field must be numeric and mandatory";
      return; // Exit the function if any field is not numeric
    }


    const assessdata = {
      actiontype:2,
      training_id: training_id,
      noquestion: noquestion,
      passscore: passscore,
      noattempts: noattempts,
      assessid: assmId,
      duration: duration,
      updated_by: this.empcode

      };
  
       // alert(JSON.stringify(assessdata))
  
       this.apicall.AddAssessmentDtls(assessdata).subscribe(res =>{
       // this.listrainingplan=res;
   
        if(res.Errorid==1){
          (<HTMLInputElement>document.getElementById("openModalButtonForalertsuccess")).click();
          this.showModals = 1;
          this.successs = "Updated Successfully";
          this.fetchassessmentDetails();
          this.addUpdateSts=0;
        }
        else{
          (<HTMLInputElement>document.getElementById("openModalButtonForalertsuccess")).click();
          this.showModals = 2;
          this.faileds = "Failed";
          this.fetchassessmentDetails();  
        }
      
        })
  }

  fetchassessmentDetails()
  {
    this.apicall.fetchassessmentdetails(this.id).subscribe((res)=>{
      this.fetchTrainingOnload=res;
    })
  }

  removeAssessment(assessment_Id:any,training_ID:any)
  {
    this.assemntId=assessment_Id;
    this.trId=training_ID;
  }

  ConfirmRemoveAsssement(assessmntId:any,trId:any)
  {
    const assessdata = {
      actiontype:3,
      training_id: trId,
      noquestion: 0,
      passscore: 0,
      noattempts: 0,
      assessid: assessmntId,
      duration: 0,
      updated_by: this.empcode

      };

      this.apicall.AddAssessmentDtls(assessdata).subscribe(res =>{
        // this.listrainingplan=res;
    
         if(res.Errorid==1){
           (<HTMLInputElement>document.getElementById("openModalButtonForalertsuccess")).click();
           this.showModals = 1;
           this.successs = "Deleted Successfully";
           this.fetchassessmentDetails();
     
         }
         else{
           (<HTMLInputElement>document.getElementById("openModalButtonForalertsuccess")).click();
           this.showModals = 2;
           this.faileds = "Failed";
           this.fetchassessmentDetails();  
         }
       
         })
  }

  navigateTo_QuestPage(TrainingId:any,assesmntId:any,noQuest:any)
  {
  // alert(assesmntId);
   this.router.navigate(['/add_questionnaire'], { queryParams: { Id: TrainingId, AId: assesmntId,nQId:noQuest  } });


  }

dataforEdit(FetchTr:any)
{
  this.addUpdateSts=1;
  this.fetchTrainingOnload = FetchTr;
}
 
//pagination

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


get totalSearchResults(): number {
const totalResults = this.fetchTrainingOnload.filter((employee: any) => {
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

const filteredData = this.fetchTrainingOnload.filter((employee: any) =>
  Object.values(employee).some((value: any) =>
    typeof value === 'string' &&
    value.toLowerCase().startsWith(this.searchInput.toLowerCase())
  )
);

const start = (this.currentPage - 1) * this.itemsPerPage + 1;
return Math.min(start, filteredData.length);
}


getEntriesEnd(): number {  
const filteredData = this.fetchTrainingOnload.filter((employee: any) =>
  Object.values(employee).some((value: any) =>
    typeof value === 'string' &&
    value.toLowerCase().startsWith(this.searchInput.toLowerCase())
  )
);
const end = this.currentPage * this.itemsPerPage;
return Math.min(end, filteredData.length);
}





}
