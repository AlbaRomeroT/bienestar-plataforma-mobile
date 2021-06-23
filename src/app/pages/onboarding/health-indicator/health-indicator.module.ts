import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { HealthIndicatorPageRoutingModule } from "./health-indicator-routing.module";

import { HealthIndicatorPage } from "./health-indicator.page";
import { ComponentsModule } from "../../../components/components.module";

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    HealthIndicatorPageRoutingModule,
    ComponentsModule,
  ],
  declarations: [HealthIndicatorPage],
})
export class HealthIndicatorPageModule {}
