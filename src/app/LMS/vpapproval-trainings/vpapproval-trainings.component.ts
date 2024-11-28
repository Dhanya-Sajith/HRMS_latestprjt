import { Component, OnInit } from '@angular/core';
import { ApiCallService } from 'src/app/api-call.service';
import { LoginService } from 'src/app/login.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-vpapproval-trainings',
  templateUrl: './vpapproval-trainings.component.html',
  styleUrls: ['./vpapproval-trainings.component.scss']
})
export class VPApprovalTrainingsComponent implements OnInit {

  dropdownSettings:IDropdownSettings={};
  requestForm: FormGroup;
  EditForm: FormGroup;
  CancelForm: FormGroup;

  userSession:any = this.session.getUserSession();
  authorityflg:any =this.userSession.authorityflg;
  empcode: any=this.userSession.empcode;
  empid:any =this.userSession.id;
  level: any=this.userSession.level;
  roleid:any =this.userSession.level;
  grpname:any=this.userSession.grpname; 
  
  companydata: any;
  selectedCompanyid: any=-1;
  yeardata: any;
  selectedyearTeam: any=-1;
  statusdata: any;
  areadata: any;
  scheduledata: any;
  providerdata: any;
  trainingname: any;
  employeelist: any;
  selectedItems_list: any = [];
  tabledata: any;
  showModal!: number;
  success!: string;
  failed!: string;
  selectedstatus: any=2;
  itemsPerPage=10;
  currentPage=1;
  desiredPage: any; 
  searchInput: string='';
  training_id: any;
  proposed_quarter: any;
  item: any;
  reason: any;  
  viewdata: any;
  constructor(private session:LoginService,private apicall:ApiCallService,private formBuilder: FormBuilder) {
    this.requestForm = this.formBuilder.group({
      area_id: ['', Validators.required],
      training_subject: ['', Validators.required],
      empcode: ['', Validators.required],
      training_type: ['', Validators.required],
      proposed_quarter: ['', Validators.required],
      remarks: ['', Validators.required]
    });    
    this.EditForm = this.formBuilder.group({      
      training_type: ['', Validators.required],
      proposed_quarter: ['', Validators.required],
      remarks: ['', Validators.required]
    });
    this.CancelForm = this.formBuilder.group({      
      reason: ['', Validators.required]
      
    });
   }

  ngOnInit(): void {
    this.dropdownSettings = {
      idField: 'EMP_CODE',
      textField: 'EMP_NAME',
      itemsShowLimit: 3,
      limitSelection: -1,
      allowSearchFilter: true,
      clearSearchFilter: true,
    };
    
     //company combo box
     this.apicall.FetchCompanyList(this.empcode).subscribe((res) => {
      this.companydata=res;      
    });  
    //Year drop down
    this.apicall.listYear().subscribe((res) => {
      this.yeardata=res;      
    }); 
   //Status drop down
    this.apicall.StatusComboData(67).subscribe((res) => {
      this.statusdata=res;  
      this.statusdata.unshift({ KEY_ID: -1, DATA_VALUE: 'All' });    
    });  
    //Learning Area
    this.apicall.StatusComboData(15).subscribe((res) => {
      this.areadata=res;      
    });
    //Schedule drop down
    this.apicall.StatusComboData(16).subscribe((res) => {
      this.scheduledata=res;      
    });
    //Provider
    this.apicall.StatusComboData(17).subscribe((res) => {
      this.providerdata=res; 
      //alert(JSON.stringify(this.providerdata))     
    });
    //Training Name
    this.apicall.FetchTrainingSubjects().subscribe((res) => {
      this.trainingname=res;           
      //alert(JSON.stringify(this.trainingname)) 
    });       
    //table data
    this.filter();       
  }
   filter(){
    this.apicall.FetchTrainingPlan_FilterVP(this.empcode,this.selectedstatus,this.selectedyearTeam,this.selectedCompanyid).subscribe((res) => {
      this.tabledata=res;    
      //alert(JSON.stringify(this.tabledata))  
      const maxPageFiltered = Math.ceil(this.tabledata.length / this.itemsPerPage);  

    if (this.currentPage > maxPageFiltered) {
      this.currentPage = 1;     
    }        
    }); 
    //employee
    this.apicall.FetchEmployeeList(-1,this.selectedCompanyid,this.empcode).subscribe((res) => {
      this.employeelist=res;           
    });
   }
   getStatusStyles(status:any) {    
    let styles = {
      'background-color': status === 0 ? '#54b4e4' : 
                          (status === 2 ? '#54b4e4' : 
                          (status === 4 ? '#f7b84b' : 
                          (status === 6 ? '#212529' : 
                          (status === 7 ? '#f06548' :
                          (status === 9 ? '#405189' : '#0ab39c'))))),
                        
      'color': 'white',
    };
    
    return styles;
  }
  validateCompany(){
    if(this.selectedCompanyid==-1)
      {
        (<HTMLInputElement>document.getElementById("openModalButton")).click();
        this.showModal = 2;
        this.failed = "Please select company!";
      }else{
        (<HTMLInputElement>document.getElementById("openAddReqModalButton")).click();
        
  }   
  }
  //Team add new request  
  submitForm() {
    if (this.requestForm.valid) {
      let trainingid
      let trainingname= this.requestForm.get('training_subject');
      const schedule= this.requestForm.get('proposed_quarter'); 
      const provider= this.requestForm.get('training_type'); 
      const area= this.requestForm.get('area_id');
      const remarks= this.requestForm.get('remarks');
      const empCodes = this.requestForm.value.empcode.map((emp: { EMP_CODE: any; }) => emp.EMP_CODE);
      const empCodeString = empCodes.join(','); 
      const selectedTraining = this.trainingname.find((training: { DISPLAY_FIELD: any; }) => training.DISPLAY_FIELD == trainingname?.value);
      if (selectedTraining) {
        trainingid= selectedTraining.VALUE_FIELD;
        trainingname = null;
      }else{
        trainingid = -1
        trainingname= trainingname?.value;
      }

      // const data = {
      //     ...this.requestForm.value,
      //     updated_by: this.empcode,
      //     eflag: 3,
      //     empcode: empCodeString // Update the empcode property with the comma-separated string
      // };
      
      const data = {
        empcode : empCodeString,
        area_id : area?.value,
        training_subject : trainingid,
        proposed_quarter : schedule?.value,
        training_type : provider?.value,
        updated_by : this.empcode,
        eflag : 3,
        remarks :  remarks?.value,
        new_training_name : trainingname
        };
  
     console.log(JSON.stringify(data))
     this.apicall.SaveTrainingRequest(data).subscribe((res)=>{
      //alert(JSON.stringify(res));   
      if(res.Errorid==1){
        (<HTMLInputElement>document.getElementById("openModalButton")).click();
        this.showModal = 1;
        this.success = "Request added successfully!";
        
      }
      else{
        (<HTMLInputElement>document.getElementById("openModalButton")).click();
        this.showModal = 2;
        this.failed = "Failed!";
      }   
      this.cancelAddReq();
      this.filter();          
    }) 
    } else {      
      this.markFormGroupTouched(this.requestForm);
    }
  }  
  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
  cancelAddReq(){
    this.requestForm.reset();
    this.requestForm.get('area_id')?.setValue('');
    this.requestForm.get('training_subject')?.setValue('');
    this.requestForm.get('training_type')?.setValue('');
    this.requestForm.get('proposed_quarter')?.setValue('');
  }
  //Edit form
  itemToEdit(item:any){
    this.item=item;
    this.training_id=item.TRAINING_ID;  
    this.EditForm.get('training_type')?.setValue(item.TRAINING_TYPEID); 
    this.EditForm.get('proposed_quarter')?.setValue(item.PROPOSED_QUARTER_ID);
     
  }
  
  submitEditForm() {  
    if (this.EditForm.valid) { 
      const data = {
          ...this.EditForm.value,
          updated_by: this.empcode,         
          training_id:this.training_id          
      };
  
     console.log(JSON.stringify(data))
     this.apicall.ApproveTrainingPlanbyVP(data).subscribe((res)=>{
      //alert(JSON.stringify(res));   
      if(res.Errorid==1){
        (<HTMLInputElement>document.getElementById("openModalButton")).click();
        this.showModal = 1;
        this.success = "Request approved successfully!";
        
      }
      else{
        (<HTMLInputElement>document.getElementById("openModalButton")).click();
        this.showModal = 2;
        this.failed = "Failed!";
      }   
      this.cancelEditForm();
      this.filter();          
    }) 
  } else {        
    this.markFormGroupTouched(this.EditForm);
}    
  } 
  cancelEditForm(){
    this.EditForm.reset();    
    this.EditForm.get('training_type')?.setValue(this.item.TRAINING_TYPEID);
    this.EditForm.get('proposed_quarter')?.setValue(this.item.PROPOSED_QUARTER_ID);
  }
  hold(item:any){
    const data = {      
      updatedby: this.empcode,         
      trainingid:item.TRAINING_ID,
      remarks:null,
      mflag:10
  };

 console.log(JSON.stringify(data))
 this.apicall.HoldOrCancel_Training_HR(data).subscribe((res)=>{
  //alert(JSON.stringify(res));   
  if(res.Errorid==1){
    (<HTMLInputElement>document.getElementById("openModalButton")).click();
    this.showModal = 1;
    this.success = "Training holded!";
    
  }
  else{
    (<HTMLInputElement>document.getElementById("openModalButton")).click();
    this.showModal = 2;
    this.failed = "Failed!";
  }   
  this.filter();          
})  
  }
cancelTraining(){
  if (this.CancelForm.valid) {
    const data = {      
      updatedby: this.empcode,         
      trainingid:this.training_id,
      ...this.CancelForm.value,
      mflag:7
  };

 console.log(JSON.stringify(data))
 this.apicall.HoldOrCancel_Training_HR(data).subscribe((res)=>{
  //alert(JSON.stringify(res));   
  if(res.Errorid==1){
    (<HTMLInputElement>document.getElementById("openModalButton")).click();
    this.showModal = 1;
    this.success = "Training rejected!";
    
  }
  else{
    (<HTMLInputElement>document.getElementById("openModalButton")).click();
    this.showModal = 2;
    this.failed = "Failed!";
  }   
  this.filter(); 
  this.clearReject();       
})  
   
} else {        
    this.markFormGroupTouched(this.CancelForm);
}
}    
 clearReject(){
  this.CancelForm.reset();
 } 
 resume(item:any){
  const data = {      
    updatedby: this.empcode,         
    trainingid:item.TRAINING_ID,    
    mflag:10
};

console.log(JSON.stringify(data))
this.apicall.Release_Training(data).subscribe((res)=>{
//alert(JSON.stringify(res));   
if(res.Errorid==1){
  (<HTMLInputElement>document.getElementById("openModalButton")).click();
  this.showModal = 1;
  this.success = "Training resumed!";
  
}
else{
  (<HTMLInputElement>document.getElementById("openModalButton")).click();
  this.showModal = 2;
  this.failed = "Failed!";
}   
this.filter();          
})  

}
viewDetails(trainingid:any){
  this.apicall.ViewTrainingDetails(trainingid).subscribe((res)=>{
    this.viewdata=res;
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
    const maxPageNumbers = 5; // Number of page numbers to show
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
  const totalResults = this.tabledata.filter((policy: any) => {
    return Object.values(policy).some((value: any) =>
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
  
  const filteredData = this.tabledata.filter((policy: any) =>
    Object.values(policy).some((value: any) =>
      typeof value === 'string' &&
      value.toLowerCase().startsWith(this.searchInput.toLowerCase())
    )
  );

  const start = (this.currentPage - 1) * this.itemsPerPage + 1;
  return Math.min(start, filteredData.length);
}


getEntriesEnd(): number {  
  const filteredData = this.tabledata.filter((policy: any) =>
    Object.values(policy).some((value: any) =>
      typeof value === 'string' &&
      value.toLowerCase().startsWith(this.searchInput.toLowerCase())
    )
  );
  const end = this.currentPage * this.itemsPerPage;
  return Math.min(end, filteredData.length);
}

}

