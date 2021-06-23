import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegisterManualActivityPage } from './register-manual-activity.page';

const routes: Routes = [
  {
    path: '',
    component: RegisterManualActivityPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegisterManualActivityPageRoutingModule {}
