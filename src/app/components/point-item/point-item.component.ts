import { Component, Input, OnInit } from "@angular/core";
import {
  AppHttpResponse,
  TrackHttpError,
} from "@app/interfaces/app-http-response.interface";
import { DacadooHistoryPoint } from "@app/interfaces/points.interface";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { PointsService } from "../../services/points.service";

@Component({
  selector: "app-point-item",
  templateUrl: "./point-item.component.html",
  styleUrls: ["./point-item.component.scss"],
})
export class PointItemComponent implements OnInit {
  expanded: boolean = false;
  @Input() historyPoint: DacadooHistoryPoint;
  subscriptions = new Subject();
  showSpinner: boolean;

  constructor(private pointsService: PointsService) {}

  ngOnInit() {
    this.showSpinner = false;
  }

  onExpand(): void {
    this.expanded = !this.expanded;
    if (this.expanded && !this.historyPoint.pointsAtDate) {
      this.getPoints();
    }
  }

  getPoints() {
    console.log("GET POINTS => ", this.historyPoint.time);
    this.showSpinner = true;

    this.pointsService
      .getPointsByDate(this.historyPoint.time)
      .pipe(takeUntil(this.subscriptions))
      .subscribe(
        (response: AppHttpResponse<any>) => {
          console.log("GET POINTS RESPONSE => ", response);
          this.historyPoint.pointsAtDate = response.body.data[0].sums.earned;
          this.showSpinner = false;
        },
        (error: TrackHttpError) => {
          this.showSpinner = false;
          console.log(error);
        }
      );
  }
}
