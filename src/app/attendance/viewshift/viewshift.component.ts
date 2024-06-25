import { Component, OnInit} from '@angular/core';
import { ApiCallService } from 'src/app/api-call.service';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/login.service';
import { FormControl,FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

declare var jquery:any;
declare var $ :any;

@Component({
  selector: 'app-viewshift',
  templateUrl: './viewshift.component.html',
  styleUrls: ['./viewshift.component.scss']
})
export class ViewshiftComponent implements OnInit {

  userSession:any = this.session.getUserSession();
  empcode: any=this.userSession.empcode;
  empId: any=this.userSession.id;
  roleid:any =this.userSession.level;
  authorityflg:any =this.userSession.authorityflg;
  grpname:any=this.userSession.grpname;  

  showModal = 0;
  success:any="";
  failed:any="";

  listshift:any;
  listshiftdetails:any;  
  comboVal: any=1;
  selectedDate: any;
  dateInput: any;
  newshiftid: any;
  chkall: any;
  isChecked!: boolean;
  totalreq: any;
  totalPages: any;  
  currentPagePersonal: any;

  todayDate: any;
  weekdays: any;
  daylength: any;
  startDay: any;
  endDay: any;
  listEmployee: any;
  countryControl = new FormControl();
  checkboxes: any;
  week:any;
  newshift = new FormControl();
 
  result:any;
  year!: string | null;
  shiftId: any;
  bgcolor: any;
  isFormValid:boolean=false;
  validdate!: string;
  multiselect: any;
  searchInput: string ="";
  tbempcode: any;
  effdt: any;
  shid: any;
  empstring: any;
  flag:any = 1;
  itemsPerPage=10;
  currentPage=1;
  desiredPage: any; 
  dropdownSettings:IDropdownSettings={};
  selectedItems: any = [];

  constructor(private session:LoginService,private apicall:ApiCallService,private route:Router,private datePipe:DatePipe,private fb: FormBuilder) {}

  ngOnInit(): void {
    
    if(this.grpname.includes('HR'))
    {
      this.grpname = 'HR'
    }
    else if( this.grpname == 'LM-IT-PC')
    {
      this.grpname = 'PC'
    }
    else if( this.grpname == 'LM-PC')
    {
      this.grpname = 'PC'
    }
    else if( this.grpname.includes('LM'))
    {
      this.grpname = 'LM'
    }
    this.EmployeeListFn();
    this.currentPage = 1; 
    this.currentPagePersonal =1;
    var tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    this.todayDate=this.datePipe.transform(tomorrow, 'yyyy-MM-dd');
    this.week=this.datePipe.transform(new Date(), 'w');
    this.year=this.datePipe.transform(new Date(), 'Y');
    this.weekdays = this.getDateOfWeek(this.week, this.year);

    this.apicall.listshift().subscribe((res)=>{
    this.listshift=res;
    })
    this.fetchShiftonLoad()

    this.dropdownSettings = {
      idField: 'EMP_CODE',
      textField: 'EMP_NAME',
      itemsShowLimit: 3,
      limitSelection: -1,
      allowSearchFilter: true,
      clearSearchFilter: true,
    };
    
    $('.date').datepicker({
      multidate: true,
      format: 'yyyy-mm-dd',
      startDate:this.todayDate,
      todayHighlight: true,
      clearBtn: true
    });

    this.multiselect = document.getElementById("Labeles");
      var multiselectOption = this.multiselect.getElementsByTagName('option')[0];
      multiselectOption.innerText = "All Employees";
}  

fetchShiftonLoad(){
  const fromdt=this.datePipe.transform(this.startDay, 'yyyy-MM-dd');
  const todt=this.datePipe.transform(this.endDay, 'yyyy-MM-dd');
  const data = {
    empcode :this.empcode,
    fromdate : fromdt,
    todate : todt,
    grpname : this.grpname,
    employees: 'ALL',
    mflag : this.flag,
  }
  this.apicall.Fetchshiftdetail(data).subscribe(res=>{
    this.listshiftdetails = res;
   
    })
}

// Employee List
EmployeeListFn(): void {
  this.apicall.FetchEmpUnderRole(this.grpname,this.empcode,this.flag).subscribe(res =>{
  this.listEmployee=res;
  })
}

fetchshiftdetails(){
  this.listweekdays();  
  const weekvalue= (<HTMLInputElement>document.getElementById("week")).value;

  if(weekvalue == '')
  {
      alert('Please, Select the week')
  }else{
    const empname = this.selectedItems.map((item: {
      EMP_CODE: any; id: any; 
      }) => item.EMP_CODE).join(',');
    // const firstempname = empname.split(',')[0];
    // if(empname == 'All Employees' || firstempname == 'ALL')
    // {
    //   this.empstring = 'ALL'
    // }else{
    //   this.empstring = empname;
    // }
    this.empstring = empname;
    const fromdt=this.datePipe.transform(this.startDay, 'yyyy-MM-dd');
    const todt=this.datePipe.transform(this.endDay, 'yyyy-MM-dd');
    const data = {
      empcode :this.empcode,
      fromdate : fromdt,
      todate : todt,
      grpname : this.grpname,
      employees: this.empstring,
      mflag : this.flag,
    }
    this.apicall.Fetchshiftdetail(data).subscribe(res=>{
    this.listshiftdetails = res;
    const maxPageFiltered = Math.ceil(this.listshiftdetails.length / this.itemsPerPage);  

    if (this.currentPage > maxPageFiltered) {
      this.currentPage = 1;     
    }  
    })
  }
  this.selectedItems = [];
}



listweekdays(){
  const weekvalue= (<HTMLInputElement>document.getElementById("week")).value;
  const year = weekvalue.split('-')[0];
  const week = weekvalue.split('-W')[1];
  this.weekdays = this.getDateOfWeek(week, year);
  this.daylength = this.weekdays.length;
}

filldaterange(){
  const weekvalue= (<HTMLInputElement>document.getElementById("week")).value;
  const year = weekvalue.split('-')[0];
  const week = weekvalue.split('-W')[1];
  this.datedisplay(week, year);
}

datedisplay(w:any, y:any){
  const startDays = 2 + (w - 1) * 7 - (new Date(y,0,1)).getDay();
  this.startDay = new Date(y, 0, startDays);
  const endDays = 8 + (w - 1) * 7 - (new Date(y,0,1)).getDay();
  this.endDay = new Date(y, 0, endDays);
}

getDateOfWeek(w:any, y:any) {
  let day = (2 + (w - 1) * 7); // 1st of January + 7 days for each week
  let dayOffset = new Date(y, 0, 1).getDay(); // we need to know at what day of the week the year start
  let days = [];
  const startDays = 2 + (w - 1) * 7 - (new Date(y,0,1)).getDay();
  this.startDay = new Date(y, 0, startDays);
  const endDays = 8 + (w - 1) * 7 - (new Date(y,0,1)).getDay();
  this.endDay = new Date(y, 0, endDays);
  for (let i = 0; i < 7; i++) // do this 7 times, once for every day
    days.push(new Date(y, 0, day - dayOffset + i)); // add a new Date object to the array with an offset of i days relative to the first day of the week
    return days;
}

processEmployeeWorkHour(employees:any, weekdays: Date[]) {
  return employees.map((employee: { workdays: any[]; }) => {
    employee.workdays = weekdays
      .map(day => {
        const workday = employee.workdays.find(x => x.EFFECT_DATE === day);
        // alert(JSON.stringify(employee.workdays))
        return !workday
          ? {
            EFFECT_DATE: day,
            SHIFT_ID: "O",
            START_TIME:"",
            END_TIME:"",
            SHIFT_HOURS:"",
            ABS_STATUS:""
            }
          : workday;
      })
      .sort((a, b) => a.day - b.day);
    return employee;
  });
}
  
shiftdetail(empcd:any,sid:any,sdt:any){
  this.tbempcode = empcd;
  this.shiftId = sid;
  this.effdt = sdt;
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
const totalResults = this.listshiftdetails.filter((employee: any) => {
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

const filteredData = this.listshiftdetails.filter((employee: any) =>
  Object.values(employee).some((value: any) =>
    typeof value === 'string' &&
    value.toLowerCase().startsWith(this.searchInput.toLowerCase())
  )
);

const start = (this.currentPage - 1) * this.itemsPerPage + 1;
return Math.min(start, filteredData.length);
}


getEntriesEnd(): number {  
const filteredData = this.listshiftdetails.filter((employee: any) =>
  Object.values(employee).some((value: any) =>
    typeof value === 'string' &&
    value.toLowerCase().startsWith(this.searchInput.toLowerCase())
  )
);
const end = this.currentPage * this.itemsPerPage;
return Math.min(end, filteredData.length);
}


}
