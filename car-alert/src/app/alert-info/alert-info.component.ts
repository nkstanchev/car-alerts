import { Component, OnInit, Input } from '@angular/core';
import { Alert } from '../alert.model';
import { AuthService } from '../auth.service';
import { Role } from '../User';
import { AlertService } from '../alert.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-alert-info',
  templateUrl: './alert-info.component.html',
  styleUrls: ['./alert-info.component.css']
})
export class AlertInfoComponent implements OnInit {
  @Input() alert: Alert;
  header: string;
  xyStr: string;
  adminRole: Role;
  constructor(private authService: AuthService, private alertService: AlertService, private router: Router) { }

  ngOnInit(): void {
    if (this.alert.type === 'camera') {
      this.header = 'Speed Camera';
    } else if (this.alert.type === 'toll') {
      this.header = 'Toll';
    } else if (this.alert.type === 'accident') {
      this.header = 'Car Accident';
    } else if (this.alert.type === 'jam') {
      this.header = 'Traffic Jam';
    }
    this.xyStr = this.alert.x + ', ' + this.alert.y;
  }
  deleteAlert() {
    console.log('deletin alert');
    this.alertService.remove(this.alert._id).subscribe(res => {
      this.router.navigate(['/alert-deleted']);
    });
  }
  get AuthService() {
    return this.authService;
  }
}
