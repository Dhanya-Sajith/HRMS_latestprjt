import { Component, OnInit } from '@angular/core';
import { ApiCallService } from 'src/app/api-call.service';
import { LoginService } from 'src/app/login.service';
import { FormGroup, FormBuilder, FormControl, FormArray,Validators } from '@angular/forms';
import { DatePipe, JsonPipe } from '@angular/common';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-business-trip-request-admin',
  templateUrl: './business-trip-request-admin.component.html',
  styleUrls: ['./business-trip-request-admin.component.scss']
})
export class BusinessTripRequestAdminComponent implements OnInit {
  
  userSession:any = this.session.getUserSession();
  authorityflg:any =this.userSession.authorityflg;
  empcode: any=this.userSession.empcode;
  BussTripAdminForm: FormGroup;
  user:string ="personal";
  viewflag=1;
  liststatus: any;
  statustypeid= 66;
  fromdate = new FormControl();
  todate = new FormControl();
  date = new Date();
  firstDay1 = new Date(this.date.getFullYear(), this.date.getMonth(), 1);
  lastDay1 = new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0);
  firstDay=this.datePipe.transform(this.firstDay1,"yyyy-MM-dd");
  lastDay=this.datePipe.transform(this.lastDay1,"yyyy-MM-dd");
  listdates: any;
  listBusinessAdmin: any;
  desiredPage: any;
  searchInput: string='';
  itemsPerPage=10;
  currentPage=1;
  showModal: any;
  failed: any;
  listcurrency: any;
  success: any;
  selectedRequestID: any;
  selectedEmpcode: any;
  flag: any;
  listdataForAdmin: any;

  constructor(private fb: FormBuilder,private datePipe: DatePipe,private session:LoginService,private apicall:ApiCallService,private route:Router) {


    this.BussTripAdminForm = this.fb.group({

      emp_code: new FormControl ('MJ00012'),
      reqid: new FormControl ('3'),
      Onwardfile:new FormControl (''),
      Returnfile:new FormControl (''),
      accomodation:new FormControl (''),
      tofromairport:new FormControl (''),
      simcard:new FormControl (''),
      certification:new FormControl (''),
      amount:new FormControl (''),
      currency:new FormControl (''),
      insurancenoti:new FormControl (''),
      emergencyresp:new FormControl (''),
      flag:new FormControl ('1'),
      requestedby:new FormControl (this.userSession.empcode),
    })

   }

  ngOnInit(): void {

    this.ListStatus();
    this.fetchBusinesstripViewtoAdmin();
    this.ListCurrency();

    this.apicall.listFromToDates().subscribe(res=>{
      this.listdates = res;
      if(this.listdates.length > 0)
      {
        const listdatesdata = this.listdates[0];
        this.fromdate.setValue(formatDate(listdatesdata.FROM_DATE,'yyyy-MM-dd','en'));
        this.todate.setValue(formatDate(listdatesdata.TO_DATE,'yyyy-MM-dd','en'));
       // this.fmdt = formatDate(listdatesdata.FROM_DATE,'yyyy-MM-dd','en');
       // this.todt = formatDate(listdatesdata.TO_DATE,'yyyy-MM-dd','en');
      };
    })

  
  //  this.BussTripSelfForm.controls['start_date'].setValue(formatDate(this.firstDay1,'yyyy-MM-dd','en'));
  //  this.BussTripSelfForm.controls['end_date'].setValue(formatDate(this.firstDay1,'yyyy-MM-dd','en'));

  }

  teamselection(user:string){    
    this.user = user; 
   
    
    if (this.user === 'personal') {   
      this.viewflag = 0;      
     
        
    } 
    else {
 
      this.viewflag = 1;      
         
    }   
    
   }


   ListStatus()
   {
     this.apicall.listStatus(this.statustypeid).subscribe((res)=>{
       this.liststatus=res;
       })
   }


   fetchBusinesstripViewtoAdmin()
  {
    const reqstatus=-1;
    this.apicall.fetchBusinesstripViewtoAdminInLoad(this.empcode,reqstatus,this.firstDay,this.lastDay).subscribe((res)=>{
    this.listBusinessAdmin=res;
    //alert(JSON.stringify(this.listBusinessAdmin))


  })

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
const totalResults = this.listBusinessAdmin.filter((employee: any) => {
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

const filteredData = this.listBusinessAdmin.filter((employee: any) =>
  Object.values(employee).some((value: any) =>
    typeof value === 'string' &&
    value.toLowerCase().startsWith(this.searchInput.toLowerCase())
  )
);

const start = (this.currentPage - 1) * this.itemsPerPage + 1;
return Math.min(start, filteredData.length);
}


getEntriesEnd(): number {  
const filteredData = this.listBusinessAdmin.filter((employee: any) =>
  Object.values(employee).some((value: any) =>
    typeof value === 'string' &&
    value.toLowerCase().startsWith(this.searchInput.toLowerCase())
  )
);
const end = this.currentPage * this.itemsPerPage;
return Math.min(end, filteredData.length);
}


ListCurrency()
    {
      this.apicall.listCurrency().subscribe((res)=>{
        this.listcurrency=res;
        })
    }


    AdminBussTripSubmit(requestid:any,empcode:any,flag:any) 
    {

   let Onwardfile:any;
   let Returnfile:any;
   let accomodation:any;

    const Onwardfiles = (<HTMLInputElement>document.getElementById("Onwardfile")).value;
    if(Onwardfiles!=="")
    {
       Onwardfile = (<HTMLInputElement>document.getElementById("Onwardfile")).value; 
    }
    else
    {
       Onwardfile = (<HTMLInputElement>document.getElementById("Onwardfileold")).value; 
      
    }


    const Returnfiles = (<HTMLInputElement>document.getElementById("Returnfile")).value;
    if(Returnfiles!=="")
    {
       Returnfile = (<HTMLInputElement>document.getElementById("Returnfile")).value;
    }
    else
    {
       Returnfile = (<HTMLInputElement>document.getElementById("Returnfileold")).value;
    }    
    const accomodations = (<HTMLInputElement>document.getElementById("accomodation")).value;
    if(accomodations!=="")
    {
       accomodation = (<HTMLInputElement>document.getElementById("accomodation")).value;
    }
    else
    {
       accomodation = (<HTMLInputElement>document.getElementById("accomodationold")).value;    
    }
    const tofromairport = (<HTMLInputElement>document.getElementById("tofromairport")).value;
    const simcard = (<HTMLInputElement>document.getElementById("simcard")).value;
    const certification = (<HTMLInputElement>document.getElementById("certification")).value;
    const amount = (<HTMLInputElement>document.getElementById("amount")).value;
    const currency = (<HTMLInputElement>document.getElementById("currency")).value;
    const insurancenoti = (document.querySelector('input[name="insurancenoti"]:checked') as HTMLInputElement)?.value;
    const emergencyresp = (<HTMLInputElement>document.getElementById("emergencyresp")).value;
    //const markasvalue = (<HTMLInputElement>document.getElementById("formCheck11")).value;
    const checkbox = (<HTMLInputElement>document.getElementById("formCheck11"))
    const markasvalue = checkbox.checked ? checkbox.value : "0";

   // alert(markasvalue);

    const uploaddata = {
    emp_code: empcode,
    reqid: requestid,
    Onwardfile:Onwardfile,
    Returnfile:Returnfile,
    accomodation:accomodation,
    tofromairport:tofromairport,
    simcard:simcard,
    certification:certification,
    amount:amount,
    currency:currency,
    insurancenoti:insurancenoti,
    emergencyresp:emergencyresp,
    flag:flag,
    requestedby:this.userSession.empcode,
    markasvalue:markasvalue
    };

        // alert(JSON.stringify(uploaddata))
        // console.log(JSON.stringify(uploaddata))

        this.apicall.AddBussinessTripverification(uploaddata).subscribe((res)=>{
        if(res.Errorid==1)
        {
          (<HTMLInputElement>document.getElementById("openModalButtonForalert")).click();
          this.showModal = 1;
          this.success = "Saved Successfully";  
          this.fetchBusinesstripViewtoAdmin();
          this.uploadBasic(requestid,1,empcode);
          this.uploadBasic(requestid,2,empcode);
          this.uploadBasic(requestid,3,empcode);
        }
        else
        {
          (<HTMLInputElement>document.getElementById("openModalButtonForalert")).click();
          this.showModal = 1;
          this.failed = "Request Failed";  
        }
        })
      
    }


    uploadBasic(reqid:any,flag:any,ecode:any)
    {
     // alert(reqid);
      let input:any;
      if(flag==1)
      {
         input=(<HTMLInputElement>document.getElementById("Onwardfile"));
         //alert(input);
         const fdata = new FormData();
         this.onFileSelectBasic(input,reqid,ecode,flag);
      }
      if(flag==2)
      {    
        input=(<HTMLInputElement>document.getElementById("Returnfile"));
        const fdata = new FormData();
         this.onFileSelectBasic(input,reqid,ecode,flag);
      }
      if(flag==3)
      {    
        input=(<HTMLInputElement>document.getElementById("accomodation"));
        const fdata = new FormData();
         this.onFileSelectBasic(input,reqid,ecode,flag);
      }
       
    }

    onFileSelectBasic(input:any,reqid:any,ecode:any,flag:any) {
      // alert("entered in fileselect")
     
        const upflag = flag;
        if (input.files && input.files[0]) {
          
         const fdata = new FormData();
        
         fdata.append('filesup',input.files[0]);
         //alert(JSON.stringify(fdata))
       // alert("before upload api")
         this.apicall.UploadBusinesstripdoc(fdata,reqid,ecode,upflag).subscribe((res)=>{
           if(res=0)
           {
             this.showModal = 2;
            this.failed = "Document uploading failed";
           }
           
         })
     
       }
     }
  
     setSelectedvalues(requestID: any,empcode: any,flag:any) 
     {
       this.selectedRequestID = requestID;
       this.selectedEmpcode = empcode;
       this.flag = flag;
     }



     fetchdataForAdmin(emp_code:any,reqid:any,status:any)
     {
       this.apicall.fetchdataForAdmin(emp_code,reqid,status).subscribe((res)=>{
       this.listdataForAdmin=res;
     })
   
     }


    fetchBusinesstripViewtoAdminFilter()
    {
      const reqstatus = (<HTMLInputElement>document.getElementById("reqstatus")).value;
      const fromdate = (<HTMLInputElement>document.getElementById("fromdate")).value;
      const todate = (<HTMLInputElement>document.getElementById("todate")).value;
      this.apicall.fetchBusinesstripViewtoAdminInLoad(this.empcode,reqstatus,fromdate,todate).subscribe((res)=>{
      this.listBusinessAdmin=res;
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

  
}
