import { Component, OnInit } from "@angular/core";
import { ModalController } from "@ionic/angular";

@Component({
  selector: "app-modal-activities",
  templateUrl: "./modal-activities.component.html",
  styleUrls: ["./modal-activities.component.scss"],
})
export class ModalActivitiesComponent implements OnInit {
  title: string;
  description: string;
  action: string;
  constructor(private _modalCtrl: ModalController) {}

  ngOnInit() {
    console.log(this.title);
    console.log(this.action);
  }

  dismiss(flag?) {
    let decision = flag == "1" ? "Acepta" : "rechaza";
    this._modalCtrl.dismiss({
      dismissed: decision,
    });
  }
}
