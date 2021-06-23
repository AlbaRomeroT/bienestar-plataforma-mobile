import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: "app-challenge-rating",
  templateUrl: "./challenge-rating.component.html",
  styleUrls: ["./challenge-rating.component.scss"],
})
export class ChallengeRatingComponent implements OnInit {
  @Input() position: number;
  @Input() name: string;
  @Input() lastName: string;
  @Input() progress: number;
  @Input() challengeDescription: string;

  constructor() {}

  ngOnInit() {}
}
