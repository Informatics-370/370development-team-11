import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'Create',
        loadChildren: () => import('../create-procurement-request/create-procurement-request.module').then(m => m.CreateProcurementRequestPageModule)
      },
      {
        path: 'ViewProcurementRequest',
        loadChildren: () => import('../view-procurement-request/view-procurement-request.module').then(m => m.ViewProcurementRequestPageModule)
      },
      {
        path: 'ViewProcurementDetails',
        loadChildren: () => import('../view-procurement-details/view-procurement-details.module').then(m => m.ViewProcurementDetailsPageModule)
      },
      {
        path: 'Home',
        loadChildren: () => import('../home-page/home-page.module').then(m => m.HomePagePageModule)
      },
      {
        path: 'EditProcurementRequest/:id',
        loadChildren: () => import('../edit-procurement-request/edit-procurement-request.module').then(m => m.EditProcurementRequestPageModule)
      },
      {
        path: '',
        redirectTo: '/Login',
        pathMatch: 'full'
      },
    ]
  },
  {
    path: 'Login',
    loadChildren: () => import('../login-page/login-page.module').then(m => m.LoginPagePageModule)
  },
  {
    path: '',
    redirectTo: '/Login',
    pathMatch: 'full'
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule { }
