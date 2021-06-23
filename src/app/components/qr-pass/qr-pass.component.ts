import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { TrackHttpError } from "@app/interfaces/app-http-response.interface";
import { QrInfo } from "@app/interfaces/QrInfo";
import { AuthService } from "@app/services/auth.service";
import { ProfileDataService } from "@app/services/profile-data.service";
import { StoreService } from "@app/services/store.service";
import { environment } from "@environments/environment";

@Component({
  selector: "app-qr-pass",
  templateUrl: "./qr-pass.component.html",
  styleUrls: ["./qr-pass.component.scss"],
})
export class QrPassComponent implements OnInit {
  private qrInfo: QrInfo = {
    age: null,
    name_arl: null,
    sickness: [],
    other_sickness: [],
    questions: [],
    hasBolivarHealth: false,
    userName: null,
    worksInHealthSector: false,
    hasBolivarArl: false,
  };
  private email: string;

  subtitle: string;
  title: string;
  content: string;
  textlink: string;

  docNumber: string;
  env = environment.qrenv;

  constructor(
    private router: Router,
    private authService: AuthService,
    private profileDataService: ProfileDataService,
    private storeService: StoreService
  ) {
    this.subtitle = "QR Pass";
    this.title = "No se encuentra información registrada";
    this.content =
      "Por favor conteste las siguientes preguntas para controlar su estado de COVID-19";
    this.textlink = "Completar información";
  }

  ngOnInit() {
    this.loadData();
  }

  async loadData() {
    this.email = await this.authService.email();
    await this.getProfile();
    await this.getProfessionalData();
    await this.getFamilyData();
    this.storeService.setCurrentQrInfo(this.qrInfo);
  }

  async getProfile() {
    this.authService.profile().then((profile) => {
      this.docNumber = profile.document;
      this.qrInfo.age = new Date(profile.birthday);
      this.qrInfo.userName =
        (profile.name || "") + " " + (profile.lastName || "");
    });
  }

  async getProfessionalData() {
    this.profileDataService.getProfessional(this.email).subscribe((values) => {
      if (
        !values.body.hasArl ||
        values.body.hasArl === "false" ||
        values.body.hasArl === false
      ) {
        this.qrInfo.name_arl = "N/A";
      } else if (
        values.body.hasBolivarArl &&
        (values.body.hasBolivarArl === "true" ||
          values.body.hasBolivarArl === true)
      ) {
        this.qrInfo.name_arl = "ARL Bolívar";
      } else {
        this.qrInfo.name_arl = "Otro";
      }

      this.qrInfo.hasBolivarHealth =
        values.body.hasBolivarHealth &&
        (values.body.hasBolivarHealth === "true" ||
          values.body.hasBolivarHealth === true)
          ? true
          : false;
      this.qrInfo.worksInHealthSector =
        values.body.worksInHealthSector &&
        (values.body.worksInHealthSector === "true" ||
          values.body.worksInHealthSector === true)
          ? true
          : false;
      this.qrInfo.hasBolivarArl =
        values.body.hasBolivarArl &&
        (values.body.hasBolivarArl === "true" ||
          values.body.hasBolivarArl === true)
          ? true
          : false;
    });
  }

  async getFamilyData() {
    this.profileDataService.getFamily(this.email).subscribe(
      (values) => {
        this.fillQuestions(values);
        this.fillDiseases(values);
      },
      (error: TrackHttpError) => {
        console.log(error);
      }
    );
  }

  fillQuestions(values) {
    if (
      values.body.hasBeenSmoker &&
      (values.body.hasBeenSmoker === "true" ||
        values.body.hasBeenSmoker === true)
    ) {
      this.qrInfo.questions.push("1");
    }
    if (
      values.body.isPregnant &&
      (values.body.isPregnant === "true" || values.body.isPregnant === true)
    ) {
      this.qrInfo.questions.push("6");
    }
    if (
      values.body.familyDiseases &&
      (values.body.familyDiseases === "true" ||
        values.body.familyDiseases === true)
    ) {
      this.qrInfo.questions.push("7");
    }
    if (values.body.liveWith) {
      for (var liveWith of values.body.liveWith) {
        if ("3458".includes(liveWith.id)) {
          this.qrInfo.questions.push(liveWith.id);
        }
      }
    }
  }

  fillDiseases(values) {
    if (values.body.diseases) {
      for (var disease of values.body.diseases) {
        if ("12345678".includes(disease.id)) {
          this.qrInfo.sickness.push(disease.id);
        }
      }
    }
  }

  onHomeWidgetEvent(event: string) {
    console.log(event);

    switch (event) {
      case "home:feel-bad":
        this.router.navigate([
          "/symptom-widget-container",
          "symptom:bad",
          this.docNumber,
        ]);
        break;
      case "home:feel-good":
        this.router.navigate([
          "/symptom-widget-container",
          "symptom:ok",
          this.docNumber,
        ]);
        break;
      case "home:contact":
        this.router.navigate([
          "/symptom-widget-container",
          "symptom:contact",
          this.docNumber,
        ]);
        break;
      case "home:update-temp":
        this.router.navigate([
          "/symptom-widget-container",
          "symptom:temperature",
          this.docNumber,
        ]);
        break;
      case "home:unregistered":
        this.router.navigate(["/profile-data"]);
        break;
      case "home:qr-update":
        this.router.navigate(["/update-widget-container", this.docNumber]);
        break;
      case "home:yellow":
      case "home:red":
        const color = event.split(":")[1];
        this.router.navigate([
          "/advice-widget-container",
          color,
          this.docNumber,
        ]);
        break;
      case "home:qr-history":
        this.router.navigate(["/history-widget-container", this.docNumber]);
        break;
    }
  }
}
