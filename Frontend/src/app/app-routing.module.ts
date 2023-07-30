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
import { VendorApproveComponent } from './vendor/vendor-approve/vendor-approve.component';
import { VendorUnofficialVendorlistComponent } from './vendor/vendor-unofficial-vendorlist/vendor-unofficial-vendorlist.component';
import { VendorApprovedAddDetailsComponent } from './vendor/vendor-approved-add-details/vendor-approved-add-details.component';
import { VendorApproveEditComponent } from './vendor/vendor-approve-edit/vendor-approve-edit.component';

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
import { UserProfileComponent } from './User/user-profile/user-profile.component';
import { UserProfileEditComponent } from './User/user-profile-edit/user-profile-edit.component';
import { ViewNotificationHubComponent } from './Notification-Hub/view-notification-hub/view-notification-hub.component';
import { ViewDelegationComponent } from './Delegation/view-delegation/view-delegation.component';
import { ViewHelpComponent } from './view-help/view-help/view-help.component';
import { CreateHelpComponent } from './create-help/create-help/create-help.component';
import { EditHelpComponent } from './edit-help/edit-help/edit-help.component';
import { DeleteHelpComponent } from './delete-help/delete-help/delete-help.component';
import { CreateDelegationComponent } from './Delegation/create-delegation/create-delegation.component';
import { EditDelegationComponent } from './Delegation/edit-delegation/edit-delegation.component';

import { ViewProcurementRequestComponent } from './view-procurement-request/view-procurement-request.component';
import { ViewPendingProcurementRequestComponent } from './view-pending-procurement-request/view-pending-procurement-request.component';
import { UpdatePasswordComponent } from './User/update-password/update-password.component';
import { CreateProcurementRequestComponent } from './create-procurement-request/create-procurement-request.component';
import { PlaceProcurementRequestComponent } from './place-procurement-request/place-procurement-request.component';
import { PlaceProcurementRequestCreateDetailsComponent } from './place-procurement-request-create-details/place-procurement-request-create-details.component';
import { ViewProcurementRequestApprovalComponent } from './view-procurement-request-approval/view-procurement-request-approval.component';
import { ViewFlaggedProcurementRequestComponent } from './view-flagged-procurement-request/view-flagged-procurement-request.component';
import { ViewFlaggedProcurementDetailsComponent } from './view-flagged-procurement-details/view-flagged-procurement-details.component';
import { FinalizeProcurementRequestComponent } from './finalize-procurement-request/finalize-procurement-request.component';
import { FinalizeProcurementRequestCreateComponent } from './finalize-procurement-request-create/finalize-procurement-request-create.component';
import { ViewProcurementDetailsComponent } from './view-procurement-details/view-procurement-details.component';
import { ReceiveProcurementItemComponent } from './receive-procurement-item/receive-procurement-item.component';

import { BackupComponent } from './Settings/backup/backup.component';
import { EditProcurementRequestComponent } from './edit-procurement-request/edit-procurement-request.component';

const routes: Routes = [
  {
    path: "",
    component: LoginComponent
  },
  {
    path: "Home", canActivate: [AuthService],
    component: HomePageComponent
  },
  {

    path: "Profile", canActivate: [AuthService],
    component: UserProfileComponent
  },
  {
    path: "ProfileEdit", canActivate: [AuthService],
    component: UserProfileEditComponent
  },
  {
    path: "ViewEmployee", canActivate: [AuthService],
    component: ViewEmployeeComponent
  },
  {
    path: "AddEmployee", canActivate: [AuthService],
    component: CreateEmployeeComponent
  },
  {
    path: "EditEmp/:uid", canActivate: [AuthService],
    component: EditEmployeeComponent
  },
  {
    path: 'ViewEmpRole', canActivate: [AuthService],
    component: ViewEmployeeRoleComponent
  },
  {
    path: 'AddEmpRole', canActivate: [AuthService],
    component: CreateEmployeeRoleComponent
  },
  {
    path: 'EditEmpRole/:id', canActivate: [AuthService],
    component: EditEmployeeRoleComponent
  },
  {
    path: 'ViewConsumable', canActivate: [AuthService],
    component: ViewConsumableComponent
  },
  {
    path: 'CreateConsumable', canActivate: [AuthService],
    component: CreateConsumableComponent
  },
  {
    path: 'DeleteConsumable', canActivate: [AuthService],
    component: DeleteConsumableComponent
  },
  {
    path: 'EditConsumable/:consumable_ID', canActivate: [AuthService],
    component: EditConsumableComponent
  },
  {
    path: 'ViewConsumableCategory', canActivate: [AuthService],
    component: ViewConsumableCategoryComponent
  },
  {
    path: 'ViewAdmin', canActivate: [AuthService],
    component: ViewAdminComponent
  },
  {
    path: 'AddAdmin', canActivate: [AuthService],
    component: CreateAdminComponent
  },
  {
    path: "EditAdm/:uid", canActivate: [AuthService],
    component: EditAdminComponent
  },
  {
    path: 'EditCategory/:consumable_Category_ID', canActivate: [AuthService],
    component: EditConsumableCategoryComponent
  },
  {
    path: 'CreateCategory', canActivate: [AuthService],
    component: CreateConsumableCategoryComponent
  },
  {
    path: "ViewMandateLimit", canActivate: [AuthService],
    component: ViewMandateLimitComponent
  },
  {
    path: 'AddMandateLimit', canActivate: [AuthService],
    component: CreateMandateLimitComponent
  },
  {
    path: 'EditMandateLimit/:id', canActivate: [AuthService],
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
  { path: 'vendor-approve/:RequestNo', component: VendorApproveComponent },
  { path: 'vendor-unofficial-vendorlist', component: VendorUnofficialVendorlistComponent },
  { path: 'vendor-approved-add-details/:RequestNo/:VendorID', component: VendorApprovedAddDetailsComponent },
  { path: 'vendor-approve-edit/:VendorID', component: VendorApproveEditComponent },
  {
    path: 'ViewDepartment', canActivate: [AuthService],
    component: ViewDepartmentComponent
  },
  {
    path: 'CreateDepartment', canActivate: [AuthService],
    component: CreateDepartmentComponent
  },
  {
    path: 'DeleteDepartment', canActivate: [AuthService],
    component: DeleteDepartmentComponent
  },
  {
    path: 'EditDepartment/:department_ID', canActivate: [AuthService],
    component: EditDepartmentComponent
  },
  {
    path: 'ViewHelp', canActivate: [AuthService],
    component: ViewHelpComponent
  },
  {
    path: 'CreateHelp', canActivate: [AuthService],
    component: CreateHelpComponent
  },
  {
    path: 'DeleteHelp', canActivate: [AuthService],
    component: DeleteHelpComponent
  },
  {
    path: 'EditHelp/:help_ID', canActivate: [AuthService],
    component: EditHelpComponent
  },
  {
    path: 'ViewBranch', canActivate: [AuthService],
    component: ViewBranchComponent
  },
  {
    path: 'CreateBranch', canActivate: [AuthService],
    component: CreateBranchComponent
  },
  {
    path: 'DeleteBranch', canActivate: [AuthService],
    component: DeleteBranchComponent
  },
  {
    path: 'EditBranch/:branch_ID', canActivate: [AuthService],
    component: EditBranchComponent
  },
  {
    path: 'ViewBudgetCategory', canActivate: [AuthService],
    component: ViewBudgetCategoryComponent
  },
  {
    path: 'AddBudgetCategory', canActivate: [AuthService],
    component: CreateBudgetCategoryComponent
  },
  {
    path: 'EditBudgetCategory/:id', canActivate: [AuthService],
    component: EditBudgetCategoryComponent
  },
  {
    path: 'ViewBudgetAllocation', canActivate: [AuthService],
    component: ViewBudgetAllocationComponent
  },
  {
    path: 'AddBudgetAllocation', canActivate: [AuthService],
    component: CreateBudgetAllocationComponent
  },
  {
    path: 'ViewBudgetLines/:id', canActivate: [AuthService],
    component: ViewBudgetLinesComponent
  },
  {
    path: 'AddBudgetLine/:id', canActivate: [AuthService],
    component: CreateBudgetLineComponent
  },
  {
    path: 'EditBudgetLine/:id/:id2', canActivate: [AuthService],
    component: EditBudgetLineComponent
  },
  {
    path: 'EditBudgetAllocation/:id', canActivate: [AuthService],
    component: EditBudgetAllocationComponent
  },
  {
    path: 'NotificationHub', canActivate: [AuthService],
    component: ViewNotificationHubComponent
  },
  {
    path: 'Delegation', canActivate: [AuthService],
    component: ViewDelegationComponent
  },
  {
    path: "AssignDelegation/:uid", canActivate: [AuthService],
    component: CreateDelegationComponent
  },
  {
    path: "EditDelegation/:did", canActivate: [AuthService],
    component: EditDelegationComponent
  },
  {
    path: 'ViewProcurementRequest', canActivate: [AuthService],
    component: ViewProcurementRequestComponent
  },
  {
    path: 'UpdatePassword', canActivate: [AuthService],
    component: UpdatePasswordComponent
  },
  {
    path: "ViewSettings", canActivate: [AuthService],
    component: BackupComponent
  },
  {
    path: 'CreateProcurementRequest', canActivate: [AuthService],
    component: CreateProcurementRequestComponent
  },
  {
    path: 'ViewPendingProcurementRequest', canActivate: [AuthService],
    component: ViewPendingProcurementRequestComponent
  },
  {
    path: 'PlaceProcurementRequest', canActivate: [AuthService],
    component: PlaceProcurementRequestComponent
  },
  {
    path: 'PlaceProcurementRequestCreateDetails/:ProcurementRequestID', canActivate: [AuthService],
    component: PlaceProcurementRequestCreateDetailsComponent
  },
  {
    path: 'ViewProcurementRequestApproval/:ProcurementRequestID', canActivate: [AuthService],
    component: ViewProcurementRequestApprovalComponent
  },
  {
    path: 'ViewFlaggedProcurementRequest', canActivate: [AuthService],
    component: ViewFlaggedProcurementRequestComponent
  },
  {
    path: 'ViewFlaggedProcurementDetails/:ProcurementDetailsID', canActivate: [AuthService],
    component: ViewFlaggedProcurementDetailsComponent
  },
  {


    path: 'EditProcurementRequest/:procurement_Request_ID/:name',
    component: EditProcurementRequestComponent
  },
  {
    path: 'FinalizeProcurementRequest',
    component: FinalizeProcurementRequestComponent
  },
  {
    path: 'FinalizeProcurementRequestCreate/:id',
    component: FinalizeProcurementRequestCreateComponent
  },
  {
    path: 'ViewProcurementDetails',
    component: ViewProcurementDetailsComponent
  },
  {
    path: 'ReceiveProcurementItem/:id',
    component: ReceiveProcurementItemComponent
  }




];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
