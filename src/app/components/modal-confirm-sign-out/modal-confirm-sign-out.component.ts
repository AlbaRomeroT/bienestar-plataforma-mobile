import { Component, Input, OnInit } from "@angular/core";
import { ModalController } from "@ionic/angular";

@Component({
  selector: "app-modal-confirm-sign-out",
  templateUrl: "./modal-confirm-sign-out.component.html",
  styleUrls: ["./modal-confirm-sign-out.component.scss"],
})
export class ModalConfirmSignOutComponent implements OnInit {
  @Input() public title: string;

  constructor(private modalController: ModalController) {}

  ngOnInit() {
    // Something to do on init
  }

  dismiss(response: boolean) {
    this.modalController.dismiss({
      dismissed: response,
    });
  }
}
