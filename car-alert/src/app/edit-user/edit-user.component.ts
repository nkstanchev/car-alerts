import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { User } from '../User';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit {

  user: User | undefined;
  isSuccessful = false;
  errorMsg = '';
  constructor(private fb: FormBuilder, private userService: UserService, private route: ActivatedRoute,
              private authService: AuthService) { }
  editUserForm = this.fb.group({
    role: ['', [Validators.required]],
  });
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.route.data.subscribe(data => {
          this.user = data.user;
          this.editUserForm.patchValue({
            role: this.user.role,
          });
        });
      }
    });
  }
  onSubmit() {
    this.user.role = this.editUserFormControl.role.value;
    this.user.password = '';
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      console.log(id, 'id is');
      this.userService.update(this.user, id).subscribe(res => {
        console.log(res);
        this.isSuccessful = true;
      },
      err => {
        console.error(err)
        this.isSuccessful = false;
        this.errorMsg = err;
        });
    });
  }
  get editUserFormControl() {
    return this.editUserForm.controls;
  }
  get AuthService() {
    return this.authService;
  }
}
