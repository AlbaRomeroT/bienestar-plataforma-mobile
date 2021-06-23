import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { NotConnectionPageRoutingModule } from "./not-connection-routing.module";

import { NotConnectionPage } from "./not-connection.page";
import { ComponentsModule } from "../../components/components.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NotConnectionPageRoutingModule,
    ComponentsModule,
  ],
  declarations: [NotConnectionPage],
})
export class NotConnectionPageModule {}
