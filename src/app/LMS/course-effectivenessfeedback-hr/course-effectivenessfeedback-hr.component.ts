import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiCallService } from 'src/app/api-call.service';
import { LoginService } from 'src/app/login.service';

@Component({
  selector: 'app-course-effectivenessfeedback-hr',
  templateUrl: './course-effectivenessfeedback-hr.component.html',
  styleUrls: ['./course-effectivenessfeedback-hr.component.scss']
})
export class CourseEffectivenessfeedbackHrComponent implements OnInit {
  trainingid: any;
  trainingdata: any;
  selectedstatus: any=-1;
  statuscount: any;
  submittedCount: any;
  pendingCount: any;
  totalCount: any;
  overdueCount: any;
  tabledata: any;
  searchInput: any='';
  filename: any;
  fileurl: any;

  constructor(private session:LoginService,private apicall:ApiCallService,private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.trainingid = params['Id'];
      this.apicall.GetTrainingDetails(this.trainingid).subscribe((res)=>{
        this.trainingdata=res;
        console.log(JSON.stringify(res));
      })
      this.apicall.Fetch_Effectiveness_StatusCount(this.trainingid).subscribe((res)=>{
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
      
    });
    this.filter();
  }
  filter(){
    this.apicall.Fetch_Effectiveness_DetailsFilter(this.trainingid,this.selectedstatus).subscribe((res)=>{
      this.tabledata=res;
      console.log(JSON.stringify(res));
    })
  }
  downloadtoExcel(){
    this.apicall.WriteExcelFileFeedbackEffectiveness(this.trainingid,'E').subscribe((res)=>{
      //alert(JSON.stringify(res));
      this.filename=res.Errormsg;
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

