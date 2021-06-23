import { Component, Input, OnInit } from "@angular/core";
import { ModalController } from "@ionic/angular";
import { TermsModal } from "./terms.component";
import { TreatmentsModal } from "./treatment.component";

@Component({
  selector: "app-terms-treatments",
  templateUrl: "./terms-treatments.component.html",
  styleUrls: ["./terms-treatments.component.scss"],
})
export class TermsTreatmentsComponent implements OnInit {
  constructor(public modalCtrl: ModalController) {}

  async callModalTerms() {
    let profileModal = await this.modalCtrl.create({
      component: TermsModal,
    });
    profileModal.present();
  }

  async callModalTreatment() {
    let profileModal = await this.modalCtrl.create({
      component: TreatmentsModal,
    });
    profileModal.present();
  }

  ngOnInit() {}
}
