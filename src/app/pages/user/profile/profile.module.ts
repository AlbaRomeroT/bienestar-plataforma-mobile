import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { ProfilePageRoutingModule } from "./profile-routing.module";

import { ProfilePage } from "./profile.page";
import { ComponentsModule } from "../../../components/components.module";
import { PersonalComponent } from "./personal/personal.component";
import { ProfessionalComponent } from "./professional/professional.component";
import { FamilyComponent } from "./family/family.component";
import { PipesModule } from "../../../pipes/pipes.module";

@NgModule({
  declarations: [
    ProfilePage,
    PersonalComponent,
    ProfessionalComponent,
    FamilyComponent,
  ],
  exports: [PersonalComponent],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProfilePageRoutingModule,
    ComponentsModule,
    PipesModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class ProfilePageModule {}
