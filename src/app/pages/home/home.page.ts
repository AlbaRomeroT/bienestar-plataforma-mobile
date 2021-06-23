import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import { AnaliticEvents } from "@app/enums/analitic-events";
import { AuthService } from "@app/services/auth.service";
import { GoogleAnalyticsService } from "@app/services/google-analytics.service";
import { PushNotificationService } from "@app/services/push-notification.service";
import { SurveyService } from "@app/services/survey.service";
import { environment } from "@environments/environment";

@Component({
  selector: "app-home",
  templateUrl: "./home.page.html",
  styleUrls: ["./home.page.scss"],
})
export class HomePage implements OnInit {
  empresa = "";
  reloading = false;
  public isProduction: boolean = false;

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private gaService: GoogleAnalyticsService,
    private pushNotificationService: PushNotificationService,
    private surveyService: SurveyService, 
  ) {
    this.isProduction = environment.production;
  }

  ngOnInit() {
    if (!this.authService.isLogged()) {
      this.authService.logout();      
      console.log("No esta logueado");      
    }
    let profile = JSON.parse(localStorage.getItem("profile"));
    this.surveyService.validateShowSurvey(profile.email);
    this.pushNotificationService.listening();
  }

  async ionViewDidEnter() {
    this.reloading = false;
  }

  async ionViewDidLeave() {
    this.reloading = true;
  }

  async logout() {
    await this.authService.logout();
  }

  async goToOnboarding() {
    this.router.navigate(["onboarding"]);
  }

  async goToCoach() {
    this.gaService.trackEvent(AnaliticEvents.HO_MC_BTN);
    this.router.navigate(["coach"], { queryParams: { pathReturn: "/home" } });
  }

  async goToPurpose() {
    this.gaService.trackEvent(AnaliticEvents.BI_PR_BTN);
    this.router.navigate(["purpose"], { queryParams: { pathReturn: "/home" } });
  }

  async goToCommunity() {
    this.gaService.trackEvent(AnaliticEvents.HO_CR_BTN);
    this.router.navigate(["community"], {
      queryParams: { pathReturn: "/home" },
    });
  }
}
