import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private timeoutMinutes: number = 30;
  private timeoutTimer: any;
  private timeoutSubject: Subject<void> = new Subject<void>();

  message!: string;
  
  constructor() { }
  private userSession: any;
  setUserSession(id: any,empcode:string,name:string,companycode:string,desig:any,email:string,dept:any,level:string,authorityflg:any,otaccess:any,gradeid:any,grpname:any,profilepic:any) {
    this.userSession = {
      id: id,
      empcode: empcode,
      name: name,
      companycode:companycode,
      desig:desig,
      email:email,
      dept:dept,
      level:level,
      authorityflg:authorityflg,
      otaccess:otaccess,
      gradeid:gradeid,
      grpname:grpname,
      profilepic:profilepic
    }; 
    sessionStorage.setItem('USER_SESSION', JSON.stringify(this.userSession));
    this.startSessionTimer();
  }
   // Start session timeout timer
   private startSessionTimer(): void {
    this.timeoutTimer = setTimeout(() => {
      this.timeoutSubject.next();
    }, this.timeoutMinutes * 60000);
  }

  // Reset session timeout timer
  resetSessionTimer(): void {
    clearTimeout(this.timeoutTimer);
    this.startSessionTimer();
  }

  // Get user session
  getUserSession(): any {
    if (!this.userSession) {
      var userSession = sessionStorage.getItem('USER_SESSION');
    if (userSession) {
      this.userSession = JSON.parse(userSession);
    }
  }
  return this.userSession;
}   

  // Clear user session
  clearUserSession() {
    this.userSession = null;
    sessionStorage.removeItem('USER_SESSION');
    clearTimeout(this.timeoutTimer);
  } 
  setMessage(data: string): void {   
    this.message=data;
  } 
  getMessage(){
    return this.message;
  }
 // Logout user when session timeout occurs
 onTimeout(): Observable<void> {
  return this.timeoutSubject.asObservable();
}
}