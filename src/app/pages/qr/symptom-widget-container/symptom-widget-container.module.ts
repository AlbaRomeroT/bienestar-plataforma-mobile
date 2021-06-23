import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { SymptomWidgetContainerPageRoutingModule } from "./symptom-widget-container-routing.module";

import { SymptomWidgetContainerPage } from "./symptom-widget-container.page";
import { SymptomWidgetModule } from "qrpass-widgets";
import { ComponentsModule } from "@app/components/components.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SymptomWidgetContainerPageRoutingModule,
    SymptomWidgetModule,
    ComponentsModule,
  ],
  declarations: [SymptomWidgetContainerPage],
})
export class SymptomWidgetContainerPageModule {}
