import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { WearablesPage } from "./wearables.page";

const routes: Routes = [
  {
    path: "",
    component: WearablesPage,
  },
  {
    path: "connect-page",
    loadChildren: () =>
      import("./connect-page/connect-page.module").then(
        (m) => m.ConnectPagePageModule
      ),
  },
  {
    path: "detail-wearable",
    loadChildren: () =>
      import("./detail-wearable/detail-wearable.module").then(
        (m) => m.DetailWearablePageModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WearablesPageRoutingModule {}
