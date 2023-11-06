import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { IonicModule } from '@ionic/angular';

import { ViewProcurementDetailsPageRoutingModule } from './view-procurement-details-routing.module';
import { DataService } from '../DataService/data-service';

import { ViewProcurementDetailsPage } from './view-procurement-details.page';

@NgModule({
  imports: [
    HttpClientModule,
    CommonModule,
    FormsModule,
    IonicModule,
    ViewProcurementDetailsPageRoutingModule
  ],
  declarations: [ViewProcurementDetailsPage],
  providers: [DataService]
})
export class ViewProcurementDetailsPageModule { }
