import { Component, OnInit } from '@angular/core';
import { ApiCallService } from 'src/app/api-call.service';
import { LoginService } from 'src/app/login.service';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-offer-details',
  templateUrl: './offer-details.component.html',
  styleUrls: ['./offer-details.component.scss']
})
export class OfferDetailsComponent implements OnInit {

  userSession:any = this.session.getUserSession();
  empcode: any=this.userSession.empcode;
  level: any=this.userSession.level;
  authorityflg:any =this.userSession.authorityflg;
  grpname:any=this.userSession.grpname; 
  desig:any=this.userSession.desig.split('#', 2);   
  desigid:any= this.desig[0]; 

  OfferDetailsForm: FormGroup;
  SalaryDetailsForm:FormGroup;
  WorkSchedule: any;
  amount:any;
  allowanceId:any;
  listshift: any;
  AirTicketEligibility: any;
  SalaryComponent: any;
  OfferDtls: any=[];
  CandidateId: any;
  SalaryDtls: any=[];
  isEditing: boolean=false;
  showModal: any;
  failed: any;
  success:any;
  Sourcetype: any;
  listgrade: any;


  constructor(private apicall:ApiCallService,private session:LoginService,private fb: FormBuilder,private route: ActivatedRoute,private router: Router) {
    this.OfferDetailsForm = this.fb.group({
      passportNo: ['', Validators.required],
      mobileNo: ['', Validators.required, ],
      address: ['', Validators.required],      
      total: [''],
      Accommodation: [false],
      Transportation: [false],
      OvertimeEligible: [false],
      MedicalInsurance: [false],
      LifeInsurance: [false],
      FamilyInsurance: [false],
      FamilyAirticket: [false],
      FamilyVisa: [false],
      shift: ['', Validators.required],
      grade: [null, Validators.required],
      work_schedule: ['', Validators.required],
      AirTicketEligibility: [null, Validators.required],
      ProbationPeriod: ['', Validators.required],
      NoticePeriod: ['', Validators.required],
      Non_CompeteClause: [false],
    });
    this.SalaryDetailsForm = this.fb.group({
      allowanceId: ['', Validators.required],
      amount: ['', Validators.required ]      
    });
   }

  ngOnInit(): void {
    
    this.route.queryParams
      .subscribe(params => {
         this.CandidateId = params['CandidateId']; 
         this.Sourcetype = params['Sourcetype'];      
      }
    );   
    
     //Work Schedule
     this.apicall.listCompany(9).subscribe((res)=>{
      this.WorkSchedule=res;
    })
    //Shift Timings
    this.apicall.listshift().subscribe((res)=>{
      this.listshift=res;
    })
    //Grade
    this.apicall.listCompany(8).subscribe((res)=>{
      this.listgrade=res;
    })
    //Air Ticket Eligibility
    this.apicall.listCompany(36).subscribe((res)=>{
      this.AirTicketEligibility=res;
    })
    //Salary Component
    this.apicall.listCompany(44).subscribe((res)=>{
      this.SalaryComponent=res;
    })
    this.Fetch_CandidateOfferDtls();
    this.Fetch_hiring_salarydtl();
  }
  calculateTotal(): any {
    if (!this.SalaryDtls) {
        return 0; // Return 0 if SalaryDtls is not initialized or empty
    }

    return this.SalaryDtls.reduce((acc: any, item: { AMOUNT: any; }) => acc + item.AMOUNT, 0);
}
  Fetch_CandidateOfferDtls() {
    this.apicall.Fetch_CandidateOfferDtls(this.CandidateId).subscribe((res) => {
      this.OfferDtls = res;      
      this.OfferDetailsForm.patchValue({
        passportNo: this.OfferDtls[0].PASSPORT_NO,
        mobileNo: this.OfferDtls[0].MOBILE_NO,
        address: this.OfferDtls[0].CANDIDATE_ADDRESS,
        total: this.calculateTotal(), 
        Accommodation: this.OfferDtls[0].ACCOMMODATION,
        Transportation: this.OfferDtls[0].TRANSPORTATION,
        OvertimeEligible: this.OfferDtls[0].OVERTIME,
        MedicalInsurance: this.OfferDtls[0].MEDICAL_INSURANCE,
        LifeInsurance: this.OfferDtls[0].LIFE_INSURANCE,
        FamilyInsurance: this.OfferDtls[0].FAMILY_INSURANCE,
        FamilyAirticket: this.OfferDtls[0].FAMILY_AIRTICKET,
        FamilyVisa: this.OfferDtls[0].VISA_WORK_PERMIT,
        shift: this.OfferDtls[0].WORKINGTIME, 
        work_schedule: this.OfferDtls[0].WORKINGDAYS,
        grade: this.OfferDtls[0].GRADE,
        AirTicketEligibility: this.OfferDtls[0].AIRTICKET_ELIGIBILITY,
        ProbationPeriod: this.OfferDtls[0].PROBATION_PERIOD,
        NoticePeriod: this.OfferDtls[0].NOTICE_PERIOD,
        Non_CompeteClause: this.OfferDtls[0].NC_CLAUSE,
      });
      console.log(JSON.stringify(this.OfferDtls));
    });
  }  
  Fetch_hiring_salarydtl(){
    this.apicall.Fetch_hiring_salarydtl(this.CandidateId).subscribe((res)=>{
      this.SalaryDtls=res;
      console.log(JSON.stringify(res))
    })
  }
  GenerateOfferLetter(){
    if (this.OfferDetailsForm.valid) { 
      if(this.calculateTotal()==0)  {       
        (<HTMLInputElement>document.getElementById("openModalButton")).click();
        this.showModal = 2; 
        this.failed = "Basic pay is mandatory!";         
      }
      else{   
      const data={
        candidateId:this.CandidateId,
        updated_by:this.empcode
      };
      this.apicall.GenerateOfferLetter(data).subscribe((res)=>{
        //alert(JSON.stringify(res)); 
      });
      if(this.Sourcetype==0){
      this.router.navigate(['/Offer_Letter_Int'], { queryParams: {CandidateId:this.CandidateId } }); 
      }else{
        this.router.navigate(['/Offer_Letter_Exe'], { queryParams: {CandidateId:this.CandidateId } }); 
     //   this.router.navigate(['/take_assessment'], { queryParams: { Id: TrainingId } });
      } 
    }    
    } else{   
      this.markFormGroupTouched(this.OfferDetailsForm);
    }
  }
  SaveOfferDetails(){
    const data = {
      candidateId: this.CandidateId,
      updated_by: this.empcode,
      passportNo: this.OfferDetailsForm.get('passportNo')?.value,
      mobileNo: this.OfferDetailsForm.get('mobileNo')?.value,
      address: this.OfferDetailsForm.get('address')?.value,
      total: this.OfferDetailsForm.get('total')?.value,
      Accommodation: this.OfferDetailsForm.get('Accommodation')?.value ?? false,
      Transportation: this.OfferDetailsForm.get('Transportation')?.value ?? false,
      OvertimeEligible: this.OfferDetailsForm.get('OvertimeEligible')?.value ?? false,
      MedicalInsurance: this.OfferDetailsForm.get('MedicalInsurance')?.value ?? false,
      LifeInsurance: this.OfferDetailsForm.get('LifeInsurance')?.value ?? false,
      FamilyInsurance: this.OfferDetailsForm.get('FamilyInsurance')?.value ?? false,
      FamilyAirticket: this.OfferDetailsForm.get('FamilyAirticket')?.value ?? false,
      FamilyVisa: this.OfferDetailsForm.get('FamilyVisa')?.value ?? false,
      shift: this.OfferDetailsForm.get('shift')?.value,
      grade: this.OfferDetailsForm.get('grade')?.value,
      work_schedule: this.OfferDetailsForm.get('work_schedule')?.value,
      AirTicketEligibility: this.OfferDetailsForm.get('AirTicketEligibility')?.value,
      ProbationPeriod: this.OfferDetailsForm.get('ProbationPeriod')?.value,
      NoticePeriod: this.OfferDetailsForm.get('NoticePeriod')?.value,
      Non_CompeteClause: this.OfferDetailsForm.get('Non_CompeteClause')?.value ?? false,
    };
  //alert(JSON.stringify(data));
   this.apicall.AddCandidateOfferDetails(data).subscribe((res) => {
    //alert(JSON.stringify(res));
    if(res.Errorid==1){
      (<HTMLInputElement>document.getElementById("openModalButton")).click();
      this.showModal = 1;
      this.success = "Offer Details saved successfully!";
    }
    else{
      (<HTMLInputElement>document.getElementById("openModalButton")).click();
      this.showModal = 2;
      this.failed = "Failed!";
    }
    this.Fetch_CandidateOfferDtls();           
    }); 
  }
  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  } 

  SubmitSalaryDtls(){
    if (this.SalaryDetailsForm.valid) {
      const allowanceIds = this.SalaryDtls.map((item: { ALLOWANCE_ID: any; }) => item.ALLOWANCE_ID);      
      const allowanceId = Number(this.SalaryDetailsForm.get('allowanceId')?.value); 
      const Componentexists=allowanceIds.includes(allowanceId);      
      if(Componentexists)  {       
        (<HTMLInputElement>document.getElementById("openModalButton")).click();
        this.showModal = 2; 
        this.failed = "Component already exists!";
        this.clearSalaryDetailsForm(); 
      }
      else{   
      const data={
        candidateId: this.CandidateId,
        ...this.SalaryDetailsForm.value,
        actionFlag:1,
        updated_by:this.empcode            
      };
     console.log(JSON.stringify(data));
     this.apicall.AddSalaryDtlsOfferLetter(data).subscribe((res) => {
      //alert(JSON.stringify(res));
      this.Fetch_hiring_salarydtl();
       this.clearSalaryDetailsForm();       
      });
    }
    } else{   
      this.markFormGroupTouched(this.SalaryDetailsForm);
    }  
  }
  clearSalaryDetailsForm(){   
    this.SalaryDetailsForm.reset();
    this.SalaryDetailsForm.get('allowanceId')?.setValue("");
  }
  Edit(item: any): void {       
    this.SalaryDtls.forEach((data: {
      ALLOWANCE_ID: any;
      amount: any;          
      isEditing: boolean; 
      }) => {
      data.amount = (data.ALLOWANCE_ID === item.ALLOWANCE_ID) ? item.AMOUNT : '';         
      data.isEditing = (data.ALLOWANCE_ID === item.ALLOWANCE_ID);
      console.log(JSON.stringify(this.SalaryDtls))
    });
 }
  EditDeleteSalaryDtls(allowanceId:any,amount:any,actionFlag:any){  
    if(!amount)  {       
      (<HTMLInputElement>document.getElementById("openModalButton")).click();
      this.showModal = 2; 
      this.failed = "Please enter amount!";
    }
    else{   
      const data={
        candidateId: this.CandidateId,
        allowanceId:allowanceId,
        amount:amount,
        actionFlag:actionFlag,
        updated_by:this.empcode            
      };
     console.log(JSON.stringify(data));
     this.apicall.AddSalaryDtlsOfferLetter(data).subscribe((res) => {
      console.log(JSON.stringify(res));
      this.Fetch_hiring_salarydtl();        
      }); 
      this.isEditing = false;  
    } 
  }
  CancelEdit(item: any) {   
    item.amount = item.AMOUNT;      
    item.isEditing = false;
  }
}
