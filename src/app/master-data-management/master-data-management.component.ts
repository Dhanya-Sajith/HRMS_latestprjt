import { Component, OnInit, Directive, HostListener } from '@angular/core';
import { ApiCallService } from 'src/app/api-call.service';
import { LoginService } from 'src/app/login.service';
import { NgForm } from '@angular/forms';
import { FormBuilder, FormGroup, Validators,AbstractControl, ValidatorFn } from '@angular/forms';

@Component({
  selector: 'app-master-data-management',
  templateUrl: './master-data-management.component.html',
  styleUrls: ['./master-data-management.component.scss']
})
export class MasterDataManagementComponent implements OnInit {
  userSession:any = this.session.getUserSession();  
  empcode: any=this.userSession.empcode;
  empid:any =this.userSession.id; 
  
  formData: any = {};
  
    companyForm: FormGroup;
    shiftForm: FormGroup;
    InsuranceForm: FormGroup;
    mastertypes: any;
    masterdata: any;
    typeid: any=0;
    mastertypeid: any;
    mastertype: any;
    showModal!: number;
    success!: string;
    failed!: string;
    desiredPage: any;
    searchInput: string='';
    itemsPerPage=10;
    currentPage=1;
    showdiv!: boolean; 
    masterdata2: any;
    currentPage2=1;
    desiredPage2: any;
    submitted: boolean=false;
    hostname: any;
    companylogo: any;
    currentPageCompany=1;
    desiredPageCompany: any;
    filename!: string;
  
    constructor(private session:LoginService,private apicall:ApiCallService,private formBuilder: FormBuilder) {
      this.companyForm = this.formBuilder.group({
        companyCode: ['', [Validators.required]],
        companyName: ['', [Validators.required]],
        address: ['', [Validators.required]],
        logo: [''],
        phoneNo: ['', [Validators.required]],
        email: ['', [Validators.required]]
      });
      this.shiftForm = this.formBuilder.group({
        shiftname: ['', [Validators.required]],
        intime: ['', [Validators.required]],
        outtime: ['', [Validators.required]],
        breakHours: ['', [Validators.required, this.numberOrFloatValidator()]], 
        shiftHours: ['', [Validators.required, this.numberOrFloatValidator()]]    
      }); 
      this.InsuranceForm = this.formBuilder.group({
        Insurancename: ['', [Validators.required]],
        insurancedoc: ['', [Validators.required]] ,
        insurancedoc2: ['', [Validators.required]]       
      });   
     }    
  
    ngOnInit(): void {
      this.hostname=this.apicall.dotnetapi; 
      
      //Fetch master types
      this.apicall.FetchMasterData().subscribe((res)=>{
        this.mastertypes=res;
        console.log(this.mastertypes[0].DATA_VALUE)
      })  
      //Fetch master data 
      this.onMasterTypesSelected();  
    }
    onMasterTypesSelected(){ 
      this.desiredPage='';
      this.desiredPage2='';
      this.desiredPageCompany='';      
      this.mastertypeid=this.typeid.TYPE_ID;     
      this.mastertype=this.typeid.DATA_VALUE; 
      if(this.mastertypeid==12 || this.mastertypeid<0) {
       
        this.showdiv=true;
       
        this.apicall.GetMasterData(this.mastertypeid).subscribe((res)=>{
          this.masterdata2=res;        
          const maxPageFiltered = Math.ceil(this.masterdata2.Values.length / this.itemsPerPage);  
  
          if (this.currentPage2 > maxPageFiltered) {
            this.currentPage2 = 1;            
          }  
          console.log(JSON.stringify(this.masterdata2))           
        }); 
      } else{
        this.showdiv=false;
      this.apicall.listCompanyList(this.mastertypeid).subscribe((res)=>{
        this.masterdata=res;
        console.log(JSON.stringify(this.masterdata))  
        const maxPageFiltered = Math.ceil(this.masterdata.length / this.itemsPerPage);  
  
          if (this.currentPage > maxPageFiltered) {
            this.currentPage = 1;   
            
          } 
        
      });
    }
   
    }
   
  //Forms typeid>0
    submitForm(form: NgForm) {
      if (form && form.valid) {
        const data={
          typeid:this.mastertypeid,
          keyvalue:form.value.mastertypeInput,
          processtype:1,  
          formdata: null         
          
        };      
        console.log(JSON.stringify(data));
        this.apicall.AddMasterData(data).subscribe((res)=>{
          //alert(JSON.stringify(res));   
          if(res.Errorid==1){
            (<HTMLInputElement>document.getElementById("openModalButton")).click();
            this.showModal = 1;
            this.success = this.mastertype+" ADDED SUCCESSFULLY!";
            
          }
          else{
            (<HTMLInputElement>document.getElementById("openModalButton")).click();
            this.showModal = 2;
            this.failed = "Failed!";
          }   
          this.cancel(form); 
          this.onMasterTypesSelected();      
        })      
      } 
      
    }
      cancel(form: NgForm) {
        form.resetForm(); 
      }
      
      //Company form
      submitCompanyForm(form: FormGroup) {
        this.submitted = true;
        if (form.valid) {
         
          const formData = {
            typeid:this.mastertypeid,
            processtype:1,
            formdata:this.companyForm.value
          };
          console.log(formData); 
          this.apicall.AddMasterData(formData).subscribe((res)=>{
            //alert(JSON.stringify(res));   
            if(res.Errorid==1){
              const companyCode = this.companyForm.get('companyCode')?.value; // Get the company code
              this.upload(companyCode); 
            
              (<HTMLInputElement>document.getElementById("openModalButton")).click();
              this.showModal = 1;
              this.success = this.mastertype+" ADDED SUCCESSFULLY!";
              
            }
            else{
              (<HTMLInputElement>document.getElementById("openModalButton")).click();
              this.showModal = 2;
              this.failed = "Failed!";
            } 
            this.cancelCompanyform();
           
            this.onMasterTypesSelected();            
          })          
        }      
      }
      upload(companycode:any)
      {
       
        let input:any;
           input=document.getElementById("logo");
           const fdata = new FormData();
           this.onFileSelect(input,companycode);
       }
       onFileSelect(input:any,companycode:any) {
        
        if (input.files && input.files[0]) {
          
         const fdata = new FormData();
        
         fdata.append('filesup',input.files[0]);
         
         this.apicall.CompanyLogoUpload(fdata,companycode).subscribe((res)=>{
           const result=res;
           if(res==0)
           { 
             this.showModal = 2;
            this.failed = "Document uploading failed";
           }
         })
      
       }
      }
      
      cancelCompanyform() {
        this.companyForm.reset();
        this.companyForm.markAsPristine(); 
        this.companyForm.markAsUntouched();
        this.submitted=false; 
      }
      
     
      //Shift
      submitShiftForm(form: FormGroup) {
        if (form.valid) {
          const formData = {
            typeid:this.mastertypeid,
            processtype:1,
            formdata: {
              ...this.shiftForm.value, // Spread operator to include existing form data
              updatedby: this.empcode 
            }
          };
          console.log(formData); 
          this.apicall.AddMasterData(formData).subscribe((res)=>{
            //alert(JSON.stringify(res));   
            if(res.Errorid==1){
              (<HTMLInputElement>document.getElementById("openModalButton")).click();
              this.showModal = 1;
              this.success = this.mastertype+" ADDED SUCCESSFULLY!";
              
            }
            else{
              (<HTMLInputElement>document.getElementById("openModalButton")).click();
              this.showModal = 2;
              this.failed = "Failed!";
            }   
            this.cancelShiftform(); 
            this.onMasterTypesSelected();      
          })     
        }
        this.submitted = true;
      }
      
      cancelShiftform() {
        this.shiftForm.reset();
        this.shiftForm.markAsPristine(); 
        this.shiftForm.markAsUntouched(); 
        this.submitted=false; 
      }   
      
      numberOrFloatValidator(): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } | null => {
          const value = control.value;
          if (value === null || value === undefined || value === '') {
            return null; 
          }
         
          const pattern = /^\d*\.?\d+$/;
          const valid = pattern.test(value); 
          return valid ? null : { 'invalidNumberOrFloat': true }; 
        };
      }

      //Other forms typeid<0
      submitOtherForm(form: NgForm){
        if (form && form.valid) {
          const data: { 
            typeid: string; 
            processtype: number; 
            formdata: { [key: string]: any }; 
        } = {
            typeid: this.mastertypeid,
            processtype: 1,
            formdata: {
                ...form.value,
                updatedby: this.empcode
            }
        };     
       
        const trimmedFormData: { [key: string]: any } = {};           
        for (let columnName in data.formdata) {
            if (data.formdata.hasOwnProperty(columnName)) {
                const trimmedColumnName = columnName.trim().replace(/\s+/g, ''); // Remove all white spaces
                trimmedFormData[trimmedColumnName] = data.formdata[columnName];
            }
        }     
        
        data.formdata = trimmedFormData;      
          console.log(JSON.stringify(data));
          this.apicall.AddMasterData(data).subscribe((res)=>{
            //alert(JSON.stringify(res));   
            if(res.Errorid==1){
              (<HTMLInputElement>document.getElementById("openModalButton")).click();
              this.showModal = 1;
              this.success = this.mastertype+" ADDED SUCCESSFULLY!";
              
            }
            else{
              (<HTMLInputElement>document.getElementById("openModalButton")).click();
              this.showModal = 2;
              this.failed = "Failed!";
            }   
            this.cancelOtherForm(form); 
            this.onMasterTypesSelected();      
          })      
        } 
        
      }
      cancelOtherForm(form: NgForm) {
        form.resetForm();
        this.formData = {}; 
      }
    //Medical Insurance form
    submitInsuranceForm(form: FormGroup) {
        this.submitted = true;
        if (form.valid) {
         
          const formData = {
            typeid:this.mastertypeid,
            processtype:1,         
            formdata: {
              ...this.InsuranceForm.value, // Spread operator to include existing form data
              updatedby: this.empcode 
            }
          };
          console.log(formData); 
          this.apicall.AddMasterData(formData).subscribe((res)=>{
            //alert(JSON.stringify(res));   
            if(res.Errorid>0){             
              this.uploadInsuranceDoc(res.Errorid); 
            
              (<HTMLInputElement>document.getElementById("openModalButton")).click();
              this.showModal = 1;
              this.success = this.mastertype+" ADDED SUCCESSFULLY!";
              
            }
            else{
              (<HTMLInputElement>document.getElementById("openModalButton")).click();
              this.showModal = 2;
              this.failed = "Failed!";
            } 
            this.cancelInsuranceform();           
            this.onMasterTypesSelected();            
          })          
        }      
      }
     
        uploadInsuranceDoc(keyid: any) {
          const input1 = document.getElementById("insurancedoc") as HTMLInputElement;
          const input2 = document.getElementById("insurancedoc2") as HTMLInputElement;
          
          if (input1.files && input1.files[0] && input2.files && input2.files[0]) {
              const formData = new FormData();
              formData.append('filesup1', input1.files[0]);
              formData.append('filesup2', input2.files[0]);
              
              this.apicall.MedicalInsuranceDocUpload(formData, keyid).subscribe((res) => {
                  const result = res;
                  if (res == 0) {
                      this.showModal = 2;
                      this.failed = "Document uploading failed";
                  }
              });
          }
      }
        
      view_document(item:any,filetype:any)
      {
        this.apicall.GetMedicalInsuranceDocName(item.KEY_ID,filetype).subscribe((res:string)=>{
          this.filename=res;         
        
        let fileurl=this.apicall.ViewInsuranceDocuments(item.KEY_ID,this.filename);
        
        let link = document.createElement("a");        
          
        if (link.download !== undefined) {
                link.setAttribute("href", fileurl);
                link.setAttribute("target", "_blank");
                link.setAttribute("download", "ReportFile.xlsx");
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
             }
            });
      }
      cancelInsuranceform() {
        this.InsuranceForm.reset();
        this.InsuranceForm.markAsPristine(); 
        this.InsuranceForm.markAsUntouched();
        this.submitted=false; 
      }
      
      
  //Pagination
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
    const maxPageNumbers = 5; 
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
  const totalResults = this.masterdata.filter((employee: any) => {
    return Object.values(employee).some((value: any) =>
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
  
  const filteredData = this.masterdata.filter((employee: any) =>
    Object.values(employee).some((value: any) =>
      typeof value === 'string' &&
      value.toLowerCase().startsWith(this.searchInput.toLowerCase())
    )
  );
  
  const start = (this.currentPage - 1) * this.itemsPerPage + 1;
  return Math.min(start, filteredData.length);
  }
  
  
  getEntriesEnd(): number {  
  const filteredData = this.masterdata.filter((employee: any) =>
    Object.values(employee).some((value: any) =>
      typeof value === 'string' &&
      value.toLowerCase().startsWith(this.searchInput.toLowerCase())
    )
  );
  const end = this.currentPage * this.itemsPerPage;
  return Math.min(end, filteredData.length);
  }
  //Pagination2
  getTotalPages2(): number {
    return Math.ceil(this.totalSearchResults2 / this.itemsPerPage);
  }
  
  goToPage2() {
    const totalPages = Math.ceil(this.totalSearchResults2 / this.itemsPerPage);
    if (this.desiredPage2 >= 1 && this.desiredPage2 <= totalPages) {
      this.currentPage2 = this.desiredPage2;
    } else {  
      
      (<HTMLInputElement>document.getElementById("openModalButton")).click();
      this.showModal = 2; 
      this.failed='Invalid page number!'; 
      this.desiredPage2=''; 
    }   
   
  }
  getPageNumbers2(currentPage: number): number[] {
    const totalPages = Math.ceil(this.totalSearchResults2 / this.itemsPerPage);
    const maxPageNumbers = 5; 
    const middlePage = Math.ceil(maxPageNumbers / 2);
    let startPage = Math.max(currentPage - middlePage, 1);
    let endPage = Math.min(startPage + maxPageNumbers - 1, totalPages);
  
    if (endPage - startPage + 1 < maxPageNumbers) {
      startPage = Math.max(endPage - maxPageNumbers + 1, 1);
    }
  
    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  }
  
  // Function to Calculate the total number of search results
  get totalSearchResults2(): number {
    if (!this.masterdata2 || !this.masterdata2.Values) {
      return 0;
    }
  
    const totalResults = this.masterdata2.Values.filter((row: any) =>
      Object.values(row).some((value: any) =>
        typeof value === 'string' && value.toLowerCase().startsWith(this.searchInput.toLowerCase())
      )
    ).length;
    const maxPageFiltered = Math.ceil(totalResults / this.itemsPerPage);  
  
  if (this.currentPage2 > maxPageFiltered) {
    this.currentPage2 = 1; 
  }
  return totalResults;
  }
  
  // Function to change the current page
  changePage2(page: number): void {
    
    this.desiredPage2 = '';   
    this.currentPage2 = page;
    const maxPage = Math.ceil(this.totalSearchResults2 / this.itemsPerPage);
    if (this.currentPage2 > maxPage) {
      this.currentPage2 = 1;
      
    }        
  }
  getEntriesStart2(): number {
    if (!this.masterdata2 || !this.masterdata2.Values) {
      return 0;
    }
  
    const filteredData = this.masterdata2.Values.filter((row: any) =>
      Object.values(row).some((value: any) =>
        typeof value === 'string' &&
        value.toLowerCase().startsWith(this.searchInput.toLowerCase())
      )
    );
  
    const start = (this.currentPage2 - 1) * this.itemsPerPage + 1;
    return Math.min(start, filteredData.length);
  }
  
  getEntriesEnd2(): number {
    if (!this.masterdata2 || !this.masterdata2.Values) {
      return 0;
    }
  
    const filteredData = this.masterdata2.Values.filter((row: any) =>
      Object.values(row).some((value: any) =>
        typeof value === 'string' &&
        value.toLowerCase().startsWith(this.searchInput.toLowerCase())
      )
    );
  
    const end = this.currentPage2 * this.itemsPerPage;
    return Math.min(end, filteredData.length);
  }
  //Pagination Company
  getTotalPagesCompany(): number {
    return Math.ceil(this.totalSearchResultsCompany / this.itemsPerPage);
  }
  
  goToPageCompany() {
    const totalPages = Math.ceil(this.totalSearchResultsCompany / this.itemsPerPage);
    if (this.desiredPageCompany >= 1 && this.desiredPageCompany <= totalPages) {
      this.currentPageCompany = this.desiredPageCompany;
    } else {  
      
      (<HTMLInputElement>document.getElementById("openModalButton")).click();
      this.showModal = 2; 
      this.failed='Invalid page number!'; 
      this.desiredPage2=''; 
    }   
   
  }
  getPageNumbersCompany(currentPage: number): number[] {
    const totalPages = Math.ceil(this.totalSearchResultsCompany / this.itemsPerPage);
    const maxPageNumbers = 5; 
    const middlePage = Math.ceil(maxPageNumbers / 2);
    let startPage = Math.max(currentPage - middlePage, 1);
    let endPage = Math.min(startPage + maxPageNumbers - 1, totalPages);
  
    if (endPage - startPage + 1 < maxPageNumbers) {
      startPage = Math.max(endPage - maxPageNumbers + 1, 1);
    }
  
    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  }
  
  // Function to Calculate the total number of search results
  get totalSearchResultsCompany(): number {
    if (!this.masterdata2 || !this.masterdata2.Values) {
      return 0;
    }
  
    const totalResults = this.masterdata2.Values.filter((row: any) =>
      Object.values(row).some((value: any) =>
        typeof value === 'string' && value.toLowerCase().startsWith(this.searchInput.toLowerCase())
      )
    ).length;
    const maxPageFiltered = Math.ceil(totalResults / this.itemsPerPage);  
  
  if (this.currentPageCompany > maxPageFiltered) {
    this.currentPageCompany = 1; 
  }
  return totalResults;
  }
  
  // Function to change the current page
  changePageCompany(page: number): void {
    
    this.desiredPageCompany = '';   
    this.currentPageCompany = page;
    const maxPage = Math.ceil(this.totalSearchResultsCompany / this.itemsPerPage);
    if (this.currentPageCompany > maxPage) {
      this.currentPageCompany = 1;
      
    }        
  }
  getEntriesStartCompany(): number {
    if (!this.masterdata2 || !this.masterdata2.Values) {
      return 0;
    }
  
    const filteredData = this.masterdata2.Values.filter((row: any) =>
      Object.values(row).some((value: any) =>
        typeof value === 'string' &&
        value.toLowerCase().startsWith(this.searchInput.toLowerCase())
      )
    );
  
    const start = (this.currentPageCompany - 1) * this.itemsPerPage + 1;
    return Math.min(start, filteredData.length);
  }
  
  getEntriesEndCompany(): number {
    if (!this.masterdata2 || !this.masterdata2.Values) {
      return 0;
    }
  
    const filteredData = this.masterdata2.Values.filter((row: any) =>
      Object.values(row).some((value: any) =>
        typeof value === 'string' &&
        value.toLowerCase().startsWith(this.searchInput.toLowerCase())
      )
    );
  
    const end = this.currentPageCompany * this.itemsPerPage;
    return Math.min(end, filteredData.length);
  }
    
    
  }
  