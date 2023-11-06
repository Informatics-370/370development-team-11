import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreateProcurementRequestPage } from './create-procurement-request.page';

const routes: Routes = [
  {
    path: '',
    component: CreateProcurementRequestPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreateProcurementRequestPageRoutingModule {}
