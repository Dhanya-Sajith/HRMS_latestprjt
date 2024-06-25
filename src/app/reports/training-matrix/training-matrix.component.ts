import { Component, OnInit } from '@angular/core';
import { ApiCallService } from 'src/app/api-call.service';
import { DatePipe } from '@angular/common';
import { LoginService } from 'src/app/login.service';

@Component({
  selector: 'app-training-matrix',
  templateUrl: './training-matrix.component.html',
  styleUrls: ['./training-matrix.component.scss']
})
export class TrainingMatrixComponent implements OnInit {

  userSession:any = this.session.getUserSession();
  empcode: any=this.userSession.empcode;
  level: any=this.userSession.level;
  authorityflg:any =this.userSession.authorityflg;

  listCompany: any;
  comcode:any = -1;
  employee:any = -1;
  listemployees:any

  constructor(private apicall:ApiCallService,private datePipe:DatePipe,private session:LoginService) { }

  ngOnInit(): void {
    this.apicall.FetchCompanyList(this.empcode).subscribe((res)=>{
      this.listCompany=res;
    })
    this.EmployeeListFn();
    // this.apicall.Generate_Trainingmatrix(this.employee,this.empcode,this.comcode,0).subscribe(res =>{
    //   this.download_to_excel(res.Errormsg)
    // })
  }

  EmployeeListFn(): void {
    this.apicall.FetchEmployeeList(-1,this.comcode,this.empcode).subscribe(res =>{
      this.listemployees=res;
    })
  }

  viewReport()
  {
    this.apicall.Generate_Trainingmatrix(this.employee,this.empcode,this.comcode,0).subscribe(res =>{
      this.download_to_excel(res.Errormsg)
    })
  }

  download_to_excel(filename:any)
  { 
    let fileurl=`${this.apicall.dotnetapi}/File/GetExcelFeedbackEffectivenessData/${filename}`;
    let link = document.createElement("a");
      
    if (link.download !== undefined) {       
      link.setAttribute("href", fileurl);
      link.setAttribute("download", "");
      document.body.appendChild(link);

      link.click();
      document.body.removeChild(link)
      }
  }

}
