import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';
import { UserService } from '../user.service';
import { User } from '../User';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  isSubmitted = false;
  isSuccessful = false;
  errorMsg = '';
  constructor(private fb: FormBuilder, private userService: UserService) { }
  public static matchValues(
    matchTo: string // name of the control to match to
  ): (AbstractControl) => ValidationErrors | null {
    return (control: AbstractControl): ValidationErrors | null => {
      return !!control.parent &&
        !!control.parent.value &&
        control.value === control.parent.controls[matchTo].value
        ? null
        : { notSame: true };
    };
  }
  ngOnInit(): void {
    this.registerForm = this.fb.group({
      email: ['', [Validators.email, Validators.required]],
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [RegisterComponent.matchValues('password')]]
    });
    this.registerForm.controls.password.valueChanges.subscribe(() => {
      this.registerForm.controls.confirmPassword.updateValueAndValidity();
    });
  }
  get registerFormControl() {
    return this.registerForm.controls;
  }
  onSubmit() {
    this.isSubmitted = true;
    const user = new User(this.registerForm.controls.username.value, 
      this.registerForm.controls.password.value, this.registerForm.controls.email.value)
    this.userService.create(user).subscribe(u => {
      console.log('User registration successfull!');
      this.isSuccessful = true;
    },
    err => {
      console.error(err)
      this.isSuccessful = false;
      this.errorMsg = err;
      this.registerForm.reset();
      });
  }
}
