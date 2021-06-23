import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { ChallengeDescriptionPage } from "./challenge-description.page";

const routes: Routes = [
  {
    path: "",
    component: ChallengeDescriptionPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChallengeDescriptionPageRoutingModule {}
