import { AfterViewInit, Component, Input, NgZone, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ToastService } from "@app/services/toast.service";

import { PopoverController } from "@ionic/angular";
import { ModalHealthComponent } from "../modal-health/modal-health.component";
import { GoogleAnalyticsService } from "@app/services/google-analytics.service";
import { AnaliticEvents } from "@app/enums/analitic-events";
import { HealthScoreService } from "@app/services/health-score.service";
import { MessageEnum } from "@app/enums/message-enum";

@Component({
  selector: "app-progress-health",
  templateUrl: "./progress-health.component.html",
  styleUrls: ["./progress-health.component.scss"],
})
export class ProgressHealthComponent implements OnInit, AfterViewInit {
  public goFeeling = "/feeling";
  public goLifestyle = "/lifestyle";
  public estado = "";

  public response = {
    health_indicator: 0,
    body: 0,
    lifestyle: 0,
    feelings: 0,
    yesterday: 0,
  };

  @Input() origen: any;
  valor_bienestar: number;
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
  valor_bienestar2: number;
  current2: number;
  max2: number;
  stroke2: number;
  radius2: number;
  semicircle2: boolean;
  rounded2: boolean;
  responsive2: boolean;
  clockwise2: boolean;
  color2: string;
  background2: string;
  duration2: number;
  animation2: string;
  animationDelay2: number;
  animations2: string[];
  gradient2: boolean;
  realCurrent2: number;
  progress2: number;
  origin: any;
  ready: boolean;
  title: string = "Mi índice de salud";
  reloading = false;
  playing: boolean = false;
  constructor(
    public modalCtrl: PopoverController,
    public healthScoreService: HealthScoreService,
    public toastService: ToastService,
    public router: Router,
    private gaService: GoogleAnalyticsService,
    private ngZone: NgZone
  ) {}

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.origin = this.origen;
      this.getHealthIndex();
      this.ngZone.run(() => {
        this.playing = true;
      });
    }, 1500);
  }

  async ionViewWillEnter() {
    console.log("ionViewWillEnter");

    setTimeout(() => {
      this.origin = this.origen;
      this.getHealthIndex();
      this.ngZone.run(() => {
        this.playing = true;
      });
    }, 8000);
  }

  ngOnInit(): void {
    this.origin = this.origen;
    this.getHealthIndex();
  }

  valid_graph(puntaje: number) {
    console.log(puntaje);
    if (puntaje != 0) {
      this.theres_data = true;
    }
  }

  verGrafica(response) {
    this.graph(response);
  }

  getHealthIndex() {
    this.healthScoreService.getHealthScore().subscribe(
      (res: any) => {
        if (!res.data) {
          this.verGrafica(this.response);
          return;
        }

        this.response.health_indicator = Number(res.data.score);
        this.response.yesterday = Number(res.data.yesterday);
        this.response.body = Number(res.data.components.body);
        this.response.feelings = Number(res.data.components.feelings);
        this.response.lifestyle = Number(res.data.components.lifestyle);

        this.estadoActual(this.response.health_indicator);
        this.verGrafica(this.response);
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

  graph(response: any) {
    this.valor_bienestar = response.health_indicator;
    this.current = this.valor_bienestar;
    this.max = this.current == 0 ? this.current : 1000;
    this.stroke = 13;
    this.radius = 120;
    this.semicircle = false;
    this.rounded = true;
    this.responsive = true;
    this.clockwise = true;
    this.color = "";
    this.background = "#f5f6f9";
    this.duration = 1000;
    this.animation = "easeOutCubic";
    this.animationDelay = 10;
    this.animations = [];
    this.gradient = true;
    this.realCurrent = 100;
    this.progress = this.current;
    this.ready = true;
    this.valid_graph(this.valor_bienestar);
  }

  async callModal() {
    let profileModal = await this.modalCtrl.create({
      component: ModalHealthComponent,
      cssClass: "pop-over-style",
      componentProps: {
        from: "home",
      },
      showBackdrop: false,
      backdropDismiss: true,
    });

    profileModal.onDidDismiss().then((res) => {
      setTimeout(() => {
        this.ionViewWillEnter();
      }, 8000);
    });

    return await profileModal.present();
  }

  goToWellness() {
    this.gaService.trackEvent(AnaliticEvents.HO_MB_BTN);
    this.router.navigate(["/wellness/my-wellness"]);
  }

  goToBody() {
    // track button body
    this.gaService.trackEvent(AnaliticEvents.BI_CU_BTN);
    this.router.navigate(["/body"]);
  }

  info(){
    this.router.navigate(["/wellness-info"]);
  }
  
  estadoActual(indicador){
    if(indicador <= 480){
      this.estado = "Deficiente";
    }else if(indicador > 480 && indicador <= 550){
      this.estado = "Regular";
    }else if(indicador > 550 && indicador <= 610){
      this.estado = "Buena";
    }else if(indicador > 610 && indicador <= 680){
      this.estado = "Muy buena";
    }else if(indicador > 680){
      this.estado = "Excelente";
    }
  }
}
