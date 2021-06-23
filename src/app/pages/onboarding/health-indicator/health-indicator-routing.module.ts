import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { HealthIndicatorPage } from "./health-indicator.page";

const routes: Routes = [
  {
    path: "",
    component: HealthIndicatorPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HealthIndicatorPageRoutingModule {}
