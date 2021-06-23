import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { HelpCenterPageRoutingModule } from "./help-center-routing.module";

import { HelpCenterPage } from "./help-center.page";
import { ComponentsModule } from "../../components/components.module";
import { CallNumber } from "@ionic-native/call-number/ngx";
import { EmailComposer } from "@ionic-native/email-composer/ngx";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HelpCenterPageRoutingModule,
    ComponentsModule,
  ],
  declarations: [HelpCenterPage],
  providers: [CallNumber, EmailComposer],
})
export class HelpCenterPageModule {}
