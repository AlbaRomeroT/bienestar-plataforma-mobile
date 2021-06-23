import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormBuilder, FormsModule, ReactiveFormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { LoginPageRoutingModule } from "./login-routing.module";

import { LoginPage } from "./login.page";

import { ComponentsModule } from "../../components/components.module";
import { HttpClientModule } from "@angular/common/http";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LoginPageRoutingModule,
    ComponentsModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  declarations: [LoginPage],
  providers: [FormBuilder],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LoginPageModule {}
