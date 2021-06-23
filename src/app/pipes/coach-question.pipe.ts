import { Pipe, PipeTransform } from "@angular/core";
import { CoachBodyParagraph, CoachBodyContent } from "@app/interfaces/body-message-link.interface";
import { CoachChat } from "../interfaces/coach-chat.interface";

@Pipe({
  name: "coachQuestion",
})
export class CoachQuestionPipe implements PipeTransform {

  transform(value: CoachChat, ...args: unknown[]): CoachBodyParagraph[] {
    let paragraphs = [];
    let response: CoachBodyParagraph[] = [];
    let body = "";

    if (value.lead) {
      body = value.lead;

      if (value.body) {
        body = body + "\n" + value.body;
      }
    } else {
      body = value.body;
    }

    if (body?.includes("\n")) {
      paragraphs = body.split("\n");
    } else {
      paragraphs.push(body);
    }

    paragraphs.forEach((paragraph: string) => {
      var bodyParagraphs = this.createCoachParagraph(paragraph);

      var bodyMessage: CoachBodyParagraph = {
        content: bodyParagraphs
      };

      response.push(bodyMessage);
    });

    return response;
  }


  createCoachParagraph(text:string) {
    var content : CoachBodyContent[] = [];
    var review = true;

    // Se quitan los tags que representan imágenes
    while (review) {

      if(!text) {
        review = false;
        continue;
      }

      if(text.includes("![")){
        var tag = this.extractTag(text, "![", "]");
        text = text.replace(tag, "");

        // En caso de que en el tag no traiga nada, evitar un loop infinito
        if(tag.length == 0){
          text = text.replace("![", "");
        }

        continue;
      }

      for(var i = 0; i < text.length; i++) {

        // separa los strong text
        if(text[i] == "*" && text[i+1] == "*") {
  
          var strongNewText = text.substring(0, i);
  
          if(strongNewText.length > 0){
            var previousStrongContent: CoachBodyContent = {
              text: strongNewText,
              type: "text"
            };
  
            content.push(previousStrongContent);
          }
  
          text = text.substring(i, text.length);
  
          var strongText = this.extractContentTag(text, "**", "**");

          // Si el strong text viene con un link, quito los strong text y continuo
          if(strongText.includes("[") && strongText.includes("(")){
            text = text.replace(`**${strongText}**`, strongText);
            break;
          }

          text = text.replace(`**${strongText}**`, " ");

          var strongBodyMessage: CoachBodyContent = {
            text: strongText,
            type: "strong"
          }
          content.push(strongBodyMessage);
          break;
        }
  
        // separa los links o mp3
        if(text[i] == "[") {
  
          var linkNewText = text.substring(0, i);
  
          if(linkNewText.length > 0){
            var previousLinkContent: CoachBodyContent = {
              text: linkNewText,
              type: "text"
            };
  
            content.push(previousLinkContent);
          }
  
          text = text.substring(i, text.length);

          var linkText = `[${this.extractContentTag(text, "[", ")")})`;
          text = text.replace(linkText, " ");

          var url = this.extractTag(linkText, "(", ")").replace("(","").replace(")","");
          var bodyText = this.extractTag(linkText, "[", "]").replace("[","").replace("]","");

          var linkBodyMessage: CoachBodyContent = {
            text: bodyText
          }

          if(url.includes("mp3")){
            linkBodyMessage.type = "mp3"
            linkBodyMessage.url = url
          } else {
            linkBodyMessage.type = "link";
            linkBodyMessage.url= this.routeMap(url);
          }

          content.push(linkBodyMessage);
          break;
        }

        // separa los mp3
        if(text[i] == "(") {
          if(!text.substring(i, text.length -1).includes("mp3")){
            continue;
          }

          var mp3NewText = text.substring(0, i);
  
          if(mp3NewText.length > 0){
            var previousMp3Content: CoachBodyContent = {
              text: mp3NewText,
              type: "text"
            };
  
            content.push(previousMp3Content);
          }
  
          text = text.substring(i, text.length);

          var mp3Text = `(${this.extractContentTag(text, "(", ")")})`;
          text = text.replace(mp3Text, " ");
          var mp3Url = this.extractTag(mp3Text, "(", ")").replace("(","").replace(")","");
  
          var mp3BodyMessage: CoachBodyContent = {
            url: mp3Url,
            text: " Escuchar ahora ▶️ ",
            type: "mp3"
          }

          content.push(mp3BodyMessage);
          break;
        }
      }

      if(text.length == 0 || i >= text.length){
        review = false;
      }
    }

    if(text && text.length > 0) {
      var bodyMessage: CoachBodyContent = {
        text: text,
        type: "text"
      };
      content.push(bodyMessage);
    }
    
    return content;
  }

  extractTag(text, beg, end): string {
    return text.substring(text.lastIndexOf(beg), text.lastIndexOf(end) + 1);
  }

  extractContentTag(text, beg, end): string {
    var beginIndex = text.indexOf(beg) + beg.length;
    var result = text.substring(beginIndex, text.length);
    var endIndex = result.indexOf(end) + end.length;
    result = text.substring(beginIndex, endIndex);

    return result; 
  }


  routeMap(functionLink: string): string {

    functionLink = functionLink.toLowerCase();

    if (functionLink.includes("dacadoo://functions/goals/")) {
      var goals = functionLink.split("goals/");
      return `/purpose-description/${goals[1]}`;
    }

    if (functionLink.includes("dacadoo://functions/me/body")) {
      return "/body";
    }

    if (functionLink.includes("dacadoo://resources/challenges/")) {
      var challenge = functionLink.split("challenges/");
      return `/challenge-description/${challenge[1]}`;
    }

    if (functionLink.includes("dacadoo://functions/track/connections")) {
      return "/wearables";
    }

    if (functionLink.includes("dacadoo://functions/coach/programs")) {
      return "/purpose-add";
    }

    if (functionLink.includes("dacadoo://functions/settings/appsettings")) {
      return "/wearables";
    }

    if (functionLink.includes("dacadoo://resources/move")) {
      return "/community?segment=recentActivity";
    }

    if (functionLink.includes("dacadoo://resources/comments")) {
      return "/community?segment=recentActivity";
    }

    if (functionLink.includes("dacadoo://resources/users")) {
      return "/community?segment=friends";
    }

    if (functionLink.includes("dacadoo://functions/track/sleep")) {
      return "/sleep";
    }

    if (functionLink.includes("dacadoo://functions/track_activity/")) {
      var activities = functionLink.split("track_activity/");
      return `/chronometer/${activities[1]}`;
    }

    if (functionLink.includes("dacadoo://functions/me/lifestyle/sleep")) {
      return "/sleep";
    }

    if (functionLink.includes("dacadoo://functions/feedback")) {
      return "/help-center";
    }

    if (functionLink.includes("dacadoo://functions/me/lifestyle/activities")) {
      return "/community?segment=recentActivity";
    }
    
    if (functionLink.includes("dacadoo://functions/track")) {
      return "/activities";
    }

    return "/";

  }
}
