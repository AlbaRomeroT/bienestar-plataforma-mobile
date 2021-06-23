import { Component, Input, OnInit } from "@angular/core";
import { ModalController } from "@ionic/angular";

@Component({
  selector: "app-modal-alert",
  templateUrl: "./modal-alert.component.html",
  styleUrls: ["./modal-alert.component.scss"],
})
export class ModalAlertComponent implements OnInit {
  @Input() public title: string;
  @Input() public description: string;
  @Input() public icon: string = "/assets/purpose/news/check-circle.svg";

  constructor(private modalController: ModalController) {}

  ngOnInit() {}

  dismiss(response: boolean) {
    this.modalController.dismiss({
      dismissed: response,
    });
  }
}
