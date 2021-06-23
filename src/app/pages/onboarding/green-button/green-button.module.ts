import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { GreenButtonPageRoutingModule } from "./green-button-routing.module";

import { GreenButtonPage } from "./green-button.page";
import { ComponentsModule } from "../../../components/components.module";

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    GreenButtonPageRoutingModule,
    ComponentsModule,
  ],
  declarations: [GreenButtonPage],
})
export class GreenButtonPageModule {}
