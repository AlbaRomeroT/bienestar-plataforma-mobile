import { Pipe, PipeTransform } from "@angular/core";
import { BodyMessageLink } from "@app/interfaces/body-message-link.interface";

@Pipe({
  name: "challengeDescription",
})
export class ChallengeDescriptionPipe implements PipeTransform {
  transform(description: string, args?: any): BodyMessageLink[] {
    let paragraphs = [];
    let response: BodyMessageLink[] = [];

    if (!description) return response;

    if (description.includes("![")) {
      description = description.slice(0, description.lastIndexOf("!["));
    }

    if (description?.includes("\n")) {
      paragraphs = description.split("\n");
    } else {
      paragraphs.push(description);
    }

    paragraphs.forEach((paragraph: string) => {
      var challengeLink: BodyMessageLink = {};
      challengeLink.text = paragraph;
      response.push(challengeLink);
    });

    return response;
  }
}
