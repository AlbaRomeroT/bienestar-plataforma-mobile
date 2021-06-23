import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { DetailWearablePage } from "./detail-wearable.page";

const routes: Routes = [
  {
    path: "",
    component: DetailWearablePage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetailWearablePageRoutingModule {}
