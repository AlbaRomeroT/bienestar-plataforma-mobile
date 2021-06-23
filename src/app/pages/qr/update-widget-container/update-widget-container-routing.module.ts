import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { UpdateWidgetContainerPage } from "./update-widget-container.page";

const routes: Routes = [
  {
    path: "",
    component: UpdateWidgetContainerPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UpdateWidgetContainerPageRoutingModule {}
