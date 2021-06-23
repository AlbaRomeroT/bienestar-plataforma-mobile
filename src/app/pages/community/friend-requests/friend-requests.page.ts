import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { DacadooProfile } from "@app/interfaces/dacadoo-profile.interface";
import { FriendRequest } from "@app/models/friendsResponse";
import { FriendService } from "@app/services/friend.service";
import { ProfileService } from "@app/services/profile.service";
import { IonInfiniteScroll } from "@ionic/angular";

@Component({
  selector: "app-friend-requests",
  templateUrl: "./friend-requests.page.html",
  styleUrls: ["./friend-requests.page.scss"],
})
export class FriendRequestsPage implements OnInit {
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

  public friendRequests: DacadooProfile[];
  public nextFriendRequestsUrl: string;

  constructor(
    private friendService: FriendService,
    private profileService: ProfileService,
    private router: Router
  ) {}

  ngOnInit() {
    this.getFriendRequests();
  }

  getFriendRequests() {
    this.friendService
      .getFriendResquests(20)
      .subscribe((friendsRequestResponse) => {
        if (friendsRequestResponse) {
          this.friendRequests = [];
          this.nextFriendRequestsUrl =
            friendsRequestResponse.next && friendsRequestResponse.next != ""
              ? friendsRequestResponse.next
              : null;
          this.getAndSetFriendProfile(
            friendsRequestResponse.friendRequests.filter(
              (x) => x.status == "pending"
            ),
            this.friendRequests
          );
        }
      });
  }

  getAndSetFriendProfile(data: FriendRequest[], array: DacadooProfile[]) {
    if (data && array) {
      data.forEach((user) => {
        let index = array.push({ id: user[0] } as DacadooProfile);
        this.profileService.getProfile(user.id).subscribe((profile) => {
          if (profile && profile.name && profile.name.displayName) {
            profile.requestRelation = user.relation;
            array[index - 1] = profile;
          }
        });
      });
    }
  }

  viewFriendProfile(friend: DacadooProfile) {
    this.router.navigate(["friend-profile"], {
      queryParams: {
        id: friend.id,
        pathReturn: "/community",
        segmentReturn: "friends",
      },
    });
  }

  handlerFriendRequest(isAccepted: boolean, friend: DacadooProfile) {
    this.friendService
      .handlerFirendRequest(
        isAccepted ? "accepted" : "rejected",
        friend.requestRelation
      )
      .subscribe((response) => {
        if (response) {
          friend.requestSent = isAccepted;

          if (!isAccepted) {
            this.friendRequests.splice(
              this.friendRequests.findIndex((x) => x.id === friend.id),
              1
            );
          }
        }
      });
  }

  showMoreFriendRequests(event) {
    if (this.nextFriendRequestsUrl) {
      this.friendService
        .getFriendResquestsNext(this.nextFriendRequestsUrl)
        .subscribe(
          (friendsRequestResponse) => {
            if (friendsRequestResponse) {
              this.nextFriendRequestsUrl =
                friendsRequestResponse.next && friendsRequestResponse.next != ""
                  ? friendsRequestResponse.next
                  : null;
              this.getAndSetFriendProfile(
                friendsRequestResponse.friendRequests,
                this.friendRequests
              );
            }
          },
          null,
          () => {
            event.target.complete();
            this.verifyCompleteScroll();
          }
        );
    } else {
      event.target.complete();
      this.verifyCompleteScroll();
    }
  }

  verifyCompleteScroll() {
    if (!this.nextFriendRequestsUrl || this.nextFriendRequestsUrl === "") {
      setTimeout(() => {
        //wait for view to draw scroll
        this.infiniteScroll.complete();
        this.infiniteScroll.disabled = true;
      }, 500);
    } else {
      setTimeout(() => {
        if (this.infiniteScroll) {
          this.infiniteScroll.disabled = false;
        }
      }, 500);
    }
  }

  getFriendRequestList(): DacadooProfile[] {
    return this.friendRequests.filter((x) => x.name);
  }

  haveFriendRequestList(): boolean {
    return (
      this.friendRequests &&
      this.friendRequests.filter((x) => x.name).length > 0
    );
  }
}
