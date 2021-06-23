import { Component, OnInit, ViewChild } from "@angular/core";
import { PersonalInfo } from "../../../interfaces/user/profile/user.interface";
import { IonInfiniteScroll } from "@ionic/angular";
import { HistoryActivity } from "../../../interfaces/activity/history-activity-user";
import { ActivityService } from "../../../services/activity.service";

@Component({
  selector: "app-history-activity",
  templateUrl: "./history-activity.component.html",
  styleUrls: ["./history-activity.component.scss"],
})
export class HistoryActivityComponent implements OnInit {
  public photo = "/assets/menu/profile-without-photo.svg";
  _historyActivity: HistoryActivity[];
  _historyActivityScroll: HistoryActivity[] = [];
  _dataSize: number = 0;
  _dataScrollIndex: number = 3;
  _dateScrollIncrement: number = 3;
  _userName: string;
  _userWeight: number;

  _personalInfo: PersonalInfo;

  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

  constructor(private _activityService: ActivityService) {}

  ngOnInit() {
    this._userName = this.getUserName();
    this._userWeight = this._personalInfo?.weight;
    this.getHistoryUserActivities();
  }

  getUserName(): string {
    this._personalInfo = <PersonalInfo>(
      JSON.parse(localStorage.getItem("profile"))
    );
    return `${this._personalInfo?.name} ${
      this._personalInfo?.lastName === undefined ||
      this._personalInfo?.lastName === null
        ? ""
        : this._personalInfo?.lastName
    }`;
  }

  getHistoryUserActivities(): void {
    this._activityService.getHistoryUserActivities().subscribe((response) => {
      this._historyActivity = <HistoryActivity[]>response?.body?.data;
      console.log(this._historyActivity);
      this._dataSize = this._historyActivity.length;
      this._historyActivityScroll = this._historyActivity.slice(
        0,
        this._dataScrollIndex
      );
    });
  }

  loadData(event): void {
    setTimeout(() => {
      if (this._dataScrollIndex > this._dataSize) {
        this.infiniteScroll.complete();
        this.infiniteScroll.disabled = true;
        return;
      }
      this._dataScrollIndex += this._dateScrollIncrement;
      this._historyActivityScroll = this._historyActivity.slice(
        0,
        this._dataScrollIndex
      );
      this.infiniteScroll.complete();
    }, 500);
  }
}
