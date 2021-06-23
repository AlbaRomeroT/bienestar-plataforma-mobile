import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { Router } from '@angular/router';
import {
  AppHttpResponse,
  TrackHttpError,
} from "@app/interfaces/app-http-response.interface";
import { DacadooCoachService } from "@app/services/dacadoo-coach.service";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import {
  CoachChatSave,
  CoachChat,
  CoachChatResponse,
} from "../../interfaces/coach-chat.interface";
import * as _ from "lodash";
import * as moment from "moment";
import {
  InAppBrowser,
  InAppBrowserOptions,
} from "@ionic-native/in-app-browser/ngx";
import { IonContent, Platform } from "@ionic/angular";
import { environment } from "@environments/environment";

@Component({
  selector: "app-coach",
  templateUrl: "./coach.page.html",
  styleUrls: ["./coach.page.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class CoachPage implements OnInit {
  pathReturn: string = "";
  title: string = "Mi coach";
  subscriptions = new Subject();
  checkNewQuestions: any;
  showSpinner = false;

  @ViewChild(IonContent, { read: IonContent, static: false })
  coachContent: IonContent;

  chat: CoachChat[] = [];

  public isProduction: boolean = false;

  constructor(
    private dacadooCoachService: DacadooCoachService,
    private iab: InAppBrowser,
    private plt: Platform,
    private router: Router
  ) {
    this.isProduction = environment.production;
  }

  ngOnInit() {}

  async goToPurpose() {
    this.router.navigate(["purpose"]);
  }

  async goToAchievement() {
    // this.router.navigate(['achievement']);
  }

  async ionViewDidEnter() {
    this.chat = [];
    await this.getHistory();
    this.setInterval();
  }

  ionViewDidLeave(): void {
    this.subscriptions.next();
    this.subscriptions.complete();
    clearInterval(this.checkNewQuestions);
  }

  get lastChat(): CoachChat {
    let lastChat: CoachChat = null;
    if (this.chat.length > 0) {
      lastChat = this.chat[this.chat.length - 1];
    }
    return lastChat;
  }

  getLastChat(): CoachChat {
    let lastChat: CoachChat = {};
    if (this.chat.length > 0) {
      lastChat = this.chat[this.chat.length - 1];
    }
    return lastChat;
  }

  setInterval() {
    this.checkNewQuestions = setInterval(async () => {
      let lastChat = this.getLastChat();
      console.log("INTERVAL LAST CHAT => ", lastChat);

      // Si no hay mensajes en el historial
      if(!lastChat.id) {
        this.getNextChat();
        return;
      }

      // Si el último mensaje está completado
      if (lastChat?.completed) {
        if(!lastChat.completionTime) {
          lastChat.completionTime = new Date().toISOString();
        }

        this.showSpinner = true;
        var now = moment(new Date());
        var last = moment(lastChat.completionTime);
        console.log("TIMES =>", now, last);
        var diff = now.diff(last, "seconds");
        console.log("TIME DIFFS =>", diff);

        if (diff > 15) {
          this.getNextChat();
        }
        this.showSpinner = false;
      }
    }, 3000);
  }

  async getHistory() {
    this.showSpinner = true;

    this.dacadooCoachService
      .getHistoryChat()
      .pipe(takeUntil(this.subscriptions))
      .subscribe(
        (response: AppHttpResponse<CoachChatResponse>) => {
          this.showSpinner = false;
          if (response.hasErrors) {
            console.log(response);
            return;
          }

          for (var question of response.body.data) {
            if(!question.completionTime) {
              question.completionTime = question.modificationTime;
            }
            
            if (this.toOmit(question)) {
              continue;
            }
            this.chat.push(question);
          }

          this.chat = _.sortBy(this.chat, function (item) {
            return new Date(item.completionTime);
          });

          console.log("CHAT HISTORY =>", this.chat)

          this.getNextChat();
          this.scrollToBottom();
        },
        (error: TrackHttpError) => {
          this.showSpinner = false;
          console.log(error);
        }
      );
  }

  async getNextChat() {
    this.showSpinner = true;

    this.dacadooCoachService
      .getChat()
      .pipe(takeUntil(this.subscriptions))
      .subscribe(
        (response: AppHttpResponse<CoachChatResponse>) => {
          this.showSpinner = false;
          if (response.hasErrors) {
            console.log(response);
            return;
          }
          
          let lastChat = this.getLastChat();
          console.log("LAST CHAT => ", lastChat);
          let newChat = response.body.data[0];
          console.log("NEW CHAT => ", newChat);
          // Si el chat viene vacio
          if (!newChat) {
            return;
          }

          // Si ya hay mensajes en el chat y el último chat es igual al anterior no se vuelve a mostrar
          if (this.chat.length > 0 && lastChat?.message == newChat.message) {
            if(newChat.body == lastChat.body && newChat.lead == lastChat.lead) {
              console.log("SAME TYPE CHAT => ", newChat, lastChat);

              // Si el id de los mensajes es igual se omite el nuevo mensaje
              if(newChat.id != lastChat.id) {
                console.log("SAME CHAT DIFERENT ID");
                this.omit(newChat);
              }
              return;
            }
          }

          newChat.completionTime = new Date().toISOString();

          // Si el mensaje se debe omitir
          if (this.toOmit(newChat)) {
            console.log("OMIT CHAT => ", newChat);

            this.omit(newChat);
            return;
          }

          if (newChat.inputs.length == 0 && newChat.completed == false) {
            if (this.chat.length == 0 || (lastChat.message != newChat.message && lastChat.body != newChat.body)) {
              this.chat.push(...response.body.data);
              this.scrollToBottom();
            }
            console.log("SKIP CHAT => ", newChat);

            this.skip(newChat);
            return;
          }

          if (
            newChat.inputs[0]?.type == "number" ||
            newChat.inputs[0]?.type == "slider"
          ) {
            newChat.inputs[0].selected = {
              value: null,
            };
          }

          console.log("ADD CHAT => ", newChat);

          this.chat.push(...response.body.data);
          this.scrollToBottom();
        },
        (error: TrackHttpError) => {
          this.showSpinner = false;
          console.log(error);
        }
      );
  }

  scrollToBottom() {
    setTimeout(() => {
      this.coachContent.scrollToBottom(500);
    }, 100);
  }

  toOmit(question: CoachChat): boolean {
    var texts: string[] = [
      "functions/coach/achievements",
      "functions/settings/platformsettings/membership"
    ];

    for (var text of texts) {
      if (question.body?.toLowerCase().includes(text)) {
        return true;
      }

      if (question.lead?.toLowerCase().includes(text)) {
        return true;
      }
    }

    return false;
  }

  async onSave() {
    let lastChat = this.getLastChat();

    // Se toma el valor, en caso de ser un slider se debe poner en un rango de 0 a 1
    let value = lastChat.inputs[0].selected.value;
    if (lastChat.inputs[0]?.type == "slider") {
      value = lastChat.inputs[0].selected.value / 10;
    }

    if (
      lastChat.inputs[0].selected?.value == null ||
      lastChat.inputs[0].selected?.value == undefined
    ) {
      console.log("Debe seleccionar una opción");
      return;
    }

    var toSave: CoachChatSave = {
      id: lastChat.id,
      completed: true,
      seen: true,
      inputs: [
        {
          key: lastChat.inputs[0].key,
          response: value,
        },
      ],
    };

    this.showSpinner = true;

    this.dacadooCoachService
      .save(toSave)
      .pipe(takeUntil(this.subscriptions))
      .subscribe(
        (response: AppHttpResponse<any>) => {
          this.showSpinner = false;

          if (response.hasErrors) {
            console.log(response);          
            return;
          }

          let lastChat = this.chat[this.chat.length - 1];
          lastChat.inputs[0].response = value;
          lastChat.completed = true;

          setTimeout(() => {
            this.getNextChat();
          }, 1000);
        },
        (error: TrackHttpError) => {
          this.showSpinner = false;
          console.log(error);
        }
      );
  }

  async skip(lastChat: CoachChat) {
    var toSave: CoachChatSave = {
      id: lastChat.id,
      completed: true,
      seen: true,
      inputs: [],
    };
    this.showSpinner = true;
    this.dacadooCoachService
      .save(toSave)
      .pipe(takeUntil(this.subscriptions))
      .subscribe(
        (response: AppHttpResponse<any>) => {
          this.showSpinner = false;
          if (response.hasErrors) {
            console.log(response);
            return;
          }
          let lastChat = this.chat[this.chat.length - 1];
          lastChat.completed = true;
          if (lastChat.inputs.length > 0) {
            lastChat.inputs[0].response = "Omitido";
          }

          setTimeout(() => {
            this.getNextChat();
          }, 3000);
        },
        (error: TrackHttpError) => {
          this.showSpinner = false;
          console.log(error);
        }
      );
  }

  async omit(lastChat: CoachChat) {
    var toSave: CoachChatSave = {
      id: lastChat.id,
      completed: true,
      seen: true,
      inputs: [],
    };
    this.showSpinner = true;
    this.dacadooCoachService
      .save(toSave)
      .pipe(takeUntil(this.subscriptions))
      .subscribe(
        (response: AppHttpResponse<any>) => {
          this.showSpinner = false;
          if (response.hasErrors) {
            console.log(response);
            return;
          }

          setTimeout(() => {
            this.getNextChat();
          }, 1000);
        },
        (error: TrackHttpError) => {
          this.showSpinner = false;
          console.log(error);
        }
      );
  }

  openExternaLink(url: string) {
    const option: InAppBrowserOptions = {
      zoom: "no",
    };

    if (this.plt.is("ios")) {
      this.iab.create(url, "_system", option);
    } else {
      this.iab.create(url, "_self", option);
    }
  }

  navigateTo(url: string){
    if(!url.includes("?")){
      this.router.navigateByUrl(url)
      return;
    }

    var values = url.split("?");
    var baseUrl = values[0];
    var params = values[1].split("=");
    var paramName = params[0];
    var paramValue = params[1];

    var queryParams = {};
    queryParams[paramName] = paramValue;

    this.router.navigate([baseUrl], { queryParams });

  }
}
