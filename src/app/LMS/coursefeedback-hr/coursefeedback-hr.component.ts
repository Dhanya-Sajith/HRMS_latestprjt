import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiCallService } from 'src/app/api-call.service';
import { LoginService } from 'src/app/login.service';

@Component({
  selector: 'app-coursefeedback-hr',
  templateUrl: './coursefeedback-hr.component.html',
  styleUrls: ['./coursefeedback-hr.component.scss']
})
export class CoursefeedbackHRComponent implements OnInit {
  trainingid: any;
  tabledata: any;
  searchInput: string='';
  trainingdata: any;
  statuscount: any;
  submittedCount: any;
  pendingCount: any;
  totalCount: any;
  overdueCount: any;
  selectedstatus: any=-1;
  filename: any;
  fileurl: any;

  constructor(private session:LoginService,private apicall:ApiCallService,private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.trainingid = params['Id'];
      //alert(this.trainingid)
      this.apicall.GetTrainingDetails(this.trainingid).subscribe((res)=>{
        this.trainingdata=res;
        console.log(JSON.stringify(res));
      })
      this.apicall.Fetch_Feedback_StatusCount(this.trainingid).subscribe((res)=>{
        this.statuscount=res;
        console.log(JSON.stringify(res));
        for (const item of this.statuscount) {
          switch (item.DISPLAY_FIELD) {
              case "Submitted":
                  this.submittedCount = item.VALUE_FIELD;
                  break;
              case "Pending":
                  this.pendingCount = item.VALUE_FIELD;
                  break;
              case "Total":
                  this.totalCount = item.VALUE_FIELD;
                  break;
              case "Overdue":
                  this.overdueCount = item.VALUE_FIELD;
                  break;
              default:                 
                  break;
          }
      }
      })
      this.filter();
    });   
  }
  filter(){
    this.apicall.Fetch_Feedback_DetailsFilter(this.trainingid,this.selectedstatus).subscribe((res)=>{
      this.tabledata=res;
      console.log(JSON.stringify(res));
    })
  }
  downloadtoExcel(){   
    this.apicall.WriteExcelFileFeedbackEffectiveness(this.trainingid,'F').subscribe((res)=>{
      //alert(JSON.stringify(res));
      this.filename=res.Errormsg;     
      //let fileurl=this.apicall.GetExcelFeedbackEffectivenessData(res.Errormsg);
      let fileurl=`${this.apicall.dotnetapi}/File/GetExcelFeedbackEffectivenessData/${res.Errormsg}`;
     
      let link = document.createElement("a");
      
        if (link.download !== undefined) {       
          link.setAttribute("href", fileurl);
          link.setAttribute("download", "");
          document.body.appendChild(link);
  
          link.click();
          document.body.removeChild(link);
        }       
    });
  
  }
 
}

