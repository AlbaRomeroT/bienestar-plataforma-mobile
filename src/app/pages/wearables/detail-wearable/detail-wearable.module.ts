import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { DetailWearablePageRoutingModule } from "./detail-wearable-routing.module";

import { DetailWearablePage } from "./detail-wearable.page";
import { ComponentsModule } from "@app/components/components.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetailWearablePageRoutingModule,
    ComponentsModule,
  ],
  declarations: [DetailWearablePage],
})
export class DetailWearablePageModule {}
