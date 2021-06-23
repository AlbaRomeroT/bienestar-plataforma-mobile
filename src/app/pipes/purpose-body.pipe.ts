import { Pipe, PipeTransform } from "@angular/core";
import { BodyMessageLink } from "@app/interfaces/body-message-link.interface";

@Pipe({
  name: "purposeBody",
})
export class PurposeBodyPipe implements PipeTransform {
  transform(body: string, args?: any): BodyMessageLink[] {
    let paragraphs = [];
    let response: BodyMessageLink[] = [];

    if (!body) return response;

    if (body.includes("![")) {
      body = body.slice(0, body.lastIndexOf("!["));
    }

    if (body?.includes("\n")) {
      paragraphs = body.split("\n");
    } else {
      paragraphs.push(body);
    }

    paragraphs.forEach((paragraph: string) => {
      var purposeLink = this.createPurposeLink(paragraph);
      response.push(purposeLink);
    });

    return response;
  }

  createPurposeLink(text: string): BodyMessageLink {
    var tag: string;
    var splittedText: string[];

    if (text.includes("![")) {
      tag = this.extractTag(text, "![", "]");
      text = text.replace(tag, "");
    }

    if (text.includes("mp3")) {
      console.log("mp3 => ", text);
      tag = this.extractTag(text, "(", ")");
      var link: BodyMessageLink = {};

      splittedText = text.split(tag);
      var name: string = "";

      if (splittedText.length > 0) {
        name = splittedText[0];
      }

      link.mp3 = this.extractFunctionLink(tag, "(", ")");
      link.name = name.replace("[", "").replace("]", "");
      return link;
    }

    link = {
      text: text,
    };
    return link;
  }

  extractTag(text, beg, end): string {
    return text.substring(text.lastIndexOf(beg), text.lastIndexOf(end) + 1);
  }

  extractFunctionLink(text, beg, end): string {
    return text.split(beg).pop().split(end)[0];
  }
}
