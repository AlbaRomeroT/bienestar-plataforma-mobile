import { Pipe, PipeTransform } from "@angular/core";
import { Challenge } from "@app/interfaces/challenge.interface";

@Pipe({
  name: "challengeStatusFilter",
  pure: false,
})
export class ChallengeStatusFilterPipe implements PipeTransform {
  transform(challenges: Challenge[], status: string): any {
    if (!challenges) return challenges;

    //check if completed is undefined
    if (!status) return challenges;
    var d1 = new Date();
    var completed = false;
    if (status == "actives") {
      completed = true;
      return challenges.filter((x) => new Date(Date.parse(x.endTime)) > d1);
    }

    return challenges.filter((x) => new Date(Date.parse(x.endTime)) < d1);
  }
}
