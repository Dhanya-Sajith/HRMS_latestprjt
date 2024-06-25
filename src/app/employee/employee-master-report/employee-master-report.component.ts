import { Component, OnInit } from '@angular/core';
import { ApiCallService } from 'src/app/api-call.service';
import { LoginService } from 'src/app/login.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
interface TabData {
  tabid: string;
  fieldstring: number[];
}

@Component({
  selector: 'app-employee-master-report',
  templateUrl: './employee-master-report.component.html',
  styleUrls: ['./employee-master-report.component.scss']
})
export class EmployeeMasterReportComponent implements OnInit {

  userSession:any = this.session.getUserSession();
  empcode: any=this.userSession.empcode;
  empid: any=this.userSession.id;
  companydata: any;
  deptdata: any;
  empdata: any;
  selectedCompanyid: any=-1;
  selectedEmp: any;
  dropdownSettings:IDropdownSettings={};
  dropdownSettingsDept:IDropdownSettings={};
  selectedItems_list: any = [];  
  selectedDept: any=-1;  
  tabdataC: any;
  tabdataD: any;
  tabdataS: any;
  tabdataP: any;
  tabdataN: any;
  tabdataA: any;
  tabdataF: any;
  checkedFields: any;
  checkedItems: any[] = [];
  tabid: any;
  empstring: any;
  tabdataB: any;
  showModal!: number;
  failed!: string;
  filename: any;
  selectedItems_Dept: any = [];

  constructor(private apicall:ApiCallService,private session:LoginService) { }

  ngOnInit(): void {

    this.dropdownSettings = {
      idField: 'EMP_CODE',
      textField: 'EMP_NAME',
      itemsShowLimit: 3,
      limitSelection: -1,
      allowSearchFilter: true,
      clearSearchFilter: true,
    };
    this.dropdownSettingsDept = {
      idField: 'KEY_ID',
      textField: 'DATA_VALUE',
      itemsShowLimit: 3,
      limitSelection: -1,
      allowSearchFilter: true,
      clearSearchFilter: true,      
      enableCheckAll: false,
    };
    //company combo box
    this.apicall.FetchCompanyList(this.empcode).subscribe((res) => {
      this.companydata=res;      
    });    
    //Tab data for basic info
    this.apicall.FetchMasterReportData('B').subscribe((res) => {
      this.tabdataB=res;    
      console.log(JSON.stringify(this.tabdataB))
    });
    this.apicall.FetchMasterReportData('C').subscribe((res) => {
      this.tabdataC=res;    
      console.log(JSON.stringify(this.tabdataC))
    });
    this.apicall.FetchMasterReportData('D').subscribe((res) => {
      this.tabdataD=res;    
      console.log(JSON.stringify(this.tabdataD))
    });
    this.apicall.FetchMasterReportData('S').subscribe((res) => {
      this.tabdataS=res;    
      console.log(JSON.stringify(this.tabdataS))
    });
    this.apicall.FetchMasterReportData('P').subscribe((res) => {
      this.tabdataP=res;    
      console.log(JSON.stringify(this.tabdataP))
    });
    this.apicall.FetchMasterReportData('N').subscribe((res) => {
      this.tabdataN=res;    
      console.log(JSON.stringify(this.tabdataN))
    });
    this.apicall.FetchMasterReportData('A').subscribe((res) => {
      this.tabdataA=res;    
      console.log(JSON.stringify(this.tabdataA))
    });
    
    this.apicall.FetchMasterReportData('F').subscribe((res) => {
      this.tabdataF=res;    
      console.log(JSON.stringify(this.tabdataF))
    });
    
  }
  onCompanySelected(selectedCompanyid: any) { 
    this.selectedCompanyid=selectedCompanyid; 
    this.selectedItems_list = []; 
    this.selectedItems_Dept =[];   
    this.apicall.FetchDepartmentList(selectedCompanyid,this.empcode).subscribe((res) => {
      this.deptdata=res; 
      this.deptdata.unshift({ KEY_ID: -1, DATA_VALUE: 'All' });
      //alert(JSON.stringify(this.deptdata))   
    });  
   
   }
 
   onDeptSelected(item:any){  
    this.selectedItems_list = [];   
    if (Array.isArray(this.selectedItems_Dept)) {
    const Dept = this.selectedItems_Dept.map((item: { KEY_ID: any;  }) => item.KEY_ID).join(',');
    
    if(!Dept){
      this.selectedItems_list = [];
      this.empdata = null;
      
    } else{  
     this.apicall.FetchEmployee(Dept,this.selectedCompanyid,this.empcode).subscribe((res) => {
      this.empdata=res;
      //alert(JSON.stringify(this.empdata))      
      });  
    } 
  }     
   }   
   ontabselected(tabid:any){  
    this.tabid= tabid;    
   }   
  
   onSubmit(): void { 
    const tabsData: TabData[] = [];

    const tabVariableNames = ['B', 'C', 'D', 'S', 'P', 'N', 'A', 'F'];

    tabVariableNames.forEach(tab => {
        const tabDataProperty = `tabdata${tab}` as keyof EmployeeMasterReportComponent; 
        if (this[tabDataProperty] && Array.isArray(this[tabDataProperty])) {
            const checkedFields = this[tabDataProperty].filter((item: { checked: any; }) => item.checked);
            if (checkedFields.length > 0) {
                const checkedTypeIDs: number[] = checkedFields.map(({ KEY_ID }: { KEY_ID: number }) => KEY_ID);
                const tabData: TabData = {
                    tabid: tab,
                    fieldstring: checkedTypeIDs
                };
                tabsData.push(tabData);
            }
        }
    });

    
    const empname = this.selectedItems_list.map((item: { EMP_CODE: any; id: any; }) => item.EMP_CODE).join(',');
    if(!empname){
      (<HTMLInputElement>document.getElementById("openModalButton")).click();
            this.showModal = 2;
            this.failed = "Please select employee!";
    }else{
    this.empstring = empname; 
    if (tabsData.length === 0) {
      (<HTMLInputElement>document.getElementById("openModalButton")).click();
            this.showModal = 2;
            this.failed = "Please select fields!";
    } else{ 
    const dataToSend = {
        tabdata: tabsData,
        empstring: this.empstring
    };

    //alert(JSON.stringify(dataToSend));
    this.apicall.WriteExcelFileEmployeeMasterReport(dataToSend).subscribe((res)=>{
      //alert(JSON.stringify(res));
      this.filename=res.Errormsg;
      let fileurl=this.apicall.GetExcelEmployeeMasterReport(res.Errormsg);
      let link = document.createElement("a");
      
        if (link.download !== undefined) {       
          link.setAttribute("href", fileurl);
          link.setAttribute("download", "");
          document.body.appendChild(link);

          link.click();
          document.body.removeChild(link);
        }
        this.clearAll();
    });

  }
  }
}
  checkAllB(event: any) {
    const isChecked = event.target.checked;
    this.tabdataB.forEach((item: { checked: any; }) => {
      item.checked = isChecked;      
    });
  }
  checkAllC(event: any) {
    const isChecked = event.target.checked;
    this.tabdataC.forEach((item: { checked: any; }) => {
      item.checked = isChecked;
    });
  }
  checkAllD(event: any) {
    const isChecked = event.target.checked;
    this.tabdataD.forEach((item: { checked: any; }) => {
      item.checked = isChecked;
    });
  }
  checkAllS(event: any) {
    const isChecked = event.target.checked;
    this.tabdataS.forEach((item: { checked: any; }) => {
      item.checked = isChecked;
    });
  }
  checkAllP(event: any) {
    const isChecked = event.target.checked;
    this.tabdataP.forEach((item: { checked: any; }) => {
      item.checked = isChecked;
    });
  }
  checkAllN(event: any) {
    const isChecked = event.target.checked;
    this.tabdataN.forEach((item: { checked: any; }) => {
      item.checked = isChecked;
    });
  }
  checkAllA(event: any) {
    const isChecked = event.target.checked;
    this.tabdataA.forEach((item: { checked: any; }) => {
      item.checked = isChecked;
    });
  }
  checkAllF(event: any) {
    const isChecked = event.target.checked;
    this.tabdataF.forEach((item: { checked: any; }) => {
      item.checked = isChecked;
    });
  }
  
    clearAll() {
      // Clear selected company and department
      this.selectedCompanyid = -1;
      this.selectedItems_Dept = [];
      this.selectedItems_list = [];
      this.empdata = null;
      this.deptdata = null;
  
      // Clear all checkboxes in each tab
      const tabVariables = ['B', 'C', 'D', 'S', 'P', 'N', 'A', 'F'];
      tabVariables.forEach(tab => {
          const tabDataProperty = `tabdata${tab}` as keyof EmployeeMasterReportComponent;
          if (this[tabDataProperty] && Array.isArray(this[tabDataProperty])) {
              this[tabDataProperty].forEach((item: { checked: any; }) => {
                  item.checked = false;
              });
          }
      });
      const allCheckboxB = document.getElementById("formCheckB") as HTMLInputElement;
      if (allCheckboxB) {
        allCheckboxB.checked = false;
      }
      const allCheckboxC = document.getElementById("formCheckC") as HTMLInputElement;
      if (allCheckboxC) {
        allCheckboxC.checked = false;
      }
      const allCheckboxD = document.getElementById("formCheckD") as HTMLInputElement;
      if (allCheckboxD) {
        allCheckboxD.checked = false;
      }
      const allCheckboxS = document.getElementById("formCheckS") as HTMLInputElement;
      if (allCheckboxS) {
        allCheckboxS.checked = false;
      }
      const allCheckboxP = document.getElementById("formCheckP") as HTMLInputElement;
      if (allCheckboxP) {
        allCheckboxP.checked = false;
      }
      const allCheckboxN = document.getElementById("formCheckN") as HTMLInputElement;
      if (allCheckboxN) {
        allCheckboxN.checked = false;
      }
      const allCheckboxA = document.getElementById("formCheckA") as HTMLInputElement;
      if (allCheckboxA) {
        allCheckboxA.checked = false;
      }
      const allCheckboxF = document.getElementById("formCheckF") as HTMLInputElement;
      if (allCheckboxF) {
        allCheckboxF.checked = false;
      }
  }
  
  }

