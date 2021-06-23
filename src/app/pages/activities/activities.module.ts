import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { ActivitiesPageRoutingModule } from "./activities-routing.module";

import { ActivitiesPage } from "./activities.page";
import { ComponentsModule } from "@app/components/components.module";
import { RegisterActivityComponent } from "./register-activity/register-activity.component";
import { PipesModule } from "@app/pipes/pipes.module";
import { HistoryActivityComponent } from "./history-activity/history-activity.component";
import { RoundProgressModule } from "angular-svg-round-progressbar";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ActivitiesPageRoutingModule,
    ComponentsModule,
    PipesModule,
    RoundProgressModule,
  ],
  declarations: [
    ActivitiesPage,
    RegisterActivityComponent,
    HistoryActivityComponent,
  ],
  providers: [],
})
export class ActivitiesPageModule {}
