import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MainNavComponent } from './main-nav/main-nav.component';
import { MaterialModule } from './material/material/material.module';
import { MatToolbar, MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { ViewEmployeeRoleComponent } from './view-employee-role/view-employee-role.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatFormFieldModule, MatHint, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { CreateEmployeeRoleComponent } from './create-employee-role/create-employee-role.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { EditEmployeeRoleComponent } from './edit-employee-role/edit-employee-role.component';
import { DeleteEmployeeRoleComponent } from './delete-employee-role/delete-employee-role.component';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ViewEmployeeComponent } from './view-employee/view-employee.component';
import { CreateEmployeeComponent } from './create-employee/create-employee.component';
import { EditEmployeeComponent } from './edit-employee/edit-employee.component';
import { DeleteEmployeeComponent } from './delete-employee/delete-employee.component';
import { ViewConsumableComponent } from './view-consumable/view-consumable.component';
import { HttpClientModule } from '@angular/common/http';
import { CreateConsumableComponent } from './create-consumable/create-consumable.component';
import { DeleteConsumableComponent } from './delete-consumable/delete-consumable.component';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS, MatSnackBar } from '@angular/material/snack-bar';
import { EditConsumableComponent } from './edit-consumable/edit-consumable.component';
import { NotificationdisplayComponent } from './notificationdisplay/notificationdisplay.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { CreateAdminComponent } from './create-admin/create-admin.component';
import { EditAdminComponent } from './edit-admin/edit-admin.component';
import { DeleteAdminComponent } from './delete-admin/delete-admin.component';
import { ViewAdminComponent } from './view-admin/view-admin.component';
import { ViewConsumableCategoryComponent } from './view-consumable-category/view-consumable-category.component';
import { CreateConsumableCategoryComponent } from './create-consumable-category/create-consumable-category.component';
import { EditConsumableCategoryComponent } from './edit-consumable-category/edit-consumable-category.component';
import { DeleteConsumableCategoryComponent } from './delete-consumable-category/delete-consumable-category.component';
import { ViewMandateLimitComponent } from './view-mandate-limit/view-mandate-limit.component';
import { CreateMandateLimitComponent } from './create-mandate-limit/create-mandate-limit.component';
import { EditMandateLimitComponent } from './edit-mandate-limit/edit-mandate-limit.component';
import { RequestViewComponent } from './onboard_request/request-view/request-view.component';
import { RequestCreateComponent } from './onboard_request/request-create/request-create.component';
import { RequestUpdateComponent } from './onboard_request/request-update/request-update.component';
import { RequestDeleteComponent } from './onboard_request/request-delete/request-delete.component';
import { VendorCreateComponent } from './vendor/vendor-create/vendor-create.component';
import { VendorUpdateComponent } from './vendor/vendor-update/vendor-update.component';
import { VendorViewComponent } from './vendor/vendor-view/vendor-view.component';
import { VendorDeleteComponent } from './vendor/vendor-delete/vendor-delete.component';
import { VendordetailsViewComponent } from './vendor/vendordetails-view/vendordetails-view.component';
import { VendorCreateChoiceComponent } from './vendor/vendor-create-choice/vendor-create-choice.component';
import { VendorApproveComponent } from './vendor/vendor-approve/vendor-approve.component';
import { VendorUnofficialVendorlistComponent } from './vendor/vendor-unofficial-vendorlist/vendor-unofficial-vendorlist.component';
import { VendorApprovedAddDetailsComponent } from './vendor/vendor-approved-add-details/vendor-approved-add-details.component';

import { MatRadioModule } from '@angular/material/radio';
import { MatTabsModule } from '@angular/material/tabs';

import { MatStepperModule } from '@angular/material/stepper';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CreateDepartmentComponent } from './create-department/create-department/create-department.component';
import { DeleteDepartmentComponent } from './delete-department/delete-department/delete-department.component';
import { EditDepartmentComponent } from './edit-department/edit-department/edit-department.component';
import { ViewDepartmentComponent } from './view-department/view-department/view-department.component';
import { ViewBranchComponent } from './view-branch/view-branch/view-branch.component';
import { CreateBranchComponent } from './create-branch/create-branch/create-branch.component';
import { DeleteBranchComponent } from './delete-branch/delete-branch/delete-branch.component';
import { EditBranchComponent } from './edit-branch/edit-branch/edit-branch.component';
import { LoginComponent } from './login/login.component';
import { HomePageComponent } from './home-page/home-page.component';

import { DeleteMandateLimitComponent } from './delete-mandate-limit/delete-mandate-limit.component';
import { ViewBudgetCategoryComponent } from './view-budget-category/view-budget-category.component';
import { CreateBudgetCategoryComponent } from './create-budget-category/create-budget-category.component';
import { EditBudgetCategoryComponent } from './edit-budget-category/edit-budget-category.component';
import { DeleteBudgetCategoryComponent } from './delete-budget-category/delete-budget-category.component';
import { ViewBudgetAllocationComponent } from './view-budget-allocation/view-budget-allocation.component';
import { CreateBudgetAllocationComponent } from './create-budget-allocation/create-budget-allocation.component';
import { DeleteBudgetAllocationComponent } from './delete-budget-allocation/delete-budget-allocation.component';
import { ViewBudgetLinesComponent } from './view-budget-lines/view-budget-lines.component';
import { CreateBudgetLineComponent } from './create-budget-line/create-budget-line.component';
import { EditBudgetLineComponent } from './edit-budget-line/edit-budget-line.component';
import { DeleteBudgetLineComponent } from './delete-budget-line/delete-budget-line.component';
import { EditBudgetAllocationComponent } from './edit-budget-allocation/edit-budget-allocation.component';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { AuthInterceptorComponent } from './auth-interceptor/auth-interceptor.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { UserProfileComponent } from './User/user-profile/user-profile.component';
import { UserProfileEditComponent } from './User/user-profile-edit/user-profile-edit.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import { CropperModalComponent } from './User/cropper-modal/cropper-modal.component';
import { ViewNotificationHubComponent } from './Notification-Hub/view-notification-hub/view-notification-hub.component';
import { ViewDelegationComponent } from './Delegation/view-delegation/view-delegation.component';
import { CreateHelpComponent } from './create-help/create-help/create-help.component';
import { ViewHelpComponent } from './view-help/view-help/view-help.component';
import { EditHelpComponent } from './edit-help/edit-help/edit-help.component';
import { DeleteHelpComponent } from './delete-help/delete-help/delete-help.component';
import { UpdateConsumableStockComponent } from './update-consumable-stock/update-consumable-stock.component';
import { CreateDelegationComponent } from './Delegation/create-delegation/create-delegation.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { DeleteDelegationComponent } from './Delegation/delete-delegation/delete-delegation.component';
import { MatSortModule } from '@angular/material/sort';
import { EditDelegationComponent } from './Delegation/edit-delegation/edit-delegation.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DatePipe } from '@angular/common';
import { RejectDelegationComponent } from './Delegation/reject-delegation/reject-delegation.component';
import { ViewProcurementRequestComponent } from './view-procurement-request/view-procurement-request.component';
import { UpdatePasswordComponent } from './User/update-password/update-password.component';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { VendorApproveEditComponent } from './vendor/vendor-approve-edit/vendor-approve-edit.component';


import { MatBadgeModule } from '@angular/material/badge';

import { VideoDialogComponent } from './VideoDialog/video-dialog/video-dialog.component';
import { BackupComponent } from './Settings/backup/backup.component';
import { RestoreComponent } from './Settings/backupDialog/restore.component';


@NgModule({
  declarations: [
    AppComponent,
    MainNavComponent,
    ViewEmployeeRoleComponent,
    CreateEmployeeRoleComponent,
    EditEmployeeRoleComponent,
    DeleteEmployeeRoleComponent,
    ViewEmployeeComponent,
    CreateEmployeeComponent,
    EditEmployeeComponent,
    DeleteEmployeeComponent,
    ViewConsumableComponent,
    CreateConsumableComponent,
    DeleteConsumableComponent,
    EditConsumableComponent,
    NotificationdisplayComponent,
    CreateAdminComponent,
    EditAdminComponent,
    DeleteAdminComponent,
    ViewAdminComponent,
    ViewConsumableCategoryComponent,
    CreateConsumableCategoryComponent,
    EditConsumableCategoryComponent,
    DeleteConsumableCategoryComponent,
    ViewMandateLimitComponent,
    CreateMandateLimitComponent,
    EditMandateLimitComponent,
    RequestViewComponent,
    RequestCreateComponent,
    RequestUpdateComponent,
    CreateDepartmentComponent,
    DeleteDepartmentComponent,
    EditDepartmentComponent,
    ViewDepartmentComponent,
    ViewBranchComponent,
    CreateBranchComponent,
    DeleteBranchComponent,
    EditBranchComponent,
    RequestDeleteComponent,
    VendorCreateComponent,
    VendorUpdateComponent,
    VendorViewComponent,
    VendorDeleteComponent,
    VendordetailsViewComponent,
    VendorCreateChoiceComponent,
    LoginComponent,
    HomePageComponent,
    DeleteMandateLimitComponent,
    ViewBudgetCategoryComponent,
    CreateBudgetCategoryComponent,
    EditBudgetCategoryComponent,
    DeleteBudgetCategoryComponent,
    ViewBudgetAllocationComponent,
    CreateBudgetAllocationComponent,
    DeleteBudgetAllocationComponent,
    ViewBudgetLinesComponent,
    CreateBudgetLineComponent,
    EditBudgetLineComponent,
    DeleteBudgetLineComponent,
    EditBudgetAllocationComponent,
    VendorApproveComponent,
    VendorUnofficialVendorlistComponent,
    VendorApprovedAddDetailsComponent,
    AuthInterceptorComponent,
    UserProfileComponent,
    UserProfileEditComponent,
    CropperModalComponent,
    ViewNotificationHubComponent,
    ViewDelegationComponent,
    CreateHelpComponent,
    ViewHelpComponent,
    EditHelpComponent,
    DeleteHelpComponent,
    UpdateConsumableStockComponent,
    CreateDelegationComponent,
    DeleteDelegationComponent,
    EditDelegationComponent,
    RejectDelegationComponent,
    UpdateConsumableStockComponent,
    ViewProcurementRequestComponent,
    UpdatePasswordComponent,
    VendorApproveEditComponent,
    VideoDialogComponent,
    BackupComponent,
    RestoreComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatMenuModule,
    ReactiveFormsModule,
    FormsModule,
    AppRoutingModule,
    MatCardModule,
    MatDialogModule,
    MaterialModule,
    HttpClientModule,
    MatRadioModule,
    MatTabsModule,
    MatStepperModule,
    MatCheckboxModule,
    MatPaginatorModule,
    ImageCropperModule,
    MatAutocompleteModule,
    MatSortModule,
    MatTooltipModule,
    MatDatepickerModule,
    MatBadgeModule
  ],
  providers: [
    { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: { duration: 2500 } },
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    MatExpansionModule,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorComponent, // Add the AuthInterceptor as a provider
      multi: true
    },
    DatePipe

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
