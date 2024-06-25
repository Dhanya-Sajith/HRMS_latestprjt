import { Component, OnInit } from '@angular/core';
import { ApiCallService } from 'src/app/api-call.service';
import { LoginService } from 'src/app/login.service';

@Component({
  selector: 'app-change-reporting-manager',
  templateUrl: './change-reporting-manager.component.html',
  styleUrls: ['./change-reporting-manager.component.scss']
})
export class ChangeReportingManagerComponent implements OnInit {
  userSession:any = this.session.getUserSession();  
  empcode: any=this.userSession.empcode;
  showModal: any;
  success: any;
  failed: any;
  managerlist: any;
  oldManager: any=0;
  employeelist: any;
  selectedItems: any[] = [];
  newManager: any=0;
  item: any;
    constructor(private session:LoginService,private apicall:ApiCallService) { }
  
    ngOnInit(): void {
      //Manager drop down
      this.apicall.lisprjtmngr('LM').subscribe((res)=>{
         this.managerlist=res;
      });
    }
    onManagerSelected(){
      this.apicall.FetchReportess(this.oldManager).subscribe((res)=>{
        this.employeelist = res;      
      })
    }  
      onCheckboxChange(item: any) {
          if (item.selected) {           
              this.selectedItems.push(item);
          } else {           
              const index = this.selectedItems.findIndex(selectedItem => selectedItem === item);
              if (index !== -1) {
                  this.selectedItems.splice(index, 1);
              }
          }
          console.log('Selected Items:', this.selectedItems);
      }
      getEmployeeNames(): string {
        return this.selectedItems.map((item: { EMP_NAME: any; }) => item.EMP_NAME).join('\n');
    }
    populateTextarea() {
      this.selectedItems = this.employeelist;
  }
  save(){
    if (this.oldManager == 0 || this.newManager == 0 || !this.selectedItems || this.selectedItems.length === 0) {
       (<HTMLInputElement>document.getElementById("openModalButton")).click();
        this.showModal = 2;
        this.failed = "Please select all fields!";
    }else{
      const data = {
        oldManager: this.oldManager,
        newManager: this.newManager,
        selectedEmployeeCodes: this.selectedItems.map(item => item.EMP_CODE),
        updatedby:this.empcode
    };
    console.log(JSON.stringify(data));
    this.apicall.UpdateReportingManager(data).subscribe((res)=>{
      //alert(JSON.stringify(res));
      if(res.Errorid==1){
      (<HTMLInputElement>document.getElementById("openModalButton")).click();
        this.showModal = 1;
        this.success = "Reporting manager updated successfully!";
      }
      else{
        (<HTMLInputElement>document.getElementById("openModalButton")).click();
        this.showModal = 2;
        this.failed = "Failed!";
      }
    });  
    }
  }
  clear(){
    this.oldManager = 0;
    this.newManager = 0;
    this.selectedItems=[];
    this.employeelist = [];  
  }
  }