import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ProfileDataPage } from "./profile-data.page";

const routes: Routes = [
  {
    path: "",
    component: ProfileDataPage,
  },
  /*{
    path: 'single-personal-data',
    loadChildren: () => import('./single-personal-data/single-personal-data.module').then( m => m.SinglePersonalDataPageModule)
  },*/
  /*{
    path: 'single-profesional-data',
    loadChildren: () => import('../../../../single-profesional-data/single-profesional-data.module').then( m => m.SingleProfesionalDataPageModule)
  },*/
  /*{
    path: 'single-profile-data',
    loadChildren: () => import('./single-profile-data/single-profile-data.module').then( m => m.SingleProfileDataPageModule)
  }*/
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfileDataPageRoutingModule {}
