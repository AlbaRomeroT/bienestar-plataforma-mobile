import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { PurposeDescriptionPageRoutingModule } from "./purpose-description-routing.module";

import { PurposeDescriptionPage } from "./purpose-description.page";
import { ComponentsModule } from "../../components/components.module";
import { PipesModule } from "../../pipes/pipes.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PurposeDescriptionPageRoutingModule,
    ComponentsModule,
    PipesModule,
  ],
  declarations: [PurposeDescriptionPage],
})
export class PurposeDescriptionPageModule {}
