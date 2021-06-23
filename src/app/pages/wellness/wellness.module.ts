import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { WellnessPageRoutingModule } from "./wellness-routing.module";

import { WellnessPage } from "./wellness.page";
import { ComponentsModule } from "@app/components/components.module";
import { MyWellnessPage } from "@app/pages/wellness/my-wellness/my-wellness.page";
import { MyPointsPage } from "@app/pages/wellness/my-points/my-points.page";
import { MyHealthComponent } from "./my-health/my-health.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WellnessPageRoutingModule,
    ComponentsModule,
  ],
  declarations: [WellnessPage, MyWellnessPage, MyPointsPage, MyHealthComponent],
  providers: [],
})
export class WellnessPageModule {}
