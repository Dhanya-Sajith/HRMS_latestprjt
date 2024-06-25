import { Component, OnInit } from '@angular/core';
import { ApiCallService } from 'src/app/api-call.service'; 
import { Router } from '@angular/router';
import { LoginService } from 'src/app/login.service'; 
import { FormGroup, FormControl, FormArray, FormBuilder, Validators } from '@angular/forms';
import { DatePipe, JsonPipe } from '@angular/common';
import * as feather from 'feather-icons';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-employeedirectory',
  templateUrl: './employeedirectory.component.html',
  styleUrls: ['./employeedirectory.component.scss']
})
export class EmployeedirectoryComponent implements OnInit {

  fetchempdirectoy: any;
  totalreqPersonal: any; 
  totalPagesPersonal!: number[];
  currentPagePersonal!: number;
  searchInput: string = '';
  userSession:any = this.session.getUserSession();
  desig:any=this.userSession.desig.split('#', 2); 
  designame:any= this.desig[0]; 
  empcode: any=this.userSession.empcode;      
  level:any=this.userSession.level; 
  grpname:any=this.userSession.grpname; 
  companycd:any=this.userSession.companycode;  
  totalreq: any;
  totalPages: any;
  hostname:any;
  fetchempcompletests: any;
  emp_Id: any;
  deactivatelist: any;
  resetloginId: any;
  showModal: any;
  success: any;
  failed: any;
  desiredPage: any;
  accescompany: any;

  constructor(private session:LoginService,private apicall:ApiCallService,private route:Router,private fb: FormBuilder,private datePipe: DatePipe) { }

  ngOnInit(): void {

 //alert(this.level);
 this.currentPage =1;
this.hostname=this.apicall.dotnetapi;
//alert(this.hostname);
 this.fetchempdirectoylist();
 this.fetchcompanyaccesslist();

  }

  currentPage = 1;
  itemsPerPage = 10; 



 fetchempdirectoylist()
 {
  this.apicall.fetchempdirectoylist(this.userSession.empcode).subscribe((res)=>{
  this.fetchempdirectoy=res;
       
    })
 }


Idpassing(emp_code:any)
{
  //alert(emp_code)
  localStorage.setItem('employee_code', emp_code);
  
}

changecosts(comsts:any)
{
  
  this.apicall.fetchemp_completests(comsts,this.userSession.empcode).subscribe((res)=>{
    this.fetchempdirectoy=res;
    const maxPageFiltered = Math.ceil(this.fetchempdirectoy.length / this.itemsPerPage);  

        if (this.currentPage > maxPageFiltered) {
          this.currentPage = 1;     
        }  
         
      })

}


cancelRegReq(emcode:any)
{
  this.emp_Id=emcode;
}



deactivateandreset(flagval:any,emp_Id:any)
{

  const deactivate_reset={
    flagval:flagval,
    emp_Id:emp_Id,
  };
 
  if(flagval==1)
  {

    this.apicall.deactivate_resetLogin(deactivate_reset).subscribe((res)=>{
    this.deactivatelist=res;

    //alert(JSON.stringify(res));

    if(res.Errorid==1)
    {
      (<HTMLInputElement>document.getElementById("openModalButtonForalert")).click();
      this.showModal = 1;
      this.success = "Successfully Deactivated...";
      this.fetchempdirectoylist();
    }
    
    })

  }
  else
  {
    this.apicall.deactivate_resetLogin(deactivate_reset).subscribe((res)=>{
    this.resetloginId=res; 

      if(res.Errorid==1)
      {
        (<HTMLInputElement>document.getElementById("openModalButtonForalert")).click();
        this.showModal = 1;
        this.success = "Successfully Reset The Login...";
        this.fetchempdirectoylist();
      }
      
    })

  }
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
    
    (<HTMLInputElement>document.getElementById("openModalButtonForalert")).click();
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
const totalResults = this.fetchempdirectoy.filter((employee: any) => {
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

const filteredData = this.fetchempdirectoy.filter((employee: any) =>
  Object.values(employee).some((value: any) =>
    typeof value === 'string' &&
    value.toLowerCase().startsWith(this.searchInput.toLowerCase())
  )
);

const start = (this.currentPage - 1) * this.itemsPerPage + 1;
return Math.min(start, filteredData.length);
}


getEntriesEnd(): number {  
const filteredData = this.fetchempdirectoy.filter((employee: any) =>
  Object.values(employee).some((value: any) =>
    typeof value === 'string' &&
    value.toLowerCase().startsWith(this.searchInput.toLowerCase())
  )
);
const end = this.currentPage * this.itemsPerPage;
return Math.min(end, filteredData.length);
}


fetchcompanyaccesslist()
{
  this.apicall.fetchcompanyaccess(this.userSession.empcode).subscribe((res)=>{
  this.fetchempdirectoy=res; 
  this.accescompany=this.fetchempdirectoy[0].DISPLAY_FIELD;
  //alert(this.accescompany);
  })
}

}
