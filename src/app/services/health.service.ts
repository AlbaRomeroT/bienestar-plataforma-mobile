import { Injectable } from "@angular/core";
import { Health } from "@ionic-native/health/ngx";
import { Platform } from "@ionic/angular";
import * as moment from "moment";
import { environment } from "src/environments/environment";
import { HttpClient } from "@angular/common/http";
import { Observable, Subject } from "rxjs";
import {
  AppHttpResponse,
  TrackHttpError,
} from "@app/interfaces/app-http-response.interface";
import { ToastService } from "@app/services/toast.service";


@Injectable({
  providedIn: "root",
})
export class HealthStepsService {
  intervalRead = 60000;
  interval;
  private healthConnectedSubject = new Subject<void>();
  public healthConnectedObservable = this.healthConnectedSubject.asObservable();

  constructor(
    private health: Health,
    private platform: Platform,
    private http: HttpClient,
    private toastService: ToastService
  ) {}

  initStepsRead(): void {
    this.platform.ready().then(() => {
      this.startIntervalStepsRequest();
    });
  }

  startIntervalStepsRequest() {
    this.health.promptInstallFit();
    this.getUserStepsFromHealthServices();
    this.interval = setInterval(() => {
    this.getUserStepsFromHealthServices();
    }, this.intervalRead);
  }

  getUserStepsFromHealthServices() {
    this.health
      .isAvailable()
      .then((available: boolean) => {
        this.doRequestAuthorization();
      })
      .catch((error) =>
        console.log(
          `Falla consultando informaci\u00f3n, servicio no instalado ${error}`
        )
      );
  }

  doRequestAuthorization() {
    this.health
      .requestAuthorization([
          "distance", "steps", "height", "weight", "calories.active", "activity", "heart_rate.resting", "heart_rate",
          "blood_glucose", "mindfulness"
      ])
      .then((response) => {
        this.setHealthServiceConnected(true);
        this.showContinueComponent();
        this.doStepsQuery();
      })
      .catch((error) => {
        this.setHealthServiceConnected(false);
        console.log(
          `Falla consultando informaci\u00f3n, autorizaci\u00f3n denegada. ${error}`
        );
      });
  }

  doStepsQuery(){  

   let initDateUTC=moment(moment().format('YYYY-MM-DD 00:00:00')).toDate();
   let endDateUTC=moment(moment().format('YYYY-MM-DD 23:59:59')).toDate();

    this.health
      .queryAggregated({
        startDate: initDateUTC,
        endDate: endDateUTC,
        dataType: "steps",
      })
      .then((data) => {     
        this.doParseStepInfo(initDateUTC, endDateUTC, data);
      })
      .catch((e) => {
        console.error(`Falla consultando informaci\u00f3n de pasos ${e}`);
      });    
  } 

  doParseStepInfo(initTime, endTime, stepsInfo:any) {
    console.log("stepsInfo:" + JSON.stringify(stepsInfo));       
    const stepsSummay = {   
      time: moment(initTime).utc().format("YYYY-MM-DDTHH:mm:ss[Z]"),
      endTime: moment(endTime).utc().format("YYYY-MM-DDTHH:mm:ss[Z]"),
      steps: stepsInfo.value,
    };
    console.log("stepsSummay:" + JSON.stringify(stepsSummay));
    if (stepsInfo.value != 0) {
      this.doSave(stepsSummay);
    }
  }

  private doSave(stepsSummay) {
   this.save(stepsSummay).subscribe(
      (response: AppHttpResponse<any>) => {
        if (response.hasErrors) {
          this.toastService.showMessage(response.errors[0].errorDescription);
          return;
        }
      },
      (error) => {
        console.error(
          `Ha ocurrido un error ejecutando la petici\u00f3n ${error}`,
          error
        );
      }
    );
  }

  private save(stepsSummay): Observable<void | TrackHttpError> {
    console.log(`==> persistiendo stepsSummay ${JSON.stringify(stepsSummay)}`);

    const url = `${environment.bienestarUrlApi}/bienestar/activity/addSteps`;
    return this.http.post<null>(url, stepsSummay);
  }

  setHealthServiceConnected(conn: boolean) {
    if (conn) {
      localStorage.setItem("isHealthServiceConnected", "true");
    } else {
      localStorage.setItem("isHealthServiceConnected", "false");
    }
  }

  isHealthServiceConnected() {
    const isHealthServiceConnected = localStorage.getItem(
      "isHealthServiceConnected"
    );
    if (isHealthServiceConnected && isHealthServiceConnected == "true") {
      return true;
    } else {
      return false;
    }
  }

  runHealthSync() {
    if (this.isHealthServiceConnected()) {
      this.initStepsRead();
    }
  }

  disconnect() {
    clearInterval(this.interval);
    this.setHealthServiceConnected(false);
  }

  getLastUpdate() {
    return localStorage.getItem("lastUpdateHealth");
  }

  showContinueComponent(): void {
    this.healthConnectedSubject.next();
  }
}
