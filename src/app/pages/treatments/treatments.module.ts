import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { TreatmentsPageRoutingModule } from "./treatments-routing.module";
import { TreatmentsPage } from "./treatments.page";
import { ComponentsModule } from "../../components/components.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TreatmentsPageRoutingModule,
    ComponentsModule,
  ],
  declarations: [TreatmentsPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class TreatmentsPageModule {}
