import { Component, OnInit } from '@angular/core';
import { ApiCallService } from 'src/app/api-call.service';
import { LoginService } from 'src/app/login.service';
import { DatePipe} from '@angular/common';
import { FormControl,FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, NavigationExtras  } from '@angular/router';

@Component({
  selector: 'app-eosstatement',
  templateUrl: './eosstatement.component.html',
  styleUrls: ['./eosstatement.component.scss']
})
export class EOSStatementComponent implements OnInit {

  userSession:any = this.session.getUserSession();
  authorityflg:any =this.userSession.authorityflg;
  empcode: any=this.userSession.empcode;
  company: any=this.userSession.companycode;

  isFormValid:boolean=false;
  showModal = 0;
  failed!: string;
  success!: string;

  reqid: any;
  empcd: any;
  view: any;
  isDisabled = false;
  isValid: boolean=false;
  AdditionForm: FormGroup; 
  DeductionForm: FormGroup; 
  gratuity: any;
  Empdetails: any;
  yearofservice: any;
  gratuityamount: any;
  salarydetails: any;
  eosdetails: any;
  payType1Data: any;
  payType2Data: any;
  TOTAL_ADDITION: any;
  TOTAL_DEDUCTION: any;
  NET_AMOUNT: any;
  GROSS_SALARY: any;
  successflag: number = 0;
  EditAdditionForm: FormGroup; 
  EditDeductionForm: FormGroup; 
  sourceflag: any;

  constructor(private apicall:ApiCallService,private datePipe:DatePipe,private session:LoginService,private fb: FormBuilder,private route: ActivatedRoute,private router: Router) { 
    this.AdditionForm = this.fb.group({
      adddesc: ['', Validators.required],
      addamount: ['', Validators.required],      
    });
    this.DeductionForm = this.fb.group({
      deddesc: ['', Validators.required],
      dedamount: ['', Validators.required],      
    });
    this.EditAdditionForm = this.fb.group({
      eadddesc: ['', Validators.required],
      eaddamount: ['', Validators.required],      
    });
    this.EditDeductionForm = this.fb.group({
      ededdesc: ['', Validators.required],
      ededamount: ['', Validators.required],      
    });
  }

  ngOnInit(): void {
    this.route.queryParams
      .subscribe(params => {
        this.reqid = params['reqid']; 
        this.empcd = params['code']; 
        this.view = params['view']; 
      }
    );

    if(this.view == 1){
      this.isDisabled = true;
    }else{
      this.isDisabled = false;
    }

    this.apicall.GetGratuityAmount(this.empcd).subscribe((res) => {  
     this.gratuity = res
     this.yearofservice = this.gratuity.YEARS_OF_SERVICE;
     this.gratuityamount = this.gratuity.GRATUITY_AMOUNT;
    });

    this.apicall.Fetch_EmpDetails_ExitInterview(this.empcd,this.reqid).subscribe((res) => {  
      this.Empdetails = res
     });
      
     this.apicall.FetchEOS_EmpSal_Details(this.empcd).subscribe((res) => {  
      this.salarydetails = res
      this.GROSS_SALARY = this.salarydetails[0].GROSS_SALARY;
     });

     this.FetchAdditionDeductions();
  }

  FetchAdditionDeductions()
  {
    this.apicall.FetchEOS_AdditionDeduction_Details(this.empcd).subscribe((res) => {  
      this.eosdetails = res
      this.payType1Data = this.eosdetails.filter((data: { PAY_TYPE: number; }) => data.PAY_TYPE === 1);
      this.payType2Data = this.eosdetails.filter((data: { PAY_TYPE: number; }) => data.PAY_TYPE === 2);
      this.TOTAL_ADDITION = this.eosdetails[0].TOTAL_ADDITION;
      this.TOTAL_DEDUCTION = this.eosdetails[0].TOTAL_DEDUCTION;
      this.NET_AMOUNT = this.eosdetails[0].NET_AMOUNT;
     });
  }

  validateAdditionForm() {      
    if (this.AdditionForm.valid){
    this.isValid = true;
    }
    else{
      this.markFormGroupTouched(this.AdditionForm);
    
    }
  }

  Addition()
  {
    if (this.AdditionForm.valid) {
      const desc = this.AdditionForm.get('adddesc');      
      const amount = this.AdditionForm.get('addamount');    
      
      const data = {
        reqid:this.reqid,
        empcode: this.empcd,
        EOS_operation:1,
        amount:amount?.value,
        payment_category:desc?.value,
        updatedby:this.empcode,
        last_workdate:'2024-05-30',
      };

      this.apicall.AddOrDeduct_EOSPayments(data).subscribe((res) => {  
        if(res.Errorid==1){
          this.showModal = 1;
          this.success='Changes saved successfully!';
          this.FetchAdditionDeductions();
        }
        else{
            this.showModal = 2; 
            this.failed='Failed!'; 
            this.FetchAdditionDeductions();    
        }    
        // this.FetchLoanRequests(); 
        this.AdditionForm.reset(); 
      
      });
    } else {    
      this.markFormGroupTouched(this.AdditionForm);   
    }
  }

  validateDeductionForm() {      
    if (this.DeductionForm.valid){
    this.isValid = true;
    }
    else{
      this.markFormGroupTouched(this.DeductionForm);
    
    }
  }

  Deduction()
  {
    if (this.DeductionForm.valid) {
      const desc = this.DeductionForm.get('deddesc');      
      const amount = this.DeductionForm.get('dedamount');    
      
      const data = {
        reqid:this.reqid,
        empcode: this.empcd,
        EOS_operation:2,
        amount:amount?.value,
        payment_category:desc?.value,
        updatedby:this.empcode,
        last_workdate:'2024-05-30',
      };

      this.apicall.AddOrDeduct_EOSPayments(data).subscribe((res) => {  
        if(res.Errorid==1){
          this.showModal = 1;
          this.success='Changes saved successfully!';
          this.FetchAdditionDeductions();   
        }
        else{
            this.showModal = 2; 
            this.failed='Failed!';  
            this.FetchAdditionDeductions();   
        }
    
        this.DeductionForm.reset(); 
      
      });
    } else {    
      this.markFormGroupTouched(this.DeductionForm);   
    }
  }

  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
    });
  }

  Clear(form:any)
  {
    form.reset(); 
  }

  SendtoVP()
  {
    const data = {
      empcode:this.empcd,
      reqID:this.reqid,
      status:2,
      updated_by:this.empcode,   
      reject_reason:null,   
      payment_date:null,
      payment_mode:null 
    };
    this.apicall.EOS_SalaryApprovalReject(data).subscribe((res)=>{
      if(res.Errorid>0)
        {
          this.showModal = 1; 
          this.success = "Request send to VP Successfully";
          this.successflag = 1;
        }
        else
        {
          this.showModal = 2;
          this.failed = "Failed";
          this.successflag = 0;
        }   
    })
  }

  EditAdd(item: any)
  {
    this.EditAdditionForm.controls['eadddesc'].setValue(item.PAY_CATEGORY);
    this.EditAdditionForm.controls['eaddamount'].setValue(item.AMOUNT);
    this.sourceflag = item.SOURCE_FLAG;
  }

  EditDed(item:any)
  {
    this.EditDeductionForm.controls['ededdesc'].setValue(item.PAY_CATEGORY);
    this.EditDeductionForm.controls['ededamount'].setValue(item.AMOUNT);
    this.sourceflag = item.SOURCE_FLAG;
  }

  validateEditAdditionForm() {      
    if (this.EditAdditionForm.valid){
    this.isValid = true;
    }
    else{
      this.markFormGroupTouched(this.EditAdditionForm);
    }
  }

  EditAddition()
  {

     if (this.EditAdditionForm.valid) {
      const desc = this.EditAdditionForm.get('eadddesc');      
      const amount = this.EditAdditionForm.get('eaddamount');     
      
      const data = {
        empcode:this.empcd,
        reqID:this.reqid,
        EOS_operation:1,
        eFlag:1,   
        amount:amount?.value,   
        payment_category:desc?.value,
        source_flag:this.sourceflag,
        updated_by:this.empcode
      };
      this.apicall.EOS_DetailsEdit(data).subscribe((res)=>{
        if(res.Errorid==1){
          this.showModal = 1;
          this.success='Updated successfully!';
          this.FetchAdditionDeductions();   
        }
        else{
            this.showModal = 2; 
            this.failed='Failed!';  
            this.FetchAdditionDeductions();   
        }
    
        this.EditAdditionForm.reset(); 
        this.sourceflag = null;
      });
    } else {    
      this.markFormGroupTouched(this.EditAdditionForm);   
    }
  }

  validateEditDeductionForm() {      
    if (this.EditDeductionForm.valid){
    this.isValid = true;
    }
    else{
      this.markFormGroupTouched(this.EditDeductionForm);
    }
  }

  EditDeduction()
  {
    if (this.EditDeductionForm.valid) {
      const desc = this.EditDeductionForm.get('ededdesc');      
      const amount = this.EditDeductionForm.get('ededamount');    
      
      const data = {
        empcode:this.empcd,
        reqID:this.reqid,
        EOS_operation:2,
        eFlag:1,   
        amount:amount?.value,   
        payment_category:desc?.value,
        source_flag:this.sourceflag,
        updated_by:this.empcode
      };
      this.apicall.EOS_DetailsEdit(data).subscribe((res)=>{
        if(res.Errorid>0)
          {
            this.showModal = 1; 
            this.success = "Updated Successfully";
            this.FetchAdditionDeductions();
          }
          else
          {
            this.showModal = 2;
            this.failed = "Failed";
            this.FetchAdditionDeductions();
          }  
          this.EditDeductionForm.reset(); 
          this.sourceflag = null; 
      });
    } else {    
      this.markFormGroupTouched(this.EditDeductionForm);   
    }
  }

  RemoveAddition(item: any)
  {
    const data = {
      empcode:this.empcd,
      reqID:this.reqid,
      EOS_operation:1,
      eFlag:2,   
      amount:item.AMOUNT,   
      payment_category:item.PAY_CATEGORY,
      source_flag:item.SOURCE_FLAG,
      updated_by:this.empcode
    };
    this.apicall.EOS_DetailsEdit(data).subscribe((res)=>{
      if(res.Errorid>0)
        {
          this.showModal = 1; 
          this.success = "Remove Successfully";
          this.FetchAdditionDeductions();
        }
        else
        {
          this.showModal = 2;
          this.failed = "Failed";
          this.FetchAdditionDeductions();
        }   
    })
  }

  RemoveDeduction(item: any)
  {
    const data = {
      empcode:this.empcd,
      reqID:this.reqid,
      EOS_operation:2,
      eFlag:2,   
      amount:item.AMOUNT,   
      payment_category:item.PAY_CATEGORY,
      source_flag:item.SOURCE_FLAG,
      updated_by:this.empcode
    };
    this.apicall.EOS_DetailsEdit(data).subscribe((res)=>{
      if(res.Errorid>0)
        {
          this.showModal = 1; 
          this.success = "Remove Successfully";
          this.FetchAdditionDeductions();
        }
        else
        {
          this.showModal = 2;
          this.failed = "Failed";
          this.FetchAdditionDeductions();
        }   
    })
  }

  onBackButtonClick() {
    const navigationExtras: NavigationExtras = {
      queryParams: { tab: 'tab2' },
      replaceUrl: true // Replaces the current entry in the history stack
    };

    this.router.navigate(['/ResignationApprovalHR'], navigationExtras);
  }

}
