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
import { CreateDepartmentComponent } from './create-department/create-department/create-department.component';
import { DeleteDepartmentComponent } from './delete-department/delete-department/delete-department.component';
import { EditDepartmentComponent } from './edit-department/edit-department/edit-department.component';
import { ViewDepartmentComponent } from './view-department/view-department/view-department.component';
import { CreateBranchComponent } from './create-branch/create-branch/create-branch.component';
import { DeleteBranchComponent } from './delete-branch/delete-branch/delete-branch.component';
import { EditBranchComponent } from './edit-branch/edit-branch/edit-branch.component';
import { ViewBranchComponent } from './view-branch/view-branch/view-branch.component';


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
  },
  {
    path: 'ViewDepartment',
    component: ViewDepartmentComponent
  },
  {
    path: 'CreateDepartment',
    component: CreateDepartmentComponent
  },
  {
    path: 'DeleteDepartment',
    component: DeleteDepartmentComponent
  },
  {
    path: 'EditDepartment/:department_ID',
    component: EditDepartmentComponent
  },
  {
    path: 'ViewBranch',
    component: ViewBranchComponent
  },
  {
    path: 'CreateBranch',
    component: CreateBranchComponent
  },
  {
    path: 'DeleteBranch',
    component: DeleteBranchComponent
  },
  {
    path: 'EditBranch/:branch_ID',
    component: EditBranchComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
