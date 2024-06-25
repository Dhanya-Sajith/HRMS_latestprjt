import { Component, OnInit } from '@angular/core';
import { ApiCallService } from 'src/app/api-call.service';
import { FormGroup , FormBuilder , FormControl , Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { LoginService } from 'src/app/login.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

@Component({
  selector: 'app-announcement',
  templateUrl: './announcement.component.html',
  styleUrls: ['./announcement.component.scss']
})
export class AnnouncementComponent implements OnInit {
  
  userSession:any = this.session.getUserSession();
  empcode: any=this.userSession.empcode;
  empId: any=this.userSession.id;
  level:any =this.userSession.level;
  authorityflg:any =this.userSession.authorityflg;

  listCompany: any;
  dropdownSettings:IDropdownSettings={};
  selectedItems: any = [];
  title:any
  startdt:any
  enddt:any
  showModal = 0;
  success:any="";
  failed:any="";
  listAnnouncement: any;
  liststatus: any;
  isChecked: boolean = true ;
  selectID: any;
  selectcmp: any = -1
  selectstatus: any = -1
  desiredPage: any;
  searchInput: string='';
  itemsPerPage=10;
  currentPage=1;
  Remarks: any;
  wishes:any;
  listwishes: any;
  wishID: any;

  constructor(private apicall:ApiCallService, private datePipe: DatePipe,private fb:FormBuilder,private session:LoginService) { }

  ngOnInit(): void {
    this.apicall.FetchCompanyList(this.empcode).subscribe((res)=>{
      this.listCompany=res;
    })

    this.apicall.listRegStatus(62).subscribe(res =>{
      this.liststatus = res;
    })

    this.FetchWishes();

    this.FetchAnnouncement();

    this.dropdownSettings = {
      idField: 'KEY_ID',
      textField: 'DATA_VALUE',
      itemsShowLimit: 3,
      limitSelection: -1,
      clearSearchFilter: true,
    };

  }

  selectremarks(reason:string){
    this.Remarks=reason;
  }

  FetchWishes()
  {
    this.apicall.FetchAnniversaryorBirthdayWishes().subscribe(res =>{
      this.listwishes = res;
    })
  }

  FetchAnnouncement(){
    this.apicall.FetchAnnouncement(this.empcode,this.selectcmp,this.selectstatus).subscribe(res =>{
      this.listAnnouncement = res;
    })
  }

  Submit()
  {
    if(this.selectedItems == '' || this.startdt == undefined || this.enddt == undefined || this.title == undefined){
      this.showModal = 2;
      this.failed = 'Please, Fill the fields.';
    }else if(this.startdt > this.enddt)
    {
      this.showModal = 2;
      this.failed = 'Please, Enter valid dates';
    }else{
        const compname = this.selectedItems.map((item: {
          KEY_ID: any; id: any; 
          }) => item.KEY_ID).join(',');
        const startdate = this.datePipe.transform(this.startdt,"yyyy-MM-dd");
        const enddate = this.datePipe.transform(this.enddt,"yyyy-MM-dd");
        const newData = {
          company_code : compname,
          title : this.title,
          start_date : startdate,
          end_date : enddate,
          mflag : 1,
          ann_id : '',
          updated_by : this.empcode,
          status  : 0,
        };
        
        this.apicall.AddAnnouoncements(newData).subscribe((res)=>{
        if(res.Errorid == 1)
        {
          this.showModal = 1;
          this.success = "Added Successfully...";
          this.FetchAnnouncement();
        }
        else
          {
            this.showModal = 2;
            this.failed = "Failed";
          }
        })
        this.startdt = '';
        this.enddt = '';
        this.title = '';
        this.selectedItems = [];
        this.FetchAnnouncement();
      }
  }

  Cancel()
  {
    this.startdt = '';
    this.enddt = '';
    this.title = '';
    this.selectedItems = [];
  }

  ActiveORInactive(code:any,active:any) {
    const newData = {
      company_code : '',
      title : '',
      start_date : null,
      end_date : null,
      mflag : 3,
      ann_id : code,
      updated_by : this.empcode,
      status  : active,
    };
    
    this.apicall.AddAnnouoncements(newData).subscribe((res)=>{
      this.FetchAnnouncement();
    })
    
  }

  setSelectedID(code:any){
    this.selectID = code;
  }

  Delete()
  {
    const newData = {
      company_code : '',
      title : '',
      start_date : null,
      end_date : null,
      mflag : 2,
      ann_id : this.selectID,
      updated_by : this.empcode,
      status  : 0,
    };
    
    this.apicall.AddAnnouoncements(newData).subscribe((res)=>{
    if(res.Errorid == 1)
    {
      this.showModal = 1;
      this.success = "Deleted Successfully.";
      this.FetchAnnouncement();
    }
    else
      {
        this.showModal = 2;
        this.failed = "Failed";
      }
    })
    this.FetchAnnouncement();
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
    const totalResults = this.listAnnouncement.filter((employee: any) => {
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

const filteredData = this.listAnnouncement.filter((employee: any) =>
  Object.values(employee).some((value: any) =>
    typeof value === 'string' &&
    value.toLowerCase().startsWith(this.searchInput.toLowerCase())
  )
);

const start = (this.currentPage - 1) * this.itemsPerPage + 1;
return Math.min(start, filteredData.length);
}


getEntriesEnd(): number {  
const filteredData = this.listAnnouncement.filter((employee: any) =>
  Object.values(employee).some((value: any) =>
    typeof value === 'string' &&
    value.toLowerCase().startsWith(this.searchInput.toLowerCase())
  )
);
const end = this.currentPage * this.itemsPerPage;
return Math.min(end, filteredData.length);
}

EditWishes(item:any)
{
  this.wishID = item.TYPE_ID;
  this.wishes = item.DATA_VALUE;
}

SaveWishes()
{
  this.apicall.UpdateAnniversaryorBirthdayWishes(this.wishes,this.wishID,this.empcode).subscribe((res)=>{
    if(res == 1)
    {
      this.showModal = 1;
      this.success = "Updated Successfully.";
      this.FetchWishes();
    }
    else
      {
        this.showModal = 2;
        this.failed = "Failed";
      }
    })
    this.FetchWishes();
    this.wishes = '';
    this.wishID = '';
}

}
