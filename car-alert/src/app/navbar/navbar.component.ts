import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Role } from '../User';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  adminRole: Role = Role.Admin;
  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
  }
  get AuthService() {
    return this.authService;
  }
  logout() {
    console.log('logging out');
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
