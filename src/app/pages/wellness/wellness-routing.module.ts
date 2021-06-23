import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { WellnessPage } from "./wellness.page";

const routes: Routes = [
  {
    path: "",
    component: WellnessPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WellnessPageRoutingModule {}
