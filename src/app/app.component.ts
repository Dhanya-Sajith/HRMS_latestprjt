import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from './login.service';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'MTC_UI';   
  constructor(private router: Router,private loginService: LoginService) {}
  isLoginPage(): boolean {
      return this.router.url === '/'; 
    }
    ngOnInit(): void {
      // Reset session timeout timer on user activity
      document.addEventListener('mousemove', () => this.loginService.resetSessionTimer());
      document.addEventListener('keypress', () => this.loginService.resetSessionTimer());
      
    }
}

