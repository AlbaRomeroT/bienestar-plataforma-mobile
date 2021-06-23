import { Component, OnInit, ViewChild, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import { NavigatorRouteServiceService } from "@app/services/navigator-route-service.service";
import { IonInfiniteScroll } from "@ionic/angular";
import { Notifications } from "../../interfaces/notifications";
import { NotificationsService } from "../../services/notifications.service";

@Component({
  selector: "app-notifications",
  templateUrl: "./notifications.page.html",
  styleUrls: ["./notifications.page.scss"],
})
export class NotificationsPage implements OnInit, OnDestroy {
  public pathBack: string;
  public photo = "/assets/notifications/icono_notificaciones_bienestar.svg";
  _historyNotification: Notifications[];
  _historyNotificationScroll: Notifications[] = [];
  _dataSize: number = 0;
  _dataScrollIndex: number = 8;
  _dateScrollIncrement: number = 8;

  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

  constructor(
    private _notificationService: NotificationsService,
    private navigatorProfileService: NavigatorRouteServiceService,
    private router: Router
  ) {}

  ngOnInit() {
    this.getHistoryUserActivities();
  }

  ngOnDestroy() {
    clearInterval(this.interval);
  }

  ionViewWillEnter() {
    this._historyNotification = null;
    this._historyNotificationScroll = null;
    this._dataScrollIndex = 8;
    this._dataSize = 0;
    this.infiniteScroll.disabled = false;
    this.getHistoryUserActivities();
    this.getBack();
    this.checkAllNotificationAsSeen();
    this._notificationService.clearNewNotification();
    this.checkNewNotifications();
  }

  ionViewDidLeave() {
    clearInterval(this.interval);
  }

  getHistoryUserActivities(): void {
    this._notificationService
      .getHistoryUserNotifications()
      .subscribe((response) => {
        this._historyNotification = <Notifications[]>response.body.data;
        console.log(this._historyNotification);

        this._dataSize = this._historyNotification.length;
        this._historyNotificationScroll = this._historyNotification.slice(
          0,
          this._dataScrollIndex
        );
      });
  }

  navigateTo(notification: Notifications): void {
    console.log(notification);
    if (
      notification.body.includes("amigo") ||
      notification.body.includes("amistad")
    ) {
      this.router.navigate(["community"], {
        queryParams: { segment: "friends" },
      });
      return;
    }

    if (notification.body.includes("desafío")) {
      this.router.navigate(["community"], {
        queryParams: { segment: "challenges" },
      });
      return;
    }

    if (
      notification.body.includes("le gustó") ||
      notification.body.includes("ha comentado")
    ) {
      this.router.navigate(["community"], {
        queryParams: { segment: "recentActivity" },
      });
      return;
    }

    this.router.navigate(["coach"]);
  }

  loadData(event): void {
    setTimeout(() => {
      if (this._dataScrollIndex > this._dataSize) {
        this.infiniteScroll.complete();
        this.infiniteScroll.disabled = true;
        return;
      }
      this._dataScrollIndex += this._dateScrollIncrement;
      this._historyNotificationScroll = this._historyNotification.slice(
        0,
        this._dataScrollIndex
      );
      this.infiniteScroll.complete();
    }, 500);
  }

  getLeadTextClear(text: string) {
    if (!text) return null;
    return text
      .replace(/ *\([^)]*\) */g, "")
      .replace(/[\[\]']+/g, " ")
      .replace(/\*/g, " ");
  }

  getBack() {
    this.pathBack = this.navigatorProfileService.getBackUrl();

    if (this.pathBack.indexOf("?") > 1) {
      this.pathBack = this.pathBack.slice(0, this.pathBack.indexOf("?"));
    }
  }

  checkAllNotificationAsSeen() {
    this._notificationService.checkAllNotificationAsSeen().subscribe(
      (res) => {},
      (error) => {
        console.log("No se pudo marcar como visto", error);
      }
    );
  }

  private interval: any;
  checkNewNotifications() {
    this.interval = setInterval(async () => {
      if (this._notificationService.hasNewNotification.value) {
        this.getHistoryUserActivities();
        this.checkAllNotificationAsSeen();
        this._notificationService.clearNewNotification();
      }
    }, 6000);
  }
}
