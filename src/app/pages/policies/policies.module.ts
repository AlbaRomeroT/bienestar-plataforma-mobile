import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { PoliciesPageRoutingModule } from "./policies-routing.module";

import { PoliciesPage } from "./policies.page";
import { ComponentsModule } from "../../components/components.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PoliciesPageRoutingModule,
    ComponentsModule,
  ],
  declarations: [PoliciesPage],
})
export class PoliciesPageModule {}
