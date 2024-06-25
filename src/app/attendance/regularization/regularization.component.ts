import { Component, OnInit } from '@angular/core';
import { ApiCallService } from 'src/app/api-call.service';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/login.service';
import { FormGroup, FormControl, FormArray, FormBuilder, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import * as feather from 'feather-icons';
import { formatDate } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-regularization',
  templateUrl: './regularization.component.html',
  styleUrls: ['./regularization.component.scss'] 
})


export class RegularizationComponent implements OnInit  {
  user:any;
  requestForm: FormGroup;
  listCompany:any;
  listDepartment:any;
  listEmployee:any;
  listRegStatus:any;
  comtypeid=-1;
  deptypeid=-1;
  stattypeid=26;
  mflag=1;
  leveltypeid='L5';
  listReguRequest:any;
  listMisPunchedDate:any;
  LoginTime = new FormControl();
  LogoutTime = new FormControl();
  inTime = new FormControl();
  outTime = new FormControl();
  remarks = new FormControl();
  inDate = new FormControl();
  indate = new FormControl();
  outdate= new FormControl();
  LogdispInDate= new FormControl();
  RegloginTime: any;
  selectedlogindate:any;
  userSession:any = this.session.getUserSession();
  empcode: any=this.userSession.empcode;
  empid: any=this.userSession.id;
  level: any=this.userSession.level;
  authorityflg:any =this.userSession.authorityflg;
  listReguRequestEmp:any;
  contentDeleteId:any;
  Modal:any;
  request_Id:any;
  selectCompany:any=-1;
  comname = new FormControl();
  depname = new FormControl();
  empname = new FormControl();
  fillstatus = new FormControl();
  reqid:any;
  reject_reason:any;
  request_status:any;
  updated_by:any;
  comboVal:any;
  showModal = 0;
  totalreq: any;
  totalPages!: number[];
  
  totalreqPersonal: any;
  totalPagesPersonal!: number[];
  itemsPerPage=10;
  currentPage=1;
  desiredPage: any; 
  desiredPagePersonal: any; 

  
  success:any="";
  failed:any="";
  reasondisp=new FormControl();
  viewflag = 1;
  date = new Date();
  firstDay1 = new Date(this.date.getFullYear(), this.date.getMonth(), 1);
  lastDay1 = new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0);
  firstDay=this.datePipe.transform(this.firstDay1,"yyyy-MM-dd");
  lastDay=this.datePipe.transform(this.lastDay1,"yyyy-MM-dd");
  listdates:any;
  fmdt:any;
  todt:any;
  fromdate = new FormControl();
  todate = new FormControl();
  fromdates = new FormControl();
  todates = new FormControl();
  reqstatus=0;
  listmispunch_nonmarking:any;
  listmispunch:any;
  listnonmarking:any;
  searchInput: string = '';
  isFormValid:boolean=false;
  approvelist:any;
  reqID:any;
  currentPagePersonal=1;

  NewInTime = new FormControl();
  NewOuTTime= new FormControl();


  constructor(private fb: FormBuilder,private datePipe: DatePipe,private session:LoginService,private apicall:ApiCallService,private router:Router,private route: ActivatedRoute) {

    this.requestForm = this.fb.group({
      inTime: ['', Validators.required],
      outTime: ['', Validators.required],
      remarks: ['', Validators.required],
    });

  }

// department based company - team


  ListDepByComId()
  { 
    const company_code= (<HTMLInputElement>document.getElementById("comname")).value;
    this.apicall.FetchDepartmentList(company_code,this.empcode).subscribe(res =>{
    this.listDepartment=res;
    })
  }

// employee based company and department - team

  ListEmpByComIdandDep()
  {
    const comp= (<HTMLInputElement>document.getElementById("comname")).value;
    const dep= (<HTMLInputElement>document.getElementById("depname")).value;
    this.apicall.FetchEmployeeList(dep,comp,this.empcode).subscribe(res =>{
    this.listEmployee=res;
    })
  }


// first and last date of a loggined month  - both team and personal 

  ListtimesByLoginDate(selectedlogindate:string,empcode:string)
  {
      // alert(selectedlogindate);
      const NewloginDate=this.datePipe.transform(selectedlogindate,"yyyy-MM-dd");
      this.apicall.RegLoginTimeData(this.userSession.empcode,NewloginDate).subscribe((res) => {
      this.RegloginTime=res; 
      if (this.RegloginTime.length > 0) {
        const RegloginTimeData = this.RegloginTime[0]; 
        this.LoginTime.setValue(RegloginTimeData.INTIME);
        this.LogoutTime.setValue(RegloginTimeData.OUTTIME);
        this.indate.setValue(RegloginTimeData.INDATE);
        this.outdate.setValue(RegloginTimeData.OUTDATE);

      }
    });
  }

// add regularization request - personal


validateForm() {
  if (this.requestForm.valid){
  this.isFormValid = true;
  }
  else{
    this.markFormGroupTouched(this.requestForm);
  }
}


addReguRequest(emid:any)
{

  //alert(emid)

  if (this.requestForm.valid) {

  const NewinDate=this.datePipe.transform(this.indate.value,"yyyy-MM-dd");
  const NewoutDate=this.datePipe.transform(this.outdate.value,"yyyy-MM-dd");
  const inTimeControl = this.requestForm.get('inTime');      
  const outTimeControl = this.requestForm.get('outTime');
  const remarksControl = this.requestForm.get('remarks');

  const int= (<HTMLInputElement>document.getElementById("inTime")).value;
  const out= (<HTMLInputElement>document.getElementById("outTime")).value;

  // if(int>out && NewinDate==NewoutDate)
  // {
  //   this.showModal = 2;
  //   this.failed="Out time should be greater than in time!";       
  // } 
  // else{

if (inTimeControl && outTimeControl && remarksControl) { 
const reqdata = {
  empid:emid,
  empcode:this.empcode,
  inDate:NewinDate,
  outDate:NewoutDate,
  inTime: inTimeControl.value,
  outTime: outTimeControl.value,
  remarks: remarksControl.value,   
  
};

this.apicall.addregularizationReq(reqdata).subscribe(res=>{
//alert(JSON.stringify(res))

if(res.Errorid==1)
  {
    this.showModal = 1;
    this.success = "Regularization Requested Successfully";
    this.requestForm.reset();
    this.LoginTime.setValue('');
    this.LogoutTime.setValue('');
    this.fetchmispuncheddate();

  }else if(res.Errorid==-1){
      this.showModal = 2;
      this.failed=res.Errormsg;  
      this.requestForm.reset();
      this.LoginTime.setValue('');
      this.LogoutTime.setValue('');
      this.fetchmispuncheddate();
  }
  else
  {
    this.showModal = 2;
    this.failed = "Regularization Request Failed";
    this.requestForm.reset();
    this.LoginTime.setValue('');
    this.LogoutTime.setValue('');
    this.fetchmispuncheddate();
  }   
  
  
  this.displayempDet();
  this.misspunch_nonmarking_count();
  


})
}

//}

 
}
else {    
  this.markFormGroupTouched(this.requestForm);   
}

}

  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
    });
  }


 // reject request - team 

  rejectregreq(a:any,b:any,c:any,d:any,e:any,f:any,empcode:any,empid:any,updated_by:any)
  {
    
    //alert(b);

    this.reqid = a;
    this.inDate = b;
  //  const NewappInDate=this.datePipe.transform(b,"yyyy-MM-dd");
  //   const inDate = NewappInDate;

    // alert(this.inDate)

    this.inTime = c;
    this.outTime = d;
    this.remarks = e;
    this.request_status = f;
    this.empcode = empcode;
    this.empid = empid;
    this.updated_by = empid;

    const rejectData = {
      empid:this.empid,
      empcode:empcode,
      reqid :this.reqid,
      inDate :this.inDate,
      inTime :this.inTime,
      outTime :this.outTime,
      remarks:this.remarks,
      request_status:this.request_status,
      updated_by:this.empcode,
    };

  // alert(JSON.stringify(rejectData));

  }

  confirmRejectRq(empid:any,empcode:any,reqid:any,inDate:any,inTime:any,outTime:any,remarks:any,updated_by:any)
  {


    // alert(inTime);
    // alert(inDate);

    const rejectreason= (<HTMLInputElement>document.getElementById("rejreason")).value;

    const NewInDate=this.datePipe.transform(inDate,"dd-MM-yyyy");
   // const NewappInDate=this.datePipe.transform(inDate,"yyyy-MM-dd");

   // alert(NewInDate)

    //alert(NewInDate);

   // this.LogdispInDate.setValue(NewInDate);

    //alert(rejectreason);

    const rejectDatas = {
      empid:empcode,
      empcode:empcode,
      reqid :this.reqid,
      inDate:NewInDate,
      inTime :this.inTime,
      outTime :this.outTime,
      remarks:this.remarks,
      reject_reason:rejectreason,
      updated_by:this.userSession.empcode,
      mflag:1,

    };

   // alert(JSON.stringify(rejectDatas));
 
    this.apicall.RejectRequestapi(rejectDatas).subscribe(res=>{
    //alert(JSON.stringify(res));
    //this.listReguRequest=res;
    if(res.Errorid==1)
    {
      //alert("Deleted!");
      this.showModal = 1;
      this.success = "Rejected Successfully";
      //this.ngOnInit();
      this.fetchteamdata();
    }
    else
    {
      this.showModal = 2;
      this.failed = "Failed";
    }   

     }) 

  }


  //  diaplay full reason - both team and personal


  reasonview(REMARKS:any)
  {
    //alert(REMARKS);
    this.reasondisp.setValue(REMARKS);
  }


//  edit in time and out time  - team 


  editinTime(empid:any,request_Id:any,inDate:any,updated_by:any)
  {

    this.empid = empid;
    this.reqid = request_Id;
    this.inDate = inDate;
    this.updated_by = empid;

    const editData = {
      empid:empid,
      reqid :this.reqid,
      inDate :this.inDate,
      updated_by:this.empcode,
    };

    //alert(JSON.stringify(editData));

    const NewInDate=this.datePipe.transform(inDate,"dd-MM-yyyy");

    //alert(NewInDate);

    this.LogdispInDate.setValue(NewInDate);

    //this.LogdispInDate.setValue(NewInDate);


  }
  confirmeditinTime(empid:any,reqid:any,updated_by:any)
  {

    // const inTime= (<HTMLInputElement>document.getElementById("NewInTime")).value;
    // alert(inTime);
    // const outTime= (<HTMLInputElement>document.getElementById("NewOuTTime")).value;

    const inTime = this.NewInTime.value;
    const outTime = this.NewOuTTime.value;

    const inDate= (<HTMLInputElement>document.getElementById("LogdispInDate")).value;
    

    //alert(outTime);

    if(!inTime || !outTime)
    {   
      this.showModal = 1;
      this.success="Please select a time!";  
       
    }  
    else if(inTime === "00:00" || outTime==="00:00" )
      {
        this.showModal = 1;
        this.success="Please select a valid time!";     
      } 
      // else if(inTime>outTime)
      // {
      //   this.showModal = 1;
      //   this.success="Out time should be greater than in time!";       
      // } 
      else{

        const editDatas = {
          empid:empid,
          reqid :this.reqid,
          inTime :inTime,
          outTime :outTime,
          inDate :inDate,
          updated_by:this.empcode,
          mflag:3,
        };
    
       // alert(JSON.stringify(editDatas));
        this.apicall.ApproveRequestapi(editDatas).subscribe(res=>{
        //alert(JSON.stringify(res));
    
        if(res.Errorid==1)
        {
          //alert("Deleted!");
          this.showModal = 1;
          this.success = "Updated Successfully";
          //this.ngOnInit();
          this.fetchteamdata();
        }
        else
        {
          this.showModal = 2;
          this.failed = "Failed";
        }   
    
        }) 

      }

  }
  

// approve request - team


  approveregreq(empid:any,reqid:any,inDate:any,inTime:any,outTime:any,updated_by:any)
  {

    //alert(inDate);

    this.empid = empid;
    this.reqid = reqid;
    this.inDate = inDate;
    this.inTime = inTime;
    this.outTime = outTime;

    var arr = outTime.split("-");
    var intime = arr[0];
    var outtime = arr[1];
    //alert(intime);
    
    this.updated_by = empid;

    const NewappInDate=this.datePipe.transform(inDate,"yyyy-MM-dd");
 
    const approveDatas = {
      empid:empid,
      reqid :this.reqid,
      inDate :NewappInDate,
      inTime :intime,
      outTime :outtime,
      updated_by:this.empcode,
      mflag:2,

    };

    //alert(JSON.stringify(approveDatas));
    this.apicall.ApproveRequestapi(approveDatas).subscribe(res=>{
    //alert(JSON.stringify(res));

      if(res.Errorid==1)
      {
        //alert("Deleted!");
        this.showModal = 1;
        this.success = "Approved Successfully";
        //this.ngOnInit();
        this.fetchteamdata();
      }
      else
      {
        this.showModal = 2;
        this.failed = "Failed";
      }     
  
    }) 


  }



// filetring details - team 



  FetchRegReq_Filter()
  {
   // alert("sg");
   
    const comname= (<HTMLInputElement>document.getElementById("comname")).value;
    const depname= (<HTMLInputElement>document.getElementById("depname")).value;
    const empname= (<HTMLInputElement>document.getElementById("empname")).value;
    const fillstatus= (<HTMLInputElement>document.getElementById("fillstatus")).value;
    const fromdate= (<HTMLInputElement>document.getElementById("fromdate")).value;
    const todate= (<HTMLInputElement>document.getElementById("todate")).value;
    

    if( fromdate > todate){
      (<HTMLInputElement>document.getElementById("openModalButton")).click();
      this.showModal = 2;
      this.failed = "Please Correct the Dates";
    }else{

      const fillData = {
        company: comname,
        department: depname,
        emp_code: empname, 
        status: fillstatus, 
        fromdate: fromdate,
        todate:todate,
        authority:this.empcode
      };

      //alert(JSON.stringify(fillData));
      this.apicall.FetchRegReq_Filterapi(fillData).subscribe(res=>{
        //alert(JSON.stringify(res));
      this.listReguRequest=res;    
      const maxPageFiltered = Math.ceil(this.listReguRequest.length / this.itemsPerPage);  

      if (this.currentPage > maxPageFiltered) {
        this.currentPage = 1;     
      }   
      });   

      

    }
  }



// filtering - personal


  FetchRegReq_FilterPersonal()
  {
   
   
   this.viewflag=0;
  
    const fillsts= (<HTMLInputElement>document.getElementById("fillsts")).value;
    const fromdates= (<HTMLInputElement>document.getElementById("fromdates")).value;
    const todates= (<HTMLInputElement>document.getElementById("todates")).value;
   
    if( fromdates > todates){
      (<HTMLInputElement>document.getElementById("openModalButton")).click();
      this.showModal = 2;
      this.failed = "Please Correct the Dates";
    }else{
      this.apicall.listReguRequestemp(this.empcode,fillsts,this.viewflag,fromdates,todates).subscribe(res=>{
      
      this.listReguRequestEmp=res;
      const maxPageFiltered = Math.ceil(this.listReguRequestEmp.length / this.itemsPerPage);  

      if (this.currentPage > maxPageFiltered) {
        this.currentPage = 1;     
      }   
      });   


    }

  }


// display request details - personal   

  displayempDet() 
  {

    this.viewflag=0;

    this.apicall.listReguRequestemp(this.empcode,this.reqstatus,this.viewflag,this.firstDay,this.lastDay).subscribe((res)=>{
    //alert(JSON.stringify(res));
    this.listReguRequestEmp=res;
    //alert(this.leveltypeid);
    //alert(this.empcode);
    this.totalreqPersonal=this.listReguRequestEmp.length;  
    //alert(this.totalreqPersonal);
    const totalPagesPersonal = Math.ceil(this.totalreqPersonal / 10);
    //alert(totalPagesPersonal);
    this.totalPagesPersonal = Array(totalPagesPersonal).fill(0).map((_, index) => index + 1); 
    //alert(this.totalPagesPersonal);
    //console.log(JSON.stringify(this.OTRequests));
    })
  }


// cancel request - personal


  cancelRegReq(id:any,empcode:any)
  {
    
    //alert(id);
    //alert(empcode);

    this.request_Id = id;
    this.empcode = empcode;

  }

  confirmCancelRq(request_Id:any)
  {
    //alert(request_Id);
    //alert(empcode);
    const req_category='R';
    this.apicall.CancelRequests(this.empcode,this.request_Id,req_category).subscribe(res=>{
      //alert(JSON.stringify(res));
      if(res.Errorid==1)
      {
        //alert("Deleted!");
        this.showModal = 1;
        this.success = "Cancelled Successfully";
        this.displayempDet();
      }
      else
      {
        this.showModal = 2;
        this.failed = "Failed";
      }   


    }) 
  
  }



 
  ngOnInit(): void {
    
    this.route.queryParams
      .subscribe(params => {
        this.user = params['user']; 
      }
    );

    if(this.authorityflg === 0 || this.user == 'personal' || this.user == undefined){
      this.user = 'personal';   
      this.displayempDet(); 
      this.misspunch_nonmarking_count();
    }else{
      this.user = 'team';
    }
    this.currentPage = 1; 
    this.currentPagePersonal =1;

    this.apicall.FetchCompanyList(this.empcode).subscribe((res)=>{
    this.listCompany=res;
    })

    this.apicall.FetchDepartmentList(this.deptypeid,this.empcode).subscribe(res =>{
    this.listDepartment=res;
    })

    this.apicall.listRegStatus(this.stattypeid).subscribe((res)=>{
    this.listRegStatus=res;
    })

    this.apicall.FetchEmployeeList(this.deptypeid,this.comtypeid,this.empcode).subscribe(res =>{
      this.listEmployee=res; 
      }) 


     // list all request - team 

     this.fetchteamdata();
   
  


    // list misspunched dates  -  personal

    // this.apicall.listMisPunchedDate(this.empcode).subscribe((res)=>{
    // this.listMisPunchedDate=res;
    // })

    this.fetchmispuncheddate();


    // list first date and last date of loggined month

    this.apicall.listFromToDates().subscribe(res=>{
      this.listdates = res;
      if(this.listdates.length > 0)
      {
        const listdatesdata = this.listdates[0];
        this.fromdate.setValue(formatDate(listdatesdata.FROM_DATE,'yyyy-MM-dd','en'));
        this.todate.setValue(formatDate(listdatesdata.TO_DATE,'yyyy-MM-dd','en'));
        this.fromdates.setValue(formatDate(listdatesdata.FROM_DATE,'yyyy-MM-dd','en'));
        this.todates.setValue(formatDate(listdatesdata.TO_DATE,'yyyy-MM-dd','en'));
        this.fmdt =formatDate(listdatesdata.FROM_DATE,'yyyy-MM-dd','en');
        this.todt = formatDate(listdatesdata.TO_DATE,'yyyy-MM-dd','en');
      };
    })



  }

  fetchteamdata()
    {
      this.viewflag=1;
      this.apicall.listReguRequest(this.empcode,this.reqstatus,this.viewflag,this.firstDay,this.lastDay).subscribe((res)=>{

        this.listReguRequest=res;
        //alert(this.listReguRequest.length)
        this.totalreq=this.listReguRequest.length;       
        const totalPages = Math.ceil(this.totalreq / 10);
        this.totalPages = Array(totalPages).fill(0).map((_, index) => index + 1);  
        })
    
    }



  ngAfterViewInit() {
    feather.replace();
  }


  misspunch_nonmarking_count()
  {

    this.apicall.listmispunch_nonmarkingapi(this.empcode).subscribe((res)=>{
    this.listmispunch_nonmarking=res;
  })

  }


  selection(user:string){ 
    this.user = user;
    if (this.user === 'personal') {
      this.displayempDet(); 
      this.misspunch_nonmarking_count();

    } else {
      this.level = this.userSession.level; 
      this.fetchteamdata();
    }      
   }


   // list miss punched non marking data - personal

   misspunched()
   {
      const pflag ="1";
      this.apicall.listmispunch_nonmarkingdataapi(pflag,this.empcode).subscribe((res)=>{
      this.listmispunch=res;
    })
   }

   nonmarked()
   {
      const pflag ="2";
      this.apicall.listmispunch_nonmarkingdataapi(pflag,this.empcode).subscribe((res)=>{
      this.listnonmarking=res;
    })
   }

   // Status Approve List
Approvelist(requestID: any){
  this.reqID = requestID
  this.apicall.StatusApproveList(2,this.reqID,'R').subscribe(res=>{
    this.approvelist = res;
  })
}

fetchmispuncheddate()
{
  this.apicall.listMisPunchedDate(this.empcode).subscribe((res)=>{
    this.listMisPunchedDate=res;
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
const totalResults = this.listReguRequest.filter((employee: any) => {
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

const filteredData = this.listReguRequest.filter((employee: any) =>
  Object.values(employee).some((value: any) =>
    typeof value === 'string' &&
    value.toLowerCase().startsWith(this.searchInput.toLowerCase())
  )
);

const start = (this.currentPage - 1) * this.itemsPerPage + 1;
return Math.min(start, filteredData.length);
}


getEntriesEnd(): number {  
const filteredData = this.listReguRequest.filter((employee: any) =>
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
const totalResults = this.listReguRequestEmp.filter((policy: any) => {
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

const filteredData = this.listReguRequestEmp.filter((policy: any) =>
Object.values(policy).some((value: any) =>
  typeof value === 'string' &&
  value.toLowerCase().startsWith(this.searchInput.toLowerCase())
)
);

const start = (this.currentPagePersonal - 1) * this.itemsPerPage + 1;
return Math.min(start, filteredData.length);
}


getEntriesEndPersonal(): number {  
const filteredData = this.listReguRequestEmp.filter((policy: any) =>
Object.values(policy).some((value: any) =>
  typeof value === 'string' &&
  value.toLowerCase().startsWith(this.searchInput.toLowerCase())
)
);
const end = this.currentPagePersonal * this.itemsPerPage;
return Math.min(end, filteredData.length);
}




}