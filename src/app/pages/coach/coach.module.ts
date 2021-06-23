import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { CoachPageRoutingModule } from "./coach-routing.module";

import { CoachPage } from "./coach.page";
import { ComponentsModule } from "../../components/components.module";
import { PipesModule } from "../../pipes/pipes.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CoachPageRoutingModule,
    ComponentsModule,
    PipesModule,
  ],
  declarations: [CoachPage],
})
export class CoachPageModule {}
