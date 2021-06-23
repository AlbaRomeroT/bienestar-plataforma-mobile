import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { GreenButtonPage } from "./green-button.page";

const routes: Routes = [
  {
    path: "",
    component: GreenButtonPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GreenButtonPageRoutingModule {}
