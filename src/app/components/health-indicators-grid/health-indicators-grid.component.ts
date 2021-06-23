import { Component, OnInit } from "@angular/core";
import { HealthIndicators } from "../../interfaces/health-indicators.interface";
import { DacadooIndicatorsService } from "../../services/dacadooIndicators.service";
import { AuthService } from "../../services/auth.service";
import {
  AppHttpResponse,
  TrackHttpError,
} from "@app/interfaces/app-http-response.interface";
import { Subject } from "rxjs";
import { ToastService } from "../../services/toast.service";

@Component({
  selector: "app-health-indicators-grid",
  templateUrl: "./health-indicators-grid.component.html",
  styleUrls: ["./health-indicators-grid.component.scss"],
})
export class HealthIndicatorsGridComponent implements OnInit {
  indicators: HealthIndicators;
  subscriptions = new Subject();

  constructor(
    private dacadooIndicatorsService: DacadooIndicatorsService,
    private toastService: ToastService,
    private authService: AuthService
  ) {}

  async ngOnInit() {
    await this.getData();
  }

  async ionViewDidEnter() {
    await this.getData();
  }

  ionViewDidLeave(): void {
    console.log("FEELING => ON DESTROY");
    this.subscriptions.next();
    this.subscriptions.complete();
  }

  async getData() {
    var email = await this.authService.email();
    this.dacadooIndicatorsService.getByEmail(email).subscribe(
      (response: AppHttpResponse<HealthIndicators>) => {
        if (response.hasErrors) {
          console.log(response);
          return;
        }
        this.indicators = response?.body;
        console.log("this.indicators", this.indicators);
      },
      (error: TrackHttpError) => {
        console.log(error.friendlyMessage);
      }
    );
  }
}
