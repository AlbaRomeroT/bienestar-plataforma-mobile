import { ChallengeDescriptionPipe } from "./challenge-description.pipe";
import { BackgroudStyleSanitizerPipe } from "./backgroud-style-sanitizer.pipe";
import { NgModule } from "@angular/core";
import { NumberSignPipe } from "./number-sign.pipe";
import { SecondsToHoursPipe } from "./seconds-to-hours.pipe";
import { SecondsToMinutesPipe } from "./seconds-to-minutes.pipe";
import { MapOptionsPipe } from "./map-options/map-options.pipe";
import { FormsCustomDatePipe } from "./date/FormsCustomDate/forms-custom-date.pipe";
import { InputSuffixPipe } from "./input-suffix.pipe";
import { SubcategoryFilterPipe } from "./subcategory-filter.pipe";
import { StartswithArrayFieldPipe } from "./startswith-array-field.pipe";
import { SafeHtmlPipe } from "./safe-html.pipe";
import { BackgroundUriSanitizer } from "./background-uri-sanitizer.pipe.ts.pipe";
import { PurposeStatusFilterPipe } from "./purpose-status-filter.pipe";
import { PurposeBodyPipe } from "./purpose-body.pipe";
import { LeadTextClearPipe } from "./lead-text-clear.pipe";
import { PurposeObjetivesResumePipe } from "./purpose-objetives-resume.pipe";
import { CoachQuestionPipe } from "./coach-question.pipe";
import { CoachResponsePipe } from "./coach-response.pipe";
import { LikesSummaryPipe } from "./likes-summary.pipe";
import { ActivityTranslatePipe } from "./activity-translate.pipe";
import { ActivityKcalPipe } from "./activity-kcal.pipe";
import { ChallengeStatusFilterPipe } from "./challenge-status-filter.pipe";
import { ChallengeMarkdownPipe } from "./challenge-markdown.pipe";
import { SortByParameterPipe } from "./sort-by-parameter.pipe";

var pipes = [
  BackgroundUriSanitizer,
  SafeHtmlPipe,
  BackgroudStyleSanitizerPipe,
  MapOptionsPipe,
  FormsCustomDatePipe,
  InputSuffixPipe,
  SubcategoryFilterPipe,
  SecondsToHoursPipe,
  SecondsToMinutesPipe,
  NumberSignPipe,
  StartswithArrayFieldPipe,
  PurposeStatusFilterPipe,
  PurposeBodyPipe,
  LeadTextClearPipe,
  PurposeObjetivesResumePipe,
  CoachQuestionPipe,
  CoachResponsePipe,
  LikesSummaryPipe,
  ActivityTranslatePipe,
  ActivityKcalPipe,
  ChallengeStatusFilterPipe,
  ChallengeMarkdownPipe,
  ChallengeDescriptionPipe,
  SortByParameterPipe
];

@NgModule({
  declarations: [...pipes],
  exports: [...pipes],
})
export class PipesModule {}
