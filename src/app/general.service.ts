import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GeneralService {
  empdata: any;

  constructor() { }
   //CompetencyAssessmentManager
   setEmpdetails_competency(data: any): void {   
    this.empdata=data;
    sessionStorage.setItem('Competencydata', JSON.stringify(this.empdata));
  } 
  getEmpdetails_competency(){
    if (!this.empdata) {
      var empdata = sessionStorage.getItem('Competencydata');
    if (empdata) {
      this.empdata = JSON.parse(empdata);
    }
  }
    return this.empdata;
  }
}
