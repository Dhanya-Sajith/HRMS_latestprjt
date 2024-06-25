import { Component, OnInit } from '@angular/core';
import { ApiCallService } from 'src/app/api-call.service';
import { LoginService } from 'src/app/login.service';
import { Router } from '@angular/router';
import { Renderer2, ElementRef } from '@angular/core';

@Component({
  selector: 'app-sidemenu',
  templateUrl: './sidemenu.component.html',
  styleUrls: ['./sidemenu.component.scss']
})

export class SidemenuComponent implements OnInit {
  
  userSession:any = this.session.getUserSession();
  empcode: any=this.userSession.empcode;
  desig:any=this.userSession.desig.split('#', 2);       
  level:any=this.userSession.level;   
  designame:any= this.desig[1]; 
  ename:any=this.userSession.name;
  otaccess:any = this.userSession.otaccess;
  authorityflg:any =this.userSession.authorityflg;
  profilepic:any=this.userSession.profilepic;
  selectedMenu: any = localStorage.getItem('selectedMenu');
  sidemenus: any;
  selectedRootMenu:any=localStorage.getItem('selectedRootMenu');
  selectedSubRootMenu:any=localStorage.getItem('selectedRootSubMenu');

  hostname:any=this.apicall.dotnetapi;


  constructor(private session:LoginService,private apicall:ApiCallService,private route:Router,private renderer: Renderer2, private el: ElementRef) { }

  ngOnInit(): void {
    this.apicall.FetchMenus(this.level).subscribe((res)=>{
      // console.log(JSON.stringify(res)) 
    // alert('onload')
      this.sidemenus = res;
     // alert(this.selectedRootMenu)
      //alert(res.length)
     // alert(JSON.stringify(this.sidemenus))
       // this.keep();
       // alert(ctrls.length)
     // alert(ctrl.innerHTML)
     // ctrl.click();
      //alert(ctrl)
      // const ctrl = <HTMLLIElement>document.getElementById(this.selectedRootMenu)
      // alert(ctrl)
      // ctrl.style.display='inline';
      // ctrl.style.backgroundColor='red'
      
    })
    let rootmenu:any;
    rootmenu=localStorage.getItem('selectedRootMenu');
    this.selectedRootMenu=rootmenu;
    
    
     //  alert(this.selectedRootMenu)
    // this.session.selectedMenu$.subscribe((menu) => {
    //   this.selectedMenu = menu;
    // });
 // alert(ctrl)
  
    const storedMenu = localStorage.getItem('selectedMenu');
    if (storedMenu) {
      this.selectedMenu = storedMenu;
    }
  }

  // ngAfterViewInit() {
  //   //***Your code here***
  //   //alert(this.selectedRootMenu)
    
  //  // alert(this.selectedMenu)
  //  // let menupath='http://localhost:4200/'+this.selectedMenuUrl+this.selectedRootMenu;
  //   let ctrl = <HTMLAnchorElement>document.getElementById(this.selectedRootMenu);
  //   // alert(ctrl)
  //     //alert(menupath)
  //     ctrl.click();
  // //     let ctrl = this.el.nativeElement.querySelector(`#{this.selectedRootMenu}`);
  // //      alert(ctrl)

  // // if (ctrl) {
  // //   this.renderer.setStyle(ctrl, 'display', 'inline');
  // //   this.renderer.setStyle(ctrl, 'backgroundColor', 'red');
  // // }
  //     //ctrl.style.backgroundColor='red'
  //  // alert('completed')
  //  if (this.selectedRootMenu) {
  //   this.route.navigate([this.selectedMenuUrl, this.selectedRootMenu]);
  // }
  // }
  // keep(kk:any)
  // {
  //   alert(kk)
  //  // kk.click();
  //  // const ctrl = <HTMLAnchorElement>document.getElementById(this.selectedRootMenu)
  //  // ctrla.ariaExpanded='true';
  //  //alert(ctrl)
  //   //const ctrlside = <HTMLLIElement>document.getElementById('sidebarDashboards'+this.selectedRootMenu)
  //   //ctrl.setAttribute("href",'#'+kk);
  //  // ctrl.click();
  //  // ctrla.setAttribute("data-bs-toggle","collapse")
  //   //alert(this.selectedRootMenu)
  // }

  // Fetchsidemenus(){
  //   this.apicall.FetchMenus(this.level).subscribe((res)=>{
  //     //alert(JSON.stringify(res)) 
  //     this.sidemenus = res;
  //   })
  // }

  selectMenu(menu: any,menuid:any,submenu:any) {
  //  alert(slno+menuid)
    console.log('Selected Menu:', menu);
    this.selectedMenu = menu;
  
   
    localStorage.setItem('selectedRootSubMenu', submenu);
    localStorage.setItem('selectedMenu', menu);
    localStorage.setItem('selectedRootMenu', menuid);
  
  }

  HomeMenu(){
    localStorage.removeItem('selectedRootSubMenu')
    localStorage.removeItem('selectedMenu')
    localStorage.removeItem('selectedRootMenu')
  }

}
