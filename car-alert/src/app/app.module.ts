import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app/app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MapComponent } from './map/map.component';
import { MatFormFieldModule} from '@angular/material/form-field';
import { MatInputModule} from '@angular/material/input';
import { MatGridListModule} from '@angular/material/grid-list';
import { RegisterComponent } from './register/register.component';
import { MatButtonModule } from '@angular/material/button';
import { LoginComponent } from './login/login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatMenuModule} from '@angular/material/menu';
import { MatToolbarModule} from '@angular/material/toolbar';
import { HttpClientModule } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';
import {
  AuthGuardService as AuthGuard
} from './authguard.service';
import {JwtModule} from '@auth0/angular-jwt';
import { AdminComponent } from './admin/admin.component';
import { NavbarComponent } from './navbar/navbar.component';
import { AboutComponent } from './about/about.component';
import { ListUsersComponent } from './list-users/list-users.component';
import { EditUserComponent } from './edit-user/edit-user.component';
import { AddAlertComponent } from './add-alert/add-alert.component';
import { DirectAccessGuard } from './directAccessGuard';
import { AlertInfoComponent } from './alert-info/alert-info.component';
import { AlertDeletedComponent } from './alert-deleted/alert-deleted.component';

export function tokenGetter() {
  return localStorage.getItem('access_token');
}

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    RegisterComponent,
    LoginComponent,
    AdminComponent,
    NavbarComponent,
    AboutComponent,
    ListUsersComponent,
    EditUserComponent,
    AddAlertComponent,
    AlertInfoComponent,
    AlertDeletedComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatInputModule,
    MatGridListModule,
    MatButtonModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MatMenuModule,
    HttpClientModule,
    MatToolbarModule,
    MatIconModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: ['localhost:3000'],
        disallowedRoutes: [],
      },
    }),
  ],
  providers: [AuthGuard, DirectAccessGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
