import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { AlertService } from '../alert.service';
import { Alert } from '../alert.model';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-add-alert',
  templateUrl: './add-alert.component.html',
  styleUrls: ['./add-alert.component.css']
})
export class AddAlertComponent implements OnInit {
  isSubmitted = false;
  isSuccessful = false;
  errorMsg = '';
  addEditForm: FormGroup;
  x: number;
  y: number;
  type: string;
  info: string;
  expected_delay: string;
  price: number;
  speed: number;
  alert: Alert;
  buttonMsg = 'Add alert';
  constructor(private location: Location, private fb: FormBuilder, private alertService: AlertService, private route: ActivatedRoute,
              private authService: AuthService) { }

  ngOnInit(): void {
    this.addEditForm = this.fb.group({
          x: ['', Validators.required],
          y: ['', Validators.required],
          type: ['', Validators.required],
          speed: [''],
          price: [''],
          info: [''],
          expected_delay: ['']
    });
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.buttonMsg = 'Update alert';
        this.route.data.subscribe(data => {
          this.alert = data.alert;
          this.type = this.alert.type;
          console.log(this.alert, data.alert,'alertzz');
          this.addEditForm.patchValue({
              x: this.alert.x,
              y: this.alert.y,
              type: this.alert.type,
              speed: this.alert.speed,
              price: this.alert.price,
              info: this.alert.info,
              expected_delay: this.alert.expected_delay
            });
        });
      } else {
        console.log(this.location.getState(), 'statee');
        const alertData = this.location.getState();
        this.x = alertData['x'];
        this.y = alertData['y'];
        this.type = alertData['type'];
        this.addEditForm.patchValue({
              x: this.x,
              y: this.y,
              type: this.type,
            });
        }
    });
  }
    onSubmit() {

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      console.log(id, 'id is');
      this.isSubmitted = true;
      this.speed = this.addEditFormControl.speed.value;
      this.price = this.addEditFormControl.price.value;
      this.info = this.addEditFormControl.info.value;
      this.expected_delay = this.addEditFormControl.expected_delay.value;
      const alert = new Alert(this.x, this.y, this.type, this.speed, this.price, this.info, this.expected_delay,
      this.authService.currentUserId);
      if (id) {
        alert._id = id;
        this.alertService.update(alert, id).subscribe(u => {
          console.log('Alert update successfull!');
          this.isSuccessful = true;
        },
        err => {
          console.error(err);
          this.isSuccessful = false;
          this.errorMsg = err;
        });
      } else {
        this.alertService.create(alert).subscribe(u => {
          console.log('Alert create successfull!');
          this.isSuccessful = true;
        },
        err => {
          console.error(err);
          this.isSuccessful = false;
          this.errorMsg = err;
        });
      }
    });
  }
  get addEditFormControl() {
    return this.addEditForm.controls;
  }
}
