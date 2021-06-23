import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { SleepPageRoutingModule } from './sleep-routing.module';
import { SleepPage } from './sleep.page';
import { ComponentsModule } from '../../components/components.module';
import { PipesModule } from '../../pipes/pipes.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SleepPageRoutingModule,
    ComponentsModule,
    PipesModule,
    ReactiveFormsModule,
  ],
  declarations: [SleepPage]
})
export class SleepPageModule {}
