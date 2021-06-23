import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { QrpassPageRoutingModule } from "./qrpass-routing.module";

import { QrpassPage } from "./qrpass.page";

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, QrpassPageRoutingModule],
  declarations: [QrpassPage],
})
export class QrpassPageModule {}
