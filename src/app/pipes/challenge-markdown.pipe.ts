import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "challengeMarkdown",
})
export class ChallengeMarkdownPipe implements PipeTransform {
  transform(description: string, begin: string, end: string): string {
    let paragraphs = [];
    let response: string = "";

    if (!description) return "";

    if (description?.includes("\n")) {
      paragraphs = description.split("\n");
    } else {
      paragraphs.push(description);
    }

    paragraphs.forEach((paragraph: string) => {
      if (paragraph.includes(begin)) {
        response = this.extractTag(paragraph, begin, end);
      }
    });

    return response;
  }

  extractTag(text, beg, end): string {
    return text.split(beg).pop().split(end)[0];
  }
}
