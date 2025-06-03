import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  
  title = 'bookstore';
  searchQuery: string = '';
  currentUser: any = null;
  isLoggedIn = false;


  constructor(private router: Router, private userService: UserService) { }

  ngOnInit(): void {
    this.userService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  onSearch(): void {
    this.router.navigate(['/search'], { queryParams: { q: this.searchQuery.trim() } });
  }

  logout(): void {
    this.userService.logout();
    this.router.navigate(['/']);
  }

}
