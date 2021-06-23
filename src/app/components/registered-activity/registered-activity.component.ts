import { Component, Input, OnInit } from "@angular/core";
import { ModalController } from "@ionic/angular";
import { ModalActivitiesCommentsComponent } from "../modal-activities-comments/modal-activities-comments.component";
import {
  DacadooProfile,
  DacadooProfileResponse,
} from "../../interfaces/dacadoo-profile.interface";
import {
  Activity,
  ActivityToSpanish,
} from "@app/interfaces/activity.interface";
import { Router } from "@angular/router";
import { FriendService } from "@app/services/friend.service";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import {
  AppHttpResponse,
  TrackHttpError,
} from "@app/interfaces/app-http-response.interface";

@Component({
  selector: "app-registered-activity",
  templateUrl: "./registered-activity.component.html",
  styleUrls: ["./registered-activity.component.scss"],
})
export class RegisteredActivityComponent implements OnInit {
  @Input() activity: Activity;
  @Input() profile: DacadooProfile;
  @Input() activitiesTranslate: ActivityToSpanish[];
  public likes: string;
  likesToSend: any[] = [];
  public comments: string;
  subscriptions = new Subject();
  listCommentsToSend: any[] = [];
  isLike: boolean = false;
  idLike: string = "";
  constructor(
    private modalController: ModalController,
    private router: Router,
    private friendService: FriendService
  ) {}
  ngOnInit() {
    this.getLikeAndComments();
    this.getActivityLikes();
    this.getIsLike();
  }
  async onOpenModalComments() {
    let commentsModal = await this.modalController.create({
      component: ModalActivitiesCommentsComponent,
      cssClass: "activities-actions-modal",
      componentProps: {
        id: this.activity.object.id,
        comments: this.listCommentsToSend,
        likes: this.likesToSend,
      },
    });
    commentsModal.onDidDismiss().then((res) => {
      this.listCommentsToSend = [];
      this.likesToSend = [];
      this.ngOnInit();
      if (res?.data?.dismissed) {
        console.log("Dissmis modal");
      }
    });

    return await commentsModal.present();
  }
  goTo() {
    this.router.navigate(["friend-profile"], {
      queryParams: {
        id: this.profile.id,
        pathReturn: "/community",
        segmentReturn: "recentActivity",
      },
    });
  }

  async onLike() {
    this.friendService
      .addLike(this.activity.object.id)
      .pipe(takeUntil(this.subscriptions))
      .subscribe(
        (response: AppHttpResponse<any>) => {
          if (response?.hasErrors) {
            return;
          }
          if (response != null) {
            this.getLikeAndComments();
            this.getActivityLikes();
            this.isLike = true;
            this.getIsLike();
          }
        },
        (error: TrackHttpError) => {}
      );
  }
  getLikeAndComments() {
    this.friendService
      .getCommentsAndLikes(this.activity.object.id)
      .pipe(takeUntil(this.subscriptions))
      .subscribe(
        (response: AppHttpResponse<any>) => {
          if (response.hasErrors) {
            return;
          }

          this.likes = response.body?.data?.likes;
          this.comments = response.body?.data?.comments;
        },
        (error: TrackHttpError) => {}
      );
  }

  getLikes(id: any) {
    this.likesToSend = [];
    this.friendService
      .getProfileByUserId(id.creator.id)
      .pipe(takeUntil(this.subscriptions))
      .subscribe(
        (response: AppHttpResponse<DacadooProfileResponse>) => {
          if (response.hasErrors) {
            return;
          }

          let item = {
            name: response.body.data[0].name.displayName,
          };
          this.likesToSend.push(item);
        },
        (error: TrackHttpError) => {}
      );
  }

  getActivityLikes() {
    this.likesToSend = [];
    this.friendService
      .getActivityLikes(this.activity.object.id)
      .pipe(takeUntil(this.subscriptions))
      .subscribe(
        (response: AppHttpResponse<any>) => {
          if (response.hasErrors) {
            return;
          }

          let items = response.body.data;
          for (var id of items) {
            this.getLikes(id);
          }
        },
        (error: TrackHttpError) => {}
      );
  }

  getIsLike() {
    this.friendService
      .isLike(this.activity.object.id)
      .pipe(takeUntil(this.subscriptions))
      .subscribe(
        (response: AppHttpResponse<any>) => {
          if (response.hasErrors) {
            return;
          }

          if (response.body.data.length > 0) {
            this.isLike = true;
            this.idLike = response.body.data[0].id;
          }
        },
        (error: TrackHttpError) => {}
      );
  }

  async nonLike() {
    this.friendService
      .removeLike(this.idLike)
      .pipe(takeUntil(this.subscriptions))
      .subscribe(
        (response: AppHttpResponse<any>) => {
          if (response?.hasErrors) {
            return;
          }
          this.getActivityLikes();
          this.getLikeAndComments();
          this.isLike = false;
        },
        (error: TrackHttpError) => {}
      );
  }
}
