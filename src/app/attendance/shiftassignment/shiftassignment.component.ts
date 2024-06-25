  import { Component, OnInit } from '@angular/core';
  import { ApiCallService } from 'src/app/api-call.service';
  import { FormGroup , FormBuilder , FormControl , Validators } from '@angular/forms';
  import { DatePipe } from '@angular/common';
  import { LoginService } from 'src/app/login.service';
  import { IDropdownSettings } from 'ng-multiselect-dropdown';
  
  declare var $ :any;
  
  @Component({
    selector: 'app-shiftassignment',
    templateUrl: './shiftassignment.component.html',
    styleUrls: ['./shiftassignment.component.scss']
  })
  export class ShiftassignmentComponent implements OnInit {
    
    userSession:any = this.session.getUserSession();
    empcode: any=this.userSession.empcode;
    empId: any=this.userSession.id;
    level:any =this.userSession.level;
    authorityflg:any =this.userSession.authorityflg;
    grpname:any=this.userSession.grpname; 
  
    listCompany: any;
    dropdownSettings:IDropdownSettings={};
    selectedItems: any = [];
    selectedItems_list: any = [];
    title:any
    startdt:any
    enddt:any
    showModal = 0;
    success:any="";
    failed:any="";
    liststatus: any;
    isChecked: boolean = true ;
    selectID: any;
    selectcmp: any = -1
    selectstatus: any = -1
    desiredPage: any;
    searchInput: string='';
    itemsPerPage=10;
    currentPage=1;
    Remarks: any;
  
    flag:any = 2;
    listEmployee: any;
    todayDate: any;
    listshift: any = -1;
    shiftdt:any
    AddShiftForm: FormGroup; 
    EditShiftForm: FormGroup; 
    isFormValid:boolean=false;
    validdate!: string;
    listshiftdetails: any;
  
    weekdays: any;
    daylength: any;
    startDay: any;
    endDay: any;
    week:any;
    year:any
    shid: any;
    tbempcode: any;
    effdt: any;
    shiftId: any;
    empstring: any;
    multiselect: any;
  
    constructor(private apicall:ApiCallService, private datePipe: DatePipe,private fb:FormBuilder,private session:LoginService) { 
      this.AddShiftForm = this.fb.group({
        addnewshift: ['-1', Validators.required]
      });
      this.EditShiftForm = this.fb.group({
        newshift: ['-1', Validators.required]
      });
    }
  
    ngOnInit(): void {
      if(this.grpname.includes('HR'))
      {
        this.grpname = 'HR'
      }
      else if(this.grpname.includes('PC'))
      {
        this.grpname = 'PC'
      }
      var tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate());
      this.todayDate=this.datePipe.transform(tomorrow, 'yyyy-MM-dd');
      this.week=this.datePipe.transform(new Date(), 'w');
      this.year=this.datePipe.transform(new Date(), 'Y');
      this.weekdays = this.getDateOfWeek(this.week, this.year);
  
      this.apicall.listshift().subscribe((res)=>{
        this.listshift=res;
      })
  
      this.EmployeeListFn();
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
  
    fetchshiftdetails(){
      this.listweekdays();  
      const weekvalue= (<HTMLInputElement>document.getElementById("week")).value;
    
     if(weekvalue == '')
     {
        alert('Please, Select the week')
     }else{
      const empname = this.selectedItems_list.map((item: {
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
        })
      }
      this.selectedItems_list = [];
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
  
  
    shiftdetail(empcd:any,sid:any,sdt:any){
      this.tbempcode = empcd;
      this.shiftId = sid;
      this.effdt = sdt;
    }
  
    EmployeeListFn(): void {
      this.apicall.FetchEmpUnderRole(this.grpname, this.empcode, this.flag).subscribe(res => {
        this.listEmployee = res;
      })
    }
  
    selectremarks(reason:string){
      this.Remarks=reason;
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
  
    Addshift(){
      const empname = this.selectedItems.map((item: {
        EMP_CODE: any; id: any; 
        }) => item.EMP_CODE).join(',');
      
      const shiftdt= (<HTMLInputElement>document.getElementById("shiftdate")).value;
      const shift= (<HTMLInputElement>document.getElementById("shift")).value;
      const empvalues = [];
      const dtvalues = [];
    
      if(empname == '' || shiftdt == "" || shift == "-1")
      {
        this.showModal = 2; 
        this.failed = "Please, Fill the fields";
      }
      else{
        empvalues.push(empname);
        dtvalues.push(shiftdt);
    
        const data = {
          empcode :this.empcode,
          shiftid :shift,
          employees:empvalues,
          shiftdates:dtvalues
        };
        this.apicall.Assign_EmpShift(data).subscribe(res=>{
          if(res.Errorid=='1')
          {
            this.showModal = 1; 
            this.success = "Shift saved successfully"
            this.fetchShiftonLoad();
          }
          else
          {
            this.showModal = 2;
            this.failed = "Failed";
          }
  
          this.Cancel();
          }) 
          
        }
      }
  
    Cancel()
    {
      (<HTMLInputElement>document.getElementById("shiftdate")).value = "";
      // $('.date').val('').datepicker('update');
      (<HTMLInputElement>document.getElementById("shift")).value = "-1";
      this.selectedItems = [];
    }
  
    setSelectedID(code:any){
      this.selectID = code;
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
  
  
  editvalidateForm() {
    if (this.EditShiftForm.valid){
    this.isFormValid = true;
    }
    else{
      this.markFormGroupTouched(this.EditShiftForm);
    }
  }
  
  EditSingleShift(){
  
    if (this.EditShiftForm.valid) {
    const editshiftID = this.EditShiftForm.get('newshift')?.value;
    if(editshiftID == 0){
      this.shid = editshiftID;
    }else{
      this.shid = editshiftID.VALUE_FIELD;
    }
    const singleedit = {
      updatedby :this.empcode,
      shiftid :this.shid,
      empcode:this.tbempcode,
      effectdate:this.datePipe.transform(this.effdt, 'yyyy-MM-dd'),
      actionflag:2
    };
    this.apicall.AddEdit_SingleShift(singleedit).subscribe(res=>{
      if(res.Errorid=='1')
      {
        this.showModal = 1; 
        this.success = "Shift updated successfully"
        this.fetchShiftonLoad();
      }
      else
      {
        this.showModal = 2;
        this.failed = "Failed";
      }
      this.EditShiftForm.reset();
    }) 
    }else{
      this.markFormGroupTouched(this.EditShiftForm);   
    }
  }
  
  validateForm() {
    if (this.AddShiftForm.valid){
    this.isFormValid = true;
    }
    else{
      this.markFormGroupTouched(this.AddShiftForm);
    }
  }
  
  AddSingleShift(){
    if (this.AddShiftForm.valid) {
      const addshiftID = this.AddShiftForm.get('addnewshift')?.value
      if(addshiftID == 0){
        this.shid = addshiftID;
      }else{
        this.shid = addshiftID.VALUE_FIELD;
      }
      const singleadd = {
        updatedby :this.empcode,
        shiftid : this.shid,
        empcode:this.tbempcode,
        effectdate:this.datePipe.transform(this.effdt, 'yyyy-MM-dd'),
        actionflag:1
      };
      this.apicall.AddEdit_SingleShift(singleadd).subscribe(res=>{
        if(res.Errorid=='1')
        {
          this.showModal = 1; 
          this.success = "Shift saved successfully"
          this.fetchShiftonLoad();
        }
        else
        {
          this.showModal = 2;
          this.failed = "Failed";
        }
        this.AddShiftForm.reset();
      }) 
      }else{
        this.markFormGroupTouched(this.AddShiftForm);   
      }
  }
  
  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
    });
  }
  
  }
  
  
  
  
