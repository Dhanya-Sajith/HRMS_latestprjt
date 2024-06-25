import { Component, OnInit } from '@angular/core';
import { ApiCallService } from 'src/app/api-call.service';
import { DatePipe } from '@angular/common';
import { LoginService } from 'src/app/login.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
declare var $ :any;

@Component({
  selector: 'app-holidaysettings',
  templateUrl: './holidaysettings.component.html',
  styleUrls: ['./holidaysettings.component.scss']
})
export class HolidaysettingsComponent implements OnInit {

  userSession:any = this.session.getUserSession();
  empcode: any=this.userSession.empcode;
  level: any=this.userSession.level;
  authorityflg:any =this.userSession.authorityflg;  
  companycode:any=this.userSession.companycode;
  grpname:any=this.userSession.grpname;  
  requestForm: FormGroup; 
  listCompany: any;  
  currentPage: any;  
  showModal: any;
  failed: any;  
  searchInput: string = '';  
  success:any;
  today: any;
  isFormValid!: boolean;
  holidaydate: any;
  holidaylist: any;
  isEditing: boolean = false;
  year: any= new Date().getFullYear();
  listYear: any;
  item: any;
  
  constructor(private apicall:ApiCallService,private datePipe: DatePipe,private session:LoginService,private fb: FormBuilder) { 
    this.requestForm = this.fb.group({
      company: ['-1', Validators.required],
      holiday: ['', Validators.required],
      dates: ['', Validators.required],
    });
  }

  ngOnInit(): void {   
    this.today = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    $('.date').datepicker({
      multidate: true,
      format: 'yyyy-mm-dd',
      startDate:this.today,
      todayHighlight: true,
      clearBtn: true
    });   
   
    //company combo box
    this.apicall.listCompany(12).subscribe((res) => {
       this.listCompany=res;
    });
    //year combo box
    this.apicall.FetchHolidayYear().subscribe((res) => {
      this.listYear=res;
   });
    this.Fetchholidays();
  }
  Fetchholidays(){
    this.apicall.FetchCurrentholidays(this.companycode,this.level,this.year).subscribe(res =>{
      this.holidaylist=res;
      console.log(JSON.stringify(res))
    })
  }  
  AddHoliday() {   
      const company= this.requestForm.get('company');
      const holiday= this.requestForm.get('holiday'); 
      const dates= (<HTMLInputElement>document.getElementById("holidaydate")).value;
      const dtvalues = [];      
      if (!company || !holiday || dates =='') {
        (<HTMLInputElement>document.getElementById("openModalButton")).click();
        this.showModal = 2; 
        this.failed = "Please fill in all fields!";
      }
      else{
        dtvalues.push(dates);
        const data = {
          holidayId:null,
          companyId:company.value,
          holidayName:holiday.value,
          effectiveDate:dtvalues,
          updatedBy:this.empcode,
          mflag:1          
        };
         console.log(JSON.stringify(data))      
        this.apicall.AddHolidayCalendar(data).subscribe(res =>{
         //alert(JSON.stringify(res))
          if(res.Errorid == 1)
          {
            (<HTMLInputElement>document.getElementById("openModalButton")).click();
                 this.showModal = 1;
                 this.success = "Holiday added successfully!";
          }  
        
          else if(res.Errorid==0){
            (<HTMLInputElement>document.getElementById("openModalButton")).click();
            this.showModal = 2; 
            this.failed='Failed!';      
          }
          else{
            (<HTMLInputElement>document.getElementById("openModalButton")).click();
            this.showModal = 2; 
            this.failed='Holiday already exists!'; 
          }
          this.Fetchholidays();
          //year combo box
          this.apicall.FetchHolidayYear().subscribe((res) => {
            this.listYear=res;
          });
          this.Clear();  
        });
        }
      }   
     
     Clear(){
      this.requestForm.reset();
      this.requestForm.get('company')?.setValue("-1");
      $('.date').val('').datepicker('update');
     }
     Edit(item: any): void {       
      this.holidaylist.forEach((data: {
        holidayDate: any;
        holiday: any;
        HOLIDAY_ID: any;
        isEditing: boolean; 
        }) => {
        data.holiday = (data.HOLIDAY_ID === item.HOLIDAY_ID) ? item.HOLIDAY_NAME : '';
        data.holidayDate = (data.HOLIDAY_ID === item.HOLIDAY_ID) ? this.datePipe.transform(item.EFFECTIVE_DATE , 'yyyy-MM-dd'): '';        
        data.isEditing = (data.HOLIDAY_ID === item.HOLIDAY_ID);
      });
   }
   saveChanges(item:any): void { 
    if(!item.holiday||!item.holidayDate)  {
      (<HTMLInputElement>document.getElementById("openModalButton")).click();
      this.showModal = 2; 
      this.failed = "Please fill in all fields!";
    }
    else{  
      const dtvalues = []; 
      dtvalues.push(item.holidayDate);  
     const updateData={
      holidayId:item.HOLIDAY_ID,
      companyId:item.COMPANY_ID,
      holidayName:item.holiday,
      effectiveDate:dtvalues,
      updatedBy:this.empcode,
      mflag:2      
     };
     console.log(JSON.stringify(updateData));
     this.apicall.AddHolidayCalendar(updateData).subscribe(res => {
       alert(JSON.stringify(res)); 
       if(res.Errorid==1){
        (<HTMLInputElement>document.getElementById("openModalButton")).click();
        this.showModal = 1; 
        this.success='Changes saved Successfully!';          
      }
      else if(res.Errorid==0){
        (<HTMLInputElement>document.getElementById("openModalButton")).click();
        this.showModal = 2; 
        this.failed='Failed!';      
      }
      else if(res.Errorid==3){
        (<HTMLInputElement>document.getElementById("openModalButton")).click();
        this.showModal = 2; 
        this.failed='Holiday already exists!'; 
      }
      this.Fetchholidays(); 
  
     }); 
   
      this.isEditing = false; 
    } 
   }
   Cancel(item: any) {
    //alert(JSON.stringify(item))
    item.holiday = item.HOLIDAY_NAME;
    item.holidayDate = item.EFFECTIVE_DATE;  
    item.isEditing = false;
  }
  selecteditem(item:any){
    this.item=item;   
  }
  Delete(item:any){
    const dtvalues = []; 
      dtvalues.push(item.holidayDate);  
     const updateData={
      holidayId:item.HOLIDAY_ID,
      companyId:item.COMPANY_ID,
      holidayName:item.holiday,
      effectiveDate:dtvalues,
      updatedBy:this.empcode,
      mflag:3      
     };
     console.log(JSON.stringify(updateData));
     this.apicall.AddHolidayCalendar(updateData).subscribe(res => {
      //alert(JSON.stringify(res)); 
      if(res.Errorid==1){
       (<HTMLInputElement>document.getElementById("openModalButton")).click();
       this.showModal = 1; 
       this.success='Deleted Successfully!';          
     }
     else if(res.Errorid==0){
       (<HTMLInputElement>document.getElementById("openModalButton")).click();
       this.showModal = 2; 
       this.failed='Failed!';      
     }     
     this.Fetchholidays();  
    }); 
    
  } 
  
}

