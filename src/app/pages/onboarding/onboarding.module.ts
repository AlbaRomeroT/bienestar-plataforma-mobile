import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { OnboardingPageRoutingModule } from "./onboarding-routing.module";

import { ComponentsModule } from "@app/components/components.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OnboardingPageRoutingModule,
    ComponentsModule,
  ],
})
export class OnboardingPageModule {}
