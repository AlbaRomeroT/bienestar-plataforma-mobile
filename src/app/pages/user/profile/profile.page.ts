import { Component, OnInit, ViewChild, Input, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import { NavigatorRouteServiceService } from "../../../services/navigator-route-service.service";
import { IonSegment } from "@ionic/angular";
import { Subject } from "rxjs";
import { environment } from "@environments/environment";

@Component({
  selector: "app-profile",
  templateUrl: "./profile.page.html",
  styleUrls: ["./profile.page.scss"],
})
export class ProfilePage implements OnInit, OnDestroy {
  public photo = "/assets/menu/profile-without-photo.svg";
  @ViewChild(IonSegment, { static: true }) segment: IonSegment;
  showPerfil: boolean = true;
  showProfesional: boolean = false;
  showFamily: boolean = false;

  @Input()
  public pathBack: string;
  parentEvent: Subject<any> = new Subject();
  public currentTab: string = "Perfil";

  public isProduction: boolean = false;

  constructor(
    private navigatorProfileService: NavigatorRouteServiceService,
    private router: Router
  ) {
    this.isProduction = environment.production;
  }

  ngOnDestroy(): void {
    console.log("Destruyendo padre..");
    this.showPerfil = false;
  }

  ngOnInit() {
    console.log("Loading parent ngOnInit..");
  }

  ionViewWillEnter() {
    this.ngOnInit();
    console.log("Loading parent ionViewWillEnter..");
    this.currentTab = "Perfil";
    this.segment.value = "Perfil";
    this.setTab("Perfil");

    this.pathBack = this.navigatorProfileService.getBackUrl();
    if (this.navigatorProfileService.getBackUrl() === "/profile") {
      this.pathBack = "/";
    }
    if (this.navigatorProfileService.getBackUrl() === "/not-connection") {
      this.pathBack = this.navigatorProfileService.getPreviusPageUrl();
    }
    this.router
      .navigateByUrl("/profile", { skipLocationChange: true })
      .then(() => {
        this.router.navigate(["/profile"]);
      });
  }

  ionViewWillLeave() {
    this.ngOnDestroy();
    this.segment.value = "Perfil";
    this.parentEvent.next(`page_destroy`);
  }

  tabChange(tab): void {
    const currentTabInfo = tab.detail.value;
    this.setTab(currentTabInfo);
  }

  private setTab(currentTabInfo: string): void {
    if (currentTabInfo === "Perfil") {
      this.showPerfil = true;
      this.showProfesional = false;
      this.showFamily = false;
    }
    if (currentTabInfo === "Profesional") {
      this.showPerfil = false;
      this.showProfesional = true;
      this.showFamily = false;
    }
    if (currentTabInfo === "Family") {
      this.showPerfil = false;
      this.showProfesional = false;
      this.showFamily = true;
    }
  }
}
