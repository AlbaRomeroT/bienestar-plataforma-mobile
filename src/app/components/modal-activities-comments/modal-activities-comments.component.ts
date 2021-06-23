import { Component, OnInit } from "@angular/core";
import { ModalController } from "@ionic/angular";
import { FriendService } from "@app/services/friend.service";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import {
  AppHttpResponse,
  TrackHttpError,
} from "@app/interfaces/app-http-response.interface";
import { DacadooProfileResponse } from "@app/interfaces/dacadoo-profile.interface";
import * as _ from "lodash";
@Component({
  selector: "app-modal-activities-comments",
  templateUrl: "./modal-activities-comments.component.html",
  styleUrls: ["./modal-activities-comments.component.scss"],
})
export class ModalActivitiesCommentsComponent implements OnInit {
  subscriptions = new Subject();
  comments: any[] = [];
  commentsToShow: any[] = [];
  likes: any[] = [];
  public text: string;
  id: string;
  listCommentsToSend: any[] = [];
  listCommentsFull: any[] = [];
  constructor(
    private modalController: ModalController,
    private friendService: FriendService
  ) {}

  async ngOnInit() {
    this.getActivityComments();
    this.listCommentsToSend = [];

    setTimeout(() => {
      this.commentsToShow = this.listCommentsToSend.slice(0, 10);
    }, 1000);
    setTimeout(() => {
      this.commentsToShow = this.listCommentsToSend.slice(0, 10);
    }, 2000);
    setTimeout(() => {
      this.commentsToShow = this.listCommentsToSend.slice(0, 10);
    }, 3000);
  }

  dismiss(response: boolean) {
    this.modalController.dismiss({
      dismissed: response,
    });
  }

  viewMore() {
    this.commentsToShow = this.listCommentsToSend;
  }

  async onEnter() {
    if (this.text != null && this.text.length < 1001) {
      this.friendService
        .addComment(this.id, this.text)
        .pipe(takeUntil(this.subscriptions))
        .subscribe(
          (response: AppHttpResponse<any>) => {
            if (response?.hasErrors) {
              return;
            }
          },
          (error: TrackHttpError) => {}
        );
      this.text = null;
      setTimeout(() => {
        this.ngOnInit();
      }, 1500);
    }
  }
  getComments(id: any) {
    this.friendService
      .getProfileByUserId(id.creator.id)
      .pipe(takeUntil(this.subscriptions))
      .subscribe(
        (response: AppHttpResponse<DacadooProfileResponse>) => {
          if (response.hasErrors) {
            return;
          }

          let item: any = {
            text: id.text,
            name: response.body.data[0].name.displayName,
            modificationTime: id.modificationTime,
          };
          this.listCommentsToSend.push(item);
          this.listCommentsToSend = _.sortBy(
            this.listCommentsToSend,
            function (item) {
              return new Date(item.modificationTime);
            }
          ).reverse();
          return;
        },
        (error: TrackHttpError) => {}
      );
  }

  getActivityComments() {
    this.friendService
      .getActivityComments(this.id)
      .pipe(takeUntil(this.subscriptions))
      .subscribe(
        (response: AppHttpResponse<any>) => {
          if (response.hasErrors) {
            return;
          }

          this.comments = response.body.data;
          for (var id of this.comments) {
            this.getComments(id);
          }
        },
        (error: TrackHttpError) => {}
      );
  }
}
