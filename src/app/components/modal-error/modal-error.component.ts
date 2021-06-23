import { Component, Input } from "@angular/core";
import { ModalController } from "@ionic/angular";

@Component({
  selector: "app-modal-error",
  templateUrl: "./modal-error.component.html",
  styleUrls: ["./modal-error.component.scss"],
})
export class ModalErrorComponent {
  @Input() public modalTitle: string;
  @Input() public modalDescription: string;
  @Input() public modalConfirmButtonText: string;
  @Input() public modalCancelButtonText: string;
  @Input() public modalIconPath: string;

  constructor(private modalController: ModalController) {}

  dismiss(flag?) {
    let decision =
      flag == "1" ? this.modalConfirmButtonText : this.modalCancelButtonText;
    this.modalController.dismiss({
      dismissed: decision,
    });
  }
}
