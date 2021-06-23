import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { WearablesPageRoutingModule } from "./wearables-routing.module";

import { WearablesPage } from "./wearables.page";
import { ComponentsModule } from "@app/components/components.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WearablesPageRoutingModule,
    ComponentsModule,
  ],
  declarations: [WearablesPage],
})
export class WearablesPageModule {}
