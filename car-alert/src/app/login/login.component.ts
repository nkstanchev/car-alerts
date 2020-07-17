import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { User } from '../User';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isSubmitted = false;
  isSuccessful = false;
  errorMsg = '';
  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }
  onSubmit() {
    this.isSubmitted = true;
    const user = new User(this.loginForm.controls.username.value,
      this.loginForm.controls.password.value, '');

    this.authService.login(user).subscribe(u => {
      console.log('User registration successfull!');
      this.isSuccessful = true;
      this.router.navigate(['/map']);
    },
    err => {
      console.error(err);
      this.isSuccessful = false;
      this.errorMsg = err;
      this.loginForm.reset();
      });
  }
}
