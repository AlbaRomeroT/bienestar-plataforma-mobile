import { Component, OnInit, ViewChild } from "@angular/core";
import { FriendService } from "../../services/friend.service";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import {
  AppHttpResponse,
  TrackHttpError,
} from "@app/interfaces/app-http-response.interface";
import {
  HealthScore,
  HealthScoreResponse,
} from "@app/interfaces/health-score.interface";
import { ToastService } from "../../services/toast.service";
import { MessageEnum } from "@app/enums/message-enum";
import {
  DacadooProfile,
  DacadooProfileResponse,
} from "@app/interfaces/dacadoo-profile.interface";
import { ActivatedRoute } from "@angular/router";
import * as _ from "lodash";
import { IonInfiniteScroll } from "@ionic/angular";
import {
  Link,
  UserActivity,
  UserActivityResponse,
} from "@app/interfaces/user-activity.interface";
import { ActivityToSpanish } from "../../interfaces/activity.interface";

@Component({
  selector: "app-friend-profile",
  templateUrl: "./friend-profile.page.html",
  styleUrls: ["./friend-profile.page.scss"],
})
export class FriendProfilePage implements OnInit {
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

  activities: UserActivity[] = [];
  healthScore: HealthScore = null;
  profile: DacadooProfile = null;
  activitiesTranslate: ActivityToSpanish[];

  sections = {
    empty: "empty",
    activities: "activities",
  };

  sectiontToShow: string = "";
  showSpinner = false;
  segmentReturn: string = "";
  subscriptions = new Subject();
  title: string = "Mis amigos";
  next: Link;
  id: string = "";

  constructor(
    private friendService: FriendService,
    private route: ActivatedRoute,
    private toastService: ToastService
  ) {}

  ngOnInit() {}

  async ionViewDidEnter() {
    this.profile = null;
    this.healthScore = null;
    this.activities = [];
    this.getActivitiesTranslate();
    this.getQueryParams();
    this.getActivities(this.id);
    this.getHealthScore(this.id);
    this.getProfile(this.id);
    if (this.infiniteScroll) {
      this.infiniteScroll.disabled = false;
    }
  }

  ionViewDidLeave(): void {
    this.activities = [];
    this.subscriptions.next();
    this.subscriptions.complete();
  }

  getQueryParams() {
    this.route.queryParams.subscribe((params) => {
      this.id = params.id;
      this.segmentReturn = params.segmentReturn;
    });
  }

  getActivitiesTranslate() {
    this.friendService.getTranslateActivities().subscribe((translate) => {
      this.activitiesTranslate = translate;
    });
  }

  getActivities(id: string) {
    this.showSpinner = true;

    this.friendService
      .getActivitiesByUserId(id)
      .pipe(takeUntil(this.subscriptions))
      .subscribe(
        (response: AppHttpResponse<UserActivityResponse>) => {
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

          this.activities = response.body.data;
          this.activities = _.sortBy(this.activities, function (item) {
            return new Date(item.modificationTime);
          }).reverse();

          if (this.activities.length > 0) {
            this.sectiontToShow = this.sections.activities;
          } else {
            this.sectiontToShow = this.sections.empty;
          }

          this.next = _.find(response.body.links, ["rel", "next"]);
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
          console.log(error);
        }
      );
  }

  getProfile(id: string) {
    this.friendService
      .getProfileByUserId(id)
      .pipe(takeUntil(this.subscriptions))
      .subscribe(
        (response: AppHttpResponse<DacadooProfileResponse>) => {
          if (response.hasErrors) {
            return;
          }

          this.profile = response.body.data[0];
        },
        (error: TrackHttpError) => {
          console.log(error);
        }
      );
  }

  getNextActivities() {
    this.showSpinner = true;

    if (!this.next) {
      this.showSpinner = false;
      this.infiniteScroll.complete();
      this.infiniteScroll.disabled = true;
      return;
    }

    this.friendService
      .getNextActivities(this.next.href)
      .pipe(takeUntil(this.subscriptions))
      .subscribe(
        (response: AppHttpResponse<UserActivityResponse>) => {
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

          if (response.body.data.length > 0) {
            this.sectiontToShow = this.sections.activities;
          }

          this.next = _.find(response.body.links, ["rel", "next"]);

          this.infiniteScroll.complete();

          this.activities.push(...response.body.data);
          setTimeout(() => {
            this.activities = _.sortBy(this.activities, function (item) {
              return new Date(item.modificationTime);
            }).reverse();
          }, 500);
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
          console.log(error);
        }
      );
  }

  getHealthScore(id: string) {
    this.friendService
      .getHealthScoreByUserId(id)
      .pipe(takeUntil(this.subscriptions))
      .subscribe(
        (response: AppHttpResponse<HealthScoreResponse>) => {
          if (response.hasErrors) {
            return;
          }

          this.healthScore = response.body.data[0];

          if (!this.healthScore) {
            this.healthScore = {
              score: 0,
            };
          }
        },
        (error: TrackHttpError) => {
          console.log(error);
        }
      );
  }
}
