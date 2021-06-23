import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { PorpusePageRoutingModule } from "./porpuse-routing.module";

import { PorpusePage } from "./porpuse.page";
import { ComponentsModule } from "../../../components/components.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PorpusePageRoutingModule,
    ComponentsModule,
  ],
  declarations: [PorpusePage],
})
export class PorpusePageModule {}
