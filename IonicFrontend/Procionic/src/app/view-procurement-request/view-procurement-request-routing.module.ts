import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewProcurementRequestPage } from './view-procurement-request.page';

const routes: Routes = [
  {
    path: '',
    component: ViewProcurementRequestPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewProcurementRequestPageRoutingModule {}
