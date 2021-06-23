import { Challenge } from "../../../interfaces/challenge.interface";
import { Component, Input, OnInit, Output, EventEmitter } from "@angular/core";
import { Router } from "@angular/router";
import { StoreService } from "../../../services/store.service";
import { Media, MediaFormat } from "@app/interfaces/media.interface";
import { DacadooMediaService } from "@app/services/dacadoo-media.service";

@Component({
  selector: "app-challenge-selected",
  templateUrl: "./challenge-selected.component.html",
  styleUrls: ["./challenge-selected.component.scss"],
})
export class ChallengeSelectedComponent implements OnInit {
  @Input() isEdit: boolean = false;
  @Input() cssClass: string;
  @Input() challenge: Challenge;
  @Output() onRemove = new EventEmitter<Challenge>();
  constructor(
    private router: Router,
    private store: StoreService,
    private mediaService: DacadooMediaService
  ) {}

  ngOnInit() {
    this.getMediaImageCSelected();
  }
  ionViewDidEnter() {
    this.getMediaImageCSelected();
  }
  navigateTo() {
    this.router.navigate([`challenge-description/${this.challenge.id}`]);
  }

  getMediaImageCSelected() {
    if (this.challenge.media) {
      const media: Media = this.challenge.media.find(
        (x) => x.type === "header" && x.formats && x.formats.length > 0
      );
      if (media && media.formats && media.formats.length > 0) {
        const format: MediaFormat = media.formats.find(
          (x) => x.type === "thumbnail"
        );
        if (format) {
          this.mediaService
            .getMediaContent(media.id, format)
            .subscribe((response) => (this.challenge.safeMediaUrl = response));
        }
      }
    }
  }
}
