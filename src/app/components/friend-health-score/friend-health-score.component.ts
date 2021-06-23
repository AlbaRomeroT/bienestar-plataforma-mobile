import { Component, Input, OnInit } from "@angular/core";
import { DacadooProfile } from "@app/interfaces/dacadoo-profile.interface";
import { HealthScore } from "@app/interfaces/health-score.interface";
import { FriendService } from "@app/services/friend.service";
import { Subject } from "rxjs";

@Component({
  selector: "app-friend-health-score",
  templateUrl: "./friend-health-score.component.html",
  styleUrls: ["./friend-health-score.component.scss"],
})
export class FriendHealthScoreComponent implements OnInit {
  @Input() healthScore: HealthScore;
  @Input() profile: DacadooProfile;

  subscriptions = new Subject();

  constructor(private friendService: FriendService) {}

  ngOnInit() {}
}
