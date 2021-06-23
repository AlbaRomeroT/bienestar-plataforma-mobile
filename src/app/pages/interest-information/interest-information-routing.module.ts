import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { InterestInformationPage } from "./interest-information.page";

const routes: Routes = [
  {
    path: "",
    component: InterestInformationPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InterestInformationPageRoutingModule {}
