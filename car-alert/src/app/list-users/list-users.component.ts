import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { User } from '../User';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-list-users',
  templateUrl: './list-users.component.html',
  styleUrls: ['./list-users.component.css']
})
export class ListUsersComponent implements OnInit {
  users: User[] | undefined;
  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.userService.findAll().subscribe(users => this.users = users, err => console.log(err));
  }
  deleteUser(user: User) {
    if (confirm('Are you sure to delete ' + user.username)) {
      this.userService.remove(user._id).subscribe(() => this.userService.findAll().subscribe(users => this.users = users));
    }
  }
}
