import { Component, OnInit } from '@angular/core';
import { ApiCallService } from 'src/app/api-call.service';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/login.service';
import { FormGroup, FormControl, FormArray, FormBuilder, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import * as feather from 'feather-icons';
import { formatDate } from '@angular/common';  

@Component({
  selector: 'app-compoff',
  templateUrl: './compoff.component.html',
  styleUrls: ['./compoff.component.scss']
})
export class CompoffComponent implements OnInit {

  userSession:any = this.session.getUserSession();
  empcode: any=this.userSession.empcode;
  level: any=this.userSession.level;
  authorityflg:any =this.userSession.authorityflg;
  user:string ="team";
  listCompoffDates:any;
  compoffdate = new FormControl();
  availeddate = new FormControl();
  reason = new FormControl();
  showModal = 0;
  success:any="";
  failed:any="";
  listCompany:any;
  listDepartment:any;
  listEmployee:any;
  comtypeid=12;
  deptypeid=1;
  stattypeid=26;
  listRegStatus:any;
  fromdate = new FormControl();
  todate = new FormControl();
  fromdates = new FormControl();
  todates = new FormControl();
  listdates:any;
  fmdt:any;
  todt:any;
  listcompoffRequest:any;
  fmdt1:any;
  listleaveCounts:any;
  viewflag=1;
  listcompoffRequestEmp:any;
  listcompoffmatrix:any;
  listleaveCountsEmp:any;
  selectedRequestID: any;
  selectedEmpCode: any;
  reasonControl = new FormControl();
  date = new Date();
  firstDay1 = new Date(this.date.getFullYear(), this.date.getMonth(), 1);
  lastDay1 = new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0);
  firstDay=this.datePipe.transform(this.firstDay1,"yyyy-MM-dd");
  lastDay=this.datePipe.transform(this.lastDay1,"yyyy-MM-dd");
  totalreqPersonal: any; 
  totalPagesPersonal!: number[];
  currentPagePersonal!: number;
  totalreq: any; 
  totalPages!: number[];
  currentPage!: number;
  lfromdate = new FormControl();
  ltodate = new FormControl();
  leavetype: any = -1;
  leavesummary: any;
  reqID:any;
  approvelist:any;
  searchInput: string = '';
  leavebalance: any;

  
  constructor(private datePipe: DatePipe,private session:LoginService,private apicall:ApiCallService,private route:Router) { }
  
  ngOnInit(): void {

    if(this.authorityflg === 0){
      this.user = 'personal';   
      this.displaycompoffdetailsEmp();
      this.displayCountofEmp();
    }else{
      this.user = 'team';
    }

    this.currentPage =1;
    this.currentPagePersonal =1;

    this.apicall.compoffdate(this.empcode).subscribe((res)=>{
    this.listCompoffDates=res;
    })

    this.apicall.listCompany(this.comtypeid).subscribe((res)=>{
    this.listCompany=res;
    })

    this.apicall.listDepartment(this.deptypeid).subscribe((res)=>{
    this.listDepartment=res;
    })

    this.apicall.listallEmployee().subscribe((res)=>{
    this.listEmployee=res;
    }) 

    this.apicall.listRegStatus(this.stattypeid).subscribe((res)=>{
    this.listRegStatus=res;
    })

      this.apicall.listFromToDates().subscribe(res=>{
      this.listdates = res;
      if(this.listdates.length > 0)
      {
        const listdatesdata = this.listdates[0];
        this.fromdate.setValue(formatDate(listdatesdata.FROM_DATE,'yyyy-MM-dd','en'));
        this.todate.setValue(formatDate(listdatesdata.TO_DATE,'yyyy-MM-dd','en'));
        this.fromdates.setValue(formatDate(listdatesdata.FROM_DATE,'yyyy-MM-dd','en'));
        this.todates.setValue(formatDate(listdatesdata.TO_DATE,'yyyy-MM-dd','en'));
        this.lfromdate.setValue(formatDate(listdatesdata.FROM_DATE,'yyyy-MM-dd','en'));
        this.ltodate.setValue(formatDate(listdatesdata.TO_DATE,'yyyy-MM-dd','en'));
      };
    })


     // count in team section


      const fillsDatas = {
      viewflag: 1,
      emp_code: this.userSession.empcode,
      fromdate: this.firstDay, 
      todate: this.lastDay, 
      absent_category:"C"
      };

      this.apicall.FetchStatusCounts_Leave(fillsDatas).subscribe((res)=>{
      this.listleaveCounts=res;
      })
  

    
      // compoff request listing - Team
   
      const reqstatus=0;
      this.apicall.listcompoffRequest(this.empcode,reqstatus,this.viewflag,this.firstDay,this.lastDay).subscribe((res)=>{
      this.listcompoffRequest=res;

      this.totalreq=this.listcompoffRequest.length; 
      const totalPages = Math.ceil(this.totalreq / 10);
      this.totalPages = Array(totalPages).fill(0).map((_, index) => index + 1); 

      })
  
  }

  // Team  pagination

  get listcompoffteam() {
    const pageSize = 10;
    const startIndex = (this.currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return this.listcompoffRequest.slice(startIndex, endIndex);
  }


  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }
  
  nextPage() {
    const totalPages = Math.ceil(this.listcompoffRequest.length / 10);
    if (this.currentPage < totalPages) {
      this.currentPage++;
    }
  }


 // Team Filter


  


  // Leave filter was not used
  FetchCompoffReqFilter()
  {
    const comname= (<HTMLInputElement>document.getElementById("comname")).value;
    const depname= (<HTMLInputElement>document.getElementById("depname")).value;
    const empname= (<HTMLInputElement>document.getElementById("empname")).value;
    const fillstatus= (<HTMLInputElement>document.getElementById("fillstatus")).value;
    const fromdate= (<HTMLInputElement>document.getElementById("fromdate")).value;
    const todate= (<HTMLInputElement>document.getElementById("todate")).value;

    // alert(comname);
    // alert(depname);
    // alert(empname);
    // alert(fillstatus);
    //  alert(fromdate);
    //  alert(todate);
    
    if( fromdate > todate){
      (<HTMLInputElement>document.getElementById("openModalButton")).click();
      this.showModal = 2;
      this.failed = "Please Correct the Dates";
    }else{
    const compData = {
      company: comname,
      department: depname,
      emp_code: empname, 
      status: fillstatus,
      fromdate: fromdate,      
      todate: todate,
      authority:this.empcode,

    };

    this.apicall.Fetchcompoff_Filterapi(compData).subscribe(res=>{
    this.listcompoffRequest=res;
    this.totalreq=this.listcompoffRequest.length; 
    const totalPages = Math.ceil(this.totalreq / 10);
    this.totalPages = Array(totalPages).fill(0).map((_, index) => index + 1); 

    }) 
   }

  }

  // FetchStatusCounts_LeaveFilter()
  // {

  //   const comname= (<HTMLInputElement>document.getElementById("comname")).value;
  //   const depname= (<HTMLInputElement>document.getElementById("depname")).value;
  //   const empname= (<HTMLInputElement>document.getElementById("empname")).value;
  //   const fillstatus= (<HTMLInputElement>document.getElementById("fillstatus")).value;
  //   const fromdate= (<HTMLInputElement>document.getElementById("fromdate")).value;
  //   const todate= (<HTMLInputElement>document.getElementById("todate")).value;

  //   const compDatas = {
  //     company: comname,
  //     department: depname,
  //     emp_code: empname, 
  //     status: fillstatus,
  //     fromdate: fromdate,      
  //     todate: todate, 
  //     absent_category:'C',
  //     authority:this.empcode,
  //   };

  //    this.apicall.FetchStatusCounts_LeaveFilter(compDatas).subscribe(res=>{
  //    this.listcompoffRequest=res;

  //    }) 

  // }


 // Display leave matrix - Team

  FetchLeaveMatrixData()
  {
    const fromdate= (<HTMLInputElement>document.getElementById("fromdate")).value;
    const todate= (<HTMLInputElement>document.getElementById("todate")).value;

    const matrixData = {
      viewflag:1,
      emp_code:this.empcode,
      fromdate: fromdate,      
      todate: todate,
    };

     this.apicall.FetchLeaveMatrixData(matrixData).subscribe(res=>{
     this.listcompoffmatrix=res;

     }) 

  }

  

 

//changes


  approve(reqid:any,empcodes:any){ 
    const approvedata={
      req_id:reqid,
      empcode:empcodes,
      verified_by:this.empcode,
      verified_remarks:'NULL',      
      mflag: 1
    }
      //alert(JSON.stringify(approvedata))
      this.apicall.ApproveRejectLeaveCompoff(approvedata).subscribe((res) => {
       // alert(JSON.stringify(res))      
        if(res.Errorid==1){
          this.showModal = 1;
          this.success='Request approved!';     
         
        }
        else{
          this.showModal = 2;
          this.failed='Failed!';         
        }     
        this.ngOnInit();
    });
   }

   setSelectedRequestID(requestID: any,empCode:any) {
    this.selectedRequestID = requestID;
    this.selectedEmpCode = empCode;
   }

   reject(reqid:any){  

    const rejectreason= (<HTMLInputElement>document.getElementById("rejectreason")).value;

    const rejectdata={
      req_id:reqid,
      empcode:this.selectedEmpCode,
      verified_by:this.empcode,
      verified_remarks:rejectreason,      
      mflag: 0
    }
       // alert(JSON.stringify(rejectdata))
        this.apicall.ApproveRejectLeaveCompoff(rejectdata).subscribe((res) => {
       // alert(JSON.stringify(res))      
        if(res.Errorid==1){
          this.showModal = 1;
          this.success='Request rejected!';     
        }
        else{
          this.showModal = 2;
          this.failed='Failed!';         
        }     
        this.ngOnInit(); 
       // this.rejectdata.setValue('');
    });
   }


   cancel(reqid:any){   
  const req_category='F'
    this.apicall.CancelRequests(this.empcode,reqid,req_category).subscribe((res) => {
      if(res.Errorid==1){
        this.showModal = 1; 
        this.success='Request cancelled!';     
      }
      else{
        this.showModal = 2; 
        this.failed='Failed!';      
      }
      this.displaycompoffdetailsEmp();  
    });
   }



  // ** personal section begining ** //


  addCompoffRequest()
  {
    if(this.compoffdate.value == null){
      this.showModal = 2;
      this.failed = "Please select the date";
    }else{
    const compreqdata = {
      compoff_id:this.compoffdate.value,
      emp_code : this.userSession.empcode,
      availed_date:this.availeddate.value,
      reason:this.reason.value,
    };

    this.apicall.addcompoffReq(compreqdata).subscribe(res=>{
    if(res.Errorid==1)
      {
        this.showModal = 1;
        this.success = "Compoff Requested Successfully";

      }
      else if(res.Errorid==3)
      {
        this.showModal = 2;
        this.failed = "Cannot apply for compoff before last payroll processed date..!";
      }  
      else
      {
        this.showModal = 2;
        this.failed = "Request Failed";
      } 

      this.displaycompoffdetailsEmp();  
      this.displayCountofEmp();
      this.compoffdate.setValue('');
      this.availeddate.setValue('');
      this.reason.setValue('');

   }) 
  }
  }

 FetchFilterEmp()
  {
    const fillsts= (<HTMLInputElement>document.getElementById("fillsts")).value;
    const fromdates= (<HTMLInputElement>document.getElementById("fromdates")).value;
    const todates= (<HTMLInputElement>document.getElementById("todates")).value;
      const viewflag= 0;
      this.apicall.listpersonalFilter(this.empcode,fillsts,viewflag,fromdates,todates).subscribe((res)=>{
      this.listcompoffRequestEmp=res;
      this.totalreqPersonal=this.listcompoffRequestEmp.length; 
      const totalPagesPersonal = Math.ceil(this.totalreqPersonal / 10);
      this.totalPagesPersonal = Array(totalPagesPersonal).fill(0).map((_, index) => index + 1); 
        })
  }

  displaycompoffdetailsEmp()
  {
      const reqstatus = 0;
      const viewflag = 0;
      this.apicall.listcompoffRequest(this.empcode,reqstatus,viewflag,this.firstDay,this.lastDay).subscribe((res)=>{
      this.listcompoffRequestEmp=res; 
      this.totalreqPersonal=this.listcompoffRequestEmp.length; 
      const totalPagesPersonal = Math.ceil(this.totalreqPersonal / 10);
      this.totalPagesPersonal = Array(totalPagesPersonal).fill(0).map((_, index) => index + 1); 
      })
  }


  get listcompoffPersonal() {
    const pageSize = 10;
    const startIndex = (this.currentPagePersonal - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return this.listcompoffRequestEmp.slice(startIndex, endIndex);
  }


  previousPagePersonal() {
    if (this.currentPagePersonal > 1) {
      this.currentPagePersonal--;
    }
  }
  
  nextPagePersonal() {
    const totalPagesPersonal = Math.ceil(this.listcompoffRequestEmp.length / 10);
    if (this.currentPagePersonal < totalPagesPersonal) {
      this.currentPagePersonal++;
    }
  }


// Personal count


  displayCountofEmp()
  {

    const fillsData = {
      viewflag: 0,
      emp_code: this.userSession.empcode,
      fromdate: this.firstDay, 
      todate: this.lastDay, 
      absent_category:"C"
    };

      this.apicall.FetchStatusCounts_Leave(fillsData).subscribe((res)=>{
      this.listleaveCountsEmp=res;
      })

  }

   selection(user:string){ 
    this.user = user;
    if (this.user === 'personal') {
      
      this.displaycompoffdetailsEmp();
      this.displayCountofEmp();

    } else {
      this.level = this.userSession.level; 
    }      
   }

   leavesummarystatus(value:any){
    this.leavetype=value; 
    this.fetchleavesummary();
   }

   fetchleavesummary(){

    const lfdt= (<HTMLInputElement>document.getElementById("lfromdate")).value;
    const ltdt= (<HTMLInputElement>document.getElementById("ltodate")).value;

      // this.apicall.FetchLeaveSummary(this.leavetype,lfdt,ltdt,this.empcode).subscribe(res=>{
      //   this.leavesummary = res;
      // })
  }

// Status Approve List
Approvelist(requestID: any){
  this.reqID = requestID
  this.apicall.StatusApproveList(1,this.reqID,'C').subscribe(res=>{
    this.approvelist = res;
  })
}
leavebalancedtl(){
  this.apicall.FetchLeaveBalance(this.empcode).subscribe(res=>{
    this.leavebalance = res;
  })
}

}
