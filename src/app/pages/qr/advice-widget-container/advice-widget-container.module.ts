import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ComponentsModule } from "@app/components/components.module";
import { IonicModule } from "@ionic/angular";
import { AdviceWidgetModule } from "qrpass-widgets";
import { AdviceWidgetContainerPageRoutingModule } from "./advice-widget-container-routing.module";
import { AdviceWidgetContainerPage } from "./advice-widget-container.page";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdviceWidgetContainerPageRoutingModule,
    AdviceWidgetModule,
    ComponentsModule,
  ],
  declarations: [AdviceWidgetContainerPage],
})
export class AdviceWidgetContainerPageModule {}
