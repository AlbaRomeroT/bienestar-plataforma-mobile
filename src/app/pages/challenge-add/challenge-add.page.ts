import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { MessageEnum } from "@app/enums/message-enum";
import { TrackHttpError } from "@app/interfaces/app-http-response.interface";
import {
  Challenge,
  ChallengeParticipant,
} from "@app/interfaces/challenge.interface";
import { Media, MediaFormat } from "@app/interfaces/media.interface";
import { DacadooChallengeService } from "@app/services/dacadoo-challenge.service";
import { DacadooMediaService } from "@app/services/dacadoo-media.service";
import { ModalService } from "@app/services/modal.service";
import { IonInfiniteScroll } from "@ionic/angular";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { ToastService } from "../../services/toast.service";

@Component({
  selector: "app-challenge-add",
  templateUrl: "./challenge-add.page.html",
  styleUrls: ["./challenge-add.page.scss"],
})
export class ChallengeAddPage implements OnInit {
  public challenges: Challenge[];
  private countScroll: number = 15;
  public maxShow: number;
  subscriptions = new Subject();
  showSpinner = false;

  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  @ViewChild("pageTop") pageTop: any;

  constructor(
    private challengeService: DacadooChallengeService,
    private mediaService: DacadooMediaService,
    private router: Router,
    private toastService: ToastService,
    private modalService: ModalService
  ) {}

  ionViewDidEnter() {
    this.maxShow = this.countScroll;
    this.infiniteScroll.disabled = false;
    this.pageTop.scrollToTop();
    this.getChallenges();
  }

  ngOnInit() {}

  async getChallenges() {
    this.showSpinner = true;
    this.challengeService.getAll().subscribe((response) => {
      if (response.hasErrors) {
        this.toastService.showMessage(
          MessageEnum.ERROR_GET,
          null,
          null,
          "top",
          "danger"
        );
        return;
      }

      this.challengeService.getByUser().subscribe((responseUser) => {
        this.showSpinner = false;

        if (responseUser.hasErrors) {
          this.toastService.showMessage(
            MessageEnum.ERROR_GET,
            null,
            null,
            "top",
            "danger"
          );
          return;
        }

        this.challenges = response.body.data.filter(
          (x: Challenge) =>
            responseUser.body.data.findIndex(
              (y: ChallengeParticipant) => y.object.id === x.id
            ) === -1
        );
        console.log("CHALLENGES => ", this.challenges);
        this.challenges.forEach((challenge) => this.getMediaImage(challenge));
      });
    });
  }

  getMediaImage(challenge: Challenge) {
    if (challenge.media) {
      const media: Media = challenge.media.find(
        (x) => x.type === "header" && x.formats && x.formats.length > 0
      );
      if (media && media.formats && media.formats.length > 0) {
        const format: MediaFormat = media.formats.find(
          (x) => x.type === "thumbnail"
        );
        if (format) {
          this.mediaService
            .getMediaContent(media.id, format)
            .subscribe((response) => (challenge.safeMediaUrl = response));
        }
      }
    }
  }

  viewChallengeDetail(challenge: Challenge) {
    this.router.navigate([`challenge-description/${challenge.id}`]);
  }

  async onAdd(challenge: Challenge) {
    this.showSpinner = true;
    this.challengeService
      .addToUser(challenge.id)
      .pipe(takeUntil(this.subscriptions))
      .subscribe(
        (response) => {
          this.showSpinner = false;
          if (response.hasErrors) {
            this.toastService.showMessage(
              response.errors[0].errorDescription,
              null,
              null,
              "top",
              "danger"
            );
            return;
          }
          this.showConfirmAddMessage();
        },
        (error: TrackHttpError) => {
          this.showSpinner = false;
          this.toastService.showMessage(
            MessageEnum.ERROR_SAVE,
            null,
            null,
            "top",
            "danger"
          );
        }
      );
  }

  removeMarckDowns(text: string) {
    if (text) {
      let start =
        text.indexOf("![") != -1
          ? text.indexOf("![")
          : text.indexOf("*[") != -1
          ? text.indexOf("*[")
          : -1;
      let end = text.indexOf("]");
      let count = 0;
      while (start >= 0 && end > start && count < 50) {
        const sub = text.substring(start, end + 1);
        text = text.replace(sub, "");
        start =
          text.indexOf("![") != -1
            ? text.indexOf("![")
            : text.indexOf("*[") != -1
            ? text.indexOf("*[")
            : -1;
        end = text.indexOf("]");
        count++;
      }
    }
    return text;
  }

  async showConfirmAddMessage() {
    await this.modalService.showConfirmAddMessage("community");
  }

  showMore(event) {
    setTimeout(() => {
      this.maxShow += this.countScroll;
      this.infiniteScroll.complete();
      if (this.maxShow >= this.challenges.length && this.infiniteScroll) {
        this.infiniteScroll.disabled = true;
      }
    }, 100);
  }
}
