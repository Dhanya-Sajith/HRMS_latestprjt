import { Component, OnInit  } from '@angular/core';
import { ApiCallService } from 'src/app/api-call.service';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/login.service';
import { JsonPipe, formatDate } from '@angular/common';
import { FormControl,FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-employee-offboarding-action',
  templateUrl: './employee-offboarding-action.component.html',
  styleUrls: ['./employee-offboarding-action.component.scss']
})
export class EmployeeOffboardingActionComponent implements OnInit {

  userSession:any = this.session.getUserSession();
  empcode: any=this.userSession.empcode;
  companynm: any;
  employeenm: any;
  emp_code: any;
  lastwrkdt: any;
  statustypeid = 11;
  liststatus: any;
  roleids:any =this.userSession.level;
  category: any;
  listassets: any;
  offBoardingactiondtls: any;
  assetsts: any;
  searchInput: string = '';
  desiredPage: any;
  itemsPerPage=10;
  currentPage=1;
  showModal: any;
  success: any;
  failed: any;
  stsval: any;
  offBoardingactiondtlsView: any;
  reqstId: any;


  constructor(private datePipe: DatePipe,private session:LoginService,private apicall:ApiCallService,private router:Router,private fb: FormBuilder) { }

  ngOnInit(): void {

    this.companynm = localStorage.getItem('companynm');
    this.employeenm = localStorage.getItem('employeenm');
    this.emp_code = localStorage.getItem('emp_code');
    this.lastwrkdt = localStorage.getItem('lastwrkdt');
    this.stsval = localStorage.getItem('stsval');
    this.reqstId = localStorage.getItem('reqstId');

    //alert( this.reqstId);

    //alert(this.stsval)

    if(this.roleids==17 ||  this.roleids==5 ||  this.roleids==13)
      {
        this.category=1;
      }
      else if(this.roleids==10 ||  this.roleids==1)
      {
        this.category=2;
      }
  
    this.ListStatus();
    this.ListAssets();
    this.ListAssetsView();

  }

 
  ListStatus()
  {
    this.apicall.listStatus(this.statustypeid).subscribe((res)=>{
      this.liststatus=res;
      })
  }

  ListAssets()
  {
    this.assetsts=-1;
    this.apicall.ListAssetsOffboardingaction(this.emp_code,this.category,this.assetsts).subscribe((res)=>{
      this.offBoardingactiondtls=res;

     // alert(JSON.stringify(this.offBoardingactiondtls))
      })
  }

  fiterListAssets()
  {
    this.assetsts=(<HTMLInputElement>document.getElementById("statusvl")).value;
    //alert(this.assetsts)
    this.apicall.ListAssetsOffboardingaction(this.emp_code,this.category,this.assetsts).subscribe((res)=>{
      this.offBoardingactiondtls=res;
      })
  }


  ListAssetsView()
  {
    this.apicall.ListAssetsOffboardingactionview(this.emp_code,this.category,this.reqstId).subscribe((res)=>{
      this.offBoardingactiondtlsView=res;
      })
  }



  saveOffboardingAction()
  {
   
    const remarks = (<HTMLInputElement>document.getElementById("remarks")).value;
    const checkbox = (<HTMLInputElement>document.getElementById("formCheck11"));
    const markasvalue = checkbox.checked ? checkbox.value : "0";

    // Make sure to use unique IDs for asset status and return date inputs

    const assetDetails = this.offBoardingactiondtls.map((asset: { ASSET_ID: any; RECORDID: any }) => ({
        assetid: asset.ASSET_ID,
        status: (<HTMLSelectElement>document.getElementById("stsnew_"+asset.RECORDID)).value,
        returndate:(<HTMLInputElement>document.getElementById("returndt_"+asset.RECORDID)).value,
        recordid: asset.RECORDID,
    }));


    const data = {
        empcode: this.emp_code,
        updatedby: this.emp_code,
        category: this.category,
        remarks: remarks,
        completed_flag: markasvalue,
        AssetDetails: assetDetails
    };

    //alert(JSON.stringify(data));

    this.apicall.addoffboardingActions(data).subscribe((res)=>{
     // this.listcontactdetails=res;
      if(res.Errorid==1)
      {
        (<HTMLInputElement>document.getElementById("openModalButtonForalert")).click();
        this.showModal = 1;
        this.success = "Added Successfully...";
      }
      else
      {
        (<HTMLInputElement>document.getElementById("openModalButtonForalert")).click();
        this.showModal = 2;
        this.failed = "Failed";
      }

    })
   
  }



}
