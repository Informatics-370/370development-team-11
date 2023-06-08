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
import { ViewConsumableCategoryComponent } from './view-consumable-category/view-consumable-category.component';
import { CreateConsumableCategoryComponent } from './create-consumable-category/create-consumable-category.component';
import { EditConsumableCategoryComponent } from './edit-consumable-category/edit-consumable-category.component';
import { ViewMandateLimitComponent } from './view-mandate-limit/view-mandate-limit.component';
import { CreateMandateLimitComponent } from './create-mandate-limit/create-mandate-limit.component';
import { EditMandateLimitComponent } from './edit-mandate-limit/edit-mandate-limit.component';

import { RequestDeleteComponent } from './onboard_request/request-delete/request-delete.component';
import { RequestViewComponent } from './onboard_request/request-view/request-view.component';
import { RequestCreateComponent } from './onboard_request/request-create/request-create.component';
import { RequestUpdateComponent } from './onboard_request/request-update/request-update.component';

import { VendorViewComponent } from './vendor/vendor-view/vendor-view.component';
import { VendorCreateComponent } from './vendor/vendor-create/vendor-create.component';
import { VendorUpdateComponent } from './vendor/vendor-update/vendor-update.component';
import { VendorDeleteComponent } from './vendor/vendor-delete/vendor-delete.component';
import { VendordetailsViewComponent } from './vendor/vendordetails-view/vendordetails-view.component';
import { VendorCreateChoiceComponent } from './vendor/vendor-create-choice/vendor-create-choice.component'

import { CreateDepartmentComponent } from './create-department/create-department/create-department.component';
import { DeleteDepartmentComponent } from './delete-department/delete-department/delete-department.component';
import { EditDepartmentComponent } from './edit-department/edit-department/edit-department.component';
import { ViewDepartmentComponent } from './view-department/view-department/view-department.component';
import { CreateBranchComponent } from './create-branch/create-branch/create-branch.component';
import { DeleteBranchComponent } from './delete-branch/delete-branch/delete-branch.component';
import { EditBranchComponent } from './edit-branch/edit-branch/edit-branch.component';
import { ViewBranchComponent } from './view-branch/view-branch/view-branch.component';
import { LoginComponent } from './login/login.component';
import { HomePageComponent } from './home-page/home-page.component';
import { ViewBudgetCategoryComponent } from './view-budget-category/view-budget-category.component';
import { CreateBudgetCategoryComponent } from './create-budget-category/create-budget-category.component';
import { EditBudgetCategoryComponent } from './edit-budget-category/edit-budget-category.component';
import { ViewBudgetAllocationComponent } from './view-budget-allocation/view-budget-allocation.component';
import { CreateBudgetAllocationComponent } from './create-budget-allocation/create-budget-allocation.component';
import { ViewBudgetLinesComponent } from './view-budget-lines/view-budget-lines.component';
import { CreateBudgetLineComponent } from './create-budget-line/create-budget-line.component';
import { EditBudgetLineComponent } from './edit-budget-line/edit-budget-line.component';
import { EditBudgetAllocationComponent } from './edit-budget-allocation/edit-budget-allocation.component';
import { AuthService } from './DataService/AuthService';


const routes: Routes = [
  {
    path: "",
    component: LoginComponent
  },
  {
    path: "Home",
    component: HomePageComponent
  },
  {
    path: "ViewEmployee", canActivate: [AuthService],
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
    path: 'ViewConsumableCategory',
    component: ViewConsumableCategoryComponent
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
    path: 'EditCategory/:consumable_Category_ID',
    component: EditConsumableCategoryComponent
  },
  {
    path: 'CreateCategory',
    component: CreateConsumableCategoryComponent
  },
  {
    path: "ViewMandateLimit",
    component: ViewMandateLimitComponent
  },
  {
    path: 'AddMandateLimit',
    component: CreateMandateLimitComponent
  },
  {
    path: 'EditMandateLimit/:id',
    component: EditMandateLimitComponent
  },
  { path: 'request-view', component: RequestViewComponent },
  { path: 'request-create/:RequestNo', component: RequestCreateComponent },
  { path: 'request-update/:RequestNo', component: RequestUpdateComponent },
  { path: 'request-delete', component: RequestDeleteComponent },
  { path: 'vendor-view', component: VendorViewComponent },
  { path: 'vendor-create/:VendorID', component: VendorCreateComponent },
  { path: 'vendor-update/:VendorID', component: VendorUpdateComponent },
  { path: 'vendor-delete', component: VendorDeleteComponent },
  { path: 'vendororderdetails-view/:VendorID', component: VendordetailsViewComponent },
  { path: 'vendor-create-choice', component: VendorCreateChoiceComponent },
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
  {
    path: 'ViewBudgetCategory',
    component: ViewBudgetCategoryComponent
  },
  {
    path: 'AddBudgetCategory',
    component: CreateBudgetCategoryComponent
  },
  {
    path: 'EditBudgetCategory/:id',
    component: EditBudgetCategoryComponent
  },
  {
    path: 'ViewBudgetAllocation',
    component: ViewBudgetAllocationComponent
  },
  {
    path: 'AddBudgetAllocation',
    component: CreateBudgetAllocationComponent
  },
  {
    path: 'ViewBudgetLines/:id',
    component: ViewBudgetLinesComponent
  },
  {
    path: 'AddBudgetLine/:id',
    component: CreateBudgetLineComponent
  },
  {
    path: 'EditBudgetLine/:id/:id2',
    component: EditBudgetLineComponent
  },
  {
    path: 'EditBudgetAllocation/:id',
    component: EditBudgetAllocationComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
