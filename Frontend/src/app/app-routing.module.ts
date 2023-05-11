import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateEmployeeRoleComponent } from './create-employee-role/create-employee-role.component';
import { CreateEmployeeComponent } from './create-employee/create-employee.component';
import { EditEmployeeRoleComponent } from './edit-employee-role/edit-employee-role.component';
import { EditEmployeeComponent } from './edit-employee/edit-employee.component';
import { ViewEmployeeRoleComponent } from './view-employee-role/view-employee-role.component';
import { ViewEmployeeComponent } from './view-employee/view-employee.component';
import { ViewConsumableComponent } from './view-consumable/view-consumable.component';
import { CreateConsumableComponent } from './create-consumable/create-consumable.component';
import { DeleteConsumableComponent } from './delete-consumable/delete-consumable.component';
import { EditConsumableComponent } from './edit-consumable/edit-consumable.component';
import { CreateAdminComponent } from './create-admin/create-admin.component';
import { EditAdminComponent } from './edit-admin/edit-admin.component';
import { ViewAdminComponent } from './view-admin/view-admin.component';

const routes: Routes = [
  {
    path: "ViewEmployee",
    component: ViewEmployeeComponent
  },
  {
    path: "AddEmployee",
    component: CreateEmployeeComponent
  },
  {
    path: "EditEmp/:uid",
    component: EditEmployeeComponent
  },
  {
    path: 'ViewEmpRole',
    component: ViewEmployeeRoleComponent
  },
  {
    path: 'AddEmpRole',
    component: CreateEmployeeRoleComponent
  },
  {
    path: 'EditEmpRole/:id',
    component: EditEmployeeRoleComponent
  },
  {
    path: 'ViewConsumable',
    component: ViewConsumableComponent
  },
  {
    path: 'CreateConsumable',
    component: CreateConsumableComponent
  },
  {
    path: 'DeleteConsumable',
    component: DeleteConsumableComponent
  },
  {
    path: 'EditConsumable/:consumable_ID',
    component: EditConsumableComponent
  },
  {
    path: 'ViewAdmin',
    component: ViewAdminComponent
  },
  {
    path: 'AddAdmin',
    component: CreateAdminComponent
  },
  {
    path: "EditAdm/:uid",
    component: EditAdminComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
