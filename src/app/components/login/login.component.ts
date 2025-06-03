import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username!: string;
  password!: string;
  errorMessage!: string;

  constructor(private userService: UserService, private router: Router) {}

  login(): void {
    if (this.userService.login(this.username, this.password)) {
      this.router.navigate(['/']);
    } else {
      this.errorMessage = 'Invalid username or password';
    }
  }
  
}
