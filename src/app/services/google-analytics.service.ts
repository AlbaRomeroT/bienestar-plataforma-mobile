import { Injectable } from "@angular/core";
import { GoogleEvent } from "@app/enums/analitic-events";
import { environment } from "@environments/environment";
import { FirebaseAnalytics } from "@ionic-native/firebase-analytics/ngx";
import { AuthService } from "./auth.service";

@Injectable({
  providedIn: "root",
})
export class GoogleAnalyticsService {
  constructor(
    private fa: FirebaseAnalytics,
    private authService: AuthService
  ) {}

  private isProduction = environment.production;

  track() {
    if (this.isProduction) {
      try {
        this.fa.setEnabled(true).then(() => {
          console.log("Google analytics is ready now");
          this.authService
            .email()
            .then((email) => {
              if (email) {
                this.fa.setUserId(email).then();
              }
            })
            .catch((e) => {
              console.log("Error starting GoogleAnalytics ", e);
            });
        });
      } catch {}
    }
  }

  trackEvent(event: GoogleEvent, value?: any) {
    if (this.isProduction) {
      try {
        if (event.type === 0) {
          console.info(
            "ga track screen " + event.category + " | " + event.event
          );
          this.fa
            .setCurrentScreen(event.event)
            .then((result) => {})
            .catch((error) => {
              console.error(error);
            });
        } else {
          console.info(
            "ga track event " +
              event.category +
              " | " +
              event.event +
              " | " +
              value
          );
          this.fa
            .logEvent(event.event, { category: event.category, value: value })
            .then((result) => {})
            .catch((e) => {
              console.log("Error tracking GoogleAnalytics event ", e);
            });
        }
      } catch {}
    }
  }
}
