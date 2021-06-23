import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { ProfileDataPageRoutingModule } from "./profile-data-routing.module";

import { ProfileDataPage } from "./profile-data.page";
import { ComponentsModule } from "@app/components/components.module";
import { SingleProfileDataPage } from "./single-profile-data/single-profile-data.page";
import { SinglePersonalDataPage } from "./single-personal-data/single-personal-data.page";
import { SingleProfesionalDataPage } from "./single-profesional-data/single-profesional-data.page";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ProfileDataPageRoutingModule,
    ComponentsModule,
  ],
  declarations: [
    ProfileDataPage,
    SingleProfileDataPage,
    SingleProfesionalDataPage,
    SinglePersonalDataPage,
  ],
})
export class ProfileDataPageModule {}
