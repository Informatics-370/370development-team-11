import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'create-procurement-request',
    loadChildren: () => import('./create-procurement-request/create-procurement-request.module').then(m => m.CreateProcurementRequestPageModule)
  },
  {
    path: 'view-procurement-request',
    loadChildren: () => import('./view-procurement-request/view-procurement-request.module').then(m => m.ViewProcurementRequestPageModule)
  },
  {
    path: 'view-procurement-details',
    loadChildren: () => import('./view-procurement-details/view-procurement-details.module').then(m => m.ViewProcurementDetailsPageModule)
  },
  {
    path: 'home-page',
    loadChildren: () => import('./home-page/home-page.module').then(m => m.HomePagePageModule)
  },
  {
    path: 'login-page',
    loadChildren: () => import('./login-page/login-page.module').then(m => m.LoginPagePageModule)
  },
  {
    path: 'edit-procurement-request/:id',
    loadChildren: () => import('./edit-procurement-request/edit-procurement-request.module').then(m => m.EditProcurementRequestPageModule)
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
