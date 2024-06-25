import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiCallService } from 'src/app/api-call.service';
import { LoginService } from 'src/app/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-assessment-final',
  templateUrl: './assessment-final.component.html',
  styleUrls: ['./assessment-final.component.scss']
})
export class AssessmentFinalComponent implements OnInit {

  userSession:any = this.session.getUserSession();
  empcode: any=this.userSession.empcode;
  passing_score: any;
  passing_status: any;
  time_taken: any;
  emp_no_of_attempt: any;
  no_of_attempt: any;


  constructor(private router:Router,private route: ActivatedRoute,private session:LoginService,private apicall:ApiCallService) { }

  ngOnInit(): void {

    this.passing_score = localStorage.getItem('passing_score');
    this.passing_status = localStorage.getItem('passing_status');
    this.time_taken = localStorage.getItem('time_taken');
    this.emp_no_of_attempt = localStorage.getItem('emp_no_of_attempt');
    this.no_of_attempt = localStorage.getItem('no_of_attempt');

  }

}
