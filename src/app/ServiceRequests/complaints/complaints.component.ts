import { Component, OnInit } from '@angular/core';
import { ApiCallService } from 'src/app/api-call.service';
import { LoginService } from 'src/app/login.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-complaints',
  templateUrl: './complaints.component.html',
  styleUrls: ['./complaints.component.scss']
})
export class ComplaintsComponent implements OnInit {

  selectedTab: any='personal';

userSession:any = this.session.getUserSession();
  empcode: any=this.userSession.empcode;
  level: any=this.userSession.level;
  authorityflg:any =this.userSession.authorityflg;
  grpname:any=this.userSession.grpname; 
  desig:any=this.userSession.desig.split('#', 2);   
  desigid:any= this.desig[0];
   
  AddReqForm: FormGroup;
  AssignReqForm: FormGroup;
  CloseReqForm: FormGroup;


  status: any;
  selectedStatus: any=0;
  dropdownSettings:IDropdownSettings={};
  selectedItems_list: any;
  empdata: any;
  showModal: any;
  success: any;
  failed: any;
  viewflag: any=0;
  year: any=-1;
  tabledata: any;
  description: any;
  item: any;
  addressto: any;
  closureDate: any;
  closureComment: any;
  searchInput:string='';
  currentPagePersonal=1;
  itemsPerPage=10;
  currentPage=1;
  desiredPage: any; 
  desiredPagePersonal: any;
  selectedStatusTeam: any=0;  
  yeardata: any;
  tabledataTeam: any;
  currentDate: any;
  formattedDate: any;
  assignerComment: any;
  assignedto: any;
  closureby: any;
  searchInputTeam:string='';
  statusTeam: any;
  Assignerdata: any;


  constructor(private apicall:ApiCallService,private session:LoginService,private formBuilder: FormBuilder, private datePipe: DatePipe,private route: ActivatedRoute) {
    this.AddReqForm = this.formBuilder.group({      
      addressto: ['', Validators.required],
      description: ['', Validators.required],      
    });
    this.AssignReqForm = this.formBuilder.group({      
      assignto: ['', Validators.required],
      comment: ['', Validators.required],      
    });
    this.CloseReqForm = this.formBuilder.group({      
      dateofclosure: ['', Validators.required],
      comment: ['', Validators.required],      
    });
   }

  ngOnInit(): void {
    this.route.queryParams
      .subscribe(params => {
        this.selectedTab = params['user'];
      }
    );

    if( this.selectedTab == 'personal' || this.selectedTab == undefined){
      this.selectedTab = 'personal'
      this.fetchcomplaints();
    }
    else{
      this.selectedTab = 'team';
      this.level = this.userSession.level;
      this.fetchcomplaintsTeam();
    }    
    this.dropdownSettings = {
      idField: 'EMP_CODE',
      textField: 'EMP_NAME',
      itemsShowLimit: 1,
      limitSelection: 1,
      allowSearchFilter: true,
      clearSearchFilter: true,
    };
    //Status drop down
    this.apicall.listCompanyList(76).subscribe((res)=>{
      this.status=res;
      this.statusTeam=res;
      //alert(JSON.stringify(res))
      if(!this.grpname.includes('HR')){
        this.statusTeam = this.statusTeam.filter((item: { KEY_ID: string; }) => item.KEY_ID !== '0');
        this.selectedStatusTeam=2;
      }
   });
   //Year
   this.apicall.listYear().subscribe((res) => {
    this.yeardata=res;      
  });
   //Employee drop down
   this.apicall.ResourceEmployeesComboData(-1,-1,this.empcode,0).subscribe((res)=>{
    this.empdata=res;
   })

   //this.fetchcomplaints();
  }
  ontabSelected(){
  if(this.selectedTab=='team'){
   this.viewflag=1;  
   this.year=new Date().getFullYear();  
    
   this.fetchcomplaintsTeam();
   this.currentDate=new Date();
   this.formattedDate = this.datePipe.transform(this.currentDate, 'yyyy-MM-dd');
   this.CloseReqForm.get('dateofclosure')?.setValue(this.formattedDate);
  }else{
    this.viewflag=0; 
    this.fetchcomplaints();
    this.apicall.ResourceEmployeesComboData(-1,-1,this.empcode,0).subscribe((res)=>{
      this.empdata=res;
     })  
  }
  }
  FetchAssignerComboData(empcode:any){
    this.apicall.ResourceEmployeesComboData(-1,-1,empcode,1).subscribe((res)=>{
      this.Assignerdata=res;
     })
  }
  fetchcomplaints(){
    this.viewflag=0;  
  this.apicall.FetchGrievance_RequestsList(this.empcode,this.selectedStatus,this.viewflag,this.year,this.grpname).subscribe((res)=>{
    this.tabledata=res;
    console.log(JSON.stringify(this.tabledata))
    const maxPageFiltered = Math.ceil(this.tabledata.length / this.itemsPerPage);  

      if (this.currentPagePersonal > maxPageFiltered) {
        this.currentPagePersonal = 1;     
      } 
  })
 }  
 fetchcomplaintsTeam(){
  this.viewflag=1;  
  this.apicall.FetchGrievance_RequestsList(this.empcode,this.selectedStatusTeam,this.viewflag,this.year,this.grpname).subscribe((res)=>{
    this.tabledataTeam=res;
    //alert(JSON.stringify(this.tabledataTeam))
    const maxPageFiltered = Math.ceil(this.tabledataTeam.length / this.itemsPerPage);  

      if (this.currentPage > maxPageFiltered) {
        this.currentPage = 1;     
      }  
  })
 }
 selectedItem(item:any){
  this.item=item;
  this.addressto=item.ADDRESS_TO;
  this.closureDate=item.CLOSURE_DATE;
  this.closureComment=item.CLOSURE_COMMENT;
  this.description=item.DESCRIPTION;
  this.assignerComment=item.ASSIGNER_COMMENT;
  this.assignedto=item.ASSIGNED_TO;
  this.closureby=item.CLOSURE_BY;
  this.FetchAssignerComboData(item.EMP_CODE);
 }
AddRequest(){
    if (this.AddReqForm.valid) { 
      const addresstoEmpCode = this.AddReqForm.value.addressto.map((employee: any) => employee.EMP_CODE);
     
      const data={
        empcode: this.empcode,
        addressto:addresstoEmpCode[0],
        description:this.AddReqForm.value.description            
    };
    console.log(JSON.stringify(data));
    this.apicall.Add_Grievance_Request(data).subscribe((res) => {
      //alert(JSON.stringify(res));   
      if (res.Errorid == 1) {
        (<HTMLInputElement>document.getElementById("openModalButton")).click();
          this.showModal = 1;
          this.success = "Request added successfully!";                
      } else{
        (<HTMLInputElement>document.getElementById("openModalButton")).click();
          this.showModal = 2;
          this.failed = "Failed!";
      } 
       this.fetchcomplaints();
       this.clearAddReqForm();       
  });
  }else{   
    this.markFormGroupTouched(this.AddReqForm);
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
clearAddReqForm(){
  this.AddReqForm.reset();
}
cancelRequets(item:any){

  this.apicall.CancelRequests(this.empcode,item.REQUEST_ID,'V').subscribe((res)=>{
    if (res.Errorid == 1) {
      (<HTMLInputElement>document.getElementById("openModalButton")).click();
        this.showModal = 1;
        this.success = "Request cancelled!";                
    } else{
      (<HTMLInputElement>document.getElementById("openModalButton")).click();
        this.showModal = 2;
        this.failed = "Failed!";
    } 
     this.fetchcomplaints();
  })
}
AssignReq(){
  if (this.AssignReqForm.valid) { 
    const assigntoEmpCode = this.AssignReqForm.value.assignto.map((employee: any) => employee.EMP_CODE);
   
    const data={
      empcode: this.item.EMP_CODE,
      closuredate:"",
      assignto:assigntoEmpCode[0],
      comment:this.AssignReqForm.value.comment,
      reqid:this.item.REQUEST_ID,
      updatedby:this.empcode,
      actionflag:2
  };
  console.log(JSON.stringify(data));
  this.apicall.Grievance_Review(data).subscribe((res) => {
    //alert(JSON.stringify(res));   
    if (res.Errorid == 1) {
      (<HTMLInputElement>document.getElementById("openModalButton")).click();
        this.showModal = 1;
        this.success = "Request assigned successfully!";                
    } else{
      (<HTMLInputElement>document.getElementById("openModalButton")).click();
        this.showModal = 2;
        this.failed = "Failed!";
    } 
     this.fetchcomplaintsTeam();
     this.clearAssignReqForm();       
});
}else{   
  this.markFormGroupTouched(this.AssignReqForm);
}
}
clearAssignReqForm(){
  this.AssignReqForm.reset();
}
CloseReq(){
  if (this.CloseReqForm.valid) {   
   
    const data={
      empcode: this.item.EMP_CODE,
      closuredate:this.CloseReqForm.value.dateofclosure,
      assignto:"",
      comment:this.CloseReqForm.value.comment,
      reqid:this.item.REQUEST_ID,
      updatedby:this.empcode,
      actionflag:1
  };
  console.log(JSON.stringify(data));
  this.apicall.Grievance_Review(data).subscribe((res) => {
    //alert(JSON.stringify(res));   
    if (res.Errorid == 1) {
      (<HTMLInputElement>document.getElementById("openModalButton")).click();
        this.showModal = 1;
        this.success = "Request closed!";                
    } else{
      (<HTMLInputElement>document.getElementById("openModalButton")).click();
        this.showModal = 2;
        this.failed = "Failed!";
    } 
     this.fetchcomplaintsTeam();
     this.clearAssignReqForm();       
});
}else{   
  this.markFormGroupTouched(this.CloseReqForm);
}
}
clearCloseReqForm(){
  this.CloseReqForm.reset();
  this.CloseReqForm.get('dateofclosure')?.setValue(this.formattedDate);
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

//Function to Calculate the total number of search results
get totalSearchResults(): number {
const totalResults = this.tabledataTeam.filter((employee: any) => {
  return Object.values(employee).some((value: any) =>
    typeof value === 'string' && value.toLowerCase().startsWith(this.searchInputTeam.toLowerCase())
  );
}).length;

const maxPageFiltered = Math.ceil(totalResults / this.itemsPerPage);  

if (this.currentPage > maxPageFiltered) {
  this.currentPage = 1; 
}

return totalResults;
}

//Function to change the current page
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

const filteredData = this.tabledataTeam.filter((employee: any) =>
  Object.values(employee).some((value: any) =>
    typeof value === 'string' &&
    value.toLowerCase().startsWith(this.searchInputTeam.toLowerCase())
  )
);

const start = (this.currentPage - 1) * this.itemsPerPage + 1;
return Math.min(start, filteredData.length);
}


getEntriesEnd(): number {  
const filteredData = this.tabledataTeam.filter((employee: any) =>
  Object.values(employee).some((value: any) =>
    typeof value === 'string' &&
    value.toLowerCase().startsWith(this.searchInputTeam.toLowerCase())
  )
);
const end = this.currentPage * this.itemsPerPage;
return Math.min(end, filteredData.length);
}
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
  this.failed='Invalid page number!'; 
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
const totalResults = this.tabledata.filter((employee: any) => {
return Object.values(employee).some((value: any) =>
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
if (this.currentPagePersonal === 1) {
return 1;
}

const filteredData = this.tabledata.filter((employee: any) =>
Object.values(employee).some((value: any) =>
  typeof value === 'string' &&
  value.toLowerCase().startsWith(this.searchInput.toLowerCase())
)
);

const start = (this.currentPagePersonal - 1) * this.itemsPerPage + 1;
return Math.min(start, filteredData.length);
}


getEntriesEndPersonal(): number {  
const filteredData = this.tabledata.filter((employee: any) =>
Object.values(employee).some((value: any) =>
  typeof value === 'string' &&
  value.toLowerCase().startsWith(this.searchInput.toLowerCase())
)
);
const end = this.currentPagePersonal * this.itemsPerPage;
return Math.min(end, filteredData.length);
}

}
