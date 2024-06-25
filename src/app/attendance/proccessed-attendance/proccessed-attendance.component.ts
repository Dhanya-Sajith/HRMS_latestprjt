import { Component, OnInit } from '@angular/core';
import { ApiCallService } from 'src/app/api-call.service';
import { LoginService } from 'src/app/login.service';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-proccessed-attendance',
  templateUrl: './proccessed-attendance.component.html',
  styleUrls: ['./proccessed-attendance.component.scss']
})
export class ProccessedAttendanceComponent implements OnInit {

  showModal = 0;
  success:any="";
  failed:any="";

  constructor(private apicall:ApiCallService,private session:LoginService,private datepipe:DatePipe) { }

  ngOnInit(): void {
  }


  AttendanceProcessingFn()
  {
    const fromdate= (<HTMLInputElement>document.getElementById("fromdate")).value;
    const todate= (<HTMLInputElement>document.getElementById("todate")).value;
    
    if(fromdate == "" || todate == ""){

      this.showModal = 2; 
      this.failed = "Please, Select the dates"

    }else{

    const processData = {
      fromdate:fromdate,
      todate :todate,

    };

    alert(JSON.stringify(processData))
    this.apicall.AttendanceProcessingFnApi(processData).subscribe((res) => {
    //this.deptdata=res;
    if(res.Errorid==1)
    {
      this.showModal = 1; 
      this.success = "Processed Successfully"
    }
    else
    {
      this.showModal = 2; 
      this.failed = "Failed"
    }   
       
    });
  }

  }


}
