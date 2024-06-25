import { Component, OnInit } from '@angular/core';
import { FormControl,FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiCallService } from 'src/app/api-call.service';
import { LoginService } from 'src/app/login.service';
import { DatePipe } from '@angular/common';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-family-airticket',
  templateUrl: './family-airticket.component.html',
  styleUrls: ['./family-airticket.component.scss']
})
export class FamilyAirticketComponent implements OnInit {

  userSession:any = this.session.getUserSession();
  empcode: any=this.userSession.empcode;
  grpname:any=this.userSession.grpname;
  desig:any=this.userSession.desig.split('#', 1);
  desigID:any= this.desig[1]; 

  user:any = "personal";
  flag: any = 0;
  radioselected: any='oneway';
  onywayForm: FormGroup; 
  returnForm: FormGroup; 
  isValid: boolean=false;
  showModal = 0;
  failed!: string;
  success!: string;
  listpassengers: any;
  dropdownSettings:IDropdownSettings={};
  selectedItems: any = [];
  AirTicketDetails: any;
  yeardata: any;
  selectyear: any = -1;
  AirTicketDetails_oneway: any;
  AirTicketDetails_return: any;
  selectstatus: any = 0;
  passengerslist: any;
  listStatus: any;
  traveltype: any;
  selecttraveltype:any = -1;
  onewayselectstatus:any = -1;
  onewayselectyear:any = -1;
  returnselectstatus:any = -1;
  returnselectyear:any = -1;
  remarks:any
  Activereqid: any;
  mflag: any;
  Activeempcode: any;
  onywayFormEdit: FormGroup; 
  returnFormEdit: FormGroup; 
  showflag: any;

  searchInput: any ='';
  desiredPage: any;
  itemsPerPage=10;
  currentPage=1;

  onewaysearchInput:any='';
  onewaycurrentPage=1;
  returnsearchInput:any='';
  returncurrentPage=1;
  viewflag: any;

  constructor(private apicall:ApiCallService,private datePipe:DatePipe,private session:LoginService,private fb: FormBuilder,private route: ActivatedRoute) {
    this.onywayForm = this.fb.group({
      leavingfrom: ['', Validators.required],
      goingto: ['', Validators.required],
      departing: ['', Validators.required],
      passengers: ['', Validators.required],       
    });
    this.returnForm = this.fb.group({
      rleavingfrom: ['', Validators.required],
      rgoingto: ['', Validators.required],  
      rdeparting: ['', Validators.required],
      rreturn: ['', Validators.required],    
      rpassengers: ['', Validators.required],    
    });
    this.onywayFormEdit = this.fb.group({
      onewayreqid: [''],
      eleavingfrom: ['', Validators.required],
      egoingto: ['', Validators.required],
      edeparting: ['', Validators.required],
      epassengers: ['', Validators.required],       
    });
    this.returnFormEdit = this.fb.group({
      returnreqid:[''],
      erleavingfrom: ['', Validators.required],
      ergoingto: ['', Validators.required],  
      erdeparting: ['', Validators.required],
      erreturn: ['', Validators.required],    
      erpassengers: ['', Validators.required],    
    });
   }

  ngOnInit(): void {
    this.route.queryParams
    .subscribe(params => {
      this.user = params['user'];
    }
  );

  if(this.user == 'personal' || this.user == undefined){
    this.user = 'personal';
    this.viewflag = 0; 
    this.FetchFamilyAirTicketDetails_oneway();
  }
  else{
    this.user = 'team';
    this.viewflag = 1;   
    this.FetchFamilyAirTicketDetails();
  }

  this.apicall.FamilyAirTicketAccess(this.empcode).subscribe((res) => {  
      this.viewflag = res.Errorid
     });
    
    this.apicall.listfamdtl(this.empcode).subscribe((res) => {  
      this.listpassengers = res
     });

     this.dropdownSettings = {
      idField: 'MEMBER_ID',
      textField: 'MEMBER_NAME',
      itemsShowLimit: 3,
      limitSelection: -1,
      allowSearchFilter: true,
      clearSearchFilter: true,
    };

     //Year
     this.apicall.listYear().subscribe((res) => {
      this.yeardata=res;      
    });
    
    //status
    this.apicall.listStatus(26).subscribe((res)=>{
      this.listStatus=res;
    })

    //Travel type
    this.apicall.listStatus(77).subscribe((res)=>{
      this.traveltype=res;
    })
    this.FetchFamilyAirTicketDetails_oneway();
  }

  // Radio button selection
  SelectTeamorpersonal(selectuser:any){
    this.user=selectuser
    if (this.user == 'personal') {
      this.flag = 0;
      this.FetchFamilyAirTicketDetails_oneway();
    }else{
      this.flag = 1;
      this.FetchFamilyAirTicketDetails();
    }  
  }

  onradioselected(){
    if(this.radioselected=='return')
    {
      this.FetchFamilyAirTicketDetails_return();
    }else{
      this.FetchFamilyAirTicketDetails_oneway();
    }
  }

  FetchFamilyAirTicketDetails()
  {
    this.apicall.FetchFamilyAirTicketDetails(this.flag,this.selectstatus,this.selectyear,this.selecttraveltype,this.empcode).subscribe(res => {
      this.AirTicketDetails = res;
      const maxPageFiltered = Math.ceil(this.AirTicketDetails.length / this.itemsPerPage);  

      if (this.currentPage > maxPageFiltered) {
        this.currentPage = 1;     
      } 
    })
  }

  FetchFamilyAirTicketDetails_oneway()
  {
    this.apicall.FetchFamilyAirTicketDetails(this.flag,this.onewayselectstatus,this.onewayselectyear,0,this.empcode).subscribe(res => {
      this.AirTicketDetails_oneway = res;
      const maxPageFiltered = Math.ceil(this.AirTicketDetails_oneway.length / this.itemsPerPage);  

      if (this.onewaycurrentPage > maxPageFiltered) {
        this.onewaycurrentPage = 1;     
      } 
    })
  }

  FetchFamilyAirTicketDetails_return()
  {
    this.apicall.FetchFamilyAirTicketDetails(this.flag,this.returnselectstatus,this.returnselectyear,1,this.empcode).subscribe(res => {
      this.AirTicketDetails_return = res;
    })
  }

  validateonywayForm() {      
    if (this.onywayForm.valid){
    this.isValid = true;
    }
    else{
      this.markFormGroupTouched(this.onywayForm);
    
    }
  }

  validatereturnForm() {      
    if (this.returnForm.valid){
    this.isValid = true;
    }
    else{
      this.markFormGroupTouched(this.returnForm);
    
    }
  }

  Booknow_oneway()
  {
    if (this.onywayForm.valid) {
      const from = this.onywayForm.get('leavingfrom');      
      const to = this.onywayForm.get('goingto');   
      const depart = this.onywayForm.get('departing');      
      const passenger = this.onywayForm.get('passengers')?.value  
      const passengerlist = passenger.map((item: {
        MEMBER_ID: any; id: any; 
        }) => item.MEMBER_ID).join(',');
      
      const data = {
        empcode:this.empcode,
        departureAirport:from?.value,
        arrivalAirport: to?.value,
        Passengers:passengerlist,
        departureDate:depart?.value,
        arrivalDate:null,
        ticketType:0,
        actionflag:1,
        req_id:0
      };
      this.apicall.AddFamilyAirticketDetails(data).subscribe((res) => {  
        if(res.Errorid==1){
          this.showModal = 1;
          this.success='Book Ticket successfully!';
          this.FetchFamilyAirTicketDetails_oneway();   
        }
        else{
            this.showModal = 2; 
            this.failed='Failed!';     
        }
    
        this.FetchFamilyAirTicketDetails_oneway(); 
        this.onywayForm.reset(); 
      
      });
    } else {    
      this.markFormGroupTouched(this.onywayForm);   
    }
  }

  Booknow_return()
  {
    if (this.returnForm.valid) {
      const from = this.returnForm.get('rleavingfrom');      
      const to = this.returnForm.get('rgoingto');   
      const depart = this.returnForm.get('rdeparting');
      const rreturn = this.returnForm.get('rreturn'); 
      const rpassenger = this.returnForm.get('rpassengers')?.value ; 
      const passengerlists = rpassenger.map((item: {
        MEMBER_ID: any; id: any; 
        }) => item.MEMBER_ID).join(','); 

      const data = {
        empcode:this.empcode,
        departureAirport:from?.value,
        arrivalAirport: to?.value,
        Passengers:passengerlists,
        departureDate:depart?.value,
        arrivalDate:rreturn?.value,
        ticketType:1,
        actionflag:1,
        req_id:0
      };
      this.apicall.AddFamilyAirticketDetails(data).subscribe((res) => {  
        if(res.Errorid==1){
          this.showModal = 1;
          this.success='Book Ticket successfully!';
          this.FetchFamilyAirTicketDetails_return();    
        }
        else{
            this.showModal = 2; 
            this.failed='Failed!';     
        }
    
        this.FetchFamilyAirTicketDetails_return();  
        this.returnForm.reset(); 
      
      });
    } else {    
      this.markFormGroupTouched(this.returnForm);   
    }
  }

  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
    });
  }

  ClearOneway()
  {
    this.onywayForm.reset();
  }

  Clearreturn()
  {
    this.returnForm.reset();
  }

  passengerdetails(reqid:any,empcode:any,flag:any)
  {
    this.Activereqid = reqid;
    this.showflag = flag;
    this.apicall.ViewFamilyAirTicketDetails(reqid,empcode).subscribe(res => {
      this.passengerslist = res;
    })
  }

  RemovePassengers(memberid:any)
  {
    this.apicall.RemoveMembersFamilyAirTicket(this.Activereqid,memberid).subscribe(res => {
      if(res.Errorid==1){
        this.showModal = 1;
        this.success='Remove Member successfully!';
      }
      else{
          this.showModal = 2; 
          this.failed='Failed!';     
      }
    })
  }

  // Approve request by HR
  approveData(empcode:any,reqid:any,flag:any){
    this.Activeempcode=empcode;
    this.Activereqid=reqid;
    this.mflag=flag;

    if(this.mflag == 1){
      const approvedata = {
        reqid:this.Activereqid,
        empcode: this.Activeempcode,  
        updatedby: this.empcode,
        remarks:"",
        mflag:this.mflag 
      };
      this.apicall.ApproveFamilyAirticketDetails(approvedata).subscribe(res=>{
        if(res.Errorid=='1')
        {
          this.showModal = 1;
          this.success = "Approved Successfully";
        }
        else
        {
          this.showModal = 2;
          this.failed = "Failed";
        } 
        this.FetchFamilyAirTicketDetails();
      })
      
    }
  }

  // Reject request by HR
  onReject(){   
    const rejectdata = {
      reqid:this.Activereqid,
      empcode: this.Activeempcode,  
      updatedby: this.empcode,
      remarks:this.remarks,
      mflag:this.mflag 
    };

    this.apicall.ApproveFamilyAirticketDetails(rejectdata).subscribe(res=>{
      if(res.Errorid=='1')
        {
          this.showModal = 1;
          this.success = "Reject Request Successfully";
        }
        else
        {
          this.showModal = 2;
          this.failed = "Rejection Failed";
        } 
        this.FetchFamilyAirTicketDetails();
        this.remarks="";
    })
  }

  Activerequest(rid:any)
  {
    this.Activereqid=rid;
  }

 // Cancel request by employee
 CancelRequest(reqid: any)
 {
  this.apicall.CancelFamilyTicketRequest(reqid,this.empcode).subscribe(res=>{
    if(res.Errorid=='1')
    {
      this.showModal = 1;
      this.success = "Cancel Request successfully";
    }
    else
    {
      this.showModal = 2;
      this.failed = "Failed to cancel request";
    }
    this.FetchFamilyAirTicketDetails_oneway();
    this.FetchFamilyAirTicketDetails_return();
  })
}

download_airticket(){
  let fileurl=this.apicall.ViewAirticket(this.Activereqid,'F');
  let link = document.createElement("a");
    
     if (link.download !== undefined) {
        link.setAttribute("href", fileurl);
        link.setAttribute('target', '_blank');
        // link.setAttribute("download", "ReportFile.xlsx");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
     }
}

loadSavedPassengers(savedPassengers: string) {
  const selectedPassengerIds = savedPassengers.split(',').map(id => Number(id.trim()));

  const selectedPassengers = this.listpassengers.filter((passenger: { MEMBER_ID: number }) => {
    return selectedPassengerIds.includes(passenger.MEMBER_ID);
  });

  this.onywayFormEdit.get('epassengers')?.setValue(selectedPassengers);
}

viewrequestdtl(data:any)
{
  this.onywayFormEdit.get('eleavingfrom')?.setValue(data.DEPARTURE_AIRPORT);
  this.onywayFormEdit.get('egoingto')?.setValue(data.ARRIVAL_AIRPORT);
  const ptodate=this.datePipe.transform(data.DEPARTURE_DATE,'yyyy-MM-dd','en');
  this.onywayFormEdit.get('edeparting')?.setValue(ptodate);
  this.onywayFormEdit.get('onewayreqid')?.setValue(data.REQ_ID);

  console.log('Setting PASSENGERS:', data.PASSENGERS);

  this.loadSavedPassengers(data.PASSENGERS);
}

validateonywayFormEdit()
{
    if (this.onywayFormEdit.valid){
      this.isValid = true;
    }
    else{
      this.markFormGroupTouched(this.onywayFormEdit);
    
    }
}

Edit_Booknow_oneway()
{
  if (this.onywayFormEdit.valid) {
    const onewayreqid = this.onywayFormEdit.get('onewayreqid');
    const from = this.onywayFormEdit.get('eleavingfrom');      
    const to = this.onywayFormEdit.get('egoingto');   
    const depart = this.onywayFormEdit.get('edeparting');      
    const passenger = this.onywayFormEdit.get('epassengers')?.value  
    const passengerlist = passenger.map((item: {
      MEMBER_ID: any; id: any; 
      }) => item.MEMBER_ID).join(',');
    
    const data = {
      empcode:this.empcode,
      departureAirport:from?.value,
      arrivalAirport: to?.value,
      Passengers:passengerlist,
      departureDate:depart?.value,
      arrivalDate:null,
      ticketType:0,
      actionflag:0,
      req_id:onewayreqid?.value
    };
    this.apicall.AddFamilyAirticketDetails(data).subscribe((res) => {  
      if(res.Errorid==1){
        this.showModal = 1;
        this.success='Update successfully!';
        this.FetchFamilyAirTicketDetails_oneway();   
      }
      else{
          this.showModal = 2; 
          this.failed='Failed!';     
      }
  
      this.FetchFamilyAirTicketDetails_oneway(); 
      this.onywayFormEdit.reset(); 
    
    });
  } else {    
    this.markFormGroupTouched(this.onywayFormEdit);   
  }
}

validatereturnFormEdit()
{
  if (this.onywayFormEdit.valid){
    this.isValid = true;
  }
  else{
    this.markFormGroupTouched(this.onywayFormEdit);
  
  }
}

viewretunrequestdtl(data:any)
{
  this.returnFormEdit.get('erleavingfrom')?.setValue(data.DEPARTURE_AIRPORT);
  this.returnFormEdit.get('ergoingto')?.setValue(data.ARRIVAL_AIRPORT);
  const ptodate=this.datePipe.transform(data.DEPARTURE_DATE,'yyyy-MM-dd','en');
  this.returnFormEdit.get('erdeparting')?.setValue(ptodate);
  const rreturn=this.datePipe.transform(data.ARRIVAL_DATE,'yyyy-MM-dd','en');
  this.returnFormEdit.get('erreturn')?.setValue(rreturn);
  this.returnFormEdit.get('returnreqid')?.setValue(data.REQ_ID);

  console.log('Setting PASSENGERS:', data.PASSENGERS);

  this.loadSavedPassengersreturn(data.PASSENGERS);
}

loadSavedPassengersreturn(savedPassengers: string) {
  const selectedPassengerIds = savedPassengers.split(',').map(id => Number(id.trim()));

  const selectedPassengers = this.listpassengers.filter((passenger: { MEMBER_ID: number }) => {
    return selectedPassengerIds.includes(passenger.MEMBER_ID);
  });

  this.returnFormEdit.get('erpassengers')?.setValue(selectedPassengers);
}

Edit_Booknow_return()
{
  if (this.returnFormEdit.valid) {
    const returnreqid = this.returnFormEdit.get('returnreqid');
    const from = this.returnFormEdit.get('erleavingfrom');      
    const to = this.returnFormEdit.get('ergoingto');   
    const depart = this.returnFormEdit.get('erdeparting');
    const rreturn = this.returnFormEdit.get('erreturn'); 
    const rpassenger = this.returnFormEdit.get('erpassengers')?.value ; 
    const passengerlists = rpassenger.map((item: {
      MEMBER_ID: any; id: any; 
      }) => item.MEMBER_ID).join(','); 

    const data = {
      empcode:this.empcode,
      departureAirport:from?.value,
      arrivalAirport: to?.value,
      Passengers:passengerlists,
      departureDate:depart?.value,
      arrivalDate:rreturn?.value,
      ticketType:1,
      actionflag:0,
      req_id:returnreqid?.value
    };
    this.apicall.AddFamilyAirticketDetails(data).subscribe((res) => {  
      if(res.Errorid==1){
        this.showModal = 1;
        this.success='Update successfully!';
        this.FetchFamilyAirTicketDetails_return();    
      }
      else{
          this.showModal = 2; 
          this.failed='Failed!';     
      }
  
      this.FetchFamilyAirTicketDetails_return();  
      this.returnFormEdit.reset(); 
    
    });
  } else {    
    this.markFormGroupTouched(this.returnFormEdit);   
  }
}

ClearEditReturn()
{
  this.returnFormEdit.reset(); 
}

ClearEditOneway()
{
  this.onywayFormEdit.reset(); 
}

//Pagination team
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
const totalResults = this.AirTicketDetails.filter((employee: any) => {
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

const filteredData = this.AirTicketDetails.filter((employee: any) =>
  Object.values(employee).some((value: any) =>
    typeof value === 'string' &&
    value.toLowerCase().startsWith(this.searchInput.toLowerCase())
  )
);

const start = (this.currentPage - 1) * this.itemsPerPage + 1;
return Math.min(start, filteredData.length);
}


getEntriesEnd(): number {  
const filteredData = this.AirTicketDetails.filter((employee: any) =>
  Object.values(employee).some((value: any) =>
    typeof value === 'string' &&
    value.toLowerCase().startsWith(this.searchInput.toLowerCase())
  )
);
const end = this.currentPage * this.itemsPerPage;
return Math.min(end, filteredData.length);
}

//Pagination oneway
onewaygetTotalPages(): number {
  return Math.ceil(this.onewaytotalSearchResults / this.itemsPerPage);
}

onewaygoToPage() {
  const totalPages = Math.ceil(this.onewaytotalSearchResults / this.itemsPerPage);
  if (this.desiredPage >= 1 && this.desiredPage <= totalPages) {
    this.onewaycurrentPage = this.desiredPage;
  } else {  
    
    (<HTMLInputElement>document.getElementById("openModalButton")).click();
    this.showModal = 2; 
    this.failed='Invalid page number!'; 
    this.desiredPage=''; 
  }   
 
}
onewaygetPageNumbers(currentPage: number): number[] {
  const totalPages = Math.ceil(this.onewaytotalSearchResults / this.itemsPerPage);
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
get onewaytotalSearchResults(): number {
const totalResults = this.AirTicketDetails_oneway.filter((employee: any) => {
  return Object.values(employee).some((value: any) =>
    typeof value === 'string' && value.toLowerCase().startsWith(this.onewaysearchInput.toLowerCase())
  );
}).length;

const maxPageFiltered = Math.ceil(totalResults / this.itemsPerPage);  

if (this.onewaycurrentPage > maxPageFiltered) {
  this.onewaycurrentPage = 1; 
}

return totalResults;
}

// Function to change the current page
onewaychangePage(page: number): void { 
  this.desiredPage = '';   
  this.onewaycurrentPage = page;
  const maxPage = Math.ceil(this.onewaytotalSearchResults / this.itemsPerPage);
  if (this.onewaycurrentPage > maxPage) {
    this.onewaycurrentPage = 1;
  }        
}
onewaygetEntriesStart(): number {
if (this.onewaycurrentPage === 1) {
  return 1;
}

const filteredData = this.AirTicketDetails_oneway.filter((employee: any) =>
  Object.values(employee).some((value: any) =>
    typeof value === 'string' &&
    value.toLowerCase().startsWith(this.onewaysearchInput.toLowerCase())
  )
);

const start = (this.onewaycurrentPage - 1) * this.itemsPerPage + 1;
return Math.min(start, filteredData.length);
}


onewaygetEntriesEnd(): number {  
const filteredData = this.AirTicketDetails_oneway.filter((employee: any) =>
  Object.values(employee).some((value: any) =>
    typeof value === 'string' &&
    value.toLowerCase().startsWith(this.onewaysearchInput.toLowerCase())
  )
);
const end = this.onewaycurrentPage * this.itemsPerPage;
return Math.min(end, filteredData.length);
}

//Pagination oneway
returngetTotalPages(): number {
  return Math.ceil(this.returntotalSearchResults / this.itemsPerPage);
}

returngoToPage() {
  const totalPages = Math.ceil(this.returntotalSearchResults / this.itemsPerPage);
  if (this.desiredPage >= 1 && this.desiredPage <= totalPages) {
    this.returncurrentPage = this.desiredPage;
  } else {  
    
    (<HTMLInputElement>document.getElementById("openModalButton")).click();
    this.showModal = 2; 
    this.failed='Invalid page number!'; 
    this.desiredPage=''; 
  }   
 
}
returngetPageNumbers(currentPage: number): number[] {
  const totalPages = Math.ceil(this.returntotalSearchResults / this.itemsPerPage);
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
get returntotalSearchResults(): number {
const totalResults = this.AirTicketDetails_return.filter((employee: any) => {
  return Object.values(employee).some((value: any) =>
    typeof value === 'string' && value.toLowerCase().startsWith(this.returnsearchInput.toLowerCase())
  );
}).length;

const maxPageFiltered = Math.ceil(totalResults / this.itemsPerPage);  

if (this.returncurrentPage > maxPageFiltered) {
  this.returncurrentPage = 1; 
}

return totalResults;
}

// Function to change the current page
returnchangePage(page: number): void { 
  this.desiredPage = '';   
  this.returncurrentPage = page;
  const maxPage = Math.ceil(this.returntotalSearchResults / this.itemsPerPage);
  if (this.returncurrentPage > maxPage) {
    this.returncurrentPage = 1;
  }        
}
returngetEntriesStart(): number {
if (this.returncurrentPage === 1) {
  return 1;
}

const filteredData = this.AirTicketDetails_return.filter((employee: any) =>
  Object.values(employee).some((value: any) =>
    typeof value === 'string' &&
    value.toLowerCase().startsWith(this.returnsearchInput.toLowerCase())
  )
);

const start = (this.returncurrentPage - 1) * this.itemsPerPage + 1;
return Math.min(start, filteredData.length);
}


returngetEntriesEnd(): number {  
const filteredData = this.AirTicketDetails_return.filter((employee: any) =>
  Object.values(employee).some((value: any) =>
    typeof value === 'string' &&
    value.toLowerCase().startsWith(this.returnsearchInput.toLowerCase())
  )
);
const end = this.returncurrentPage * this.itemsPerPage;
return Math.min(end, filteredData.length);
}

}
