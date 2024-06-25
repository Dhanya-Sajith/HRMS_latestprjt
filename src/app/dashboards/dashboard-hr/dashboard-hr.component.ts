import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/login.service';


@Component({
  selector: 'app-dashboard-hr',
  templateUrl: './dashboard-hr.component.html',
  styleUrls: ['./dashboard-hr.component.scss']
})
export class DashboardHrComponent implements OnInit {
  id: any;
  name: any;
  empcode: any;
  companycode: any;
  desig: any;
  email: any;
  dept: any;
  level: any;

  constructor(private session:LoginService) { }

  ngOnInit(): void {
    const userSession = this.session.getUserSession();
      if (userSession) {
       this.id = userSession.id;
       this.empcode = userSession.empcode;
       this.name = userSession.name;   
       this.companycode = userSession.companycode;
       this.desig = userSession.desig;
       this.email = userSession.email;
       this.dept = userSession.dept;
       this.level = userSession.level;   
    }
  
   }

   
}

