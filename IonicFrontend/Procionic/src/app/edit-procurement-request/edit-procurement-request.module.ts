import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../DataService/data-service';
import { HttpClientModule } from '@angular/common/http';
import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms';

import { EditProcurementRequestPageRoutingModule } from './edit-procurement-request-routing.module';

import { EditProcurementRequestPage } from './edit-procurement-request.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditProcurementRequestPageRoutingModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  declarations: [EditProcurementRequestPage],
  providers: [DataService]
})
export class EditProcurementRequestPageModule { }
