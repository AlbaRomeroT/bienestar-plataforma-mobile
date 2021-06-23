import { Component, OnInit, ViewChild } from '@angular/core';
import { AppHttpResponse, TrackHttpError } from "@app/interfaces/app-http-response.interface";
import { DacadooHistoryPointsResponse } from "@app/interfaces/points.interface";
import { IonInfiniteScroll } from "@ionic/angular";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { PointsService } from '../../../services/points.service';
import * as _ from 'lodash';

@Component({
  selector: "app-my-points",
  templateUrl: "./my-points.page.html",
  styleUrls: ["./my-points.page.scss"],
})
export class MyPointsPage implements OnInit {

  public title: string = "Historial de puntos";
  public selectedTab: string = 'my-accumulated-points';
  showSpinner = false;
  sectiontToShow: string;
  subscriptions = new Subject();
  history: any[];
  next: string;
  viewHistory: boolean;
  puntosActual: number = 0;

  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

  sections = {
    empty: "empty",
    points: "points",
  };

  constructor(private pointsService: PointsService) { 
    this.viewHistory = false;
    this.history = [];
  }

  ngOnInit() {
    this.validaPuntos();
    this.history = null;
  }

  validaPuntos(){
     this.pointsService.getTotalPoints().subscribe(
      (res: any) => {
        if (res.hashErrors) {
          this.showSpinner = false;
          return;
        }
        if (!res.body.data[0]) {
          this.puntosActual = 0;
          this.sectiontToShow = this.sections.empty;
          return;
        }

        this.puntosActual = Number(res.body.data[0].sums.earned) || 0;
        if (this.puntosActual > 0) {
          this.sectiontToShow = this.sections.points;
          this.getHistory();
        } else {
          this.sectiontToShow = this.sections.empty;
        }
      },
      (error: TrackHttpError) => {
        this.showSpinner = false;
      });
  }

  getHistory() {

    this.showSpinner = true;

    this.pointsService
      .getHistory()
      .pipe(takeUntil(this.subscriptions))
      .subscribe(
        (response: AppHttpResponse<DacadooHistoryPointsResponse>) => {
          this.showSpinner = false;
          if (response.hasErrors) {
            return;
          }
          console.log("GET HISTORY");
          console.log("RESPONSE => ", response);


          this.getNextLink(response.body);

          if(this.next) {
            this.viewHistory = true;
          }

          this.history = response.body.data;
          console.log("HISTORY => ", this.history);
          console.log("NEXT => ", this.next);
        },
        (error: TrackHttpError) => {
          this.showSpinner = false;
          console.log(error);
        }
      );
  }

  getHistoryNext() {
    this.showSpinner = true;
    this.infiniteScroll.complete();

    this.pointsService
      .getHistoryNext(this.next)
      .pipe(takeUntil(this.subscriptions))
      .subscribe(
        (response) => {
          this.showSpinner = false;
          if (response.hasErrors) {
            return;
          }
          console.log("GET NEXT HISTORY");

          console.log("NEXT RESPONSE => ", response);

          this.getNextLink(response.body);

          this.history.push(...response.body.data);
          this.history= _.uniqBy(this.history, 'id');
          console.log("HISTORY => ", this.history);
          console.log("NEXT => ", this.next);
        },
        (error: TrackHttpError) => {
          this.showSpinner = false;
          console.log(error);
        }
      );
  }

  getNextLink(data: DacadooHistoryPointsResponse){
    let href = data.links.find(x => x.rel == "next")?.href;
    if(href) {
      let queryString = href.split("?")[1];
      let parameters = queryString.split("&");
      this.next = parameters.find(x => x.includes("resume"));
    } else {
      if(this.infiniteScroll) {
        this.infiniteScroll.disabled = true;
      }
      this.next = null;
    }
  }

  onViewHistory() {
    this.viewHistory = false;
    this.getHistoryNext();
  }
}
