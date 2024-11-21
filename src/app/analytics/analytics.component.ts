import { Component, OnInit } from '@angular/core';
import { ApiCallService } from 'src/app/api-call.service';
import { LoginService } from 'src/app/login.service';
import { Chart } from 'node_modules/chart.js';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss']
})
export class AnalyticsComponent implements OnInit {
  userSession:any = this.session.getUserSession();
  empcode: any=this.userSession.empcode;
  companycode:any=this.userSession.companycode;  
  name:any=this.userSession.name;
  ActiveEmployeeCount: any;
  companydata: any;
  selectedCompanyid:any=this.companycode;
  Open_Positions_Count: any;
  DeptData: any;
  selectedDept:any=-1;
  Emp_tenure_data: any;
  private myChart!: Chart;
  labels: unknown[] | undefined;
  dataValues: any;
  selectedDeptNewHires: any=-1;
  selectedDeptAvgTrainingHrs: any=-1;
  yearlist: any;
  selectedYearNewHires: any= new Date().getFullYear();
  private NewHires!: Chart;
  NewHires_data: any;
  selectedYearTurnover: any= new Date().getFullYear();
  Turnoverdata: any;
  Turnover!: Chart;
 
  Staff_Occupancy_Data: any;
  Occupancychart!: Chart<"doughnut", any, unknown>;
  Emp_Tenure_ExcelData: any;
  openPositionsExcelData: any;
  ActiveEmpExcelData: any;
  NewHireExcelData: any;
  TurnoverExcelData: any;
  Staff_OccupancyExcelData: any;
  Performancedata: any;
  Performance: any;
  avgtrainhrs: any;
  selectedDeptAbsenteeism: any=-1;
  Overtimedata: any;
  overtime: any;
  Absenteeism: any;
  Absenteeismdata: any;
  empdata: any;
  selectedEmp: any=-1;
  selectedYearAbsenteeism: any= new Date().getFullYear();
  
  

  constructor(private apicall:ApiCallService,private session:LoginService, private datePipe: DatePipe) { }

  ngOnInit(): void {    
     //company combo box
     this.apicall.FetchCompanyList(this.empcode).subscribe((res) => {
      this.companydata=res;      
    }); 
    //Dept combo box
    this.apicall.FetchDepartmentList(this.selectedCompanyid,this.empcode).subscribe((res)=>{
      this.DeptData=res;
      //alert(JSON.stringify(res))
    }) 
    //Year list
    this.apicall.listYear().subscribe((res)=>{
      this.yearlist=res;
    });  
      
    this.ActiveEmployees();
    this.OpenPositions();
    this.onDeptChangeEmp_Tenure();  
    this.FilterNewHires(); 
    this.FilterTurnover(); 
    this.staffHouseOccupancy();
    this.FilterPerformance();
    this.AvgTrainingHrs();
    this.Overtime();
    this.FilterAbsenteeism();
    this.Employeelist();
  }
  onCompanyChange(){ 
    this.selectedDeptAbsenteeism=-1;
    this.selectedEmp=-1;
    this.selectedYearAbsenteeism= new Date().getFullYear();
    this.selectedDept=-1;
    this.selectedDeptNewHires=-1;
    this.selectedYearNewHires= new Date().getFullYear();
    this.selectedYearTurnover= new Date().getFullYear();
    this.selectedDeptAvgTrainingHrs=-1;
    this.apicall.CompanyWise_Department(this.selectedCompanyid).subscribe((res)=>{
      this.DeptData=res; 
              
      this.ActiveEmployees();
      this.OpenPositions();
      this.onDeptChangeEmp_Tenure();
      this.FilterNewHires();  
      this.FilterTurnover();
      this.FilterPerformance();
      this.AvgTrainingHrs();
      this.Overtime();
      this.FilterAbsenteeism(); 
      this.Employeelist();   
      
    });    
  }
  Employeelist(){
    //Employee list
  this.apicall.FetchEmployeeList(this.selectedDeptAbsenteeism,this.selectedCompanyid,this.empcode).subscribe((res) => {
   this.empdata=res; 
   //alert(JSON.stringify(res))     
   }); 
 }
  ActiveEmployees(){  
  this.apicall.Active_Emp_Count(this.selectedCompanyid).subscribe((res) => {
    this.ActiveEmployeeCount=res[0].VALUE_FIELD;    
  });
  }
  OpenPositions(){   
    this.apicall.Open_Positions_Count(this.selectedCompanyid).subscribe((res) => {
      this.Open_Positions_Count=res[0].VALUE_FIELD;        
    });   
    }
    onDeptChangeEmp_Tenure(){      
      this.apicall.Emp_Tenure_Chart(this.selectedCompanyid,this.selectedDept).subscribe((res)=>{
          this.Emp_tenure_data=res;
          //alert(JSON.stringify(res))
          this.Employee_tenure_chart();         
      })
    }
    FilterNewHires() {
      this.apicall.NewHire_MonthWise_Chart(this.selectedCompanyid, this.selectedDeptNewHires, this.selectedYearNewHires).subscribe((res) => {
        this.NewHires_data = res;
        //alert(JSON.stringify(res))    
        if (this.NewHires) {
          this.NewHires.destroy();
        }
    
        const labels = this.NewHires_data.map((item: { DISPLAY_FIELD: any; }) => item.DISPLAY_FIELD);
        const dataValues = this.NewHires_data.map((item: { VALUE_FIELD: any; }) => item.VALUE_FIELD);
    
        this.NewHires = new Chart("NewHireChart", {
          type: 'bar', // Use 'bar' for vertical bars
          data: {
            labels: labels, // x-axis labels
            datasets: [{
              label: 'Count of Employees',
              data: dataValues, // values for the bars
              borderWidth: 1,
              backgroundColor: '#0ab39c', // Green color
              borderColor: '#0ab39c', // Darker green for border
              barThickness:25
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              x: {
                beginAtZero: true
              },
              y: {
                beginAtZero: true
              }
            }
          }
        });
        const chartContainer:any = document.getElementById("NewHireChart")?.parentNode; // Get the parent node of the canvas
        chartContainer.style.height = "270px";
        chartContainer.style.width = "100%";
      });
    }
    FilterTurnover() {
      this.apicall.Turnover_MonthWise_Chart(this.selectedCompanyid, this.selectedYearTurnover).subscribe((res) => {
        this.Turnoverdata = res;
        //alert(JSON.stringify(res))
    
        if (this.Turnover) {
          this.Turnover.destroy();
        }
    
        const labels = this.Turnoverdata.map((item: { COMPANYCODE: any; }) => item.COMPANYCODE);
        const dataValues = this.Turnoverdata.map((item: { MANHOURS: any; }) => item.MANHOURS);
    
        this.Turnover = new Chart("TurnoverChart", {
          type: 'line', // Change to line chart
          data: {
            labels: labels, // x-axis labels
            datasets: [{
              label: 'Count of Employees',
              data: dataValues, // values for the line
              borderWidth: 2, // Line width
              borderColor: '#f7b84b', // Dark green color for line
              backgroundColor: '#f7b84b', // Light green for area under the line
              fill: false // Fill area under the line
            }]
          },
          options: {
            scales: {
              x: {
                beginAtZero: true
              },
              y: {
                beginAtZero: true
              }
            }
          }
        });
      });
    }
    staffHouseOccupancy() {
      this.apicall.Staff_Occupancy_Chart().subscribe((res) => {
        this.Staff_Occupancy_Data = res[0].MANHOURS;
        //alert(JSON.stringify(this.Staff_Occupancy_Data)); 
       
      });
    }  
    FilterPerformance() {     
      this.apicall.Average_Performance_Chart(this.selectedCompanyid).subscribe((res) => {
         this.Performancedata = res;
         //alert(JSON.stringify(res))     
       
        if (this.Performance) {
          this.Performance.destroy();
        }    
        const labels = this.Performancedata.map((item: { HEADCOUNT: any; }) => item.HEADCOUNT);
        const dataValues = this.Performancedata.map((item: { MANHOURS: any; }) => item.MANHOURS);
    
        this.Performance = new Chart("PerformanceChart", {
          type: 'line', 
          data: {
            labels: labels, // x-axis labels
            datasets: [{
              label: 'Average score',
              data: dataValues, // values for the line
              borderWidth: 2, // Line width
              borderColor: '#54b4e4', // color for line
              backgroundColor: '#cce6ff', //  for area under the line
              fill: true ,// Fill area under the line
              pointRadius: 0 ,// No markers at data points
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false, // Prevent aspect ratio constraints
            scales: {
              x: {
                beginAtZero: true
              },
              y: {
                beginAtZero: true
              }
            }
          }
          
        });
        const chartContainer:any = document.getElementById("PerformanceChart")?.parentNode; // Get the parent node of the canvas
        chartContainer.style.height = "250px"; // Set desired height (e.g., 400px)
        chartContainer.style.width = "100%"; 
      });
    }
    
    AvgTrainingHrs(){
      this.apicall.AvgTrainingHours_Chart(this.selectedCompanyid,this.selectedDeptAvgTrainingHrs).subscribe((res)=>{
        this.avgtrainhrs=res[0].AVG_HOURS;
        //alert(JSON.stringify(res))
      })

    }
    Employee_tenure_chart() {   
      
      if (this.myChart) {
        this.myChart.destroy();
      }   
      this.labels = this.Emp_tenure_data.map((item: { DISPLAY_FIELD: any; }) => item.DISPLAY_FIELD);
      this.dataValues = this.Emp_tenure_data.map((item: { VALUE_FIELD: any; }) => item.VALUE_FIELD);
     
      this.myChart =new Chart("myChart", {
        type: 'bar', // Use 'bar' for horizontal bars
        data: {
          labels: this.labels, // y-axis labels
          datasets: [{
            label: 'Count of Employees',
            data: this.dataValues, // values for the bars
            borderWidth: 1,
            backgroundColor: '#54b4e4', // Customize color
            borderColor: 'rgba(75, 192, 192, 1)' // Customize border color
          }]
        },
        options: {
          indexAxis: 'y', 
          scales: {
            x: {
              beginAtZero: true
            },
            y: {
              beginAtZero: true
            }
          }
        }
      });
    }
    Overtime() {     
      this.apicall.AvgOvertime_MonthlyChart(this.selectedCompanyid).subscribe((res) => {
         this.Overtimedata = res;
         //alert(JSON.stringify(res))     
       
        if (this.overtime) {
          this.overtime.destroy();
        }    
        const labels = this.Overtimedata.map((item: { MONTH: any; }) => item.MONTH);
        const dataValues = this.Overtimedata.map((item: { DATA: any; }) => item.DATA);
    
        this.overtime = new Chart("OvertimeChart", {
          type: 'bar', // Use 'bar' for vertical bars
          data: {
            labels: labels, // x-axis labels
            datasets: [{
              label: 'Average Overtime hours',
              data: dataValues, // values for the bars
              borderWidth: 1,
              backgroundColor: '#f7b84b', // Green color              
              borderColor: '#f7b84b', // Darker green for border
              barThickness: 30
            }]
          },
          options: {
            // No need for indexAxis for vertical bars
            scales: {
              x: {
                beginAtZero: true
              },
              y: {
                beginAtZero: true
              }
            }
          }
        });
      });
    }
    onDeptAbsenteeism(){
      this.Employeelist();
      this.selectedEmp=-1;
      this.FilterAbsenteeism();
    }
    FilterAbsenteeism(){      
      this.apicall.AbsentRate_Chart(this.selectedCompanyid,this.selectedDeptAbsenteeism,this.selectedYearAbsenteeism,this.selectedEmp).subscribe((res) => {
        this.Absenteeismdata = res;
        //alert(JSON.stringify(res))     
      if (this.Absenteeism) {
        this.Absenteeism.destroy();
      }   
      this.labels = this.Absenteeismdata.map((item: { MONTH: any; }) => item.MONTH);
      this.dataValues = this.Absenteeismdata.map((item: { DATA: any; }) => item.DATA);
     
      this.Absenteeism =new Chart("AbsenteeismChart", {
        type: 'bar', // Use 'bar' for horizontal bars
        data: {
          labels: this.labels, // y-axis labels
          datasets: [{
            label: 'Absenteeism rate',
            data: this.dataValues, // values for the bars
            borderWidth: 1,
            backgroundColor: '#FF8080', // Customize color
            borderColor: '#FF8080', // Customize border color
            barThickness: 10
          }]
        },
        options: {
          responsive: true,
            maintainAspectRatio: false, // Prevent aspect ratio constraints
          indexAxis: 'y', 
          scales: {
            x: {
              beginAtZero: true
            },
            y: {
              beginAtZero: true
            }
          }
        }
      });
      const chartContainer:any = document.getElementById("AbsenteeismChart")?.parentNode; // Get the parent node of the canvas
        chartContainer.style.height = "250px"; // Set desired height (e.g., 400px)
        chartContainer.style.width = "100%"; 
    });
      
    }
    DownloadToExcel(category: any) {
      if (category == 1) { // Tenure
          this.apicall.Emp_Tenure_ExcelData(this.selectedCompanyid, this.selectedDept).subscribe((res: EmployeeTenureData[]) => {
              this.Emp_Tenure_ExcelData = res;
              this.Emp_Tenure_ExcelData = this.Emp_Tenure_ExcelData.map(({ 
                  EMP_NAME, 
                  EMP_CODE, 
                  DEPARTMENT, 
                  TARGET_DATE, 
                  FEEDBACK_STATUS 
              }: EmployeeTenureData) => ({ 
                  'EMPLOYEE NAME':EMP_NAME, 
                  'EMPLOYEE CODE':EMP_CODE, 
                  DEPARTMENT, 
                  'DATE OF JOINING': this.datePipe.transform(TARGET_DATE, 'dd-MM-yyyy'),  
                  'TENURE': FEEDBACK_STATUS       
              }));
  
              console.log(JSON.stringify(this.Emp_Tenure_ExcelData));
              this.WritetoExcel(this.Emp_Tenure_ExcelData);
          });
      } else if (category == 2) { // Active Employees
          this.apicall.Emp_Tenure_ExcelData(this.selectedCompanyid, this.selectedDept).subscribe((res: EmployeeTenureData[]) => {
              this.ActiveEmpExcelData = res;              
              this.ActiveEmpExcelData = this.ActiveEmpExcelData.map(({ 
                  EMP_NAME, 
                  EMP_CODE, 
                  DEPARTMENT, 
                  TARGET_DATE 
              }: ActiveEmployeeData) => ({ 
                  'EMPLOYEE NAME':EMP_NAME, 
                  'EMPLOYEE CODE':EMP_CODE, 
                  DEPARTMENT,
                  'DATE OF JOINING': this.datePipe.transform(TARGET_DATE, 'dd-MM-yyyy') 
              }));
  
              console.log(JSON.stringify(this.ActiveEmpExcelData));
              this.WritetoExcel(this.ActiveEmpExcelData);    
          });
      } else if (category == 3) { // Open positions
          this.apicall.Open_Positions_ExcelData(this.selectedCompanyid).subscribe((res) => {
              this.openPositionsExcelData = res; 
              this.openPositionsExcelData = this.openPositionsExcelData.map(({ 
                EMP_NAME, 
                EMP_CODE, 
                DEPARTMENT, 
                FEEDBACK_STATUS 
            }: OpenPositionData) => ({ 
                'DESIGNATION':EMP_NAME, 
                'JOB ID':EMP_CODE, 
                 DEPARTMENT,
                'OPEN POSITIONS':FEEDBACK_STATUS,                
            }));

              this.WritetoExcel(this.openPositionsExcelData);    
          });
      }else if (category == 4) { // New Hires
        this.apicall.NewHire_ExcelData(this.selectedCompanyid,this.selectedDeptNewHires,this.selectedYearNewHires).subscribe((res) => {
            this.NewHireExcelData = res; 
            this.NewHireExcelData = this.NewHireExcelData.map(({ 
              EMP_NAME, 
              EMP_CODE, 
              DEPARTMENT, 
              MANAGER,  
              TARGET_DATE
          }: NewHireData) => ({ 
              'EMPLOYEE NAME':EMP_NAME, 
              'EMPLOYEE CODE':EMP_CODE, 
              DEPARTMENT,
              'DATE OF JOINING': this.datePipe.transform(TARGET_DATE, 'dd-MM-yyyy'), 
              'MONTH':MANAGER,                
          }));
            this.WritetoExcel(this.NewHireExcelData);    
        });
    }else if (category == 5) { // Employee turnover
      this.apicall.Turnover_ExcelData(this.selectedCompanyid, this.selectedYearTurnover).subscribe((res) => {
      
        res.forEach((item: { attiritionRate: any; Month: any; MonthID: any; }) => {            
            delete item.attiritionRate;           
            item.Month = item.MonthID;
            delete item.MonthID; 
        });        
       
      this.TurnoverExcelData = res; 
    
      this.TurnoverExcelData = this.TurnoverExcelData.map(({ 
        NoEmployee, 
        NoResignees, 
        NoNewjoinees, 
        NoTerminations,  
        currentEmployee,
        TurnoverRate,
        Month
    }: TurnoverData) => ({ 
        'Total Employees':NoEmployee, 
        'Employees Resigned':NoResignees, 
        'New Joinees':NoNewjoinees,
        'Terminations': NoTerminations, 
        'Current Employees':currentEmployee, 
        'Turnover Rate':TurnoverRate, 
        Month,                
    }));      
        
        console.log(JSON.stringify((res)))      
        this.WritetoExcel(this.TurnoverExcelData);    
      }); 
     }else if (category == 6) { // Average Performance
      this.apicall.Average_Performance_ExcelData(this.selectedCompanyid).subscribe((res) => {       
                   
          this.WritetoExcel(res);    
      });
      } else if (category == 7) { // Average training hours        
        this.apicall.EmpTrainingHours_ExcelData(this.selectedCompanyid,this.selectedDeptAvgTrainingHrs).subscribe((res) => {         
             
            this.WritetoExcel(res);    
        });
        }
      else if (category == 8) { // Staff house occupancy
      this.apicall.Staff_Occupancy_ExcelData(this.selectedCompanyid).subscribe((res) => {         
          if (Array.isArray(res)) {
              res.forEach(item => {                 
                  delete item.BONUS_AMOUNT;
                  delete item.COMPANY;
                  item.ACCOMMODATION_CODE = item.DESIGNATION;
                  delete item.DESIGNATION;
              });
          }  
          this.Staff_OccupancyExcelData = res;     
          this.WritetoExcel(this.Staff_OccupancyExcelData);    
      });
      }else if (category == 9) { // Overtime hours       
        this.apicall.MonthlyOvertime_ExcelData(this.selectedCompanyid).subscribe((res) => {         
          //alert(JSON.stringify(res));
            this.WritetoExcel(res);    
        });
        }else if (category == 10) { //Absenteeism       
          this.apicall.EmployeeAbsence_ExcelData(this.selectedCompanyid,this.selectedDeptAbsenteeism,this.selectedYearAbsenteeism,this.selectedEmp).subscribe((res) => {         
            const transformedData = res.map((item: { LEAVE_DATE: string | number | Date; }) => {
              return {
                ...item,
                LEAVE_DATE: this.datePipe.transform(item.LEAVE_DATE, 'dd-MM-yyyy')
              };
            });
              this.WritetoExcel(transformedData);    
          });
          }
       
    }
  
    WritetoExcel(ExcelData:any){     
      let Excelname:any;
      this.apicall.ExportToExcel(ExcelData).subscribe((res)=>{
       Excelname=res.Errormsg;
       let fileurl=this.apicall.GetExcelFile(Excelname);
       let link = document.createElement("a");
         
           if (link.download !== undefined) {          
             link.setAttribute("href", fileurl);
             link.setAttribute("download", "ReportFile.xlsx");
             document.body.appendChild(link);
             link.click();
             document.body.removeChild(link);
      }
     });
     
    }
  
}
interface EmployeeTenureData {
  EMP_NAME: string;
  EMP_CODE: string;
  DEPARTMENT: string;
  TARGET_DATE: string;
  FEEDBACK_STATUS: string;
 
}
interface ActiveEmployeeData {
  EMP_NAME: string;
  EMP_CODE: string;
  DEPARTMENT: string;
  TARGET_DATE: string;  
}
interface OpenPositionData {
  EMP_NAME: string;
  EMP_CODE: string;
  DEPARTMENT: string;
  FEEDBACK_STATUS: string;  
}
interface NewHireData {
  EMP_NAME: string;
  EMP_CODE: string;
  DEPARTMENT: string;
  MANAGER: string;  
  TARGET_DATE: string;
}
interface NewHireData {
  EMP_NAME: string;
  EMP_CODE: string;
  DEPARTMENT: string;
  MANAGER: string;  
  TARGET_DATE: string;
}
interface TurnoverData  {
  NoEmployee: number;
  NoResignees: number;
  NoNewjoinees: number;
  NoTerminations: number;
  currentEmployee: number;
  TurnoverRate: number;
  Month: string;
}

