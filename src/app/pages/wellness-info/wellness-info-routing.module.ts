import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WellnessInfoPage } from './wellness-info.page';

const routes: Routes = [
  {
    path: '',
    component: WellnessInfoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WellnessInfoPageRoutingModule {}
