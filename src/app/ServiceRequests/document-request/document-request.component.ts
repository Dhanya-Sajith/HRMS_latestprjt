import { Component, OnInit } from '@angular/core';
import { ApiCallService } from 'src/app/api-call.service';
import { LoginService } from 'src/app/login.service';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { GeneralService } from 'src/app/general.service';
import { filter } from 'rxjs/operators'

@Component({
  selector: 'app-document-request',
  templateUrl: './document-request.component.html',
  styleUrls: ['./document-request.component.scss']
})
export class DocumentRequestComponent implements OnInit { 

  
  userSession:any = this.session.getUserSession();
  empcode: any=this.userSession.empcode;
  level: any=this.userSession.level;
  authorityflg:any =this.userSession.authorityflg;
  grpname:any=this.userSession.grpname; 
  desig:any=this.userSession.desig.split('#', 2); 
   
  desigid:any= this.desig[0]; 

  user:any;
  companylist: any;
  doctype: any;
  status: any;
  doc_type: any=-1;
  remarks: any;  
  showModal: any=0;
  success: any;
  Failed: any;
  validationDoctype: any;
  validationremarks: any;
  docreqTeam: any;
  docreqPersonal: any; 
  selectedReqId: any;
  item: any;
  doc: any;
  selectedCompany: any=-1;
  selectedStatus: any=1;
  selectedDoctype: any=-1;
  selectedStatusPersonal: any=1;
  reason: any;
  Remarks: any;
  reject_reason: any;
  req_id: any;
  fileurl: any;
  searchInput: string='';
  itemsPerPage=10;
  currentPage=1;
  currentPagePersonal: number=1;
  desiredPage: any;
  desiredPagePersonal: any;
  showSalarycert: boolean=false;
  address: any;
  validationremarksAdd: any;
  Status: any;

  constructor(private apicall:ApiCallService,private session:LoginService,private datepipe:DatePipe,private route: ActivatedRoute,private general:GeneralService,private router:Router) { }

  ngOnInit(): void {  

    this.route.queryParams
      .subscribe(params => {
        this.user = params['user'];
        this.Status=params['Status'];
        if(this.user=='team' && this.Status){
          this.selectedStatus=params['Status'];
        }else if(this.user=='personal' && this.Status){
          this.selectedStatusPersonal=params['Status'];
        }else{
          this.selectedStatusPersonal=1;
        }
       
      }
    );
    

    if( this.user == 'personal' || this.user == undefined){
      this.user = 'personal'
      this.filterPersonal(); 
    }
    else{
      this.user = 'team';
      this.level = this.userSession.level;
      this.filter();
    }    
    
    //company drop down
    this.apicall.FetchCompanyList(this.empcode).subscribe((res)=>{
          this.companylist=res;
    });
    //Status drop down
    this.apicall.listCompanyList(57).subscribe((res)=>{
      this.status=res;
      //alert(JSON.stringify(res))
   });
   //Doctype drop down
   this.apicall.listCompanyList(58).subscribe((res)=>{
           this.doctype=res;
   });
   
  }

  teamselection(user:string){    
    this.user = user;  
    if (this.user == 'personal') {       
      this.filterPersonal();      
    } else {
      this.user = 'team'
      this.level = this.userSession.level;
      this.filter();      
    }      
   }
   validateDoctype(){
    if(this.doc_type==-1){
      this.validationDoctype='*Required!';
     }
     else if(this.doc_type==1){
      this.showSalarycert=true;
     }else{
      this.showSalarycert=false;
      this.validationDoctype='';  
     }
    }
    validateRemarks(){
     if(!this.remarks){  
      this.validationremarks='*Required!';
     }      
     else{       
      this.validationremarks='';      
   }
  }
  validateRemarksAdd(){
    if(!this.address){
     this.validationremarksAdd='*Required!';     
    }else{      
     this.validationremarksAdd='';
  }
 }
   addRequest(){  
    this.validateDoctype();  
    
    this.validateRemarks();   
    this.validateRemarksAdd();   
     if(this.doc_type!=-1 && this.remarks){ 
      if(this.doc_type==1) {
        if(this.address){
          const data={
            empcode:this.empcode,
            doc_type:this.doc_type,
            remarks:this.remarks,
            address:this.address
           };
           this.apicall.AddServiceDocReq(data).subscribe((res)=>{
            //alert(JSON.stringify(res));
            if(res.Errorid==1){
              (<HTMLInputElement>document.getElementById("openModalButton")).click();
              this.showModal = 1;
              this.success = "Request saved successfully!";
            }else{
              (<HTMLInputElement>document.getElementById("openModalButton")).click();
              this.showModal = 2;
              this.Failed = "Failed";
            }
            this.clear();
            this.filterPersonal();
          });
        }
      } else{ 
     
     const data={
      empcode:this.empcode,
      doc_type:this.doc_type,
      remarks:this.remarks,
      address:null
     };
     this.apicall.AddServiceDocReq(data).subscribe((res)=>{
      //alert(JSON.stringify(res));
      if(res.Errorid==1){
        (<HTMLInputElement>document.getElementById("openModalButton")).click();
        this.showModal = 1;
        this.success = "Request saved successfully!";
      }else{
        (<HTMLInputElement>document.getElementById("openModalButton")).click();
        this.showModal = 2;
        this.Failed = "Failed";
      }
      this.clear();
      this.filterPersonal();
    });
    }
  }
  }
   //Clear add request
   clear(){
    this.doc_type=-1;
    this.remarks='';
    this.address='';
   }  
   getStatusStyles(status:any) {    
    let styles = {
      'background-color': status === 'Approved & Processed' ? '#28a745' : 
                          (status === 'Pending for Approval' ? '#54b4e4' : 
                            (status === 'Cancelled' ? '#808080' : '#dc3545')),
      'color': 'white',
    };
    
    return styles;
  }
  
  selecteditem(item:any){
    this.item=item; 
    this.req_id=item.REQ_ID;
    this.Remarks=item.REMARKS; 
    this.reject_reason=item.REJECT_REASON;      
  } 
  Address(item:any){
    this.item=item; 
    this.Remarks=item.REQ_ADDRESS; 
         
  }
  viewDocSpecialCat(item:any){
    const data={
      reqid:item.REQ_ID,
      empcode:item.EMP_CODE    
    }
    this.general.setEmpdetails_competency(data); 
  if(item.DOC_TYPE_ID==1){ 
    if(this.user=='team'){
      this.router.navigate(['/salary-cerificate'], { queryParams: { user: this.user,Status:this.selectedStatus } });
    } else{
      this.router.navigate(['/salary-cerificate'], { queryParams: { user: this.user,Status:this.selectedStatusPersonal } });
    }
   
  }else if(item.DOC_TYPE_ID==3){
    if(this.user=='team'){
      this.router.navigate(['/salary-transfer-cerificate'], { queryParams: { user: this.user,Status:this.selectedStatus } });
    } else{
      this.router.navigate(['/salary-transfer-cerificate'], { queryParams: { user: this.user,Status:this.selectedStatusPersonal } });
    }   
  }else{
    if(this.user=='team'){
      this.router.navigate(['/employment-certificate'], { queryParams: { user: this.user,Status:this.selectedStatus } });
    } else{
      this.router.navigate(['/employment-certificate'], { queryParams: { user: this.user,Status:this.selectedStatusPersonal } });
    }    
  }
  }
  ApproveSpecialCat(item:any){
    const data={
      empcode:item.EMP_CODE,
      verified_by:this.empcode,
      docpath:'',
      req_id:item.REQ_ID,
      reason:'Approved',
      mflag:1  
     };
      //alert(JSON.stringify(data))
      this.apicall.ApproveRejectDocumentRequest(data).subscribe((res)=>{
         //alert(JSON.stringify(res))        
        if(res.Errorid==1){
          (<HTMLInputElement>document.getElementById("openModalButton")).click();
          this.showModal = 1;
          this.success = "Request approved successfully!";         
        }else if(res.Errorid==3){
          (<HTMLInputElement>document.getElementById("openModalButton")).click();
          this.showModal = 2;
          this.Failed = "Insufficient data!";
        }else {
          (<HTMLInputElement>document.getElementById("openModalButton")).click();
          this.showModal = 2;
          this.Failed = "Failed!";
        }    
        this.doc='';    
        this.filter();
      });
  }
  Approve(item:any){
    if(!this.doc){
      (<HTMLInputElement>document.getElementById("openModalButton")).click();
      this.showModal = 2;
      this.Failed = "Please select a document!";
    }
    else{
   const data={
    empcode:item.EMP_CODE,
    verified_by:this.empcode,
    docpath:this.doc,
    req_id:item.REQ_ID,
    reason:'Approved',
    mflag:1  
   };
    //alert(JSON.stringify(data))
    this.apicall.ApproveRejectDocumentRequest(data).subscribe((res)=>{
       //alert(JSON.stringify(res))        
      if(res.Errorid==1){
        (<HTMLInputElement>document.getElementById("openModalButton")).click();
        this.showModal = 1;
        this.success = "Request approved successfully!";
        this.upload(item.REQ_ID);
      }else {
        (<HTMLInputElement>document.getElementById("openModalButton")).click();
        this.showModal = 2;
        this.Failed = "Failed!";
      }    
      this.doc='';    
      this.filter();
    });
  }
  }
  filter(){
    this.apicall.FetchDocumentRequests_Team(this.empcode,this.selectedStatus,this.selectedCompany,this.desigid).subscribe((res)=>{
      this.docreqTeam=res;  
      //alert(JSON.stringify(this.docreqTeam))
      const maxPageFiltered = Math.ceil(this.docreqTeam.length / this.itemsPerPage);  

      if (this.currentPage > maxPageFiltered) {
        this.currentPage = 1;     
      }  
    });
  }
  filterPersonal(){
    this.apicall.FetchDocumentRequests_Personal(this.empcode,this.selectedStatusPersonal,this.selectedDoctype).subscribe((res)=>{
      this.docreqPersonal=res;  
      //alert(JSON.stringify(this.docreqPersonal))
      const maxPageFiltered = Math.ceil(this.docreqPersonal.length / this.itemsPerPage);  

      if (this.currentPage > maxPageFiltered) {
        this.currentPage = 1;     
      }  
    });
  }
  Reject(item:any){    
    if(!this.reason){
      (<HTMLInputElement>document.getElementById("openModalButton")).click();
      this.showModal = 2;
      this.Failed = "Please enter reason!"; 
    }
    else{
      const data={
       empcode:item.EMP_CODE,
       verified_by:this.empcode,
       docpath:"",
       req_id:item.REQ_ID,
       reason:this.reason,
       mflag:2  
      };
       //alert(JSON.stringify(data))
       this.apicall.ApproveRejectDocumentRequest(data).subscribe((res)=>{
          //alert(JSON.stringify(res))           
         if(res.Errorid==1){
           (<HTMLInputElement>document.getElementById("openModalButton")).click();
           this.showModal = 1;
           this.success = "Request rejected!";
         }else{
           (<HTMLInputElement>document.getElementById("openModalButton")).click();
           this.showModal = 2;
           this.Failed = "Failed";
         }  
         this.reason='';    
         this.filter();
       });
     }
  }
  cancel(item:any){   
    this.apicall.CancelDocumentRequest(item.REQ_ID,this.empcode).subscribe((res)=>{
       //alert(JSON.stringify(res))
       if(res.Errorid==1){
        (<HTMLInputElement>document.getElementById("openModalButton")).click();
        this.showModal = 1;
        this.success = "Request cancelled successfully!";
      }else{
        (<HTMLInputElement>document.getElementById("openModalButton")).click();
        this.showModal = 2;
        this.Failed = "Failed";
      }        
      this.filterPersonal();  
    });
  }
  upload(reqid:any)
  {   
       let input:any;
       input=document.getElementById("formFile");
       const fdata = new FormData();
       this.onFileSelect(input,reqid);
   }
   onFileSelect(input:any,reqid:any) {    
    if (input.files && input.files[0]) {      
     const fdata = new FormData();    
     fdata.append('filesup',input.files[0]);     
     this.apicall.DocumentRequestDocUpload(fdata,reqid).subscribe((res)=>{
       const result=res;
       if(res==0)
       { 
         this.showModal = 2;
        this.Failed = "Document uploading failed";
       }
     })
  
   }
  }
    download_to_excel()
      {        
        let fileurl=`${this.apicall.dotnetapi}/File/GetDocumentRequestDocs/${this.item.REQ_ID}`;
        
        let link = document.createElement("a");          
            if (link.download !== undefined) {          
              link.setAttribute("href", fileurl);
              link.setAttribute('target', '_blank');
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
       }   
       
    }  
  
    clearApproveModal(){
      this.doc='';
    }
    clearRejectmodal(){
      this.reason='';   
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
        this.Failed='Invalid page number!'; 
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
    const totalResults = this.docreqTeam.filter((employee: any) => {
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
    
    const filteredData = this.docreqTeam.filter((employee: any) =>
      Object.values(employee).some((value: any) =>
        typeof value === 'string' &&
        value.toLowerCase().startsWith(this.searchInput.toLowerCase())
      )
    );
  
    const start = (this.currentPage - 1) * this.itemsPerPage + 1;
    return Math.min(start, filteredData.length);
  }
  
  
  getEntriesEnd(): number {  
    const filteredData = this.docreqTeam.filter((employee: any) =>
      Object.values(employee).some((value: any) =>
        typeof value === 'string' &&
        value.toLowerCase().startsWith(this.searchInput.toLowerCase())
      )
    );
    const end = this.currentPage * this.itemsPerPage;
    return Math.min(end, filteredData.length);
  }
  getTotalPagesPersonal(): number {
    return Math.ceil(this.totalSearchResultsPersonal / this.itemsPerPage);
  }
  
  goToPagePersonal() {
    const totalPages = Math.ceil(this.totalSearchResultsPersonal / this.itemsPerPage);
    if (this.desiredPagePersonal >= 1 && this.desiredPagePersonal <= totalPages) {
      this.currentPagePersonal = this.desiredPagePersonal;
    } else {  
      
      (<HTMLInputElement>document.getElementById("openModalButton")).click();
      this.showModal = 2; 
      this.Failed='Invalid page number!'; 
      this.desiredPagePersonal=''; 
    }   
   
  }
  getPageNumbersPersonal(currentPage: number): number[] {
    const totalPages = Math.ceil(this.totalSearchResultsPersonal / this.itemsPerPage);
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
  get totalSearchResultsPersonal(): number {
  const totalResults = this.docreqPersonal.filter((employee: any) => {
    return Object.values(employee).some((value: any) =>
      typeof value === 'string' && value.toLowerCase().startsWith(this.searchInput.toLowerCase())
    );
  }).length;
  
  const maxPageFiltered = Math.ceil(totalResults / this.itemsPerPage);  
  
  if (this.currentPagePersonal > maxPageFiltered) {
    this.currentPagePersonal = 1; 
  }
  
  return totalResults;
  }
  
  // Function to change the current page
  changePagePersonal(page: number): void { 
    this.desiredPagePersonal = '';   
    this.currentPagePersonal = page;
    const maxPage = Math.ceil(this.totalSearchResultsPersonal / this.itemsPerPage);
    if (this.currentPagePersonal > maxPage) {
      this.currentPagePersonal = 1;
    }        
  }
  getEntriesStartPersonal(): number {
  if (this.currentPagePersonal === 1) {
    return 1;
  }
  
  const filteredData = this.docreqPersonal.filter((employee: any) =>
    Object.values(employee).some((value: any) =>
      typeof value === 'string' &&
      value.toLowerCase().startsWith(this.searchInput.toLowerCase())
    )
  );
  
  const start = (this.currentPagePersonal - 1) * this.itemsPerPage + 1;
  return Math.min(start, filteredData.length);
  }
  
  
  getEntriesEndPersonal(): number {  
  const filteredData = this.docreqPersonal.filter((employee: any) =>
    Object.values(employee).some((value: any) =>
      typeof value === 'string' &&
      value.toLowerCase().startsWith(this.searchInput.toLowerCase())
    )
  );
  const end = this.currentPagePersonal * this.itemsPerPage;
  return Math.min(end, filteredData.length);
  }
  

}
