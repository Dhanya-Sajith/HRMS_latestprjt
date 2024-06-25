import { Component, OnInit } from '@angular/core';
import { ApiCallService } from 'src/app/api-call.service';
import { LoginService } from 'src/app/login.service';

@Component({
  selector: 'app-medical-insurance',
  templateUrl: './medical-insurance.component.html',
  styleUrls: ['./medical-insurance.component.scss']
})
export class MedicalInsuranceComponent implements OnInit {

  userSession:any = this.session.getUserSession();
  empcode: any=this.userSession.empcode;
  empId: any=this.userSession.id;
  level:any =this.userSession.level;
  authorityflg:any =this.userSession.authorityflg;
  documentname: any;
  documentid: any;
  filename: any;

  constructor(private apicall:ApiCallService,private session:LoginService) { }

  ngOnInit(): void {
    this.apicall.FetchMedicalInsurance(this.empcode).subscribe((res)=>{
      this.documentname=res[0].KEY_VALUE;
      this.documentid=res[0].KEY_ID;
    })
  }

  view_document(keyid:any,filetype:any)
  {
     
    this.apicall.GetMedicalInsuranceDocName(keyid,filetype).subscribe((res:string)=>{
      this.filename=res;      
       
    
    let fileurl=this.apicall.ViewInsuranceDocuments(keyid,this.filename);
    
    let link = document.createElement("a");        
      
    if (link.download !== undefined) {
            link.setAttribute("href", fileurl);
            link.setAttribute("target", "_blank");
            link.setAttribute("download", "ReportFile.xlsx");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
         }
        });
  }
}
