import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { BlogDetailsPageRoutingModule } from "./blog-details-routing.module";

import { BlogDetailsPage } from "./blog-details.page";

import { ComponentsModule } from "../../components/components.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BlogDetailsPageRoutingModule,
    ComponentsModule,
  ],
  declarations: [BlogDetailsPage],
})
export class BlogDetailsPageModule {}
