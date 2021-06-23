import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { PorpusePage } from "./porpuse.page";

const routes: Routes = [
  {
    path: "",
    component: PorpusePage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PorpusePageRoutingModule {}
