import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { SymptomWidgetContainerPage } from "./symptom-widget-container.page";

const routes: Routes = [
  {
    path: "",
    component: SymptomWidgetContainerPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SymptomWidgetContainerPageRoutingModule {}
