import { Component, OnInit } from '@angular/core';
import { ApiCallService } from 'src/app/api-call.service';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/login.service';
import { DatePipe } from '@angular/common';
import { FormControl,FormBuilder } from '@angular/forms';
declare var $ :any;

@Component({
  selector: 'app-additions-ndeductions',
  templateUrl: './additions-ndeductions.component.html',
  styleUrls: ['./additions-ndeductions.component.scss']
})
export class AdditionsNdeductionsComponent implements OnInit {

  showModal: any;
  success: any;
  failed: any;
  onetimeadditiondata: any;
  isEditing: boolean=false;
  item: any;
  onetimedeductiondata: any;
  payroll_operation: any;
  monthlist: any;  
  
userSession:any = this.session.getUserSession();  
empcode: any=this.userSession.empcode;
empid:any =this.userSession.id; 
  addtimes: any='addOnetime';
  dedtimes:any='dedOnetime';
  companydata: any;
  deptdata: any;
  empdata: any;
  selectedDeptAddOnetime: any = -1;
  selectedCompanyidAddOnetime: any = -1;
  selectedEmpAddOnetime: any=-1;
  selectedcompanyAddRepeated: any=-1;
  selectedDeptAddRepeated: any=-1;
  companydataAddRepeated: any;
  companydataDedOnetime: any;
  companydataDedRepeated: any;
  deptdataAddRepeated: any;
  deptdataDedOnetime: any;
  deptdataDedRepeated: any;
  empdataAddRepeated: any;
  empdataDedOnetime: any;
  empdataDedRepeated: any;
  selectedcompanyDedOnetime: any=-1;
  selectedEmpAddRepeated: any=-1;
  selectedDeptDedOnetime: any=-1;
  selectedEmpDedOnetime: any=-1;
  selectedcompanyDedRepeated: any=-1;
  selectedDeptDedRepeated: any=-1;
  selectedEmpDedRepeated: any=-1;
  addtypeOnetime: any;
  addtypeRepeated: any;
  dedtypeOnetime: any;
  dedtypeRepeated: any;
  selectedaddtypeOnetime: any=-1;
  selectedaddtypeRepeated: any=-1;
  selecteddedtypeRepeated: any=-1;
  selecteddedtypeOnetime: any=-1;
  defaultPayoutMonth: any;
  PayrollMonthAddOnetime:any; 
  PayrollMonthDedOnetime:any;
  PayrollAmountAddOnetime=new FormControl();
  OthersAddOnetime=new FormControl(null);
  PayrollAmountDedOnetime=new FormControl();
  OthersDedOnetime=new FormControl(null);
  PayrollAmountAddRepeated=new FormControl(); 
  EffectivePeriodStartAddRepeated=new FormControl();
  EffectivePeriodEndAddRepeated=new FormControl();
  OthersAddRepeated=new FormControl();
  EffectivePeriodStartDedRepeated=new FormControl();
  EffectivePeriodEndDedRepeated=new FormControl();
  PayrollAmountDedRepeated=new FormControl();
  OthersDedRepeated=new FormControl();
  repeatedadditiondata: any;
  repeateddeductiondata: any;  
  curDate:any;
  searchInput: string='';
  itemsPerPage=10;
  currentPage=1;
  currentPageAddRepeated=1;
  currentPageDedOnetime=1;
  currentPageDedRepeated=1;
  multiselect: any;
  selectedOptions: any;
  selectedmonthaddition: any;
  selectedmonthdeduction: any;
  payrollmonthSelect:any='Select';
  lastpayrollDate: any;
  value_type: any =3;
  NextPayrollMonth: any;
  NextPayrollDate: any;
  Value_type: any = 9;
  cut_off_date: any;
  effectiveperiodEnd: any;
  formattedlastPayrollDay: any;
  effectiveperiodEndDay: any;
  effectiveperiodStart: any;
  effectiveperiodStartDay: any;
  effectivedate: any;
  desiredPage: any;
  currentDate:any=new Date();    
  year = this.currentDate.getFullYear();
  month = String(this.currentDate.getMonth() + 1).padStart(2, '0'); 
  PayrollMonthAdditionOnetime: any=`${this.year}-${this.month}`;
  PayrollMonthDeductionOnetime: any=`${this.year}-${this.month}`;
  
  

  constructor(private session:LoginService,private apicall:ApiCallService,private route:Router,private fb: FormBuilder,private datepipe:DatePipe) {} 
  
  ngOnInit(): void {
    
    //company combo box
    this.apicall.FetchCompanyList(this.empcode).subscribe((res) => {
      this.companydata=res;
      this.companydataAddRepeated=res;
      this.companydataDedOnetime=res;
      this.companydataDedRepeated=res;
    });     
    
    //Addition type drop down
    this.apicall.listCompany(48).subscribe((res) => {
      this.addtypeOnetime=res;     
      this.addtypeRepeated=res;      
    });
     //Deduction type drop down
     this.apicall.listCompany(49).subscribe((res) => {
      this.dedtypeOnetime=res;     
      this.dedtypeRepeated=res;      
    });       
    
    this.fetchOnetimeAddition();  
    this.fetchOnetimeDeduction();
   //All months
    this.apicall.DisplayAllMonths().subscribe((res) => {
      this.monthlist=res;            
    });
    this.curDate=new Date(); 
    this.EffectivePeriodEndAddRepeated.setValue('');
    this.EffectivePeriodEndDedRepeated.setValue('');
    
  }
  isButtonDisabled(item: any): boolean {      
  this.formattedlastPayrollDay = this.datepipe.transform(item.LAST_PAYROLL_DATE, 'dd');  
  if(item.PAYROLL_MONTHS){  
  this.effectivedate = new Date(item.PAYROLL_MONTHS); 
  }
  this.effectivedate.setDate(parseInt(this.formattedlastPayrollDay));  
  if (this.effectivedate && this.effectivedate<this.curDate) {    
    return true;
  } else {   
   return false;
  }   
  } 
  isButtonDisabledRepeated(item: any): boolean {  
  
  this.formattedlastPayrollDay = this.datepipe.transform(item.LAST_PAYROLL_DATE, 'dd');
  if(item.EFFECTIVE_PERIOD){
  this.effectiveperiodEnd=item.EFFECTIVE_PERIOD.split('-',2);  
  this.effectiveperiodEndDay=this.effectiveperiodEnd[1];
  }
  let endDate = new Date(this.effectiveperiodEndDay);  
    endDate.setDate(parseInt(this.formattedlastPayrollDay));
  if (endDate && endDate<this.curDate) {    
    return true;
  } else {   
   return false;
  }   
  } 
  showAdditions(addtimes:any) {
    this.addtimes = addtimes;  
    if (this.addtimes === 'addOnetime') {    
      this.fetchOnetimeAddition();  
      this.desiredPage=''; 
      this.currentPage=1;  
           
    } else {     
      this.fetchRepeatedAddition();   
      this.desiredPage=''; 
      this.currentPage=1;    
    }   
    }
    showDeductions(dedtimes: any) {
      this.dedtimes = dedtimes;      
      if (this.dedtimes == 'dedOnetime') {   
       this.fetchOnetimeDeduction();  
       this.desiredPage=''; 
      this.currentPage=1;                   
      } else {       
       
        this.fetchRepeatedDeduction();
        this.desiredPage=''; 
        this.currentPage=1;  
      }   
      }
      getNextPayrollMonth(lastpayrollDate:any){
      // Add one month to the current date
      lastpayrollDate.setMonth(lastpayrollDate.getMonth() + 1);    
      const year = lastpayrollDate.getFullYear();
      const month = (lastpayrollDate.getMonth() + 1).toString().padStart(2, '0');
      this.NextPayrollMonth = `${year}-${month}`;     
      }
      onCompanySelectedAddOnetime() {        
        this.apicall.FetchDepartmentList(this.selectedCompanyidAddOnetime,this.empcode).subscribe((res) => {
          this.deptdata=res;     
        });    
        this.apicall.displayGeneralData(this.selectedCompanyidAddOnetime,this.value_type).subscribe((res) => {        
          
          this.lastpayrollDate = new Date(res[0].DATA_VALUE);          
          this.getNextPayrollMonth(this.lastpayrollDate);
          this.PayrollMonthAddOnetime=this.NextPayrollMonth ;       
            
        });          
        
       }
       onDeptSelectedAddOnetime(){       
        this.apicall.FetchEmployeeList(this.selectedDeptAddOnetime,this.selectedCompanyidAddOnetime,this.empcode).subscribe((res) => {
          this.empdata=res;    
          });     
            
       }         
       
      onCompanySelectedAddRepeated() {        
        this.apicall.FetchDepartmentList(this.selectedcompanyAddRepeated,this.empcode).subscribe((res) => {
          this.deptdataAddRepeated=res;     
        });  
        this.apicall.displayGeneralData(this.selectedcompanyAddRepeated,this.value_type).subscribe((res) => {        
          
          this.lastpayrollDate = new Date(res[0].DATA_VALUE);          
          this.getNextPayrollMonth(this.lastpayrollDate);
          this.EffectivePeriodStartAddRepeated.setValue(this.NextPayrollMonth);       
            
        });
        
        // this.apicall.displayGeneralData(this.selectedcompanyAddRepeated,this.Value_type).subscribe((res) => {       
          
        //   this.cut_off_date = new Date(res[0].DATA_VALUE); 
        //   alert(this.cut_off_date)       
          
        // });        
      }
      onDeptSelectedAddRepeated() {         
        this.apicall.FetchEmployeeList(this.selectedDeptAddRepeated,this.selectedcompanyAddRepeated,this.empcode).subscribe((res) => {
          this.empdataAddRepeated=res;    
          });
          
      }     
      onCompanySelectedDedOnetime() {        
        this.apicall.FetchDepartmentList(this.selectedcompanyDedOnetime,this.empcode).subscribe((res) => {
          this.deptdataDedOnetime=res;     
        });
        this.apicall.displayGeneralData(this.selectedcompanyDedOnetime,this.value_type).subscribe((res) => {         
          
          this.lastpayrollDate = new Date(res[0].DATA_VALUE);          
          this.getNextPayrollMonth(this.lastpayrollDate);
          this.PayrollMonthDedOnetime=this.NextPayrollMonth ;        
            
        });   
             
      }
      onDeptSelectedDedOnetime() {        
        this.apicall.FetchEmployeeList(this.selectedDeptDedOnetime,this.selectedcompanyDedOnetime,this.empcode).subscribe((res) => {
          this.empdataDedOnetime=res;    
          });           
      }     
      onCompanySelectedDedRepeated() {        
        this.apicall.FetchDepartmentList(this.selectedcompanyDedRepeated,this.empcode).subscribe((res) => {
          this.deptdataDedRepeated=res;     
        });
        this.apicall.displayGeneralData(this.selectedcompanyDedRepeated,this.value_type).subscribe((res) => {        
          
          this.lastpayrollDate = new Date(res[0].DATA_VALUE);          
          this.getNextPayrollMonth(this.lastpayrollDate);
          this.EffectivePeriodStartDedRepeated.setValue(this.NextPayrollMonth);       
            
        });  
             
      }
      onDeptSelectedDedRepeated() {        
        this.apicall.FetchEmployeeList(this.selectedDeptDedRepeated,this.selectedcompanyDedRepeated,this.empcode).subscribe((res) => {
          this.empdataDedRepeated=res;    
          });          
      }    
      
      //Insertion
      addOnetimeSave(){ 
        if(this.selectedCompanyidAddOnetime==-1||this.selectedDeptAddOnetime==-1||this.selectedEmpAddOnetime==-1||this.selectedaddtypeOnetime==-1||!this.PayrollAmountAddOnetime.value||(this.selectedaddtypeOnetime==0 && !this.OthersAddOnetime.value)){
          (<HTMLInputElement>document.getElementById("openModalButton")).click();
          this.showModal = 2;
          this.failed = "Please fill in all fields!";
        }          
        else if(this.PayrollMonthAddOnetime<this.NextPayrollMonth){  
          (<HTMLInputElement>document.getElementById("openModalButton")).click();
          this.showModal = 2;
          this.failed = "Please select a valid date!";
        }else{     
        const payrollmonth=this.PayrollMonthAddOnetime.split("-",2);         
        const data={
          empcode:this.selectedEmpAddOnetime,
          updatedby:this.empcode,
          amount:this.PayrollAmountAddOnetime.value,
          payment_category:this.selectedaddtypeOnetime,
          payroll_month:payrollmonth[1],
          payroll_year:payrollmonth[0],
          payroll_operation:1,
          add_Ded_type:this.OthersAddOnetime.value,
          eFlag:1,
          addDedId:null
        };
        console.log(JSON.stringify(data))
        this.apicall.SaveAdditionDeduction_OneTime(data).subscribe((res) => {          
          if(res.Errorid==1){
            (<HTMLInputElement>document.getElementById("openModalButton")).click();
            this.showModal = 1;
            this.success = "Addition added successfully!";
          }
          else{
            (<HTMLInputElement>document.getElementById("openModalButton")).click();
            this.showModal = 2;
            this.failed = "Failed!";
          }
          this.fetchOnetimeAddition();
          this.clearAddOnetime(); 
          this.apicall.listCompany(48).subscribe((res) => {
          this.addtypeOnetime=res;  
         });     
          
        });
      }        
      }
      fetchOnetimeAddition(){
        const payrollmonth=this.PayrollMonthAdditionOnetime.split("-",2);
        this.apicall.FetchAdditionDeduction(1,0,this.empcode,payrollmonth[1],payrollmonth[0]).subscribe((res) => {
          this.onetimeadditiondata=res;
        });
         
      }       
      clearAddOnetime(){
        this.selectedCompanyidAddOnetime=-1;
        this.selectedDeptAddOnetime=-1;
        this.selectedEmpAddOnetime=-1;
        this.selectedaddtypeOnetime=-1;
        this.PayrollAmountAddOnetime.setValue('');
        this.PayrollMonthAddOnetime='';
        this.OthersAddOnetime.setValue(null);
      }   
      EditAddOnetime(item: any): void {       
        this.onetimeadditiondata.forEach((data: {
          ADD_DED_ID: any;
          amountAddOnetime: any;          
          isEditing: boolean; 
          }) => {
          data.amountAddOnetime = (data.ADD_DED_ID === item.ADD_DED_ID) ? item.AMOUNT : '';         
          data.isEditing = (data.ADD_DED_ID === item.ADD_DED_ID);
        });
     }
     //Edit
     saveAddOnetime(item:any): void { 
      if(!item.amountAddOnetime)  {
        (<HTMLInputElement>document.getElementById("openModalButton")).click();
        this.showModal = 2; 
        this.failed = "Please enter amount!";
      }
      else{            
       const updateData={
        empcode:item.EMP_CODE,
        updatedby:this.empcode,
        amount:item.amountAddOnetime,
        payment_category:0,
        payroll_month:0,
        payroll_year:0,
        payroll_operation:1,
        add_Ded_type:null,
        eFlag:2,
        addDedId:item.ADD_DED_ID,   
       };
       console.log(JSON.stringify(updateData));
       this.apicall.SaveAdditionDeduction_OneTime(updateData).subscribe(res => {
         //alert(JSON.stringify(res)); 
         if(res.Errorid==1){
          (<HTMLInputElement>document.getElementById("openModalButton")).click();
          this.showModal = 1; 
          this.success='Changes saved Successfully!';          
        }
        else {
          (<HTMLInputElement>document.getElementById("openModalButton")).click();
          this.showModal = 2; 
          this.failed='Failed!';      
        }       
        this.fetchOnetimeAddition();     
       });      
        this.isEditing = false; 
      } 
     }
     CancelAddOnetime(item: any) {
      //alert(JSON.stringify(item))
      item.amountAddOnetime = item.AMOUNT;      
      item.isEditing = false;
    }
    selecteditem(item:any){
      this.item=item;    
    }
    DeleteOnetime(item:any){ 
      if(this.addtimes === 'addOnetime'){
        this.payroll_operation=1;
      }else if(this.dedtimes == 'dedOnetime') {
        this.payroll_operation=2;
      }    
       const updateData={
        empcode:item.EMP_CODE,
        updatedby:this.empcode,
        amount:0,
        payment_category:0,
        payroll_month:0,
        payroll_year:0,
        payroll_operation:this.payroll_operation,
        add_Ded_type:null,
        eFlag:3,
        addDedId:item.ADD_DED_ID,     
       };
       console.log(JSON.stringify(updateData));
       this.apicall.SaveAdditionDeduction_OneTime(updateData).subscribe(res => {
        //alert(JSON.stringify(res)); 
        if(res.Errorid==1){
         (<HTMLInputElement>document.getElementById("openModalButton")).click();
         this.showModal = 1; 
         this.success='Deleted Successfully!';          
       }
       else if(res.Errorid==0){
         (<HTMLInputElement>document.getElementById("openModalButton")).click();
         this.showModal = 2; 
         this.failed='Failed!';      
       }     
       this.fetchOnetimeAddition(); 
       this.fetchOnetimeDeduction(); 
      }); 
      
    } 
    //Deduction Onetime
    fetchOnetimeDeduction(){
      const payrollmonth=this.PayrollMonthDeductionOnetime.split("-",2);
      this.apicall.FetchAdditionDeduction(2,0,this.empcode,payrollmonth[1],payrollmonth[0]).subscribe((res) => {
        this.onetimedeductiondata=res;   
        //alert(JSON.stringify(res))           
        });
    }  
    //Insertion
    dedOnetimeSave(){      
      if(this.selectedcompanyDedOnetime==-1||this.selectedDeptDedOnetime==-1||this.selectedEmpDedOnetime==-1||this.selecteddedtypeOnetime==-1||!this.PayrollAmountDedOnetime.value||(this.selecteddedtypeOnetime==0 && !this.OthersDedOnetime.value)){
        (<HTMLInputElement>document.getElementById("openModalButton")).click();
        this.showModal = 2;
        this.failed = "Please fill in all fields!";
      } else if(this.PayrollMonthDedOnetime<this.NextPayrollMonth){  
        (<HTMLInputElement>document.getElementById("openModalButton")).click();
        this.showModal = 2;
        this.failed = "Please select a valid date!";
      }         
      else{       
      const payrollmonth=this.PayrollMonthDedOnetime.split("-",2);        
      const data={
        empcode:this.selectedEmpDedOnetime,
        updatedby:this.empcode,
        amount:this.PayrollAmountDedOnetime.value,
        payment_category:this.selecteddedtypeOnetime,
        payroll_month:payrollmonth[1],
        payroll_year:payrollmonth[0],
        payroll_operation:2,
        add_Ded_type:this.OthersDedOnetime.value,
        eFlag:1,
        addDedId:null
      };
      console.log(JSON.stringify(data))
      this.apicall.SaveAdditionDeduction_OneTime(data).subscribe((res) => {          
        if(res.Errorid==1){
          (<HTMLInputElement>document.getElementById("openModalButton")).click();
          this.showModal = 1;
          this.success = "Deduction added successfully!";
        }
        else{
          (<HTMLInputElement>document.getElementById("openModalButton")).click();
          this.showModal = 2;
          this.failed = "Failed!";
        }
        this.fetchOnetimeDeduction();
         this.clearDedOnetime(); 
         this.apicall.listCompany(49).subscribe((res) => {
          this.dedtypeOnetime=res;             
        });  
      });
    }        
    }
    clearDedOnetime(){
      this.selectedcompanyDedOnetime=-1;
      this.selectedDeptDedOnetime=-1;
      this.selectedEmpDedOnetime=-1;
      this.selecteddedtypeOnetime=-1;
      this.PayrollAmountDedOnetime.setValue('');
      this.PayrollMonthDedOnetime='';
      this.OthersDedOnetime.setValue(null);
    }  
    EditDedOnetime(item: any): void {       
      this.onetimedeductiondata.forEach((data: {
        ADD_DED_ID: any;
        amountDedOnetime: any;          
        isEditing: boolean; 
        }) => {
        data.amountDedOnetime = (data.ADD_DED_ID === item.ADD_DED_ID) ? item.AMOUNT : '';         
        data.isEditing = (data.ADD_DED_ID === item.ADD_DED_ID);
      });
   }
   //Edit
   saveDedOnetime(item:any): void { 
    if(!item.amountDedOnetime)  {
      (<HTMLInputElement>document.getElementById("openModalButton")).click();
      this.showModal = 2; 
      this.failed = "Please enter amount!";
    }
    else{        
     const updateData={
      empcode:item.EMP_CODE,
      updatedby:this.empcode,
      amount:item.amountDedOnetime,
      payment_category:0,
      payroll_month:0,
      payroll_year:0,
      payroll_operation:2,
      add_Ded_type:null,
      eFlag:2,
      addDedId:item.ADD_DED_ID,   
     };
     console.log(JSON.stringify(updateData));
     this.apicall.SaveAdditionDeduction_OneTime(updateData).subscribe(res => {
       //alert(JSON.stringify(res)); 
       if(res.Errorid==1){
        (<HTMLInputElement>document.getElementById("openModalButton")).click();
        this.showModal = 1; 
        this.success='Changes saved Successfully!';          
      }
      else {
        (<HTMLInputElement>document.getElementById("openModalButton")).click();
        this.showModal = 2; 
        this.failed='Failed!';      
      }       
      this.fetchOnetimeDeduction();     
     });      
      this.isEditing = false; 
    } 
   }
   CancelDedOnetime(item: any) {
    //alert(JSON.stringify(item))
    item.amountDedOnetime = item.AMOUNT;      
    item.isEditing = false;
  }
  //Addition Repeated
  fetchRepeatedAddition(){
    this.apicall.FetchAdditionDeduction(1,1,this.empcode,-1,-1).subscribe((res) => {
      this.repeatedadditiondata=res;   
      console.log(JSON.stringify(res))           
      });
  }   
  //Insertion
  addRepeatedSave(){  
   const additionmonth =(<HTMLInputElement>document.getElementById("additionmonth")).value;   
   const EffectivePeriodStartAddRepeated=new Date(this.EffectivePeriodStartAddRepeated.value);
   const EffectivePeriodEndAddRepeated=new Date(this.EffectivePeriodEndAddRepeated.value);
  //  alert(EffectivePeriodEndAddRepeated)
   if(this.selectedcompanyAddRepeated==-1||this.selectedDeptAddRepeated==-1||this.selectedEmpAddRepeated==-1||this.selectedaddtypeRepeated==-1||!this.PayrollAmountAddRepeated.value||(this.selectedaddtypeRepeated==0 && !this.OthersAddRepeated.value)||!this.EffectivePeriodStartAddRepeated.value||additionmonth=='Select'){
      (<HTMLInputElement>document.getElementById("openModalButton")).click();
      this.showModal = 2;
      this.failed = "Please fill in all fields!";      
    }else if(this.EffectivePeriodStartAddRepeated.value<this.NextPayrollMonth){
      (<HTMLInputElement>document.getElementById("openModalButton")).click();
      this.showModal = 2;
      this.failed = "Please select valid date!";
    }
    else if(EffectivePeriodEndAddRepeated && EffectivePeriodStartAddRepeated>EffectivePeriodEndAddRepeated){
      (<HTMLInputElement>document.getElementById("openModalButton")).click();
      this.showModal = 2;
      this.failed = "Please correct the dates!";
    }          
    else{       
    const EffectivePeriodStartAddRepeated=this.EffectivePeriodStartAddRepeated.value.split("-",2);  
    const EffectivePeriodEndAddRepeated=this.EffectivePeriodEndAddRepeated.value.split("-",2);              
    const data={
      empcode:this.selectedEmpAddRepeated,
      updatedby:this.empcode,
      amount:this.PayrollAmountAddRepeated.value,
      payment_category:this.selectedaddtypeRepeated,
      payrollmonths:additionmonth,
      effective_from_month:EffectivePeriodStartAddRepeated[1],
      effective_from_year:EffectivePeriodStartAddRepeated[0],
      effective_to_month:EffectivePeriodEndAddRepeated[1],
      effective_to_year:EffectivePeriodEndAddRepeated[0],
      payroll_operation:1,
      add_Ded_type:this.OthersAddRepeated.value
        
    };
    console.log(JSON.stringify(data))
    this.apicall.SaveAdditionDeduction_Repeated(data).subscribe((res) => {          
      if(res.Errorid==0){
        (<HTMLInputElement>document.getElementById("openModalButton")).click();
        this.showModal = 2;
        this.failed = "Failed!";        
      }
      else {
        (<HTMLInputElement>document.getElementById("openModalButton")).click();
        this.showModal = 1;
        this.success = res.Errormsg;
      }
      this.fetchRepeatedAddition();
       this.clearAddRepeated(); 
       this.apicall.listCompany(48).subscribe((res) => {
        this.addtypeRepeated=res;             
      });  
    });
  }        
  }
  clearAddRepeated(){   
    this.selectedcompanyAddRepeated=-1;
    this.selectedDeptAddRepeated=-1;
    this.selectedEmpAddRepeated=-1;
    this.selectedaddtypeRepeated=-1;
    this.PayrollAmountAddRepeated.setValue('');
    $("input:checkbox").prop("checked", false);    
    this.multiselect = document.getElementById("mySelectLabelAdditions");
    this.multiselect.click();
    var multiselectOption = this.multiselect.getElementsByTagName('option')[0];
    multiselectOption.innerText = "Select";
    this.EffectivePeriodStartAddRepeated.setValue('');
    this.EffectivePeriodEndAddRepeated.setValue('');
    this.OthersAddRepeated.setValue(null);
  }  
  EditAddRepeated(item: any): void {       
    this.repeatedadditiondata.forEach((data: {
      ADD_DED_ID: any;
      amountAddRepeated: any;          
      isEditing: boolean; 
      }) => {
      data.amountAddRepeated = (data.ADD_DED_ID === item.ADD_DED_ID) ? item.AMOUNT : '';         
      data.isEditing = (data.ADD_DED_ID === item.ADD_DED_ID);
    });
 }
 //Edit
 saveAddRepeated(item:any): void { 
  if(!item.amountAddRepeated)  {
    (<HTMLInputElement>document.getElementById("openModalButton")).click();
    this.showModal = 2; 
    this.failed = "Please enter amount!";
  }
  else{           
   const updateData={   
    empcode:item.EMP_CODE,
    updatedby:this.empcode,
    amount:item.amountAddRepeated,   
    eFlag:1,
    addDedId:item.ADD_DED_ID   
   };
   console.log(JSON.stringify(updateData));
   this.apicall.EditAdditionDeduction_Repeated(updateData).subscribe(res => {
     //alert(JSON.stringify(res)); 
     if(res.Errorid==1){
      (<HTMLInputElement>document.getElementById("openModalButton")).click();
      this.showModal = 1; 
      this.success='Changes saved Successfully!';          
    }
    else {
      (<HTMLInputElement>document.getElementById("openModalButton")).click();
      this.showModal = 2; 
      this.failed='Failed!';      
    }       
    this.fetchRepeatedAddition();     
   });      
    this.isEditing = false; 
  } 
 }
 CancelAddRepeated(item: any) {
  //alert(JSON.stringify(item))
  item.amountAddRepeated = item.AMOUNT;      
  item.isEditing = false;
}
DeleteRepeated(item:any){    
   const updateData={
    empcode:item.EMP_CODE,
    updatedby:this.empcode,
    amount:0,    
    eFlag:2,
    addDedId:item.ADD_DED_ID      
   };
   //alert(JSON.stringify(updateData));
   this.apicall.EditAdditionDeduction_Repeated(updateData).subscribe(res => {
    //alert(JSON.stringify(res)); 
    if(res.Errorid==1){
     (<HTMLInputElement>document.getElementById("openModalButton")).click();
     this.showModal = 1; 
     this.success='Deleted Successfully!';          
   }
   else if(res.Errorid==0){
     (<HTMLInputElement>document.getElementById("openModalButton")).click();
     this.showModal = 2; 
     this.failed='Failed!';      
   }     
   this.fetchRepeatedAddition(); 
   this.fetchRepeatedDeduction(); 
  }); 
  
} 
//Deduction Repeated
fetchRepeatedDeduction(){
  this.apicall.FetchAdditionDeduction(2,1,this.empcode,-1,-1).subscribe((res) => {
    this.repeateddeductiondata=res;   
    //alert(JSON.stringify(res))           
    });
} 
//Insertion
dedRepeatedSave(){      
  const monthsded= (<HTMLInputElement>document.getElementById("deductionmonth")).value;   
  const EffectivePeriod_StartDedRepeated=new Date(this.EffectivePeriodStartDedRepeated.value);
   const EffectivePeriod_EndDedRepeated=new Date(this.EffectivePeriodEndDedRepeated.value);
  if(this.selectedcompanyDedRepeated==-1||this.selectedDeptDedRepeated==-1||this.selectedEmpDedRepeated==-1||this.selecteddedtypeRepeated==-1||!this.PayrollAmountDedRepeated.value||(this.selecteddedtypeRepeated==0 && !this.OthersDedRepeated.value)||!this.EffectivePeriodStartDedRepeated.value||monthsded=='Select'){
    (<HTMLInputElement>document.getElementById("openModalButton")).click();
    this.showModal = 2;
    this.failed = "Please fill in all fields!";
  }else if(this.EffectivePeriodStartDedRepeated.value<this.NextPayrollMonth){
    (<HTMLInputElement>document.getElementById("openModalButton")).click();
    this.showModal = 2;
    this.failed = "Please select valid date!";
  }
  else if(EffectivePeriod_EndDedRepeated && EffectivePeriod_StartDedRepeated>EffectivePeriod_EndDedRepeated){
    (<HTMLInputElement>document.getElementById("openModalButton")).click();
    this.showModal = 2;
    this.failed = "Please correct the dates!";
  }                 
  else{       
  const EffectivePeriodStartDedRepeated=this.EffectivePeriodStartDedRepeated.value.split("-",2);  
  const EffectivePeriodEndDedRepeated=this.EffectivePeriodEndDedRepeated.value.split("-",2);              
  const data={
    empcode:this.selectedEmpDedRepeated,
    updatedby:this.empcode,
    amount:this.PayrollAmountDedRepeated.value,
    payment_category:this.selecteddedtypeRepeated,
    payrollmonths:monthsded,
    effective_from_month:EffectivePeriodStartDedRepeated[1],
    effective_from_year:EffectivePeriodStartDedRepeated[0],
    effective_to_month:EffectivePeriodEndDedRepeated[1],
    effective_to_year:EffectivePeriodEndDedRepeated[0],
    payroll_operation:2,
    add_Ded_type:this.OthersDedRepeated.value
    
  };
  console.log(JSON.stringify(data))
  this.apicall.SaveAdditionDeduction_Repeated(data).subscribe((res) => {          
    if(res.Errorid==0){
      (<HTMLInputElement>document.getElementById("openModalButton")).click();
      this.showModal = 2;
      this.failed = "Failed!";        
    }
    else {
      (<HTMLInputElement>document.getElementById("openModalButton")).click();
      this.showModal = 1;
      this.success = res.Errormsg;
    }
    this.fetchRepeatedDeduction();
     this.clearDedRepeated(); 
     this.apicall.listCompany(49).subscribe((res) => {
      this.dedtypeRepeated=res;             
    });  
  });
}        
}
clearDedRepeated(){  
  this.selectedcompanyDedRepeated=-1;
  this.selectedDeptDedRepeated=-1;
  this.selectedEmpDedRepeated=-1;
  this.selecteddedtypeRepeated=-1;
  this.PayrollAmountDedRepeated.setValue('');
  $("input:checkbox").prop("checked", false);    
  this.multiselect = document.getElementById("mySelectLabelDeductions");
  this.multiselect.click();
  var multiselectOption = this.multiselect.getElementsByTagName('option')[0];
  multiselectOption.innerText = "Select";
  this.EffectivePeriodStartDedRepeated.setValue('');
  this.EffectivePeriodEndDedRepeated.setValue('');
  this.OthersDedRepeated.setValue(null);
}  
EditDedRepeated(item: any): void {       
  this.repeateddeductiondata.forEach((data: {
    ADD_DED_ID: any;
    amountDedRepeated: any;          
    isEditing: boolean; 
    }) => {
    data.amountDedRepeated = (data.ADD_DED_ID === item.ADD_DED_ID) ? item.AMOUNT : '';         
    data.isEditing = (data.ADD_DED_ID === item.ADD_DED_ID);
  });
}
//Edit
saveDedRepeated(item:any): void { 
if(!item.amountDedRepeated)  {
  (<HTMLInputElement>document.getElementById("openModalButton")).click();
  this.showModal = 2; 
  this.failed = "Please enter amount!";
}
else{         
 const updateData={
    empcode:item.EMP_CODE,
    updatedby:this.empcode,
    amount:item.amountDedRepeated,   
    eFlag:1,
    addDedId:item.ADD_DED_ID    
 };
 console.log(JSON.stringify(updateData));
 this.apicall.EditAdditionDeduction_Repeated(updateData).subscribe(res => {
   //alert(JSON.stringify(res)); 
   if(res.Errorid==1){
    (<HTMLInputElement>document.getElementById("openModalButton")).click();
    this.showModal = 1; 
    this.success='Changes saved Successfully!';          
  }
  else {
    (<HTMLInputElement>document.getElementById("openModalButton")).click();
    this.showModal = 2; 
    this.failed='Failed!';      
  }       
  this.fetchRepeatedDeduction();     
 });      
  this.isEditing = false; 
} 
}
CancelDedRepeated(item: any) {
//alert(JSON.stringify(item))
item.amountDedRepeated = item.AMOUNT;      
item.isEditing = false;
}
isStopButtonDisabledRepeated(item:any): boolean {  
  console.log(item.EFFECTIVE_PERIOD) 
  if(item.EFFECTIVE_PERIOD){
  this.effectiveperiodStart=item.EFFECTIVE_PERIOD.split('-',2);  
  this.effectiveperiodStartDay=this.effectiveperiodStart[0];
  console.log(this.effectiveperiodStartDay)
  }
  let startDate = new Date(this.effectiveperiodStartDay);   
  if (startDate && startDate<this.curDate) {    
    return true;
  } else {   
   return false;
  }  
}
StopRepeated(item:any){
  const updateData={
    empcode:item.EMP_CODE,
    updatedby:this.empcode,
    amount:0,    
    eFlag:3,
    addDedId:item.ADD_DED_ID      
   };
   //alert(JSON.stringify(updateData));
   this.apicall.EditAdditionDeduction_Repeated(updateData).subscribe(res => {
    //alert(JSON.stringify(res)); 
    if(res.Errorid==1){
     (<HTMLInputElement>document.getElementById("openModalButton")).click();
     this.showModal = 1; 
     this.success='Stoped Successfully!';          
   }
   else if(res.Errorid==0){
     (<HTMLInputElement>document.getElementById("openModalButton")).click();
     this.showModal = 2; 
     this.failed='Failed!';      
   }     
   this.fetchRepeatedAddition(); 
   this.fetchRepeatedDeduction(); 
  }); 
   
}
//Pagination Onetime Addition
getTotalPagesAddOnetime(): number {
  return Math.ceil(this.totalSearchResultsAddOnetime / this.itemsPerPage);
}

goToPageAddOnetime() {
  const totalPages = Math.ceil(this.totalSearchResultsAddOnetime / this.itemsPerPage);
  if (this.desiredPage >= 1 && this.desiredPage <= totalPages) {
    this.currentPage = this.desiredPage;
  } else {  
    
    (<HTMLInputElement>document.getElementById("openModalButton")).click();
    this.showModal = 2; 
    this.failed='Invalid page number!'; 
    this.desiredPage=''; 
  }   
 
}
getPageNumbersAddOnetime(currentPage: number): number[] {
  const totalPages = Math.ceil(this.totalSearchResultsAddOnetime / this.itemsPerPage);
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
get totalSearchResultsAddOnetime(): number {
const totalResults = this.onetimeadditiondata.filter((employee: any) => {
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
changePageAddOnetime(page: number): void { 
  this.desiredPage = '';   
  this.currentPage = page;
  const maxPage = Math.ceil(this.totalSearchResultsAddOnetime / this.itemsPerPage);
  if (this.currentPage > maxPage) {
    this.currentPage = 1;
  }        
}
getEntriesStartAddOnetime(): number {
if (this.currentPage === 1) {
  return 1;
}

const filteredData = this.onetimeadditiondata.filter((employee: any) =>
  Object.values(employee).some((value: any) =>
    typeof value === 'string' &&
    value.toLowerCase().startsWith(this.searchInput.toLowerCase())
  )
);

const start = (this.currentPage - 1) * this.itemsPerPage + 1;
return Math.min(start, filteredData.length);
}


getEntriesEndAddOnetime(): number {  
const filteredData = this.onetimeadditiondata.filter((employee: any) =>
  Object.values(employee).some((value: any) =>
    typeof value === 'string' &&
    value.toLowerCase().startsWith(this.searchInput.toLowerCase())
  )
);
const end = this.currentPage * this.itemsPerPage;
return Math.min(end, filteredData.length);
}
//Pagination Onetime Deduction
getTotalPagesDedOnetime(): number {
  return Math.ceil(this.totalSearchResultsDedOnetime / this.itemsPerPage);
}

goToPageDedOnetime() {
  const totalPages = Math.ceil(this.totalSearchResultsDedOnetime / this.itemsPerPage);
  if (this.desiredPage >= 1 && this.desiredPage <= totalPages) {
    this.currentPage = this.desiredPage;
  } else {  
    
    (<HTMLInputElement>document.getElementById("openModalButton")).click();
    this.showModal = 2; 
    this.failed='Invalid page number!'; 
    this.desiredPage=''; 
  }   
 
}
getPageNumbersDedOnetime(currentPage: number): number[] {
  const totalPages = Math.ceil(this.totalSearchResultsDedOnetime / this.itemsPerPage);
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
get totalSearchResultsDedOnetime(): number {
const totalResults = this.onetimedeductiondata.filter((employee: any) => {
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
changePageDedOnetime(page: number): void { 
  this.desiredPage = '';   
  this.currentPage = page;
  const maxPage = Math.ceil(this.totalSearchResultsDedOnetime / this.itemsPerPage);
  if (this.currentPage > maxPage) {
    this.currentPage = 1;
  }        
}
getEntriesStartDedOnetime(): number {
if (this.currentPage === 1) {
  return 1;
}

const filteredData = this.onetimedeductiondata.filter((employee: any) =>
  Object.values(employee).some((value: any) =>
    typeof value === 'string' &&
    value.toLowerCase().startsWith(this.searchInput.toLowerCase())
  )
);

const start = (this.currentPage - 1) * this.itemsPerPage + 1;
return Math.min(start, filteredData.length);
}
getEntriesEndDedOnetime(): number {  
const filteredData = this.onetimedeductiondata.filter((employee: any) =>
  Object.values(employee).some((value: any) =>
    typeof value === 'string' &&
    value.toLowerCase().startsWith(this.searchInput.toLowerCase())
  )
);
const end = this.currentPage * this.itemsPerPage;
return Math.min(end, filteredData.length);
}

//Pagination Repeated Deduction
getTotalPagesDedRepeated(): number {
  return Math.ceil(this.totalSearchResultsDedRepeated / this.itemsPerPage);
}

goToPageDedRepeated() {
  const totalPages = Math.ceil(this.totalSearchResultsDedRepeated / this.itemsPerPage);
  if (this.desiredPage >= 1 && this.desiredPage <= totalPages) {
    this.currentPage = this.desiredPage;
  } else {  
    
    (<HTMLInputElement>document.getElementById("openModalButton")).click();
    this.showModal = 2; 
    this.failed='Invalid page number!'; 
    this.desiredPage=''; 
  }   
 
}
getPageNumbersDedRepeated(currentPage: number): number[] {
  const totalPages = Math.ceil(this.totalSearchResultsDedRepeated / this.itemsPerPage);
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
get totalSearchResultsDedRepeated(): number {
const totalResults = this.repeateddeductiondata.filter((employee: any) => {
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
changePageDedRepeated(page: number): void { 
  this.desiredPage = '';   
  this.currentPage = page;
  const maxPage = Math.ceil(this.totalSearchResultsDedRepeated / this.itemsPerPage);
  if (this.currentPage > maxPage) {
    this.currentPage = 1;
  }        
}
getEntriesStartDedRepeated(): number {
if (this.currentPage === 1) {
  return 1;
}

const filteredData = this.repeateddeductiondata.filter((employee: any) =>
  Object.values(employee).some((value: any) =>
    typeof value === 'string' &&
    value.toLowerCase().startsWith(this.searchInput.toLowerCase())
  )
);

const start = (this.currentPage - 1) * this.itemsPerPage + 1;
return Math.min(start, filteredData.length);
}



getEntriesEndDedRepeated(): number {  
const filteredData = this.repeateddeductiondata.filter((employee: any) =>
  Object.values(employee).some((value: any) =>
    typeof value === 'string' &&
    value.toLowerCase().startsWith(this.searchInput.toLowerCase())
  )
);
const end = this.currentPage * this.itemsPerPage;
return Math.min(end, filteredData.length);
}
//Pagination Repeated Addition
getTotalPagesAddRepeated(): number {
  return Math.ceil(this.totalSearchResultsAddRepeated / this.itemsPerPage);
}

goToPageAddRepeated() {
  const totalPages = Math.ceil(this.totalSearchResultsAddRepeated / this.itemsPerPage);
  if (this.desiredPage >= 1 && this.desiredPage <= totalPages) {
    this.currentPage = this.desiredPage;
  } else {  
    
    (<HTMLInputElement>document.getElementById("openModalButton")).click();
    this.showModal = 2; 
    this.failed='Invalid page number!'; 
    this.desiredPage=''; 
  }   
 
}
getPageNumbersAddRepeated(currentPage: number): number[] {
  const totalPages = Math.ceil(this.totalSearchResultsAddRepeated / this.itemsPerPage);
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
get totalSearchResultsAddRepeated(): number {
const totalResults = this.repeatedadditiondata.filter((employee: any) => {
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
changePageAddRepeated(page: number): void { 
  this.desiredPage = '';   
  this.currentPage = page;
  const maxPage = Math.ceil(this.totalSearchResultsAddRepeated / this.itemsPerPage);
  if (this.currentPage > maxPage) {
    this.currentPage = 1;
  }        
}
getEntriesStartAddRepeated(): number {
if (this.currentPage === 1) {
  return 1;
}

const filteredData = this.repeatedadditiondata.filter((employee: any) =>
  Object.values(employee).some((value: any) =>
    typeof value === 'string' &&
    value.toLowerCase().startsWith(this.searchInput.toLowerCase())
  )
);

const start = (this.currentPage - 1) * this.itemsPerPage + 1;
return Math.min(start, filteredData.length);
}



getEntriesEndAddRepeated(): number {  
const filteredData = this.repeatedadditiondata.filter((employee: any) =>
  Object.values(employee).some((value: any) =>
    typeof value === 'string' &&
    value.toLowerCase().startsWith(this.searchInput.toLowerCase())
  )
);
const end = this.currentPage * this.itemsPerPage;
return Math.min(end, filteredData.length);
}



                
}
