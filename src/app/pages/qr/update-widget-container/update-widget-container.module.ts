import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { ComponentsModule } from "@app/components/components.module";
import { IonicModule } from "@ionic/angular";
import { UpdateWidgetModule } from "qrpass-widgets";
import { UpdateWidgetContainerPageRoutingModule } from "./update-widget-container-routing.module";
import { UpdateWidgetContainerPage } from "./update-widget-container.page";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UpdateWidgetContainerPageRoutingModule,
    UpdateWidgetModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ComponentsModule,
  ],
  declarations: [UpdateWidgetContainerPage],
})
export class UpdateWidgetContainerPageModule {}
