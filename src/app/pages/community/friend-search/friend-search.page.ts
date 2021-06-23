import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { DacadooProfile } from "@app/interfaces/dacadoo-profile.interface";
import { FriendsResponse } from "@app/models/friendsResponse";
import { AuthService } from "@app/services/auth.service";
import { FriendService } from "@app/services/friend.service";
import { IonInfiniteScroll } from "@ionic/angular";
import { Subject } from "rxjs";
import { debounceTime, distinctUntilChanged, filter } from "rxjs/operators";

@Component({
  selector: "app-friend-search",
  templateUrl: "./friend-search.page.html",
  styleUrls: ["./friend-search.page.scss"],
})
export class FriendSearchPage implements OnInit {
  @ViewChild("filterTextInput") filterTextInput;
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

  public filterText: string;
  public filterTextChanged: Subject<string> = new Subject<string>();
  public isLoading: boolean = false;

  public people: DacadooProfile[];
  public nextPeopleUrl: string;

  private userEmail: string;

  private friends: FriendsResponse;
  private sendFriends: FriendsResponse;

  private block: boolean;

  constructor(
    private route: ActivatedRoute,
    private friendService: FriendService,
    private authService: AuthService,
    private router: Router
  ) {
    this.filterTextChanged
      .pipe(
        debounceTime(800), // wait some miliseconds after the last event before emitting last event
        distinctUntilChanged() // only emit if value is different from previous value
      )
      .subscribe((model) => {
        this.filterText = model;
        this.searchPeople(this.filterText);
      });
  }

  ngOnInit() {
    this.isLoading = false;
    this.authService.email().then((email) => (this.userEmail = email));
    this.getFriends();
    this.getSendFriendResquests();
    this.route.queryParams
      .pipe(filter((params) => params.filterText))
      .subscribe((params) => {
        this.filterText = params.filterText;
        setTimeout(() => {
          //timeout for focus
          this.filterTextInput.setFocus();
          if (!this.isLoading) {
            this.searchPeople(this.filterText);
          }
        }, 300);
      });
  }

  filterChange(value: string) {
    if (value && value.length >= 3) {
      this.filterTextChanged.next(value);
    }
  }

  searchPeople(filter: string) {
    if (filter && filter.length >= 3) {
      this.getFriends();
      this.getSendFriendResquests();

      this.isLoading = true;
      this.friendService.searchPeople(filter, 20).subscribe(
        (response) => {
          // remove the same user email
          this.people = response.data.filter(
            (x) =>
              !x.email ||
              x.email.toLowerCase().trim() !==
                this.userEmail.toLowerCase().trim()
          );
          this.nextPeopleUrl =
            response.links && response.links.find((x) => x.rel == "next")
              ? response.links.find((x) => x.rel == "next").href
              : null;
          this.markAlreadyFriend();
          this.markAlreadySend();
        },
        null,
        () => {
          this.verifyCompleteScroll();
          this.isLoading = false;
        }
      );
    }
  }

  sendFriendRequest(friend: DacadooProfile) {
    this.block = true;
    this.friendService.sendFriendRequest(friend.id).subscribe((response) => {
      if (response) {
        this.block = false;
        friend.requestSent = true;
        this.getSendFriendResquests();
      }
    });
  }

  showMorePeople(event) {
    if (this.nextPeopleUrl) {
      this.friendService.searchPeopleNext(this.nextPeopleUrl).subscribe(
        (response) => {
          this.people.push(
            ...response.data.filter(
              (x) => !x.email || x.email.toLowerCase() !== this.userEmail
            )
          );
          this.nextPeopleUrl =
            response.links && response.links.find((x) => x.rel == "next")
              ? response.links.find((x) => x.rel == "next").href
              : null;
          this.markAlreadyFriend();
          this.markAlreadySend();
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
    if (!this.nextPeopleUrl || this.nextPeopleUrl === "") {
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

  getFriends() {
    this.friendService.getFriends(250).subscribe((friendsResponse) => {
      this.friends = friendsResponse;
    });
  }

  getSendFriendResquests() {
    this.friendService.getSendFriendResquests().subscribe((friendsResponse) => {
      this.sendFriends = friendsResponse;
    });
  }

  markAlreadyFriend() {
    if (this.friends) {
      this.people.forEach((u) => {
        this.friends.userIds.forEach((f) => {
          if (f == u.id) {
            u.requestAccepted = true;
          }
        });
      });
    }
  }

  markAlreadySend() {
    if (this.sendFriends) {
      this.people.forEach((u) => {
        this.sendFriends.userIds.forEach((f) => {
          if (f == u.id) {
            u.requestSent = true;
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
}
