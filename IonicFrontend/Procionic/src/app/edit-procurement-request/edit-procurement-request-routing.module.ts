import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditProcurementRequestPage } from './edit-procurement-request.page';

const routes: Routes = [
  {
    path: '',
    component: EditProcurementRequestPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditProcurementRequestPageRoutingModule {}
