import { Pipe, PipeTransform } from "@angular/core";
import { CoachChat } from "@app/interfaces/coach-chat.interface";
import * as _ from "lodash";

@Pipe({
  name: "coachResponse",
})
export class CoachResponsePipe implements PipeTransform {
  transform(value: CoachChat, ...args: unknown[]): unknown {
    if (!value.inputs) {
      return;
    }

    let input = value.inputs[0];

    if (value.completed && !input?.response) {
      return "Omitido";
    }

    if (input.type == "slider") {
      if(input.response == "Omitido"){
        return "Omitido"
      }
      return Number(input.response) * 10;
    }

    if (input.type == "select") {
      if (input.response == "Omitido") {
        return input.response;
      }

      if (input.options.length > 0) {
        let answer = _.find(input.options, { value: input.response });

        if (answer) {
          return answer.text;
        }
      } else {
        return input.response;
      }
    } else {
      return input.response;
    }
  }
}
