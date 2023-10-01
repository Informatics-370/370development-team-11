import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../DataService/data-service';
import { AuthService } from '../DataService/AuthService';
import { HttpClientModule } from '@angular/common/http';
import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms';
import { Storage } from '@ionic/storage-angular'; // Ionic storage for session management

import { LoginPagePageRoutingModule } from './login-page-routing.module';

import { LoginPagePage } from './login-page.page';

@NgModule({
  imports: [
    ReactiveFormsModule,
    HttpClientModule,
    CommonModule,
    FormsModule,
    IonicModule,
    LoginPagePageRoutingModule
  ],
  declarations: [LoginPagePage],
  providers: [DataService, AuthService, Storage]
})
export class LoginPagePageModule { }
