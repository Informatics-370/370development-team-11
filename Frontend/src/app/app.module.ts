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
import { CreateDepartmentComponent } from './create-department/create-department/create-department.component';
import { DeleteDepartmentComponent } from './delete-department/delete-department/delete-department.component';
import { EditDepartmentComponent } from './edit-department/edit-department/edit-department.component';
import { ViewDepartmentComponent } from './view-department/view-department/view-department.component';
import { ViewBranchComponent } from './view-branch/view-branch/view-branch.component';
import { CreateBranchComponent } from './create-branch/create-branch/create-branch.component';
import { DeleteBranchComponent } from './delete-branch/delete-branch/delete-branch.component';
import { EditBranchComponent } from './edit-branch/edit-branch/edit-branch.component';


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
    CreateDepartmentComponent,
    DeleteDepartmentComponent,
    EditDepartmentComponent,
    ViewDepartmentComponent,
    ViewBranchComponent,
    CreateBranchComponent,
    DeleteBranchComponent,
    EditBranchComponent
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
  ],
  providers: [
    { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: { duration: 2500 } },
    MatExpansionModule,
    
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
