import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators,FormBuilder } from '@angular/forms';
import { ApiCallService } from 'src/app/api-call.service';
import { LoginService } from 'src/app/login.service';

@Component({
  selector: 'app-resignation-request',
  templateUrl: './resignation-request.component.html',
  styleUrls: ['./resignation-request.component.scss']
})
export class ResignationRequestComponent implements OnInit {
  userSession:any = this.session.getUserSession();
  empcode: any=this.userSession.empcode;  
  AddReqForm: FormGroup;
  showModal!: number;
  success!: string;
  failed!: string;
  tabledata: any;
  assetdata: any;
  reqID: any;
  approvelist: any;
  clearance_flag: any;
  remarks: any;
  showtab: any;
  accountsdata: any;
  accountsRemarks: any;
  accountsClearStatus: any;
  lastWorkingDay: any;
  isTenDaysBefore: boolean=false;
  tenDaysBefore: any;
  TenDaysBefore: any;
  isWithinTenDaysBefore!: boolean;

  constructor(private apicall:ApiCallService,private session:LoginService,private formBuilder: FormBuilder) { 
    this.AddReqForm = this.formBuilder.group({      
      reason: ['', Validators.required]      
    });
  }
  ngOnInit(): void {
    this.fetchRequests();
    this.fetchAccounts();
    
  }
  fetchRequests(){
    this.apicall.Fetch_ResignationReqEmp(this.empcode).subscribe((res)=>{
      this.tabledata=res;
      this.lastWorkingDay=res[0].LAST_WORK_DATE;
      
      let tabarray: any[] = []; 
      tabarray.push(res[0].APPROVED_STATUS)
      this.showtab=tabarray.includes(1);
      //alert(this.showtab)
      console.log(JSON.stringify(this.tabledata))
    })
  }
  checkDate(data:any): boolean {
    const lastWorkingDate = new Date(data.LAST_WORK_DATE);
    const today = new Date();
  
    // Normalize the time part to 00:00:00 for the comparison
    this.normalizeDate(today);
    this.normalizeDate(lastWorkingDate);
  
    const tenDaysBefore = new Date(lastWorkingDate);
    tenDaysBefore.setDate(lastWorkingDate.getDate() - 10);
  
    // Check if today is within the range from tenDaysBefore to lastWorkingDate
    this.isWithinTenDaysBefore = today >= tenDaysBefore;
    return this.isWithinTenDaysBefore;
}

  
  // Helper function to normalize the time part of a date to 00:00:00
  private normalizeDate(date: Date): void {
    date.setHours(0, 0, 0, 0);
  }
    
  fetchAccounts(){
    this.apicall.Fetch_Resignation_AccountsDtl(this.empcode).subscribe((res)=>{
      this.accountsdata=res;
      this.accountsRemarks=res[0].REMARKS;
      this.accountsClearStatus=res[0].CLEAR_STATUS;
      console.log(JSON.stringify(this.accountsdata))      
      //alert(this.remarks)
    })
  }
  AddRequest(){
    if (this.AddReqForm.valid) { 
      const data={
        empcode: this.empcode,
        reason: this.AddReqForm.value.reason,        
    };
    console.log(JSON.stringify(data));
    this.apicall.Add_ResignationReq(data).subscribe((res) => {
      //alert(JSON.stringify(res));   
      if (res.Errorid == 1) {
        (<HTMLInputElement>document.getElementById("openModalButton")).click();
          this.showModal = 1;
          this.success = "Request added successfully!";                
      } else if (res.Errorid == -1) {
        (<HTMLInputElement>document.getElementById("openModalButton")).click();
          this.showModal = 2;
          this.failed = "An active request already exists!";
      }else{
        (<HTMLInputElement>document.getElementById("openModalButton")).click();
          this.showModal = 2;
          this.failed = "Failed!";
      } 
      this.fetchRequests();
      this.Cancel();       
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
Cancel(){
  this.AddReqForm.reset();
}
onTabSelected(category:any){
this.apicall.Fetch_AssetDetails_Emp(this.empcode,category).subscribe((res)=>{
  this.assetdata=res;
  console.log(JSON.stringify(this.assetdata))
  this.clearance_flag=this.assetdata[0]?.RECORDID;
  this.remarks=this.assetdata[0]?.CATEGORYNM;
  //alert(this.clearance_flag)
})
}
Approvelist(requestID: any){
  this.reqID = requestID
  this.apicall.PayrollApproveList(1,this.reqID,'G').subscribe(res=>{
    this.approvelist = res;
  })
}
cancelResignarion(reqid:any){
 this.apicall.CancelRequests(this.empcode,reqid,'G').subscribe((res)=>{
  if (res.Errorid == 1) {
    (<HTMLInputElement>document.getElementById("openModalButton")).click();
      this.showModal = 1;
      this.success = "Request cancelled!";              
    }else{
    (<HTMLInputElement>document.getElementById("openModalButton")).click();
      this.showModal = 2;
      this.failed = "Failed!";
  } 
  this.fetchRequests();  
 })
}

}
