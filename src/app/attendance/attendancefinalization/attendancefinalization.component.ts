import { Component, OnInit } from '@angular/core';
import { ApiCallService } from 'src/app/api-call.service';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/login.service';
import { FormControl } from '@angular/forms';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-attendancefinalization',
  templateUrl: './attendancefinalization.component.html',
  styleUrls: ['./attendancefinalization.component.scss']
})
export class AttendancefinalizationComponent implements OnInit {
  listCompany:any;
  listDepartment:any;
  listEmployee:any;
  listdates:any;
  Compname=12;
  deptypeid = 1;
  fromdate = new FormControl();
  todate = new FormControl();
  listAttendanceFnl: any;
  lopdata:any;
  fmdt:any;
  todt:any;
  userSession:any = this.session.getUserSession();
  empcode: any=this.userSession.empcode;

  constructor(private session:LoginService,private apicall:ApiCallService,private route:Router) { }

  
  ListDepByComId()
  { 
    const company_code= (<HTMLInputElement>document.getElementById("Compname")).value;
    this.apicall.listdepByComCode(company_code).subscribe(res =>{
    this.listDepartment=res;
    this.ListAttendanceFinalization();
    })
  }

  ListEmpByComIdandDep()
  {
    const comp= (<HTMLInputElement>document.getElementById("Compname")).value;
    const dep= (<HTMLInputElement>document.getElementById("dept")).value;
    this.apicall.ListEmpByComIdandDep(dep,comp).subscribe(res =>{
    this.listEmployee=res;
    this.ListAttendanceFinalization();
    })
  }

  ListAttendanceFinalization()
  {
    const comp= (<HTMLInputElement>document.getElementById("Compname")).value;
    const dep= (<HTMLInputElement>document.getElementById("dept")).value;
    const emp = (<HTMLInputElement>document.getElementById("empname")).value;

    const attFnldata = {
      company:comp,
      department: dep,
      emp_code: emp,
      from_date: this.fromdate.value,
      to_date: this.todate.value, 
      };
      
  this.apicall.listAttendancefnlData(attFnldata).subscribe(res =>{
  this.listAttendanceFnl=res;
    })
  }
FetchDates()
{
  this.apicall.listFromToDates().subscribe(res=>{
    this.listdates = res;
    if(this.listdates.length > 0)
    {
      const listdatesdata = this.listdates[0];
      this.fromdate.setValue(formatDate(listdatesdata.FROM_DATE,'yyyy-MM-dd','en'));
      this.todate.setValue(formatDate(listdatesdata.TO_DATE,'yyyy-MM-dd','en'));
      this.fmdt =formatDate(listdatesdata.FROM_DATE,'yyyy-MM-dd','en');
      this.todt = formatDate(listdatesdata.TO_DATE,'yyyy-MM-dd','en');
    };
    this.ListAttendanceFinalization();
  })
  
}

AssignLOP(empidtbl:any,empcodetbl:any,indate:any )
{

    const indt = formatDate(indate,'yyyy-MM-dd','en');
    const attendancedata = {
      empid:empidtbl,
      empCode: empcodetbl,
      indate: indt,
      updatedby: this.empcode,
      }; 
      this.apicall.AssignLOP(attendancedata).subscribe(res =>{
        
        if(res.Errorid == 1)
        {
          this.ListAttendanceFinalization();
        }
        })
}

ListDepartments()
{

  this.apicall.listDepartment(this.deptypeid).subscribe((res)=>{
    this.listDepartment=res;
    })
}
ListCompany()
{
  this.apicall.listCompany(this.Compname).subscribe((res)=>{
    this.listCompany=res;
  })
}
  ngOnInit(): void {
    this.ListCompany();
    this.ListDepartments();
    this.FetchDates();
  }
}