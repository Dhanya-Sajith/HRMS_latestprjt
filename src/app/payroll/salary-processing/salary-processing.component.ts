import { Component, OnInit } from '@angular/core';
import { ApiCallService } from 'src/app/api-call.service';
import { LoginService } from 'src/app/login.service';
import { DatePipe} from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-salary-processing',
  templateUrl: './salary-processing.component.html',
  styleUrls: ['./salary-processing.component.scss']
})
export class SalaryProcessingComponent implements OnInit {

  userSession:any = this.session.getUserSession();
  authorityflg:any =this.userSession.authorityflg;
  empcode: any=this.userSession.empcode;
  empid:any =this.userSession.id;
  level: any=this.userSession.level;
  desig:any=this.userSession.desig.split('#', 1);
  desigID:any= this.desig[1]; 
  grpname:any=this.userSession.grpname;

  companydata: any;
  companyID:any = -1;
  listMonth: any;
  month:any = -1;
  remarks:any  
  showModal:any
  success:any
  failed:any
  processinglist: any;
  isDisabled = false;
  loading = false;
  isDisabledAll = false;
  CompanystoredValue = localStorage.getItem('CompanyName');
  MonthstoredValue = localStorage.getItem('Month');
  CompnyidStored = localStorage.getItem('CompanyID')
  rejectstatus: any;
  urlval: any;
  pdata: any;


  constructor(private session:LoginService,private apicall:ApiCallService,private datePipe: DatePipe, private router:ActivatedRoute) { }

  ngOnInit(): void {
    //company combo box
    this.apicall.FetchCompanyList(this.empcode).subscribe((res)=>{
      this.companydata=res;
    });
    this.listmonths();
    this.ViewSalaryProcess();
    const url = this.router.snapshot.url.join('/');
    this.urlval=url;
  
    if(url=='salary_processing')
    {
      // localStorage.removeItem('CompanyName');
      // localStorage.removeItem('Month');
      // localStorage.removeItem('CompanyID');
    }
    else if(url=='salary_process')
    {
      this.SalaryProcess();
    }
  }

  setLocalstorage(CompanyName:any,Month:any,CompanyID:any)
  {
    localStorage.setItem('CompanyName', CompanyName); 
    localStorage.setItem('Month',Month);
    localStorage.setItem('CompanyID',CompanyID);
  }

  listmonths()
  {
    const year=  (new Date()).getFullYear();
    this.apicall.listMonth(year).subscribe((res)=>{
    this.listMonth = res;
    })
  }

  ViewSalaryProcess()
  {
    this.apicall.FetchSalaryProcessingList(this.companyID,this.month,this.empcode).subscribe((res)=>{
      this.processinglist = res;
      this.setLocalstorage(this.processinglist[0].COMPANY_NAME,this.processinglist[0].MONTH_ID,this.processinglist[0].COMPANY_CODE);
    }) 
  }

  SalaryProcess(){
    // if(this.CompnyidStored != '' && this.MonthstoredValue != ''){
    //   this.apicall.FetchSalaryProcessingList(this.CompnyidStored,this.MonthstoredValue).subscribe((res)=>{
    //     this.processinglist = res;
    //   })
    // }else{
      this.apicall.FetchSalaryProcessingList(this.companyID,this.month,this.empcode).subscribe((res)=>{
        this.processinglist = res;
      })
    // }
  }

  Salaryprocessing(companyname:any,monthid:any,comcode:any)
  {
    this.loading = true;
    this.isDisabledAll = true;
    this.setLocalstorage(companyname,monthid,comcode);
    const data = {
      company: comcode,
      mon:monthid,
      user:this.empcode
    };
    this.apicall.Salary_Processing(data).subscribe((res)=>{
       if(res.Errorid == -1){
       // alert(res.Errorid)
        this.showModal = 2;
        this.failed = "Please, Re-Run the checklist";
        this.SalaryProcess();
      }
      else if(res.Errorid == 1){
        this.showModal = 1;
        this.success = "Processing Completed";
        this.SalaryProcess();
      }
      else if(res.Errorid == 0){
        this.showModal = 2;
        this.failed = "Failed";
        this.SalaryProcess();
      }
      this.loading = false;
      this.isDisabledAll = false;
      this.SalaryProcess();
    })    
  }

  RejectStatus(item:any,status:any)
  {
    this.rejectstatus = status;
    this.pdata = item;
  }

  onReject()
  {
    const data = {
      company : this.pdata.COMPANY_CODE,
      month :this.pdata.MONTH_ID,
      user : this.empcode,
      status : this.rejectstatus,
      reject_reason : this.remarks
    };
    this.apicall.SalaryProcessing_ApprovalReject(data).subscribe((res)=>{
      if(res.Errorid==1){
        this.showModal = 1;         
        this.success = "Rejected";  
        this.SalaryProcess();
      }
      else{
        this.showModal = 2;
        this.failed = "Failed";
      }
    })
    this.SalaryProcess();
  }

  Approve(item:any,status:any)
  {
    const data = {
      company : item.COMPANY_CODE,
      month : item.MONTH_ID,
      user : this.empcode,
      status : status,
      reject_reason : ''
    };
    this.apicall.SalaryProcessing_ApprovalReject(data).subscribe((res)=>{
      if(res.Errorid==1){
        this.showModal = 1;         
        this.success = "Approved Sucessfully";  
        this.SalaryProcess();
      }
      else{
        this.showModal = 2;
        this.failed = "Failed";
      }
    })
    this.SalaryProcess();
  }

  Payslip(item:any,status:any)
  {
    const data = {
      company : item.COMPANY_CODE,
      month : item.MONTH_ID,
      user : this.empcode,
      status : status,
      reject_reason : ''
    };
    this.apicall.SalaryProcessing_ApprovalReject(data).subscribe((res)=>{
      if(res.Errorid==1){
        this.showModal = 1;         
        this.success = "Generate Payslip Sucessfully";  
        this.SalaryProcess();
      }
      else{
        this.showModal = 2;
        this.failed = "Failed";
      }
    })
    this.SalaryProcess();
  }

}