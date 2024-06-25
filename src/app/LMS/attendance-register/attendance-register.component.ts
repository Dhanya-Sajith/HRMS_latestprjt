import { Component, OnInit } from '@angular/core';
import { ApiCallService } from 'src/app/api-call.service';
import { LoginService } from 'src/app/login.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-attendance-register',
  templateUrl: './attendance-register.component.html',
  styleUrls: ['./attendance-register.component.scss']
})
export class AttendanceRegisterComponent implements OnInit {

  trainingid: any;
  tabledata: any;  
  empCodeStr: string='';
  showModal: number=0;
  success!: string;
  failed!: string;
  searchInput: string='';
  disablesubmit: boolean=false;

  constructor(private session:LoginService,private apicall:ApiCallService,private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.trainingid = params['Id'];
      //alert(this.trainingid)
      this.apicall.FetchMarkAttendanceTraining(this.trainingid).subscribe((res)=>{
        this.tabledata=res;
        console.log(JSON.stringify(res));
      })
    });    
  } 
  checkAll(event: any) {
    const isChecked = event.target.checked;
    this.tabledata.Employees.forEach((item: { checked: any; }) => {
      item.checked = isChecked;
    });
  }
  validate(){
    const checkedFields = this.tabledata.Employees.filter((item: { checked: any; }) => item.checked);
    if (checkedFields.length == 0) {
      (<HTMLInputElement>document.getElementById("openModalButton")).click();
            this.showModal = 2;
            this.failed = "Please mark attendance!";
    }else{
      (<HTMLInputElement>document.getElementById("cancelModalButton")).click();

    }
  }
  submit() {
    const checkedFields = this.tabledata.Employees.filter((item: { checked: any; }) => item.checked);
     
        const checkedTypeIDs: string[] = checkedFields.map(({ EMP_CODE }: { EMP_CODE: number }) => EMP_CODE);
              this.empCodeStr = checkedTypeIDs.join(',');    
       
    const data={
      empcode_str:this.empCodeStr,      
      training_id:this.trainingid
    }
    console.log(JSON.stringify(data));
    this.apicall.AddTrainingAttendance(data).subscribe((res)=>{
      if(res.Errorid==1){
        (<HTMLInputElement>document.getElementById("openModalButton")).click();
        this.showModal = 1;
        this.success = "Attendance marked successfully!";
        this.disablesubmit=true;
       }
       else{
        (<HTMLInputElement>document.getElementById("openModalButton")).click();
        this.showModal = 2;
        this.failed = "Failed!";
       }
    })
  
}
clearAll() {
  this.tabledata.Employees.forEach((item: { checked: boolean; }) => {
      item.checked = false;
  });
  const selectAllCheckbox = document.getElementById('formCheck11') as HTMLInputElement;
    if (selectAllCheckbox) {
        selectAllCheckbox.checked = false;
    }
}
}

