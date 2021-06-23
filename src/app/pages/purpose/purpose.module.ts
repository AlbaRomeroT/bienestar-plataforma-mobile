import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { PurposePageRoutingModule } from "./purpose-routing.module";

import { PurposePage } from "./purpose.page";
import { ComponentsModule } from "../../components/components.module";
import { PipesModule } from "../../pipes/pipes.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PurposePageRoutingModule,
    ComponentsModule,
    PipesModule,
  ],
  declarations: [PurposePage],
})
export class PurposePageModule {}
