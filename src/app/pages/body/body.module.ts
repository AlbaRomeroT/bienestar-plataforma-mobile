import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { BodyPageRoutingModule } from "./body-routing.module";

import { BodyPage } from "./body.page";
import { ComponentsModule } from "@app/components/components.module";
import { BodySurveyComponent } from "./body-survey/body-survey.component";
import { PipesModule } from "@app/pipes/pipes.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BodyPageRoutingModule,
    ComponentsModule,
    ReactiveFormsModule,
    PipesModule,
  ],
  declarations: [BodyPage, BodySurveyComponent],
})
export class BodyPageModule {}
