import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ApiCallService } from 'src/app/api-call.service';
import { LoginService } from 'src/app/login.service';

@Component({
  selector: 'app-approvelevelsetting',
  templateUrl: './approvelevelsetting.component.html',
  styleUrls: ['./approvelevelsetting.component.scss']
})
export class ApprovelevelsettingComponent implements OnInit {
  userSession:any = this.session.getUserSession();
  empcode: any=this.userSession.empcode;
  maxlevel: number=-1;  
  comp_typeid:any=12;
  companydata: any;
  dept_typeid: any = 1;
  deptdata: any;
  fun_typeid:any=30;
  functionality: any;
  selectedCompanyid: any="-1";
  selectedDept: any="-1";
  selectedfunctionality: any="C"; 
  role: any;
  employees:any;
  selectedrole: any;
  selectedRole:any="-1";
  authority: any[] = [];  
  maxlevelBody=new FormControl();
  maxlevelHeader: any=1;
  selectedRoles: any[] = [];
  level!: number;
  roleControls: FormControl[] = []; 
  authorityfilter: any;
  showRoleAndAuthority: boolean = false;
  selectedRolesbody: any[] = [];
  authoritybody: any; 
  selectedRoleb:any; 
  maxlevelControl=new FormControl('-1'); 
  roleControl=new FormControl('-1');
  emp_code = new FormControl(); 
  authorityArray: any[] = [];
  flattenedData: any[] = [];
  saveres: any;
  showModal!: number;
  success!: string;
  failed!: string;
  maxlevelbody: any;
  empmaxlevel: any;
  authoritybody1: any;
  authoritybody2: any;
  authoritybody3: any;
  authoritybody5: any;
  authoritybody4: any;
  selectedRolesbody1: any=-1;
  selectedRolesbody2: any=-1;
  selectedRolesbody3: any=-1;
  selectedRolesbody4: any=-1;
  selectedRolesbody5: any=-1;
  authoritybodyX: any;
  selectedAuthority1: any;
  selectedAuthority2: any;
  selectedAuthority3: any;
  selectedAuthority4: any;
  selectedAuthority5: any;
  empCode: any;
  showmaxlevel: boolean=false;
  selectedRoles1: any;
  authority1: any;
  selectedRoles2: any;
  authority2: any;
  selectedRoles3: any;
  authority3: any;
  selectedRoles4: any;
  authority4: any;
  selectedRoles5: any;
  authority5: any;
  selectedRolesH1: any=-1;
  selectedRolesH2: any=-1;
  selectedRolesH3: any=-1;
  selectedRolesH4: any=-1;
  selectedRolesH5: any=-1;
  selectedAuthorityHeader1: any=-1;
  selectedAuthorityHeader2: any=-1;
  selectedAuthorityHeade3: any=-1;
  selectedAuthorityHeader4: any=-1;
  selectedAuthorityHeader5: any=-1;
  selectedAuthorityHeader3: any=-1;
  maxlevelh: any=-1;
  AuthorityData: any[] = []; 
  linemanagerbody1: any;
  showauthority1: boolean=false; 
  showauthorityh1: boolean=false;
  selectedEmployee: any = null; 
  employeeLevels: any[] = []; 
  roleByLevel: string[] = [];
  authorityByLevel: string[] = [];
  currentPage = 1;
  itemsPerPage = 10; 
  searchInput: string = ''; 
  selectedStatus:any=-1;
  maxlevelonload!: number;
  Employee: any;
  valid!: boolean;
  message: string[]=[];
  showmessage: boolean[]=[];
  desiredPage: any;


  constructor(private apicall: ApiCallService,private session:LoginService) {    
  }
  

  ngOnInit(): void {
    //company combo box
    this.apicall.FetchCompanyList(this.empcode).subscribe((res) => {
      this.companydata=res;
    });
    //Department combo box
    this.apicall.listDepartment(this.dept_typeid).subscribe((res) => {
      this.deptdata=res;     
    });
    //Functionality combo box
    this.apicall.listDepartment(this.fun_typeid).subscribe((res) => {
      this.functionality=res;     
    });
    //Role combo box
    this.apicall.listDepartment(55).subscribe((res) => {
      this.role=res;    
      
    });
    const defaultRole = -1;
    const defaultAuthority = -1;
   
    this.apicall.FetchAuthorityDetails(this.empcode).subscribe((res) => {
      this.AuthorityData=res;      
   //alert(JSON.stringify(this.AuthorityData)) 
    this.AuthorityData.forEach((employee: { roleByLevel: number[]; authorityByLevel: number[]; }) => {
      employee.roleByLevel = [defaultRole];
      employee.authorityByLevel = [defaultAuthority];
    });
      this.AuthorityData.forEach((employee: {
        maxlevelonload: number; MAX_LEVEL: number; Authority: any[]; 
}) => {
       employee.maxlevelonload=  employee.MAX_LEVEL;   
        for (let i = 0; i < employee.MAX_LEVEL; i++) {  
                
            const authority = employee.Authority.find(auth => auth.LEVEL_ID === i + 1);
      if (authority) {
          const roleId = authority.ROLE_ID;   

      switch (i) {
        case 0:
          this.onRoleSelectedBody1(1, roleId, employee);
          break;
        case 1:
          this.onRoleSelectedBody2(2, roleId, employee);
          break;
        case 2:
          this.onRoleSelectedBody3(3, roleId, employee);
          break;
        case 3:
          this.onRoleSelectedBody4(4, roleId, employee);
          break;
        case 4:
          this.onRoleSelectedBody5(5, roleId, employee);
          break;       
      }
    }    
  }  
});   
     this.resetHeaderFields();
     this.extractEmployeeLevels();
     this.maxlevel = this.calculateMaxLevel(this.AuthorityData);
     });   
    
    }  
    calculateMaxLevel(data: any[]): number {
      let maxMaxLevel = 0;
      data.forEach((employee) => {
        if (employee.MAX_LEVEL > maxMaxLevel) {
          maxMaxLevel = employee.MAX_LEVEL;
        }
      });
      return maxMaxLevel;
    }    
   onRoleSelectedHeader1(level: number,selectedRole1:any) { 
    this.selectedAuthorityHeader1=-1; 
    this.selectedRolesH1 = selectedRole1;    
    this.AuthorityData.forEach((employee: any) => {     
        employee.roleByLevel[level-1] = this.selectedRolesH1;
        
        this.onRoleSelectedBody1(1,this.selectedRolesH1,employee); 
    });  
        this.apicall.FetchAuthorityName(this.selectedRolesH1).subscribe((res) => {       
        this.authority1 = res;       
      });     
   
  }
  onRoleSelectedHeader2(level: number,selectedRole2:any) { 
    this.selectedAuthorityHeader2=-1; 
    this.level=level;
    this.selectedRolesH2= selectedRole2;
    this.AuthorityData.forEach((employee: any) => {     
      employee.roleByLevel[level-1] = this.selectedRolesH2;
      this.onRoleSelectedBody2(2,this.selectedRolesH2,employee); 
  });
        this.apicall.FetchAuthorityName(this.selectedRolesH2).subscribe((res) => {       
        this.authority2 = res;        
      });          
  }
  onRoleSelectedHeader3(level: number,selectedRole3:any) {
    this.selectedAuthorityHeader3=-1;   
    this.level=level;
    this.selectedRolesH3 = selectedRole3;
    this.AuthorityData.forEach((employee: any) => {     
      employee.roleByLevel[level-1] = this.selectedRolesH3;
      this.onRoleSelectedBody3(3,this.selectedRolesH3,employee); 
  });  
      this.apicall.FetchAuthorityName(this.selectedRolesH3).subscribe((res) => {       
        this.authority3 = res;        
      });          
  }
  onRoleSelectedHeader4(level: number,selectedRole4:any) {
    this.selectedAuthorityHeader4=-1;  
    this.level=level;
    this.selectedRolesH4 = selectedRole4;
    this.AuthorityData.forEach((employee: any) => {     
      employee.roleByLevel[level-1] = this.selectedRolesH4;
      this.onRoleSelectedBody4(4,this.selectedRolesH4,employee); 
  });      
      this.apicall.FetchAuthorityName(this.selectedRolesH4).subscribe((res) => {       
        this.authority4 = res;      
      });    
  }
  onRoleSelectedHeader5(level: number,selectedRole5:any) { 
    this.selectedAuthorityHeader5=-1;  
    this.level=level;
    this.selectedRolesH5 = selectedRole5;
    this.AuthorityData.forEach((employee: any) => {     
      employee.roleByLevel[level-1] = this.selectedRolesH5;
      this.onRoleSelectedBody5(5,this.selectedRolesH5,employee); 
  });     
      this.apicall.FetchAuthorityName(this.selectedRolesH5).subscribe((res) => {       
        this.authority5 = res;      
      });    
  }
  onAuthoritySelectedHeader1(level:any,selectedAuthority1:any){
    this.level=level;
    this.selectedAuthorityHeader1=selectedAuthority1;
    this.AuthorityData.forEach((employee: any) => {
    employee.authorityByLevel[level-1]=this.selectedAuthorityHeader1;   
  });
  }
  onAuthoritySelectedHeader2(level:any,selectedAuthority1:any){
    this.level=level;
    this.selectedAuthorityHeader2=selectedAuthority1;    
    this.AuthorityData.forEach((employee: any) => {
      employee.authorityByLevel[level-1]=this.selectedAuthorityHeader2;     
    });
  }
  onAuthoritySelectedHeader3(level:any,selectedAuthority1:any){
    this.level=level;
    this.selectedAuthorityHeader3=selectedAuthority1;   
    this.AuthorityData.forEach((employee: any) => {
      employee.authorityByLevel[level-1]=this.selectedAuthorityHeader3;     
    });
  }
  onAuthoritySelectedHeader4(level:any,selectedAuthority1:any){
    this.level=level;
    this.selectedAuthorityHeader4=selectedAuthority1;   
    this.AuthorityData.forEach((employee: any) => {
      employee.authorityByLevel[level-1]=this.selectedAuthorityHeader4;     
    });
  }
  onAuthoritySelectedHeader5(level:any,selectedAuthority1:any){
    this.level=level;
    this.selectedAuthorityHeader5=selectedAuthority1;   
    this.AuthorityData.forEach((employee: any) => {
      employee.authorityByLevel[level-1]=this.selectedAuthorityHeader5;     
    });
  } 
  onRoleSelectedBody1(level: number,selectedRoleb1:any,employee:any) {
     
    employee.authorityByLevel[0]=-1;
    this.selectedRolesbody1 = selectedRoleb1;   
      this.apicall.FetchAuthorityName(this.selectedRolesbody1).subscribe((res) => {      
        employee.authoritybody1 = res;   
        if(this.selectedRolesbody1==6){
          employee.authorityByLevel[0]=employee.LINE_MANAGER;        
         } 
        });  
       
  }
  onRoleSelectedBody2(level: number,selectedRoleb2:any,employee:any) {   
    employee.authorityByLevel[1]=-1;
    this.selectedRolesbody2 = selectedRoleb2; 
        
      this.apicall.FetchAuthorityName(this.selectedRolesbody2).subscribe((res) => {      
        employee.authoritybody2 = res;  
        if(this.selectedRolesbody2==6){
          employee.authorityByLevel[1]=employee.LINE_MANAGER;     
        }    
       });    
  }
  onRoleSelectedBody3(level: number,selectedRoleb3:any,employee:any) {
    employee.authorityByLevel[2]=-1;
    this.level=level;
    this.selectedRolesbody3 = selectedRoleb3;
     
      this.apicall.FetchAuthorityName(this.selectedRolesbody3).subscribe((res) => {      
        employee.authoritybody3 = res; 
        if(this.selectedRolesbody3==6){
          employee.authorityByLevel[2]=employee.LINE_MANAGER;
         }      
       });    
  }
  onRoleSelectedBody4(level: number,selectedRoleb4:any,employee:any) {
    employee.authorityByLevel[3]=-1;
     this.selectedRolesbody4 = selectedRoleb4;
     
      this.apicall.FetchAuthorityName(this.selectedRolesbody4).subscribe((res) => {      
        employee.authoritybody4 = res;    
        if(this.selectedRolesbody4==6){
          employee.authorityByLevel[3]=employee.LINE_MANAGER;    
         }      
       });    
  }
  onRoleSelectedBody5(level: number,selectedRoleb:any,employee:any) {
    employee.authorityByLevel[4]=-1;
     this.selectedRolesbody5 = selectedRoleb;  
      
      this.apicall.FetchAuthorityName(this.selectedRolesbody5).subscribe((res) => {      
        employee.authoritybody5 = res;
        if(this.selectedRolesbody5==6){
          employee.authorityByLevel[4]=employee.LINE_MANAGER;      
         }        
       });    
  }
  onAuthoritySelectedBody1(level:any,selectedAuthority1:any){
    this.level=level;
    this.selectedAuthority1=selectedAuthority1;   
  }
  onAuthoritySelectedBody2(level:any,selectedAuthority2:any){
    this.level=level;
    this.selectedAuthority2=selectedAuthority2;
  }
  onAuthoritySelectedBody3(level:any,selectedAuthority3:any){
    this.level=level;
    this.selectedAuthority3=selectedAuthority3;
  }
  onAuthoritySelectedBody4(level:any,selectedAuthority4:any){
    this.level=level;
    this.selectedAuthority4=selectedAuthority4;
  }
  onAuthoritySelectedBody5(level:any,selectedAuthority5:any){
    this.level=level;
    this.selectedAuthority5=selectedAuthority5;
  }
   onmaxlevelSelected(selectedmaxlevel:any,employee:any){
   employee.maxlevel=selectedmaxlevel;   
   if(employee.maxlevel>employee.maxlevelonload) {
    for(let i=employee.maxlevelonload;i<=employee.maxlevel;i++){
    employee.roleByLevel[i] = [-1];    
    employee.authorityByLevel[i] = [-1];
    }
   }  

   }
   onmaxlevelSelectedHeader(selectedmaxlevel:any){
    this.maxlevelh=selectedmaxlevel;        
    if(this.maxlevelh!=-1){
     this.showmaxlevel=true;
    this.maxlevelBody.setValue(this.maxlevelh);
    } 
    this.AuthorityData.forEach((employee: {
      authorityByLevel: any;
      roleByLevel: any;
      maxlevelonload: number; MAX_LEVEL: number; Authority: any[]; 
}) => {
     employee.maxlevelonload=  employee.MAX_LEVEL; 
    if(this.maxlevelh>employee.maxlevelonload) {
      for(let i=employee.maxlevelonload;i<=this.maxlevelh;i++){
      employee.roleByLevel[i] = [-1];    
      employee.authorityByLevel[i] = [-1];
      }
     }  
    });
  }    
  toggleRoleAndAuthority() {   
    this.showRoleAndAuthority = !this.showRoleAndAuthority;   
    this.showmaxlevel=false;
    if(!this.showRoleAndAuthority){
      this.resetHeaderFields();
    }
  }
  resetHeaderFields() {
    this.maxlevelh = -1; 
    this.selectedRolesH1 = -1; 
    this.selectedRolesH2 = -1; 
    this.selectedRolesH3 = -1; 
    this.selectedRolesH4 = -1; 
    this.selectedRolesH5 = -1; 
    this.selectedAuthorityHeader1 = -1;
    this.selectedAuthorityHeader2 = -1;
    this.selectedAuthorityHeader3 = -1;
    this.selectedAuthorityHeader4 = -1;
    this.selectedAuthorityHeader5 = -1;  
  }
  load(selectedCompanyid:any,selectedfunctionality:any,selectedDept:any,selectedStatus:any,currentPage:any){
    const checkbox = document.getElementById(
      'checkbox',
    ) as HTMLInputElement | null;
    
    if (checkbox != null) {
      
       checkbox.checked = false;
    }
    this.showRoleAndAuthority=false;
    const defaultRole = -1;
    const defaultAuthority = -1;
    const data={
      company:selectedCompanyid,
      department:selectedDept,
      functionality:selectedfunctionality,
      status:selectedStatus,
      user:this.empcode
    }   
    //alert(JSON.stringify(data))
    this.apicall.FetchAuthorityDetails_Filter(data).subscribe((res) => {       
      this.AuthorityData = res;  
      const maxPageFiltered = Math.ceil(this.AuthorityData.length / this.itemsPerPage);  

        if (this.currentPage > maxPageFiltered) {
          this.currentPage = 1;     
        }   
       
      //alert(JSON.stringify(this.AuthorityData))    
       this.AuthorityData.forEach((employee: { roleByLevel: number[]; authorityByLevel: number[]; }) => {
        employee.roleByLevel = [defaultRole];
        employee.authorityByLevel = [defaultAuthority];
      });
        this.AuthorityData.forEach((employee: {
          maxlevelonload: number; MAX_LEVEL: number; Authority: any[]; 
}) => {
          employee.maxlevelonload=  employee.MAX_LEVEL;   
          for (let i = 0; i < employee.MAX_LEVEL; i++) {    
      const authority = employee.Authority.find(auth => auth.LEVEL_ID === i + 1);
      if (authority) {
           const roleId = authority.ROLE_ID;
           
      switch (i) {
        case 0:
          this.onRoleSelectedBody1(1, roleId, employee);
          break;
        case 1:
          this.onRoleSelectedBody2(2, roleId, employee);
          break;
        case 2:
          this.onRoleSelectedBody3(3, roleId, employee);
          break;
        case 3:
          this.onRoleSelectedBody4(4, roleId, employee);
          break;
        case 4:
          this.onRoleSelectedBody5(5, roleId, employee);
          break;       
      }
    }
    
  }
});   
       this.showmaxlevel=false;
       this.changePage(currentPage);   
       this.resetHeaderFields();
       this.extractEmployeeLevels();
       this.maxlevel = this.calculateMaxLevel(this.AuthorityData);
    });
   } 
   
   save() {    
    interface Authority {
      level_id: number;
      role_id?: number;
      authority_code?: string;
    }
    
    interface EmployeeType {
      MAX_LEVEL: number;
      roleByLevel: (number | undefined)[];
      authorityByLevel: (string | undefined)[];
      EMP_CODE: string ;
    } 
    const allEmployeesData: any[] = [];
   
    
    this.AuthorityData.forEach((employee:EmployeeType) => {
      this.Employee=employee;
     //this.validateRoleAndAuthority(employee);  
    //  if(this.valid){      
      
      if (employee.authorityByLevel.some((authority) => authority !== undefined)) {
      const employeeData = {  
         emp_code:employee.EMP_CODE,           
         Authority: [] as Authority[],
      };
      if(this.showmaxlevel&&this.showRoleAndAuthority){
        for (let level = 1; level <= this.maxlevelBody.value; level++) {
          if (employee.authorityByLevel[level - 1] != "-1" && employee.roleByLevel[level-1]!=-1) { 
            const authority = {
              level_id: level,
              role_id: employee.roleByLevel[level - 1] ,
              authority_code: employee.authorityByLevel[level - 1],              
            };        
            if (authority.role_id !== undefined|| authority.authority_code !== undefined) {
            
              employeeData.Authority.push(authority);
            }   
           
          }
        }
      }
      else{       
      for (let level = 1; level <= employee.MAX_LEVEL; level++) {
        if (employee.authorityByLevel[level - 1] != "-1" && employee.roleByLevel[level-1]!=-1) { 
          const authority = {
            level_id: level,
            role_id: employee.roleByLevel[level - 1] ,
            authority_code: employee.authorityByLevel[level - 1],             
          };   
          if (authority.role_id !== undefined|| authority.authority_code !== undefined) {
            
            employeeData.Authority.push(authority);
          }   
         
        }
      }
    }
    if (employeeData.Authority.length > 0 && employeeData.Authority!=undefined ) {
     
      allEmployeesData.push(employeeData);
      console.log(employeeData) 
    }
    }
  // }
  });  
  
  if (allEmployeesData.length > 0) {
    allEmployeesData.forEach((employeeData) => {
      const maxLevel = Math.max(...employeeData.Authority.map((authority: { level_id: any; }) => authority.level_id));      
      employeeData.maxLevel = maxLevel;
  });
    const requestData = {
      functionality:this.selectedfunctionality,
      updated_by:this.empcode,      
      authority: allEmployeesData
    };
  
     console.log(JSON.stringify(requestData))
     //if(this.valid){
    this.apicall.AddApproveLevel(requestData).subscribe((res) => {
      if(res.Errorid==1){      
       
              this.showModal = 1;
              this.success='Changes saved successfully!';               
            }
            else{
                this.showModal = 2; 
                this.failed='Failed!';     
            }    
                  
    });  
  
  //}
  }
  
  }
  validateRoleAndAuthority(employee: any) {
    this.Employee=employee;
    // alert(JSON.stringify(this.Employee))
    const maxLevel = this.showmaxlevel&&this.showRoleAndAuthority ? this.maxlevelBody.value : employee.MAX_LEVEL;
    //alert(maxLevel)
    
    for (let i = 0; i < maxLevel; i++) {
      if (employee.roleByLevel[i] == -1 || employee.authorityByLevel[i] == -1) {
        //this.showmessage[i]=true;
        this.showModal=2;
        this.failed="Please select an option!";
        //alert(this.message)
        this.valid=false;
      }
      else
      {
        // this.showmessage[i]=false;
        // this.message[i]='';
        this.valid=true;
      }
    }
    
  }
  
    
   isMaxLevelZero(employee: any): boolean {
    this.Employee=employee;
    this.empmaxlevel=employee.maxlevel;
    //alert(this.Employee)
    if(this.showmaxlevel){
      return false;
    }
    else{
    return employee.MAX_LEVEL === 6;
    }
  }
// Function to select an employee for editing
selectEmployeeForEditing(employee: any) {
  this.selectedEmployee = employee; 
} 
  // function to extract the data by levels for each employee
  extractEmployeeLevels() {
    if (this.AuthorityData) {
      this.AuthorityData.forEach((employee: { MAX_LEVEL: number; Authority: any[]; roleByLevel: any[]; authorityByLevel: any[]; }) => {
        for (let level = 1; level <= employee.MAX_LEVEL; level++) {
          const authorityForLevel = employee.Authority.find((auth: { LEVEL_ID: number; }) => auth.LEVEL_ID === level);
          if (authorityForLevel) {
            employee.roleByLevel[level - 1] = authorityForLevel.ROLE_ID;               
            employee.authorityByLevel[level - 1] = authorityForLevel.AUTHORITY;
            } 
          else {            
            employee.roleByLevel[level - 1] = -1;
            employee.authorityByLevel[level - 1] = -1;
          }
        }
      });
    }
  } 



trackByFunction(index: number, item: any): number {
  return item.employee; 
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
const totalResults = this.AuthorityData.filter((employee: any) => {
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

const filteredData = this.AuthorityData.filter((employee: any) =>
  Object.values(employee).some((value: any) =>
    typeof value === 'string' &&
    value.toLowerCase().startsWith(this.searchInput.toLowerCase())
  )
);

const start = (this.currentPage - 1) * this.itemsPerPage + 1;
return Math.min(start, filteredData.length);
}


getEntriesEnd(): number {  
const filteredData = this.AuthorityData.filter((employee: any) =>
  Object.values(employee).some((value: any) =>
    typeof value === 'string' &&
    value.toLowerCase().startsWith(this.searchInput.toLowerCase())
  )
);
const end = this.currentPage * this.itemsPerPage;
return Math.min(end, filteredData.length);
}
}

  
  
  



 

   

