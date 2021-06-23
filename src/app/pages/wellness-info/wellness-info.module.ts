import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WellnessInfoPageRoutingModule } from './wellness-info-routing.module';

import { WellnessInfoPage } from './wellness-info.page';
import { ComponentsModule } from '../../components/components.module';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WellnessInfoPageRoutingModule,
    ComponentsModule,
    PipesModule
  ],
  declarations: [WellnessInfoPage]
})
export class WellnessInfoPageModule {}
