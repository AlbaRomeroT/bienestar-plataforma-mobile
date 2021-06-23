import { Component, OnInit } from "@angular/core";
import { MessageEnum } from "@app/enums/message-enum";
import {
  AppHttpResponse,
  TrackHttpError,
} from "@app/interfaces/app-http-response.interface";
import {
  Challenge,
  ChallengeResponse,
} from "@app/interfaces/challenge.interface";
import { ToastService } from "../../../services/toast.service";
import { takeUntil } from "rxjs/operators";
import { ModalController } from "@ionic/angular";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { DacadooChallengeService } from "@app/services/dacadoo-challenge.service";
import { GoogleAnalyticsService } from "@app/services/google-analytics.service";
import * as _ from "lodash";
@Component({
  selector: "app-challenges",
  templateUrl: "./challenges.page.html",
  styleUrls: ["./challenges.page.scss"],
})
export class ChallengesPage implements OnInit {
  statuses = {
    completed: "completed",
    actives: "actives",
  };

  sections = {
    empty: "empty",
    challenges: "challenges",
  };

  title: string = "Mis propósitos";
  sectiontToShow: string = "";
  selectedStatus: string;
  challenges: Array<Challenge> = [];
  isEdit: boolean;
  subscriptions = new Subject();
  completedDisable: boolean;
  showSpinner = false;

  constructor(
    private dacadooChallengeService: DacadooChallengeService,
    private toastService: ToastService,
    private modalController: ModalController,
    private router: Router,
    private gaService: GoogleAnalyticsService
  ) {}

  async ngOnInit() {
    this.completedDisable = true;
    this.selectedStatus = this.statuses.actives;
    this.isEdit = false;
    await this.getChallenges();
  }

  async ionViewDidEnter() {
    this.completedDisable = true;
    this.selectedStatus = this.statuses.actives;
    this.isEdit = false;
    await this.getChallenges();
  }

  ionViewDidLeave(): void {
    this.subscriptions.next();
    this.subscriptions.complete();
  }

  async getChallenges() {
    this.showSpinner = true;

    this.dacadooChallengeService
      .getByUser()
      .pipe(takeUntil(this.subscriptions))
      .subscribe(
        (response: AppHttpResponse<ChallengeResponse>) => {
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
          let challengesTemp = response.body.data;
          for (var challenge of challengesTemp) {
            this.getChallengebyId(challenge.object.id);
          }
          this.updateList();
        },
        (error: TrackHttpError) => {
          this.showSpinner = false;
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

  onSave() {
    if (this.challenges.length > 0) {
      this.sectiontToShow = this.sections.challenges;
    } else {
      this.sectiontToShow = this.sections.empty;
    }
    this.isEdit = false;
  }

  statusChanged(event) {
    this.selectedStatus = event.detail.value;
    this.focusSegment(this.selectedStatus);
  }

  focusSegment(segment: string) {
    var segmentId = `seg-${segment}`;
    document.getElementById(segmentId).scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "center",
    });
  }

  goToAddChallenge() {
    this.router.navigate(["/challenge-add"]);
  }

  async getChallengebyId(id: string) {
    this.showSpinner = true;

    this.dacadooChallengeService
      .getById(id)
      .pipe(takeUntil(this.subscriptions))
      .subscribe(
        (response: AppHttpResponse<any>) => {
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
          let item: Challenge = response.body.data;

          this.challenges.push(item);
          this.challenges = _.sortBy(
            this.challenges,
            function (item: Challenge) {
              return new Date(item.showTime);
            }
          );

          this.updateList();
        },
        (error: TrackHttpError) => {
          this.showSpinner = false;
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

  updateList() {
    var d1 = new Date();
    if (this.challenges.some((x) => new Date(Date.parse(x.endTime)) < d1)) {
      this.completedDisable = false;
    }
    if (this.challenges.length > 0) {
      this.sectiontToShow = this.sections.challenges;
    } else {
      this.sectiontToShow = this.sections.empty;
    }
  }
}
