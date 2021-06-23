import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { InterestInformationPageRoutingModule } from "./interest-information-routing.module";

import { InterestInformationPage } from "./interest-information.page";
import { ComponentsModule } from "../../components/components.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InterestInformationPageRoutingModule,
    ComponentsModule,
  ],
  declarations: [InterestInformationPage],
})
export class InterestInformationPageModule {}
