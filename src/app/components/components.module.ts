import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HeaderComponent } from "./header/header.component";
import { HeaderOnlyComponent } from "./header-only/header-only.component";
import { TitleComponent } from "./title/title.component";
import { MenuComponent } from "./menu/menu.component";
import { BlogComponent } from "./blog/blog.component";
import { PurposeComponent } from "./purpose/purpose.component";
import { CoachComponent } from "./coach/coach.component";
import { CommunityComponent } from "./community/community.component";
import { IonicModule } from "@ionic/angular";
import { WidgetHeaderComponent } from "./widget-header/widget-header.component";
import { RouterModule } from "@angular/router";
import { NgCircleProgressModule } from "ng-circle-progress";
import { HealthIndicatorsComponent } from "./health-indicators/health-indicators.component";
import { PipesModule } from "../pipes/pipes.module";
import { GreenButtonComponent } from "./green-button/green-button.component";
import { GreenButtonOptionsComponent } from "./green-button-options/green-button-options.component";
import { FooterComponent } from "./footer/footer.component";
import { GreenButtonTitleComponent } from "./green-button-title/green-button-title.component";
import { TermsTreatmentsComponent } from "./terms-treatments/terms-treatments.component";
import { TermsModal } from "./terms-treatments/terms.component";
import { TreatmentsModal } from "./terms-treatments/treatment.component";
import { OnboardingHeaderComponent } from "./onboarding-header/onboarding-header.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AppAvailability } from "@ionic-native/app-availability/ngx";
import { Market } from "@ionic-native/market/ngx";
import { CallNumber } from "@ionic-native/call-number/ngx";
import { HistogramChartComponent } from "./histogram-chart/histogram-chart.component";
import { HealthIndicatorsGridComponent } from "./health-indicators-grid/health-indicators-grid.component";
import { LifestyleQuestionComponent } from "./lifestyle-question/lifestyle-question.component";
import { FeelingQuestionComponent } from "./feeling-question/feeling-question.component";
import { ModalHealthComponent } from "./modal-health/modal-health.component";
import { ProgressHealthWellnessComponent } from "./progress-health-wellness/progress-health-wellness.component";
import { ProgressHealthComponent } from "./progress-health/progress-health.component";
import { RoundProgressModule } from "angular-svg-round-progressbar";
import { PurposeSelectedComponent } from "./purpose-selected/purpose-selected.component";
import { BackgroundSvgHomeComponent } from "./background-svg-home/background-svg-home.component";
import { NgxTimerModule } from "ngx-timer";
import { ModalActivitiesComponent } from "./modal-activities/modal-activities.component";
import { RegisteredActivityComponent } from "./registered-activity/registered-activity.component";
import { FriendHealthScoreComponent } from "./friend-health-score/friend-health-score.component";
import { ModalActivitiesCommentsComponent } from "./modal-activities-comments/modal-activities-comments.component";
import { FriendActivityComponent } from "./friend-activity/friend-activity.component";
import { ModalNotConnectionComponent } from "./modal-not-connection/modal-not-connection.component";
import { ModalAlertComponent } from "./modal-alert/modal-alert.component";
import { ModalConfirmComponent } from "./modal-confirm/modal-confirm.component";
import { FeelBadComponent } from "./feel-bad/feel-bad.component";
import { MedicalEmergencyComponent } from "./medical-emergency/medical-emergency.component";
import { QrPassComponent } from "./qr-pass/qr-pass.component";
import { HomeWidgetModule, SymptomWidgetModule } from "qrpass-widgets";
import { BackButtonUpdatedComponent } from "./back-button-updated/back-button-updated.component";
import { ChallengeRatingComponent } from "./challenge-rating/challenge-rating.component";
import { ChallengeSelectedComponent } from "@app/pages/community/challenge-selected/challenge-selected.component";
import { ModalGenericConfirmComponentComponent } from "./modal-generic-confirm-component/modal-generic-confirm-component.component";
import { ModalConfirmSignOutComponent } from "./modal-confirm-sign-out/modal-confirm-sign-out.component";
import { NationalHealthCardComponent } from './national-health-card/national-health-card.component';
import { ForeignHealthCardComponent } from './foreign-health-card/foreign-health-card.component';
import { PointsIndicatorComponent } from './points-indicator/points-indicator.component';
import { PointItemComponent } from "./point-item/point-item.component";
import { SurveyModalComponent } from "./survey-modal/survey-modal.component";
import { ShortcutsWellnessComponent } from './shortcuts-wellness/shortcuts-wellness.component';



const components = [
  HeaderComponent,
  MenuComponent,
  HeaderOnlyComponent,
  TitleComponent,
  WidgetHeaderComponent,
  CoachComponent,
  CommunityComponent,
  PurposeComponent,
  BlogComponent,
  HealthIndicatorsComponent,
  GreenButtonComponent,
  GreenButtonOptionsComponent,
  FooterComponent,
  GreenButtonTitleComponent,
  TermsTreatmentsComponent,
  TermsModal,
  TreatmentsModal,
  OnboardingHeaderComponent,
  HistogramChartComponent,
  HealthIndicatorsGridComponent,
  LifestyleQuestionComponent,
  FeelingQuestionComponent,
  ProgressHealthComponent,
  ProgressHealthWellnessComponent,
  PurposeSelectedComponent,
  BackgroundSvgHomeComponent,
  RegisteredActivityComponent,
  FriendHealthScoreComponent,
  ModalHealthComponent,
  ModalActivitiesComponent,
  ModalActivitiesCommentsComponent,
  FriendActivityComponent,
  ModalAlertComponent,
  ModalConfirmComponent,
  ModalActivitiesComponent,
  ModalHealthComponent,
  ModalNotConnectionComponent,
  FeelBadComponent,
  MedicalEmergencyComponent,
  QrPassComponent,
  BackButtonUpdatedComponent,
  ChallengeRatingComponent,
  ChallengeSelectedComponent,
  ModalConfirmSignOutComponent,
  NationalHealthCardComponent,
  ForeignHealthCardComponent,
  ModalGenericConfirmComponentComponent,
  ModalConfirmSignOutComponent,
  PointItemComponent,
  PointsIndicatorComponent,
  SurveyModalComponent,
  ShortcutsWellnessComponent
];

@NgModule({
  declarations: [...components],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    IonicModule.forRoot(),
    PipesModule,
    ReactiveFormsModule,
    RoundProgressModule,
    HomeWidgetModule,
    SymptomWidgetModule,
    NgxTimerModule,
    NgCircleProgressModule.forRoot({
      backgroundColor: "#ffffff",
      backgroundOpacity: 1,
      backgroundStrokeWidth: 0,
      backgroundPadding: -50,
      radius: 45,
      space: -13,
      toFixed: 0,
      maxPercent: 100,
      outerStrokeGradient: true,
      outerStrokeWidth: 9,
      outerStrokeColor: "#02d46f",
      outerStrokeGradientStopColor: "#ffdd00",
      innerStrokeColor: "#f6f6f6",
      innerStrokeWidth: 18,
      titleFontSize: "21",
      titleFontWeight: "400",
      imageHeight: 20,
      imageWidth: 20,
      animationDuration: 1100,
      showSubtitle: false,
      showUnits: false,
      showBackground: false,
      responsive: true,
    }),
  ],
  exports: [...components],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [AppAvailability, Market, CallNumber, GreenButtonTitleComponent],
})
export class ComponentsModule {}
