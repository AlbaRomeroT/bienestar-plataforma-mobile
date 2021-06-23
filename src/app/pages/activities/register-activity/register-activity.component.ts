import { Component, NgZone, OnDestroy, OnInit,ViewChild } from "@angular/core";
import {
  ActivatedRoute,
  NavigationEnd,
  NavigationStart,
  ParamMap,
  Router,
} from "@angular/router";
import { ModalActivitiesComponent } from "@app/components/modal-activities/modal-activities.component";
import { ModalNotConnectionComponent } from "@app/components/modal-not-connection/modal-not-connection.component";
import { AnaliticEvents } from "@app/enums/analitic-events";
import { MessageEnum } from "@app/enums/message-enum";
import { DacadooChronometerService } from "@app/services/dacadoo-chronometer.service";
import { GoogleAnalyticsService } from "@app/services/google-analytics.service";
import { NavigationBackService } from "@app/services/navigation-back.service";
import { ProfileService } from "@app/services/profile.service";
import { ToastService } from "@app/services/toast.service";
import { ModalController, Platform } from "@ionic/angular";
import * as moment from "moment";


import { DacadooMovesService } from "@app/services/dacadoo-moves.service";
import { DacadooCatalogsService } from "@app/services/dacadoo-catalogs.service";
import { Move } from "@app/models/dacadoo/move";
import { Activity } from "@app/models/dacadoo/activity";
import { IonInfiniteScroll } from "@ionic/angular";
import { StoreService } from "@app/services/store.service";
import { ActivitiesPage } from "../activities.page";


export interface SaveActivityInterface {
  activity?: string;
  type?: string;
  acquisition?: string;
  time?: string;
  duration?: number;
  id?: string;
  endTime?: string;
  delete?: boolean;
}


@Component({
  selector: "app-register-activity",
  templateUrl: "./register-activity.component.html",
  styleUrls: ["./register-activity.component.scss"],
})
export class RegisterActivityComponent implements OnInit, OnDestroy {
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  public lastUserActivities: Move[];
  public activities: Activity[];
  public activitiesLocal: Activity[];
  public activitiesFilter: Activity[];
  private countScroll: number = 15;
  public maxActivitiesShow: number;
  public filterActivity: string;
  isConnected: boolean;
  spinner:boolean=false;
  interval: any;
  interval_2: any;
  testConfig: any;
  current: number = 0;
  max: number = 60;
  stroke: number = 8;
  radius: number = 90;
  semicircle: boolean = false;
  rounded: boolean = true;
  responsive: boolean = false;
  clockwise: boolean = true;
  color: string = "#cecece";
  background: string = "#efefef";
  duration: number = 800;
  animation: string = "easeInCirc";
  animationDelay: number = 0;
  animations: Array<string> = [];
  gradient: boolean = true;
  realCurrent: number = 0;
  actividad: string = "ciclísmo";
  play: boolean = true;
  pause: boolean;
  resumen: boolean;
  calories = 5;
  caloriesFull = "0";
  key = "";
  public data: SaveActivityInterface;
  public id: string = "";
  counter = 0;
  navigationSubscription;
  norm: any;
  clock: any;
  fulltime: number = 0;
  inicio: any;
  subscriptionDisconnectNetwork;
  pauseCounter = 0;
  personWeigth = 0;
  noInternet: boolean;
  public isFinderDisabled: boolean;

  selecteActivitie=null;

  constructor(
    public modalCtrl: ModalController,
    public dacadooSaveActivity: DacadooChronometerService,
    private toastService: ToastService,
    public router: Router,
    private route: ActivatedRoute,
    private profileService: ProfileService,
    private gaService: GoogleAnalyticsService,
    private navigationBackService: NavigationBackService,
    private dacadooMovesService: DacadooMovesService,
    private dacadooCatalogsService: DacadooCatalogsService,
    private storeService: StoreService,
    private platform: Platform,
    private ngZone: NgZone,
    private activity: ActivitiesPage,
  ) {
    this.getProfile();
    this.navigationSubscription = this.router.events.subscribe(
      async (e: any) => {
        // If it is a NavigationEnd event re-initalise the component
        if (e instanceof NavigationEnd) {
          clearInterval(this.interval);
          clearInterval(this.interval_2);
          await this.clearIntervals();
        }
        if (e instanceof NavigationStart) {
          this.caloriesFull = localStorage.getItem("calories");
          setTimeout(async () => {
            clearInterval(this.interval);
            clearInterval(this.interval_2);
            await this.clearIntervals();
          }, 1000);
          this.ngOnInit();
        }
      }
    );

    this.platform.pause.subscribe(() => {});

    // Recupera el estado de la aplicación al máximizar la ventana
    this.platform.resume.subscribe(() => {
      this.ngZone.run(async () => {
        this.isActivityRunning();
      });
    });
  }



  async ngOnDestroy() {
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
      await this.clearIntervals();
    }
    await this.clearIntervals();
  }

  getProfile() {
    let email = localStorage.getItem("email");
    this.profileService.get(email).subscribe((res: any) => {
      let response = this.profileService.decrypRSA(res?.body?.encryptedData);
      res.body = response;
      this.personWeigth = response?.body?.weight;
    });
  }

  ngOnInit(): void {
    window.addEventListener("beforeunload", async () => {
      this.deleteCache();
      localStorage.removeItem("pause-time");
      localStorage.removeItem("paused");
      await this.clearIntervals();
    });
      //Estado inicial del cronómetro
      
      this.counter = 0;
      this.clock = moment()
        .hour(0)
        .minute(0)
        .second(this.counter++)
        .format("HH : mm : ss");

    this.recoverData();
    this.isActivityRunning();


    if (localStorage.getItem("filterActivity")) {
        this.filterActivity = localStorage.getItem("filterActivity");
    }else{
        this.filterActivity = null;
     }
        this.maxActivitiesShow = this.countScroll; 
        this.getActivities();   
  }

  checkInputFocus() {
   
    if(!this.activities||this.activities.length==0){
   
      console.log("cargo focus");
      this.activities=this.activitiesLocal;
    }
    
   // var elem = document.getElementById("ion-fab-green-button");
   // elem.style.display = "none";
  }

  checkInputBlur() {
   
    
    var elem = document.getElementById("ion-fab-green-button");
    elem.style.display = "block";
  }

  checkInputChange() {
   
    if((!this.activities||this.activities.length==0)&&!localStorage.getItem("filterActivity")){
    
      console.log("cargo change");
      this.activities=this.activitiesLocal;
    }
    
  }

 
  recoverData(){
    //Recupera los datos de url ó localstorage
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.actividad = params.get("name")
        ? params.get("name")
        : localStorage.getItem("currentActivity");
      this.key = params.get("key")
        ? params.get("key")
        : localStorage.getItem("keyActivity");
      this.calories = Number(params.get("norm"))
        ? Number(params.get("norm"))
        : Number(localStorage.getItem("normActivity"));
    });
}

async isActivityRunning() {
  console.log("isActivityRunning");
  console.log();
  
  
this.id = "";
this.fulltime = 0;
let initTime = localStorage.getItem("initTime");
let secondPause = localStorage.getItem("secondsPause");
this.caloriesFull = localStorage.getItem("calories");
var isPaused = localStorage.getItem("paused");
var idActiv = localStorage.getItem("idActivity");



await this.clearIntervals();

if(idActiv && !initTime){
  this.deleteCache();
  this.caloriesFull = "0";
  localStorage.removeItem('calories');
  localStorage.removeItem("filterActivity");
  this.filterActivity='';
  this.caloriesFull = null;
  return;
 }

//Recuperar el tiempo del reloj
if (initTime && !isPaused) {
  var startTime = new Date(initTime);
  var endTime = new Date();
  var difference = endTime.getTime() - startTime.getTime();
  var resultInMinutes = difference / 60000;

  this.id = localStorage.getItem("idActivity");
  this.counter = resultInMinutes * 60;
  this.fulltime = this.counter;
  this.clock = moment()
    .hour(0)
    .minute(0)
    .second(this.counter++)
    .format("HH : mm : ss");
  this.current = Number(this.clock.substring(10, 12));
  this.startTimer();
}

//Cuando navegas la app y dejas el crono pausado, acá recuperamos el tiempo
if (isPaused) {
  if (secondPause) {
    this.pauseCounter = Number(secondPause);
  }
  
  this.pauser();
  this.id = localStorage.getItem("idActivity");
  this.counter = this.pauseCounter;
  this.fulltime = this.counter;
  this.clock = moment()
    .hour(0)
    .minute(0)
    .second(this.counter++)
    .format("HH : mm : ss");
  this.current = Number(this.clock.substring(10, 12));
}
}

//Validamos si han transcurrido 17 horas parar la actividad
validSeventeenHours(_segunditos: number) {
if (_segunditos >= 61200) {
  this.stopTimer();
}
}

async startTimer() {
if (this.resumen) {
  this.gaService.trackEvent(AnaliticEvents.AC_RA_BTN);
} else {
  this.gaService.trackEvent(AnaliticEvents.AC_IA_BTN);
}
await this.validateStart();


if (!window.navigator.onLine && this.fulltime == 0) {
  this.toastService.showMessage(
    `No puede iniciar la actividad, no tiene conexión a internet`
  );
  return;
}


this.startPlay();
if (!localStorage.getItem("currentActivity")) {
  localStorage.setItem("currentActivity", this.actividad);
  localStorage.setItem("initTime", moment().format());
  
  localStorage.setItem("keyActivity", this.key);
  localStorage.setItem("normActivity", this.calories + "");
}
//Despues de pausar el crono, borramos el flag de pausa
var isPaused = localStorage.getItem("paused");

if (isPaused) {
  localStorage.removeItem("paused");
  localStorage.setItem("pause-time", moment().format());
}
this.saveIntervalActivity();
this.startInterval();

}

startInterval(){
this.interval = setInterval(() => {
  this.clock = moment()
    .hour(0)
    .minute(0)
    .second(this.counter++)
    .format("HH : mm : ss");
  this.current = this.current == 60 ? (this.current = 0) : this.current;
  this.current = this.current + 1;
  this.fulltime = this.fulltime + 1;
  this.validSeventeenHours(this.current);
}, 1000);
}

async pauseTimer() {
await this.clearIntervals();
this.pauser();
localStorage.setItem("secondsPause", this.fulltime + "");
localStorage.setItem("paused", "1");
localStorage.setItem("pause-time", moment().format());
}

deleteCache() {
localStorage.removeItem("currentActivity");
localStorage.removeItem("initTime");
localStorage.removeItem("keyActivity");
localStorage.removeItem("normActivity");
localStorage.removeItem("secondsPause");
localStorage.removeItem("calories");
localStorage.removeItem("idActivity");
localStorage.removeItem("paused");
localStorage.removeItem("filterActivity");
this.id=null;
this.filterActivity='';
}

//Stop, pauser, startPlay son los método encargados de mostrar/esconder los íconos.
stop() {
this.pause = false;
this.play = true;
this.resumen = false;
this.isFinderDisabled=false;
}

pauser() {
this.pause = false;
this.resumen = true;
this.isFinderDisabled=true;
}

startPlay() {
this.pause = true;
this.play = false;
this.resumen = false;
this.isFinderDisabled=true;
}

//validamos que no pueda iniciar o para la actividad sin antes iniciarlas
validActions(flag) {
return new Promise((resolve, _reject) => {
  if (this.current == 0 && flag == "1") {
    this.toastService.showMessage(
      `No puedes cancelar sin antes iniciar la actividad`
    );
    return;
  }
  if (this.current == 0 && flag == "2") {
    this.toastService.showMessage(
      `No puedes guardar sin antes iniciar la actividad`
    );
    return;
  }
  resolve();
});
}


//validamos que no pueda iniciar o para la actividad sin antes iniciarlas
validateStart() {
  return new Promise((resolve, _reject) => {
    
    if (!localStorage.getItem("filterActivity")) {
      this.toastService.showMessage(
        `Debe seleccionar una activiad antes de iniciar el cronometro`
      );
      return;
    }
   resolve();
  });
  }

async modalDelete(flag?) {
    
if (!window.navigator.onLine) {
  await this.checkInternetConnection();
  return;
}

if (this.current != 0) {
  let profileModal = await this.modalCtrl.create({
    component: ModalActivitiesComponent,
    cssClass: "activities-actions-modal-delete",
    componentProps: {
      action: "del",
      title: "¿Está seguro de eliminar esta actividad?",
      description: "Esta acción no se podrá deshacer.",
    },
  });
  profileModal.onDidDismiss().then(async (res) => {
      if (res?.data?.dismissed == "Acepta") {
        if (!window.navigator.onLine) {
          await this.checkInternetConnection();
          return;
        }
        this.fulltime = 0;
        this.calories = 0;
        this.stopTimer();
        if (flag == 1) {
          this.navigationBackService.revertTo("/activities");
          this.router.navigate(["/activities", { historical: "register" }]);
          await this.clearIntervals();
        }
      }
  });
  return await profileModal.present();
} else {
  this.navigationBackService.revertTo("/activities");
  this.router.navigate(["/activities", { historical: "register" }]);
  await this.clearIntervals();
}
}

async modalSave() {
  
  
//se adiciona el modal cuando no hay conexi\u00f3n a internet..
if (!window.navigator.onLine) {
  await this.checkInternetConnectionSave();
  return;
}

await this.validateStart();

let profileModal = await this.modalCtrl.create({
  component: ModalActivitiesComponent,
  cssClass: "activities-actions-modal-save",
  componentProps: {
    action: "save",
    title: "¿Desea registrar su actividad?",
    description: "Podrá verla en su historial de actividades.",
  },
});
profileModal.onWillDismiss().then(async(res) => {
  if (res.data != undefined) {
    if (res.data.dismissed == "Acepta") {
      //se adiciona el modal cuando no hay conexi\u00f3n a internet..
      if (!window.navigator.onLine) {
        await this.checkInternetConnectionSave();
        return;
      }
      this.saveActivity();
    } else if (res.data.dismissed == "rechaza") {
      this.startTimer();
    }
  }
});
return await profileModal.present();
}

async callModal(flag) {

  
await this.validActions(flag);
if (flag == "1") {
  this.gaService.trackEvent(AnaliticEvents.AC_BA_BTN);
  this.modalDelete();
} else {
  this.gaService.trackEvent(AnaliticEvents.AC_GA_BTN);
  this.modalSave();
}
}

async saveActivity() {
this.gaService.trackEvent(AnaliticEvents.AC_RGA_BTN);
await this.clearIntervals();
this.spinner = true;
this.data = {};
this.inicio = localStorage.getItem("initTime");
this.data.duration = Math.round(Number(this.fulltime));
this.data.time = moment(this.inicio).format("YYYY-MM-DDTHH:mm:ss[Z]");
let time: any = this.data.time;

this.data.activity = this.key;
let end: any = moment(time).add(this.duration, "seconds");
this.data.endTime = end.utc().format("YYYY-MM-DDTHH:mm:ss[Z]");

if (this.id != "") {
  this.data.id = this.id;
}
this.data.delete = false;

this.stop();
await this.clearIntervals();
this.dacadooSaveActivity
  .saveIntercalsActivity(this.data)
  .subscribe(
    (success: any) => {
      this.caloriesFull = "0";
      this.stop();
      this.current = 0;
      this.deleteCache();
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
  )
  .add(() => {
    setTimeout(() => {
      this.stop();
      this.deleteCache();
      this.spinner = false;
      this.navigationBackService.revertTo("/activities");
      this.activity.selectedTab = "historical";
    }, 4000);
  });
}

// Guadar cada minuto la actividad para obteber el energy y calcular las KCAL
saveIntervalActivity() {
this.interval_2 = setInterval((res) => {

  if(!window.navigator.onLine){
    return;
  }
  console.log("     ------     ", this.fulltime);
  this.data = {};
  this.inicio = localStorage.getItem("initTime");
  this.inicio = moment(this.inicio).format("YYYY-MM-DDTHH:mm:ss[Z]");
  this.data.duration = Math.round(Number(this.fulltime));
  this.data.time = this.inicio;
  this.data.activity = this.key;
  this.data.id = this.id == "" ? null : this.id;
  this.data.delete = false;
  this.dacadooSaveActivity.saveIntercalsActivity(this.data).subscribe(
    (success: any) => {
      this.id = success.body.data.id;
      localStorage.setItem("idActivity", this.id + "");
      this.caloriesFull =
        Math.round(Number(success.body.data.energy / 4184)) + "";
      localStorage.setItem(
        "calories",
        Math.round(Number(success.body.data.energy / 4184)) + ""
      );
    },
    (error) => {
      console.log(
        "No se pudo hacer el guardado temporal de la actividad: ",
        error
      );
    }
  );
}, 10000);
}

//Método para detener el reloj
async stopTimer() {
this.data = {};
this.stop();
await this.clearIntervals();
this.counter = 0;
this.clock = moment()
  .hour(0)
  .minute(0)
  .second(this.counter++)
  .format("HH : mm : ss");
this.caloriesFull = "0";
this.calories = 0;
this.current = 0;
this.deleteCache();
this.data.delete = true;
this.data.id = this.id;
this.dacadooSaveActivity.saveIntercalsActivity(this.data).subscribe(
  async (success) => {
    this.deleteCache();
    await this.clearIntervals();
    this.navigationBackService.revertTo("/activities");
    this.router.navigate(["/activities"]);
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

async stopTimer_only() {
this.data = {};
this.stop();
await this.clearIntervals();
this.counter = 0;
this.clock = moment()
  .hour(0)
  .minute(0)
  .second(this.counter++)
  .format("HH : mm : ss");
this.caloriesFull = "0";
this.calories = 0;
this.current = 0;
this.deleteCache();
this.data.delete = true;
}

async clearIntervals() {
clearInterval(this.interval);
clearInterval(this.interval_2);
let promises = [];
let interval_promise1 = new Promise((resolve, reject) => {
  for (var i = 1; i < this.interval; i++) {
    window.clearInterval(i);
  }
  resolve();
});

let interval_promise2 = new Promise((resolve, reject) => {
  for (var j = 1; j < this.interval_2; j++) {
    window.clearInterval(j);
  }
  resolve();
});

promises.push(interval_promise1);
promises.push(interval_promise2);
return Promise.all(promises);

}

async checkInternetConnection() {
//se adiciona el modal cuando no hay conexi\u00f3n a internet..

  let profileModal = await this.modalCtrl.create({
    component: ModalNotConnectionComponent,
    cssClass: "activities-actions-modal-save",
    componentProps: {
      action: "save",
      description: "Pruebe nuevamente ahora o en un par de minutos",
    },
  });

  profileModal.onWillDismiss().then((res) => {
    if (res.data != undefined) {
      if (res.data.dismissed == "tryAgain") {
        this.modalDelete();
      }
    }
  });
  return await profileModal.present();

}

async checkInternetConnectionSave(){
//se adiciona el modal cuando no hay conexi\u00f3n a internet..

  let profileModal = await this.modalCtrl.create({
    component: ModalNotConnectionComponent,
    cssClass: "activities-actions-modal-save",
    componentProps: {
      action: "save",
      description: "Pruebe nuevamente ahora o en un par de minutos",
    },
  });

  profileModal.onWillDismiss().then((res) => {
    if (res.data != undefined) {
      if (res.data.dismissed == "tryAgain") {
        this.modalSave();
      }
    }
  });

  return await profileModal.present();
}
goToBody() {
  this.gaService.trackEvent(AnaliticEvents.BI_CU_BTN);
  this.router.navigate(["/body"]);
}

goToAddAct() {
  this.router.navigate(["/register-manual-activity"])
}

goToAddSleep(){
  this.router.navigate(["/sleep"]);
}



getActivities() {
  this.dacadooCatalogsService.getActivities().subscribe((response) => {
    this.activitiesLocal = response;
    this.activitiesFilter = this.activitiesLocal;
    if (this.infiniteScroll) {
      this.infiniteScroll.disabled = false;
    }
  });
}


getLastUserActivities() {
 this.lastUserActivities = [];
 this.dacadooMovesService.getLastUserActivities().subscribe((response) => {
   response.forEach((element) => {
     for (let index = 0; index < this.activities.length; index++) {
       const act = this.activities[index];
       if (act.key == element.activity) {
         element.name = act.name;
       }
     }

     //remove duplicates
     if (
       this.lastUserActivities &&
       element.name &&
       this.lastUserActivities.findIndex(
         (x) => x.name.toLowerCase() == element.name.toLowerCase()
       ) === -1
     ) {
       this.lastUserActivities.push(element);
     }
   });
 });
}

showMoreActivities(event) {
 setTimeout(() => {
   this.maxActivitiesShow += this.countScroll;
   this.infiniteScroll.complete();
   if (
     this.maxActivitiesShow >= this.activities.length &&
     this.infiniteScroll
   ) {
     this.infiniteScroll.disabled = true;
   }
 }, 100);
}

selectActivity(activity: Activity) {
 this.storeService.setCurrentActivity(activity);
 this.gaService.trackEvent(AnaliticEvents.AC_EA_BTN, activity.key);
 this.key=activity.key;
 this.norm=activity.normpower;
 this.filterActivity=activity.name;
 localStorage.setItem("filterActivity",activity.name);
 this.activities=[];

/* this.router.navigate([
   "/chronometer",
   { name: activity.name, key: activity.key, norm: activity.normpower },
 ]);*/
}

selectActivityFromMove(move: Move) {
 for (let index = 0; index < this.activities.length; index++) {
   const act = this.activities[index];
   if (act.key == move.activity) {
     this.selectActivity(act);
   }
 }
}

onSearchActivity() {
  if(!this.isFinderDisabled){  
    if (this.filterActivity) {
      this.gaService.trackEvent(AnaliticEvents.AC_BUA_BTN, this.filterActivity);
      this.filterActivity='';
      localStorage.removeItem("filterActivity");
      this.activities=this.activitiesLocal
    }
    else{
      if(this.activities && this.activities.length>0){
        this.activities=[];
      }else{
        this.activities=this.activitiesLocal;}
    }
}
}

}








