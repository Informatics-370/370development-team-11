import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { IonicModule } from '@ionic/angular';
import { ViewProcurementRequestPageRoutingModule } from './view-procurement-request-routing.module';
import { DataService } from '../DataService/data-service';

import { ViewProcurementRequestPage } from './view-procurement-request.page';

@NgModule({
  imports: [
    HttpClientModule,
    CommonModule,
    FormsModule,
    IonicModule,
    ViewProcurementRequestPageRoutingModule
  ],
  declarations: [ViewProcurementRequestPage],
  providers: [DataService]
})
export class ViewProcurementRequestPageModule { }
