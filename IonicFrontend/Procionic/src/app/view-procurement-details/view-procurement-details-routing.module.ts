import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewProcurementDetailsPage } from './view-procurement-details.page';

const routes: Routes = [
  {
    path: '',
    component: ViewProcurementDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewProcurementDetailsPageRoutingModule {}
