import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { GoogleAnalyticsService } from "@app/services/google-analytics.service";
import { AnaliticEvents } from "@app/enums/analitic-events";

@Component({
  selector: "app-my-wellness",
  templateUrl: "./my-wellness.page.html",
  styleUrls: ["./my-wellness.page.scss"],
})
export class MyWellnessPage implements OnInit {
  constructor(
    public router: Router,
    private gaService: GoogleAnalyticsService
  ) {}

  ngOnInit() {}

  goToActivities() {
    this.gaService.trackEvent(AnaliticEvents.BI_RA_BTN);
    this.router.navigate(["/activities"]);
  }

  async goToCoach() {
    this.gaService.trackEvent(AnaliticEvents.BI_CO_BTN);
    this.router.navigate(["coach"]);
  }

  async goToPurpose() {
    this.gaService.trackEvent(AnaliticEvents.BI_PR_BTN);
    this.router.navigate(["purpose"]);
  }

  async goToCommunity() {
    this.router.navigate(["community"]);
  }
}
