import { Component, OnInit} from '@angular/core';
import { ApiCallService } from 'src/app/api-call.service'; 
import { Router } from '@angular/router';
import { LoginService } from 'src/app/login.service';
import { FormGroup, FormControl, FormArray, FormBuilder, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';



@Component({
  selector: 'app-pre-payrollchecklist',
  templateUrl: './pre-payrollchecklist.component.html',
  styleUrls: ['./pre-payrollchecklist.component.scss']
})
export class PrePayrollchecklistComponent implements OnInit {

  userSession:any = this.session.getUserSession(); 
  empcode: any=this.userSession.empcode;
  company_code: any=this.userSession.companycode;
  listCompany: any;
  listMonth: any;
  selectAll: boolean = false;
  checkbox1: boolean = false;
  checkbox2: boolean = false;
  checkbox3: boolean = false;
  checkbox4: boolean = false;
  showModal: any;
  success: any;
  ckecklistdtl: any;
  prsts: any;
  leavests: any;
  otsts: any;
  lopsts: any;
  listchecklistdata: any;
  PROFILE: any;
  lEAVE: any;
  OT: any;
  LOP: any;
  showProgressBar = false;
  isDisabledAll = false;
  listOnloaddata: any;
  loadMonth: any;
  loadMonthdt: any;

  constructor(private session:LoginService,private apicall:ApiCallService,private route:Router) { }

  ngOnInit(): void {

    this.prsts=3;
    this.leavests=3;
    this.otsts=3;
    this.lopsts=3;

   // alert(this.company_code);

    this.apicall.DisplayloadMonth(this.company_code).subscribe((res)=>{
      this.loadMonth=res;

      this.loadMonthdt=this.loadMonth[0].TYPE_ID;
    //  alert(this.loadMonthdt)
      this.fetchonloadchecklist();

      })

    this.fetchCompanylist();
    this.fetchMonthlist();
   // this.fetchonloadchecklist();
    
     

  }

  // fetchloadmonth()
  // {
  //   this.apicall.DisplayloadMonth(this.company_code).subscribe((res)=>{
  //     this.loadMonth=res;

  //     this.loadMonthdt=this.loadMonth[0].TYPE_ID;
  //     })
  // }


  fetchonloadchecklist()
  {
    const mnth=this.loadMonthdt;
  // alert(this.loadMonthdt);
    this.apicall.fetchonloadcheckList(this.company_code,mnth).subscribe((res)=>{
    this.listOnloaddata=res;
    this.PROFILE=this.listOnloaddata[0].PROFILE;
    this.lEAVE=this.listOnloaddata[0].lEAVE;
    this.OT=this.listOnloaddata[0].OT;
    this.LOP=this.listOnloaddata[0].LOP;

   // alert(JSON.stringify( this.listOnloaddata));

        if(this.PROFILE==0  || this.PROFILE==null )
          {
            this.prsts=1;
          }
          else
          {
            this.prsts=0;
          }
    
        if(this.lEAVE==0 || this.lEAVE==null  )
          {
            this.leavests=1;
          }
          else
          {
            this.leavests=0;
          }

        if(this.OT==0  || this.OT==null  )
          {
            this.otsts=1;
          }
          else
          {
            this.otsts=0;
          }
        if(this.LOP==0 || this.LOP==null  )
          {
            this.lopsts=1;
          }
          else
          {
            this.lopsts=0;
          }


      })
  }


  fetchCompanylist()
  {
    this.apicall.FetchCompanyList(this.empcode).subscribe((res)=>{
      this.listCompany=res;
      })
  }
  fetchMonthlist()
  {
    this.apicall.DisplayAllMonths().subscribe((res)=>{
      this.listMonth=res;
      })
  }


  onSelectAllChange() {
    if (this.selectAll) {
      this.checkbox1 = true;
      this.checkbox2 = true;
      this.checkbox3 = true;
      this.checkbox4 = true;
    } else {
      this.checkbox1 = false;
      this.checkbox2 = false;
      this.checkbox3 = false;
      this.checkbox4 = false;
    }
  }

  onCheckboxChange() {
  
    if (!this.checkbox1 || !this.checkbox2 || !this.checkbox3 || !this.checkbox4) 
    {
      this.selectAll = false;
    }
    else
    {
      this.selectAll = true;
    }
  }

  runChecklist(company:any,month:any)
  {

    // this.showProgressBar = true;
    // this.prsts=2;
    // this.leavests=2;
    // this.otsts=2;
    // this.lopsts=2;

    //this.showProgressBar=true;

    const prof= this.checkbox1 ? 1 : 0;
    const leave= this.checkbox2 ? 1 : 0;
    const otcheck= this.checkbox3 ? 1 : 0;
    const lop= this.checkbox4 ? 1 : 0;
    
    if(company!="" && month!="" && ( prof!=0 || leave!=0 || otcheck!=0 || lop!=0))
    {


      const checklistData={
        company:company,
        month :month,
        profileCheck :prof,
        leaveCheck :leave,
        otCheck :otcheck,
        empclopCheck :lop,
        processedby: this.empcode 
  
      };
    
      this.showProgressBar = true;
      this.isDisabledAll = true;
      
      this.apicall.runChecklist(checklistData).subscribe((res)=>{
      this.ckecklistdtl=res;


      //alert(JSON.stringify(res));


      this.showProgressBar = false;
      this.isDisabledAll = false;

      this.PROFILE=this.ckecklistdtl[0].PROFILE;
      this.lEAVE=this.ckecklistdtl[0].lEAVE;
      this.OT=this.ckecklistdtl[0].OT;
      this.LOP=this.ckecklistdtl[0].LOP;


      if(prof!=0) 
      {
      
     
        if(this.PROFILE==0  || this.PROFILE==null )
        {
          this.prsts=1;
        }
        else
        {
          this.prsts=0;
        }
      }
      else
      {
        this.prsts=3;
      }
      
      if(leave!=0) 
      {
        if(this.lEAVE==0 || this.lEAVE==null  )
        {
          this.leavests=1;
        }
        else
        {
          this.leavests=0;
        }
      }
      else
      {
        this.leavests=3;
      }

      if(otcheck!=0) 
      {
        if(this.OT==0  || this.OT==null  )
        {
          this.otsts=1;
        }
        else
        {
          this.otsts=0;
        }
      }
      else
      {
        this.otsts=3;
      }

      if(lop!=0) 
      {
        if(this.LOP==0 || this.LOP==null  )
        {
          this.lopsts=1;
        }
        else
        {
          this.lopsts=0;
        }
      }
      else
      {
        this.lopsts=3;
      }
  
      })

    }
    else
    {
      (<HTMLInputElement>document.getElementById("openModalButtonForalert")).click();
      this.showModal = 1;
      this.success = "Please select company, month and category";
    }


  }


  // fetchChecklistrpt()
  // {
  //   const comname= (<HTMLInputElement>document.getElementById("comname")).value;
  //   const monthname = (<HTMLInputElement>document.getElementById("monthname")).value;

  //   if(comname!="" && monthname!="")
  //   {
  //   this.apicall.listchecklistdetails(comname,monthname).subscribe((res)=>{
  //   this.listchecklistdata=res;
 
  //   })
  //   }
  //   else
  //   {
  //     (<HTMLInputElement>document.getElementById("openModalButtonForalert")).click();
  //     this.showModal = 1;
  //     this.success = "Please select company and month";
  //   }


  // }


  download_to_excel()
  { 

    const comname= (<HTMLInputElement>document.getElementById("comname")).value;
    const monthname = (<HTMLInputElement>document.getElementById("monthname")).value;

   if(comname!="" && monthname!="")
    {



    this.apicall.listchecklistdetails(comname,monthname).subscribe((res)=>{
      this.listchecklistdata=res;

    

    if(this.listchecklistdata!="")
   
    {

  
      let Excelname:any;
      this.apicall.ExportToExcel(this.listchecklistdata).subscribe((res)=>{
       Excelname=res.Errormsg;
       let fileurl=this.apicall.GetExcelFile(Excelname);
       //alert(fileurl);
       let link = document.createElement("a");
         
           if (link.download !== undefined) {
          //   let url = URL.createObjectURL(blob);
             link.setAttribute("href", fileurl);
             link.setAttribute("download", "ChecklistData.xlsx");
             document.body.appendChild(link);
             link.click();
             document.body.removeChild(link);
      }
     });

    }
    else
    {
      (<HTMLInputElement>document.getElementById("openModalButtonForalert")).click();
      this.showModal = 1;
      this.success = "No data found";
    }

    })

    }
    else
    {
      (<HTMLInputElement>document.getElementById("openModalButtonForalert")).click();
      this.showModal = 1;
      this.success = "Please select company and month";
    }


 }


}
