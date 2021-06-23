import { Pipe, PipeTransform } from "@angular/core";
import { ActivityToSpanish } from "../interfaces/activity.interface";
import * as _ from "lodash";

@Pipe({
  name: "activityTranslate",
})
export class ActivityTranslatePipe implements PipeTransform {
  transform(key: string, activities: ActivityToSpanish[]): string {
    if (!activities || activities.length == 0) {
      return key;
    }

    let translate: ActivityToSpanish = _.find(activities, ["key", key]);

    if (!translate) {
      return key;
    }

    return translate.name;
  }
}
