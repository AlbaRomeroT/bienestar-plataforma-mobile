import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { FeelingPage } from "./feeling.page";

const routes: Routes = [
  {
    path: "",
    component: FeelingPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FeelingPageRoutingModule {}
