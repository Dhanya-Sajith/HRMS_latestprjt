import { Component, OnInit} from '@angular/core';
import { ApiCallService } from 'src/app/api-call.service';
import { LoginService } from 'src/app/login.service';
import { FormGroup, FormBuilder, FormControl, FormArray,Validators } from '@angular/forms';
import { DatePipe, JsonPipe } from '@angular/common';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  
  selector: 'app-overtime',
  templateUrl: './overtime.component.html',
  styleUrls: ['./overtime.component.scss'],
 
  
})
export class OvertimeComponent implements OnInit {  
  
  userSession:any = this.session.getUserSession();
  empcode: any=this.userSession.empcode;
  level:any =this.userSession.level;
  authorityflg:any =this.userSession.authorityflg;
  otaccess:any = this.userSession.otaccess;
  reasonControl = new FormControl();

  user:any;
  id: any;
  companydata: any;
  selectedCompany: any = -1;
  deptdata: any;
  empdata: any;
  selectedCompanyid: any = -1;
  selectedDept: any = -1;
  statusdata: any;
  typeid!: number;  
  loginDate: any;
  indate: any;
  selectedlogindate!: string;
  loginTime: any;  
  OTRequests: any;
  NewloginDate: any;
  OTres: any;
  Approveres: any;
  rejectres: any;
  selectedRequestID: any;
  level1: any;
  selectedEmp: any = -1;
  selectedStatus: any = -1;
  filterres: any;
  OTRequestsEmp: any;
  cancelres: any;
  showModal = 0;  
 
  otreqs: any;
  fromtodates: any;
  NewfromDate!: string | null;
  fromdate: any;
  todate: any;
  date: any;
  fromDate: any;
  toDate: any;

  
  weekdays: any;
  daylength: any;
  startDay: any;
  endDay: any;
  week:any;
  OTWeekly: any;
  year: any;
  othours:any;
  OTdata: any;
  newothrs: any;
  failed: any;
  ottotal: any = "00:00";
  success: any;
  fromdt: any;
  todt: any;
  pfromdate: any;
  ptodate: any;
  reqID: any;
  approvelist: any;
  newdate = new Date();
  firstDay1 = new Date(this.newdate.getFullYear(), this.newdate.getMonth(), 1);
  lastDay1 = new Date(this.newdate.getFullYear(), this.newdate.getMonth() + 1, 0);

  firstDay=this.datepipe.transform(this.firstDay1,"yyyy-MM-dd");
  lastDay=this.datepipe.transform(this.lastDay1,"yyyy-MM-dd");
  otdetaillists: any;
  otcount: any;
  itemsPerPage=10;
  currentPage=1;
  desiredPage: any; 
  desiredPagePersonal: any;
  currentPagePersonal=1;
  searchInput: any='';

  constructor(private apicall:ApiCallService,private session:LoginService,private datepipe:DatePipe,private fb:FormBuilder,private router:Router,private route: ActivatedRoute,private cdr: ChangeDetectorRef) {}

  ngOnInit(): void { 

    this.route.queryParams
    .subscribe(params => {
      this.user = params['user']; 
    }
  );

  this.listFromToDates();

  if(this.otaccess != 1 && this.user == undefined)
  {
    this.user = 'team';
  }
  else
   if( this.otaccess == 1 && this.authorityflg == 0 || this.user == 'personal' || this.user == undefined){
    this.user = 'personal';
    this.FetchOTReqPersonal()
  }else{
    this.user = 'team';
  }
  
  this.GetCompanyData(); 
  this.apicall.FetchDepartmentList(-1,this.empcode).subscribe(res =>{
    this.deptdata=res;     
  });
  this.apicall.FetchEmployeeList(-1,-1,this.empcode).subscribe(res =>{
    this.empdata=res;    
  });

  this.currentPage = 1; 
  this.currentPagePersonal =1;  
  this.listFromToDates();
  this.fetchStatus();

  this.week=this.datepipe.transform(new Date(), 'w');
  this.year=this.datepipe.transform(new Date(), 'Y');
  this.weekdays = this.getDateOfWeek(this.week, this.year);
  this.fetchotweeklylist();
  } 
 
  GetCompanyData(){ 
    this.id=12;
    this.apicall.FetchCompanyList(this.empcode).subscribe((res)=>{
      this.companydata=res;        
    });
  }

  teamselection(user:string){ 
    this.user = user;
    if (this.user === 'personal') {
      this.FetchOTReqPersonal()
    } else {
      this.FetchOTReq();
    }    
   }

   onCompanySelected(selectedCompanyid: any) { 
    this.selectedCompanyid=selectedCompanyid;    
    this.apicall.FetchDepartmentList(selectedCompanyid,this.empcode).subscribe(res =>{
      this.deptdata=res;     
    }); 
    this.filter(); 
    // this.onEmpSelected(-1);
    // this.onStatSelected(1);
   }

  onDeptSelected(selectedDept:string){ 
    this.selectedDept = selectedDept; 
    this.apicall.FetchEmployeeList(selectedDept,this.selectedCompanyid,this.empcode).subscribe(res =>{
      this.empdata=res;    
      });
    this.filter();
    // this.onEmpSelected(-1);
    // this.onStatSelected(1);
  }

  fetchStatus(){
    this.typeid =26;
    this.apicall.StatusComboData(this.typeid).subscribe((res) => {
      this.statusdata=res;     
    });    
  }

  onEmpSelected(selectedEmp:any){
    this.selectedEmp = selectedEmp;  
    this.filter();
  }

  onStatSelected(value:any){
    this.selectedStatus=value;  
    this.filter();
  }

  onStatSelectedPersonal(value:any){
    this.selectedStatus=value;  
    this.FetchOTReq_FilterPersonal();
  }
  
  FetchOTReq() {  
    this.apicall.FetchOTRequest(this.empcode,-1,'1',this.fromdate,this.todate).subscribe((res) => {
      this.OTRequests = res;     
    });
  }

  FetchOTReqPersonal() {  
      this.apicall.FetchOTRequest(this.empcode,0,'0',this.firstDay,this.lastDay).subscribe((res) => {
      this.OTRequestsEmp = res;  
    });
  }

  FetchOTReq_FilterPersonal(){
    this.apicall.FetchOTRequest(this.empcode,this.selectedStatus,'0',this.pfromdate,this.ptodate).subscribe((res) => {
      this.OTRequestsEmp=res;   
      const maxPageFiltered = Math.ceil(this.OTRequestsEmp.length / this.itemsPerPage);  

      if (this.currentPagePersonal > maxPageFiltered) {
        this.currentPagePersonal = 1;     
      }   
      }); 
      
  
  }

 filter(){
    const data={
      company: this.selectedCompanyid,
      department:this.selectedDept,
      emp_code:this.selectedEmp,
      status:this.selectedStatus,
      fromdate:this.fromdate,
      todate:this.todate,
      authority:this.empcode
    }  
    // alert(JSON.stringify(data))
     this.apicall.FetchOTReq_Filter(data).subscribe((res) => {
      this.OTRequests=res;   
      const maxPageFiltered = Math.ceil(this.OTRequests.length / this.itemsPerPage);  

      if (this.currentPage > maxPageFiltered) {
        this.currentPage = 1;     
      }   
      }); 
      
   
   }

 

  OTreqId(selectreqID:any){
    this.selectedRequestID = selectreqID
  }

  cancelOtReq(reqid:any){
  const req_category='O';
  this.apicall.CancelRequests(this.empcode,reqid,req_category).subscribe(res=>{
    if(res.Errorid=='1')
    {
      this.showModal = 1;
      this.success = "Overtime Request cancelled";
    }
    else
    {
      this.showModal = 2;
      this.failed = "Cancel request failed";
    }
    this.FetchOTReqPersonal();
  })
  }

 approve(reqid:any,emp_code:any){ 
  const approvedata={
    req_id:reqid,
    empcode:emp_code,
    verified_by:this.empcode,
    verified_remarks:'NULL',      
    mflag: 1

  }
  // alert(JSON.stringify(approvedata))
    this.apicall.ApproveOrReject_EmpOTReq(approvedata).subscribe((res) => {      
      if(res.Errorid==1){
        this.showModal = 1;     
       
      }
      else{
        this.showModal = 2;        
      }     
      this.filter();  
  });
 }


setSelectedRequestID(requestID: any,emp_code:any) {
    this.selectedRequestID = requestID;
    this.selectedEmp = emp_code;
}

reject(reqid:any,reason:string){  
  const rejectdata={
    req_id:reqid,
    empcode:this.selectedEmp,
    verified_by:this.empcode,
    verified_remarks:reason,      
    mflag: 0
  }
  this.apicall.ApproveOrReject_EmpOTReq(rejectdata).subscribe((res) => {
    if(res.Errorid==1){
      this.showModal = 1;      
    }
    else{
      this.showModal = 2;      
    }
    this.filter();  
    this.reasonControl.setValue('');
  });
 }

 clearReject(){
  this.reasonControl.setValue('');
}

 listFromToDates(){
  this.apicall.listFromToDates().subscribe((res) => {
    this.date=res[0];   
    this.fromdate=this.datepipe.transform(this.date.FROM_DATE, "yyyy-MM-dd");
    this.todate=this.datepipe.transform(this.date.TO_DATE, "yyyy-MM-dd");
    this.pfromdate=this.datepipe.transform(this.date.FROM_DATE, "yyyy-MM-dd");
    this.ptodate=this.datepipe.transform(this.date.TO_DATE, "yyyy-MM-dd");
    this.FetchOTReq();
  });
  }
  
  // Anisha

  listweekdays(){
    const weekvalue= (<HTMLInputElement>document.getElementById("week")).value;
    const year = weekvalue.split('-')[0];
    const week = weekvalue.split('-W')[1];
    this.weekdays = this.getDateOfWeek(week, year);
    this.daylength = this.weekdays.length;
    this.fetchotweeklylist();
  }

  getDateOfWeek(w:any, y:any) {
    let day = (2 + (w - 1) * 7); // 1st of January + 7 days for each week
    let dayOffset = new Date(y, 0, 1).getDay(); // we need to know at what day of the week the year start
    let days = [];
    const startDays = 2 + (w - 1) * 7 - (new Date(y,0,1)).getDay();
    this.startDay = new Date(y, 0, startDays);
    const endDays = 8 + (w - 1) * 7 - (new Date(y,0,1)).getDay();
    this.endDay = new Date(y, 0, endDays);
    for (let i = 0; i < 7; i++) // do this 7 times, once for every day
      days.push(new Date(y, 0, day - dayOffset + i)); // add a new Date object to the array with an offset of i days relative to the first day of the week
      return days;
  }

  fetchotweeklylist(){
    
    this.fromdt=this.datepipe.transform(this.startDay, 'yyyy-MM-dd');
    this.todt=this.datepipe.transform(this.endDay, 'yyyy-MM-dd');
    this.apicall.OTRequestCount(this.fromdt,this.todt,this.empcode).subscribe((res) => {
      this.otcount = res; 
    });
    // alert(this.otcount[0].Errorid)
    // if(this.otcount[0].Errorid > 0){
    //   alert('Overtime already added for this week')   
    // }else{
      this.apicall.FetchOTweekly(this.empcode, this.fromdt,this.todt).subscribe((res) => {
        this.OTWeekly = res; 
      });
    // }
    // this.otcount = '';
  }

  // calculateOT(dtldata:any,rowno:any){  
  // this.OTdata = dtldata;
  // this.othours=this.OTdata.OTHOURS;
  // this.newothrs=this.OTdata.newothrs;
  //   if(this.newothrs != "00:00"){
  //     if(this.newothrs > this.othours){
  //       alert("Please select correct overtime hours");
  //       this.OTdata.newothrs = null;
  //       this.cdr.detectChanges();
  //       this.newothrs = null;
  //       dtldata.newothrs = null;
  //       (<HTMLInputElement>document.getElementById("newothrs"+rowno)).value = "";
  //     }else{
  //         const OTData: any[] = [];
  //         this.OTWeekly.forEach((data:any) => { 
  //         if(data.newothrs !== undefined){
  //           const Otdetails = data.newothrs           
  //           OTData.push(Otdetails);
  //         }
  //     });

  //     let mins = OTData.reduce((acc, time) => {
  //       let [h, m] = time.split(':');
  //       acc += h*60 + m*1;
  //       return acc;
  //     }, 0);
  //     this.ottotal = (mins/60|0) + ':' + ('0'+(mins%60)).slice(-2);
  //     }
  //   }else{
  //     alert("Please select the overtime hours");
  //   }
  // }

  calculateOT(dtldata: any, rowno: any) {
    this.OTdata = dtldata;
    this.othours = this.OTdata.OTHOURS;
    this.newothrs = this.OTdata.newothrs;
  
    if (this.newothrs != null) {
      if (this.newothrs > this.othours) {
        alert("Please select correct overtime hours");
        this.OTdata.newothrs = null;
        this.newothrs = null;
        var timepickerInput = (<HTMLInputElement>document.getElementById("newothrs" + rowno))?.querySelector("input");
        if (timepickerInput) {
          timepickerInput.value = "";
        }
        this.OTTotal(); // Recalculate total overtime
      } else {
        this.OTTotal(); // Recalculate total overtime
      }
    } else {
      alert("Please select the overtime hours2");
    }
  }
  
  OTTotal() {
    const OTData: any[] = [];
    this.OTWeekly.forEach((data: any) => {
      if (data.newothrs !== undefined && data.newothrs != null) {
        const [hours, minutes] = data.newothrs.split(":").map(Number);
        const totalMinutes = hours * 60 + minutes;
        OTData.push(totalMinutes);
      }
    });
    const totalMinutes = OTData.reduce((acc, curr) => acc + curr, 0);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    this.ottotal = hours + ":" + (minutes < 10 ? "0" + minutes : minutes);
  }

OTRequestSave(){
  const weekvalue= (<HTMLInputElement>document.getElementById("week")).value;
  if(weekvalue == ''){
    this.showModal = 2; 
    this.failed='Please, Select the days.'; 
  }else{ 
    const OTHoursData: any[] = [];
    this.OTWeekly.forEach((data:any) => { 
        if(data.newothrs !== undefined){
          const Otdetails = data.newothrs           
          OTHoursData.push(Otdetails);
        }
    });
    
    if(OTHoursData.length == 0 || this.ottotal == "00:00"){
      this.showModal = 2; 
      this.failed='Please, add overtime hours.'; 
    }else{
      interface OTdetaildata {
        INDATE: string;
        INTIME: string;
        OUTTIME: string;
        newothrs: string;
      }
      
      const OTData: any[] = [];
      const datalength = this.OTWeekly.length;
      this.OTWeekly.forEach((data:OTdetaildata) => { 
      
            const Otdetails = {
              OTDATE: this.datepipe.transform(data.INDATE, "yyyy-MM-dd") ,
              INTIME: data.INTIME,
              OUTTIME: data.OUTTIME,
              OTHOURS: data.newothrs,           
            };
      
            OTData.push(Otdetails);
      });
    
      
      const requestData = {
        EMPCODE: this.empcode,
        STARTDATE: this.fromdt,
        ENDDATE: this.todt,
        TOTALHOURS: this.ottotal,
        OTDETAILS: OTData
      };
        this.apicall.SaveOTRequest(requestData).subscribe((res) => {
        if(res.Errorid==1){
                this.showModal = 1;
                this.success='Overtime Request Saved Succesfully!';  
                this.FetchOTReqPersonal();
                this.clear();
              }
              else if(res.Errorid==2){
                  this.showModal = 2; 
                  this.failed='Overtime already added for this week';     
              }
              else if(res.Errorid==3){
                this.showModal = 2; 
                this.failed='Cannot apply for overtime before last payroll processed date..!';     
              }else{
                  this.showModal = 2; 
                  this.failed='Failed!';   
              }  
             
      });
    }
  
  }
}

  // Status Approve List
  Approvelist(requestID: any){
    this.reqID = requestID
    this.apicall.StatusApproveList(2,this.reqID,'O').subscribe(res=>{
      this.approvelist = res;
    })
  }

  clear()
  { 
    for(let i=1;i<=7;i++){
      (<HTMLInputElement>document.getElementById("newothrs"+i)).value = "";
    } 
    this.ottotal = "00:00"; 
  }

  fillrequestdtl(reqid:any,fdate:any,tdate:any){
    const frdate =this.datepipe.transform(fdate, 'yyyy-MM-dd');
    const trdate=this.datepipe.transform(tdate, 'yyyy-MM-dd');
    this.apicall.EmpReq_OTDetails(reqid,frdate,trdate).subscribe(res=>{
      this.otdetaillists = res;
      //alert(JSON.stringify(this.otdetaillists))
    })
  }
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
  const totalResults = this.OTRequests.filter((employee: any) => {
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
  
  const filteredData = this.OTRequests.filter((employee: any) =>
    Object.values(employee).some((value: any) =>
      typeof value === 'string' &&
      value.toLowerCase().startsWith(this.searchInput.toLowerCase())
    )
  );

  const start = (this.currentPage - 1) * this.itemsPerPage + 1;
  return Math.min(start, filteredData.length);
}


getEntriesEnd(): number {  
  const filteredData = this.OTRequests.filter((employee: any) =>
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
const totalResults = this.OTRequestsEmp.filter((policy: any) => {
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

const filteredData = this.OTRequestsEmp.filter((policy: any) =>
  Object.values(policy).some((value: any) =>
    typeof value === 'string' &&
    value.toLowerCase().startsWith(this.searchInput.toLowerCase())
  )
);

const start = (this.currentPagePersonal - 1) * this.itemsPerPage + 1;
return Math.min(start, filteredData.length);
}


getEntriesEndPersonal(): number {  
const filteredData = this.OTRequestsEmp.filter((policy: any) =>
  Object.values(policy).some((value: any) =>
    typeof value === 'string' &&
    value.toLowerCase().startsWith(this.searchInput.toLowerCase())
  )
);
const end = this.currentPagePersonal * this.itemsPerPage;
return Math.min(end, filteredData.length);
}

}
