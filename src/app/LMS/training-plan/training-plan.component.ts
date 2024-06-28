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
  selector: 'app-training-plan',
  templateUrl: './training-plan.component.html',
  styleUrls: ['./training-plan.component.scss']
})
export class TrainingPlanComponent implements OnInit {

  user:any ="personal";
  HODrequestForm : FormGroup;
  dropdownSettings:IDropdownSettings={};
  yearlist: any;
  liststatus: any;
  statustypeid = 67;
  quarterid = 16;
  areaid = 15;
  traniningid = 18;
  providerId = 17;
  listCompany: any;
  listaccesscompany: any;
  userSession:any = this.session.getUserSession();
  empcode: any=this.userSession.empcode;
  listrainingplan: any;
  showModal: any;
  success: any;
  failed: any;
  listtraining: any;
  listarea:any;
  listprovider: any;
  listQuarter: any;
  listEmployee: any;
  isFormValid:boolean=false;
  trainingid: any;
  proposedquarter: any;
  showModals: any;
  successs: any;
  faileds: any;
  listschetrainingplan: any;
  searchInput: string = '';
  desiredPage: any;
  itemsPerPage=10;
  currentPage=1;
  currentPagePersonal=1; 
  desiredPagePersonal: any;
  Failed: any;
  listEmployeeforEdit: any;
  selectedItems: any = [];
  fechScheduledEmp: any;
  listProvideName: any;
  fetchScheduledDtls: any;
  companycode: any;

  selectedpurpose:any = 1;
  selectedskill:any = -1
  Trainingemployees: any;
  editSchedule: any;
  trainingpurpose: any;
  Trainingskills: any;

  durationval= new FormControl();

  constructor(private datePipe: DatePipe,private session:LoginService,private apicall:ApiCallService,private router:Router,private fb: FormBuilder,private route: ActivatedRoute) { 

    this.dropdownSettings = {
      idField: 'EMP_CODE',
      textField: 'EMP_NAME',
      itemsShowLimit: 3,
      limitSelection: -1,
      allowSearchFilter: true,
      clearSearchFilter: true,
    };

    this.HODrequestForm = this.fb.group({
      htrainingname: ['', Validators.required],
      hschedule: ['', Validators.required],
      hprovider: ['', Validators.required],
      harea: ['', Validators.required],
      hemployee: ['', Validators.required],
      remarks: ['', Validators.required]
    });


  }  

  ngOnInit(): void {

  this.route.queryParams
    .subscribe(params => {
      this.user = params['user'];
    }
  );

  if(this.user == 'personal' || this.user == undefined){
    this.user = 'personal';
  }
  else{
    this.user = 'team';
    this.Listscheduledtrainingplans();
    this.fetchallEmp();
    this.listProvidername();
  }

   this.listYear();
   this.ListStatus();
   this.ListCompany();
   this.Listtrainingplans();
   this.listingarea();
   this.FetchTrainingSubjects();
   this.listingprovider();
   this.listingquarter();
   this.EmployeeListFn();
   this.addnewrequest();
   this.listProvidername();
   this.selectprovider(2)


  }

listProvidername()
{
  // this.apicall.ProvidersComboData().subscribe(res => {
  //   this.listProvideName = res;
  //   alert(JSON.stringify(res))
  // })
  this.apicall.Combo_TrainingProvidersapi(2).subscribe((res) => {
    this.listProvideName = res;
 
   })
}


  listYear()
  {
    this.apicall.listYear().subscribe((res)=>{
    this.yearlist=res;
      })
  }

  ListStatus()
  {
    this.apicall.listStatus(this.statustypeid).subscribe((res)=>{
      this.liststatus=res;
      })
  }

  ListCompany()
  {
    this.apicall.FetchCompanyList(this.empcode).subscribe((res)=>{
      this.listaccesscompany=res;
      })
  }

  listingarea()
  {
    this.apicall.listRegStatus(this.areaid).subscribe(res =>{
      this.listarea = res;
    })
  }

  listingprovider()
  {
    this.apicall.listRegStatus(this.providerId).subscribe(res =>{
      this.listprovider = res;
    })
  }

  listingquarter()
  {
    this.apicall.listRegStatus(this.quarterid).subscribe(res =>{
      this.listQuarter = res;
    })
  }


  Listtrainingplans()
  {
    
       this.apicall.Listingtrainingplans(this.empcode).subscribe(res =>{
       this.listrainingplan=res;
       })
     
  }

  Listscheduledtrainingplans()
  {
 
       this.apicall.Listscheduledtrainingplans(this.empcode).subscribe(res =>{
       this.listschetrainingplan=res;
       })
     
  }

  


 EmployeeListFn(): void {

  //  const company = (<HTMLInputElement>document.getElementById("accesscompany")).value;

  //   this.apicall.FetchEmployeeList(-1,-1,this.empcode).subscribe(res => {
  //     this.listEmployee = res;
  //   })
  }

  Listtrainingplansfilter()
  {
    const company = (<HTMLInputElement>document.getElementById("accesscompany")).value;
     const year= (<HTMLInputElement>document.getElementById("year")).value;
     const status = (<HTMLInputElement>document.getElementById("trainingstatus")).value;
     const emp_code = this.userSession.empcode;

    //  alert(company)
    //  alert(year)
    //  alert(status)
    //  alert(emp_code)

     const data = {
      company:company,
      emp_code: emp_code,
      status: status,
      year:year,
       };
       
      this.apicall.Listingtrainingplansfilter(data).subscribe(res =>{
      this.listrainingplan=res;
 
     // alert(JSON.stringify(res));
    
      })

      this.apicall.FetchEmployeeList(-1,company,this.empcode).subscribe(res => {
        this.listEmployee = res;
      })

  

  }

  ScheduledPlanList_Filter()
  {
     const company = (<HTMLInputElement>document.getElementById("schecompany")).value;
     const year= (<HTMLInputElement>document.getElementById("scheyear")).value;
     const status = (<HTMLInputElement>document.getElementById("schestatus")).value;
     const quarter = (<HTMLInputElement>document.getElementById("schequarter")).value;
     const emp_code = this.userSession.empcode;

      const data = {
      company:company,
      emp_code: emp_code,
      status: status,
      year:year,
      quarter:quarter
       };
       
      this.apicall.ListScheduledPlanList_FilterHR(data).subscribe(res =>{
      this.listschetrainingplan=res;
 
     // alert(JSON.stringify(res));
    
      })
  }


  teamselection(user:string)
  {   
    this.user = user; 
    if (this.user === 'team') 
    {
      this.Listscheduledtrainingplans();
      this.fetchallEmp();
      this.listProvidername();
    }
    else
    {

    }
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


  HODvalidateForm()
    {
      if (this.HODrequestForm.valid){
          this.isFormValid = true;
        }
      else{
        this.markFormGroupTouched(this.HODrequestForm);
      }
    }

    addnewrequest()
    {
      const company = (<HTMLInputElement>document.getElementById("accesscompany")).value;

      if(company=='-1')
        {
          (<HTMLInputElement>document.getElementById("openModalButtonForalertsuccess")).click();
          this.showModals = 2;
          this.faileds = "Please select company name";
        }
        else
        {
          (<HTMLInputElement>document.getElementById("addrequestbutton")).click();
        }
     
    }

    HODRequests()
    {
      if (this.HODrequestForm.valid) {
        const trainingname= this.HODrequestForm.get('htrainingname');
        const schedule= this.HODrequestForm.get('hschedule'); 
        const provider= this.HODrequestForm.get('hprovider'); 
        const area= this.HODrequestForm.get('harea');
        const remarks= this.HODrequestForm.get('remarks');
        const emplist = this.HODrequestForm.get('hemployee')?.value
        const empname = emplist.map((item: {
          EMP_CODE: any; id: any; 
          }) => item.EMP_CODE).join(',');

          const data = {
            empcode : empname,
            area_id : area?.value,
            training_subject : trainingname?.value,
            proposed_quarter : schedule?.value,
            training_type : provider?.value,
            updated_by : this.empcode,
            eflag : 2,
            remarks :  remarks?.value
            };

          console.log(JSON.stringify(data))

          this.apicall.SaveTrainingRequest(data).subscribe(res =>{
            
            if(res.Errorid == 1)
            {
              (<HTMLInputElement>document.getElementById("openModalButtonForalertsuccess")).click();
              this.showModals = 1;
              this.successs = "Requested Successfully!";
              this.Listtrainingplans();
              this.hClear();
            }
            else        
            {
              (<HTMLInputElement>document.getElementById("openModalButtonForalertsuccess")).click();
              this.showModals = 2;
              this.faileds = "Failed!";
              this.Listtrainingplans();
              this.hClear();
            }   
          })
      }
      else{
        this.markFormGroupTouched(this.HODrequestForm); 
      }
    }

    FetchTrainingSubjects()
    {
      this.apicall.FetchTrainingSubjects().subscribe(res =>{
      this.listtraining=res;
     // alert(JSON.stringify(res));
      })
    }

    markFormGroupTouched(formGroup: FormGroup) {
      Object.values(formGroup.controls).forEach(control => {
        control.markAsTouched();
      });
    }

    hClear()
    {
      this.HODrequestForm.reset();
    }


    selectedforEdit(trainingId:any,proposedQuarter:any)
    {
      this.trainingid = trainingId;
      this.proposedquarter = proposedQuarter;
    }

    proposedEdit(trainingId:any,convenientqtr:any,remarks:any)
    {
     
      const editpropdata={
        trainingid:trainingId,
        quarter:convenientqtr,
        remarks:remarks,
        updatedby : this.empcode,
      }

      this.apicall.editproposedData(editpropdata).subscribe((res) => {
      
        if(res.Errorid==1){
          (<HTMLInputElement>document.getElementById("openModalButtonForalertsuccess")).click();
          this.showModals = 1;
          this.successs = "Updated Successfully!";
         this.Listtrainingplans();
       
          var remarksnew = (<HTMLInputElement>document.getElementById('remarks'));
          remarksnew.value = '';
    
        }
        else{
          (<HTMLInputElement>document.getElementById("openModalButtonForalertsuccess")).click();
          this.showModals = 2;
          this.faileds = "Failed!";
          this.Listtrainingplans();  
        }

      }); 

    }


holdproposedplan(trainingId:any)
{

  const holdplan={
    trainingid:trainingId,
    remarks:"",
    updatedby:this.empcode,
    mflag : 4,
  }

  this.apicall.holdproposedData(holdplan).subscribe((res) => {
  
    if(res.Errorid==1){
      (<HTMLInputElement>document.getElementById("openModalButtonForalertsuccess")).click();
      this.showModals = 1;
      this.successs = "Hold Successfully!";
     this.Listtrainingplans();
   
      var remarksnew = (<HTMLInputElement>document.getElementById('remarks'));
      remarksnew.value = '';

    }
    else{
      (<HTMLInputElement>document.getElementById("openModalButtonForalertsuccess")).click();
      this.showModals = 2;
      this.faileds = "Failed!";
      this.Listtrainingplans();  
    }

  }); 

}   


releaseplan(trainingId:any)
{

  const holdplan={
    trainingid:trainingId,
    remarks:"",
    updatedby:this.empcode,
    mflag : 4,
  }

  this.apicall.releaseplanData(holdplan).subscribe((res) => {
  
    if(res.Errorid==1){
      (<HTMLInputElement>document.getElementById("openModalButtonForalertsuccess")).click();
      this.showModals = 1;
      this.successs = "Hold Release Successfully!";
     this.Listtrainingplans();
   
      var remarksnew = (<HTMLInputElement>document.getElementById('remarks'));
      remarksnew.value = '';

    }
    else{
      (<HTMLInputElement>document.getElementById("openModalButtonForalertsuccess")).click();
      this.showModals = 2;
      this.faileds = "Failed!";
      this.Listtrainingplans();  
    }

  }); 

}   



rejectplan(trainingId:any)
{
  this.trainingid=trainingId;
}

confirmrejectplan(trainingId:any,reason:any)
{

  const holdplan={
    trainingid:trainingId,
    remarks:reason,
    updatedby:this.empcode,
    mflag : 7,
  }


  this.apicall.rejectproposedData(holdplan).subscribe((res) => {
  
    if(res.Errorid==1){
      (<HTMLInputElement>document.getElementById("openModalButtonForalertsuccess")).click();
      this.showModals = 1;
      this.successs = "Rejected Successfully!";
     this.Listtrainingplans();
   
      var remarksnew = (<HTMLInputElement>document.getElementById('remarks'));
      remarksnew.value = '';

    }
    else{
      (<HTMLInputElement>document.getElementById("openModalButtonForalertsuccess")).click();
      this.showModals = 2;
      this.faileds = "Failed!";
      this.Listtrainingplans();  
    }

  }); 

}

// pagination proposed

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
const totalResults = this.listrainingplan.filter((employee: any) => {
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

const filteredData = this.listrainingplan.filter((employee: any) =>
  Object.values(employee).some((value: any) =>
    typeof value === 'string' &&
    value.toLowerCase().startsWith(this.searchInput.toLowerCase())
  )
);

const start = (this.currentPage - 1) * this.itemsPerPage + 1;
return Math.min(start, filteredData.length);
}


getEntriesEnd(): number {  
const filteredData = this.listrainingplan.filter((employee: any) =>
  Object.values(employee).some((value: any) =>
    typeof value === 'string' &&
    value.toLowerCase().startsWith(this.searchInput.toLowerCase())
  )
);
const end = this.currentPage * this.itemsPerPage;
return Math.min(end, filteredData.length);
}



// pagination --- scheduled


getTotalPagesPersonal(): number {
  return Math.ceil(this.totalSearchResultsPersonal / this.itemsPerPage);
}

goToPagePersonal() {
  const totalPages = Math.ceil(this.totalSearchResultsPersonal / this.itemsPerPage);
  if (this.desiredPagePersonal >= 1 && this.desiredPagePersonal <= totalPages) {
    this.currentPagePersonal = this.desiredPagePersonal;
  } else {  
    
    (<HTMLInputElement>document.getElementById("openModalButton")).click();
    this.showModal = 2; 
    this.Failed='Invalid page number!'; 
    this.desiredPagePersonal=''; 
  }   
 
}
getPageNumbersPersonal(currentPage: number): number[] {
  const totalPages = Math.ceil(this.totalSearchResultsPersonal / this.itemsPerPage);
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
get totalSearchResultsPersonal(): number {
const totalResults = this.listschetrainingplan.filter((policy: any) => {
  return Object.values(policy).some((value: any) =>
    typeof value === 'string' && value.toLowerCase().startsWith(this.searchInput.toLowerCase())
  );
}).length;

const maxPageFiltered = Math.ceil(totalResults / this.itemsPerPage);  

if (this.currentPagePersonal > maxPageFiltered) {
  this.currentPagePersonal = 1; 
}

return totalResults;
}

// Function to change the current page
changePagePersonal(page: number): void { 
  this.desiredPagePersonal = '';   
  this.currentPagePersonal = page;
  const maxPage = Math.ceil(this.totalSearchResultsPersonal / this.itemsPerPage);
  if (this.currentPagePersonal > maxPage) {
    this.currentPagePersonal = 1;
  }        
}
getEntriesStartPersonal(): number {
if (this.currentPage === 1) {
  return 1;
}

const filteredData = this.listschetrainingplan.filter((policy: any) =>
  Object.values(policy).some((value: any) =>
    typeof value === 'string' &&
    value.toLowerCase().startsWith(this.searchInput.toLowerCase())
  )
);

const start = (this.currentPagePersonal - 1) * this.itemsPerPage + 1;
return Math.min(start, filteredData.length);
}

getEntriesEndPersonal(): number {  
  const filteredData = this.listschetrainingplan.filter((policy: any) =>
    Object.values(policy).some((value: any) =>
      typeof value === 'string' &&
      value.toLowerCase().startsWith(this.searchInput.toLowerCase())
    )
  );
  const end = this.currentPagePersonal * this.itemsPerPage;
  return Math.min(end, filteredData.length);
  }
  
  selectedTrainingIds: number[] = [];

  handleTrainingClick(trainingId: number) {
    // Toggle the presence of trainingId in the selectedTrainingIds array
    const index = this.selectedTrainingIds.indexOf(trainingId);
    if (index === -1) {
        // If trainingId is not already in the array, add it
        this.selectedTrainingIds.push(trainingId);
    } else {
        // If trainingId is already in the array, remove it
        this.selectedTrainingIds.splice(index, 1);
    }
    
  }

  sendToVP() {
    // Convert the array of selectedTrainingIds to a comma-separated string
    const trainingIdsString = this.selectedTrainingIds.join(',');

    if(trainingIdsString!="")
      {

    const data = {
      trainingIdString:trainingIdsString,
      updated_by: this.empcode,
       };
       
      this.apicall.sendtoVP(data).subscribe(res =>{
      //this.listrainingplan=res;
 
      if(res.Errorid==1){
        (<HTMLInputElement>document.getElementById("openModalButtonForalertsuccess")).click();
        this.showModals = 1;
        this.successs = "Successfully send to VP!";
        this.Listtrainingplans();
  
      }
      else{
        (<HTMLInputElement>document.getElementById("openModalButtonForalertsuccess")).click();
        this.showModals = 2;
        this.faileds = "Failed!";
        this.Listtrainingplans();  
      }
    
      })
    }
    else
    {
      (<HTMLInputElement>document.getElementById("openModalButtonForalertsuccess")).click();
      this.showModals = 2;
      this.faileds = "Please select trainings...";
    }
    
}

editscheduledplan(trainingId:any)
{

  //alert(companycode);
  // this.trainingid=trainingId;
  // (<HTMLInputElement>document.getElementById("trainingid")).value =  trainingId;

  // this.apicall.fetchScheduledEmployee(trainingId).subscribe((res) => {
  // this.fechScheduledEmp=res;
  // })

  this.apicall.fetchScheduledDatas(trainingId).subscribe((res) => {
    this.fetchScheduledDtls=res;

    //alert(this.fetchScheduledDtls[0].COMPANY);

    this.companycode= this.fetchScheduledDtls[0].COMPANY;

    this.apicall.FetchEmployeeList(-1,this.companycode,this.empcode).subscribe(res => {
      this.listEmployeeforEdit = res;
    })

  //alert(JSON.stringify(this.fetchScheduledDtls[0].SCHEDULED_DATE))
   //const actualdt=this.fetchScheduledDtls[0].SCHEDULED_DATE
   const newdates=this.datePipe.transform(this.fetchScheduledDtls[0].SCHEDULED_DATE,"yyyy-MM-dd");

   //alert(newdate)

    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1; // Months are zero-indexed, so add 1
    const day = today.getDate();

    // Construct a formatted date string (e.g., "YYYY-MM-DD")
    const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
   // alert(formattedDate)

    // if(formattedDate>newdates)
    //   {

    //   }


    //skill training

    this.apicall.listStatus(71).subscribe((res)=>{
      this.trainingpurpose=res;
    })

    this.apicall.FetchTrainigReqSkills(this.companycode).subscribe((res)=>{
      this.Trainingskills=res;
    })

    this.apicall.Fetch_TrainingEmployeeList(trainingId).subscribe((res)=>{
      this.fechScheduledEmp=res;
    })

  
  })


}

fetchallEmp()
{

 //alert(this.companycode);
 this.apicall.FetchEmployeeList(-1,this.companycode,this.empcode).subscribe(res => {
   this.listEmployeeforEdit = res;
 })

}




addEmployee(selectedItems:any,num:any) {

  //console.log(selectedItems)
   const empname = this.selectedItems.map((item: {
     EMP_CODE: any; id: any; 
     }) => item.EMP_CODE).join(',');
     
   const trainingId=  (<HTMLInputElement>document.getElementById("trainingid")).value 
 
 
   if( num ==1){
     this.editSchedule={
       trainingid:trainingId,
       mflag:1,
       updatedby:this.empcode,
       employees:empname,
       purpose:1,
       competencyID:null
     }
   }else{
     this.editSchedule={
       trainingid:trainingId,
       mflag:1,
       updatedby:this.empcode,
       employees:empname,
       purpose:this.selectedpurpose,
       competencyID:this.selectedskill
     }
   }
  //  alert(JSON.stringify(this.editSchedule))
   this.apicall.editscheduledData(this.editSchedule).subscribe((res) => {
     this.editscheduledplan(trainingId);
   })
   this.selectedItems = [];
 }
 
 removeEmployee(Items:any) {
 
   //console.log(selectedItems)
   //  const empname = this.selectedItems.map((item: {
   //    EMP_CODE: any; id: any; 
   //    }) => item.EMP_CODE).join(',');
  
   //  const trainingId=  (<HTMLInputElement>document.getElementById("trainingid")).value 
    
    const removeSchedule={
      trainingid:Items.TRAINING_ID,
      mflag:2,
      updatedby:this.empcode,
      employees:Items.EMP_CODE,
      purpose:Items.PURPOSE,
      competencyID:Items.COMPETENCY_ID
    }
 
  
    this.apicall.editscheduledData(removeSchedule).subscribe((res) => {
     this.editscheduledplan(Items.TRAINING_ID);
  
    })
  
  }

  //skill training
fetchskilledemployees()
{
  this.apicall.FetchSkillGapEmployees(this.companycode,this.selectedskill).subscribe((res)=>{
    this.Trainingemployees=res;
    // alert(JSON.stringify(res))
  })
}

 UpdateScheduledData()
 {
  const trainingId=  (<HTMLInputElement>document.getElementById("trainingid")).value;
  const location=  (<HTMLInputElement>document.getElementById("location")).value;
  const providerty=  (<HTMLInputElement>document.getElementById("providerty")).value;
  const provider=  (<HTMLInputElement>document.getElementById("provider")).value;
 // const duration=  (<HTMLInputElement>document.getElementById("duration")).value;

  // const durationval = <HTMLInputElement>document.getElementById('duration');
  // const duration = durationval.value;

  const duration = this.durationval.value;

  const actual_train_dt=  (<HTMLInputElement>document.getElementById("actual_train_dt")).value;
  const assess = (document.querySelector('input[name="assess"]:checked') as HTMLInputElement)?.value;
  const cert = (document.querySelector('input[name="cert"]:checked') as HTMLInputElement)?.value;
  const effective = (document.querySelector('input[name="effective"]:checked') as HTMLInputElement)?.value;
  const checkbox = (<HTMLInputElement>document.getElementById("formCheck11"))
  const markasvalue = checkbox.checked ? checkbox.value : "0";

  const updatedata = {
    trainingid: trainingId,
    location: location,
    provider: provider,
    training_type: providerty,
    duration: duration,
    actual_train_dt: actual_train_dt,
    assess: assess,
    cert: cert,
    effective: effective,
    mark_val: markasvalue,
    updatedby:this.empcode,
    };


   // alert(JSON.stringify(updatedata))

    this.apicall.Update_ScheduledTraining(updatedata).subscribe(res =>{
      //this.listrainingplan=res;
 
     

      if(res.Errorid==1){
        (<HTMLInputElement>document.getElementById("openModalButtonForalertsuccess")).click();
        this.showModals = 1;
        this.successs = "Updated Successfully";
        this.Listtrainingplans();
  
      }
      else{
        (<HTMLInputElement>document.getElementById("openModalButtonForalertsuccess")).click();
        this.showModals = 2;
        this.faileds = "Failed";
        this.Listtrainingplans();  
      }
    
      })


 }


 navigateTo_assessPage(TrainingId:any)
 {
  this.router.navigate(['/add_assessment'], { queryParams: { Id: TrainingId } });
 }
 navigateTo_attendancePage(TrainingId:any)
 {
   this.router.navigate(['/attendanceRegister'], { queryParams: { Id: TrainingId } });
 }
 navigateTo_feedbackPage(TrainingId:any)
 {
   this.router.navigate(['/coursefeedbackHR'], { queryParams: { Id: TrainingId } });
 }
 navigateTo_effectivePage(TrainingId:any)
 {
   this.router.navigate(['/courseEffectivenessHR'], { queryParams: { Id: TrainingId } });
 }

 navigateTo_certUploadPage(TrainingId:any)
 {
   this.router.navigate(['/upload_certificate'], { queryParams: { Id: TrainingId } });
 }

// only for test

 navigateTo_takeassessment(TrainingId:any)
 {
   this.router.navigate(['/take_assessment'], { queryParams: { Id: TrainingId } });
 }


 selectprovider(proId:any)
 {
  this.apicall.Combo_TrainingProvidersapi(proId).subscribe((res) => {
    this.listProvideName = res;
 
   })
 }




}
