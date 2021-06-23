import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { ChallengeAddPageRoutingModule } from "./challenge-add-routing.module";

import { ChallengeAddPage } from "./challenge-add.page";
import { ComponentsModule } from "@app/components/components.module";
import { PipesModule } from "@app/pipes/pipes.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChallengeAddPageRoutingModule,
    ComponentsModule,
    PipesModule,
  ],
  declarations: [ChallengeAddPage],
})
export class ChallengeAddPageModule {}
