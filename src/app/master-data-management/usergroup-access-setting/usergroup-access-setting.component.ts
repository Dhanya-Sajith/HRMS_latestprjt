
import { Component, OnInit } from '@angular/core';
import { ApiCallService } from 'src/app/api-call.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from 'src/app/login.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { JsonPipe, formatDate,DatePipe } from '@angular/common';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-usergroup-access-setting',
  templateUrl: './usergroup-access-setting.component.html',
  styleUrls: ['./usergroup-access-setting.component.scss']
})
export class UsergroupAccessSettingComponent implements OnInit {
  userSession:any = this.session.getUserSession();
  authorityflg:any =this.userSession.authorityflg;
  empcode: any=this.userSession.empcode;
  empid:any =this.userSession.id;
  listusergroup: any;
  listmenus: any;
  dropdownSettings:IDropdownSettings={};
  dropdownSettingsGrp:IDropdownSettings={};
  selectedItemUsers: any = [];
  selectedItemUserGroup: any = [];
  multiselect: any;
  useraccess: any;
  showModal = 0; 
  failed!: string;
  success!: string;
  warning!: string;
  itemsPerPage=10;
  currentPage=1;
  desiredPage: any;
  searchInput: string='';
  searchInputgrp: string='';
  menunames: any;
  usergroup: any;
  usergrouppage: any;
  totalPagesgrp:any;
  liststatusgrp: any;
  desiredPagegrp: any;
  currentPagegrp=1;
  listusergroupdrp: any;
  accesslist: any;
  menunamelistvalue=new FormControl();
  listAccess: any;
  addusergrp: any;
  length: number = 0;
  totalValue = 0;
  gotoCheckBox:boolean=false;
  hasChanges: boolean = false;
  menuaccesslist: any;
  userlistvalue: any;
  usermenuAccesslist: any;
  lengthmenu: number = 0;

  constructor(private session:LoginService,private apicall:ApiCallService,private router:Router) { }

  ngOnInit(): void {
    this.apicall.listUserGroups(31).subscribe((res)=>{
      this.usergroup=res;
     // alert(JSON.stringify( this.usergroup))
    })
    this.dropdownSettings = {
      idField: 'KEY_ID',
      textField: 'DATA_VALUE',
      itemsShowLimit: 3,
      limitSelection: -1,
      allowSearchFilter: true,
      clearSearchFilter: true,
    };
    this.apicall.listUserGroups(55).subscribe((res)=>{
      this.listusergroupdrp=res;
    })
    
    this.dropdownSettingsGrp = {
    idField: 'KEY_ID',
    textField: 'DATA_VALUE',
    itemsShowLimit: 3,
    limitSelection: -1,
    allowSearchFilter: true,
    clearSearchFilter: true,
  };
  
  

    this.apicall.ListMenuNames().subscribe((res)=>{
      this.menunames=res;
    })
   
     this.ListMenu();
     this.ListGroups();
  

  }
  ListMenu()
  {
    this.apicall.ListMenuNames().subscribe((res)=>{
      this.listmenus=res;
      const maxPageFiltered = Math.ceil(this.listmenus.length / this.itemsPerPage);  

    if (this.currentPage > maxPageFiltered) {
      this.currentPage = 1;     
    } 
    })
  }
SetAccess()
{
  const menuname= (<HTMLInputElement>document.getElementById("menuname")).value;
  const usergroup = this.selectedItemUsers.map((item: {
    KEY_ID: any; id: any; 
    }) => item.KEY_ID).join('!');
    if(usergroup=='')
      {
        this.showModal = 2; 
            this.failed='Please Select usergroup!';
      }
    else if(menuname=='-1')
    {
      this.showModal = 2; 
      this.failed='Please Select menuname!';
    }
    else{
      const data = {
        mflag :1,
        userGroup: usergroup,
        menu: menuname,
        userFlag:0
      };
          this.apicall.UserAccessSetting(data).subscribe(res =>{
          this.useraccess=res;
          if(res.Errorid==1){
            this.showModal = 1; 
            this.success='Access Setting Succeeded';  
          }
          else{
            this.showModal = 2; 
            this.failed='Failed!';      
          } 
          this.Cancel()
      })
      
  }
  
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
const totalResults = this.listmenus.filter((policy: any) => {
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

const filteredData = this.listmenus.filter((policy: any) =>
Object.values(policy).some((value: any) =>
  typeof value === 'string' &&
  value.toLowerCase().startsWith(this.searchInput.toLowerCase())
)
);

const start = (this.currentPage - 1) * this.itemsPerPage + 1;
return Math.min(start, filteredData.length);
}


getEntriesEnd(): number {  
const filteredData = this.listmenus.filter((policy: any) =>
Object.values(policy).some((value: any) =>
  typeof value === 'string' &&
  value.toLowerCase().startsWith(this.searchInput.toLowerCase())
)
);
const end = this.currentPage * this.itemsPerPage;
return Math.min(end, filteredData.length);
} 

UserGroups()
{
  this.apicall.listUserGroups(31).subscribe((res)=>{
    this.usergroup=res;
  })
  this.dropdownSettingsGrp = {
  idField: 'KEY_ID',
  textField: 'DATA_VALUE',
  itemsShowLimit: 3,
  limitSelection: -1,
  allowSearchFilter: true,
  clearSearchFilter: true,
};
}
ListGroups()
{
  this.apicall.listUserGroups(31).subscribe((res)=>{
    this.usergrouppage=res;
  })
  const maxPageFiltered = Math.ceil(this.usergrouppage.length / this.itemsPerPage);  

    if (this.currentPagegrp > maxPageFiltered) {
      this.currentPagegrp = 1;     
    } 
}
getTotalPagesGrp(): number {
  return Math.ceil(this.totalSearchResultsGrp / this.itemsPerPage);
}

goToPageGrp() {
  const totalPages = Math.ceil(this.totalSearchResultsGrp / this.itemsPerPage);
  if (this.desiredPagegrp >= 1 && this.desiredPagegrp <= totalPages) {
    this.currentPagegrp = this.desiredPagegrp;
  } else {  
    
    (<HTMLInputElement>document.getElementById("openModalButton")).click();
    this.showModal = 2; 
    this.failed='Invalid page number!'; 
    this.desiredPagegrp=''; 
  }   
 
}
getPageNumbersGrp(currentPagegrp: number): number[] {
  const totalPages = Math.ceil(this.totalSearchResultsGrp / this.itemsPerPage);
  const maxPageNumbers = 5; // Number of page numbers to show
  const middlePage = Math.ceil(maxPageNumbers / 2);
  let startPage = Math.max(currentPagegrp - middlePage, 1);
  let endPage = Math.min(startPage + maxPageNumbers - 1, totalPages);

  if (endPage - startPage + 1 < maxPageNumbers) {
    startPage = Math.max(endPage - maxPageNumbers + 1, 1);
  }

  return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
}

// Function to Calculate the total number of search results
get totalSearchResultsGrp(): number {
const totalResults = this.usergrouppage.filter((loan: any) => {
  return Object.values(loan).some((value: any) =>
    typeof value === 'string' && value.toLowerCase().startsWith(this.searchInputgrp.toLowerCase())
  );
}).length;

const maxPageFiltered = Math.ceil(totalResults / this.itemsPerPage);  

if (this.currentPagegrp > maxPageFiltered) {
  this.currentPagegrp = 1; 
}

return totalResults;
}

// Function to change the current page
changePageGrp(page: number): void { 
  this.desiredPagegrp = '';   
  this.currentPagegrp = page;
  const maxPage = Math.ceil(this.totalSearchResultsGrp / this.itemsPerPage);
  if (this.currentPagegrp > maxPage) {
    this.currentPagegrp = 1;
  }        
}
getEntriesStartGrp(): number {
if (this.currentPagegrp === 1) {
  return 1;
}

const filteredData = this.usergrouppage.filter((loan: any) =>
  Object.values(loan).some((value: any) =>
    typeof value === 'string' &&
    value.toLowerCase().startsWith(this.searchInputgrp.toLowerCase())
  )
);

const start = (this.currentPagegrp - 1) * this.itemsPerPage + 1;
return Math.min(start, filteredData.length);
}

getEntriesEndGrp(): number {  
const filteredData = this.usergrouppage.filter((loan: any) =>
  Object.values(loan).some((value: any) =>
    typeof value === 'string' &&
    value.toLowerCase().startsWith(this.searchInputgrp.toLowerCase())
  )
);
const end = this.currentPagegrp * this.itemsPerPage;
return Math.min(end, filteredData.length);
}
Cancel()
  {
    (<HTMLInputElement>document.getElementById("menuname")).value = '';
    this.selectedItemUsers = [];
  }
  UserAccessSavingList(menuid:any)
  {
    // alert(menuid)
    this.apicall.UserAccessSettingList(menuid).subscribe((res)=>{
      this.accesslist=res;
      // alert(JSON.stringify(this.accesslist))
      this.menunamelistvalue = this.accesslist[0].MenuName;
      // alert(this.menunamelistvalue)
      this.listAccess = this.accesslist[0].userGroupAccess;
      this.length=this.listAccess.length;
    })
    
  }

  AddNewUserGroup()
  {
       const usergrpid = this.selectedItemUserGroup.map((item: {
      KEY_ID: any; id: any; 
      }) => item.KEY_ID).join('!');
      const usergrpname = this.selectedItemUserGroup.map((item: {
        DATA_VALUE: any; id: any; 
        }) => item.DATA_VALUE).join('-');
        if(usergrpid=='')
          {
            this.showModal = 2; 
                this.failed='Please Select users!';
          }
          else
          {
  const data = {
  usergroupid:usergrpid,
  usergroupname:usergrpname,
  updatedby:this.empcode
    };
    this.apicall.AddNewUserGroup(data).subscribe(res =>{
      this.addusergrp=res;
      if(res.Errorid==0)
      {
        this.showModal = 2; 
        this.failed='Adding New User Group Failed'; 
      }
      if(res.Errorid==1)
      {
        this.showModal = 1; 
        this.success='Added User Group successfully'; 
      }
      if(res.Errorid==2)
      {
        this.showModal = 3; 
        this.warning='User Group Already Exists'; 
      } 
      if(res.Errorid==3)
      {
        this.showModal = 3; 
        this.warning='cannot combine with ESS'; 
      } 
      this. selectedItemUserGroup = [];
      this.ListGroups();
    })
  }
    
  }


  onCheckboxChange(event: Event, index: number): void {
    const checkbox = event.target as HTMLInputElement;
    this.listAccess[index].VIEW_FLAG = checkbox.checked ? 1 : 0;
    this.listAccess[index].changed = true; // Mark this item as changed
  }
  onCheckboxChangeMenu(event: Event, index: number): void {
    const checkbox = event.target as HTMLInputElement;
    this.usermenuAccesslist[index].VIEW_FLAG = checkbox.checked ? 1 : 0;
    this.usermenuAccesslist[index].changed = true; // Mark this item as changed
  }
  UserMenuAccessSavingList(userid:any)
  {
    this.apicall.UserMenuAccessSettingList(userid).subscribe((res)=>{
      this.menuaccesslist=res;
      //alert(JSON.stringify(this.menuaccesslist))
      this.userlistvalue = this.menuaccesslist[0].MenuName;
      this.usermenuAccesslist = this.menuaccesslist[0].userGroupAccess;
     // alert(JSON.stringify(this.usermenuAccesslist))
      this.lengthmenu=this.usermenuAccesslist.length;
    })
    
  }
  SaveUserGroupFlag(menuname: any, viewflag: boolean, usergroup: any): void {
    const data = {
      mflag: 2,
      userGroup: usergroup,
      menu: menuname,
      userFlag: viewflag ? 1 : 0
    };
     alert(JSON.stringify(data))
    this.apicall.UserAccessSetting(data).subscribe(res => {
      this.useraccess = res;
      if (res.Errorid === 1) {
        this.showModal = 1;
        this.success = 'Access Updated Successfully';
      } else {
        this.showModal = 2;
        this.failed = 'Failed!';
      }
    });
  }
  SaveUserMenuFlag(menuname: any, viewflag: boolean, usergroup: any): void {
    const data = {
      mflag: 3,
      userGroup: usergroup,
      menu: menuname,
      userFlag: viewflag ? 1 : 0
    };
     alert(JSON.stringify(data))
    this.apicall.UserAccessSetting(data).subscribe(res => {
      this.useraccess = res;
      if (res.Errorid === 1) {
        this.showModal = 1;
        this.success = 'Access Updated Successfully';
      } else {
        this.showModal = 2;
        this.failed = 'Failed!';
      }
    });
  }
  SaveUserGroupMenuFlag(menuname: any, viewflag: boolean, usergroup: any,menuId:any,parentId:any): void {
    const data = {
      userGroup: usergroup,
      menu: menuname,
      userFlag: viewflag ? 1 : 0,
      menuID:menuId,
      parentID:parentId
    };
    //alert(JSON.stringify(data))
    this.apicall.MenuAccessSetting(data).subscribe(res => {
      this.useraccess = res;
      if (res.Errorid === 1) {
        this.showModal = 1;
        this.success = 'Access Updated Successfully';
      } else {
        this.showModal = 2;
        this.failed = 'Failed!';
      }
    });
  }
}
