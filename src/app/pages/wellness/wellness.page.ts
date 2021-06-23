import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "../../services/auth.service";
import { CarnetService } from "../../services/carnet.service";
import { IHealthCard } from "@app/interfaces/health-card.interface";
import { TrackHttpError } from "@app/interfaces/app-http-response.interface";
import { NavController } from '@ionic/angular';
import { NavigationBackService } from "@app/services/navigation-back.service";
import { environment } from "@environments/environment";

@Component({
  selector: "app-wellness",
  templateUrl: "./wellness.page.html",
  styleUrls: ["./wellness.page.scss"]
})

export class WellnessPage implements OnInit {
  selectedTab: string;
  reloading = false;
  // this variable is used to avoid the navigate action when the page is loaded for the first time 
  firtsTime = true;
  isClient = false;
  public isProduction: boolean = false;

  constructor(
    public router: Router,
    private authService: AuthService,
    private carnetService: CarnetService,
    private route: ActivatedRoute,
    public navCtrl: NavController,
    public navigationBackService : NavigationBackService
  ) {
    this.isProduction = environment.production;
  }

  ngOnInit() {
    this.navigationBackService.initialize();
  }

  async ionViewDidEnter() {
    this.reloading = false;
    this.firtsTime = true;
    this.selectedTab = null;
    this.getQueryParams();
    await this.isClientOrNotSB();
  }

  async ionViewDidLeave() {
    this.reloading = true;
  }

  getQueryParams() {
    setTimeout(() => {
      this.firtsTime = true;
      console.log("getQueryParams - selectedTab => ", this.selectedTab);
      var snapshot = this.route.snapshot;
      var segment = snapshot.paramMap.get("segment");
      console.log("getQueryParams - segment => ", segment);
      this.selectedTab = segment;
    }, 400);
  }

  goToCommunity() {
    this.router.navigate(["community"]);
  }

  segmentChanged(event: any) {

    if(this.firtsTime){
      this.firtsTime = false;
      return;
    }
    console.log("segmentChanged - selectedTab => ", this.selectedTab);
    console.log("segmentChanged - event => ", event);

    if(!event.detail.value){
      return;
    }

    this.selectedTab = event.detail.value;

    var path = `wellness/${event.detail.value}`;
    console.log("segmentChanged - path 1 => ", path);

    console.log("segmentChanged - path 2 => ", path);
    this.navCtrl.navigateForward(path, { animated: false });  
  }

  async isClientOrNotSB() {
    var profile = await this.authService.profile();

    this.carnetService.get(profile.documentType, profile.document).subscribe(
      (response: IHealthCard[]) => {
        this.isClient = response.length > 0;
      },
      (error: TrackHttpError) => {
        console.log(error);
      }
    );
  }
}
