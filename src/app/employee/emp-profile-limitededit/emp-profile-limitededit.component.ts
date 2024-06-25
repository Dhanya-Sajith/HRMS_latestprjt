import { Component, OnInit,HostListener } from '@angular/core';
import { ApiCallService } from 'src/app/api-call.service'; 
import { Router } from '@angular/router';
import { LoginService } from 'src/app/login.service';
import { FormGroup, FormControl, FormArray, FormBuilder, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { DatePipe, JsonPipe } from '@angular/common';
import { formatDate } from '@angular/common';
//import { ChangeTrackingService } from '../change-tracking.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-emp-profile-limitededit',
  templateUrl: './emp-profile-limitededit.component.html',
  styleUrls: ['./emp-profile-limitededit.component.scss']
})
export class EmpProfileLimitededitComponent implements OnInit {

  
  item:any;
  Changeflag:any=0;
  activeDiv="Basic-Information";
  empBasicForm: FormGroup;
  empContactForm:FormGroup;
  empdocumentForm:FormGroup;
  bankSalaryForm:FormGroup;
  empAssetForm:FormGroup;
  empNomineeForm:FormGroup;
  EducationForm:FormGroup;
  ExperienceForm:FormGroup;
  certificatesForm:FormGroup;
  languagesForm:FormGroup;
  SalaryForm:FormGroup;
  empOtherForm:FormGroup; 
  checkboxOptions = ['Option 1', 'Option 2', 'Option 3']; // Your checkbox options
  listCompany:any;
  comtypeid=12;
  listemprole:any;
  roleid=31;
  employeecodedisp:any;
  form: any;
  listDepartment:any;
  deptypeid=1;
  worklocid=32;
  listWorklocation:any;
  listDesignation:any;
  desigid=2;
  listGrade:any;
  gradeid=8;
  listEmptype:any;
  emptypeid=21;
  listshift:any;
  listCountry:any;
  listWeekoff:any;
  weekoffId=33;
  submitted:boolean = false;
  contsubmitted:boolean = false;
  docsubmitted:boolean = false;
  banksalsubmitted:boolean = false;
  assetssubmitted:boolean = false;
  nomineesubmitted:boolean = false;
  educationsubmitted:boolean = false;
  experiencesubmitted:boolean = false;
  certisubmitted:boolean = false;
  langsubmitted:boolean = false;
  famdetails:boolean = false;
  insuranceid=7;
  listinsurancetype:any;
  prmngr_roleid = 'LM';
  coord_roleid = 'PC';
  listprjtmngr:any;
  listcoordinators:any;
  genderid=5;
  listgender:any;
  maritalid=6;
  listmaritalsts:any;
  listsponsordtl:any;
  sponsorid=35;
  accomodationid=34;
  listaccomodationtype:any;
  workingdaysid=9;
  listworkingdays:any;
  airticketid=36;
  listairticketeligibility:any;
  contdtl:boolean = true;
  perrate:boolean = true;
  userSession:any = this.session.getUserSession();
  grpname:any=this.userSession.grpname;  
  empcode: any=this.userSession.empcode;
  gradeids:any;
  desig:any=this.userSession.desig.split('#', 2); 
  designame:any= this.desig[1];  
  weekoff= new FormControl();
  editedCost=new FormControl();
  ffname=new FormControl();
  employe_code=new FormControl();
  selectedOptions:any;
  public editable: boolean = false;
  listbanknames:any;
  listbankdet:any;
  assetscategoryid=10;
  assetsstatusid=11;
  listassetscat:any;
  listassetssts:any;
  selectValue = "-1";
  textBoxValue: any;
  isEditing: boolean = false;
  isnomEditing: boolean = false;
  iseduEditing: boolean = false;
  iseWorkExpEditing: boolean = false;
  iscertiEditing: boolean = false;
  islangEditing: boolean = false;
  isallowanceEdit: boolean = false;
  isdocsedit: boolean = false;
  isfamedit: boolean = false;
  data: any[] = [];
  newData: any;
  employeeassetsdisp: any;
  employeeassetsdispcost: any;
  listassetsdetails: any;
 
  editedcost:any;
  event: any;
  showModal: any;
  success: any;
  listeducation: any;
  listfieldofstudy: any;
  listjobtitle: any;
  listexperience: any;
  listlanguages: any;
  listproficiency: any;
  relationid=37;
  educationid=38;
  fieldid=39;
  jobtitleid=40;
  experience=41;
  languagesid=42;
  proficiencyid=43;
  contractorid=51;
  listrelation: any;
  assetsmsg: any;
  showAlert: boolean = false;
  message: any;
  divElement: any;
  listsalarycomp: any;
  salcompid=44;
  employeenomineedata: any;
  listnomineedetails: any;
  listprofesionaldtls: any;
  fetcheducationdtl: any;
  fetchworkexpdtl: any;
  fetchcertidtl: any;
  fetchlangdtl: any;
  listbasicdtl: any;
  idval: any;
  a: any;
  listcontactdetails: any;
  listnonactiveEmp: any;
  activeEmp: any;
  nonactiveEmp: any;
  errid: any;
  errorsts: any;
  docsdtlsdisp: any;
  bankdtlsdisp: any;
  listsalarydtls: any;
  employee_code: any;
  dispbasicdet: any;
  displayallowancedtls: any;
  fetchbankdtls: any;
  fetchcontactdtl: any;
  fetchdocdetails: any;
  sum: any;
  passfile: any;
  visafile: any;
  emifile: any;
  licencefile: any;
  contractfile: any;
  //employee_code='MT00003';
  //ecode: any;
 // employee_code= (<HTMLInputElement>document.getElementById("nonactiveEmp")).value;
  //alert(nonactiveEmp);

  docitems: string[] = [];
  failed: any;
  changeflg:any;
  listaccomodationtypes: any;
  accomodationtype:boolean = true;
  defvalue: any;
  jdfile: any;
  msxdt: any;
  mindt: any;

  processid=45;
  paymodeid=46;
  listprocesstype: any;
  listpaymode: any;
  fetchassetnm: any;
  moduleList: any;
  flag: any;
  listmandatory: any;
  listmandatoryfield: any;
  docsvalue: any;
  e_mpcode: any;
  r_ecordid: any;
  d_octype: any;
  d_ocno: any;
  d_ocexpiry: any;

  doctypenm:any;
  mansts:any;
  profileprogress: any;
  dob: any;
  age: any;
  listallEmp: any;
  listcontractor: any;

  eduflag: any;
  fieldflag: any;
  jobflag:any
  fieldvalue1: any;
  fieldvalue2: any;
  fieldvalue3: any;
  uploadflag: any=0;
  pfl: any;

  empcdd = localStorage.getItem('empl_code');
  frommypro = localStorage.getItem('myprof');

  em_pcode: any;
  isInsuranceChecked1:boolean = false;
  isAirticketChecked1:boolean = false;
  isvisaChecked1:boolean = false;
  urlval: any;
  listfamilydetails: any;
  gr_ade:any=this.userSession.gradeid; 

  listfamilysts: any;
  insuranceval: any;
  airticketval: any;
  visaval: any;

  listCom: any;
  comdtl: any;
  resdtl: any;
  listresouce: any;
  listsessionCompany: any;
  fileSizeInKb: any;
  fileTp: any;
  

  constructor(private router: ActivatedRoute,private session:LoginService,private apicall:ApiCallService,private route:Router,private fb: FormBuilder,private datePipe: DatePipe) { 

    this.empBasicForm = this.fb.group({

      fname:new FormControl ('', [Validators.required]),
      mname:new FormControl (),
      sname:new FormControl (),
      dob: new FormControl ('', [Validators.required]),
      nationality: new FormControl ('', [Validators.required]),
      gender: new FormControl ('', [Validators.required]),
      maritalsts: new FormControl ('', [Validators.required]),
      comname: new FormControl ('', [Validators.required]),
      empcode: new FormControl ('', [Validators.required]),
      role: new FormControl (''),
      joindate: new FormControl ('', [Validators.required]),
      department: new FormControl ('', [Validators.required]),
      worklocation: new FormControl (''),
      designation: new FormControl ('', [Validators.required]),
      grade: new FormControl (''),
      reportingmngr: new FormControl ('', [Validators.required]),
      prjtcoordinator: new FormControl (''),
      probation: new FormControl ('', [Validators.pattern("^[0-9]*\.?[0-9]+$")]),
      emptype: new FormControl ('', [Validators.required]),
      contractor_dtl: new FormControl (''),
      perhrrate: new FormControl ('0', [Validators.pattern("^[0-9]*\.?[0-9]+$")]),
      sponserdtl: new FormControl ('', [Validators.required]),
      shifttime: new FormControl (''),
      workingday: new FormControl (''),
      oteligible: new FormControl (''),
      airdestination: new FormControl (''),
      aireligibility: new FormControl (''),
      companyaccomodation: new FormControl (''),
      accomodation: new FormControl (),
      weekoff:new FormControl (''),
      filejd: [null, [this.fileTypeValidator(['pdf']), this.fileSizeValidator(120)]],
      profilepic: [null, [this.fileTypeValidator(['jpg', 'jpeg']), this.fileSizeValidatorpro(120)]],
      insurancetype: new FormControl (''),
     // jobdercription: new FormControl (''),
      notperiod: new FormControl ('', [Validators.pattern("^[0-9]*\.?[0-9]+$")]),
      updatedby: new FormControl (this.userSession.empcode),
      flag:new FormControl (1),
      profilephoto:new FormControl (),
      jdfile:new FormControl (),
      companyacc: new FormControl (''),
      resourceacc: new FormControl (''),

    });



    this.empContactForm = this.fb.group({
     
      emailid: new FormControl ('',[Validators.pattern('^[^\\s@]+@[^\\s@]+\\.[^\\s@]{2,}$')]),
      permob:new FormControl ('', [Validators.required,Validators.minLength(10),Validators.maxLength(15),Validators.pattern("^[0-9]*$")]),
      resiaddrs: new FormControl ('', [Validators.required]),
      residencetel:new FormControl ('', [Validators.minLength(6),Validators.maxLength(15),Validators.pattern("^[0-9]*$")]),
      orginaddr: new FormControl ('', [Validators.required]),
      orgincontct:new FormControl ('', [Validators.required,Validators.minLength(10),Validators.maxLength(15),Validators.pattern("^[0-9]*$")]),
      localcontact: new FormControl ('', [Validators.required]),
      localmob:new FormControl ('', [Validators.required,Validators.minLength(10),Validators.maxLength(15),Validators.pattern("^[0-9]*$")]),
      localrel: new FormControl ('', [Validators.required]),
      nameoforgincontact: new FormControl ('', [Validators.required]),
      emercontact:new FormControl ('', [Validators.required,Validators.minLength(10),Validators.maxLength(15),Validators.pattern("^[0-9]*$")]),
      relation: new FormControl ('', [Validators.required]),
      offemail: new FormControl ('',[Validators.pattern('^[^\\s@]+@[^\\s@]+\\.[^\\s@]{2,}$')]),
      offmob:new FormControl ('', [Validators.minLength(10),Validators.maxLength(15),Validators.pattern("^[0-9]*$")]),
      extensionno:new FormControl ('', [Validators.pattern("^[0-9]*$")]),
      empcode: new FormControl (''),
      updatedby: new FormControl (this.userSession.empcode),
      flag:new FormControl (2),

    });

    this.empdocumentForm = this.fb.group({

      // contractfile: new FormControl ('', [Validators.required]),
      // CECCardno: new FormControl ('', [Validators.required]),
      // updatedby: new FormControl (this.userSession.empcode),
      // flag:new FormControl (3),


      // passportno: new FormControl ('', [Validators.required]),
      // passportexpiry: new FormControl ('', [Validators.required]),
      // passportfile: new FormControl ('', [Validators.required]),

      // visanumbr: new FormControl ('', [Validators.required]),
      // visaexpiry: new FormControl ('', [Validators.required]),
      // visafile: new FormControl ('', [Validators.required]),

      // emiratesid: new FormControl ('', [Validators.required]),
      // emirateexpiry: new FormControl ('', [Validators.required]),
      // emiratefile: new FormControl ('', [Validators.required]),

      // licenceno: new FormControl (),
      // licenceexpiry: new FormControl (),
      // licencefile: new FormControl (),
      empcode: new FormControl (''),
      updatedby: new FormControl (this.userSession.empcode),
      flag:new FormControl (3),
      tableRows: this.fb.array([])


    });


    this.bankSalaryForm = this.fb.group({
      
      bankname: new FormControl (),
      accountno: new FormControl (),
      iban_no: new FormControl (),
      CBIDcode: new FormControl (),
      routing_code: new FormControl (),
      mol_no: new FormControl (),
      wpscompny: new FormControl ('', [Validators.required]),
      salprocess:new FormControl (''),
      paymode:new FormControl ('', [Validators.required]),
      gross_salary:new FormControl (),
      empcode: new FormControl (),
      updatedby: new FormControl (this.userSession.empcode),
      flag:new FormControl (4),
     
    });

    this.SalaryForm = this.fb.group({
      
      salcomponent: new FormControl (),
      salaryamnt: new FormControl (),
      empcode: new FormControl ('MJ00012'),
      updatedby: new FormControl (this.userSession.empcode),
      flag:new FormControl (4),
     
    });


    

    this.empAssetForm = this.fb.group({
      
      category: new FormControl ('', [Validators.required]),
      assetname: new FormControl ('', [Validators.required]),
      cost: new FormControl ('', [Validators.required]),
      issueddate: new FormControl ('', [Validators.required]),
      assetsts: new FormControl ('', [Validators.required]),
      returndate: new FormControl (),
      desc: new FormControl (),
      empcode:new FormControl (),
      updatedby: new FormControl (this.userSession.empcode),
      flag:new FormControl (7),
     
    });

    this.empNomineeForm = this.fb.group({
      
      nomname: new FormControl ('', [Validators.required]),
      nomdob: new FormControl ('', [Validators.required]),
      nomage: new FormControl ('', [Validators.required,Validators.pattern("^[0-9]*$")]),
      nomrelationship: new FormControl ('', [Validators.required]),
      nomnationality: new FormControl ('', [Validators.required]),
      nompassportno: new FormControl ('', [Validators.required]),
      nomperaddrs: new FormControl ('', [Validators.required]),
      nomlocaladdrs: new FormControl ('', [Validators.required]),
      nompercentage: new FormControl ('', [Validators.required,Validators.pattern(/^(100|\d{1,2})$/), Validators.maxLength(3)]),
      nomcontactno:new FormControl ('', [Validators.required,Validators.minLength(10),Validators.maxLength(15),Validators.pattern("^[0-9]*$")]),
      empcode:new FormControl (),
      updatedby: new FormControl (this.userSession.empcode),
      flag:new FormControl (6),
     
    });


    this.EducationForm = this.fb.group({
      
      updatedby: new FormControl (this.userSession.empcode),
      flag:new FormControl (5),
      empcode: new FormControl (),
      catgry:new FormControl (1),
      catgryname: new FormControl ('', [Validators.required]),
      catgryvalue: new FormControl ('', [Validators.required]),
      docpath: new FormControl (null, [Validators.required,this.fileTypeValidator(['pdf']), this.fileSizeValidatorprofes(200)]),
      
    });

    this.ExperienceForm = this.fb.group({
      updatedby: new FormControl (this.userSession.empcode),
      flag:new FormControl (5),
      empcode: new FormControl (),
      catgry:new FormControl (2),
      catgryname: new FormControl ('', [Validators.required]),
      catgryvalue: new FormControl ('', [Validators.required,Validators.pattern("^[0-9]*\.?[0-9]+$")]),
      docpath: new FormControl (null, [Validators.required,this.fileTypeValidator(['pdf']), this.fileSizeValidatorexp(200)]),
    });

    this.certificatesForm = this.fb.group({
      
      updatedby: new FormControl (this.userSession.empcode),
      flag:new FormControl (5),
      empcode: new FormControl (),
      catgry:new FormControl (3),
      catgryname: new FormControl (),
      catgryvalue: new FormControl (),
      docpath: new FormControl (null, [this.fileTypeValidator(['pdf']), this.fileSizeValidatorcert(200)]),
    });

    this.languagesForm = this.fb.group({
      
      updatedby: new FormControl (this.userSession.empcode),
      flag:new FormControl (5),
      empcode: new FormControl (),
      catgry:new FormControl (4),
      catgryname: new FormControl (),
      catgryvalue: new FormControl (),
      docpath: "",
    });


    this.empOtherForm = this.fb.group({
          
      empcode: new FormControl (''),
      updatedby: new FormControl (this.userSession.empcode),
      flag:new FormControl (2),
      NewtableRows: this.fb.array([])
     
    });

    

  }
 
  ngOnInit(): void {



    const url = this.router.snapshot.url.join('/');
    //alert(url);
    this.urlval=url;

    if(url=='edit_employee_profile')
    {
      localStorage.removeItem('empl_code');  
    }


    this.jdfile="";
    this.Changeflag=0;
    this.pfl=0;


    //alert(this.empcdd);

    if(this.empcdd!="")
    {
      this.em_pcode=this.empcdd;
      this.fetchflag(this.em_pcode);
      
    }



    let i=0;
    for(i=0;i<1;i++)
    {
      this.addNewRow();
    }

    let j=0;
    for(j=0;j<1;j++)
    {
      this.addTableRow();
    }

    //--------------------


    this.fetchmandatorydoc();
    this.listmandocsloop();

    this.empBasicForm.controls['role'].setValue('7');
    this.empBasicForm.controls['probation'].setValue('6');
    this.empBasicForm.controls['aireligibility'].setValue('1');
    this.empBasicForm.controls['workingday'].setValue('1');
    this.empBasicForm.controls['weekoff'].setValue('2');
    this.empBasicForm.controls['shifttime'].setValue('1');

    this.flag=1;
   //this.check();
  
   //alert(this.Changeflag);
   

   this.mindt='1940-12-01';
   this.msxdt='2005-12-01';
   this.comdtl = 'Select';
   this.resdtl = 'Select';
 
   this.desig=this.userSession.desig.split('#', 2); 
   //alert(this.desig);
   this.designame= this.desig[0];

   this.errorsts=0;
   localStorage.removeItem('storedData');
   this.fetchNomineeDetails();
   this.fetchAssetsDetails();
   this.fetchEducation();
   this.fetchworkexp();
   this.fetchcertificates();
   this.fetchlang();
   this.fetchnonactiveEmp();
   this.fetchassetsname();
   this.fetchFamDetails();
   this.fetchFamStatus();


    this.contdtl=false;
    this.perrate=false;
    this.weekoff.setValue('Select');
    this.accomodationtype=false;

    this.apicall.FetchCompanyList(this.empcode).subscribe((res)=>{
      this.listsessionCompany=res;
      })
    this.apicall.listCompanyList(this.comtypeid).subscribe((res)=>{
      this.listCom=res;
      })

    this.apicall.listemprole(this.roleid).subscribe((res)=>{
      this.listemprole=res;
      })
    this.apicall.listDepartment(this.deptypeid).subscribe((res)=>{
      this.listDepartment=res;
        })
    this.apicall.listWorkloc(this.worklocid).subscribe((res)=>{
      this.listWorklocation=res;
        })
    this.apicall.listDesignation(this.desigid).subscribe((res)=>{
      this.listDesignation=res;
        })
    this.apicall.listGrade(this.gradeid).subscribe((res)=>{
      this.listGrade=res;
        })
    this.apicall.listEmptype(this.emptypeid).subscribe((res)=>{
      this.listEmptype=res;
        })
    this.apicall.listContractor(this.contractorid).subscribe((res)=>{
      this.listcontractor=res;
        })

    this.apicall.listshift().subscribe((res)=>{
      this.listshift=res;
        })
    this.apicall.CountryDetails().subscribe((res)=>{
      this.listCountry=res;
        })
    this.apicall.listWeekoff(this.weekoffId).subscribe((res)=>{
      this.listWeekoff=res;
        })
    this.apicall.listinsurancetype(this.insuranceid).subscribe((res)=>{
      this.listinsurancetype=res;
        })
    this.apicall.lisprjtmngr(this.prmngr_roleid).subscribe((res)=>{
      this.listprjtmngr=res;
        })
    this.apicall.listcoordinators(this.coord_roleid).subscribe((res)=>{
        this.listcoordinators=res;
        })
    this.apicall.listgender(this.genderid).subscribe((res)=>{
        this.listgender=res;
        })
    this.apicall.listmaritalsts(this.maritalid).subscribe((res)=>{
        this.listmaritalsts=res;
        })
    this.apicall.listsponsordtl(this.sponsorid).subscribe((res)=>{
        this.listsponsordtl=res;
        })
    this.apicall.listaccomodationtype().subscribe((res)=>{
        this.listaccomodationtype=res;
        })
    this.apicall.listworkingdays(this.workingdaysid).subscribe((res)=>{
        this.listworkingdays=res;
        })
        
    this.apicall.listairticketeligibility(this.airticketid).subscribe((res)=>{
        this.listairticketeligibility=res;
        })

    this.apicall.listbanknames().subscribe((res)=>{
        this.listbanknames=res;
        })
    this.apicall.listassetscat(this.assetscategoryid).subscribe((res)=>{
        this.listassetscat=res;
        })
    this.apicall.listassetssts(this.assetsstatusid).subscribe((res)=>{
        this.listassetssts=res;
        })
   
          
    this.apicall.listeducation(this.educationid).subscribe((res)=>{
      this.listeducation=res;
          })
    this.apicall.listfieldofstudy(this.fieldid).subscribe((res)=>{
          this.listfieldofstudy=res;
          })       
    this.apicall.listjobtitle(this.jobtitleid).subscribe((res)=>{
          this.listjobtitle=res;
          })
    this.apicall.listexperience(this.experience).subscribe((res)=>{
          this.listexperience=res;
          })
    this.apicall.listlanguages(this.languagesid).subscribe((res)=>{
          this.listlanguages=res;
          })
    this.apicall.listproficiency(this.proficiencyid).subscribe((res)=>{
          this.listproficiency=res;
          })
    this.apicall.listrelation(this.relationid).subscribe((res)=>{
          this.listrelation=res;
          })   
    this.apicall.listsalarycomp(this.salcompid).subscribe((res)=>{
          this.listsalarycomp=res;
          })     
    
    this.apicall.listaccomodationtypes(this.accomodationid).subscribe((res)=>{
        this.listaccomodationtypes=res;
          })    

    this.apicall.listprocesstype(this.processid).subscribe((res)=>{
        this.listprocesstype=res;
          }) 

    this.apicall.listpaymode(this.paymodeid).subscribe((res)=>{
        this.listpaymode=res;
          })  

    this.apicall.listallEmployee().subscribe((res)=>{
        this.listallEmp=res; 
          }) 


    // window.onload = function () {
    // var today = new Date().toISOString().split('T')[0]; 
    //     (<HTMLInputElement>document.getElementById('joindate')).min = today;
    //   };


  }

 
  Edit(asset_id:any,caregory:any,assetname:any,assetcost:any,issueddate:any,assetsts:any,returndate:any,description:any)
  {

  //  alert(assetname);
    
    const nonactiveEmp= (<HTMLInputElement>document.getElementById("nonactiveEmp")).value;
    const newissue=this.datePipe.transform(issueddate,"yyyy-MM-dd");
    const newreturn=this.datePipe.transform(returndate,"yyyy-MM-dd");
  
    this.listassetsdetails.forEach((data: {
      edtdcategory:any;
      edtdassetname:any;
      edtdcost: any;
      edtdissueddate:any
      edtdassetsts:any;
      edtdreturndate: any;
      edtddesc: any;
       
        RECORDID: any; 
        isEditing: boolean; 
       }) => {
    
  
       
       data.edtdcategory = (data.RECORDID === asset_id ) ? caregory : '';
       data.edtdassetname = (data.RECORDID === asset_id ) ? assetname : '';
       data.edtdcost = (data.RECORDID === asset_id ) ? assetcost : '';
       data.edtdissueddate = (data.RECORDID === asset_id ) ? newissue : '';
       data.edtdassetsts = (data.RECORDID === asset_id ) ? assetsts : '';
       data.edtdreturndate = (data.RECORDID === asset_id ) ? newreturn : '';
       data.edtddesc = (data.RECORDID === asset_id ) ? description : '';
       data.isEditing = (data.RECORDID === asset_id );
     });
  
  
  }
  
  saveassetFn(asset_id:any,caregory:any,assetname:any,assetcost:any,issueddate:any,assetsts:any,returndate:any,description:any)
  {
    const nonactiveEmp= (<HTMLInputElement>document.getElementById("nonactiveEmp")).value;
    const updateassetsData={
      edtdcategory:caregory,
      edtdassetname:assetname,
      edtdcost:assetcost,
      edtdissueddate:issueddate,
      edtdassetsts:assetsts,
      edtdreturndate:returndate,
      edtddesc:description,
      asstrecord_id:asset_id,
      updatedby:this.empcode,
      empcode :nonactiveEmp   
    };
  
    //alert(JSON.stringify(updateassetsData));
    this.apicall.Editassetdtls(updateassetsData).subscribe(res => {
      if(res.Errorid==1){
        (<HTMLInputElement>document.getElementById("openModalButtonForalert")).click();
        this.showModal = 1;
        this.success = "Updated Successfully...";  
        this.fetchAssetsDetails();
        this.Changeflag=0;
      }
     
    });
    
    this.isEditing = false; 
  
  }


  Editnominee(recordid:any,name:any,nomdob:any,age:any,relation:any,nationality:any,passport:any,permntaddress:any,localaddrs:any,contactno:any,percentage:any)
  {
   
    const newdob=this.datePipe.transform(nomdob,"yyyy-MM-dd");
    this.listnomineedetails.forEach((data: {
      edtdnomname:any;
      edtdnomdob:any;
      edtdnomage: any;
      edtdnomrelationship:any
      edtdnomnationality:any;
      edtdnompassportno: any;
      edtdnomperaddrs:any;
      edtdnomlocaladdrs: any;
      edtdnomcontact:any
      edtdnompercentage: any;
       
       RECORDID: any; 
        isnomEditing: boolean; 
       }) => {
    
       data.edtdnomname = (data.RECORDID === recordid ) ? name : '';
       data.edtdnomdob = (data.RECORDID === recordid ) ? newdob : '';
       data.edtdnomage = (data.RECORDID === recordid ) ? age : '';
       data.edtdnomrelationship = (data.RECORDID === recordid ) ? relation : '';
       data.edtdnomnationality = (data.RECORDID === recordid ) ? nationality : '';
       data.edtdnompassportno = (data.RECORDID === recordid ) ? passport : '';
       data.edtdnomperaddrs = (data.RECORDID === recordid ) ? permntaddress : '';
       data.edtdnomlocaladdrs = (data.RECORDID === recordid ) ? localaddrs : '';
       data.edtdnomcontact = (data.RECORDID === recordid ) ? contactno : '';
       data.edtdnompercentage = (data.RECORDID === recordid ) ? percentage : '';
       data.isnomEditing = (data.RECORDID === recordid );

     });

  }
  savenomineeFn(recordid:any,name:any,nomdob:any,age:any,relation:any,nationality:any,passport:any,permntaddress:any,localaddrs:any,contactno:any,percentage:any)
  {

   
    //alert(age);

    const nonactiveEmp= (<HTMLInputElement>document.getElementById("nonactiveEmp")).value;
    const noage= (<HTMLInputElement>document.getElementById("edtdnomage")).value;

  

    const updatenomineeData={
      edtdnomname:name,
      edtdnomdob:nomdob,
      edtdnomage:noage,
      edtdnomrelationship:relation,
      edtdnomnationality:nationality,
      edtdnompassportno:passport,
      edtdnomperaddrs:permntaddress,
      edtdnomlocaladdrs:localaddrs,
      edtdnomcontact:contactno,
      edtdnompercentage:percentage,
      nomrecord_id:recordid,
      updatedby:this.empcode,
      empcode :nonactiveEmp   
    };
  
    this.apicall.Editnomineedtls(updatenomineeData).subscribe(res => {
      if(res.Errorid==1){
        (<HTMLInputElement>document.getElementById("openModalButtonForalert")).click();
        this.showModal = 1;
        this.success = "Updated Successfully..."; 
        this.fetchNomineeDetails(); 
        this.Changeflag=0;
      }
     
    });
    
    this.isnomEditing = false; 

  }



  
  displayempcode(company_id:any)
  {
    this.apicall.employeecodedisplay(company_id).subscribe((res)=>{
      this.employeecodedisp=res;

      if(company_id=='MH')
    {
      this.empBasicForm.controls['shifttime'].setValue('5');
    }else{
      this.empBasicForm.controls['shifttime'].setValue('1');
    }

      const cmbsel=<HTMLSelectElement>document.getElementById("nonactiveEmp");
     // alert(cmbsel.value);
      if(cmbsel.value=='null')
      {
       // alert("fisrt");
        this.empBasicForm.controls['empcode'].setValue(this.employeecodedisp[0].KEY_VALUE);
      }
      else
      {
        //alert("else");
        this.empBasicForm.controls['empcode'].setValue(cmbsel.value);
      }
      //this.emcode.setValue(this.employeecodedisp[0].KEY_VALUE);
      
      })
  }

  displayassetnm(cat_id:any)
  {
    this.apicall.employeeassetdisplay(cat_id).subscribe((res)=>{
      this.employeeassetsdisp=res;
     // this.empAssetForm.controls['assetname'].setValue(this.employeeassetsdisp[0].CATEGORY_NAME);
     // this.empAssetForm.controls['cost'].setValue(this.employeeassetsdisp[0].AMOUNT);
      })
  }
  displayassetcost(cat_id:any,assetId:any)
  {
    this.apicall.employeeassetdisplaycost(cat_id,assetId).subscribe((res)=>{
      this.employeeassetsdispcost=res;
     // this.empAssetForm.controls['assetname'].setValue(this.employeeassetsdisp[0].CATEGORY_NAME);
        this.empAssetForm.controls['cost'].setValue(this.employeeassetsdispcost[0].AMOUNT);
      })
  }
  




  get f()
  {
    return this.empBasicForm.controls;
  }

  get g()
  {
    return this.empContactForm.controls;
  }
  get h()
  {
    return this.empdocumentForm.controls;
  }
  get i()
  {
    return this.EducationForm.controls;
  }
  get j()
  {
    return this.ExperienceForm.controls;
  }

  get k()
  {
    return this.empAssetForm.controls;
  }
  get m()
  {
    return this.empNomineeForm.controls;
  }
  get n()
  {
    return this.bankSalaryForm.controls;
  }
  get o()
  {
    return this.certificatesForm.controls;
  }
  
  basicSubmit() 
  {
    // alert('fdfd')
    const nonactiveEmp= (<HTMLInputElement>document.getElementById("nonactiveEmp")).value;

    if(nonactiveEmp!="null")
    {

     // alert('fdfd')
    this.submitted=true;
    if(this.empBasicForm.invalid) 
    {  //alert('invalid')
        return;
    }
    else if(this.empBasicForm.valid)
    {


      const comname= (<HTMLInputElement>document.getElementById("employeesflt")).value;
      //alert(empname);
      this.empBasicForm.get('companyacc')?.setValue(comname);

      const resname= (<HTMLInputElement>document.getElementById("employeesflts")).value;
      //alert(empname);
      this.empBasicForm.get('resourceacc')?.setValue(resname);

     // alert(JSON.stringify(this.empBasicForm.value));
      const empcodes=(<HTMLInputElement>document.getElementById("empcode")).value;
      this.apicall.updatebasicdtls(this.empBasicForm.value).subscribe((res)=>{
      this.listbasicdtl=res;
      if(res.Errorid==1)
      {

       this.uploadBasic(res.Errorid,1,empcodes);
       this.uploadBasic(res.Errorid,2,empcodes);

       this.Changeflag=0;

        //  if(this.uploadflag=0)
        // {
          (<HTMLInputElement>document.getElementById("openModalButtonForalert")).click();
          this.showModal = 1;
          this.success = "Updated Successfully...";
        // }
        // else
        // {
        //   (<HTMLInputElement>document.getElementById("openModalButtonForalert")).click();
        //   this.showModal = 2;
        //   this.failed = "Please choose valid files";
        // }
      
        this.fetchnonactiveEmp();
        this.defvalue=empcodes;
        this.fetchflag(empcodes);
        this.pfl=0;
        
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
  else{
    (<HTMLInputElement>document.getElementById("openModalButtonForalert")).click();
      this.showModal = 1;
      this.success = "Please select employee code...";
  }

  }


  uploadBasic(reqid: any, flag: any, ecode: any) {
    let input: any;
    let maxSizeKB = 120; // Maximum file size in kilobytes (KB)
    let allowedFileTypes = ['image/jpeg','application/pdf']; // Example allowed file types
  
    if (flag === 1) {
      input = <HTMLInputElement>document.getElementById("profile-img-file-input");
    } else if (flag === 2) {
      input = <HTMLInputElement>document.getElementById("filejd");
    }
  
    if (input) {
      const file = input.files[0];
      
     // if (file) {
     //   const fileSizeKB = file.size / 1024; // Convert to KB
  
      //  if (!allowedFileTypes.includes(file.type) && fileSizeKB > maxSizeKB  ) {
         // this.uploadflag=1;
        //  alert('File size exceeds the maximum limit (120 KB). Please choose a smaller allowded type file.');
        //  return;
       /// }
      //  else{
        //  this.uploadflag=0;
          const fdata = new FormData();
          this.onFileSelectBasic(input, flag, ecode);
       // }

     // }
    }
  }
  


  
  onFileSelectBasic(input:any,reqid:any,ecode:any) {
    // alert("entered in fileselect")
   
      const upflag = 2
      if (input.files && input.files[0]) {
        
       const fdata = new FormData();
      
       fdata.append('filesup',input.files[0]);
       //alert(JSON.stringify(fdata))
     // alert("before upload api")
       this.apicall.UploadEmpbasic(fdata,reqid,ecode,upflag).subscribe((res)=>{
         if(res=0)
         {
           this.showModal = 2;
          this.failed = "Document uploading failed";
         }
         
       })
   
     }
   }




  contactSubmit() 
  {
    
    const nonactiveEmp= (<HTMLInputElement>document.getElementById("nonactiveEmp")).value;

    if(nonactiveEmp!="null")
    {
      this.contsubmitted=true;
      if(this.empContactForm.invalid) 
      {
        return;
      }
      else if(this.empContactForm.valid)
      {


        this.apicall.fetchcontactdtl(nonactiveEmp).subscribe((res)=>{
          this.fetchcontactdtl=res;
        })

      // alert(JSON.stringify(this.fetchcontactdtl));
      if(this.fetchcontactdtl=="")
      {
        this.apicall.addcontactdetails(this.empContactForm.value).subscribe((res)=>{
          this.listcontactdetails=res;
          if(res.Errorid==1)
          {
          this.Changeflag=0;
          (<HTMLInputElement>document.getElementById("openModalButtonForalert")).click();
          this.showModal = 1;
          this.success = "Added Successfully...";
          this.fetchflag(nonactiveEmp);
          }
          else
          {
            (<HTMLInputElement>document.getElementById("openModalButtonForalert")).click();
            this.showModal = 2;
            this.failed = "Failed";
          }
  
        })

      }
      else
      {

        // alert(JSON.stringify(this.empContactForm.value));
        this.apicall.updatecontactdetails(this.empContactForm.value).subscribe((res)=>{
          this.listcontactdetails=res;
  
          if(res.Errorid==1)
          {
          this.Changeflag=0;
          (<HTMLInputElement>document.getElementById("openModalButtonForalert")).click();
          this.showModal = 1;
          this.success = "Updated Successfully...";
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

    }
    else
    {
      (<HTMLInputElement>document.getElementById("openModalButtonForalert")).click();
      this.showModal = 1;
      this.success = "Please select employee code...";
    }

    
  }

  
  documentSubmit() 
  {
    const nonactiveEmp= (<HTMLInputElement>document.getElementById("nonactiveEmp")).value;
 
    if(nonactiveEmp!="null")
    {

    if(this.empdocumentForm.invalid) 
    {
      (<HTMLInputElement>document.getElementById("openModalButtonForalert")).click();
      this.showModal = 1;
      this.success = "Please enter document no, expiry date and valid file type and size.";
      return;
    }
    else if(this.empdocumentForm.valid)
    {
    //alert(JSON.stringify(this.empdocumentForm.value));

      this.apicall.adddocsdtls(this.empdocumentForm.value).subscribe((res)=>{
      this.docsdtlsdisp=res;
      
        if(res.Errorid==1)
        {

      //alert(res.Errorid)
      const tbl=<HTMLTableElement>document.getElementById("DocTable");
        const trows=tbl.getElementsByTagName("tr");
        //alert(tbl)
        const fdata = new FormData();
        //alert(trows.length)
        for(var i=1;i<trows.length;i++)
        {
         // alert(trows.length)
          //alert("loop")
          const tdfile=trows[i].getElementsByTagName("td");
          //alert(tdfile)
          const upfile=tdfile[3].getElementsByTagName("input");
          //alert(upfile)
          const dropfile=tdfile[0].getElementsByTagName("select")[0].value;
          //alert(dropfile)
          this.onFiledocSelect(upfile[0],nonactiveEmp,dropfile);
          
        }


        
        this.Changeflag=0;
        
        (<HTMLInputElement>document.getElementById("openModalButtonForalert")).click();
        this.showModal = 1;
        this.success = "Added Successfully...";

        const tableRowsArray = this.empdocumentForm.get('tableRows') as FormArray;

        tableRowsArray.controls[0].reset();
        while (tableRowsArray.length > 1) {
          tableRowsArray.removeAt(1);
        }

        //  (<HTMLInputElement>document.getElementById('openalert2')).click(); 
        this.fetchflag(nonactiveEmp);        
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
 
    else
    {
      (<HTMLInputElement>document.getElementById("openModalButtonForalert")).click();
      this.showModal = 1;
      this.success = "Please select employee code...";

    }
 

  }


ChekforDuplicateFiletype(tp:any,inx:any)
{
  const tbl=<HTMLTableElement>document.getElementById("DocTable");
  const trows=tbl.getElementsByTagName("tr");
  //alert(tp)
  const fdata = new FormData();
  //alert(trows.length)
  let k=0;
  for(var i=1;i<trows.length;i++)
  {
    
   // alert(trows.length)
    //alert("loop")
    const tdfile=trows[i].getElementsByTagName("td");
    //alert(tdfile)
    //const upfile=tdfile[3].getElementsByTagName("input");
    //alert(upfile)
    const dropfile=tdfile[0].getElementsByTagName("select")[0].value;
    //alert(dropfile)
  if(tp==dropfile)
  {
    k=k+1;
    if(k>1)
    {


     // alert("Already selected document type");
     (<HTMLInputElement>document.getElementById("openModalButtonForalert")).click();
      this.showModal = 1;
      this.success = "Already selected document type...";



      tdfile[0].getElementsByTagName("select")[0].value="";
      k=0;
    return;
    }
    
  }
   this.changeflg=1;
  }
}
  onFiledocSelect(input:any,ecode:any,reqid:any) {
   // alert(input);
    if (input.files && input.files[0]) {
      const fdata = new FormData();

      const upflag=1;
      fdata.append('filesup',input.files[0]);
      this.apicall.UploadEmpdoc(fdata,reqid,ecode,upflag).subscribe((res)=>{
        if(res=0)
        {
          this.showModal = 2;
         this.failed = "Document uploading failed";
        }
        
      })

    }
   
  }




  upload(reqid:any,flag:any,ecode:any)
  {
   //  alert(reqid);
    let input:any;
    if(flag==1)
    {
       input=(<HTMLInputElement>document.getElementById("passportfile"));
       //alert(input);
       const fdata = new FormData();
       this.onFileSelect(input,flag,ecode);
    }
    if(flag==2)
    {    
      input=(<HTMLInputElement>document.getElementById("visafile"));
      const fdata = new FormData();
       this.onFileSelect(input,flag,ecode);
    }
    if(flag==3)
    {    
      input=(<HTMLInputElement>document.getElementById("emiratefile"));
      const fdata = new FormData();
       this.onFileSelect(input,flag,ecode);
    }
    if(flag==4)
    {    
      input=(<HTMLInputElement>document.getElementById("licencefile"));
      const fdata = new FormData();
       this.onFileSelect(input,flag,ecode);
    }
    if(flag==5)
    {    
      input=(<HTMLInputElement>document.getElementById("contractfile"));
      const fdata = new FormData();
       this.onFileSelect(input,flag,ecode);
    }
      
  }

onFileSelect(input:any,reqid:any,ecode:any) {
 // alert("entered in fileselect")
   const upflag=1;

   if (input.files && input.files[0]) {
     
    const fdata = new FormData();
   
    fdata.append('filesup',input.files[0]);
    //alert(JSON.stringify(fdata))
  // alert("before upload api")
    this.apicall.UploadEmpdoc(fdata,reqid,ecode,upflag).subscribe((res)=>{
      if(res=0)
      {
        this.showModal = 2;
       this.failed = "Document uploading failed";
      }
      
    })

  }
}


  banksalarySubmit() 
  {

    const nonactiveEmp= (<HTMLInputElement>document.getElementById("nonactiveEmp")).value;
    const grosssal= (<HTMLInputElement>document.getElementById("gross_salary")).value;

    if(nonactiveEmp!="null")
    {

      if(grosssal!="0")
      {


    this.banksalsubmitted=true;

    if(this.bankSalaryForm.invalid) 
    {
      
      return;
    }
    else if(this.bankSalaryForm.valid)
    {
      
      //  alert(JSON.stringify(this.bankSalaryForm.value));

        this.apicall.updatebankdtls(this.bankSalaryForm.value).subscribe((res)=>{
        this.bankdtlsdisp=res;
        //alert(res.Errorid);
        if(res.Errorid==1)
        {
        
          this.Changeflag=0;

          (<HTMLInputElement>document.getElementById("openModalButtonForalert")).click();
          this.showModal = 1;
          this.success = "Updated Successfully...";

         
         // (<HTMLInputElement>document.getElementById('openalert3')).click();
          this.resetbank();
          this.fetchflag(nonactiveEmp);
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
   else
   {
     
     (<HTMLInputElement>document.getElementById("openModalButtonForalert")).click();
      this.showModal = 1;
      this.success = "Please add basic salary...";
   }
  }
else
{
  (<HTMLInputElement>document.getElementById("openModalButtonForalert")).click();
      this.showModal = 1;
      this.success = "Please select employee code...";
}


}

  assetsSubmit() 
  {
    const nonactiveEmp= (<HTMLInputElement>document.getElementById("nonactiveEmp")).value;
    if(nonactiveEmp!="null")
    {
    //alert("test");
    this.assetssubmitted=true;
    if(this.empAssetForm.invalid) 
    {
      return;
    }
    else if(this.empAssetForm.valid)
    {

      //alert(JSON.stringify(this.empAssetForm.value));
      this.apicall.addassetsdtls(this.empAssetForm.value).subscribe((res)=>{
      this.employeecodedisp=res;
      //alert(res.Errorid);
      if(res.Errorid==1)
      {
       
        this.Changeflag=0;

        (<HTMLInputElement>document.getElementById("openModalButtonForalert")).click();
        this.showModal = 1;
        this.success = "Added Successfully...";

       // this.empAssetForm.reset();
        this.fetchAssetsDetails();
       // (<HTMLInputElement>document.getElementById('openalert6')).click();
        this.resetassets();
        this.fetchflag(nonactiveEmp);
        
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
  else
  {
    (<HTMLInputElement>document.getElementById("openModalButtonForalert")).click();
      this.showModal = 1;
      this.success = "Please select employee code...";
  }
    


  }

  hideAlert() 
  {
    this.showAlert = false;
  }

  nomineeSubmit() 
  {

    const nonactiveEmp= (<HTMLInputElement>document.getElementById("nonactiveEmp")).value;
    if(nonactiveEmp!="null")
    {


    //alert("test");
    this.nomineesubmitted=true;
    if(this.empNomineeForm.invalid) 
    {
      return;
    }
    else if(this.empNomineeForm.valid)
    {
      // alert(JSON.stringify(this.empNomineeForm.value));
      this.apicall.addnomineedtls(this.empNomineeForm.value).subscribe((res)=>{
      this.employeenomineedata=res;

        //alert(res.Errorid);

        if(res.Errorid==1)
      {
        this.Changeflag=0;


        (<HTMLInputElement>document.getElementById("openModalButtonForalert")).click();
        this.showModal = 1;
        this.success = "Added Successfully...";
        this.fetchNomineeDetails();

       // (<HTMLInputElement>document.getElementById('openalert5')).click();
        this.resetnominee();
        this.fetchflag(nonactiveEmp);
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
  else
  {
    (<HTMLInputElement>document.getElementById("openModalButtonForalert")).click();
      this.showModal = 1;
      this.success = "Please select employee code...";
  }

  }

  educationSubmit() 
  {

    const nonactiveEmp= (<HTMLInputElement>document.getElementById("nonactiveEmp")).value;
    if(nonactiveEmp!="null")
    {

    //alert("test");
    this.educationsubmitted=true;
    if(this.EducationForm.invalid) 
    {
      //alert("test1");
      return;
    }
    else if(this.EducationForm.valid)
    {
      //alert("test2");
     //alert(JSON.stringify(this.EducationForm.value));
     this.apicall.addprofesionaldtls(this.EducationForm.value).subscribe((res)=>{
      this.listprofesionaldtls=res;

      //alert(res.Errorid);
      if(res.Errorid>0) 
      {

        this.uploadeducation(res.Errorid,res.Errorid,nonactiveEmp);
        this.Changeflag=0;

        (<HTMLInputElement>document.getElementById("openModalButtonForalert")).click();
        this.showModal = 1;
        this.success = "Added Successfully...";
       
          this.resetedu();
          this.fetchEducation();
          this.fetchflag(nonactiveEmp);

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
  else
   {
    (<HTMLInputElement>document.getElementById("openModalButtonForalert")).click();
    this.showModal = 1;
    this.success = "Please select employee code...";
   }


  }

  uploadeducation(reqid:any,flag:any,ecode:any)
  {
   //  alert(reqid);
    let input:any;
    if(flag>0)
    {
       input=(<HTMLInputElement>document.getElementById("docpath"));
       const fdata = new FormData();
       this.onFileSelecteducation(input,flag,ecode);
    }
  }

  onFileSelecteducation(input:any,reqid:any,ecode:any) {
    // alert("entered in fileselect")
      const upflag=3;  
      if (input.files && input.files[0]) {
        
       const fdata = new FormData();
      
       fdata.append('filesup',input.files[0]);
       //alert(JSON.stringify(fdata))
     // alert("before upload api")
       this.apicall.UploadEmpeducation(fdata,reqid,ecode,upflag).subscribe((res)=>{
         if(res=0)
         {
          (<HTMLInputElement>document.getElementById("openModalButtonForalert")).click();
          this.showModal = 2;
          this.failed = "Failed";
         }
         
       })
   
     }
   }


  experienceSubmit() 
  {

    const nonactiveEmp= (<HTMLInputElement>document.getElementById("nonactiveEmp")).value;
    if(nonactiveEmp!="null")
    {

    //alert("test");
    this.experiencesubmitted=true;
    if(this.ExperienceForm.invalid) 
    {
      //alert("test1");
      return;
    }
    else if(this.ExperienceForm.valid)
    {
      //alert("test2");
     // alert(JSON.stringify(this.ExperienceForm.value));
     this.apicall.addprofesionaldtls(this.ExperienceForm.value).subscribe((res)=>{
      this.listprofesionaldtls=res;
     //alert('lkl');
      if(res.Errorid>0)
      {

       this.uploadexperience(res.Errorid,res.Errorid,nonactiveEmp);
       this.Changeflag=0;

       (<HTMLInputElement>document.getElementById("openModalButtonForalert")).click();
       this.showModal = 1;
       this.success = "Added Successfully...";

        this.resetexp();
        this.fetchworkexp();
        
        this.fetchflag(nonactiveEmp);
      }
      else
      {
        this.showAlert=true;  
        this.message='Failed'; 
      }


    })

    }
  }
  else
   {
    (<HTMLInputElement>document.getElementById("openModalButtonForalert")).click();
    this.showModal = 1;
    this.success = "Please select employee code...";
   }


  }

  uploadexperience(reqid:any,flag:any,ecode:any)
  {
    //alert(reqid);
    let input:any;
    if(flag>0)
    {
       input=(<HTMLInputElement>document.getElementsByClassName("exp")[0]);
     //  alert(input);
       const fdata = new FormData();
       this.onFileSelectexperience(input,flag,ecode);
    }
  }
  onFileSelectexperience(input:any,reqid:any,ecode:any) {
    
      const upflag=4;
     // alert("entered in fileselect")
   //   alert(input.files.length)
      if (input.files && input.files[0]) {
        
       const fdata = new FormData();
      
       fdata.append('filesup',input.files[0]);
       //alert(JSON.stringify(fdata))
    // alert("before upload api")
       this.apicall.UploadEmpexperience(fdata,reqid,ecode,upflag).subscribe((res)=>{
         if(res=0)
         {
          (<HTMLInputElement>document.getElementById("openModalButtonForalert")).click();
          this.showModal = 2;
          this.failed = "Failed";
         }
         
       })
   
     }
   }



  certificatesSubmit() 
  {
    const nonactiveEmp= (<HTMLInputElement>document.getElementById("nonactiveEmp")).value;
    if(nonactiveEmp!="null")
    {
    //alert("test");
    this.certisubmitted=true;
    if(this.certificatesForm.invalid) 
    {
      //alert("test1");
      return;
    }
    else if(this.certificatesForm.valid)
    {
      //alert("test2");
      //alert(JSON.stringify(this.certificatesForm.value));
      this.apicall.addprofesionaldtls(this.certificatesForm.value).subscribe((res)=>{
        this.listprofesionaldtls=res;
        if(res.Errorid>0)
        {
        
         this.uploadcertificate(res.Errorid,res.Errorid,nonactiveEmp);
         this.Changeflag=0;
         (<HTMLInputElement>document.getElementById("openModalButtonForalert")).click();
         this.showModal = 1;
         this.success = "Added Successfully...";

          this.resetcert();
          this.fetchcertificates();
          this.fetchflag(nonactiveEmp);
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
    else
   {
    (<HTMLInputElement>document.getElementById("openModalButtonForalert")).click();
    this.showModal = 1;
    this.success = "Please select employee code...";
   }

  }

  uploadcertificate(reqid:any,flag:any,ecode:any)
  {
   //  alert(reqid);
    let input:any;
    if(flag>0)
    {
      input=(<HTMLInputElement>document.getElementsByClassName("cert")[0]);
     // alert(input)
       const fdata = new FormData();
       this.onFileSelectcertificate(input,flag,ecode);
    }
  }
  onFileSelectcertificate(input:any,reqid:any,ecode:any) {
    // alert("entered in fileselect")
      const upflag=5;

      if (input.files && input.files[0]) {
       // alert(input.files.length)
       const fdata = new FormData();
      
       fdata.append('filesup',input.files[0]);
       //alert(JSON.stringify(fdata))
     // alert("before upload api")
       this.apicall.UploadEmpcertificate(fdata,reqid,ecode,upflag).subscribe((res)=>{
         if(res=0)
         {
          (<HTMLInputElement>document.getElementById("openModalButtonForalert")).click();
          this.showModal = 2;
          this.failed = "Failed";
         }
         
       })
   
     }
   }


  languageSubmit() 
  {

    const nonactiveEmp= (<HTMLInputElement>document.getElementById("nonactiveEmp")).value;
    if(nonactiveEmp!="null")
    {
    //alert("test");
    this.langsubmitted=true;
    if(this.languagesForm.invalid) 
    {
      //alert("test1");
      return;
    }
    else if(this.languagesForm.valid)
    {
      //alert("test2");
     // alert(JSON.stringify(this.languagesForm.value));
      this.apicall.addprofesionaldtls(this.languagesForm.value).subscribe((res)=>{
        this.listprofesionaldtls=res;

        if(res.Errorid>0)
        {
          this.Changeflag=0;


          (<HTMLInputElement>document.getElementById("openModalButtonForalert")).click();
          this.showModal = 1;
          this.success = "Added Successfully...";

          this.resetlang();
          this.fetchlang();
          this.activeEmp();
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
   else
   {
    (<HTMLInputElement>document.getElementById("openModalButtonForalert")).click();
      this.showModal = 1;
      this.success = "Please select employee code...";
   }


  }



  famdetSubmit() {

    const nonactiveEmp = (<HTMLInputElement>document.getElementById("nonactiveEmp")).value;
    
    if (nonactiveEmp != "null") {
    
    this.famdetails=true;
    if(this.empOtherForm.invalid) 
    {
      return;
    }
    else if(this.empOtherForm.valid)
    {


      this.apicall.addfamilydetails(this.empOtherForm.value).subscribe((res)=>{
       // this.listprofesionaldtls=res;

        if(res.Errorid==1)
        {
          this.Changeflag=0;
          (<HTMLInputElement>document.getElementById("openModalButtonForalert")).click();
          this.showModal = 1;
          this.success = "Added Successfully...";

          const tableRowsArrays = this.empOtherForm.get('NewtableRows') as FormArray;

         tableRowsArrays.controls[0].reset();
          while (tableRowsArrays.length > 1) {
          tableRowsArrays.removeAt(1);
        }

          // this.resetlang();
           this.fetchFamDetails();
           this.fetchFamStatus();
           this.fetchflag(nonactiveEmp);
        }
        else
      {
        (<HTMLInputElement>document.getElementById("openModalButtonForalert")).click();
        this.showModal = 2;
        this.failed = "Please fill the fields";
      }
      })
      
    }
   }
   else
   {
    (<HTMLInputElement>document.getElementById("openModalButtonForalert")).click();
      this.showModal = 1;
      this.success = "Please select employee code...";
   }
  }

  famstsCheck()
  {

      const nonactiveEmp = (<HTMLInputElement>document.getElementById("nonactiveEmp")).value;
    

      if (nonactiveEmp != "null") {

      let insurance: string;
      let activeflagin: number;
      let airticket: string;
      let activeflagai: number;
      let visa: string;
      let activeflagvi: number;
  
  
      const isInsuranceChecked1 = (<HTMLInputElement>document.getElementById('insurance') as HTMLInputElement).checked;
  
      if (isInsuranceChecked1) {
        insurance = (<HTMLInputElement>document.getElementById("insurance")).value;
        activeflagin = 1;
      } else {
        insurance = (<HTMLInputElement>document.getElementById("insurance")).value;
        activeflagin = 0;
      }

      const isAirticketChecked1 = (<HTMLInputElement>document.getElementById('airticket') as HTMLInputElement).checked;
  
      if (isAirticketChecked1) {
        airticket = (<HTMLInputElement>document.getElementById("airticket")).value;
        activeflagai = 1;
      } else {
        airticket = (<HTMLInputElement>document.getElementById("airticket")).value;
        activeflagai = 0;
      }

      const isvisaChecked1 = (<HTMLInputElement>document.getElementById('visa') as HTMLInputElement).checked;
  
      if (isvisaChecked1) {
        visa = (<HTMLInputElement>document.getElementById("visa")).value;
        activeflagvi = 1;
      } else {
        visa = (<HTMLInputElement>document.getElementById("visa")).value;
        activeflagvi = 0;
      }


      const insurances = [];
      insurances.push(insurance, activeflagin);
      const airtickets = [];
      airtickets.push(airticket, activeflagai);
      const visas = [];
      visas.push(visa, activeflagvi);

      const famsts = {
        updatedby: this.userSession.empcode,
        flag:"1",
        empcode: nonactiveEmp,
        insurancedtl:insurances,
        airticketdtl:airtickets,
        visadtl:visas
      };


      //alert(JSON.stringify(famsts))

      this.apicall.addfamilysts(famsts).subscribe((res)=>{
      })

    }
    else
    {
      (<HTMLInputElement>document.getElementById("openModalButtonForalert")).click();
      this.showModal = 1;
      this.success = "Please select employee code...";
    }

  }


  

  chnagecontractFn(emptype:any)
  {
      //alert(emptype);
      if(emptype==2)
      {
        this.contdtl=true;
        this.perrate=true;
      }
      else if(emptype==1)
      {
        this.contdtl=false;
        this.perrate=false;
      }
  }

  displaybankcode(bankid:any)
  {
    this.apicall.listbankdet(bankid).subscribe((res)=>{
      this.listbankdet=res;
      this.bankSalaryForm.controls['CBIDcode'].setValue(this.listbankdet[0].CBID_CODE);
      this.bankSalaryForm.controls['routing_code'].setValue(this.listbankdet[0].ROUTING_CODE);

      })
  }



  chnageworkingFn(workingtype:any)
  {
    //alert(workingtype);
  
    if(workingtype=='1')
    {
      this.empBasicForm.controls['weekoff'].setValue('2');
    }
    else if(workingtype=='2')
    {
      this.empBasicForm.controls['weekoff'].setValue('3');
    }
    else if(workingtype=='3')
    {
      this.empBasicForm.controls['weekoff'].setValue('3');
    }
  }


  addsalarydtl(salaryamnt:any,salcomponent:any)
  {
    const nonactiveEmp= (<HTMLInputElement>document.getElementById("nonactiveEmp")).value;
   

if(nonactiveEmp!="null")
{

   if(salaryamnt!="" && salcomponent!=""  )
   {  
    const newData = {
      component: salcomponent,
      value: salaryamnt,
      empcode:nonactiveEmp,
      updatedby: this.userSession.empcode,
      flag:"8",
    };


   this.apicall.addsalarydtls(newData).subscribe((res)=>{
    this.listsalarydtls=res;
    //alert(res.Errorid);
    if(res.Errorid==1)
    {
      this.Changeflag=0;

      (<HTMLInputElement>document.getElementById("openModalButtonForalert")).click();
      this.showModal = 1;
      this.success = "Added Successfully...";
  
      this.fetchallowancedtl();

      (<HTMLInputElement>document.getElementById("salcomponent")).value="1";
      (<HTMLInputElement>document.getElementById("salaryamnt")).value="";
      
    }
    else
      {
        (<HTMLInputElement>document.getElementById("openModalButtonForalert")).click();
        this.showModal = 2;
        this.failed = "Failed";
      }
    })
   }
    else
    {
        (<HTMLInputElement>document.getElementById("openModalButtonForalert")).click();
        this.showModal = 1;
        this.success = "please select basic salary...";
    }

  }

  else{

    (<HTMLInputElement>document.getElementById("openModalButtonForalert")).click();
      this.showModal = 1;
      this.success = "Please select employee code...";

  }

 }

 
  check()
  {
    this.Changeflag=1;
  }
  Changecheck(a:any)
  {

   // alert(a);
    //alert(this.Changeflag);
    if(this.Changeflag==1)
    {
      //alert(this.Changeflag);
      (<HTMLInputElement>document.getElementById("openModalButton")).click();
      this.showModal = 3;
      this.success = "Do you want to save ? Click 'Yes' to complete the form and save the data, or 'No' to discard the changes.";
      this.idval=a;

    }
    else
    {
      this.Changeflag=0;
    //  alert(this.Changeflag);
    }
  }

  dispcheck(target:string) 
  {
   //alert(target);

   this.Changeflag=0;

   if(target=='Basic-Information')
   {
    (<HTMLInputElement>document.getElementById('openalert0')).click();
      this.Resetbasic();
      this.Resetcontact();
      this.resetedu();
      this.resetexp();
      this.resetcert();
      this.resetlang();
      this.resetnominee();
      this.resetassets();
      this.resetbank();
      this.resetdoc();
   }
   else if(target=='Contact-Info')
   {
    (<HTMLInputElement>document.getElementById('openalert1')).click();
      this.Resetbasic();
      this.Resetcontact();
      this.resetedu();
      this.resetexp();
      this.resetcert();
      this.resetlang();
      this.resetnominee();
      this.resetassets();
      this.resetbank();
      this.resetdoc();
   }
   else if(target=='Documents')
   {
    (<HTMLInputElement>document.getElementById('openalert2')).click();
      this.Resetbasic();
      this.Resetcontact();
      this.resetedu();
      this.resetexp();
      this.resetcert();
      this.resetlang();
      this.resetnominee();
      this.resetassets();
      this.resetbank();
      this.resetdoc();
   }
   else if(target=='Bank-Salary')
   {
    (<HTMLInputElement>document.getElementById('openalert3')).click();
      this.Resetbasic();
      this.Resetcontact();
      this.resetedu();
      this.resetexp();
      this.resetcert();
      this.resetlang();
      this.resetnominee();
      this.resetassets();
      this.resetbank();
      this.resetdoc();
   }
   else if(target=='Employee-Data')
   {
    (<HTMLInputElement>document.getElementById('openalert4')).click();
    this.Resetbasic();
    this.Resetcontact();
    this.resetedu();
    this.resetexp();
    this.resetcert();
    this.resetlang();
    this.resetnominee();
    this.resetassets();
    this.resetbank();
    this.resetdoc();
   }
   else if(target=='Nominee')
   {
    (<HTMLInputElement>document.getElementById('openalert5')).click();
    this.Resetbasic();
    this.Resetcontact();
    this.resetedu();
    this.resetexp();
    this.resetcert();
    this.resetlang();
    this.resetnominee();
    this.resetassets();
    this.resetbank();
    this.resetdoc();
   }
   else if(target=='Assets')
   {
    (<HTMLInputElement>document.getElementById('openalert6')).click();
    this.Resetbasic();
    this.Resetcontact();
    this.resetedu();
    this.resetexp();
    this.resetcert();
    this.resetlang();
    this.resetnominee();
    this.resetassets();
    this.resetbank();
    this.resetdoc();
   }

   else if(target=='Other')
   {
    (<HTMLInputElement>document.getElementById('openalert7')).click();
    this.Resetbasic();
    this.Resetcontact();
    this.resetedu();
    this.resetexp();
    this.resetcert();
    this.resetlang();
    this.resetnominee();
    this.resetassets();
    this.resetbank();
    this.resetdoc();
   }
  
    
  }

  fetchNomineeDetails()
  {

    if(this.urlval=='edit_employee_profile')
    { 
    const nonactiveEmp= (<HTMLInputElement>document.getElementById("nonactiveEmp")).value;
    this.apicall.listnomineedetails(nonactiveEmp).subscribe((res)=>{
    this.listnomineedetails=res;
      })
    }
    else
    {
      this.apicall.listnomineedetails(this.empcdd).subscribe((res)=>{
      this.listnomineedetails=res;
        })
    }

  }
  fetchAssetsDetails()
  {

    if(this.urlval=='edit_employee_profile')
    { 
    const nonactiveEmp= (<HTMLInputElement>document.getElementById("nonactiveEmp")).value;
    this.apicall.listassetsdetails(nonactiveEmp).subscribe((res)=>{
      this.listassetsdetails=res;
        })
    }
    else
    {
     
      this.apicall.listassetsdetails(this.empcdd).subscribe((res)=>{
        this.listassetsdetails=res;
          })
    }

  }

  
  fetchFamDetails()
  {
 

    if(this.urlval=='edit_employee_profile')
    { 
    const nonactiveEmp= (<HTMLInputElement>document.getElementById("nonactiveEmp")).value;

    //alert(nonactiveEmp);

    this.apicall.listfamdtl(nonactiveEmp).subscribe((res)=>{
      this.listfamilydetails=res;
        })
    }
    else
    {
     
      this.apicall.listfamdtl(this.empcdd).subscribe((res)=>{
        this.listfamilydetails=res;
          })
    }

  }


  fetchFamStatus()
  {
    if(this.urlval=='edit_employee_profile')
    { 
      const nonactiveEmp= (<HTMLInputElement>document.getElementById("nonactiveEmp")).value;
      this.apicall.listfamsts(nonactiveEmp).subscribe((res)=>{
      this.listfamilysts=res;
      
      if(this.listfamilysts!="")
      {
        this.insuranceval=this.listfamilysts[0].TYPE_ID;
        this.airticketval=this.listfamilysts[1].TYPE_ID;
        this.visaval=this.listfamilysts[2].TYPE_ID;
      }
      else
      {
        this.insuranceval=0;
        this.airticketval=0;
        this.visaval=0;
      }
      
     })
    }
    else
    {
      this.apicall.listfamsts(this.empcdd).subscribe((res)=>{
        this.listfamilysts=res;
        if(this.listfamilysts!="")
        {
          this.insuranceval=this.listfamilysts[0].TYPE_ID;
          this.airticketval=this.listfamilysts[1].TYPE_ID;
          this.visaval=this.listfamilysts[2].TYPE_ID;
        }
        else
        {
          this.insuranceval=0;
          this.airticketval=0;
          this.visaval=0;
        }

      })
    }
  }
  

  fetchEducation()
  {

   if(this.urlval=='edit_employee_profile')
   { 
    const catgrynm=1;
    const nonactiveEmp= (<HTMLInputElement>document.getElementById("nonactiveEmp")).value;
    //alert(nonactiveEmp);
    this.apicall.fetchperfesionaldtls(nonactiveEmp,catgrynm).subscribe((res)=>{
    this.fetcheducationdtl=res;

    })
  }
  else
  {
    const catgrynm=1;
    //alert(nonactiveEmp);
    this.apicall.fetchperfesionaldtls(this.empcdd,catgrynm).subscribe((res)=>{
    this.fetcheducationdtl=res;

    })
  }

  }
  fetchworkexp()
  {

    if(this.urlval=='edit_employee_profile')
    {
    const catgrynm=2;
    const nonactiveEmp= (<HTMLInputElement>document.getElementById("nonactiveEmp")).value;
    this.apicall.fetchperfesionaldtls(nonactiveEmp,catgrynm).subscribe((res)=>{
      this.fetchworkexpdtl=res;
        })
    }
    else
    {
      const catgrynm=2;
    this.apicall.fetchperfesionaldtls(this.empcdd,catgrynm).subscribe((res)=>{
      this.fetchworkexpdtl=res;
        })
    }


  }
  fetchcertificates()
  {
    if(this.urlval=='edit_employee_profile')
    {
    const catgrynm=3;
    const nonactiveEmp= (<HTMLInputElement>document.getElementById("nonactiveEmp")).value;
    this.apicall.fetchperfesionaldtls(nonactiveEmp,catgrynm).subscribe((res)=>{
      this.fetchcertidtl=res;
        })
      }
      else
      {
      const catgrynm=3;
      this.apicall.fetchperfesionaldtls(this.empcdd,catgrynm).subscribe((res)=>{
      this.fetchcertidtl=res;
        })
      }

  }


  fetchlang()
  {

    if(this.urlval=='edit_employee_profile')
    {
    const catgrynm=4;
    const nonactiveEmp= (<HTMLInputElement>document.getElementById("nonactiveEmp")).value;
    this.apicall.fetchperfesionaldtls(nonactiveEmp,catgrynm).subscribe((res)=>{
      this.fetchlangdtl=res;
        })
      }
      else
      {
        const catgrynm=4;
    this.apicall.fetchperfesionaldtls(this.empcdd,catgrynm).subscribe((res)=>{
      this.fetchlangdtl=res;
        })
      }

  }

  displayname(name:any)
  {
    //alert(name);
    //this.ffname.setValue(name);
    //sessionStorage.setItem("emp-key", JSON.stringify(name));
   // const names= sessionStorage.getItem("emp-key");
    this.ffname.setValue(name);

  }

  fetchnonactiveEmp()
  {
    this.apicall.listnonactiveEmp().subscribe((res)=>{
      this.listnonactiveEmp=res;
      //this.employee_code=this.listnonactiveEmp[0].EMP_CODE;
      })  
  }


fetchflag(empcd:any)
{
//alert("SF");
  //this.employee_code=empcd;  
  //alert(this.employee_code);
  this.empdocumentForm.controls['empcode'].setValue(empcd);
  this.empContactForm.controls['empcode'].setValue(empcd);
  this.EducationForm.controls['empcode'].setValue(empcd);
  this.ExperienceForm.controls['empcode'].setValue(empcd);
  this.certificatesForm.controls['empcode'].setValue(empcd);
  this.languagesForm.controls['empcode'].setValue(empcd);
  this.empNomineeForm.controls['empcode'].setValue(empcd);
  this.empAssetForm.controls['empcode'].setValue(empcd);
  this.bankSalaryForm.controls['empcode'].setValue(empcd);
  this.empOtherForm.controls['empcode'].setValue(empcd);
 
  //alert(this.profileprogress);

  //alert(this.errorsts);
  
  this.fetchcontactdtls();
  this.fetchEducation();
  this.fetchworkexp();
  this.fetchcertificates();
  this.fetchlang();
  this.fetchNomineeDetails();
  this.fetchAssetsDetails();
  this.fetchbasicdetails();
  this.fetchallowancedtl();
  this.fetchbankdetails();
  this.fetchdocdtls();
  this.fetchFamDetails();
  this.fetchFamStatus();

  this.apicall.fetchstatusflag(empcd).subscribe((res)=>{
    this.errid=res;
     //alert(this.errid[0].Errorid)
    this.errorsts=this.errid[0].Errorid;
    this.profileprogress=this.errid[0].Errormsg;

 })  

}


fetchbasicdetails()
{

 //alert(empcd);

  //alert(this.urlval);

  if(this.urlval=="edit_employee_profile") 
  {
    // alert("FFd");

  const nonactiveEmp= (<HTMLInputElement>document.getElementById("nonactiveEmp")).value;

 // alert(nonactiveEmp);
  
  this.apicall.EmployeeBasicdetails(nonactiveEmp).subscribe((res)=>{
  this.dispbasicdet=res;


  //alert(JSON.stringify(this.dispbasicdet[0].profilephoto));
 
  
  const olddob = this.dispbasicdet[0].DOB;
  const newdob=this.datePipe.transform(olddob,"yyyy-MM-dd");

  const oldjoin = this.dispbasicdet[0].DATE_OF_JOINING;
  const newjoin=this.datePipe.transform(oldjoin,"yyyy-MM-dd");

  const worktyp= this.dispbasicdet[0].WORKING_TYPE;
  this.chnageworkingFn(worktyp);
 
  this.empBasicForm.controls['profilephoto'].setValue(this.dispbasicdet[0].profilephoto);
   this.empBasicForm.controls['fname'].setValue(this.dispbasicdet[0].FIRST_NAME);
   this.empBasicForm.controls['mname'].setValue(this.dispbasicdet[0].MIDDLE_NAME);
   this.empBasicForm.controls['sname'].setValue(this.dispbasicdet[0].SUR_NAME);
   this.empBasicForm.controls['dob'].setValue(newdob);
   this.empBasicForm.controls['nationality'].setValue(this.dispbasicdet[0].NATIONALITY);
   this.empBasicForm.controls['gender'].setValue(this.dispbasicdet[0].GENDER);
   this.empBasicForm.controls['maritalsts'].setValue(this.dispbasicdet[0].MARRIED);
   this.empBasicForm.controls['comname'].setValue(this.dispbasicdet[0].COMPANY_CODE);
   this.empBasicForm.controls['empcode'].setValue(this.dispbasicdet[0].EMP_CODE);
   this.empBasicForm.controls['role'].setValue(this.dispbasicdet[0].EMP_ROLE_ID);
   this.empBasicForm.controls['joindate'].setValue(newjoin);
   this.empBasicForm.controls['department'].setValue(this.dispbasicdet[0].DEPARTMENT);

   if(this.dispbasicdet[0].LOCATION=="")
   {
    this.empBasicForm.controls['worklocation'].setValue("");
   }
   else
   {
    this.empBasicForm.controls['worklocation'].setValue(this.dispbasicdet[0].LOCATION);
   }

   this.empBasicForm.controls['designation'].setValue(this.dispbasicdet[0].DESIGNATION);

   
   if(this.dispbasicdet[0].GRADE_ID=="")
   {
     this.empBasicForm.controls['grade'].setValue("");
   }
   else
   {
     this.empBasicForm.controls['grade'].setValue(this.dispbasicdet[0].GRADE_ID);
   }


   this.empBasicForm.controls['reportingmngr'].setValue(this.dispbasicdet[0].REPORTING_MANGER);
   this.empBasicForm.controls['jdfile'].setValue(this.dispbasicdet[0].JD_FILE);
   this.empBasicForm.controls['prjtcoordinator'].setValue(this.dispbasicdet[0].PROJECT_CORDINATOR);
   this.empBasicForm.controls['probation'].setValue(this.dispbasicdet[0].PROBATION_PERIOD);
   this.empBasicForm.controls['emptype'].setValue(this.dispbasicdet[0].EMPLOYEE_TYPE);
   this.empBasicForm.controls['perhrrate'].setValue(this.dispbasicdet[0].PER_HOUR_RATE);
   this.empBasicForm.controls['sponserdtl'].setValue(this.dispbasicdet[0].SPONSOR);
   this.empBasicForm.controls['shifttime'].setValue(this.dispbasicdet[0].SHIFT_ID);
   this.empBasicForm.controls['workingday'].setValue(this.dispbasicdet[0].WORKING_TYPE);
   this.empBasicForm.controls['oteligible'].setValue(this.dispbasicdet[0].OVERTIME_ELIGIBILTY);

   if(this.dispbasicdet[0].AIRPORT_DESTN=="")
   {
    this.empBasicForm.controls['airdestination'].setValue("");
   }
   else
   {
    this.empBasicForm.controls['airdestination'].setValue(this.dispbasicdet[0].AIRPORT_DESTN);
   }


   this.empBasicForm.controls['aireligibility'].setValue(this.dispbasicdet[0].AIRTICKET_ELIGIBILTY); 
   this.empBasicForm.controls['accomodation'].setValue(this.dispbasicdet[0].ACCOMMODATION_CODE);


   if(this.dispbasicdet[0].MEDICAL_INSURANCE=="")
   {
    this.empBasicForm.controls['insurancetype'].setValue("");
   }
   else
   {
    this.empBasicForm.controls['insurancetype'].setValue(this.dispbasicdet[0].MEDICAL_INSURANCE);
   }

   this.empBasicForm.controls['notperiod'].setValue(this.dispbasicdet[0].NOTICE_PERIOD);
   this.empBasicForm.controls['companyaccomodation'].setValue(this.dispbasicdet[0].ACCOMMODATION_TYPE);
  
   this.gradeids=this.dispbasicdet[0].GRADE_ID;

   this.empBasicForm.controls['contractor_dtl'].setValue(this.dispbasicdet[0].CONTRACTOR_NAME);
   if(this.dispbasicdet[0].ACCOMMODATION_CODE!="")
   {
    this.chnageaccomodationtype(1);
    this.empBasicForm.controls['companyaccomodation'].setValue(1);
   }
   else
   {
    this.chnageaccomodationtype(2);
    this.empBasicForm.controls['companyaccomodation'].setValue(2);
   }


  if(this.dispbasicdet[0].CONTRACTOR_NAME!="" ||  this.dispbasicdet[0].PER_HOUR_RATE!='0')
   {
    this.chnagecontractFn(2);
   }
   else
   {
    this.chnagecontractFn(1);
   }
   


  const imgCtrl=<HTMLImageElement>document.getElementById("emp_pic");
  var result = this.dispbasicdet[0].PHOTO_PATH.substr(this.dispbasicdet[0].PHOTO_PATH.length - 1);
  if(result=='/')
  {
    imgCtrl.src="assets/styles/img/Admin 2.png";
  }
  else
  {
    imgCtrl.src=this.apicall.dotnetapi+this.dispbasicdet[0].PHOTO_PATH;
  }

  let filectrl=<HTMLInputElement>document.getElementById('filejd');
  this.jdfile=this.dispbasicdet[0].JD_FILE;
  let fileurls=this.apicall.GetEmployeeDocs(this.dispbasicdet[0].EMP_CODE,2,2,this.jdfile);
  
  filectrl.value=fileurls;
  
  })  

  this.apicall.FetchCompanyList(nonactiveEmp).subscribe((res)=>{
    this.listCompany=res;
    const keyIds = this.listCompany.map((company: { KEY_ID: any; }) => company.KEY_ID);
  
    if(this.listCompany!="")
    {
      this.comdtl = keyIds.join(',');
    }
    // else
    // {
    //   this.comdtl = 'Select';
    // }
   
    })
  
    this.apicall.FetchResouceList(nonactiveEmp).subscribe((res)=>{
      this.listresouce=res;
  
     // alert(JSON.stringify(this.listresouce));
  
      const keyIds = this.listresouce.map((resource: { KEY_ID: any; }) => resource.KEY_ID);
    
      if(this.listresouce!="")
      {
        this.resdtl = keyIds.join(',');
      }
      // else
      // {
      //   this.resdtl = 'Select';
      // }
     
      })

  
  }

  else
  {
 
    this.apicall.EmployeeBasicdetails(this.empcdd).subscribe((res)=>{
      this.dispbasicdet=res;
      //alert(JSON.stringify(res));
      
      const olddob = this.dispbasicdet[0].DOB;
      const newdob=this.datePipe.transform(olddob,"yyyy-MM-dd");
    
      const oldjoin = this.dispbasicdet[0].DATE_OF_JOINING;
      const newjoin=this.datePipe.transform(oldjoin,"yyyy-MM-dd");
    
      const worktyp= this.dispbasicdet[0].WORKING_TYPE;
      this.chnageworkingFn(worktyp);
     
      this.empBasicForm.controls['profilephoto'].setValue(this.dispbasicdet[0].profilephoto);
       this.empBasicForm.controls['fname'].setValue(this.dispbasicdet[0].FIRST_NAME);
       this.empBasicForm.controls['mname'].setValue(this.dispbasicdet[0].MIDDLE_NAME);
       this.empBasicForm.controls['sname'].setValue(this.dispbasicdet[0].SUR_NAME);
       this.empBasicForm.controls['dob'].setValue(newdob);
       this.empBasicForm.controls['nationality'].setValue(this.dispbasicdet[0].NATIONALITY);
       this.empBasicForm.controls['gender'].setValue(this.dispbasicdet[0].GENDER);
       this.empBasicForm.controls['maritalsts'].setValue(this.dispbasicdet[0].MARRIED);
       this.empBasicForm.controls['comname'].setValue(this.dispbasicdet[0].COMPANY_CODE);
       this.empBasicForm.controls['empcode'].setValue(this.dispbasicdet[0].EMP_CODE);
       this.empBasicForm.controls['role'].setValue(this.dispbasicdet[0].EMP_ROLE_ID);
       this.empBasicForm.controls['joindate'].setValue(newjoin);
       this.empBasicForm.controls['department'].setValue(this.dispbasicdet[0].DEPARTMENT);
    
       if(this.dispbasicdet[0].LOCATION=="")
       {
        this.empBasicForm.controls['worklocation'].setValue("");
       }
       else
       {
        this.empBasicForm.controls['worklocation'].setValue(this.dispbasicdet[0].LOCATION);
       }
    
       this.empBasicForm.controls['designation'].setValue(this.dispbasicdet[0].DESIGNATION);
    
       
       if(this.dispbasicdet[0].GRADE_ID=="")
       {
         this.empBasicForm.controls['grade'].setValue("");
       }
       else
       {
         this.empBasicForm.controls['grade'].setValue(this.dispbasicdet[0].GRADE_ID);
       }
    
    
       this.empBasicForm.controls['reportingmngr'].setValue(this.dispbasicdet[0].REPORTING_MANGER);
       this.empBasicForm.controls['jdfile'].setValue(this.dispbasicdet[0].JD_FILE);
       this.empBasicForm.controls['prjtcoordinator'].setValue(this.dispbasicdet[0].PROJECT_CORDINATOR);
       this.empBasicForm.controls['probation'].setValue(this.dispbasicdet[0].PROBATION_PERIOD);
       this.empBasicForm.controls['emptype'].setValue(this.dispbasicdet[0].EMPLOYEE_TYPE);
       this.empBasicForm.controls['perhrrate'].setValue(this.dispbasicdet[0].PER_HOUR_RATE);
       this.empBasicForm.controls['sponserdtl'].setValue(this.dispbasicdet[0].SPONSOR);
       this.empBasicForm.controls['shifttime'].setValue(this.dispbasicdet[0].SHIFT_ID);
       this.empBasicForm.controls['workingday'].setValue(this.dispbasicdet[0].WORKING_TYPE);
       this.empBasicForm.controls['oteligible'].setValue(this.dispbasicdet[0].OVERTIME_ELIGIBILTY);
    
       if(this.dispbasicdet[0].AIRPORT_DESTN=="")
       {
        this.empBasicForm.controls['airdestination'].setValue("");
       }
       else
       {
        this.empBasicForm.controls['airdestination'].setValue(this.dispbasicdet[0].AIRPORT_DESTN);
       }
    
    
       this.empBasicForm.controls['aireligibility'].setValue(this.dispbasicdet[0].AIRTICKET_ELIGIBILTY);
       this.empBasicForm.controls['accomodation'].setValue(this.dispbasicdet[0].ACCOMMODATION_CODE);

       if(this.dispbasicdet[0].MEDICAL_INSURANCE=="")
       {
        this.empBasicForm.controls['insurancetype'].setValue("");
       }
       else
       {
        this.empBasicForm.controls['insurancetype'].setValue(this.dispbasicdet[0].MEDICAL_INSURANCE);
       }
    
       this.empBasicForm.controls['notperiod'].setValue(this.dispbasicdet[0].NOTICE_PERIOD);
       this.empBasicForm.controls['companyaccomodation'].setValue(this.dispbasicdet[0].ACCOMMODATION_TYPE);
      
       this.gradeids=this.dispbasicdet[0].GRADE_ID;
    
       this.empBasicForm.controls['contractor_dtl'].setValue(this.dispbasicdet[0].CONTRACTOR_NAME);
       if(this.dispbasicdet[0].ACCOMMODATION_CODE!="")
       {
        this.chnageaccomodationtype(1);
        this.empBasicForm.controls['companyaccomodation'].setValue(1);
       }
       else
       {
        this.chnageaccomodationtype(2);
        this.empBasicForm.controls['companyaccomodation'].setValue(2);
       }
    
    
      if(this.dispbasicdet[0].CONTRACTOR_NAME!="" || this.dispbasicdet[0].PER_HOUR_RATE!='0')
       {
        this.chnagecontractFn(2);
       }
       else
       {
        this.chnagecontractFn(1);
       }
       
    
    
      const imgCtrl=<HTMLImageElement>document.getElementById("emp_pic");
      var result = this.dispbasicdet[0].PHOTO_PATH.substr(this.dispbasicdet[0].PHOTO_PATH.length - 1);
      if(result=='/')
      {
        imgCtrl.src="assets/styles/img/Admin 2.png";
      }
      else
      {
        imgCtrl.src=this.apicall.dotnetapi+this.dispbasicdet[0].PHOTO_PATH;
      }
    
      let filectrl=<HTMLInputElement>document.getElementById('filejd');
      this.jdfile=this.dispbasicdet[0].JD_FILE;
      let fileurls=this.apicall.GetEmployeeDocs(this.dispbasicdet[0].EMP_CODE,2,2,this.jdfile);
      
      filectrl.value=fileurls;
    
      })  

      this.apicall.FetchCompanyList(this.empcdd).subscribe((res)=>{
        this.listCompany=res;
        const keyIds = this.listCompany.map((company: { KEY_ID: any; }) => company.KEY_ID);
      
        if(this.listCompany!="")
        {
          this.comdtl = keyIds.join(',');
        }
        // else
        // {
        //   this.comdtl = 'Select';
        // }
       
        })
      
        this.apicall.FetchResouceList(this.empcdd).subscribe((res)=>{
          this.listresouce=res;
      
         // alert(JSON.stringify(this.listresouce));
      
          const keyIds = this.listresouce.map((resource: { KEY_ID: any; }) => resource.KEY_ID);
        
          if(this.listresouce!="")
          {
            this.resdtl = keyIds.join(',');
          }
          // else
          // {
          //   this.resdtl = 'Select';
          // }
         
          })
  

  }


}


fetchallowancedtl()
{

  if(this.urlval=='edit_employee_profile')

  {

  const nonactiveEmp= (<HTMLInputElement>document.getElementById("nonactiveEmp")).value;
  //alert(nonactiveEmp);
  this.apicall.displayallowance(nonactiveEmp).subscribe((res)=>{
  this.displayallowancedtls=res;

  const sum = this.displayallowancedtls.reduce((total:any, item:any) => total + item.AMOUNT, 0);
   
  this.bankSalaryForm.controls['gross_salary'].setValue(sum);

  }) 

  }
  else
  {  
    this.apicall.displayallowance(this.empcdd).subscribe((res)=>{
    this.displayallowancedtls=res;
  
    const sum = this.displayallowancedtls.reduce((total:any, item:any) => total + item.AMOUNT, 0);
     
    this.bankSalaryForm.controls['gross_salary'].setValue(sum);
  
    }) 

  }

}

fetchbankdetails()
{

  if(this.urlval=='edit_employee_profile')
  {

  const nonactiveEmp= (<HTMLInputElement>document.getElementById("nonactiveEmp")).value;

  this.apicall.listsalarydetails(nonactiveEmp).subscribe((res)=>{
  this.fetchbankdtls=res;

  //alert(JSON.stringify(res));

  if( this.fetchbankdtls!="")
  {

    if(this.fetchbankdtls[0].SALARY_PROCESS==0)
    {
      this.bankSalaryForm.controls['salprocess'].setValue("0");
    }
    else
    {
      this.bankSalaryForm.controls['salprocess'].setValue(this.fetchbankdtls[0].SALARY_PROCESS);
    }

    if(this.fetchbankdtls[0].PAYMENT_MODE==0)
    {
      this.bankSalaryForm.controls['paymode'].setValue("0");  
    }
    else
    {
      this.bankSalaryForm.controls['paymode'].setValue(this.fetchbankdtls[0].PAYMENT_MODE);  
    }

    if(this.fetchbankdtls[0].EMP_WPS_COMPANY==0)
    {
      this.bankSalaryForm.controls['wpscompny'].setValue("null");
    }
    else
    {
      this.bankSalaryForm.controls['wpscompny'].setValue(this.fetchbankdtls[0].EMP_WPS_COMPANY);
    }

    if(this.fetchbankdtls[0].BANK_ID==0)
    {
      this.bankSalaryForm.controls['bankname'].setValue("0");
    }
    else
    {
      this.bankSalaryForm.controls['bankname'].setValue(this.fetchbankdtls[0].BANK_ID);
    }
  
  this.bankSalaryForm.controls['accountno'].setValue(this.fetchbankdtls[0].ACCOUNT_NO);
  this.bankSalaryForm.controls['iban_no'].setValue(this.fetchbankdtls[0].IBAN_NO);
  this.bankSalaryForm.controls['CBIDcode'].setValue(this.fetchbankdtls[0].CBID_CODE);
  this.bankSalaryForm.controls['routing_code'].setValue(this.fetchbankdtls[0].ROUTING_CODE);
  this.bankSalaryForm.controls['mol_no'].setValue(this.fetchbankdtls[0].MOL_NO);
 
  

  }
  else{
  
    this.resetbank();
  }

    }) 
    
  }
  else
  {
  

    this.apicall.listsalarydetails(this.empcdd).subscribe((res)=>{
    this.fetchbankdtls=res;
  
    //alert(JSON.stringify(res));
  
    if( this.fetchbankdtls!="")
    {
  
      if(this.fetchbankdtls[0].SALARY_PROCESS==0)
      {
        this.bankSalaryForm.controls['salprocess'].setValue("0");
      }
      else
      {
        this.bankSalaryForm.controls['salprocess'].setValue(this.fetchbankdtls[0].SALARY_PROCESS);
      }
  
      if(this.fetchbankdtls[0].PAYMENT_MODE==0)
      {
        this.bankSalaryForm.controls['paymode'].setValue("0");  
      }
      else
      {
        this.bankSalaryForm.controls['paymode'].setValue(this.fetchbankdtls[0].PAYMENT_MODE);  
      }
  
      if(this.fetchbankdtls[0].EMP_WPS_COMPANY==0)
      {
        this.bankSalaryForm.controls['wpscompny'].setValue("null");
      }
      else
      {
        this.bankSalaryForm.controls['wpscompny'].setValue(this.fetchbankdtls[0].EMP_WPS_COMPANY);
      }
  
      if(this.fetchbankdtls[0].BANK_ID==0)
      {
        this.bankSalaryForm.controls['bankname'].setValue("0");
      }
      else
      {
        this.bankSalaryForm.controls['bankname'].setValue(this.fetchbankdtls[0].BANK_ID);
      }
    
    this.bankSalaryForm.controls['accountno'].setValue(this.fetchbankdtls[0].ACCOUNT_NO);
    this.bankSalaryForm.controls['iban_no'].setValue(this.fetchbankdtls[0].IBAN_NO);
    this.bankSalaryForm.controls['CBIDcode'].setValue(this.fetchbankdtls[0].CBID_CODE);
    this.bankSalaryForm.controls['routing_code'].setValue(this.fetchbankdtls[0].ROUTING_CODE);
    this.bankSalaryForm.controls['mol_no'].setValue(this.fetchbankdtls[0].MOL_NO);
   
    
  
    }
    else{
    
      this.resetbank();
    }
  
      }) 
  }


}


fetchcontactdtls()
{

  if(this.urlval=='edit_employee_profile')
  {

  const nonactiveEmp= (<HTMLInputElement>document.getElementById("nonactiveEmp")).value;  
  this.apicall.fetchcontactdtl(nonactiveEmp).subscribe((res)=>{
  this.fetchcontactdtl=res;
  if(this.fetchcontactdtl!="")
  {
      this.empContactForm.controls['emailid'].setValue(this.fetchcontactdtl[0].PERS_EMAIL);
      this.empContactForm.controls['permob'].setValue(this.fetchcontactdtl[0].PERS_MOBILE);
      this.empContactForm.controls['resiaddrs'].setValue(this.fetchcontactdtl[0].RES_ADDRESS);
      this.empContactForm.controls['residencetel'].setValue(this.fetchcontactdtl[0].RES_TELEPHONE);
      this.empContactForm.controls['orginaddr'].setValue(this.fetchcontactdtl[0].ORIGIN_CTRY_ADDRESS);
      this.empContactForm.controls['orgincontct'].setValue(this.fetchcontactdtl[0].ORIGIN_CONTACT);
      this.empContactForm.controls['localcontact'].setValue(this.fetchcontactdtl[0].EMR_LOCALCONT_NAME);
      this.empContactForm.controls['localmob'].setValue(this.fetchcontactdtl[0].EMR_LOCAL_CONT_NO);
      this.empContactForm.controls['localrel'].setValue(this.fetchcontactdtl[0].EMR_LOCAL_RELATION);
      this.empContactForm.controls['nameoforgincontact'].setValue(this.fetchcontactdtl[0].EMR_HOME_CONT_NAME);
      this.empContactForm.controls['emercontact'].setValue(this.fetchcontactdtl[0].EMR_HOME_CONT_NO);
      this.empContactForm.controls['relation'].setValue(this.fetchcontactdtl[0].EMR_HOME_RELATION);
      this.empContactForm.controls['offemail'].setValue(this.fetchcontactdtl[0].OFFICIAL_EMAIL);
      this.empContactForm.controls['offmob'].setValue(this.fetchcontactdtl[0].OFFICIAL_MOBILE);
      this.empContactForm.controls['extensionno'].setValue(this.fetchcontactdtl[0].EXTENSON_NO);
  }
  else
  {
    this.Resetcontact();
  }

  }) 

 }
 else
 {

  this.apicall.fetchcontactdtl(this.empcdd).subscribe((res)=>{
    this.fetchcontactdtl=res;
    if(this.fetchcontactdtl!="")
    {
        this.empContactForm.controls['emailid'].setValue(this.fetchcontactdtl[0].PERS_EMAIL);
        this.empContactForm.controls['permob'].setValue(this.fetchcontactdtl[0].PERS_MOBILE);
        this.empContactForm.controls['resiaddrs'].setValue(this.fetchcontactdtl[0].RES_ADDRESS);
        this.empContactForm.controls['residencetel'].setValue(this.fetchcontactdtl[0].RES_TELEPHONE);
        this.empContactForm.controls['orginaddr'].setValue(this.fetchcontactdtl[0].ORIGIN_CTRY_ADDRESS);
        this.empContactForm.controls['orgincontct'].setValue(this.fetchcontactdtl[0].ORIGIN_CONTACT);
        this.empContactForm.controls['localcontact'].setValue(this.fetchcontactdtl[0].EMR_LOCALCONT_NAME);
        this.empContactForm.controls['localmob'].setValue(this.fetchcontactdtl[0].EMR_LOCAL_CONT_NO);
        this.empContactForm.controls['localrel'].setValue(this.fetchcontactdtl[0].EMR_LOCAL_RELATION);
        this.empContactForm.controls['nameoforgincontact'].setValue(this.fetchcontactdtl[0].EMR_HOME_CONT_NAME);
        this.empContactForm.controls['emercontact'].setValue(this.fetchcontactdtl[0].EMR_HOME_CONT_NO);
        this.empContactForm.controls['relation'].setValue(this.fetchcontactdtl[0].EMR_HOME_RELATION);
        this.empContactForm.controls['offemail'].setValue(this.fetchcontactdtl[0].OFFICIAL_EMAIL);
        this.empContactForm.controls['offmob'].setValue(this.fetchcontactdtl[0].OFFICIAL_MOBILE);
        this.empContactForm.controls['extensionno'].setValue(this.fetchcontactdtl[0].EXTENSON_NO);
    }
    else
    {
      this.Resetcontact();
    }
  
    }) 

 }

}



fetchdocdtls() 
{

  if(this.urlval=='edit_employee_profile')

  {
  const nonactiveEmp= (<HTMLInputElement>document.getElementById("nonactiveEmp")).value;

 // alert(nonactiveEmp);

  this.apicall.fetchdocdtls(nonactiveEmp).subscribe((res)=>{
  this.fetchdocdetails=res;

 // alert(JSON.stringify(this.fetchdocdetails));

    if(this.fetchdocdetails!="")
    {
        //this.docsvalue=1;
    }
    else
    {
       // this.docsvalue=0;   
       // this.resetdoc();
    }

})   
}
else
{

   this.apicall.fetchdocdtls(this.empcdd).subscribe((res)=>{
   this.fetchdocdetails=res;
 
  // alert(JSON.stringify(this.fetchdocdetails));
 
     if(this.fetchdocdetails!="")
     {
         //this.docsvalue=1;
     }
     else
     {
        // this.docsvalue=0;   
        // this.resetdoc();
     }
 
 }) 

 }

}


chnageaccomodationtype(accomtype:any)
{
   // alert(accomtype);
     if(accomtype==1)
     {
      this.accomodationtype=true;
     }
    else if(accomtype==2)
    {
      this.accomodationtype=false;
    }
}
ViewFiles(fpath:any,doctype:any,upflag:any)
{
 // alert("fDF")
  const ecode= (<HTMLInputElement>document.getElementById("nonactiveEmp")).value;
  let fileurl=this.apicall.GetEmployeeDocs(ecode,doctype,upflag,fpath);
  //alert(fileurl)
  let link = document.createElement("a");
  link.setAttribute("href", fileurl);
  link.setAttribute("target", "_blank");
          link.setAttribute("download", "");
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link)
}



Resetbasic()
{
  this.empBasicForm.controls['fname'].reset();
  this.empBasicForm.get('fname')?.setErrors(null); 
   this.empBasicForm.controls['mname'].reset();
   this.empBasicForm.controls['sname'].reset();
   this.empBasicForm.controls['dob'].reset();
   this.empBasicForm.get('dob')?.setErrors(null); 
   this.empBasicForm.controls['nationality'].setValue("");
   this.empBasicForm.get('nationality')?.setErrors(null); 
   this.empBasicForm.controls['gender'].setValue("");
   this.empBasicForm.get('gender')?.setErrors(null); 
   this.empBasicForm.controls['maritalsts'].setValue("");
   this.empBasicForm.get('maritalsts')?.setErrors(null); 
   this.empBasicForm.controls['comname'].setValue("");
   this.empBasicForm.get('comname')?.setErrors(null); 
   this.empBasicForm.controls['empcode'].reset();
   this.empBasicForm.get('empcode')?.setErrors(null); 
   this.empBasicForm.controls['role'].setValue('7');
   this.empBasicForm.controls['joindate'].reset();
   this.empBasicForm.get('joindate')?.setErrors(null); 
   this.empBasicForm.controls['department'].setValue("");
   this.empBasicForm.get('department')?.setErrors(null); 
   this.empBasicForm.controls['worklocation'].setValue("");
   this.empBasicForm.controls['designation'].setValue("");
   this.empBasicForm.get('designation')?.setErrors(null); 
   this.empBasicForm.controls['grade'].setValue("");
   this.empBasicForm.controls['reportingmngr'].setValue("");
   this.empBasicForm.get('reportingmngr')?.setErrors(null); 
   this.empBasicForm.controls['prjtcoordinator'].setValue("");
   this.empBasicForm.controls['probation'].setValue('6');
   this.empBasicForm.controls['emptype'].setValue("");
   this.empBasicForm.get('emptype')?.setErrors(null); 
   this.empBasicForm.controls['perhrrate'].reset();
   this.empBasicForm.controls['sponserdtl'].setValue("");
   this.empBasicForm.get('sponserdtl')?.setErrors(null); 
   this.empBasicForm.controls['shifttime'].setValue('1');
   this.empBasicForm.controls['workingday'].setValue('1');
   this.empBasicForm.controls['oteligible'].setValue("");
   this.empBasicForm.controls['airdestination'].setValue("");
   this.empBasicForm.controls['aireligibility'].setValue('1');
   this.empBasicForm.controls['accomodation'].setValue("");
   this.empBasicForm.controls['insurancetype'].setValue("");
   this.empBasicForm.controls['notperiod'].reset();
   this.empBasicForm.controls['companyaccomodation'].setValue("");
   this.empBasicForm.controls['filejd'].reset();
   this.empBasicForm.controls['weekoff'].setValue('2');
   
}

Resetcontact()
{

  this.empContactForm.controls['emailid'].reset();
  this.empContactForm.controls['permob'].reset();
  // this.empContactForm.get('permob')?.setErrors(null);
  this.empContactForm.controls['resiaddrs'].reset();
  // this.empContactForm.get('resiaddrs')?.setErrors(null);
  this.empContactForm.controls['residencetel'].reset();
  this.empContactForm.controls['orginaddr'].reset();
  // this.empContactForm.get('orginaddr')?.setErrors(null); 
  this.empContactForm.controls['orgincontct'].reset();
  // this.empContactForm.get('orgincontct')?.setErrors(null); 
  this.empContactForm.controls['localcontact'].reset();
  // this.empContactForm.get('localcontact')?.setErrors(null); 
  this.empContactForm.controls['localmob'].reset();
  // this.empContactForm.get('localmob')?.setErrors(null); 
  this.empContactForm.controls['localrel'].setValue("");
  // this.empContactForm.get('localrel')?.setErrors(null); 
  this.empContactForm.controls['nameoforgincontact'].reset();
  // this.empContactForm.get('nameoforgincontact')?.setErrors(null); 
  this.empContactForm.controls['emercontact'].reset();
  // this.empContactForm.get('emercontact')?.setErrors(null); 
  this.empContactForm.controls['relation'].setValue("");
  // this.empContactForm.get('relation')?.setErrors(null); 
  this.empContactForm.controls['offemail'].reset();
  this.empContactForm.controls['offmob'].reset();
  this.empContactForm.controls['extensionno'].reset();

}


resetedu()
{

  this.EducationForm.controls['catgryname'].setValue("");
  this.EducationForm.get('catgryname')?.setErrors(null); 
  this.EducationForm.controls['catgryvalue'].setValue("");
  this.EducationForm.get('catgryvalue')?.setErrors(null); 
  this.EducationForm.controls['docpath'].reset();
  this.EducationForm.get('docpath')?.setErrors(null); 

}
resetexp()
{

  this.ExperienceForm.controls['catgryname'].setValue("");
  this.ExperienceForm.get('catgryname')?.setErrors(null); 
  this.ExperienceForm.controls['catgryvalue'].setValue("");
  this.ExperienceForm.get('catgryvalue')?.setErrors(null); 
  this.ExperienceForm.controls['docpath'].reset();
  this.ExperienceForm.get('docpath')?.setErrors(null); 

}
resetcert()
{

  this.certificatesForm.controls['catgryname'].reset();
  this.certificatesForm.get('catgryname')?.setErrors(null); 
  this.certificatesForm.controls['catgryvalue'].reset();
  this.certificatesForm.get('catgryvalue')?.setErrors(null); 
  this.certificatesForm.controls['docpath'].reset();
  this.certificatesForm.get('docpath')?.setErrors(null); 

}
resetlang()
{

  this.languagesForm.controls['catgryname'].setValue("null");
  this.languagesForm.controls['catgryvalue'].setValue("null");
  this.languagesForm.controls['docpath'].reset();

}

resetnominee()
{
  this.empNomineeForm.controls['nomname'].reset();
  this.empNomineeForm.get('nomname')?.setErrors(null);  
  this.empNomineeForm.controls['nomdob'].reset();
  this.empNomineeForm.get('nomdob')?.setErrors(null);  
  this.empNomineeForm.controls['nomage'].reset();
  this.empNomineeForm.get('nomage')?.setErrors(null);  
  this.empNomineeForm.controls['nomcontactno'].reset();
  this.empNomineeForm.get('nomcontactno')?.setErrors(null);  
  this.empNomineeForm.controls['nomrelationship'].setValue("null");
  this.empNomineeForm.get('nomrelationship')?.setErrors(null);  
  this.empNomineeForm.controls['nomnationality'].setValue("null");
  this.empNomineeForm.get('nomnationality')?.setErrors(null);  
  this.empNomineeForm.controls['nompassportno'].reset();
  this.empNomineeForm.get('nompassportno')?.setErrors(null);  
  this.empNomineeForm.controls['nomperaddrs'].reset();
  this.empNomineeForm.get('nomperaddrs')?.setErrors(null);  
  this.empNomineeForm.controls['nomlocaladdrs'].reset();
  this.empNomineeForm.get('nomlocaladdrs')?.setErrors(null);  
  this.empNomineeForm.controls['nompercentage'].reset();
  this.empNomineeForm.get('nompercentage')?.setErrors(null);  
}

resetassets()
{
  this.empAssetForm.controls['category'].setValue("");
  this.empAssetForm.get('category')?.setErrors(null);
  this.empAssetForm.controls['assetname'].setValue("");
  this.empAssetForm.get('assetname')?.setErrors(null);
  this.empAssetForm.controls['cost'].reset();
  this.empAssetForm.get('cost')?.setErrors(null);
  this.empAssetForm.controls['issueddate'].reset();
  this.empAssetForm.get('issueddate')?.setErrors(null);
  this.empAssetForm.controls['assetsts'].setValue("");
  this.empAssetForm.get('assetsts')?.setErrors(null);
  this.empAssetForm.controls['returndate'].reset();
  this.empAssetForm.get('returndate')?.setErrors(null);
  this.empAssetForm.controls['desc'].reset();
  this.empAssetForm.get('desc')?.setErrors(null);  
  

}

resetbank()
{
  this.bankSalaryForm.controls['bankname'].setValue("0");
  this.empAssetForm.get('bankname')?.setErrors(null);  
  this.bankSalaryForm.controls['accountno'].reset();
  this.empAssetForm.get('accountno')?.setErrors(null);  
  this.bankSalaryForm.controls['iban_no'].reset();
  this.empAssetForm.get('iban_no')?.setErrors(null);  
  this.bankSalaryForm.controls['CBIDcode'].reset();
  this.empAssetForm.get('CBIDcode')?.setErrors(null);  
  this.bankSalaryForm.controls['routing_code'].reset();
  this.empAssetForm.get('routing_code')?.setErrors(null);  
  this.bankSalaryForm.controls['mol_no'].reset();
  this.empAssetForm.get('mol_no')?.setErrors(null);  
  this.bankSalaryForm.controls['wpscompny'].reset();
  this.empAssetForm.get('wpscompny')?.setErrors(null);  
  this.bankSalaryForm.controls['salprocess'].setValue("0");
  this.empAssetForm.get('salprocess')?.setErrors(null);  
  this.bankSalaryForm.controls['paymode'].setValue("0");
  this.empAssetForm.get('paymode')?.setErrors(null);  
}

resetdoc()
{
  this.empdocumentForm.controls['passportno'].reset("");
  this.empdocumentForm.controls['passportexpiry'].reset("");
  this.passfile="";
  this.empdocumentForm.controls['visanumbr'].reset("");
  this.empdocumentForm.controls['visaexpiry'].reset("");
  this.visafile="";
  this.empdocumentForm.controls['emiratesid'].reset("");
  this.empdocumentForm.controls['emirateexpiry'].reset("");
  this.emifile="";
  this.empdocumentForm.controls['licenceno'].reset("");
  this.empdocumentForm.controls['licenceexpiry'].reset("");
  this.licencefile="";
  this.empdocumentForm.controls['CECCardno'].reset("");
  this.contractfile="";
}


Editedu(empcode:any,category:any,catname:any,catvalue:any,docpath:any)
  {
  

    this.fetcheducationdtl.forEach((data: {
      edtdcategory_name:any;
      edtdcategory_value:any;
       
       CATEGORY: any; 
       nonactiveEmp:any;
       CATEGORY_VALUE:any;
       EMP_CODE:any;
       iseduEditing: boolean; 
       }) => {
       

       data.edtdcategory_name = (data.CATEGORY === category && data.CATEGORY_VALUE === catvalue && data.EMP_CODE === empcode ) ? catname : '';
       data.edtdcategory_value = (data.CATEGORY === category && data.CATEGORY_VALUE === catvalue && data.EMP_CODE === empcode  ) ? catvalue : '';
       data.iseduEditing = (data.CATEGORY === category && data.CATEGORY_VALUE === catvalue && data.EMP_CODE === empcode  );

     });


  }
  saveeduFn(empcode:any,category:any,catname:any,catvalue:any,docpath:any,recordId:any,docpathid:any)
  {

    //alert(docpath);
    let file_extension;
    let file_parts;

    if(docpath !== undefined){
      file_parts = docpath.split('.');
      //alert(file_parts);
      file_extension = file_parts[1];
      //alert(file_extension);
      const fileInput = <HTMLInputElement>document.getElementsByClassName('edufile')[0] as HTMLInputElement;

      if (fileInput && fileInput.files && fileInput.files.length > 0) {
          const file = fileInput.files[0];
          this.fileSizeInKb = file.size / 1024;
      } 
    }
    else
    {
      file_parts = docpathid.split('.');
      file_extension = file_parts[1];
      this.fileSizeInKb = 199;
     
    }
    

    if (file_extension !== 'pdf' || this.fileSizeInKb > 200) 
    {
      (<HTMLInputElement>document.getElementById("openModalButtonForalert")).click();
      this.showModal = 1;
      this.success = "Please choose pdf file and below 200 kb";  
    }
    else

   {
   

   // alert(docpath);
    if(docpath!=undefined)
{
  docpath=docpath;
}
else
{
  docpath=docpathid;
}
    const nonactiveEmp= (<HTMLInputElement>document.getElementById("nonactiveEmp")).value;
    const updateeduData={
      edtdcategory:category,
      edtdcategory_name:catname,
      edtdcategory_path:docpath,
      edtdcategory_value:catvalue,
      updatedby:this.empcode,
      empcode :nonactiveEmp,
      record_id: recordId  

    };
  

    this.apicall.Editprofdtl(updateeduData).subscribe(res => {
      if(res.Errorid==1){
        (<HTMLInputElement>document.getElementById("openModalButtonForalert")).click();
        this.showModal = 1;
        this.success = "Updated Successfully...";

        const dropfile=<HTMLInputElement>document.getElementById("editupfile");

        //alert(dropfile);
        this.onFileSelecteducation(dropfile,recordId,nonactiveEmp); 

        this.fetchEducation(); 
        this.Changeflag=0;
        
      }
     
    });
   
    this.iseduEditing= false; 
    
   }

  }


  EditworkExp(empcode:any,category:any,catname:any,catvalue:any,docpath:any)
  {

//alert(catvalue);

    this.fetchworkexpdtl.forEach((data: {
      edtdcategory_name:any;
      edtdcategory_value:any;
       
       CATEGORY: any; 
       nonactiveEmp:any;
       CATEGORY_VALUE:any;
       EMP_CODE:any;
       iseWorkExpEditing: boolean; 
       }) => {
//alert(data.CATEGORY_VALUE);

       data.edtdcategory_name = (data.CATEGORY === category && data.CATEGORY_VALUE === catvalue && data.EMP_CODE === empcode ) ? catname : '';
       data.edtdcategory_value = (data.CATEGORY === category && data.CATEGORY_VALUE === catvalue && data.EMP_CODE === empcode  ) ? catvalue : '';
       data.iseWorkExpEditing = (data.CATEGORY === category && data.CATEGORY_VALUE === catvalue && data.EMP_CODE === empcode  );

     });


  }
  saveworkExp(empcode:any,category:any,catname:any,catvalue:any,docpath:any,recordId:any,docpathid:any)
  {

   //alert(docpath);
let file_extension;
let file_parts;

if(docpath !== undefined){
  file_parts = docpath.split('.');
  //alert(file_parts);
  file_extension = file_parts[1];
  //alert(file_extension);
  const fileInput = <HTMLInputElement>document.getElementsByClassName('editexpfile')[0] as HTMLInputElement;

  if (fileInput && fileInput.files && fileInput.files.length > 0) {
      const file = fileInput.files[0];
      this.fileSizeInKb = file.size / 1024;
  } 
}
else
{
  file_parts = docpathid.split('.');
  file_extension = file_parts[1];
  this.fileSizeInKb = 199;
 
}


if (file_extension !== 'pdf' || this.fileSizeInKb > 200) 
{
  (<HTMLInputElement>document.getElementById("openModalButtonForalert")).click();
  this.showModal = 1;
  this.success = "Please choose pdf file and below 200 kb";  
}
   
    else

   {

    if(docpath!=undefined)
    {
      docpath=docpath;
    }
    else
    {
      docpath=docpathid;
    }
    const nonactiveEmp= (<HTMLInputElement>document.getElementById("nonactiveEmp")).value;
    const updateexpData={
      edtdcategory:category,
      edtdcategory_name:catname,
      edtdcategory_path:docpath,
      edtdcategory_value:catvalue,
      updatedby:this.empcode,
      empcode :nonactiveEmp,
      record_id: recordId    

    };
  

    this.apicall.Editprofdtl(updateexpData).subscribe(res => {
      if(res.Errorid==1){
        (<HTMLInputElement>document.getElementById("openModalButtonForalert")).click();
        this.showModal = 1;
        this.success = "Updated Successfully..."; 
        const dropfile=(<HTMLInputElement>document.getElementsByClassName("editexpfile")[0]);
       // alert(dropfile)
        this.onFileSelectexperience(dropfile,recordId,nonactiveEmp);
        this.fetchworkexp(); 
        this.Changeflag=0;
      }
     
    });
 
    this.iseWorkExpEditing= false; 
  }
  }


  famEdit(recordid:any,memname:any,memdob:any,famrelation:any,memcontact:any,empcode:any)
  {
    const newdob=this.datePipe.transform(memdob,"yyyy-MM-dd");
 //alert(famrelation);

this.listfamilydetails.forEach((data: {
  edfamname:any;
  edfamdob:any;
  edfamrelation:any;
  edfamcontact:any;
   
   
   EMP_CODE:any;
   isfamedit: boolean; 

   }) => {
//alert(data.CATEGORY_VALUE);

   data.edfamname = ( data.EMP_CODE === empcode ) ? memname : '';
   data.edfamdob = (data.EMP_CODE === empcode  ) ? newdob : '';
   data.edfamrelation = (data.EMP_CODE === empcode  ) ? famrelation : '';
   data.edfamcontact = (data.EMP_CODE === empcode  ) ? memcontact : '';
   data.isfamedit = ( data.EMP_CODE === empcode  );

 });

  }

  savefamFn(recordid:any,memname:any,memdob:any,famrelation:any,memcontact:any,empcode:any)
  {


    const nonactiveEmp= (<HTMLInputElement>document.getElementById("nonactiveEmp")).value;
    const updateexpData={
      edfamname:memname,
      edfamdob:memdob,
      edfamrelation:famrelation,
      edfamcontact:memcontact,
      updatedby:this.empcode,
      empcode :nonactiveEmp,
      record_id: recordid    

    };
  

    this.apicall.Editfamdetails(updateexpData).subscribe(res => {
      if(res.Errorid==1){
        (<HTMLInputElement>document.getElementById("openModalButtonForalert")).click();
        this.showModal = 1;
        this.success = "Updated Successfully..."; 
        this.Changeflag=0;
        this.fetchFamDetails();
        this.fetchFamStatus();

      }
     
    });
 
    this.isfamedit= false; 
 

  }






  Editcerti(empcode:any,category:any,catname:any,catvalue:any,docpath:any)
  {



    this.fetchcertidtl.forEach((data: {
      edtdcategory_name:any;
      edtdcategory_value:any;
       
       CATEGORY: any; 
       nonactiveEmp:any;
       CATEGORY_VALUE:any;
       EMP_CODE:any;
       iscertiEditing: boolean; 
       }) => {


       data.edtdcategory_name = (data.CATEGORY === category && data.CATEGORY_VALUE === catvalue && data.EMP_CODE === empcode ) ? catname : '';
       data.edtdcategory_value = (data.CATEGORY === category && data.CATEGORY_VALUE === catvalue && data.EMP_CODE === empcode  ) ? catvalue : '';
       data.iscertiEditing = (data.CATEGORY === category && data.CATEGORY_VALUE === catvalue && data.EMP_CODE === empcode  );

     });


  }
  savecerti(empcode:any,category:any,catname:any,catvalue:any,docpath:any,recordId:any,docpathid:any)
  {
    
     //alert(docpath);
let file_extension;
let file_parts;

if(docpath !== undefined){
  file_parts = docpath.split('.');
  //alert(file_parts);
  file_extension = file_parts[1];
  //alert(file_extension);
  const fileInput = <HTMLInputElement>document.getElementsByClassName('editcertfile')[0] as HTMLInputElement;

  if (fileInput && fileInput.files && fileInput.files.length > 0) {
      const file = fileInput.files[0];
      this.fileSizeInKb = file.size / 1024;
  } 
}
else
{
  file_parts = docpathid.split('.');
  file_extension = file_parts[1];
  this.fileSizeInKb = 199;
 
}


if (file_extension !== 'pdf' || this.fileSizeInKb > 200) 
{
  (<HTMLInputElement>document.getElementById("openModalButtonForalert")).click();
  this.showModal = 1;
  this.success = "Please choose pdf file and below 200 kb";  
}
    else

   {

    if(docpath!=undefined)
    {
      docpath=docpath;
    }
    else
    {
      docpath=docpathid;
    }
    const nonactiveEmp= (<HTMLInputElement>document.getElementById("nonactiveEmp")).value;
    const updateexpData={
      edtdcategory:category,
      edtdcategory_name:catname,
      edtdcategory_path:docpath,
      edtdcategory_value:catvalue,
      updatedby:this.empcode,
      empcode :nonactiveEmp,
      record_id: recordId     

    };
  

    this.apicall.Editprofdtl(updateexpData).subscribe(res => {
      if(res.Errorid==1){
        (<HTMLInputElement>document.getElementById("openModalButtonForalert")).click();
        this.showModal = 1;
        this.success = "Updated Successfully...";  
        const dropfile=(<HTMLInputElement>document.getElementsByClassName("editcertfile")[0]);
        // alert(dropfile)
        this.onFileSelectcertificate(dropfile,recordId,nonactiveEmp);
        this.fetchcertificates();
        this.Changeflag=0;
      }
     
    });
   
    this.iscertiEditing= false; 
  }
  }

  Editlang(empcode:any,category:any,catname:any,catvalue:any,docpath:any)
  {

    this.fetchlangdtl.forEach((data: {
      edtdcategory_name:any;
      edtdcategory_value:any;
       
       CATEGORY: any; 
       nonactiveEmp:any;
       CATEGORY_VALUE:any;
       EMP_CODE:any;
       islangEditing: boolean; 
       }) => {


       data.edtdcategory_name = (data.CATEGORY === category && data.CATEGORY_VALUE === catvalue && data.EMP_CODE === empcode ) ? catname : '';
       data.edtdcategory_value = (data.CATEGORY === category && data.CATEGORY_VALUE === catvalue && data.EMP_CODE === empcode  ) ? catvalue : '';
       data.islangEditing = (data.CATEGORY === category && data.CATEGORY_VALUE === catvalue && data.EMP_CODE === empcode  );

     });


  }
  savelang(empcode:any,category:any,catname:any,catvalue:any,docpath:any)
  {
    const nonactiveEmp= (<HTMLInputElement>document.getElementById("nonactiveEmp")).value;
    const updateexpData={
      edtdcategory:category,
      edtdcategory_name:catname,
      edtdcategory_path:docpath,
      edtdcategory_value:catvalue,
      updatedby:this.empcode,
      empcode :nonactiveEmp   

    };
  

    this.apicall.Editprofdtl(updateexpData).subscribe(res => {
      if(res.Errorid==1){
        (<HTMLInputElement>document.getElementById("openModalButtonForalert")).click();
        this.showModal = 1;
        this.success = "Updated Successfully...";
        this.fetchlang();  
        this.Changeflag=0;
      }
     
    });
    
    this.islangEditing= false; 
  }


  Editallowance(empcode:any,allowanceid:any,allowancename:any,allowanceamt:any)
  {
//alert(empcode);
//alert(allowanceid);
//alert(allowancename);
//alert(allowanceamt);

    this.displayallowancedtls.forEach((data: {

      editsalcomponent:any;
      editsalaryamnt:any;
       
       ALLOWANCE_ID: any; 
       EMP_CODE:any;
       isallowanceEdit: boolean; 

       }) => {

         //alert(data.EMP_CODE);
        // alert(data.ALLOWANCE_ID);

       data.editsalcomponent = (data.ALLOWANCE_ID === allowanceid &&  data.EMP_CODE === empcode ) ? allowanceid : '';
       data.editsalaryamnt = (data.ALLOWANCE_ID === allowanceid &&  data.EMP_CODE === empcode  ) ? allowanceamt : '';
       data.isallowanceEdit = (data.ALLOWANCE_ID === allowanceid &&  data.EMP_CODE === empcode  );

     });


  }
  saveallowance(a:any,b:any,c:any,d:any)
  {
    
  }


  Editdocs(empcode:any,record_id:any,docid:any,doctype:any,docno:any,docexpiry:any,docpath:any)
  {

    this.e_mpcode = empcode;
    this.r_ecordid = record_id;
    this.d_octype = doctype;
    this.d_ocno = docno;
    this.d_ocexpiry = docexpiry;
    this.d_ocno = docno;


    const newexpiry=this.datePipe.transform(docexpiry,"yyyy-MM-dd");



    this.fetchdocdetails.forEach((data: {

      editdoctype:any;
      editdocno:any;
      editexpiry:any;
      editupfile:any;
       
      
       EMP_CODE:any;
       RECORD_ID:any;
       isdocsedit: boolean; 

       }) => {


        data.editdoctype = (data.RECORD_ID === this.r_ecordid &&  data.EMP_CODE === this.e_mpcode ) ? docid : '';
        data.editdocno = (data.RECORD_ID === this.r_ecordid &&  data.EMP_CODE === this.e_mpcode) ? docno : '';
        data.editexpiry = (data.RECORD_ID === this.r_ecordid &&  data.EMP_CODE === this.e_mpcode  ) ? newexpiry : '';
        data.editupfile = (data.RECORD_ID === this.r_ecordid &&  data.EMP_CODE === this.e_mpcode  ) ? docpath : '';
        data.isdocsedit = (data.RECORD_ID === this.r_ecordid &&  data.EMP_CODE === this.e_mpcode);

     });


  }
  savedocs(empcode:any,record_id:any,docid:any,docno:any,docexpiry:any,docpath:any)
  {
    
    const file_parts = docpath.split('.');
    const file_extension = file_parts[1];

    const fileInput = <HTMLInputElement>document.getElementsByClassName('editupfile')[0] as HTMLInputElement;

    if (fileInput && fileInput.files && fileInput.files.length > 0) {
        const file = fileInput.files[0];
        //alert(file.size)
        this.fileSizeInKb = file.size / 1024;
    } 

    //alert(this.fileSizeInKb)

    if((file_extension!='pdf' && file_extension!='jpg') || this.fileSizeInKb>200 )
    {
      (<HTMLInputElement>document.getElementById("openModalButtonForalert")).click();
      this.showModal = 1;
      this.success = "Please choose pdf/jpg file and below 200 kb";  
    }
    else
    {

    const nonactiveEmp= (<HTMLInputElement>document.getElementById("nonactiveEmp")).value;
    const updatedocpData={
      editdoctype:docid,
      editdocno:docno,
      editexpiry:docexpiry,
      editupfile:docpath,
      updatedby:this.empcode,
      empcode :nonactiveEmp,
      record_id: record_id 

    };
  

    //alert(JSON.stringify(updatedocpData));

    this.apicall.Editdocuments(updatedocpData).subscribe(res => {
     // alert(JSON.stringify(res));
      if(res.Errorid==1){
        (<HTMLInputElement>document.getElementById("openModalButtonForalert")).click();
        this.showModal = 1;
        this.success = "Updated Successfully...";  
        this.fetchdocdtls();

        const dropfile=<HTMLInputElement>document.getElementById("editupfile"+record_id);

        this.onFiledocSelect(dropfile,nonactiveEmp,docid);

        this.Changeflag=0;

      }
     
    });
   
    this.isdocsedit= false; 
    }

  }



  fetchassetsname()
  {
    this.apicall.fetchassetnm().subscribe((res)=>{
      this.employeeassetsdisp=res;     
    })
  }



  get tableRows(): FormArray {
    return this.empdocumentForm.get('tableRows') as FormArray;
  }

  addTableRow() {
    //this.docsvalue=0;
    this.tableRows.push(this.fb.group({
      doctype: [''],
      docno: [''],
      docexpiry: [''],
      upfile: ['', [this.fileValidator(200, ['pdf', 'jpg'])]],
    }));
  }

  removeFromTable(index: number) {
  this.tableRows.removeAt(index);
}


fetchmandatorydoc()
{
        this.apicall.listmandocs().subscribe((res)=>{
        
          this.listmandatoryfield=res;
          //alert(JSON.stringify(this.listmandatoryfield));

          }) 
}

listmandocsloop()
{
        this.apicall.listmandocsloop().subscribe((res)=>{
        
          this.listmandatory=res;
          //alert(JSON.stringify(this.listmandatory));

          }) 
}


get NewtableRows(): FormArray {
  return this.empOtherForm.get('NewtableRows') as FormArray;
}

addNewRow() {
  const newRow = this.fb.group({
    famname: new FormControl (''), 
    famdob: new FormControl (''),  
    famrelation: new FormControl (''),
    famcontact: new FormControl (''),
  });

  // let doclbl=<HTMLLabelElement>document.getElementById("docname");
  // doclbl.innerHTML='ffg';
  
  this.NewtableRows.push(newRow);

}

removeFromTableNew(index: number) {
this.NewtableRows.removeAt(index);
}

// getSelectedOptions() {
//   const selectedOptionsControl = this.empOtherForm.get('selectedOptions');

//   // Check if empOtherForm and selectedOptionsControl are not null
//   if (this.empOtherForm && selectedOptionsControl) {
//     const selectedOptionsValue = selectedOptionsControl.value;

//     // Check if selectedOptionsValue is not null or undefined
//     if (selectedOptionsValue != null) {
//       return selectedOptionsValue;
//     } else {
//       // Handle the case when the value is null or undefined
//       return null; // or an appropriate default value
//     }
//   } else {
//     // Handle the case when the form or control is not initialized
//     return null; // or an appropriate default value
//   }
// }


savemanfield()
{

  const doctypenm= (<HTMLInputElement>document.getElementById("doctypenm")).value;
  const mansts= (<HTMLInputElement>document.getElementById("mansts")).value;
  // alert(doctypenm);
  // alert(mansts);
  this.apicall.addmanfiled(doctypenm,mansts).subscribe((res)=>{
        
    if(res.Errorid==1){
      (<HTMLInputElement>document.getElementById("openModalButtonForalert")).click();
      this.showModal = 1;
      this.success = "Saved Successfully...";  
      this.fetchdocdtls();
      this.listmandocsloop();

    }

    }) 


}

newtype(typval:any,inx:any)
{
 // alert(inx);
  if(typval==-1)
  {
    (<HTMLInputElement>document.getElementById("create-btn")).click();
  }
  this.ChekforDuplicateFiletype(typval,inx);
}

calculateAge() {

  const birthDate = (<HTMLInputElement>document.getElementById("nomdob")).value;
  
  if (birthDate) {
    const today = new Date();
    const birthDates = new Date(birthDate);
    let age = today.getFullYear() - birthDates.getFullYear();
    const monthDiff = today.getMonth() - birthDates.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDates.getDate())) {
      age--;
    }

    this.age = age;

    this.empNomineeForm.controls['nomage'].setValue(this.age);
    
   // alert(this.age);

  } else {
    this.age = null;
  }

}


calculateAgeedit() {

  const birthDate = (<HTMLInputElement>document.getElementById("edtdnomdob")).value;
  
  if (birthDate) {
    const today = new Date();
    const birthDates = new Date(birthDate);
    let age = today.getFullYear() - birthDates.getFullYear();
    const monthDiff = today.getMonth() - birthDates.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDates.getDate())) {
      age--;
    }

    this.age = age;

    const editage = (<HTMLInputElement>document.getElementById("edtdnomage")).value=this.age;
    
   // alert(this.age);

  } else {
    this.age = null;
  }

}



deleteEmpdtls(emcode:any,record_id:any,sflag:any)
{

  // alert(emcode)
  // alert(record_id)
  // alert(sflag)

  this.apicall.deleteemployeedtls(emcode,record_id,sflag).subscribe((res)=>{
        
    if(res.Errorid==1){
      (<HTMLInputElement>document.getElementById("openModalButtonForalert")).click();
      this.showModal = 1;
      this.success = "Deleted...";
      this.fetchAssetsDetails();
      this.fetchNomineeDetails();
      this.fetchEducation();
      this.fetchworkexp();
      this.fetchcertificates();
      this.fetchdocdtls();
      this.fetchallowancedtl();
      this.fetchFamDetails();
      this.fetchFamStatus();

    }

    }) 

}



neweducation(typval:any)
{
 //alert(typval);
 if(typval=='-1')
 {
        this.eduflag=1;
 }
}

newfield(typval:any)
{
 //alert(typval);
 if(typval=='-1')
 {
        this.fieldflag=1;
 }
}


jobfield(typval:any)
{
 //alert(typval);
 if(typval=='-1')
 {
        this.jobflag=1;
 }
}


edusubmit(fieldids:any,fieldname:any)
{

// alert(fieldids);
// alert(fieldname);

  this.apicall.edusubmit(fieldids,fieldname).subscribe((res)=>{
    if(res.Errorid==1){
      

      if(fieldids==38)
      {
        this.apicall.listeducation(this.educationid).subscribe((res)=>{
        this.listeducation=res;
        this.fieldvalue1=fieldname;
        this.EducationForm.controls['catgryname'].setValue(this.fieldvalue1);
        //alert(this.fieldvalue1);
        this.eduflag=0;
       })
      }
      else if(fieldids==39)
      {
        this.apicall.listfieldofstudy(this.fieldid).subscribe((res)=>{
          this.listfieldofstudy=res;
          this.fieldvalue2=fieldname;
          this.EducationForm.controls['catgryvalue'].setValue(this.fieldvalue2);
          //alert(this.fieldvalue2);
          this.fieldflag=0;
         })
      }
      else if(fieldids==40)
      {
        this.apicall.listjobtitle(this.jobtitleid).subscribe((res)=>{
          this.listjobtitle=res;
          this.fieldvalue3=fieldname;
          this.ExperienceForm.controls['catgryname'].setValue(this.fieldvalue3);
         // alert(this.fieldvalue3);
          this.jobflag=0;
         })
      }
  
    }
  })  
}

picselecting(propic:any)
{

  const filename = this.extractFilename(propic);
  //alert(filename);
  this.pfl=1;
  const inputElement = <HTMLInputElement>document.getElementById('pimage');
  inputElement.value = filename;

}


extractFilename(filePath:any) {
  // Split the path using backslash as the delimiter
  const parts = filePath.split('\\');

  // Get the last part, which is the filename
  const filename = parts[parts.length - 1];

  return filename;
}


listdepacccompany(companycode:any,empcode:any)
{
  this.apicall.FetchDepartmentList(companycode,empcode).subscribe((res)=>{
    this.listDepartment=res;
      })
}




 // Custom Validator for File Type

 fileTypeValidator(allowedTypes: string[]) {
  return (control: AbstractControl) => {
    const file = control.value;

    if (!file) {
      return null;
    }
    if (typeof file === 'string') {
      const fileType = file.split('.').pop()?.toLowerCase();

      if (!fileType || allowedTypes.indexOf(fileType) === -1) {
        return { fileType: true };
      }
    } else if (file instanceof File) {
      const fileType = file.name.split('.').pop()?.toLowerCase();

      if (!fileType || allowedTypes.indexOf(fileType) === -1) {
        return { fileType: true };
      }
    }

    return null; 
  };
}

// Custom Validator for File Size

fileSizeValidator(maxSize: number) {
  return (control: AbstractControl) => {
  
    const fileInput = <HTMLInputElement>document.getElementById('filejd') as HTMLInputElement;
   
    if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
      return null;  
    }
    const file = fileInput.files[0];
    const fileSize = file.size / 1024; 

    if (fileSize > maxSize) {
      return { fileSize: true };
    }
    return null; 
  };
}

fileSizeValidatorpro(maxSize: number) {
  return (control: AbstractControl) => {
  
    const fileInput = <HTMLInputElement>document.getElementById('profile-img-file-input') as HTMLInputElement;
    if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
      return null;  
    }
    const file = fileInput.files[0];
    const fileSize = file.size / 1024; 

    if (fileSize > maxSize) {
      return { fileSize: true };
    }
    return null; 
  };
}

fileSizeValidatorprofes(maxSize: number) {
  return (control: AbstractControl) => {
  
    const fileInput = <HTMLInputElement>document.getElementById('docpath') as HTMLInputElement;
 //   alert(fileInput);
    if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
      return null;  
    }
    const file = fileInput.files[0];
    const fileSize = file.size / 1024; 

    if (fileSize > maxSize) {
      return { fileSize: true };
    }
    return null; 
  };
}

fileSizeValidatorexp(maxSize: number) {
  return (control: AbstractControl) => {
  
    const fileInput = document.getElementsByClassName('exp')[0] as HTMLInputElement;
    //alert(fileInput);
    if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
      return null;  
    }
    const file = fileInput.files[0];
    const fileSize = file.size / 1024; 

    if (fileSize > maxSize) {
      return { fileSize: true };
    }
    return null; 
  };
}

fileSizeValidatorcert(maxSize: number) {
  return (control: AbstractControl) => {
  
    const fileInput = document.getElementsByClassName('cert')[0] as HTMLInputElement;
   // alert(fileInput);
    if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
      return null;  
    }
    const file = fileInput.files[0];
    const fileSize = file.size / 1024; 

    if (fileSize > maxSize) {
      return { fileSize: true };
    }
    return null; 
  };
}


fileValidator(maxSize: number, allowedTypes: string[]): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const files = control.value;
    
    if (!files) {
      return null;
    }

    const elements = document.getElementsByClassName('updocs');

    for (let i = 0; i < elements.length; i++) {
      const classNames = elements[i].className;
     // alert(classNames);
      const fileTypes = classNames.split('_');
      this.fileTp = fileTypes[1].charAt(0);
      
    }

   // alert(this.fileTp);
  
    const fileInput = document.getElementsByClassName(`updoc_${this.fileTp}`)[0] as HTMLInputElement;

    if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
      return null;
    }

    const file = fileInput.files[0];
    const fileSize = file.size / 1024;

    if (fileSize > maxSize) {
      return { 'fileSizeExceeded': true };
    }

    if (typeof files === 'string') {
      const lastDotIndex = file.name.lastIndexOf('.');
      const fileTypes = lastDotIndex !== -1 ? file.name.substring(lastDotIndex + 1).toLowerCase() : '';

      if (!fileTypes || allowedTypes.indexOf(fileTypes) === -1) {
        return { 'invalidFileType': true };
      }
    }
    return null;
  };
}


isCheckboxChecked(keyId: any): boolean {
  const selectedIds = this.comdtl.split(',');
  return selectedIds.includes(String(keyId));
}


isCheckboxCheckedshared(keyId: any): boolean {
  const selectedIds = this.resdtl.split(',');
  return selectedIds.includes(String(keyId));
}


}