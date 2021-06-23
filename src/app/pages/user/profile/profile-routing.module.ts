import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { ProfilePage } from "./profile.page";

const routes: Routes = [
  {
    path: "",
    component: ProfilePage,
  },
  // {
  //   path: 'profile-tab',
  //   loadChildren: () => import('./components/profileTab/profile-tab/profile-tab.module').then( m => m.ProfileTabPageModule)
  // }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfilePageRoutingModule {}
