import { AfterViewInit, Component, Input, NgZone, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ToastService } from "@app/services/toast.service";

import { PopoverController } from "@ionic/angular";
import { ModalHealthComponent } from "../modal-health/modal-health.component";
import { GoogleAnalyticsService } from "../../services/google-analytics.service";
import { AnaliticEvents } from "@app/enums/analitic-events";
import { HealthScoreService } from "@app/services/health-score.service";
import { MessageEnum } from "@app/enums/message-enum";

@Component({
  selector: "app-progress-health-wellness",
  templateUrl: "./progress-health-wellness.component.html",
  styleUrls: ["./progress-health-wellness.component.scss"],
})
export class ProgressHealthWellnessComponent implements OnInit, AfterViewInit {
  public response_wellness = {
    health_indicator: 0,
    body: 0,
    lifestyle: 0,
    feelings: 0,
    yesterday: 0,
  };
  public estadoWell = "";

  @Input() origen: any;
  valor_bienestar_well: number;
  theres_data: boolean;
  current: number;
  max: number;
  stroke: number;
  radius: number;
  semicircle: boolean;
  rounded: boolean;
  responsive: boolean;
  clockwise: boolean;
  color: string;
  background: string;
  duration: number;
  animation: string;
  animationDelay: number;
  animations: string[];
  gradient: boolean;
  realCurrent: number;
  progress: number;
  origin: any;
  ready: boolean;
  playing: boolean = false;
  constructor(
    public modalCtrl: PopoverController,
    public healthScoreService: HealthScoreService,
    public toastService: ToastService,
    public router: Router,
    private gaService: GoogleAnalyticsService,
    public ngZone: NgZone
  ) {}
  ngAfterViewInit(): void {}

  ngOnInit(): void {
    this.getHealthIndexWell();
  }

  async ionViewWillEnter() {
    console.log("ionViewWillEnter");

    setTimeout(() => {
      this.origin = this.origen;
      this.getHealthIndexWell();
      this.ngZone.run(() => {
        this.playing = true;
      });
    }, 8000);
  }

  valid_graph_wellness(puntaje: number) {
    if (puntaje != 0) {
      this.theres_data = true;
    }
  }

  verGraficaWell(response) {
    this.graphWell(response);
  }

  getHealthIndexWell() {
    this.response_wellness = {
      health_indicator: 0,
      body: 0,
      lifestyle: 0,
      feelings: 0,
      yesterday: 0,
    };

    this.healthScoreService.getHealthScore().subscribe(
      (res: any) => {
        if (res.hashErrors) {
          this.toastService.showMessage(
            MessageEnum.ERROR_GET,
            null,
            null,
            "top",
            "danger"
          );
          return;
        }

        if (!res.data) {
          this.verGraficaWell(this.response_wellness);
          return;
        }

        this.response_wellness.health_indicator = Number(res.data.score);
        this.response_wellness.yesterday = Number(res.data.yesterday);
        this.response_wellness.body = Number(res.data.components.body);
        this.response_wellness.feelings = Number(res.data.components.feelings);
        this.response_wellness.lifestyle = Number(
          res.data.components.lifestyle
        );
        this.estadoActualWell(this.response_wellness.health_indicator);
        this.verGraficaWell(this.response_wellness);
      },
      (error) => {
        this.toastService.showMessage(
          MessageEnum.ERROR_GET,
          null,
          null,
          "top",
          "danger"
        );
      }
    );
  }

  graphWell(response) {
    this.valor_bienestar_well = response.health_indicator;
    this.current = this.valor_bienestar_well;
    this.max = this.current == 0 ? this.current : 1000;
    this.stroke = 13;
    this.radius = 120;
    this.semicircle = false;
    this.rounded = true;
    this.responsive = true;
    this.clockwise = true;
    this.color = "#FFFFFF";
    this.background = "#f5f6f9";
    this.duration = 1000;
    this.animation = "easeOutCubic";
    this.animationDelay = 100;
    this.animations = [];
    this.gradient = true;
    this.progress = this.current;
    this.ready = true;
    this.valid_graph_wellness(this.valor_bienestar_well);
  }

  async callModalWellness() {
    let profileModalWeell = await this.modalCtrl.create({
      component: ModalHealthComponent,
      cssClass: "pop-over-style",
      componentProps: {
        from: "wellness",
      },
      showBackdrop: false,
      backdropDismiss: true,
    });

    profileModalWeell.onDidDismiss().then((res) => {
      setTimeout(() => {
        this.ionViewWillEnter();
      }, 200);
    });

    return await profileModalWeell.present();
  }

  goToWellness() {
    this.router.navigate(["/wellness"]);
  }

  goToFeeling() {
    this.gaService.trackEvent(AnaliticEvents.BI_AN_BTN);
    this.router.navigate(["/feeling"]);
  }

  goToBody() {
    this.gaService.trackEvent(AnaliticEvents.BI_CU_BTN);
    this.router.navigate(["/body"]);
  }

  goToLifestyle() {
    this.gaService.trackEvent(AnaliticEvents.BI_EV_BTN);
    this.router.navigate(["/lifestyle"]);
  }

  info(){
    this.router.navigate(["/wellness-info"]);
  }

  estadoActualWell(indicador){
    if(indicador <= 480){
      this.estadoWell = "Deficiente";
    }else if(indicador > 480 && indicador <= 550){
      this.estadoWell = "Regular";
    }else if(indicador > 550 && indicador <= 610){
      this.estadoWell = "Buena";
    }else if(indicador > 610 && indicador <= 680){
      this.estadoWell = "Muy buena";
    }else if(indicador > 680){
      this.estadoWell = "Excelente";
    }
  }
}
