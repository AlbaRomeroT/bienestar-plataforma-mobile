import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { PurposeAddPageRoutingModule } from "./purpose-add-routing.module";

import { PurposeAddPage } from "./purpose-add.page";
import { ComponentsModule } from "@app/components/components.module";
import { PipesModule } from "@app/pipes/pipes.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PurposeAddPageRoutingModule,
    ComponentsModule,
    PipesModule,
  ],
  declarations: [PurposeAddPage],
})
export class PurposeAddPageModule {}
