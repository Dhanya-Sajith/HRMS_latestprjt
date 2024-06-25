import { Component, OnInit } from '@angular/core';
import { ApiCallService } from 'src/app/api-call.service';
import { LoginService } from 'src/app/login.service';
import { FormGroup, FormBuilder, FormControl, FormArray,Validators } from '@angular/forms';
import { DatePipe, JsonPipe } from '@angular/common';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { formatDate } from '@angular/common';


@Component({
  selector: 'app-bustrip-hr',
  templateUrl: './bustrip-hr.component.html',
  styleUrls: ['./bustrip-hr.component.scss']
})
export class BustripHRComponent implements OnInit {

  Menu: string = 'leave';
  subMenu: string = 'bustrip';
  userSession:any = this.session.getUserSession();
  authorityflg:any =this.userSession.authorityflg;
  empcode: any=this.userSession.empcode;
  empid:any =this.userSession.id;
  level: any=this.userSession.level;
  grpname:any=this.userSession.grpname; 
  company: any=this.userSession.companycode; 
  user:any ="personal";
  listCompany: any;
  deptypeid=1;
  stattypeid=26;
  listDepartment: any;
  listEmployee: any;
  liststatus: any;
  statustypeid= 26;
  airticketstatus:any;
  BussTripSelfForm: FormGroup;
  submitted:boolean = false;
  date = new Date();
  listcountry: any;
  viewflag:any;
  airtick: any;
  ticketflag: any;
  accommodation: any;
  accomenable: any;
  certificate: any;
  certenable: any;
  cashadvance: any;
  cashenable: any;
  transportation: any;
  imcard: any;
  listcurrency: any;
  fromdate = new FormControl();
  todate = new FormControl();
  reasonControl= new FormControl();
  requestid= new FormControl();
  listdates: any;
  listBussinesstrip_personal: any;
  fmdt: any;
  todt: any;
  firstDay1 = new Date(this.date.getFullYear(), this.date.getMonth(), 1);
  lastDay1 = new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0);
  firstDay=this.datePipe.transform(this.firstDay1,"yyyy-MM-dd");
  lastDay=this.datePipe.transform(this.lastDay1,"yyyy-MM-dd");
  businessReqPer: any;
  Compname=12;
  listBussinesstrip: any;
  showModal: any;
  success: any;
  failed: any;
  listBussinesstrip_team: any;
  selectedRequestID: any;
  selectedEmpcode: any;
  reason: any;
  desiredPage: any;
  searchInput: string='';
  itemsPerPage=10;
  currentPage=1;
  currentPagePersonal=1; 
  desiredPagePersonal: any;
  Failed: any;
  simcard: any;
  listdataForAdmin: any;
  approvelist: any;
  reqID: any;
  listEmployeerep: any;
  leave: any;
  compoff: any;
  business: any;
  permissions: any;


constructor(private fb: FormBuilder,private datePipe: DatePipe,private session:LoginService,private apicall:ApiCallService,private router:Router,private route: ActivatedRoute) {

this.BussTripSelfForm = this.fb.group({

  start_date:new FormControl ('', [Validators.required]),
  end_date:new FormControl ('', [Validators.required]),
  destination:new FormControl ('', [Validators.required]),
  no_of_days:new FormControl ('', [Validators.required]),
  airticket_status:new FormControl ('', [Validators.required]),
  onward_ticket_type:new FormControl ('', [Validators.required]),
  return_ticket_type:new FormControl ('', [Validators.required]),
  accommodation_status:new FormControl ('', [Validators.required]),
  hotel_address:new FormControl ('', [Validators.required]),
  airport_transportation:new FormControl ('', [Validators.required]),
  simcard_status:new FormControl ('', [Validators.required]),
  certification_status:new FormControl ('', [Validators.required]),
  certifications:new FormControl ('', [Validators.required]),
  cash_advance_status:new FormControl ('', [Validators.required]),
  advance_amount:new FormControl ('', [Validators.required]),
  currency:new FormControl ('', [Validators.required]),
  emp_code:new FormControl (this.userSession.empcode),
  requested_by:new FormControl (this.userSession.empcode),

});


 const airticketStatusControl = this.BussTripSelfForm.get('airticket_status') as FormControl;
 if (airticketStatusControl) {
   airticketStatusControl.valueChanges.subscribe((value) => {
     if (value == 0) {
       this.BussTripSelfForm.patchValue({
         onward_ticket_type: "4",
         return_ticket_type: "4"
       });
     }
     else if(value == 1)
     {
      this.BussTripSelfForm.patchValue({
        onward_ticket_type: "",
        return_ticket_type: ""
      });
     }
   });
 }

 const accomodationStatusControl = this.BussTripSelfForm.get('accommodation_status') as FormControl;
 if (accomodationStatusControl) {
  accomodationStatusControl.valueChanges.subscribe((value) => {
     if (value == 0) {
       this.BussTripSelfForm.patchValue({
        hotel_address: "null",
       });
     }
     else if(value == 1)
     {
      this.BussTripSelfForm.patchValue({
        hotel_address: "",
       });
     }
   });
 }

 const certificationStatusControl = this.BussTripSelfForm.get('certification_status') as FormControl;
 if (certificationStatusControl) {
  certificationStatusControl.valueChanges.subscribe((value) => {
     if (value == 0) {
       this.BussTripSelfForm.patchValue({
        certifications: "null",
       });
     }
     else if (value == 1) {
      this.BussTripSelfForm.patchValue({
       certifications: "",
      });
    }
   });
 }

 const cashStatusControl = this.BussTripSelfForm.get('cash_advance_status') as FormControl;
 if (cashStatusControl) {
  cashStatusControl.valueChanges.subscribe((value) => {
     if (value == 0) {
       this.BussTripSelfForm.patchValue({
        advance_amount: "0",
        currency: "0"
       });
     }
     else if (value == 1) {
      this.BussTripSelfForm.patchValue({
       advance_amount: "",
       currency: ""
      });
    }
   });
 }


 const empControl = this.BussTripSelfForm.get('emp_code') as FormControl;
 
 if (empControl) {
   empControl.valueChanges.subscribe((value) => {
     if (value == this.userSession.empcode) {
       this.BussTripSelfForm.patchValue({
         emp_code: this.userSession.empcode,
       });
     } else {
      const emp_codeval= (<HTMLInputElement>document.getElementById("emp_code")).value;
       this.BussTripSelfForm.patchValue({
         emp_code: emp_codeval,
       });
     }
   });
 }

}

  ngOnInit(): void {


    //Button selection
    var buttons = document.querySelectorAll('.toggle-button');        
    buttons.forEach(function(button) {
        button.addEventListener('click', function() {                
            buttons.forEach(function(btn) {
                btn.classList.remove('selected');
            });                
            button.classList.add('selected');
        });
    });


    this.route.queryParams
    .subscribe(params => {
      this.user = params['user'];
      // this.Activetype = params['active'];
    }
   );

   if(this.authorityflg === 0 || this.user == 'personal' || this.user == undefined)
    {
      this.user = 'personal';
      this.fetchpersonaldata()
    }
    else
    {
      this.user = 'team';
      this.BusinessTripOnloadTeam()
    }

    this.airticketstatus=0;
    this.accomenable=0; 
    this.certenable=0; 
    this.cashenable=0;
    this.ListEmployees(); 
    this.ListStatus();
    this.ListCountry();
    this.ListCurrency();
    this.ListCompany();
    this.ListDepartments();
    this.fetchpersonaldata();
    this.ListEmployeesReportees();
    this.FetchPendingCount();  
    this.BusinessTripOnloadTeam();

      this.apicall.listFromToDates().subscribe(res=>{
      this.listdates = res;
      if(this.listdates.length > 0)
      {
        const listdatesdata = this.listdates[0];
        this.fromdate.setValue(formatDate(listdatesdata.FROM_DATE,'yyyy-MM-dd','en'));
        this.todate.setValue(formatDate(listdatesdata.TO_DATE,'yyyy-MM-dd','en'));
        this.fmdt = formatDate(listdatesdata.FROM_DATE,'yyyy-MM-dd','en');
        this.todt = formatDate(listdatesdata.TO_DATE,'yyyy-MM-dd','en');
      };
    })

  
    this.BussTripSelfForm.controls['start_date'].setValue(formatDate(this.firstDay1,'yyyy-MM-dd','en'));
    this.BussTripSelfForm.controls['end_date'].setValue(formatDate(this.firstDay1,'yyyy-MM-dd','en'));

    const startDate = new Date(this.firstDay1);
    const endDate = new Date(this.firstDay1);
    const differenceMs = endDate.getTime() - startDate.getTime();
    const differenceDays = Math.ceil(differenceMs / (1000 * 60 * 60 * 24))+1;
    this.BussTripSelfForm.controls['no_of_days'].setValue(differenceDays);

    
  }

fetchpersonaldata()
{

  const reqstatus=0;
  const viewflag=0;
  this.apicall.ListBusinessTripLevelwise(this.empcode,reqstatus,viewflag,this.firstDay,this.lastDay).subscribe((res)=>{
  this.listBussinesstrip_personal=res;
  

})

}

  
  get a()
  {
    return this.BussTripSelfForm.controls;
  }

  SelfBussTripSubmit() 
  {
    this.submitted=true;
    if(this.BussTripSelfForm.invalid) 
    {  
        return;
    }
    else if(this.BussTripSelfForm.valid)
    {
     // alert(JSON.stringify(this.BussTripSelfForm.value))
      console.log(JSON.stringify(this.BussTripSelfForm.value))
      this.apicall.AddBussinessTripRequest(this.BussTripSelfForm.value).subscribe((res)=>{
      if(res.Errorid==1)
      {
        (<HTMLInputElement>document.getElementById("openModalButtonForalert")).click();
        this.showModal = 1;
        this.success = "Requested Successfully";  
        this.fetchpersonaldata();

        setTimeout(() => {
          location.reload();
          this.submitted = false;
        }, 1000);

      }
      else
      {
        (<HTMLInputElement>document.getElementById("openModalButtonForalert")).click();
        this.showModal = 1;
        this.failed = "Request Failed";  
      }
      })
    }
  }


  SelfBussTripEdit() 
  {
    
    const emp_code_e = (<HTMLInputElement>document.getElementById("emp_code_e")).value;
    const requestid = (<HTMLInputElement>document.getElementById("requestid")).value;
    const start_date_e = (<HTMLInputElement>document.getElementById("start_date_e")).value;
    const end_date_e = (<HTMLInputElement>document.getElementById("end_date_e")).value;
    const destination_e = (<HTMLInputElement>document.getElementById("destination_e")).value;
    const no_of_days_e = (<HTMLInputElement>document.getElementById("no_of_days_e")).value;
    const teamAirTicketRadioEdit = (document.querySelector('input[name="teamAirTicketRadioEdit"]:checked') as HTMLInputElement)?.value;
    const teamOnwardRadioEdit = (document.querySelector('input[name="teamOnwardRadioEdit"]:checked') as HTMLInputElement)?.value;
    const teamReturnRadioEdit = (document.querySelector('input[name="teamReturnRadioEdit"]:checked') as HTMLInputElement)?.value;
    const teamTraRadioOptionsEdit = (document.querySelector('input[name="teamTraRadioOptionsEdit"]:checked') as HTMLInputElement)?.value;
    const teamSimRadioEdit = (document.querySelector('input[name="teamSimRadioEdit"]:checked') as HTMLInputElement)?.value;
    const teamAccRadioEdit = (document.querySelector('input[name="teamAccRadioEdit"]:checked') as HTMLInputElement)?.value;
    const hoteladdress_e = (<HTMLInputElement>document.getElementById("hoteladdress_e")).value;
    const teamCerRadioEdit = (document.querySelector('input[name="teamCerRadioEdit"]:checked') as HTMLInputElement)?.value;
    const certification_e = (<HTMLInputElement>document.getElementById("certification_e")).value;
    const teamCashRadioEdit = (document.querySelector('input[name="teamCashRadioEdit"]:checked') as HTMLInputElement)?.value;
    const amount_e = (<HTMLInputElement>document.getElementById("amount_e")).value;
    const currency_e = (<HTMLInputElement>document.getElementById("currency_e")).value;
    

    const editdata = {
      emp_code: emp_code_e,
      reqid: requestid,
      requested_by: this.userSession.empcode,
      start_date: start_date_e,
      end_date: end_date_e,
      destination: destination_e,
      no_of_days: no_of_days_e,
      airticket_status: teamAirTicketRadioEdit,
      onward_ticket_type: teamOnwardRadioEdit,
      return_ticket_type: teamReturnRadioEdit,
      airport_transportation: teamTraRadioOptionsEdit,
      simcard_status: teamSimRadioEdit,
      accommodation_status: teamAccRadioEdit,
      hotel_address: hoteladdress_e,
      certification_status: teamCerRadioEdit,
      certifications: certification_e,
      cash_advance_status: teamCashRadioEdit,
      advance_amount: amount_e,
      currency: currency_e
      
    };

   // this.submitted=true;
    // if(this.BussTripSelfFormEdit.invalid) 
    // {  
    //     return;
    // }
    // else if(this.BussTripSelfFormEdit.valid)
   // {
     // alert(JSON.stringify(this.BussTripSelfForm.value))
     // alert(JSON.stringify(editdata))

      this.apicall.AddBussinessTripRequestEdit(editdata).subscribe((res)=>{
      if(res.Errorid==1)
      {
        (<HTMLInputElement>document.getElementById("openModalButtonForalert")).click();
        this.showModal = 1;
        this.success = "Updated Successfully";  
        // this.fetchpersonaldata();
        // this.BussTripSelfForm.reset();
        // this.submitted = false;
        this.BusinessTripOnloadTeam();
        
      }
      else
      {
        (<HTMLInputElement>document.getElementById("openModalButtonForalert")).click();
        this.showModal = 1;
        this.failed = "Failed";  
      }
      })
   // }
  }



  daycalculation()
  {
    const tripstartdt= (<HTMLInputElement>document.getElementById("start_date")).value;
    //alert(tripstartdt)
    const tripenddt= (<HTMLInputElement>document.getElementById("end_date")).value;
    //alert(tripenddt)
    const startDate = new Date(tripstartdt);
    const endDate = new Date(tripenddt);
    const differenceMs = endDate.getTime() - startDate.getTime();
    const differenceDays = Math.ceil(differenceMs / (1000 * 60 * 60 * 24))+1;
    //alert(differenceDays);
    this.BussTripSelfForm.controls['no_of_days'].setValue(differenceDays);
    
  }

  daycalculationteam()
  {
    const tripstartdt= (<HTMLInputElement>document.getElementById("start_dates")).value;
    //alert(tripstartdt)
    const tripenddt= (<HTMLInputElement>document.getElementById("end_dates")).value;
    //alert(tripenddt)
    const startDate = new Date(tripstartdt);
    const endDate = new Date(tripenddt);
    const differenceMs = endDate.getTime() - startDate.getTime();
    const differenceDays = Math.ceil(differenceMs / (1000 * 60 * 60 * 24))+1;
    //alert(differenceDays);
    this.BussTripSelfForm.controls['no_of_days'].setValue(differenceDays);
  }

  daycalculationforedit()
  {
    const tripstartdt= (<HTMLInputElement>document.getElementById("start_date_e")).value;
    //alert(tripstartdt)
    const tripenddt= (<HTMLInputElement>document.getElementById("end_date_e")).value;
    //alert(tripenddt)
    const startDate = new Date(tripstartdt);
    const endDate = new Date(tripenddt);
    const differenceMs = endDate.getTime() - startDate.getTime();
    const differenceDays = Math.ceil(differenceMs / (1000 * 60 * 60 * 24))+1;
    //alert(differenceDays);
   // this.BussTripSelfForm.controls['no_of_days'].setValue(differenceDays);
   (<HTMLInputElement>document.getElementById("no_of_days_e")).value = differenceDays.toString();

  }

  // FetchDates()
  // {
  //   this.apicall.listFromToDates().subscribe(res=>{
  //     this.listdates = res;
  //     if(this.listdates.length > 0)
  //     {
  //       const listdatesdata = this.listdates[0];
  //       this.fromdate.setValue(formatDate(listdatesdata.FROM_DATE,'yyyy-MM-dd','en'));
  //       this.todate.setValue(formatDate(listdatesdata.TO_DATE,'yyyy-MM-dd','en'));
  //       this.fmdt =formatDate(listdatesdata.FROM_DATE,'yyyy-MM-dd','en');
  //       alert(this.fmdt )
  //       this.todt = formatDate(listdatesdata.TO_DATE,'yyyy-MM-dd','en');
  //       alert(this.todt )
  //     };
  //   })
  // }


  viewpersonal(emp_code:any,reqid:any)
  {
    this.apicall.viewBussinessReqPersonal(emp_code,reqid).subscribe((res)=>{
    this.businessReqPer = res;
    this.requestid.setValue(this.businessReqPer[0].REQ_ID);


    })
  }

  BusinessTripDataPersonalFilter()
  { 
      
      const reqstatus= (<HTMLInputElement>document.getElementById("reqstatus")).value;
      const fromdate= (<HTMLInputElement>document.getElementById("fromdate")).value;
      const todate= (<HTMLInputElement>document.getElementById("todate")).value;
      const viewflag =0; 
      this.apicall.ListBusinessTripLevelwise(this.empcode,reqstatus,viewflag,fromdate,todate).subscribe((res)=>{
      this.listBussinesstrip_personal=res;
      const maxPageFiltered = Math.ceil(this.listBussinesstrip_personal.length / this.itemsPerPage);  
  
          if (this.currentPage > maxPageFiltered) {
            this.currentPage = 1;    
            //alert(this.currentPage) 
          } 
      //alert(JSON.stringify(res))
    })
  }

  
  ListCompany()
  {
    this.apicall.listCompany(this.Compname).subscribe((res)=>{
      this.listCompany=res;
    })
  }
  ListDepartments()
  {
  
    this.apicall.listDepartment(this.deptypeid).subscribe((res)=>{
      this.listDepartment=res;
      })
  }


  teamselection(user:string)
  {   
    
    //alert(this.user);
    this.user = user; 
    this.airtick='null';
    this.accommodation='null';
    this.certificate='null';
    this.cashadvance='null';
    this.airticketstatus=0;
    this.accomenable=0; 
    this.certenable=0; 
    this.cashenable=0;
    
    if (this.user === 'team') {
      this.BusinessTripOnloadTeam();
    }
    else
    {

    }
   }


   BusinessTripOnloadTeam()
   {

    const reqstatus=0;
    const viewflag=1;
    this.apicall.RequestmngmntOnload(this.empcode).subscribe((res)=>{
    this.listBussinesstrip_team=res;
    // alert(JSON.stringify(res))
    })

    this.FetchPendingCount();  

   }

   BusinessTripFilterTeam()
   {
     const comp= (<HTMLInputElement>document.getElementById("Compname")).value;
     const dep= (<HTMLInputElement>document.getElementById("dept")).value;
     const emp = (<HTMLInputElement>document.getElementById("empname")).value;
     const reqststs = (<HTMLInputElement>document.getElementById("reqstatus")).value;
     const fromdate = (<HTMLInputElement>document.getElementById("fromdate")).value;
     const todate = (<HTMLInputElement>document.getElementById("todate")).value;

     if( this.fromdate.value > this.todate.value){
       (<HTMLInputElement>document.getElementById("openModalButtonForalert")).click();
       this.showModal = 2;
       this.failed = "Please Correct the Dates";
     }else{
 
     const data = {
       company:comp,
       department: dep,
       emp_code: emp,
       status:reqststs,
       fromdate: fromdate,
       todate:todate , 
       authority:this.empcode,
       };
       
       this.apicall.RequestmngmntOnloadfilter(data).subscribe(res =>{
         this.listBussinesstrip_team=res;
        // alert(JSON.stringify(res))
       })
     }
   }


   approve(reqid:any,Empcode:any){ 
    
    //alert(reqid)
    //alert(Empcode)

    const approvedata={
      req_id:reqid,
      empcode:Empcode,
      verified_by:this.empcode,
      verified_remarks: 'null',
      mflag: 1,
    }
      this.apicall.ApproveRejectBusinesstripReq(approvedata).subscribe((res) => {      
        if(res.Errorid==1){
          (<HTMLInputElement>document.getElementById("openModalButtonForalert")).click();
          this.showModal = 1; 
          this.success='Request Approved!'; 
          this.BusinessTripOnloadTeam();
          this.FetchPendingCount();  
        }
        else{
          (<HTMLInputElement>document.getElementById("openModalButtonForalert")).click();
          this.showModal = 2; 
          this.failed='Failed!';
          this.BusinessTripOnloadTeam();
          this.FetchPendingCount();  
        }  
    });
  }

  setSelectedvalues(requestID: any,empcode: any) 
  {
    this.selectedRequestID = requestID;
    this.selectedEmpcode = empcode;
  }

  CancelRequest(Empcode:any,requestID:any)
{
  const req_category='B'
  this.apicall.CancelRequests(Empcode,requestID,req_category).subscribe((res) => {
    if(res.Errorid==1){
      (<HTMLInputElement>document.getElementById("openModalButtonForalert")).click();
      this.showModal = 1; 
      this.success='Request cancelled!'; 
      this.fetchpersonaldata();

    }
    else{
      (<HTMLInputElement>document.getElementById("openModalButtonForalert")).click();
      this.showModal = 2; 
      this.failed='Failed!';      
    }  
  });
}

Reject(requestID:any,Empcode:any,Reason:string ){  
  const rejectdata={
    req_id:requestID,
    empcode:Empcode,
    verified_by:this.empcode,
    verified_remarks: Reason,
    mflag: 2
  }
  this.apicall.ApproveRejectBusinesstripReq(rejectdata).subscribe((res) => {
    if(res.Errorid==1){

      (<HTMLInputElement>document.getElementById("openModalButtonForalert")).click();
          this.showModal = 1; 
          this.success='Request Rejected!'; 
          this.BusinessTripOnloadTeam();
          this.FetchPendingCount();  
    }
    else
    {
      (<HTMLInputElement>document.getElementById("openModalButtonForalert")).click();
          this.showModal = 2; 
          this.failed='Failed!';
          this.BusinessTripOnloadTeam(); 
          this.FetchPendingCount();    
    }
   
    this.reasonControl.setValue('');
  });
 }

 selectreason(reason:string){
  this.reason=reason;
}


   airticketCheckYesNo(airtick:string)
   { 
    if (airtick === '1') 
    {   
      this.airticketstatus=1;   
    } 
    else
    {      
      this.airticketstatus=0;    
    }   
   }

   airticketCheck(airtick:string)
   {
    if (airtick === '0') 
    { 
      (<HTMLInputElement>document.getElementById('teamOnwardEdit_R4')).checked = true;
      (<HTMLInputElement>document.getElementById('teamReturnEdit_R4')).checked = true;
    }
   }
   
   accommodationCheck(accommodation:string)
   {    
    if (accommodation === '1') 
    {   
      this.accomenable=1;
    } 
    else
    {      
      this.accomenable=0;    
    }   
   }   

   accoCheck(accommodation:string)
   { 
    if (accommodation === '0') 
    {  
    (<HTMLInputElement>document.getElementById('hoteladdress_e')).value = 'null';
    }
   }

   certificateCheck(certificate:string)
   {    
    if (certificate === '1') 
    {   
      this.certenable=1;        
    } 
    else 
    {      
      this.certenable=0;                
    }   
   }

   certifiCheck(certificate:string)
   {
    if (certificate === '0') 
    {   
      (<HTMLInputElement>document.getElementById('certification_e')).value = 'null';       
    } 
   }

   cashCheck(cashadvance:string)
   {    
    if (cashadvance === '1') 
    {   
      this.cashenable=1;            
    } 
    else
    {      
      this.cashenable=0;             
    }   
   } 

   amountCheck(cashadvance:string)
   {    
    if (cashadvance === '0') 
    {   
      (<HTMLInputElement>document.getElementById('amount_e')).value = '0'; 
      (<HTMLInputElement>document.getElementById('currency_e')).value = 'null'; 
      
    } 
   } 



   ListEmployees()
    {    
      this.apicall.FetchEmployeeList(-1,-1,this.empcode).subscribe(res =>{
        this.listEmployee=res;
        
        })
    }

    ListEmployeesReportees()
    {    
      this.apicall.listEmployeemGR(this.empcode).subscribe(res =>{
        this.listEmployeerep=res;
        
        })
    }

  ListStatus()
    {
      this.apicall.listStatus(this.statustypeid).subscribe((res)=>{
        this.liststatus=res;
        })
    }
  ListCountry()
    {
      this.apicall.CountryDetails().subscribe((res)=>{
        this.listcountry=res;
        })
    }
  ListCurrency()
    {
      this.apicall.listCurrency().subscribe((res)=>{
        this.listcurrency=res;
        })
    }
  clearreq_datas()
  {
    this.airtick='null';
    this.accommodation='null';
    this.certificate='null';
    this.cashadvance='null';
    this.airticketstatus=0;
    this.accomenable=0; 
    this.certenable=0; 
    this.cashenable=0;   
    this.transportation='null';
    this.simcard='null';
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
  const maxPageNumbers = 5; 
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
const totalResults = this.listBussinesstrip_personal.filter((employee: any) => {
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

const filteredData = this.listBussinesstrip_personal.filter((employee: any) =>
  Object.values(employee).some((value: any) =>
    typeof value === 'string' &&
    value.toLowerCase().startsWith(this.searchInput.toLowerCase())
  )
);

const start = (this.currentPage - 1) * this.itemsPerPage + 1;
return Math.min(start, filteredData.length);
}


getEntriesEnd(): number {  
const filteredData = this.listBussinesstrip_personal.filter((employee: any) =>
  Object.values(employee).some((value: any) =>
    typeof value === 'string' &&
    value.toLowerCase().startsWith(this.searchInput.toLowerCase())
  )
);
const end = this.currentPage * this.itemsPerPage;
return Math.min(end, filteredData.length);
}



// pagination --- team


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
    this.Failed='Invalid page number!'; 
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
const totalResults = this.listBussinesstrip_team.filter((policy: any) => {
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

const filteredData = this.listBussinesstrip_team.filter((policy: any) =>
  Object.values(policy).some((value: any) =>
    typeof value === 'string' &&
    value.toLowerCase().startsWith(this.searchInput.toLowerCase())
  )
);

const start = (this.currentPagePersonal - 1) * this.itemsPerPage + 1;
return Math.min(start, filteredData.length);
}


getEntriesEndPersonal(): number {  
const filteredData = this.listBussinesstrip_team.filter((policy: any) =>
  Object.values(policy).some((value: any) =>
    typeof value === 'string' &&
    value.toLowerCase().startsWith(this.searchInput.toLowerCase())
  )
);
const end = this.currentPagePersonal * this.itemsPerPage;
return Math.min(end, filteredData.length);
}

fetchdataForAdmin(emp_code:any,reqid:any,status:any)
{
  this.apicall.fetchdataForAdmin(emp_code,reqid,status).subscribe((res)=>{
  this.listdataForAdmin=res;
})

}


// Status Approve List
Approvelist(requestID: any){
  this.reqID = requestID
 // alert(this.reqID )
  this.apicall.StatusApproveList(1,this.reqID,'B').subscribe(res=>{
    this.approvelist = res;
 //   alert(JSON.stringify(res))
  })
}

ViewFiles(fpath:any,req_id:any,upflag:any)
{
  // alert(fpath);

  // alert(req_id);

  // alert(upflag);

  let fileurl=this.apicall.GetBusinestripDocs(fpath,req_id,upflag);


  let link = document.createElement("a");
  link.setAttribute("href", fileurl);
  link.setAttribute("target", "_blank");
          link.setAttribute("download", "");
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link)
}


clearfn()
{

  location.reload();
}



selectmenu(value: string) {
  this.Menu=value;
 //  alert(this.menu)
 }
 selectsubmenu(value: string) {
   this.subMenu=value;
   //alert(this.subMenu)
   }
   navigateToLeave() {
    //this.router.navigate(['/leaveHR']);
    this.subMenu='leave';
   
  }
  navigateToCompoffHR(){
    //this.router.navigate(['/compoffHR']);
    this.subMenu='compoff';
  }
  navigateToBusTrip(){
    //this.router.navigate(['/bustripHR']);
    this.subMenu='bustrip';
  }
  navigateToPermissions(){
    //this.router.navigate(['/permissionsHR']);
    this.subMenu='permissions';
  }

  FetchPendingCount(){      
    this.apicall.FetchPendingCount_HR(2,this.empcode).subscribe((res) => {        
      this.leave=res[0].LEAVE;
      this.compoff=res[0].COMPOFF;
      this.business=res[0].BUSINESS;
      this.permissions=res[0].PERMISSION;
      //  alert(JSON.stringify(this.compensation))   
    });    
 }


}
function clearFormErrors(BussTripSelfForm: FormGroup<any>) {
  throw new Error('Function not implemented.');
}



