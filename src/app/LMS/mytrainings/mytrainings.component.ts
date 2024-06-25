import { Component, OnInit } from '@angular/core';
import { ApiCallService } from 'src/app/api-call.service';
import { LoginService } from 'src/app/login.service';
import { DatePipe} from '@angular/common';
import { FormControl,FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-mytrainings',
  templateUrl: './mytrainings.component.html',
  styleUrls: ['./mytrainings.component.scss']
})
export class MytrainingsComponent implements OnInit {

  userSession:any = this.session.getUserSession();
  authorityflg:any =this.userSession.authorityflg;
  empcode: any=this.userSession.empcode;
  empid:any =this.userSession.id;
  dept: any=this.userSession.dept;
  roleid:any =this.userSession.level;
  grpname:any=this.userSession.grpname;
  company: any=this.userSession.companycode;

  listYear: any;
  liststatus: any;
  status: any = -1;
  year: any = -1;
  listTrainings: any;
  searchInput: string='';
  itemsPerPage=10;
  currentPage=1;
  desiredPage: any; 
  videoWatchTime: any;
  url: any;
  videoStartTime: any;
  fileurl: any;
  fileType: any;
  private cachedSafeUrl: SafeResourceUrl | null = null;
  isChecked: boolean = false;
  showModal = 0;
  success:any="";
  failed:any="";  
  selecttrid: any;
  VIDEO_WATCHED_TIME: any;

  constructor(private apicall:ApiCallService,private datePipe:DatePipe,private session:LoginService,private fb: FormBuilder,private router: Router,private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.ListYear();
    this.apicall.listRegStatus(67).subscribe(res =>{
      this.liststatus = res;
    })

    this.FetchTrainings();
  }

  ListYear()
  {
    this.apicall.listYear().subscribe((res)=>{
    this.listYear=res;
    })
  }

  FetchTrainings()
  {
    this.apicall.Fetch_MyTraining_Details(this.empcode,this.status,this.year).subscribe((res)=>{
      this.listTrainings=res;
    })
  }

  navigateToNewPage(id: any): void 
  {
    this.router.navigate(
      ['/course_feedback_form'],
      { queryParams: { ID: id} }
    );
  }

  navigateToassPage(id: any): void 
  {
    this.router.navigate(
      ['/take_assessment'],
      { queryParams: { Id: id} }
    );
  }

  download_documents(trainingID:any){
    let fileurl=this.apicall.GetTrainingCertificate(trainingID,this.empcode);
    let link = document.createElement("a");
      
       if (link.download !== undefined) {
          link.setAttribute("href", fileurl);
          // link.setAttribute('target', '_blank');
          // link.target = '_blank';
          link.setAttribute('target', '_blank');
          link.setAttribute("download", "ReportFile.xlsx");
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
       }
 }

 selecturl(url:any){
    this.url = url  
 }

 onVideoTimeUpdate(event:any) {
  this.videoWatchTime = event.target.currentTime;
 }

 startTrackingTime() {
  this.videoStartTime = Date.now();
}

openFileViewer(fileSrc:any,flag:any,trid:any,time:any) {
  this.selecttrid = trid;
  this.VIDEO_WATCHED_TIME = time;
  if(flag == 1){
    (<HTMLInputElement>document.getElementById("openModalButton")).click();
    this.fileurl=this.apicall.GetTrainingDocs(trid,fileSrc);
    this.fileType = this.getFileType(this.fileurl);
    // this.modalService.openFileViewer(this.fileurl);
    // const dialogRef = this.modalService.openFileViewer(this.fileurl);
    // dialogRef.afterClosed().subscribe(result => {
    //   console.log('The dialog was closed');
    // });
  }
  else if(flag == 0){

     let link = document.createElement("a");
       
      if (link.download !== undefined) {      
        link.setAttribute("href", fileSrc);
        link.setAttribute('target', '_blank');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
  }else{

  }
  
}

private getFileType(fileSrc: string): string {
  if (!fileSrc) {
    return 'unknown';
  }
  const fileName = fileSrc.split('/').pop(); // Get the file name from the URL
  const extension = fileName?.split('.').pop()?.toLowerCase() || ''; // Get the file extension
  switch (extension) {
    case 'pdf':
      return 'pdf';
    case 'mp3':
    case 'ogg':
    case 'wav':
      return 'audio';
    case 'mp4':
    case 'webm':
    case 'ogg':
      return 'video';
    default:
      return 'unknown';
  }
}

getSafeUrl(): SafeResourceUrl {

  if (this.cachedSafeUrl) {
    return this.cachedSafeUrl;
  }

  this.cachedSafeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.fileurl);
  return this.cachedSafeUrl;
}

seletedTraining(trid:any)
{
  this.selecttrid = trid;
}

CompleteTraining()
{
  if(this.isChecked == true)
  {
    this.apicall.Update_Online_CompleteStatus(this.empcode,this.selecttrid).subscribe((res)=>{
      if(res == 1){
        this.showModal = 1;
        this.success = "Training Completed Successfully!"
        this.FetchTrainings();
      }
      else{
        this.showModal = 2;
        this.failed = "Failed!";
        this.FetchTrainings();
      }
    })
  }
}

closeModalAndSaveWatchTime(): void {
  this.apicall.Update_VideoWatched_Time(this.empcode,this.selecttrid,this.videoWatchTime).subscribe((res)=>{
  });
}

clear(){
  this.isChecked == false
}

}
