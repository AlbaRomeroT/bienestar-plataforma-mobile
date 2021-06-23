import { Pipe, PipeTransform } from "@angular/core";
import { Purpose } from "../interfaces/purpose.interface";

@Pipe({
  name: "purposeObjetivesResume",
})
export class PurposeObjetivesResumePipe implements PipeTransform {
  transform(purpose: Purpose, args?: any): string {
    let completed = 0;
    let inProgress = 0;

    for (let objetive of purpose.objectives) {
      completed += objetive.value;
      inProgress += objetive.targetValue;
    }

    return `${completed} / ${inProgress}`;
  }
}
