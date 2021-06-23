import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { AdviceWidgetContainerPage } from "./advice-widget-container.page";

const routes: Routes = [
  {
    path: "",
    component: AdviceWidgetContainerPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdviceWidgetContainerPageRoutingModule {}
