import { Component } from "@angular/core";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { AnaliticEvents } from "@app/enums/analitic-events";
import { GoogleAnalyticsService } from "@app/services/google-analytics.service";
import { ViewDidLeave, ViewDidEnter } from "@ionic/angular";

@Component({
  selector: "app-activities",
  templateUrl: "./activities.page.html",
  styleUrls: ["./activities.page.scss"],
})
export class ActivitiesPage implements ViewDidEnter, ViewDidLeave {
  public selectedTab;
  public historical;
  public title: string;

  constructor(
    private route: ActivatedRoute,
    private gaService: GoogleAnalyticsService
  ) {
    this.title = "Actividades";
  }

  ionViewDidEnter() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.historical = params.get("historical");
    });
    this.selectedTab = this.historical != null ? this.historical : "register";
  }

  ionViewDidLeave(): void {
    this.selectedTab = null;
  }

  onTabClick(tab: string) {
    this.gaService.trackEvent(
      tab == "register" ? AnaliticEvents.AC_REA_BTN : AnaliticEvents.AC_HA_BTN
    );
  }
}
