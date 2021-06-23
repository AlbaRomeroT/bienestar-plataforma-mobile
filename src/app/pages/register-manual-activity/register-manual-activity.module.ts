import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegisterManualActivityPageRoutingModule } from './register-manual-activity-routing.module';

import { RegisterManualActivityPage } from './register-manual-activity.page';
import { PipesModule } from '@app/pipes/pipes.module';
import { ComponentsModule } from '@app/components/components.module';

import { NgSelectModule } from '@ng-select/ng-select';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RegisterManualActivityPageRoutingModule,
    ComponentsModule,
    PipesModule,
    NgSelectModule
  ],
  declarations: [RegisterManualActivityPage]
})
export class RegisterManualActivityPageModule {}
