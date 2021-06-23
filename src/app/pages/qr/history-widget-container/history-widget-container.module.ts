import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ComponentsModule } from "@app/components/components.module";
import { IonicModule } from "@ionic/angular";
import { HistoryWidgetModule } from "qrpass-widgets";
import { HistoryWidgetContainerPageRoutingModule } from "./history-widget-container-routing.module";
import { HistoryWidgetContainerPage } from "./history-widget-container.page";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HistoryWidgetContainerPageRoutingModule,
    HistoryWidgetModule,
    ComponentsModule,
  ],
  declarations: [HistoryWidgetContainerPage],
})
export class HistoryWidgetContainerPageModule {}
