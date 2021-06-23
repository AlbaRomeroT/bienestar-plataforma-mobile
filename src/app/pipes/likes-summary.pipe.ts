import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "likesSummary",
  pure: false,
})
export class LikesSummaryPipe implements PipeTransform {
  transform(values: any[], ...args: unknown[]): string {
    if (!values || values.length == 0) {
      return "";
    }

    let lastFriend = values[values.length - 1];

    if (values.length == 1) {
      return `A ${lastFriend.name} le gusta esto.`;
    }

    return `A ${lastFriend.name} y a ${values.length - 1} más les gusta esto.`;
  }
}
