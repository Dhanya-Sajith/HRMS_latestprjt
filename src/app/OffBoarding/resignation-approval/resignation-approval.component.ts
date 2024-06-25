import { Component, OnInit } from '@angular/core';
import { ApiCallService } from 'src/app/api-call.service';
import { LoginService } from 'src/app/login.service';

@Component({
  selector: 'app-resignation-approval',
  templateUrl: './resignation-approval.component.html',
  styleUrls: ['./resignation-approval.component.scss']
})
export class ResignationApprovalComponent implements OnInit {
  userSession:any = this.session.getUserSession();
  empcode: any=this.userSession.empcode;  
  status: any;
  selectedStatus: any=0;
  yeardata: any;
  selectedYear: any=new Date().getFullYear();
  tabledata: any;
  reason: any;
  showModal!: number;
  success!: string;
  failed!: string;
  rejectReason: any='';
  item: any;  
  searchInput: any='';
  constructor(private apicall:ApiCallService,private session:LoginService) { }

  ngOnInit(): void {
    //Status 
    this.apicall.listCompany(26).subscribe((res)=>{
      this.status=res;
    })
    //Year
    this.apicall.listYear().subscribe((res) => {
      this.yeardata=res;      
    });
    this.filter(); 
  }
   filter(){
    this.apicall.Fetch_ResignationReq_team(this.empcode,this.selectedStatus,this.selectedYear).subscribe((res) => {
      this.tabledata=res; 
      //alert(JSON.stringify(this.tabledata))     
    }); 
   }
   selectedreq(item:any){
    this.item=item;
    this.reason=item.REASON;
   }
   editlastWorkDate(newDate: string, item: any) {   
    if (new Date(newDate) < new Date(item.REQUEST_DATE)) {
      (<HTMLInputElement>document.getElementById("openModalButton")).click();
      this.showModal = 2;
      this.failed = "Invalid date!";
    }else{
    item.LAST_WORK_DATE = newDate;   
    console.log('New Last Work Date:', newDate);
    }
  }
   Approve(item:any){
    const data={
      req_id:item.REQUEST_ID,
      empcode:item.EMP_CODE,
      last_work_date:item.LAST_WORK_DATE,
      verified_by:this.empcode,
      verified_remarks:"",
      mflag:1
    }
    this.apicall.ApproveReject_Resignation(data).subscribe((res)=>{
      if (res.Errorid == 1) {
        (<HTMLInputElement>document.getElementById("openModalButton")).click();
          this.showModal = 1;
          this.success = "Request approved successfully!";              
        }else{
        (<HTMLInputElement>document.getElementById("openModalButton")).click();
          this.showModal = 2;
          this.failed = "Failed!";
      } 
      this.filter();  
     })
   }
   Reject(item:any){    
    const data={
      req_id:item.REQUEST_ID,
      empcode:item.EMP_CODE,
      last_work_date:item.LAST_WORK_DATE,
      verified_by:this.empcode,
      verified_remarks:this.rejectReason,
      mflag:2
    }
    this.apicall.ApproveReject_Resignation(data).subscribe((res)=>{
      if (res.Errorid == 1) {
        (<HTMLInputElement>document.getElementById("openModalButton")).click();
          this.showModal = 1;
          this.success = "Request rejected!";              
        }else{
        (<HTMLInputElement>document.getElementById("openModalButton")).click();
          this.showModal = 2;
          this.failed = "Failed!";
      } 
      this.filter();  
     })
   }
}
