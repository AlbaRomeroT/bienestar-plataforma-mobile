import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { ChallengeDescriptionPageRoutingModule } from "./challenge-description-routing.module";

import { ChallengeDescriptionPage } from "./challenge-description.page";
import { PipesModule } from "@app/pipes/pipes.module";
import { ComponentsModule } from "@app/components/components.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChallengeDescriptionPageRoutingModule,
    ComponentsModule,
    PipesModule,
  ],
  declarations: [ChallengeDescriptionPage],
})
export class ChallengeDescriptionPageModule {}
