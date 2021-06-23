import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { ConnectPagePageRoutingModule } from "./connect-page-routing.module";

import { ConnectPagePage } from "./connect-page.page";
import { ComponentsModule } from "@app/components/components.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConnectPagePageRoutingModule,
    ComponentsModule,
  ],
  declarations: [ConnectPagePage],
})
export class ConnectPagePageModule {}
