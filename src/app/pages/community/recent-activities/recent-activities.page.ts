import { Component, OnInit, ViewChild } from "@angular/core";
import { MessageEnum } from "@app/enums/message-enum";
import {
  AppHttpResponse,
  TrackHttpError,
} from "@app/interfaces/app-http-response.interface";
import { FriendService } from "@app/services/friend.service";
import { ToastService } from "@app/services/toast.service";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import {
  DacadooProfile,
  DacadooProfileResponse,
  Link,
} from "../../../interfaces/dacadoo-profile.interface";
import * as _ from "lodash";
import { IonInfiniteScroll } from "@ionic/angular";
import {
  ActivityResponse,
  Activity,
  ActivityToSpanish,
} from "@app/interfaces/activity.interface";

@Component({
  selector: "app-recent-activities",
  templateUrl: "./recent-activities.page.html",
  styleUrls: ["./recent-activities.page.scss"],
})
export class RecentActivitiesPage implements OnInit {
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

  sections = {
    empty: "empty",
    activities: "activities",
  };

  sectiontToShow: string = "";
  showSpinner = false;
  next: Link;
  subscriptions = new Subject();
  activitiesProfiles: ActivityProfile[] = [];
  activitiesTranslate: ActivityToSpanish[];

  constructor(
    private friendService: FriendService,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.sectiontToShow = this.sections.activities;
    this.getActivities();
    this.getActivitiesTranslate();
  }

  getActivities() {
    this.showSpinner = true;

    this.friendService
      .getActivities()
      .pipe(takeUntil(this.subscriptions))
      .subscribe(
        (response: AppHttpResponse<ActivityResponse>) => {
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

          this.next = _.find(response.body.links, ["rel", "next"]);

          let filterActivities = _.filter(response.body.data, function (o) {
            return o.object.kind == "move";
          });

          if (filterActivities.length <= 0) {
            if (this.next) {
              this.getNextActivities();
              return;
            }
            this.sectiontToShow = this.sections.empty;
            return;
          }
          this.sectiontToShow = this.sections.activities;

          _.sortBy(filterActivities, function (item) {
            return new Date(item.time);
          }).reverse();

          for (var activity of filterActivities) {
            this.getProfile(activity);
          }
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
        (response: AppHttpResponse<ActivityResponse>) => {
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

          this.infiniteScroll.complete();
          this.next = _.find(response.body.links, ["rel", "next"]);

          let filterActivitiesNext = _.filter(response.body.data, function (o) {
            return o.object.kind == "move";
          });
          console.log("filterNExt ", filterActivitiesNext);
          if (filterActivitiesNext.length <= 0) {
            if (this.next) {
              this.getNextActivities();
              return;
            }
            if (this.activitiesProfiles.length == 0) {
              this.sectiontToShow = this.sections.empty;
            }
            return;
          }

          this.sectiontToShow = this.sections.activities;

          _.sortBy(filterActivitiesNext, function (item) {
            return new Date(item.modificationTime);
          });

          for (var activity of filterActivitiesNext) {
            this.getProfile(activity);
          }
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

  getProfile(activity: Activity) {
    this.friendService
      .getProfileByUserId(activity.subject.id)
      .pipe(takeUntil(this.subscriptions))
      .subscribe(
        (response: AppHttpResponse<DacadooProfileResponse>) => {
          if (response.hasErrors) {
            return;
          }

          let item: ActivityProfile = {
            activity: activity,
            profile: response.body.data[0],
          };

          this.activitiesProfiles.push(item);
          this.activitiesProfiles = _.sortBy(
            this.activitiesProfiles,
            function (item) {
              return new Date(item.activity.object.modificationTime);
            }
          ).reverse();
        },
        (error: TrackHttpError) => {
          console.log(error);
        }
      );
  }

  getActivitiesTranslate() {
    this.friendService.getTranslateActivities().subscribe((translate) => {
      this.activitiesTranslate = translate;
    });
  }
}

export interface ActivityProfile {
  activity?: Activity;
  profile?: DacadooProfile;
}
