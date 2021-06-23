import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { LifestylePageRoutingModule } from "./lifestyle-routing.module";

import { LifestylePage } from "./lifestyle.page";
import { ComponentsModule } from "../../components/components.module";
import { PipesModule } from "../../pipes/pipes.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LifestylePageRoutingModule,
    ComponentsModule,
    PipesModule,
  ],
  declarations: [LifestylePage],
})
export class LifestylePageModule {}
