import { Component, NgZone } from "@angular/core";
import { Platform } from "@ionic/angular";
import { StatusBar } from "@ionic-native/status-bar/ngx";
import { Router, Event, NavigationStart } from "@angular/router";
import { AuthService } from "./services/auth.service";
import { GoogleAnalyticsService } from "./services/google-analytics.service";
import { ScreenOrientation } from "@ionic-native/screen-orientation/ngx";
import { PushNotificationService } from "./services/push-notification.service";
import { environment } from "@environments/environment";
import { HealthStepsService } from "@services/health.service";
import { Deeplinks } from "@ionic-native/deeplinks/ngx";
import { AnimationItem } from "lottie-web";
import { AnimationOptions } from "ngx-lottie";
import { Plugins } from "@capacitor/core";
const { SplashScreen } = Plugins;

@Component({
  selector: "app-root",
  templateUrl: "app.component.html",
  styleUrls: ["app.component.scss"],
})
export class AppComponent {
  public showMenu: boolean = false;
  public showSplash: boolean = true;
  public isProduction: boolean = false;

  constructor(
    private platform: Platform,
    private statusBar: StatusBar,
    private authService: AuthService,
    private router: Router,
    private gaService: GoogleAnalyticsService,
    private screenOrientation: ScreenOrientation,
    private pushNotificationService: PushNotificationService,
    private healthStepsService: HealthStepsService,
    private deeplinks: Deeplinks,
    private zone: NgZone
  ) {
    this.initializeApp();
  }

  componentDidLoad() {
    if (!this.isProduction) {
      SplashScreen.hide();
    }
  }

  options: AnimationOptions = {
    path: "/assets/lottie.json",
  };

  ngOnInit() {
    localStorage.setItem("portal", environment.logintrenv);
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart) {
        this.isShowMenu(event.url);
      }
    });
    this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
  }

  initializeApp() {
    this.isProduction = environment.production;
    this.platform.ready().then(() => {
      if (this.isProduction) {
        setTimeout(() => {
          SplashScreen.hide();
        }, 3000);
      } else {
        setTimeout(() => {
          this.showSplash = false;
        }, 5000);
      }
    });
    this.gaService.track();
    this.pushNotificationService.listening();
    this.statusBar.styleDefault();
    this.healthStepsService.runHealthSync();
    this.setupDeeplinks();
  }

  async isShowMenu(route: string = null) {
    if (route.includes("onboarding")) {
      this.showMenu = false;
      return;
    }
    this.showMenu = await this.authService.isLogged();
  }

  private setupDeeplinks(): void {
    const internalPath = `/wearables/connect-page`;
    this.deeplinks.route({ "/connect-page": "connect-page" }).subscribe(
      (match) => {
        console.log("** matched route", match);
        this.zone.run(() => {
          this.router.navigateByUrl(internalPath, {
            queryParams: { modal: 1 },
          });
        });
      },
      (nomatch) => {
        console.error("** no matched", nomatch);
      }
    );
  }

  animationCreated(animationItem: AnimationItem): void {
    console.log(animationItem);
  }
}
