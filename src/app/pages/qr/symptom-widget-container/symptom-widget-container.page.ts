import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { QrInfo } from "@app/interfaces/QrInfo";
import { StoreService } from "@app/services/store.service";
import { environment } from "@environments/environment";

@Component({
  selector: "app-symptom-widget-container",
  templateUrl: "./symptom-widget-container.page.html",
  styleUrls: ["./symptom-widget-container.page.scss"],
})
export class SymptomWidgetContainerPage implements OnInit {
  flowType: string;
  docNumber: string;
  qrGenerationInfo: QrInfo;
  env = environment.qrenv;

  showComponent = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private storeService: StoreService
  ) {}

  ngOnInit() {
    this.activatedRoute.params.subscribe((params) => {
      this.flowType = params["flowType"];
      this.docNumber = params["docNumber"];
    });

    this.storeService.getCurrentQrInfo().subscribe((response) => {
      if (response) {
        this.qrGenerationInfo = response;
      } else {
        this.router.navigate(["/"]);
      }
    });
  }

  ionViewDidEnter() {
    this.showComponent = true;
  }

  ionViewDidLeave() {
    this.showComponent = false;
  }

  onSymptomWidgetEvent(evt: string): void {
    console.log(evt);
    if (
      evt === "symptomWidget:flowFinished" ||
      evt === "symptomWidget:flowCanceled"
    ) {
      this.router.navigate(["/"]);
    }
  }
}
