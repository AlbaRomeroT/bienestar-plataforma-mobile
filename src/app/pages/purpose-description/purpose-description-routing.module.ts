import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { PurposeDescriptionPage } from "./purpose-description.page";

const routes: Routes = [
  {
    path: "",
    component: PurposeDescriptionPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PurposeDescriptionPageRoutingModule {}
