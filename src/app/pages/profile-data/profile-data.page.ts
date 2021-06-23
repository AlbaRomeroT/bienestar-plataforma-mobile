import { Component, OnInit, ViewChild } from "@angular/core";
import { IonSegment } from "@ionic/angular";
import { AuthService } from "../../services/auth.service";
import { ProfileDataPersistenceService } from "./profile-data-persistence.service";

@Component({
  selector: "app-profile-data",
  templateUrl: "./profile-data.page.html",
  styleUrls: ["./profile-data.page.scss"],
})
export class ProfileDataPage implements OnInit {
  @ViewChild(IonSegment, { static: true }) segment: IonSegment;

  steps = {
    perfil: "perfil",
    profesional: "profesional",
    personal: "personal",
  };
  initialStep = this.steps.perfil;

  public currentStep: string = this.initialStep;

  constructor(
    private authService: AuthService,
    private profileDataPersistenceService: ProfileDataPersistenceService
  ) {}

  ngOnDestroy(): void {
    console.log("Destruyendo padre..");
    this.profileDataPersistenceService.clearForms();
  }

  ngOnInit() {
    console.log("Loading parent ngOnInit..");
  }

  ionViewWillEnter() {
    this.currentStep = this.initialStep;
  }

  ionViewWillLeave() {
    this.ngOnDestroy();
    this.segment.value = this.initialStep;
  }

  tabChange(tab: any): void {
    this.currentStep = tab.detail.value;
    this.focusSegment(this.currentStep);
  }

  focusSegment(segment: string) {
    var segmentId = `seg-${segment}`;
    document.getElementById(segmentId).scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "center",
    });
  }
}
