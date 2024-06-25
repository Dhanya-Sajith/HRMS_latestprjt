import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators,FormBuilder } from '@angular/forms';
import { ApiCallService } from 'src/app/api-call.service';
import { LoginService } from 'src/app/login.service';

@Component({
  selector: 'app-competency-master',
  templateUrl: './competency-master.component.html',
  styleUrls: ['./competency-master.component.scss']
})
export class CompetencyMasterComponent implements OnInit {

  userSession:any = this.session.getUserSession();
  empcode: any=this.userSession.empcode;
  radioselected: any='individual';
  AddCompetencyForm: FormGroup;
  
  companydata: any;
  deptdata: any;
  selectedCompanyid: any=-1;
  selectedDeptid: any=-1;
  desigdata: any;
  selectedDesig: any=-1;
  skillcategory: any;
  selectedSkillCategory: any={"TYPE_ID":0,"KEY_ID":"1","DATA_VALUE":"QUALIFICATION"};
  showModal: number=0;
  success!: string;
  failed!: string;
  tabledata: any;
  data: any;
  selectedcompetencyid: any;
  hasLevelZero!: boolean;
  selectedcompetencyname: any;
  item: any;
  selectedSkillCategoryId: any=1;
  requiredQualification: any;
  valid: any=0;
  submitdata!: { company: any; department: any; designation: any; skill_category: any; updatedby: any; tabledata: any[]; };

    // Bulk upload
    fileuploadForm: any =  FormGroup;
    isFormValid: boolean=false;
    submitted = false;
    inputfield: any;

  constructor(private apicall:ApiCallService,private session:LoginService,private formBuilder: FormBuilder) {
    this.AddCompetencyForm = this.formBuilder.group({      
      competency: ['', Validators.required]
      
    });
   }

  ngOnInit(): void {
    //company combo box
    this.apicall.FetchCompanyList(this.empcode).subscribe((res) => {
      this.companydata=res;      
    }); 
  }

  // Bulk upload
  get f() { return this.fileuploadForm.controls; }

  onradioselected(){
    if(this.radioselected=='individual'){

    }else{

    }
  }
  onCompanySelected(selectedCompanyid: any) { 
    this.selectedCompanyid=selectedCompanyid;  
    this.selectedDeptid=-1;  
    this.selectedDesig=-1; 
    this.desigdata=[];
    this.skillcategory='';
    this.apicall.FetchDepartmentList(selectedCompanyid,this.empcode).subscribe((res) => {
      this.deptdata=res; 
      //alert(JSON.stringify(this.deptdata))   
    }); 
    }
    onDeptSelected(selectedDeptid:any){
      this.selectedDeptid=selectedDeptid;
      this.selectedDesig=-1; 
      this.skillcategory='';
      this.apicall.DesignationCombo_Company_Dept_Wise(selectedDeptid,this.empcode).subscribe((res) => {
        this.desigdata=res; 
        //alert(JSON.stringify(this.deptdata))   
      }); 
    }
    onDesigSelected(selectedDesig:any){
      this.selectedDesig=selectedDesig;
     this.apicall.listCompany(69).subscribe((res)=>{
        this.skillcategory=res;
        this.apicall.FetchCompetency(this.selectedCompanyid,this.selectedDeptid,this.selectedDesig,1).subscribe((res)=>{
          this.tabledata=res;
          console.log(JSON.stringify(this.tabledata))
         }) 
     })
    }
    onskillcategorySelected(item:any){
     this.selectedSkillCategory=item;
     this.selectedSkillCategoryId=item.KEY_ID; 
     this.apicall.FetchCompetency(this.selectedCompanyid,this.selectedDeptid,this.selectedDesig,this.selectedSkillCategory.KEY_ID).subscribe((res)=>{
      this.tabledata=res;
     })     
    }
    AddCompetency(){
      if (this.AddCompetencyForm.valid) {        
        this.data=this.AddCompetencyForm.value;
        let compArray: any[] = [];        
        this.tabledata.forEach((data: { COMPETENCY_NAME: any; }) => {  
          compArray.push(data.COMPETENCY_NAME);  
        });        
        if(compArray.includes(this.data.competency)){         
          (<HTMLInputElement>document.getElementById("openModalButton")).click();
          this.showModal = 2;
          this.failed = 'Skill already exists!';
          this.ClearAddCompetencyForm();
        }else{
        this.tabledata.unshift({ COMPETENCY_ID: 0, COMPETENCY_NAME:this.data.competency,LEVELS:null });
        (<HTMLInputElement>document.getElementById("close-modalcomp")).click();   
        console.log(JSON.stringify(this.data.competency))
        }
    } else {        
        this.markFormGroupTouched(this.AddCompetencyForm);
    }
    } 
    ClearAddCompetencyForm(){
      this.AddCompetencyForm.reset();
    }
    private markFormGroupTouched(formGroup: FormGroup) {
      Object.values(formGroup.controls).forEach(control => {
        control.markAsTouched();
        if (control instanceof FormGroup) {
          this.markFormGroupTouched(control);
        }
      });
    }
    updateLevels(selectedLevel: any, competencyId: number, competencyName: string) {     
      const item = this.tabledata.find((data: { COMPETENCY_ID: number; COMPETENCY_NAME: string }) => data.COMPETENCY_ID === competencyId && data.COMPETENCY_NAME === competencyName);
      
      if (item) {
          item.LEVELS = selectedLevel;         
      }
  }
  
  submit(tabledata: any[]) {     
    if(!tabledata || tabledata.length==0 || tabledata==null){
      (<HTMLInputElement>document.getElementById("openModalButton")).click();
      this.showModal = 2;      
      this.failed = 'Please add skills!';
    }else{
      if(this.selectedSkillCategoryId==1){  
      let qualificationArray: any[] = [];    
      tabledata.forEach(data => {                   
       if(!data.LEVELS||data.LEVELS==null)  {
        qualificationArray.push(0);        
       }                  
       
      });  
      this.valid=qualificationArray.includes(0); 
      //alert(this.valid)     
      if(this.valid){
      (<HTMLInputElement>document.getElementById("openModalButton")).click();
      this.showModal = 2;
      this.failed = 'Please enter required qualification!';
      }
    else{
      tabledata.forEach(data => {               
                              
        this.updateLevels(data.LEVELS, data.COMPETENCY_ID, data.COMPETENCY_NAME);
          
     }); 
     this.submitdata={
      company: this.selectedCompanyid,
      department: this.selectedDeptid,
      designation: this.selectedDesig,
      skill_category: this.selectedSkillCategory.KEY_ID,
      updatedby: this.empcode,
      tabledata
     };
     console.log(tabledata);
        
        console.log(JSON.stringify(this.submitdata));
       
        this.apicall.AddCompetency(this.submitdata).subscribe((res) => {
            //alert(JSON.stringify(res));   
            if (res.Errorid == 1) {
              (<HTMLInputElement>document.getElementById("openModalButton")).click();
                this.showModal = 1;
                this.success = "Skill added successfully!";                
            } else {
              (<HTMLInputElement>document.getElementById("openModalButton")).click();
                this.showModal = 2;
                this.failed = "Failed!";
            } 
            this.onskillcategorySelected(this.selectedSkillCategory);     
        });
    } 
  }
  
  else{
      let levelsArray: any[] = [];
        tabledata.forEach(data => {     
          const selectedLevel = document.querySelector(`input[name="Radio${data.COMPETENCY_ID}-${data.COMPETENCY_NAME}"]:checked`)?.getAttribute('value');
          levelsArray.push(selectedLevel || -1);  
      
      });      
      let hasLevelZero = levelsArray.includes(-1);
      //alert(hasLevelZero)
      if (hasLevelZero) {       
        (<HTMLInputElement>document.getElementById("openModalButton")).click();
            this.showModal = 2;
            this.failed = 'Please select a level for all skills!';
      }    
       else {
       
        tabledata.forEach(data => {     
          const selectedLevel = document.querySelector(`input[name="Radio${data.COMPETENCY_ID}-${data.COMPETENCY_NAME}"]:checked`)?.getAttribute('value');
            
          if (selectedLevel) {                                
              this.updateLevels(parseInt(selectedLevel), data.COMPETENCY_ID, data.COMPETENCY_NAME);
          }         
      });   
      this.submitdata={
        company: this.selectedCompanyid,
        department: this.selectedDeptid,
        designation: this.selectedDesig,
        skill_category: this.selectedSkillCategory.KEY_ID,
        updatedby: this.empcode,
        tabledata
    };
    console.log(tabledata);
        
        console.log(JSON.stringify(this.submitdata));
        
        this.apicall.AddCompetency(this.submitdata).subscribe((res) => {
            //alert(JSON.stringify(res));   
            if (res.Errorid == 1) {
              (<HTMLInputElement>document.getElementById("openModalButton")).click();
                this.showModal = 1;
                this.success = "Skill added successfully!";                
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
    
    
  

selectedcompid(item:any){
this.item=item;
this.selectedcompetencyid=item.COMPETENCY_ID;
this.selectedcompetencyname=item.COMPETENCY_NAME;
}
Delete(selectedcompetencyid:any){  
  if(selectedcompetencyid==0){
    const indexToRemove = this.tabledata.findIndex((item: { COMPETENCY_NAME: any; }) => item.COMPETENCY_NAME === this.selectedcompetencyname);
  
    if (indexToRemove !== -1) {
        this.tabledata.splice(indexToRemove, 1);
        (<HTMLInputElement>document.getElementById("btn-closeDelete")).click();
    }
  }else{
  this.apicall.DeleteCompetency(selectedcompetencyid).subscribe((res:number)=>{
    //alert(res);   
    if(res==1){
      (<HTMLInputElement>document.getElementById("openModalButton")).click();
      this.showModal = 1;
      this.success = "Skill deleted!";
      
    }
    else{
      (<HTMLInputElement>document.getElementById("openModalButton")).click();
      this.showModal = 2;
      this.failed = "Failed!";
    }  
    this.onskillcategorySelected(this.selectedSkillCategory);  
  }) 
}
}

// Bulk upload
upload()
  {
    const input=document.getElementById("myFile");    
    const fdata = new FormData();   
    this.onFileSelect(input);  
  }  

  onFileSelect(input:any) {   
    this.submitted = true;
    if (this.fileuploadForm.invalid) {
      return;
  }
 
  if(this.submitted){ 
     
    if (input.files && input.files[0]) {
      const fdata = new FormData();
      fdata.append('postedFile',input.files[0]);
      //alert(fdata) 
      // this.showProgressBar = true;
      this.apicall.UploadCompetency(fdata,this.empcode).subscribe((res)=>{
        //alert(JSON.stringify(res))
        if(res=1)
        {
      
          this.showModal = 1; 
          this.success = "Excel uploaded successfully";
          this.inputfield = document.getElementById("myFile");
          this.inputfield.selectedIndex = 0;
          (<HTMLInputElement>document.getElementById("myFile")).value = '';
        }
        else{          
          this.showModal = 2;
          this.failed = "Uploading failed!";      

        }
      })
    }
  }
   
  }
 
  onImageChangeFromFile($event:any)
  {
      if ($event.target.files && $event.target.files[0]) {
        let file = $event.target.files[0];
        console.log(file);
          if(file.type == "") {
            console.log("correct");
           
          }
          else {
            //call validation
            this.fileuploadForm.reset();
            this.fileuploadForm.controls["myFile"].setValidators([Validators.required]);
            this.fileuploadForm.get('myFile').updateValueAndValidity();
          }
      }
  }

 download_to_excel()
 { 
  let Excelname:any;
  this.apicall.WriteExcelFileCompetency(this.empcode).subscribe((res)=>{
   Excelname=res.Errormsg;
   let fileurl=this.apicall.GetExcelFile(Excelname);
   let link = document.createElement("a");
     
       if (link.download !== undefined) {
      //   let url = URL.createObjectURL(blob);
         link.setAttribute("href", fileurl);
         link.setAttribute("download", "ReportFile.xlsx");
         link.setAttribute('target', '_blank');
         document.body.appendChild(link);
         link.click();
         document.body.removeChild(link);
       }
   });
 }

}
