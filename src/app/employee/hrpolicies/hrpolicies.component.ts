import { Component, OnInit,ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiCallService } from 'src/app/api-call.service';
import { LoginService } from 'src/app/login.service';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-hrpolicies',
  templateUrl: './hrpolicies.component.html',
  styleUrls: ['./hrpolicies.component.scss']
})
export class HRPoliciesComponent implements OnInit {

  userSession:any = this.session.getUserSession();
  empcode: any=this.userSession.empcode;
  level: any=this.userSession.level;
  authorityflg:any =this.userSession.authorityflg;
  grpname:any=this.userSession.grpname;
  company:any=this.userSession.companycode;

  companylist: any;
  selectedCompany: any;  
  AddDocumentForm: FormGroup;
  showModal!: number;
  success!: string;
  failed!: string;
  policydata: any;
  isEditing: boolean = false;
  item: any;
  itemsPerPage=10;
  currentPage=1;
  searchInput: string='';
  mflag: any=0;
  openmodal = new FormControl();
  showAlert: any=0;
  isFormValid:boolean=false;
  desiredPage: any; 
  desiredPagePersonal: any; 


  constructor(private apicall:ApiCallService,private session:LoginService,private fb: FormBuilder,private datepipe:DatePipe) { 
    this.AddDocumentForm = this.fb.group({
      company: ['', Validators.required],
      policy: ['', Validators.required],
      document: ['', Validators.required],      
    });
  }

  ngOnInit(): void {
    this.apicall.FetchCompanyList(this.empcode).subscribe((res)=>{
      this.companylist=res;
    });
    if(this.grpname.includes('HR')){
      this.selectedCompany=0;
    }
    else{
      this.selectedCompany=this.company; 
    }
   this.filter();
    
  }
  filter() { 
    this.mflag=1;
    this.apicall.FetchHRPolicies(this.empcode,this.selectedCompany,this.grpname,this.mflag).subscribe((res)=>{
      this.policydata=res;
      const maxPageFiltered = Math.ceil(this.policydata.length / this.itemsPerPage);  

    if (this.currentPage > maxPageFiltered) {
      this.currentPage = 1;     
    }   
    });    
  }
  validateForm() {
    if (this.AddDocumentForm.valid){
    this.isFormValid = true;
    }
    else{
      this.markFormGroupTouched(this.AddDocumentForm);
    }
  }
  onsubmit() {
    if (this.AddDocumentForm.valid) {
      const company= this.AddDocumentForm.get('company');
      const policy= this.AddDocumentForm.get('policy');
      const document= this.AddDocumentForm.get('document');
      if(company && policy && document){
      const data = {
        policy_id:0,
        company:company.value,
        policy:policy.value,
        docPath:document.value,
        updated_by:this.empcode, 
        mflag:1       
      };
      console.log(JSON.stringify(data));
      this.apicall.AddHRPolicies(data).subscribe((res)=>{
        //alert(JSON.stringify(res))
        if(res.Errorid>0){          
          this.showAlert=1;  
          this.success = "Policy document added successfully!";
          this.upload(res.Errorid);                 
          this.clear();
          this.filter();
          setTimeout(() => {
            this.showAlert = null;
            this.success ='';
          }, 3000);
         }
         else{         
          this.showAlert=2;  
          this.failed = "Failed!";         
          this.clear();
          setTimeout(() => {
            this.showAlert = null;
            this.failed ='';
          }, 3000);
         }
        
       });
    }
  }
  else{
    this.markFormGroupTouched(this.AddDocumentForm); 
  }
    
  }
  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
    });
  }  
  //clear add document modal
  clear(){    
    this.AddDocumentForm.reset();
    this.AddDocumentForm.get('company')?.setValue('');
  }
  Edit(item: any): void {       
    this.policydata.forEach((data: {
      POLICY_ID: any;
      editdoc: any;      
      isEditing: boolean; 
      }) => {
      //data.editdoc = (data.POLICY_ID === item.POLICY_ID) ? item.DOC_PATH : '';          
      data.isEditing = (data.POLICY_ID === item.POLICY_ID);
    });
 }
 saveChanges(item:any): void { 
  if(!item.editdoc)  {
    (<HTMLInputElement>document.getElementById("openModalButton")).click();
    this.showModal = 2; 
    this.failed = "Please select a document!";
  }
  else{     
   const updateData={
    policy_id:item.POLICY_ID,
    company:item.COMPANY,
    policy:item.POLICY_NAME,
    docPath:item.editdoc,
    updated_by:this.empcode,
    mflag:2      
   };
   console.log(JSON.stringify(updateData));
   this.apicall.AddHRPolicies(updateData).subscribe(res => {
     //alert(JSON.stringify(res)); 
     if(res.Errorid==1){
      (<HTMLInputElement>document.getElementById("openModalButton")).click();
      this.showModal = 1; 
      this.success='Changes saved Successfully!'; 
      this.uploadEditDOC(item.POLICY_ID);
               
    }
    else {
      (<HTMLInputElement>document.getElementById("openModalButton")).click();
      this.showModal = 2; 
      this.failed='Failed!';      
    }    
    this.filter();
    this.isEditing = false;
   }); 
 
     
  } 
 }
 Cancel(item: any) {
  //alert(JSON.stringify(item))
  //item.editdoc = item.DOC_PATH;   
  item.isEditing = false;
}
selecteditem(item:any){
  this.item=item;   
}
 delete(item:any){
  const Data={
    policy_id:item.POLICY_ID,
    company:item.COMPANY,
    policy:item.POLICY_NAME,
    docPath:'',
    updated_by:this.empcode,
    mflag:3      
   };
   this.apicall.AddHRPolicies(Data).subscribe(res => {
    //alert(JSON.stringify(res)); 
    if(res.Errorid==1){
     (<HTMLInputElement>document.getElementById("openModalButton")).click();
     this.showModal = 1; 
     this.success='Policy deleted!';          
   }
   else {
     (<HTMLInputElement>document.getElementById("openModalButton")).click();
     this.showModal = 2; 
     this.failed='Failed!';      
   }    
   this.filter(); 

  }); 
 } 
 upload(policyid:any)
{ 
  let input:any;  
  input=document.getElementById("formFile");
  const fdata = new FormData();
  this.onFileSelect(input,policyid); 
  
}
//EDIT
uploadEditDOC(policyid:any)
{  
  let input:any;  
  input=document.getElementById("formFile1");
  const fdata = new FormData();
  this.onFileSelect(input,policyid); 
  
}
onFileSelect(input:any,policyid:any) {  
   if (input.files && input.files[0]) {     
    const fdata = new FormData();   
    fdata.append('filesup',input.files[0]);    
    this.apicall.HRPolicyDocUpload(fdata,policyid).subscribe((res)=>{
      const result=res;     
      if(res==0)
      { 
        this.showModal = 2;
       this.failed = "Policy document uploading failed";
      }      
    })
  }
}  
download_to_excel(item:any)
  {   
   let Excelname:any;  
    let fileurl=this.apicall.GetHRPolicyDocs(item.POLICY_ID);
    let link = document.createElement("a");
      
        if (link.download !== undefined) {      
          link.setAttribute("href", fileurl);
          link.setAttribute('target', '_blank');
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
   }   
  }
 
  getTotalPages(): number {
    return Math.ceil(this.totalSearchResults / this.itemsPerPage);
  }
  
  goToPage() {
    const totalPages = Math.ceil(this.totalSearchResults / this.itemsPerPage);
    if (this.desiredPage >= 1 && this.desiredPage <= totalPages) {
      this.currentPage = this.desiredPage;
    } else {  
      
      (<HTMLInputElement>document.getElementById("openModalButton")).click();
      this.showModal = 2; 
      this.failed='Invalid page number!'; 
      this.desiredPage=''; 
    }   
   
  }
  getPageNumbers(currentPage: number): number[] {
    const totalPages = Math.ceil(this.totalSearchResults / this.itemsPerPage);
    const maxPageNumbers = 5; // Number of page numbers to show
    const middlePage = Math.ceil(maxPageNumbers / 2);
    let startPage = Math.max(currentPage - middlePage, 1);
    let endPage = Math.min(startPage + maxPageNumbers - 1, totalPages);
  
    if (endPage - startPage + 1 < maxPageNumbers) {
      startPage = Math.max(endPage - maxPageNumbers + 1, 1);
    }
  
    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  }
  
// Function to Calculate the total number of search results
get totalSearchResults(): number {
  const totalResults = this.policydata.filter((policy: any) => {
    return Object.values(policy).some((value: any) =>
      typeof value === 'string' && value.toLowerCase().startsWith(this.searchInput.toLowerCase())
    );
  }).length;

  const maxPageFiltered = Math.ceil(totalResults / this.itemsPerPage);  

  if (this.currentPage > maxPageFiltered) {
    this.currentPage = 1; 
  }

  return totalResults;
}

// Function to change the current page
  changePage(page: number): void { 
    this.desiredPage = '';   
    this.currentPage = page;
    const maxPage = Math.ceil(this.totalSearchResults / this.itemsPerPage);
    if (this.currentPage > maxPage) {
      this.currentPage = 1;
    }        
  }
getEntriesStart(): number {
  if (this.currentPage === 1) {
    return 1;
  }
  
  const filteredData = this.policydata.filter((policy: any) =>
    Object.values(policy).some((value: any) =>
      typeof value === 'string' &&
      value.toLowerCase().startsWith(this.searchInput.toLowerCase())
    )
  );

  const start = (this.currentPage - 1) * this.itemsPerPage + 1;
  return Math.min(start, filteredData.length);
}


getEntriesEnd(): number {  
  const filteredData = this.policydata.filter((policy: any) =>
    Object.values(policy).some((value: any) =>
      typeof value === 'string' &&
      value.toLowerCase().startsWith(this.searchInput.toLowerCase())
    )
  );
  const end = this.currentPage * this.itemsPerPage;
  return Math.min(end, filteredData.length);
}


}

