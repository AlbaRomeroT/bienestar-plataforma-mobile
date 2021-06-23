import { Component, Input, OnInit } from "@angular/core";
import { ModalController } from "@ionic/angular";

@Component({
  selector: "app-modal-confirm",
  templateUrl: "./modal-confirm.component.html",
  styleUrls: ["./modal-confirm.component.scss"],
})
export class ModalConfirmComponent implements OnInit {
  @Input() public title: string;

  constructor(private modalController: ModalController) {}

  ngOnInit() {}

  dismiss(response: boolean) {
    this.modalController.dismiss({
      dismissed: response,
    });
  }
}
