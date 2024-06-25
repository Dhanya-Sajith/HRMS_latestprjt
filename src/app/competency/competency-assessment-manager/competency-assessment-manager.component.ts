import { Component, OnInit } from '@angular/core';
import { GeneralService } from 'src/app/general.service';
import { ApiCallService } from 'src/app/api-call.service';
import { LoginService } from 'src/app/login.service';

@Component({
  selector: 'app-competency-assessment-manager',
  templateUrl: './competency-assessment-manager.component.html',
  styleUrls: ['./competency-assessment-manager.component.scss']
})
export class CompetencyAssessmentManagerComponent implements OnInit {
  userSession:any = this.session.getUserSession();
  empcode: any=this.userSession.empcode;  
  empdata: any=this.general.getEmpdetails_competency();  
  skillcategory: any;
  selectedSkillCategory: any={"TYPE_ID":0,"KEY_ID":"1","DATA_VALUE":"QUALIFICATION"};
  tabledata: any;  
  showModal!: any;
  success!: string;
  failed!: string;
  selectedCompanyid: any;
  selectedDeptid: any;
  selectedDesig: any;
  trainingrequired: any;
  selectedSkillCategoryId: any=1;
  valid: any=0;

  constructor(private general:GeneralService,private apicall:ApiCallService,private session:LoginService) { }

  ngOnInit(): void {   
    this.apicall.listCompany(69).subscribe((res)=>{
      this.skillcategory=res;       
       this.apicall.FetchCompetencyActualLevel(this.empdata.company,this.empdata.department,this.empdata.desigid,1,this.empdata.reqid,this.empdata.empcode).subscribe((res)=>{
        this.tabledata=res;
        console.log(JSON.stringify(this.tabledata))       
       })        
    });
   this.FetchTrainingRequiredCompetency();
  } 
  FetchTrainingRequiredCompetency(){
   this.apicall.FetchTrainingRequiredCompetency(this.empdata.company,this.empdata.department,this.empdata.desigid).subscribe((res)=>{
      this.trainingrequired=res;
      console.log(JSON.stringify(this.trainingrequired))  
    }) 
  }
  onskillcategorySelected(item:any){   
    this.selectedSkillCategory=item; 
    this.selectedSkillCategoryId=item.KEY_ID;   
     this.apicall.FetchCompetencyActualLevel(this.empdata.company,this.empdata.department,this.empdata.desigid,this.selectedSkillCategory.KEY_ID,this.empdata.reqid,this.empdata.empcode).subscribe((res)=>{
      this.tabledata=res;
      console.log(JSON.stringify(this.tabledata))       
     })     
   }
   updateLevels(selectedLevel: any, competencyId: number, competencyName: string) {     
    const item = this.tabledata.find((data: { COMPETENCY_ID: number; COMPETENCY_NAME: string }) => data.COMPETENCY_ID === competencyId && data.COMPETENCY_NAME === competencyName);
    
    if (item) {
        item.ACTUAL_LEVEL = selectedLevel;         
    }
}

submit(tabledata: any[]) { 
  if(!tabledata || tabledata.length==0 || tabledata==null){
    (<HTMLInputElement>document.getElementById("openModalButton")).click();
    this.showModal = 2;
    this.failed = 'No data present!';
  }else{
    if(this.selectedSkillCategoryId==1){  
      let qualificationArray: any[] = [];    
      tabledata.forEach(data => {                   
       if(!data.ACTUAL_LEVEL||data.ACTUAL_LEVEL==null)  {
        qualificationArray.push(0);        
       }                  
       
      });  
      this.valid=qualificationArray.includes(0);
          
      if(this.valid){        
      (<HTMLInputElement>document.getElementById("openModalButton")).click();
      this.showModal = 2;      
      this.failed = 'Please enter actual qualification!';
      }
    else{
      tabledata.forEach(data => {                
                              
        this.updateLevels(data.ACTUAL_LEVEL, data.COMPETENCY_ID, data.COMPETENCY_NAME);
          
     }); 
     const data={
      req_id:this.empdata.reqid,
          emp_code:this.empdata.empcode,
          company: this.empdata.company,
          dept: this.empdata.department,
          desgn: this.empdata.desigid,
          skill_category: this.selectedSkillCategory.KEY_ID,
          updated_by: this.empcode,
          competency:tabledata
     };
     console.log(tabledata);
        
        console.log(JSON.stringify(data));
       
        this.apicall.AddCompetencyEvaluation(data).subscribe((res) => {
            //alert(JSON.stringify(res));   
            if (res.Errorid == 1) {
              (<HTMLInputElement>document.getElementById("openModalButton")).click();
                this.showModal = 1;
                this.success = "Assessment added successfully!";                
            } else {
              (<HTMLInputElement>document.getElementById("openModalButton")).click();
                this.showModal = 2;
                this.failed = "Failed!";
            } 
            this.onskillcategorySelected(this.selectedSkillCategory);     
        });
    } 
  }else{
      let levelsArray: any[] = [];
      tabledata.forEach(data => {     
        const selectedLevel = document.querySelector(`input[name="Radio${data.COMPETENCY_ID}-${data.COMPETENCY_NAME}"]:checked`)?.getAttribute('value');
        levelsArray.push(selectedLevel || -1);  
    
    });      
    const hasLevelZero = levelsArray.includes(-1);
    
    if (hasLevelZero) {       
      (<HTMLInputElement>document.getElementById("openModalButton")).click();
          this.showModal = 2;
          this.failed = 'Please select level for all skills!';
     }else{ 
      tabledata.forEach(data => {     
        const selectedLevel = document.querySelector(`input[name="Radio${data.COMPETENCY_ID}-${data.COMPETENCY_NAME}"]:checked`)?.getAttribute('value');
          
        if (selectedLevel) {                                
            this.updateLevels(parseInt(selectedLevel), data.COMPETENCY_ID, data.COMPETENCY_NAME);
        }         
    });       
      //console.log(tabledata);
      const data={
          req_id:this.empdata.reqid,
          emp_code:this.empdata.empcode,
          company: this.empdata.company,
          dept: this.empdata.department,
          desgn: this.empdata.desigid,
          skill_category: this.selectedSkillCategory.KEY_ID,
          updated_by: this.empcode,
          competency:tabledata
      };
      console.log(JSON.stringify(data));
      this.apicall.AddCompetencyEvaluation(data).subscribe((res) => {
          //alert(JSON.stringify(res));   
          if (res.Errorid == 1) {
            (<HTMLInputElement>document.getElementById("openModalButton")).click();
              this.showModal = 1;
              this.success = "Assessment added successfully!"; 
              this.FetchTrainingRequiredCompetency();
                            
          } else {
            (<HTMLInputElement>document.getElementById("openModalButton")).click();
              this.showModal = 2;
              this.failed = "Failed!";
          } 
          this.onskillcategorySelected(this.selectedSkillCategory);     
      });
    }
  
  }  
}
}
}
