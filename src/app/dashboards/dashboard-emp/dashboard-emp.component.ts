import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiCallService } from 'src/app/api-call.service';
import { LoginService } from 'src/app/login.service';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-dashboard-emp',
  templateUrl: './dashboard-emp.component.html',
  styleUrls: ['./dashboard-emp.component.scss']
})
export class DashboardEmpComponent implements OnInit {

  userSession:any = this.session.getUserSession();
  empcode: any=this.userSession.empcode;
  desig:any=this.userSession.desig.split('#', 2);
  designame:any= this.desig[1]; 
  ename:any=this.userSession.name;
  company: any=this.userSession.companycode;

  date:any = new Date();
  today:any = this.datePipe.transform(this.date,"yyyy-MM-dd");
  compoffcolor:any = "#38d39f"
  compoffcolor1:any= "#38d39f"
  compoffcolor2:any
  annualcolor:any = "#54b4e4"
  annualcolor1:any= "#54b4e4"
  annualcolor2:any
  medicalcolor:any = "#e9823d"
  medicalcolor1:any= "#e9823d"
  medicalcolor2:any
  data: any;
  annual_value: any;
  annual_part: any;
  compoff_value: any;
  compoff_part: any;
  medical_value: any;
  medical_part: any;
  Attendance_today: any;
  Attendance_prev: any;

  INTIME_TODAY:any;
  OUTTIME_TODAY:any;
  INTIME_PREV:any;
  OUTTIME_PREV:any;
  REG_DATE:any;
  COMP_OFFTOT:any;
  COMP_OFFTOOK:any;
  ANNUAL_TOT:any;
  ANNUAL_TOOK:any;
  MED_TOT:any;
  MED_TOOK:any;
  ABSENCE:any;
  OVERDUECNT:any;
  MISSED_PUNCHES:any;
  isDisabled = true;
  loading = true;
  isDisabledAll = true;
  ANNIVERSARY: any;
  BIRTHDAY: any;
  hostname:any=this.apicall.dotnetapi;
  
  constructor(private apicall:ApiCallService,private session:LoginService,private route:Router, private datePipe: DatePipe,private router: Router) {}

  ngOnInit(): void {

     // Fetch or process data
    //  this.loading = true;
     // Simulate async data loading
    //  setTimeout(() => {
    //    this.loading = false;
    //  }, 2000);
   //alert('hu')
    this.apicall.FetchDashboardDetails(this.company,this.empcode).subscribe(res =>{
     // alert(JSON.stringify(res))
      this.data=res[0];
      this.loading = false;
      this.isDisabledAll = false;
      this.INTIME_TODAY =this.data.INTIME_TODAY;
      this.OUTTIME_TODAY = this.data.OUTTIME_TODAY;
      this.INTIME_PREV = this.data.INTIME_PREV;
      this.OUTTIME_PREV = this.data.OUTTIME_PREV;
      this.REG_DATE = this.data.REG_DATE;
      this.COMP_OFFTOT = this.data.COMP_OFFTOT;
      this.COMP_OFFTOOK = this.data.COMP_OFFTOOK;
      this.ANNUAL_TOT = this.data.ANNUAL_TOT;
      this.ANNUAL_TOOK = this.data.ANNUAL_TOOK;
      this.MED_TOT = this.data.MED_TOT;
      this.MED_TOOK = this.data.MED_TOOK;
      this.ABSENCE = this.data.ABSENCE;
      this.OVERDUECNT = this.data.OVERDUECNT;
      this.MISSED_PUNCHES = this.data.MISSED_PUNCHES;
      this.ANNIVERSARY = this.data.ANNIVERSARY;
      this.BIRTHDAY = this.data.BIRTHDAY;

      const cup = this.data.COMP_OFFTOOK;
      const cdown = this.data.COMP_OFFTOT;
      this.compoff_value = this.data.COMP_OFFTOOK/this.data.COMP_OFFTOT * 100;
      this.compoff_part = cup+ '/'+ cdown

      const aup = this.data.ANNUAL_TOOK;
      const adown = this.data.ANNUAL_TOT;
      this.annual_value = this.data.ANNUAL_TOOK/this.data.ANNUAL_TOT * 100;
      this.annual_part = aup+ '/'+ adown

      const mup = this.data.MED_TOOK;
      const mdown = this.data.MED_TOT;
      this.medical_value = this.data.MED_TOOK/this.data.MED_TOT * 100;
      this.medical_part = mup+ '/'+ mdown

      if(this.data.INTIME_TODAY == ""){
        this.Attendance_today = "0%"
      }else{
        this.Attendance_today = "50%"
      }

      if(this.data.INTIME_PREV == "" && this.data.OUTTIME_PREV == ""){
        this.Attendance_prev = "0%"
      }else if(this.data.INTIME_PREV != "" && this.data.OUTTIME_PREV == ""){
        this.Attendance_prev = "50%"
      }else if(this.data.INTIME_PREV != "" && this.data.OUTTIME_PREV != ""){
        this.Attendance_prev = "100%"
      }

    })

  }

  navigateToNewPage(todo: any): void {
    this.router.navigate(
      ['/todo.url'],
      { queryParams: { user: todo.scope} }
    );
  }

}
  