import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import {
  Capacitor,
  LocalNotificationActionPerformed,
  Plugins,
  PushNotification,
  PushNotificationActionPerformed,
  PushNotificationToken,
} from "@capacitor/core";
import { environment } from "@environments/environment";
import { Platform } from "@ionic/angular";
import { AuthService } from "./auth.service";

const { PushNotifications, LocalNotifications } = Plugins;

@Injectable({
  providedIn: "root",
})
export class PushNotificationService {
  private isRegister: boolean;
  private localIds = {};

  constructor(
    private authService: AuthService,
    private platform: Platform,
    private http: HttpClient
  ) {
    this.isRegister = false;
  }

  listening() {
    const isPushNotificationsAvailable = Capacitor.isPluginAvailable(
      "PushNotifications"
    );

    if (
      (this.platform.is("ios") || this.platform.is("android")) &&
      isPushNotificationsAvailable
    ) {
      this.authService.isLogged().then((isLogged: boolean) => {
        if (isLogged && !this.isRegister) {
          PushNotifications.requestPermission().then((result) => {
            if (result.granted) {
              // Register with Apple / Google to receive push via APNS/FCM
              PushNotifications.register();
              LocalNotifications.requestPermission().then();
              LocalNotifications.addListener(
                "localNotificationActionPerformed",
                this.onCallbackLocalNotification
              );
            } else {
              // Show some error
              console.log(result);
            }
          });

          // On success, we should be able to receive notifications
          PushNotifications.addListener(
            "registration",
            (token: PushNotificationToken) => {
              console.log("Push registration success, token: " + token.value);
              // TODO: it needs to call dacadoo api register device
              let data = {
                type: this.platform.is("ios") ? "apns" : "fcm",
                language: "es",
                token: this.platform.is("ios")
                  ? token.value
                  : btoa(token.value),
              };

              this.http
                .post(
                  `${environment.bienestarUrlApi}/bienestar/push-notifications`,
                  data
                )
                .subscribe(
                  (response) => {
                    console.log(response);
                    this.isRegister = true;
                  },
                  (error) => {
                    console.log(error);
                  }
                );
            }
          );

          // Some issue with our setup and push will not work
          PushNotifications.addListener("registrationError", (error: any) => {
            console.log("Error on registration: " + JSON.stringify(error));
          });

          // Show us the notification payload if the app is open on our device
          PushNotifications.addListener(
            "pushNotificationReceived",
            (notification: PushNotification) => {
              console.log("Push received: " + JSON.stringify(notification));
              this.sendLocalNotification(notification);
            }
          );

          // Method called when tapping on a notification
          PushNotifications.addListener(
            "pushNotificationActionPerformed",
            (notification: PushNotificationActionPerformed) => {
              console.log(
                "Push action performed: " + JSON.stringify(notification)
              );
              this.onCallbackNotification(notification.notification);
            }
          );
        }
      });
    }
  }

  sendLocalNotification(notification) {
    if (!notification.id || !this.localIds[notification.id]) {
      const body: string = notification.body
        ? notification.body
        : notification.data?.body;
      const id = this.makeIdLocalNotification(notification);
      let title: string = notification.title
        ? notification.title
        : notification.data?.title;
      title = !title || title == "" ? "Notificación" : title;

      console.log("LOCALNOT id " + id);
      console.log("LOCALNOT title " + title);
      console.log("LOCALNOT body " + body);

      LocalNotifications.schedule({
        notifications: [
          {
            title: title,
            body: body,
            id: id,
            schedule: { at: new Date(Date.now() + 1000 * 5) },
            iconColor: "#016d38",
            smallIcon: "icon_notification",
            /*extra: {
              data: notification.data
            }*/
          },
        ],
      }).then();

      if (notification.id) {
        this.localIds[notification.id] = notification.id;
      }
    }
  }

  onCallbackNotification(notification) {
    console.log("Notification push callback: " + JSON.stringify(notification));
  }

  onCallbackLocalNotification(notification: LocalNotificationActionPerformed) {
    console.log("Notification local callback: " + JSON.stringify(notification));
  }

  makeIdLocalNotification(notification): number {
    var id = "1";
    for (let index = 0; index < notification.id?.length; index++) {
      if ("0123456789".includes(notification.id[index]) && id.length < 12) {
        id += notification.id[index];
      }
    }

    return parseInt(id);
  }
}
