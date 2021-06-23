import { Component, OnInit } from "@angular/core";
import { ModalController } from "@ionic/angular";

@Component({
  selector: "app-modal-not-connection",
  templateUrl: "./modal-not-connection.component.html",
  styleUrls: ["./modal-not-connection.component.scss"],
})
export class ModalNotConnectionComponent implements OnInit {
  title: string;
  description: string;
  action: string;
  constructor(private _modalCtrl: ModalController) {}

  ngOnInit() {
    console.log(this.title);
    console.log(this.action);
  }

  dismiss(flag?) {
    let decision = flag == "1" ? "tryAgain" : "back";
    this._modalCtrl.dismiss({
      dismissed: decision,
    });
  }
}
