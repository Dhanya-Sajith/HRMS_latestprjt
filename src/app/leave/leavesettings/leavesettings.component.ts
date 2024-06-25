import { Component, OnInit } from '@angular/core';
import { ApiCallService } from 'src/app/api-call.service';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/login.service';
import { FormControl,FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-leavesettings',
  templateUrl: './leavesettings.component.html',
  styleUrls: ['./leavesettings.component.scss']
})
export class LeavesettingsComponent implements OnInit {
  user:any;
  userSession:any = this.session.getUserSession();
  authorityflg:any =this.userSession.authorityflg;
  empcode: any=this.userSession.empcode;
  empid:any =this.userSession.id;
  level: any=this.userSession.level;
  usercompany:any = this.userSession.companycode;
  empcompany :any = this.usercompany;
  listCompany: any;
  listYear: any;
  leavestatus = 54;
  listStatus: any;
  listleavepolicy: any;
  listemployeelvedata: any;
  listyearData: any;
  Year: any;
  currentPage=1;
  currentPagePersonal=1;
  searchInput: string='';
  itemsPerPage=10;
  listleaveProcessHis: any;
  listleaveProcessHisFilter: any;
  processedresult: any;
  failed!: string;
  success!: string;
  showModal = 0; 
  Activecompany: any;
  Years: any;
  listnodays:any;
  worktype: any;
  requestForm: FormGroup; 
  isFormValid:boolean=false;
  cryfrwdlve: any;
  advncelve: any;
  isEditing: boolean = false;
  currentbalnce:any;
  selectedleavetype: any;
  selectedpermittedleave: any;
  selecrtedtypeleave: any;
  selectedcompanycode: any;
  isclicked: boolean = false;
  isEditingPolicy: boolean = false;
  desiredPage: any; 
  company_code: any;
  hafzaleave:any;
  HafzaMonth:any = 0;
  listleaves: any;
  empleave:any = 10;
  data: any;
  errmsg: any;
  HafzaLeaveMonthly: any;
  hafzayearlyleave:any;
  HafzaYearlyMonth:any = 0;
  isYearlyclicked: boolean = false;
  emp_code: any;
  leavedata: any;


  constructor(private session:LoginService,private apicall:ApiCallService,private route:Router,private fb: FormBuilder) { 
    this.requestForm = this.fb.group({
      leavetype: ['', Validators.required],
      eligibleleave: ['', Validators.required],
      Noofdays: ['', Validators.required],
      modalcompany: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.ListCompany();
    this.ListYear();
    this.ListStatus();
    this.ListFirstandLastofYear();
    this.ListLeaveTypes();
    
    this.apicall.FetchCompanyLeavePolicy(this.empcompany).subscribe((res)=>{
      this.listleavepolicy=res;
    })
    this.apicall.FetchEmployeeAnnualLeave(this.empcompany,this.empleave).subscribe((res)=>{
      this.listemployeelvedata=res;
      this.Years='01 Jan - 31 Dec '+ this.listemployeelvedata[0].year;
    })
    this.FetchLeaveProcessingHistory(); 
    this.apicall.listRegStatus(52).subscribe(res =>{
      this.listleaves = res;
    }) 
    this.apicall.displayGeneralData('MH', '15').subscribe((res) => {
      this.HafzaLeaveMonthly=res[0].DATA_VALUE;
    });
  }

  ListCompany()
  {
    this.apicall.FetchCompanyList(this.empcode).subscribe((res)=>{
      this.listCompany=res;
      this.Activecompany = this.listCompany[0].KEY_ID
      
    })
  }
  ListYear()
  {
    this.apicall.listYear().subscribe((res)=>{
    this.listYear=res;
    })
  }
  ListStatus()
  {
    this.apicall.listStatus(this.leavestatus).subscribe((res)=>{
      this.listStatus=res;
    })
  }
  ListFirstandLastofYear()
{
  this.apicall.FetchFirstandLastofYear().subscribe((res)=>{
    this.listyearData=res;
    this.Year = this.listyearData[0]['DATA_VALUE'];
})
}

  FetchLeavePolicyDetails()
  {
    const company_code= (<HTMLInputElement>document.getElementById("lvepolicyCmpny")).value;
    this.apicall.FetchCompanyLeavePolicy(company_code).subscribe((res)=>{
      this.listleavepolicy=res;
    })
  }
  FetchEmployeeAnnualLeaveData()
  {
    this.Years="";
    const company_code= (<HTMLInputElement>document.getElementById("employeeCmpny")).value;
    this.apicall.FetchEmployeeAnnualLeave(company_code,this.empleave).subscribe((res)=>{
      this.listemployeelvedata=res;
      this.Years='01 Jan - 31 Dec '+this.listemployeelvedata[0].year;
      const maxPageFiltered = Math.ceil(this.listemployeelvedata.length / this.itemsPerPage);  

        if (this.currentPage > maxPageFiltered) {
          this.currentPage = 1;     
        } 
    })
  }

  FetchLeaveProcessingHistory()
  {
    this.apicall.FetchYearEndProcessingHistory(this.empcode).subscribe((res)=>{
      this.listleaveProcessHis=res;
    })
  }
  FetchLeaveProcessingHistoryFilter()
  {
    const company= (<HTMLInputElement>document.getElementById("YrEndProCmpny")).value;
    const Year= (<HTMLInputElement>document.getElementById("YrEndProYear")).value;
    const status= (<HTMLInputElement>document.getElementById("YrEndProStatus")).value;
    this.apicall.YearEndProcessingHistoryFilter(this.empcode,company,Year,status).subscribe((res)=>{
      this.listleaveProcessHis=res;
    })
  }
  setLocalstorage(CompanyName:any,YearEnds:any,CompanyID:any)
  {
    localStorage.setItem('CompanyName', CompanyName); 
    localStorage.setItem('EndingYear',YearEnds);
    localStorage.setItem('CompanyID',CompanyID);

  }

 

  StartProcess(companyID:any,year:any)
{
  this.apicall.StartLeaveProcessing(this.empcode,companyID,year).subscribe((res)=>{
  this.processedresult=res;
  if(res.Errorid==-2)
  {
    this.showModal = 1; 
    this.success = "Already Processed";
  }
  else if(res.Errorid==-1)
  {
    this.showModal = 1; 
    this.success = "Some leave requests are still pending";
    
  }
  else if(res.Errorid==0)
  {
    this.showModal = 2; 
    this.failed = "Processing failed";
  }
  else
  {
    this.showModal = 1; 
    this.success = "Success";
  }
  this.FetchLeaveProcessingHistoryFilter();
});
}

validateForm() {
  if (this.requestForm.valid){
  this.isFormValid = true;
  }
  else{
    this.markFormGroupTouched(this.requestForm);
  }
}
markFormGroupTouched(formGroup: FormGroup) {
  Object.values(formGroup.controls).forEach(control => {
    control.markAsTouched();
  });
}

Edit(Employeeleave:any)
{
  this.company_code= (<HTMLInputElement>document.getElementById("employeeCmpny")).value;
  this.emp_code = Employeeleave.KEY_ID;
  if(this.company_code != 'MH'){
    Employeeleave.isEditing= true;
    Employeeleave.carryleave = Employeeleave.CARRY_FORWARDED;
    Employeeleave.advncelve=Employeeleave.ADVANCE_LEAVE ;
  }else{
    Employeeleave.isEditing= true;
    Employeeleave.advncelve=Employeeleave.ADVANCE_LEAVE ;
    Employeeleave.yearlyleave=Employeeleave.YEARLY_LEAVE ;
    Employeeleave.carryleave = Employeeleave.CARRY_FORWARDED;
    // this.HafzaAddLeave(Employeeleave);
    // this.HafzaYearlyAddLeave(Employeeleave)
  }
}

CheckVAlidation()
{
  this.apicall.CheckHafzaleave(this.emp_code,this.HafzaMonth,2).subscribe((res)=>{
     if(res[0].LEAVE_TAKEN > res[0].OPENING_BALANCE){
      this.errmsg = "Leave limit is exceeded.";
      this.HafzaMonth = 0;
     }else{
      this.errmsg = "";
     }
  })
}

HafzaAddLeave(data:any)
{
  if(this.HafzaMonth != null)
    {
      const leavecount = Number(this.HafzaMonth * this.HafzaLeaveMonthly);
      this.hafzaleave = leavecount;
      data.advncelve = data.advncelve + leavecount;
    }
}

CheckYealryVAlidation(){
  this.apicall.CheckHafzaleave(this.emp_code,this.HafzaYearlyMonth,1).subscribe((res)=>{
    if(res[0].LEAVE_TAKEN > res[0].OPENING_BALANCE){
     this.errmsg = "Leave limit is exceeded.";
     this.HafzaYearlyMonth = 0;
    }else{
     this.errmsg = "";
    }
 })
}

HafzaYearlyAddLeave(leavedata:any)
{
  if(this.HafzaYearlyMonth != null)
    {
      const leavecount = Number(this.HafzaYearlyMonth * this.HafzaLeaveMonthly);
      this.hafzayearlyleave = leavecount;
      leavedata.yearlyleave = leavedata.yearlyleave + leavecount;
    }
}

saveEditings(Employeeleave:any)
{
  Employeeleave.isEditing = false;
  Employeeleave.isclicked = false;
  Employeeleave.isYearlyclicked = false;

  if(this.company_code != 'MH'){
    this.currentbalnce =  Number(Employeeleave.YEARLY_LEAVE) + Number(Employeeleave.carryleave)+Number(Employeeleave.advncelve)-Number(Employeeleave.AVAILED_LEAVES);
    this.data={ 
      leavetype :Employeeleave.LEAVE_TYPE,
      empcode:Employeeleave.KEY_ID,
      updatedby:this.empcode,
      carryleave:Employeeleave.carryleave,
      advanceleave:Employeeleave.advncelve,
      balnce:this.currentbalnce,
      adv_months: 0,
      yearly_months: 0,
      yearlyleave: Employeeleave.YEARLY_LEAVE

    };
  }else{
    this.currentbalnce =  (Number(Employeeleave.yearlyleave) + Number(Employeeleave.carryleave)+Number(Employeeleave.advncelve))-Number(Employeeleave.AVAILED_LEAVES);
    this.data={ 
      leavetype :Employeeleave.LEAVE_TYPE,
      empcode:Employeeleave.KEY_ID,
      updatedby:this.empcode,
      carryleave:Employeeleave.carryleave,
      advanceleave:Employeeleave.advncelve,
      balnce:this.currentbalnce,
      adv_months: this.HafzaMonth,
      yearly_months: this.HafzaYearlyMonth,
      yearlyleave: Employeeleave.yearlyleave
 
    };
  }
  // alert(JSON.stringify(this.data))
    this.apicall.UpdateLeaves(this.data).subscribe(res=>{
      if(res.Errorid==1)
      {
      this.showModal = 1; 
      this.success = "Saved Successfully";
        this.FetchEmployeeAnnualLeaveData();
      }
      else
      {
        this.showModal = 2; 
        this.failed = "Failed";
        this.FetchEmployeeAnnualLeaveData();
      }
      });
    this.HafzaYearlyMonth = 0;
    this.HafzaMonth = 0;
    }
  //}

  BacktoValues(Employeeleave:any)
  {
    Employeeleave.isEditing= false; 
    Employeeleave.isclicked = false;
    Employeeleave.isYearlyclicked = false;
    this.errmsg = "";
    this.HafzaYearlyMonth = 0;
    this.HafzaMonth = 0;
  }

  ListLeaveTypes()
  {
    this.apicall.FetchTypeofLeaves().subscribe((res)=>{
      this.listnodays=res;
      //alert(JSON.stringify(this.listnodays))
    });
    
  }
   
  setSelectedvalues(leavetype: any,perdays: any,tleave:any,comapanycode:any) {

    this.selectedleavetype = leavetype;
    this.selectedpermittedleave = perdays;
    this.selecrtedtypeleave = tleave;
    this.selectedcompanycode = comapanycode;

}
  DeletePolicy()
  {
    const data={ 
      leavetype :this.selectedleavetype,
      updatedby:this.empcode,
      compnycode:this.selectedcompanycode,
      typeofleave:this.selecrtedtypeleave,
    };
      this.apicall.deleteleavepolicies(data).subscribe((res)=>{
        if(res.Errorid==1)
        {
         this.showModal = 1; 
          this.success = "Deleted Successfully";
           this.FetchLeavePolicyDetails();
        }
        else
        {
           this.showModal = 2; 
           this.failed = "Deletion Failed";
         this.FetchLeavePolicyDetails();
        }
    });
  }
  SaveNewPolicy()
  {
    if (this.requestForm.valid) {
      const leavetypeControl = this.requestForm.get('leavetype');      
      const eleaveControl = this.requestForm.get('eligibleleave');
      const perleaveControl = this.requestForm.get('Noofdays');
      const cmpnyControl = this.requestForm.get('modalcompany');
      if (leavetypeControl && eleaveControl && perleaveControl && cmpnyControl) { 
        const data={
        company:cmpnyControl.value,
        leavetype:leavetypeControl.value,
        updatedby:this.empcode,
        permitteddays:eleaveControl.value,
        typeofleave:perleaveControl.value,
      };
    this.apicall.SaveNewPolicy(data).subscribe((res)=>{
    if(res.Errorid==1)
    {
        this.showModal = 1; 
        this.success = "Added Successfully";
        this.FetchLeavePolicyDetails();
    }
    else
    {
     this.showModal = 2; 
     this.failed = "Failed";
      this.FetchLeavePolicyDetails();
    }
  this.requestForm.reset();
});
}
}
else
{
  this.markFormGroupTouched(this.requestForm);  
}
}

FetchPermittedDays(Employeeleave:any)
{
  Employeeleave.isclicked= true;
  //Employeeleave.isEditing= true;
  this.apicall.GetPermittedLeaves(Employeeleave.KEY_ID).subscribe((res)=>{
    this.listnodays=res;
    Employeeleave.advncelve = this.listnodays[0]['DATA_VALUE'];
  });
}

FetchAdvanceLeave(Employeeleave:any)
{
  Employeeleave.isclicked= true;
  this.leavedata = Employeeleave
  this.HafzaMonth = 0
  //Employeeleave.isEditing= true;
  // this.apicall.GetPermittedLeaves(Employeeleave.KEY_ID).subscribe((res)=>{
  //   this.listnodays=res;
  //   Employeeleave.advncelve = this.listnodays[0]['DATA_VALUE'];
  // });
}

FetchYearlyDays(leave:any){
  leave.isYearlyclicked = true; 
  this.leavedata = leave
  this.HafzaYearlyMonth = 0
}

// Editquota(cmpnyleavepolicy:any)
// {
//   cmpnyleavepolicy.isEditingPolicy= true;
//   cmpnyleavepolicy.permitteddays = cmpnyleavepolicy.PERMITTED_DAYS;

// }

// savePolicyEditings(cmpnyleavepolicy:any){

// }

// BacktoPolicyValues(cmpnyleavepolicy:any){

// }
//Pagination
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
const totalResults = this.listemployeelvedata.filter((employee: any) => {
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

const filteredData = this.listemployeelvedata.filter((employee: any) =>
  Object.values(employee).some((value: any) =>
    typeof value === 'string' &&
    value.toLowerCase().startsWith(this.searchInput.toLowerCase())
  )
);

const start = (this.currentPage - 1) * this.itemsPerPage + 1;
return Math.min(start, filteredData.length);
}


getEntriesEnd(): number {  
const filteredData = this.listemployeelvedata.filter((employee: any) =>
  Object.values(employee).some((value: any) =>
    typeof value === 'string' &&
    value.toLowerCase().startsWith(this.searchInput.toLowerCase())
  )
);
const end = this.currentPage * this.itemsPerPage;
return Math.min(end, filteredData.length);
}

}   
