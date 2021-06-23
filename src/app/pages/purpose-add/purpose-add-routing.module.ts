import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { PurposeAddPage } from "./purpose-add.page";

const routes: Routes = [
  {
    path: "",
    component: PurposeAddPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PurposeAddPageRoutingModule {}
