import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { NotConnectionPage } from "./not-connection.page";

const routes: Routes = [
  {
    path: "",
    component: NotConnectionPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NotConnectionPageRoutingModule {}
