import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
} from "@angular/core";
import { Event, NavigationEnd, Router } from "@angular/router";
import { DacadooProfile } from "@app/interfaces/dacadoo-profile.interface";
import { FriendsResponse } from "@app/models/friendsResponse";
import { FriendService } from "@app/services/friend.service";
import { ProfileService } from "@app/services/profile.service";
import { IonInfiniteScroll } from "@ionic/angular";

@Component({
  selector: "app-my-friends",
  templateUrl: "./my-friends.component.html",
  styleUrls: ["./my-friends.component.scss"],
})
export class MyFriendsComponent implements OnInit, AfterViewChecked {
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

  public filterText: string;
  public friendRequests: DacadooProfile[];
  public friends: DacadooProfile[];
  public friendsResponse: FriendsResponse;
  public isLoadingFriendRequests: boolean = false;
  public isLoadingFriends: boolean = false;
  public block: boolean;
  constructor(
    private friendService: FriendService,
    private profileService: ProfileService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.router.events.subscribe((event: Event) => {
      if (
        event instanceof NavigationEnd &&
        event.url.startsWith("/community") &&
        !event.url.startsWith("/community/")
      ) {
        this.getFriendRequests();
        this.getFriends();
      }
    });
  }

  checkInputFocus() {
    var elem = document.getElementById("ion-fab-green-button");
    elem.style.display = "none";
  }

  checkInputBlur() {
    var elem = document.getElementById("ion-fab-green-button");
    elem.style.display = "block";
  }

  ngAfterViewChecked(): void {
    this.filterText = null;
    this.cdr.detectChanges();
  }

  getFriendRequests() {
    this.isLoadingFriendRequests = true;
    this.friendService.getFriendResquests(5).subscribe(
      (friendsRequestResponse) => {
        if (friendsRequestResponse) {
          this.friendRequests = [];
          this.getAndSetFriendProfile(
            friendsRequestResponse.friendRequests
              .filter((x) => x.status == "pending")
              .map((friendRequest) => [
                friendRequest.id,
                friendRequest.relation,
              ]),
            this.friendRequests
          );
        }
      },
      null,
      () => (this.isLoadingFriendRequests = false)
    );
  }

  getFriends() {
    this.isLoadingFriends = true;
    this.friendService.getFriends(10).subscribe(
      (friendsResponse) => {
        if (friendsResponse) {
          this.friendsResponse = friendsResponse;
          this.friends = [];
          this.getAndSetFriendProfile(
            this.friendsResponse.userIds.map((u) => [u, null]),
            this.friends
          );
        }
      },
      null,
      () => {
        this.verifyCompleteScroll();
        this.isLoadingFriends = false;
      }
    );
  }

  getAndSetFriendProfile(data: string[][], array: DacadooProfile[]) {
    if (data && array) {
      data.forEach((user) => {
        let index = array.push({ id: user[0] } as DacadooProfile);
        this.profileService.getProfile(user[0]).subscribe((profile) => {
          if (profile && profile.name && profile.name.displayName) {
            profile.requestRelation = user[1];
            array[index - 1] = profile;
          }
        });
      });
    }
  }

  verifyCompleteScroll() {
    if (
      !this.friendsResponse ||
      (this.friendsResponse &&
        (!this.friendsResponse.next || this.friendsResponse.next === ""))
    ) {
      setTimeout(() => {
        //wait for view to draw scroll
        if (this.infiniteScroll) this.infiniteScroll.disabled = true;
      }, 500);
    } else {
      setTimeout(() => {
        if (this.infiniteScroll) {
          this.infiniteScroll.complete();
          this.infiniteScroll.disabled = false;
        }
      }, 500);
    }
  }

  filterChange(value: string) {
    this.router.navigate(["community/friend-search"], {
      queryParams: { filterText: value },
    });
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
    this.block = true;
    this.friendService
      .handlerFirendRequest(
        isAccepted ? "accepted" : "rejected",
        friend.requestRelation
      )
      .subscribe(
        (response) => {
          if (response) {
            this.block = false;
            friend.requestAccepted = isAccepted;

            if (!isAccepted) {
              this.friendRequests.splice(
                this.friendRequests.findIndex((x) => x.id === friend.id),
                1
              );
            }
          }
        },
        (error) => {
          this.block = false;
        }
      );
  }

  showMoreFriends(event) {
    if (this.friendsResponse.next) {
      this.friendService.getFriendsNext(this.friendsResponse.next).subscribe(
        (friendsResponse) => {
          if (friendsResponse) {
            this.friendsResponse = friendsResponse;
            this.getAndSetFriendProfile(
              this.friendsResponse.userIds.map((u) => [u, null]),
              this.friends
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

  goToViewFriendRequests() {
    this.router.navigate(["community/friend-requests"]);
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

  getFriendsList(): DacadooProfile[] {
    return this.friends.filter((x) => x.name);
  }

  haveFriendsList(): boolean {
    return this.friends && this.friends.filter((x) => x.name).length > 0;
  }
}
