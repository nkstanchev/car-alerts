import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { AdminComponent } from './admin/admin.component';
import {
  AuthGuardService as AuthGuard
} from './authguard.service';
import { MapComponent } from './map/map.component';
import { Role } from './User';
import { AboutComponent } from './about/about.component';
import { ListUsersComponent } from './list-users/list-users.component';
import { EditUserComponent } from './edit-user/edit-user.component';
import { AddAlertComponent } from './add-alert/add-alert.component';
import { DirectAccessGuard } from './directAccessGuard';
import { AlertResolverService } from './alert-resolver.service';
import { AlertDeletedComponent } from './alert-deleted/alert-deleted.component';
import { UserResolverService } from './user-resolver.service';


const routes: Routes = [
  { path: '', redirectTo: '/map', pathMatch: 'full' },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'about', component: AboutComponent },
  { path: 'map', component: MapComponent },
  { path: 'alert/add', component: AddAlertComponent, canActivate: [AuthGuard, DirectAccessGuard],
    data: {
      rolesAllowed: [Role.Regular, Role.Admin],
   }},
  { path: 'alert/edit/:id', component: AddAlertComponent, canActivate: [AuthGuard],
    resolve: {
      alert: AlertResolverService
    },
    data: {
      rolesAllowed: [Role.Regular, Role.Admin],
   }},
   { path: 'alert-deleted', component: AlertDeletedComponent, canActivate: [AuthGuard],
    data: {
      rolesAllowed: [Role.Regular, Role.Admin],
   }},
  { path: 'admin', component: AdminComponent, canActivate: [AuthGuard],
    data: {
      rolesAllowed: [Role.Admin],
   }},
  { path: 'admin/users', component: ListUsersComponent, canActivate: [AuthGuard],
    data: {
      rolesAllowed: [Role.Admin],
   }},
  { path: 'admin/user/edit/:id', component: EditUserComponent, canActivate: [AuthGuard],
    data: {
      rolesAllowed: [Role.Admin],
   },
   resolve: {
      user: UserResolverService
    },
   }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
