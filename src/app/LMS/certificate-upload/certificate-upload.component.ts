import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiCallService } from 'src/app/api-call.service';
import { LoginService } from 'src/app/login.service';
import { Router } from '@angular/router';
import { FormControl,FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { emitDistinctChangesOnlyDefaultValue } from '@angular/compiler';

@Component({
  selector: 'app-certificate-upload',
  templateUrl: './certificate-upload.component.html',
  styleUrls: ['./certificate-upload.component.scss']
})
export class CertificateUploadComponent implements OnInit {

  id: any;
  userSession:any = this.session.getUserSession();
  empcode: any=this.userSession.empcode;
  listTrainingDtls: any;
  fetchCertificateOnload: any;
  searchInput: string = '';
  i=0;
  showModals: any;
  successs: any;
  faileds: any;
  desiredPage: any;
  itemsPerPage=10;
  currentPage=1;
  showModal: any;
  failed: any;

  constructor(private route: ActivatedRoute,private session:LoginService,private apicall:ApiCallService,private router:Router,private fb: FormBuilder) { }

  ngOnInit(): void {

    this.route.queryParams.subscribe(params => {
    this.id = params['Id'];
    });

    this.apicall.GetTrainingDetails(this.id).subscribe((res)=>{
      this.listTrainingDtls=res;
    })

    this.fetchcertificateDetails();

  }


  fetchcertificateDetails()
  {
    this.apicall.fetchcertificateDetails(this.id).subscribe((res)=>{
      this.fetchCertificateOnload=res;

     // alert(JSON.stringify(res))
    })
  }

  uploadCertificate(uploadFile:any,emp_code:any,upId:any)
  {
    const expirydate= (<HTMLInputElement>document.getElementById("expirydate")).value;

     if(uploadFile!="" && expirydate!="")
      {
      const upData = {
          training_id: this.id,
          empcode: emp_code,
          fpath:uploadFile,
          expirydate:expirydate,
          updatedby: this.empcode
          };
  

       // alert(JSON.stringify(upData))
  
       this.apicall.uploadcertificatdtl(upData).subscribe(res =>{
   
        if(res.Errorid==1){
          this.uploadBasic(this.id,emp_code,upId);
          (<HTMLInputElement>document.getElementById("openModalButtonForalertsuccess")).click();
          this.showModals = 1;
          this.successs = "Uploaded Successfully";
          this.fetchcertificateDetails();
    
        }
        else{
          (<HTMLInputElement>document.getElementById("openModalButtonForalertsuccess")).click();
          this.showModals = 2;
          this.faileds = "Failed";
          this.fetchcertificateDetails();  
        }
      
        })

      }
      else
      {
        (<HTMLInputElement>document.getElementById("openModalButtonForalertsuccess")).click();
          this.showModals = 2;
          this.faileds = "Please choose both file and expiry date";
      }
  }

  uploadBasic(trainingId: any,emp_code:any,upId:any) {

    let input: any;
    let maxSizeKB = 120; 
    let allowedFileTypes = ['image/jpeg','application/pdf']; 

    
     input = <HTMLInputElement>document.getElementById(upId);

   // alert(input.files[0])
 
    if (input) {
      const file = input.files[0];

          const fdata = new FormData();
          this.onFileSelectBasic(input,trainingId,emp_code);

    }
  }


  onFileSelectBasic(input:any,trainingId:any,emp_code:any) {   
 
        const upflag = 2;
       // alert(input.files[0])
   
      if (input.files && input.files[0]) {
        
       const fdata = new FormData();

 //alert(fdata)
      //alert(input.files[0])
      
       fdata.append('filesup',input.files[0]);


       this.apicall.UploadTrainingCertificate(fdata,trainingId,emp_code).subscribe((res)=>{
        //  if(res=0)
        //  {
        //    this.showModal = 2;
        //   this.failed = "Document uploading failed";
        //  }
         
      })
   
     }
   }


ViewFiles(docname:any,e_mpcode:any,)
{
//  alert(docname)
//  alert(e_mpcode)
  //const ecode= (<HTMLInputElement>document.getElementById("nonactiveEmp")).value;
  let fileurl=this.apicall.GetTrainingCertificates(this.id,docname,e_mpcode);
  //alert(fileurl)
  let link = document.createElement("a");
  link.setAttribute("href", fileurl);
  link.setAttribute("target", "_blank");
          link.setAttribute("download", "");
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link)
}

// pagination

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


get totalSearchResults(): number {
const totalResults = this.fetchCertificateOnload.filter((employee: any) => {
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

const filteredData = this.fetchCertificateOnload.filter((employee: any) =>
  Object.values(employee).some((value: any) =>
    typeof value === 'string' &&
    value.toLowerCase().startsWith(this.searchInput.toLowerCase())
  )
);

const start = (this.currentPage - 1) * this.itemsPerPage + 1;
return Math.min(start, filteredData.length);
}


getEntriesEnd(): number {  
const filteredData = this.fetchCertificateOnload.filter((employee: any) =>
  Object.values(employee).some((value: any) =>
    typeof value === 'string' &&
    value.toLowerCase().startsWith(this.searchInput.toLowerCase())
  )
);
const end = this.currentPage * this.itemsPerPage;
return Math.min(end, filteredData.length);
}
  

}
