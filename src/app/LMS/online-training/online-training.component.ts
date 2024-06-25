import { Component, OnInit  } from '@angular/core';
import { ApiCallService } from 'src/app/api-call.service';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/login.service';
import { JsonPipe, formatDate } from '@angular/common';
import { FormControl,FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

@Component({
  selector: 'app-online-training',
  templateUrl: './online-training.component.html',
  styleUrls: ['./online-training.component.scss']
})

export class OnlineTrainingComponent implements OnInit {

  userSession:any = this.session.getUserSession();
  empcode: any=this.userSession.empcode;
  dropdownSettings:IDropdownSettings={};
  listTrainings: any;
  listaccesscompany: any;
  yearlist: any;
  trainingId: any;
  showModals: any;
  successs: any;
  faileds: any;
  listarea: any;
  areaid = 15;
  listtraining: any;
  listEmployee: any;
  OnlinAddForm : FormGroup;
  isFormValid:boolean=false;
  desiredPage: any;
  itemsPerPage=10;
  currentPage=1;
  showModal: any;
  failed: any;
  searchInput: string = '';
  fieldflag: any;
  existingtddocs: any;
  viewsts: any;
  oldvideo_path=new FormControl();
  olddoc_path=new FormControl();

  constructor(private session:LoginService,private apicall:ApiCallService,private route:Router,private fb: FormBuilder) {

    this.dropdownSettings = {
      idField: 'EMP_CODE',
      textField: 'EMP_NAME',
      itemsShowLimit: 3,
      limitSelection: -1,
      allowSearchFilter: true,
      clearSearchFilter: true,
    };

    this.OnlinAddForm = this.fb.group({
      areanm: ['', Validators.required],
      trainingname: ['', Validators.required],
      hemployee: ['', Validators.required],
      targetdate: ['', Validators.required],
      duration: ['', Validators.required],
      video_path:[''],
      doc_path: [''],
      remarks: ['', Validators.required]
    });

   }

  ngOnInit(): void {

    this.fieldflag=0;
    this.viewsts=0;

    this.fetchOnlineTrainings();
    this.ListCompany();
    this.listYear();
    this.listingarea();
    this.FetchTrainingSubjects();

    this.apicall.FetchEmployeeList(-1,-1,this.empcode).subscribe(res => {
      this.listEmployee = res;
    })
  }

    hClear()
    {
      this.OnlinAddForm.reset();
    }
    
    OnlinFormSubmit()
      {
        if (this.OnlinAddForm.valid){
            this.isFormValid = true;
          }
        else{
          this.markFormGroupTouched(this.OnlinAddForm);
        }
      }

    markFormGroupTouched(formGroup: FormGroup) {
      Object.values(formGroup.controls).forEach(control => {
        control.markAsTouched();
      });
    }

    Onlinetrsubmit()
    {
      if (this.OnlinAddForm.valid) {
        const areanm= this.OnlinAddForm.get('areanm');
        const trainingname= this.OnlinAddForm.get('trainingname'); 
        const targetdate= this.OnlinAddForm.get('targetdate'); 
        const video_path= this.OnlinAddForm.get('video_path');
        const doc_path= this.OnlinAddForm.get('doc_path');
        const duration= this.OnlinAddForm.get('duration');
        const remarks= this.OnlinAddForm.get('remarks');
        const emplist = this.OnlinAddForm.get('hemployee')?.value
        const empname = emplist.map((item: {
          EMP_CODE: any; id: any; 
          }) => item.EMP_CODE).join(',');

          if(video_path?.value !== "" && doc_path?.value !== "") 
            {
              (<HTMLInputElement>document.getElementById("openModalButtonForalertsuccess")).click();
              this.showModals = 1;
              this.successs = "Please choose link or video";
            }
            else
            {

          const data = {
            employees : empname,
            area : areanm?.value,
            train_subject : trainingname?.value,
            target_date : targetdate?.value,
            remarks :  remarks?.value,
            duration :  duration?.value,
            video_path : video_path?.value,
            updatedby : this.empcode,
            doc_path : doc_path?.value
            };

        //  alert(JSON.stringify(data))

          this.apicall.SaveOnlineTrainingRequest(data).subscribe(res =>{
          //  alert(res.Errorid);
            if(res.Errorid!=0){

              this.uploadBasic(res.Errorid);
              (<HTMLInputElement>document.getElementById("openModalButtonForalertsuccess")).click();
              this.showModals = 1;
              this.successs = "Online Training Added Successfully";
              this.fetchOnlineTrainings();
              this.hClear();
        
            }
            else{
              (<HTMLInputElement>document.getElementById("openModalButtonForalertsuccess")).click();
              this.showModals = 2;
              this.faileds = "Failed!";
              this.fetchOnlineTrainings();
              this.hClear(); 
            }  

          })
      }
    }
      else{
        this.markFormGroupTouched(this.OnlinAddForm); 
      }
    }


    uploadBasic(trainingId: any) {
      let input: any;
      let maxSizeKB = 120; 
      let allowedFileTypes = ['image/jpeg','application/pdf']; 
    
      input = <HTMLInputElement>document.getElementById("doc_path");
   
      if (input) {
        const file = input.files[0];

            const fdata = new FormData();
            this.onFileSelectBasic(input,trainingId);

      }
    }


    onFileSelectBasic(input:any,trainingId:any) {
 
     
        const upflag = 2
        if (input.files && input.files[0]) {
          
         const fdata = new FormData();

         //alert(fdata)
        
         fdata.append('filesup',input.files[0]);
        this.apicall.UploadOnlineVideos(fdata,trainingId).subscribe((res)=>{
          //  if(res=0)
          //  {
          //    this.showModal = 2;
          //   this.failed = "Document uploading failed";
          //  }
           
        })
     
       }
     }


  fetchOnlineTrainings()
  {
    const year=-1;
    const company=-1;
    this.apicall.fetchOnlineTrainings(this.empcode,year,company).subscribe(res => {
      this.listTrainings = res;
    })
  }

  fetchOnlineTrainingsFilter()
  {
    const year=(<HTMLInputElement>document.getElementById("year")).value;
    const company=(<HTMLInputElement>document.getElementById("company")).value;
    this.apicall.fetchOnlineTrainingsfilter(this.empcode,year,company).subscribe(res => {
      this.listTrainings = res;
    })
  }

  listYear()
  {
    this.apicall.listYear().subscribe((res)=>{
    this.yearlist=res;
      })
  }

  ListCompany()
  {
    this.apicall.FetchCompanyList(this.empcode).subscribe((res)=>{
      this.listaccesscompany=res;
      })
  }
  listingarea()
  {
    this.apicall.listRegStatus(this.areaid).subscribe(res =>{
      this.listarea = res;
    })
  }

  FetchTrainingSubjects()
  {
    this.apicall.FetchTrainingSubjects().subscribe(res =>{
    this.listtraining=res;
    })
  }

  

  cancelonlineTraining(trainingId:any)
  {
   this.trainingId=trainingId;
  }

  confirmCancelTraining(trainingId:any)
  {
    this.apicall.cancelTraining(trainingId,this.empcode).subscribe((res)=>{

      

        if(res.Errorid==1){
          (<HTMLInputElement>document.getElementById("openModalButtonForalertsuccess")).click();
          this.showModals = 1;
          this.successs = "Cancelled Successfully";
          this.fetchOnlineTrainings();
    
        }
        else{
          (<HTMLInputElement>document.getElementById("openModalButtonForalertsuccess")).click();
          this.showModals = 2;
          this.faileds = "Failed!";
          this.fetchOnlineTrainings(); 
        }
        
   
      })
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
const totalResults = this.listTrainings.filter((employee: any) => {
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

const filteredData = this.listTrainings.filter((employee: any) =>
  Object.values(employee).some((value: any) =>
    typeof value === 'string' &&
    value.toLowerCase().startsWith(this.searchInput.toLowerCase())
  )
);

const start = (this.currentPage - 1) * this.itemsPerPage + 1;
return Math.min(start, filteredData.length);
}


getEntriesEnd(): number {  
const filteredData = this.listTrainings.filter((employee: any) =>
  Object.values(employee).some((value: any) =>
    typeof value === 'string' &&
    value.toLowerCase().startsWith(this.searchInput.toLowerCase())
  )
);
const end = this.currentPage * this.itemsPerPage;
return Math.min(end, filteredData.length);
}


newfield(trainingnm:any,area:any)
{

  // alert(trainingnm);
  // alert(area);
 //alert(typval);
 if(trainingnm=='-1')
 {
      this.fieldflag=1;
 }
 else
 {
      this.fieldflag=0;
 }



 this.apicall.fetchexistingtrdetails(area,trainingnm).subscribe((res) => {
 // this.FetchTrainingSubjects();
 this.existingtddocs=res;
 //alert(JSON.stringify(res))

 if(this.existingtddocs!="")
  {
    this.viewsts=1;
    this.oldvideo_path.setValue(this.existingtddocs[0].KEY_ID);
    this.olddoc_path.setValue(this.existingtddocs[0].DATA_VALUE);

  }
  else
  {
    this.viewsts=0;
  }



})


 
}


addnrewtraining(newtrainingnm:any)
{
  //alert(newtrainingnm)

  const newtraining={
    subject_name:newtrainingnm,
    updated_by:this.empcode
   
  }


  this.apicall.addnewTrainingnm(newtraining).subscribe((res) => {
    this.FetchTrainingSubjects();

  })


}


  

}
