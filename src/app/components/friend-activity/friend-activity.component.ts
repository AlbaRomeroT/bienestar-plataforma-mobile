import { Component, Input, OnInit } from "@angular/core";
import { ActivityToSpanish } from "@app/interfaces/activity.interface";
import {
  DacadooProfile,
  DacadooProfileResponse,
} from "@app/interfaces/dacadoo-profile.interface";
import { UserActivity } from "@app/interfaces/user-activity.interface";
import { ModalController } from "@ionic/angular";
import { FriendService } from "@app/services/friend.service";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import {
  AppHttpResponse,
  TrackHttpError,
} from "@app/interfaces/app-http-response.interface";
import { ModalActivitiesCommentsComponent } from "../modal-activities-comments/modal-activities-comments.component";
@Component({
  selector: "app-friend-activity",
  templateUrl: "./friend-activity.component.html",
  styleUrls: ["./friend-activity.component.scss"],
})
export class FriendActivityComponent implements OnInit {
  @Input() activity: UserActivity;
  @Input() profile: DacadooProfile;
  @Input() activitiesTranslate: ActivityToSpanish[];
  public likes: string;
  public comments: string;
  subscriptions = new Subject();
  likesToSend: any[] = [];
  commentsToSend: any[] = [];
  isLike: boolean = false;
  idLike: string = "";
  constructor(
    private modalController: ModalController,
    private friendService: FriendService
  ) {}

  ngOnInit() {
    this.isLike = false;
    this.likesToSend = [];
    this.getLikeAndCommentsFriend();
    this.getActivityLikesFriend();
    this.getIsLikeFriend();
  }

  async onOpenModalComments() {
    let commentsModal = await this.modalController.create({
      component: ModalActivitiesCommentsComponent,
      cssClass: "activities-actions-modal",
      componentProps: {
        id: this.activity.id,
        comments: this.commentsToSend,
        likes: this.likesToSend,
      },
    });

    commentsModal.onDidDismiss().then((res) => {
      this.likesToSend = [];
      this.ngOnInit();
      if (res?.data?.dismissed) {
        console.log("Cerrando modal");
      }
    });
    return await commentsModal.present();
  }

  async onLikeFriend() {
    this.friendService
      .addLike(this.activity.id)
      .pipe(takeUntil(this.subscriptions))
      .subscribe(
        (response: AppHttpResponse<any>) => {
          if (response?.hasErrors) {
            return;
          }
          if (response != null) {
            this.getLikeAndCommentsFriend();
            this.getActivityLikesFriend();
            this.isLike = true;
            this.getIsLikeFriend();
          }
        },
        (error: TrackHttpError) => {}
      );
  }

  getLikeAndCommentsFriend() {
    this.friendService
      .getCommentsAndLikes(this.activity.id)
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

  getLikesFriend(id: any) {
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

  getActivityLikesFriend() {
    this.friendService
      .getActivityLikes(this.activity.id)
      .pipe(takeUntil(this.subscriptions))
      .subscribe(
        (response: AppHttpResponse<any>) => {
          if (response.hasErrors) {
            return;
          }
          let items = response.body.data;
          for (var id of items) {
            this.getLikesFriend(id);
          }
        },
        (error: TrackHttpError) => {}
      );
  }

  getIsLikeFriend() {
    this.friendService
      .isLike(this.activity.id)
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

  async nonLikeFriend() {
    this.friendService
      .removeLike(this.idLike)
      .pipe(takeUntil(this.subscriptions))
      .subscribe(
        (response: AppHttpResponse<any>) => {
          if (response?.hasErrors) {
            return;
          }
          this.getLikeAndCommentsFriend();
          this.getActivityLikesFriend();
          this.isLike = false;
        },
        (error: TrackHttpError) => {}
      );
  }
}
