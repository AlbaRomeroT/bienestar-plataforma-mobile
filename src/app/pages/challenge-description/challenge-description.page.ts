import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ModalAlertComponent } from "@app/components/modal-alert/modal-alert.component";
import { ModalConfirmComponent } from "@app/components/modal-confirm/modal-confirm.component";
import { Challenge } from "@app/interfaces/challenge.interface";
import { NavigationBackService } from "@app/services/navigation-back.service";
import { ModalController } from "@ionic/angular";
import { forkJoin, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { DacadooChallengeService } from "../../services/dacadoo-challenge.service";
import {
  AppHttpResponse,
  TrackHttpError,
} from "@app/interfaces/app-http-response.interface";
import { FriendService } from "@app/services/friend.service";
import { DacadooProfileResponse } from "@app/interfaces/dacadoo-profile.interface";
import { DacadooProfile } from "../../interfaces/dacadoo-profile.interface";
import { Media, MediaFormat } from "@app/interfaces/media.interface";
import { DacadooMediaService } from "@app/services/dacadoo-media.service";

@Component({
  selector: "app-challenge-description",
  templateUrl: "./challenge-description.page.html",
  styleUrls: ["./challenge-description.page.scss"],
})
export class ChallengeDescriptionPage implements OnInit {
  title: string = "Desafíos disponibles";
  challengeId: string = "";
  challenge: Challenge = {};
  subscriptions = new Subject();
  firstPlace: DacadooProfile;
  secondPlace: DacadooProfile;
  thridPlace: DacadooProfile;
  creator: DacadooProfile;
  showSpinner = false;
  showScreen = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private modalController: ModalController,
    private dacadooChallengeService: DacadooChallengeService,
    private friendService: FriendService,
    private mediaService: DacadooMediaService,
    private navigationBackService: NavigationBackService
  ) {}

  ngOnInit() {}

  async ionViewDidEnter() {
    var snapshot = this.route.snapshot;
    this.challengeId = snapshot.paramMap.get("id");
    await this.getChallenge(this.challengeId);
  }

  async getChallenge(id: string) {
    this.showSpinner = true;

    var responseServices = forkJoin({
      challenge: this.dacadooChallengeService.getById(id),
      userChallenges: this.dacadooChallengeService.getByUser(),
      rankingChallenge: this.dacadooChallengeService.getRankingByChallenge(id),
    });

    responseServices.pipe(takeUntil(this.subscriptions)).subscribe(
      ({ challenge, userChallenges, rankingChallenge }) => {
        this.showSpinner = false;

        this.challenge = challenge.body.data;
        this.getMediaImage(this.challenge);

        var exists = (userChallenges.body.data as Challenge[]).find(
          (x) => x.object.id == id
        );
        if (exists) {
          console.log("CHALLENGE => ", exists);
          this.challenge.joinUserId = exists.id;
        }

        var ranking = rankingChallenge.body?.data[0];
        if (ranking) {
          for (var i = 1; i <= 3; i++) {
            var selected = ranking.ranking.find((x) => x.rank == i);
            if (!selected) {
              continue;
            }

            console.log("RANKING => ", selected);
            this.getProfile(
              selected.subjectId,
              selected.rank,
              selected.rankingValue
            );
          }
        }

        setTimeout(() => {
          this.showScreen = true;
        }, 800);
      },
      (error: TrackHttpError) => {
        this.showSpinner = false;
        this.showScreen = true;

        if (!this.challenge) {
          this.challenge = {};
        }
        console.log(error);
      }
    );

    this.showSpinner = false;
  }

  getProfile(userId: string, position?: number, progress?: number) {
    this.friendService
      .getProfileByUserId(userId)
      .pipe(takeUntil(this.subscriptions))
      .subscribe(
        (response: AppHttpResponse<DacadooProfileResponse>) => {
          if (response.hasErrors) {
            return;
          }

          if (position == 1) {
            this.firstPlace = response.body.data[0];
            if (this.firstPlace) {
              this.firstPlace.challengeProgress = progress;
            }
          }

          if (position == 2) {
            this.secondPlace = response.body.data[0];
            if (this.secondPlace) {
              this.secondPlace.challengeProgress = progress;
            }
          }

          if (position == 3) {
            this.thridPlace = response.body.data[0];
            if (this.thridPlace) {
              this.thridPlace.challengeProgress = progress;
            }
          }
        },
        (error: TrackHttpError) => {
          console.log(error);
        }
      );
  }

  getMediaImage(item: Challenge) {
    if (item.media) {
      const media: Media = item.media.find(
        (x) => x.type === "header" && x.formats && x.formats.length > 0
      );
      if (media && media.formats && media.formats.length > 0) {
        const format: MediaFormat = media.formats.find(
          (x) => x.type === "image"
        );
        if (format) {
          this.mediaService
            .getMediaContent(media.id, format)
            .subscribe((response) => (item.safeMediaUrl = response));
        }
      }
    }
  }

  async showConfirmAddMessage() {
    let profileModal = await this.modalController.create({
      component: ModalAlertComponent,
      cssClass: "activities-actions-modal-add",
      componentProps: {
        title: "Se han guardado sus datos con éxito",
        description: "",
      },
    });

    profileModal.onDidDismiss().then((res) => {
      this.navigationBackService.revertTo("/community");
      this.router.navigate(["community"]);
    });

    return await profileModal.present();
  }

  async onAdd() {
    this.showSpinner = true;

    this.dacadooChallengeService
      .addToUser(this.challengeId)
      .pipe(takeUntil(this.subscriptions))
      .subscribe(
        (response) => {
          this.showSpinner = false;
          if (response.hasErrors) {
            return;
          }

          this.showConfirmAddMessage();
        },
        (error: TrackHttpError) => {
          this.showSpinner = false;
          console.log(error);
        }
      );
  }

  async onRemove() {
    let profileModal = await this.modalController.create({
      component: ModalConfirmComponent,
      cssClass: "activities-actions-modal-delete",
      componentProps: {
        title: "¿Está seguro de querer eliminar este desafío?",
      },
    });

    profileModal.onDidDismiss().then((res) => {
      if (res?.data?.dismissed) {
        this.remove();
      }
    });

    return await profileModal.present();
  }

  async remove() {
    this.showSpinner = true;

    this.dacadooChallengeService
      .removeToUser(this.challenge.joinUserId)
      .pipe(takeUntil(this.subscriptions))
      .subscribe(
        (response) => {
          this.showSpinner = false;
          if (response.hasErrors) {
            return;
          }
          this.router.navigate(["community"]);
        },
        (error: TrackHttpError) => {
          this.showSpinner = false;
          console.log(error);
        }
      );
  }
}
