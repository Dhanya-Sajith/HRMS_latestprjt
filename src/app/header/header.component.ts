import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/login.service';
import { Router } from '@angular/router';
import { ApiCallService } from 'src/app/api-call.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  userSession:any = this.session.getUserSession();
  empcode: any=this.userSession.empcode;

  name: any;
  desig: any;
  desigid: any;
  designame: any;
  message!: string;
  count: any;
  notifications: any;
  isActive:any = true;
  isBtnAcive:any = true;
  noticount: any;

  constructor(private session:LoginService,private route:Router,private apicall:ApiCallService) { }

  ngOnInit(): void {
    this.loadJsFile("assets/styles/js/app.js"); 

    const userSession = this.session.getUserSession();
      if (userSession) {       
       this.name = userSession.name;  
       this.desig = userSession.desig.split('#', 2);       
       this.desigid = this.desig[0];       
       this.designame= this.desig[1];      
    }
    this.NotificationCount();
    // Reset session timeout timer on user activity
    document.addEventListener('mousemove', () => this.session.resetSessionTimer());
    document.addEventListener('keypress', () => this.session.resetSessionTimer());
    // Logout user when session timeout occurs
    this.session.onTimeout().subscribe(() => {
      this.logout();
      this.session.setMessage('Your session has expired! Please login again to continue.');
    });
  }

  logout(): void {  
    
     this.session.clearUserSession();   
     this.message = 'You have logged out!'; 
     this.session.setMessage(this.message); 
     this.route.navigate(['/']);     
     localStorage.clear();   
  }

  public loadJsFile(url:any) {  
    let node = document.createElement('script');  
    node.src = url;  
    node.type = 'text/javascript';  
    document.getElementsByTagName('head')[0].appendChild(node);  
  } 

  NotificationCount(){
    this.apicall.NotViewedNotificationCount(this.empcode).subscribe(res =>{
      this.count=res
   })
  }
  
  UpdateNotifications()
  {
    this.apicall.MarkAsViewed_Notifications(this.empcode,0).subscribe(res =>{
    })
  }

  loadNotifications()
  {
    this.isBtnAcive = false;
    this.isActive = true;
    this.NotificationCount();
    this.apicall.FetchAllNotification(this.empcode).subscribe(res =>{
      this.notifications=res.slice(0, 5);
      this.noticount = this.notifications.length;
   })
   this.UpdateNotifications();
  
  }
  AllNotifications()
  {
    this.isActive = false;
    this.apicall.FetchAllNotification(this.empcode).subscribe(res =>{
      this.notifications=res
      this.noticount = this.notifications.length;
   })
  }
}