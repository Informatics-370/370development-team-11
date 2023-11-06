import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../DataService/data-service';
import { HttpClient, HttpClientModule } from '@angular/common/http';

import { IonicModule } from '@ionic/angular';

import { CreateProcurementRequestPageRoutingModule } from './create-procurement-request-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { CreateProcurementRequestPage } from './create-procurement-request.page';

@NgModule({
  imports: [
    HttpClientModule,
    CommonModule,
    FormsModule,
    IonicModule,
    CreateProcurementRequestPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [CreateProcurementRequestPage],
  providers: [DataService]
})
export class CreateProcurementRequestPageModule { }
