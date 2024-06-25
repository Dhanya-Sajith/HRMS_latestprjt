import { Component, OnInit } from '@angular/core';
import { ApiCallService } from 'src/app/api-call.service';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/login.service';
import { JsonPipe, formatDate,DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-bonusallowance',
  templateUrl: './bonusallowance.component.html',
  styleUrls: ['./bonusallowance.component.scss']
})
export class BonusAllowanceComponent implements OnInit {
  userSession:any = this.session.getUserSession();
  empcode: any=this.userSession.empcode;
  authorityflg:any =this.userSession.authorityflg; 
  name:any=this.userSession.name; 
  bonusForm: FormGroup; 
  bulkForm: FormGroup; 

  user: any='individual'; 
  companydata: any;
  deptdata: any;
  empdata: any;
  comp_typeid:any=12; 
  dept_typeid: any = 1;
  selectedDept: any=-1;
  selectedCompanyid: any=-1;
  selectedEmp: any=-1;
  selectedEmpCode: any;  
  desig: any;
  empName: any;
  paymentmodeid:any=47;
  payoutdata: any;
  selectedPayoutMode: any;
  isFormValid: boolean=false;
  payout_month!: string;
  payout_year!: string;
  showModal!: number;
  failed!: string;
  success!: string;
  defaultPayoutMonth!: string;
  date!: string;
  nextmonth!: string | null;
  defaultcurrentMonth!: string;
  payoutmodeControl: any;

  constructor(private session:LoginService,private apicall:ApiCallService,private route:Router,private fb: FormBuilder,private datePipe: DatePipe) { 
    this.bonusForm = this.fb.group({
      amount: ['', Validators.required],
      payoutMode: ['', Validators.required],     
      payoutMonth: ['', Validators.required],
      remarks: ['', Validators.required]
    });
    this.bulkForm = this.fb.group({
      doc: ['', Validators.required],
      payoutmode: ['', Validators.required],     
      payoutmonth: ['', Validators.required]
     
    });
  }

  ngOnInit(): void {
     //company combo box
     this.apicall.FetchCompanyList(this.empcode).subscribe((res)=>{
      this.companydata=res;
    });
    //Department combo box
    this.apicall.listDepartment(this.dept_typeid).subscribe((res) => {
      this.deptdata=res;     
    }); 
    //Employee combo box
    this.apicall.listEmployee(this.selectedDept,this.selectedCompanyid).subscribe((res) => {
      this.empdata=res;    
    });
    //Payout mode combo box
    this.apicall.listCompany(this.paymentmodeid).subscribe((res) => {
      this.payoutdata=res;     
    });
    //Next month to fill payout month 
    const nextMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1);
    const year = nextMonth.getFullYear();
    const month = (nextMonth.getMonth() + 1).toString().padStart(2, '0');
    this.defaultPayoutMonth = `${year}-${month}`;
    this.bonusForm.get('payoutMonth')?.setValue(this.defaultPayoutMonth);
    this.bulkForm.get('payoutmonth')?.setValue(this.defaultPayoutMonth);
    
  }
  radioselection(user:any){
    this.user=user;

  }
  onCompanySelected(selectedCompanyid: any) { 
    this.selectedCompanyid=selectedCompanyid;  
    //alert(this.selectedCompanyid)   
    this.apicall.DepartmentCombo_CompanyWise(selectedCompanyid).subscribe((res) => {
      this.deptdata=res;     
    }); 
   
    this.apicall.listEmployee(this.selectedDept,this.selectedCompanyid).subscribe((res) => {
      this.empdata=res;    
    });
    
   }
   onDeptSelected(selectedDept:any){ 
    this.selectedDept = selectedDept; 
    this.apicall.EmployeefilterComboData(selectedDept,this.selectedCompanyid).subscribe((res) => {
      this.empdata=res;    
      });
      
   }
   onEmpSelected(selectedEmp:any){
     this.selectedEmpCode = selectedEmp; 
     
     this.apicall.FetchEmployeeDesignationAndDOJ(this.selectedEmpCode).subscribe((res) => {
      this.empName=res[0].EMP_NAME;
      this.desig=res[0].DESIGNATION;    
      });
     
   }
   onPayoutModeSelected(selectedPayoutMode:any){
    this.selectedPayoutMode=selectedPayoutMode;

   }
   validateForm() {
    if(!this.selectedEmpCode){
      (<HTMLInputElement>document.getElementById("openModalButton")).click();
       this.showModal = 2;
       this.failed = "Please select employee!";
     }
      else{
    if (this.bonusForm.valid){
    this.isFormValid = true;
    }
    else{
      this.markFormGroupTouched(this.bonusForm);
      
    }
  }
}
markFormGroupTouched(formGroup: FormGroup) {
  Object.values(formGroup.controls).forEach(control => {
    control.markAsTouched();
  });
}
//Individual
save(){   
  if(!this.selectedEmpCode){
    (<HTMLInputElement>document.getElementById("openModalButton")).click();
     this.showModal = 2;
     this.failed = "Please select employee!";
   }else{   
  if (this.bonusForm.valid) {
    const amountControl = this.bonusForm.get('amount');      
    const payoutModeControl = this.bonusForm.get('payoutMode');
    const payoutMonthControl = this.bonusForm.get('payoutMonth');
    const remarksControl = this.bonusForm.get('remarks');   
    
  if (amountControl && payoutModeControl && payoutMonthControl && remarksControl) {  
    const currentMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const year = currentMonth.getFullYear();
    const month = (currentMonth.getMonth() + 1).toString().padStart(2, '0');
    this.defaultcurrentMonth = `${year}-${month}`;
   
    if (payoutMonthControl.value < this.defaultcurrentMonth) {
     
      (<HTMLInputElement>document.getElementById("openModalButton")).click();
      this.showModal = 2;
      this.failed = "Please select a valid month!";
    } else {
    const payout_monthValue: string = payoutMonthControl.value;
    this.payout_month = payout_monthValue.split('-')[1]; 
    this.payout_year = payout_monthValue.split('-')[0]; 

    const data = {
    emp_code: this.selectedEmpCode,
    bonus_amount: amountControl.value,
    payment_mode: payoutModeControl.value,
    payout_month:this.payout_month,
    payout_year:this.payout_year,
    remarks:remarksControl.value,
    updated_by:this.empcode   
    };
   //alert(JSON.stringify(data))
   this.apicall.SaveBonusAllowance(data).subscribe((res) => {  
    //alert(JSON.stringify(res))  
    if(res.Errorid==1){
      (<HTMLInputElement>document.getElementById("openModalButton")).click();
      this.showModal = 1;
      this.success='Saved successfully!';
     
    }
    else{
        (<HTMLInputElement>document.getElementById("openModalButton")).click();
        this.showModal = 2; 
        this.failed='Failed!';     
    } 
        this.cancel();
      });
}
} else {    
  this.markFormGroupTouched(this.bonusForm);   
}
   }
  }
}

cancel(){
  this.bonusForm.reset();   
  this.bonusForm.get('payoutMode')?.setValue("");
  this.bonusForm.get('payoutMonth')?.setValue(this.defaultPayoutMonth);    
}

//Bulk Upload
upload()
{
  if (this.bulkForm.valid) {
     let input:any;  
     input=document.getElementById("formFile");
     const fdata = new FormData();
     this.onFileSelect(input);
  }
  else{
    this.markFormGroupTouched(this.bulkForm); 
  }
}
onFileSelect(input:any) {
  if (this.bulkForm.valid) {
   if (input.files && input.files[0]) {
     
    const fdata = new FormData();
   
    fdata.append('filesup',input.files[0]);
   
      const docControl = this.bulkForm.get('doc');      
      const payoutmodeControl = this.bulkForm.get('payoutmode');
      const payoutmonthControl = this.bulkForm.get('payoutmonth');
        
    if (docControl && payoutmodeControl && payoutmonthControl) {  
      const currentMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
      const year = currentMonth.getFullYear();
      const month = (currentMonth.getMonth() + 1).toString().padStart(2, '0');
      this.defaultcurrentMonth = `${year}-${month}`;      
      
      if (payoutmonthControl.value < this.defaultcurrentMonth) {
       
        (<HTMLInputElement>document.getElementById("openModalButton")).click();
        this.showModal = 2;
        this.failed = "Please select a valid month!";
      } else {
      const payout_monthValue: string = payoutmonthControl.value;
      this.payout_month = payout_monthValue.split('-')[1]; 
      this.payout_year = payout_monthValue.split('-')[0]; 
  
    
    this.apicall.UploadBonus(fdata,this.payout_month,this.payout_year,payoutmodeControl.value,this.empcode).subscribe((res)=>{    
    
      if(res==1)
      { 
        (<HTMLInputElement>document.getElementById("openModalButton")).click();
        this.showModal = 1;
        this.success = "Document uploaded successfully!";
      }
      else if(res==0)
      { 
        (<HTMLInputElement>document.getElementById("openModalButton")).click();
        this.showModal = 2;       
        this.failed = "Document uploading failed!";
      }
      this.clearBulk();
    });
  }
}
    }

  }
  else{
    this.markFormGroupTouched(this.bulkForm); 
  }
}
validateBulkForm() {  
  if (this.bulkForm.valid) {
    this.isFormValid = true;
  } else {
    this.markFormGroupTouched(this.bulkForm); 
       
  }
}

download_to_excel(){
  let fileurl=this.apicall.SalaryRevisionTemplate('B');
  let link = document.createElement("a");
    
     if (link.download !== undefined) {
        link.setAttribute("href", fileurl);
        link.setAttribute("download", "ReportFile.xlsx");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
     }
}



clearBulk(){
  this.bulkForm.reset();   
  this.bulkForm.get('payoutmode')?.setValue("");
  this.bulkForm.get('payoutmonth')?.setValue(this.defaultPayoutMonth);    
}
}

