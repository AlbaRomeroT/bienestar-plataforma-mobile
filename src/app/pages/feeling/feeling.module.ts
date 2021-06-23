import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { FeelingPageRoutingModule } from "./feeling-routing.module";

import { FeelingPage } from "./feeling.page";
import { ComponentsModule } from "../../components/components.module";
import { PipesModule } from "../../pipes/pipes.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FeelingPageRoutingModule,
    ComponentsModule,
    PipesModule,
  ],
  declarations: [FeelingPage],
})
export class FeelingPageModule {}
