import { NgModule, LOCALE_ID, APP_INITIALIZER } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouteReuseStrategy } from "@angular/router";

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app-routing.module";

import { ComponentsModule } from "./components/components.module";
import { PipesModule } from "./pipes/pipes.module";

import { AppConnectionService } from "./interceptors/app-connection.service";
import { ScreenOrientation } from "@ionic-native/screen-orientation/ngx";
import localeEsCo from "@angular/common/locales/es-CO";
import { registerLocaleData } from "@angular/common";
import { EmailComposer } from "@ionic-native/email-composer/ngx";
import { FirebaseAnalytics } from "@ionic-native/firebase-analytics/ngx";
import { InAppBrowser } from "@ionic-native/in-app-browser/ngx";
import { Health } from "@ionic-native/health/ngx";

import { TokenInterceptor, SecureInterceptor } from "qrpass-widgets";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { Deeplinks } from "@ionic-native/deeplinks/ngx";
import { NotificationsService } from "./services/notifications.service";
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { LottieModule } from 'ngx-lottie';
import player from 'lottie-web';


export function servicesOnRun(config: NotificationsService) {
  return () => config.checkNewNotifications();
}

export function playerFactory() {
  return player;
}


registerLocaleData(localeEsCo, "es-Co");

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    ComponentsModule,
    PipesModule,
    BrowserAnimationsModule,
    LottieModule.forRoot({ player: playerFactory })
  ],
  providers: [
    ScreenOrientation,
    StatusBar,
    SplashScreen,
    {
      provide: RouteReuseStrategy,
      useClass: IonicRouteStrategy,
    },
    FirebaseAnalytics,
    EmailComposer,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AppConnectionService,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: SecureInterceptor,
      multi: true,
    },
    {
      provide: LOCALE_ID,
      useValue: "es-Co",
    },
    InAppBrowser,
    Health,
    Deeplinks,
    {
      provide: APP_INITIALIZER,
      useFactory: servicesOnRun,
      multi: true,
      deps: [NotificationsService],
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
