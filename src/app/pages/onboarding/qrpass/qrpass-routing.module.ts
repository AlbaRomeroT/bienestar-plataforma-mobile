import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { QrpassPage } from "./qrpass.page";

const routes: Routes = [
  {
    path: "",
    component: QrpassPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QrpassPageRoutingModule {}
