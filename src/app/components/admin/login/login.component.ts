import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username!: string;
  email!: string;
  password!: string;
  areCredentialsSubmittedValid: boolean = true;


  constructor(private userService: UserService, private router: Router) {}

  login() {
    if (this.userService.login(this.email, this.password) && this.userService.isAdmin()) {
      this.router.navigate(['/admin/dashboard']);
    } else {
      this.areCredentialsSubmittedValid = false;
      // alert('Invalid admin credentials');
    }
  }

  resetValidStatus() {
    this.areCredentialsSubmittedValid = true;
  }

  
  get isSubmissionValid() : boolean {
    return this.areCredentialsSubmittedValid;
  }
  

}
