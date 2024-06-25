import { Component, OnInit } from '@angular/core';
import { ApiCallService } from 'src/app/api-call.service';
import { LoginService } from 'src/app/login.service';
import { FormControl } from '@angular/forms';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-viewattendancedata',
  templateUrl: './attendancedata.component.html',
  styleUrls: ['./attendancedata.component.scss']
})
export class AttendancedataComponent implements OnInit {
  userSession:any = this.session.getUserSession();
  empcode: any=this.userSession.empcode;
  level: any=this.userSession.level;
  authorityflg:any =this.userSession.authorityflg;
  grpname:any=this.userSession.grpname; 

  fromDateControl = new FormControl();
  toDateControl = new FormControl();
  fromdate = this.fromDateControl.value;
  todate = this.toDateControl.value;

  user:any;
  id!: number;
  companydata: any;
  deptdata: any;
  selectedCompanyid: any=-1;
  selectedDept: any = -1;
  empdata: any;
  selectedCompany: any = -1;
  selectedEmp: any =-1;
  AttendanceData: any;
  AttendanceDataPersonal: any;
  totalreq: any;
  totalPages!: number[];
  statusdata: any;
  selectedStatus: any=-1;
  fromtodates: any;
  date: any;
  comp_typeid:any=12;
  status_typeid:any=28;
 
  currentPagePersonal=1;
  totalreqPersonal: any;
  totalPagesPersonal!: number[];
  isEditing: boolean = false;
  showModal = 0; 
  indate: any;
  intime: any;
  outtime: any;
  emp_code: any;
  newintime: any;
  newouttime: any;
  in_date: any;
  searchInput: string = '';
  dept_typeid: any = 1;
  valid!: number;
  message!: string;
  message1!: string;
  message2!: string;
  success!: string;  
  Failed!: string;
  pfromdate: any;
  ptodate: any;
  workinghours: any;
  new_intime: any;
  new_outtime: any;
  workingHours: any;
  timeselected: any=0;
  level_id: any;
  itemsPerPage=10;
  currentPage=1;
  desiredPage: any; 
  desiredPagePersonal: any;
  itemtoedit: any;
  editedIntime: any;
  editedOuttime: any;
  editedIndate: any;
  editedOutdate: any;
    listshift: any;
  selectedShift: any=-1;
  

  constructor(private apicall:ApiCallService,private session:LoginService,private datepipe:DatePipe) { }

  ngOnInit(): void {

   // alert(this.grpname)

    if(this.grpname.includes('HR')||this.grpname.includes('LM'))
{
  this.user = 'team'
}

    else{
      //alert('fd')
      this.user = 'personal'
      this.FetchAttendanceDataPersonal();
    }

    //company combo box
    this.apicall.FetchCompanyList(this.empcode).subscribe((res)=>{
      this.companydata=res;
    });
    //Department combo box
    this.apicall.FetchDepartmentList(this.dept_typeid,this.empcode).subscribe(res =>{
      this.deptdata=res;     
    }); 
    //Employee combo box
    if(this.grpname.includes('LM'))
    {
      this.apicall.listEmployeemGR(this.empcode).subscribe((res) => {
        this.empdata=res;    
      });
    }
    if(this.grpname.includes('HR')){
      this.apicall.FetchEmployeeList(this.selectedDept,this.selectedCompanyid,this.empcode).subscribe(res =>{
        this.empdata=res;    
      });
    }
   
    //Status combo box
    this.apicall.listStatus(this.status_typeid).subscribe((res) => {
      this.statusdata=res;     
    });
    //Dates 
    this.apicall.listFromToDates().subscribe((res) => {
      this.date=res[0]; 
      // this.fromdate=this.datepipe.transform(this.date.FROM_DATE, "yyyy-MM-dd");
        //alert(JSON.stringify(this.fromdate))
      // this.todate=this.datepipe.transform(this.date.TO_DATE, "yyyy-MM-dd");
      this.pfromdate=this.datepipe.transform(this.date.FROM_DATE, "yyyy-MM-dd");
        //alert(JSON.stringify(this.fromdate))
      this.ptodate=this.datepipe.transform(this.date.TO_DATE, "yyyy-MM-dd");
      // this.FetchAttendanceData();
      this.FetchAttendanceDataPersonal();
    });
    this.currentPage = 1; 
    this.currentPagePersonal =1;     
       
  }
  teamselection(user:string){    
    this.user = user;  
    if (this.user == 'personal') {
       
      this.FetchAttendanceDataPersonal();
    } else {
      this.user = 'team'
      this.level = this.userSession.level;
      this.FetchAttendanceData();
    }   
     
   }
  
   onCompanySelected(selectedCompanyid: any) { 
    this.selectedCompanyid=selectedCompanyid;     
    this.apicall.FetchDepartmentList(selectedCompanyid,this.empcode).subscribe(res =>{
      this.deptdata=res; 
       
    }); 
    this.filter();
    this.apicall.FetchEmployeeList(this.selectedDept,this.selectedCompanyid,this.empcode).subscribe(res =>{
      this.empdata=res;    
    });
       
   }
   onDeptSelected(selectedDept:any){ 
    this.selectedDept = selectedDept; 
    this.apicall.FetchEmployeeList(selectedDept,this.selectedCompanyid,this.empcode).subscribe(res =>{
      this.empdata=res;  
      this.onEmpSelected(this.selectedEmp);     
      });
      this.filter(); 
       
   }
   onEmpSelected(selectedEmp:any){
    this.selectedEmp = selectedEmp;  
    this.filter();   
   }
   onStatSelected(value:any){
    this.selectedStatus=value;  
    this.filter();   
   }
  
   onStatSelectedEmp(value:any){
    this.selectedStatus=value;  
    this.filterPersonal(); 
   }
   FetchAttendanceData() { 
      this.apicall.FetchAttendanceData(this.grpname, this.empcode,this.fromdate,this.todate,1).subscribe((res) => {
      this.AttendanceData = res; 
      
      });   

  }
FetchAttendanceDataPersonal() { 
    this.level_id=0;
   // this.grpname='';
   // alert('lll')
    this.apicall.FetchAttendanceData(this.grpname, this.empcode,this.pfromdate,this.ptodate,2).subscribe((res) => {
      this.AttendanceDataPersonal = res; 
     
    });
}
filter(){
  if( this.fromdate > this.todate){
    (<HTMLInputElement>document.getElementById("openModalButton")).click();
    this.showModal = 2;
    this.Failed = "Please Correct the Dates";
  }else{
    const data={
      company:this.selectedCompanyid,
      department:this.selectedDept,
      emp_code:this.selectedEmp,
      fromdate:this.fromdate,
      todate:this.todate,
      status: this.selectedStatus,
      user:this.empcode,
      grpname:this.grpname
    }   
    //alert(JSON.stringify(data))
    this.apicall.FetchAttendanceData_filter(data).subscribe((res) => {
      this.AttendanceData=res;
      console.log(JSON.stringify(this.AttendanceData)) 
      const maxPageFiltered = Math.ceil(this.AttendanceData.length / this.itemsPerPage);  

      if (this.currentPage > maxPageFiltered) {
        this.currentPage = 1;     
      }   
      }); 
  }
 }
 filterPersonal(){
  if( this.pfromdate > this.ptodate){
    (<HTMLInputElement>document.getElementById("openModalButton")).click();
    this.showModal = 2;
    this.Failed = "Please Correct the Dates";
  }else{
    const data={    
      emp_code:this.empcode,
      fromdate:this.pfromdate,
      todate:this.ptodate,
      status: this.selectedStatus
    }  
    //alert(JSON.stringify(data))
    this.apicall.FetchAttendanceData_filterPersonal(data).subscribe((res) => {
      this.AttendanceDataPersonal=res;
      console.log(JSON.stringify(this.AttendanceDataPersonal)) 
      const maxPageFiltered = Math.ceil(this.AttendanceDataPersonal.length / this.itemsPerPage);  

      if (this.currentPagePersonal > maxPageFiltered) {
        this.currentPagePersonal = 1;     
      }   
      }); 
  }
 }
 selecteditem(item:any){
  //shift combo box
  this.apicall.listshift().subscribe((res)=>{
   this.listshift=res;
 })
 this.itemtoedit=item;
 this.editedIndate=this.datepipe.transform(item.IN_DATE, 'dd-MM-yyyy'); 
 this.editedOutdate=this.datepipe.transform(item.OUT_DATE, 'dd-MM-yyyy');
 this.editedIntime = this.convertToHHMM(item.INTIME);
 this.editedOuttime = this.convertToHHMM(item.OUTTIME);
}
convertToHHMM(time: string): string {
 if (time) {
   const [hours, minutes] = time.split(':');
   return `${hours}:${minutes}`;
 }
 return '';
}
onShiftSelected(){  
 this.apicall.GetShiftdate(this.itemtoedit.IN_DATE,this.selectedShift).subscribe((res)=>{
   this.todate=res[0].TO_DATE;
   // alert(this.todate)
   this.editedOutdate=this.datepipe.transform(this.todate, 'dd-MM-yyyy');
   
 })

}

saveChanges(): void {   
  if(this.selectedShift==-1||!this.editedIntime||!this.editedOuttime){
    (<HTMLInputElement>document.getElementById("openModalButton")).click();
    this.showModal = 2;
    this.Failed="Please fill in all fields!";  
  }else{
   const updateData={
     empcode:this.itemtoedit.EMP_CODE,
     shift:this.selectedShift,
     indate:this.itemtoedit.IN_DATE,
     outdate:this.todate,
     old_intime:this.itemtoedit.INTIME,
     old_outtime:this.itemtoedit.OUTTIME,
     new_intime:this.editedIntime,
     new_outtime:this.editedOuttime,
     enterby:this.empcode     
   };
   console.log(JSON.stringify(updateData));
   this.apicall.EditAttendancebyHR(updateData).subscribe(res => {
     //alert(JSON.stringify(res)); 
     if(res.Errorid==1){
      (<HTMLInputElement>document.getElementById("openModalButton")).click();
      this.showModal = 1; 
      this.success='Changes saved Successfully!'; 
      this.timeselected=0;    
    }else if(res.Errorid==-1){
      (<HTMLInputElement>document.getElementById("openModalButton")).click();
      this.showModal = 2; 
      this.Failed=res.Errormsg;  
    }
    else{
      (<HTMLInputElement>document.getElementById("openModalButton")).click();
      this.showModal = 2; 
      this.Failed='Failed!';      
    }
   //this.FetchAttendanceData();
    this.filter();
    this.clearEdit();
   }); 
 
  }
 }
 clearEdit(){
  this.selectedShift=-1;
  this.editedIntime=null;
  this.editedOuttime=null;
}
 
 get pagedAttendanceData() {
  if (!this.AttendanceData) {
    return [];  
  }

  const pageSize = 10;
  const startIndex = (this.currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  
  return this.AttendanceData.slice(startIndex, endIndex);
}
get pagedAttendanceDataEmp() {
  const pageSize = 10;
  const startIndex = (this.currentPagePersonal - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  return this.AttendanceDataPersonal.slice(startIndex, endIndex);
}
previousPage() {
  if (this.currentPage > 1) {
    this.currentPage--;
  }
}
previousPagePersonal() {
  if (this.currentPagePersonal > 1) {
    this.currentPagePersonal--;
  }
}
nextPage() {
  const totalPages = Math.ceil(this.AttendanceData.length / 10);
  if (this.currentPage < totalPages) {
    this.currentPage++;
  }
}
nextPagePersonal() {
  const totalPagesPersonal = Math.ceil(this.AttendanceDataPersonal.length / 10);
  if (this.currentPagePersonal < totalPagesPersonal) {
    this.currentPagePersonal++;
  }
}  


  // Helper function to pad single-digit numbers with leading zero
  private pad(num: number): string {
    return num < 10 ? `0${num}` : `${num}`;
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
      this.Failed='Invalid page number!'; 
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
  const totalResults = this.AttendanceData.filter((employee: any) => {
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
  
  const filteredData = this.AttendanceData.filter((employee: any) =>
    Object.values(employee).some((value: any) =>
      typeof value === 'string' &&
      value.toLowerCase().startsWith(this.searchInput.toLowerCase())
    )
  );

  const start = (this.currentPage - 1) * this.itemsPerPage + 1;
  return Math.min(start, filteredData.length);
}


getEntriesEnd(): number {  
  const filteredData = this.AttendanceData.filter((employee: any) =>
    Object.values(employee).some((value: any) =>
      typeof value === 'string' &&
      value.toLowerCase().startsWith(this.searchInput.toLowerCase())
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
const totalResults = this.AttendanceDataPersonal.filter((policy: any) => {
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

const filteredData = this.AttendanceDataPersonal.filter((policy: any) =>
  Object.values(policy).some((value: any) =>
    typeof value === 'string' &&
    value.toLowerCase().startsWith(this.searchInput.toLowerCase())
  )
);

const start = (this.currentPagePersonal - 1) * this.itemsPerPage + 1;
return Math.min(start, filteredData.length);
}


getEntriesEndPersonal(): number {  
const filteredData = this.AttendanceDataPersonal.filter((policy: any) =>
  Object.values(policy).some((value: any) =>
    typeof value === 'string' &&
    value.toLowerCase().startsWith(this.searchInput.toLowerCase())
  )
);
const end = this.currentPagePersonal * this.itemsPerPage;
return Math.min(end, filteredData.length);
}


}



