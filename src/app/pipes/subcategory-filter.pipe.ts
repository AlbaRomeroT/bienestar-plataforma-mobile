import { Pipe, PipeTransform } from "@angular/core";
import {
  DacadooQuestion,
  DacadooQuestions,
} from "../interfaces/dacadoo-question.interface";

@Pipe({
  name: "subcategoryFilter",
})
export class SubcategoryFilterPipe implements PipeTransform {
  transform(
    questions: DacadooQuestions,
    subcategory: string
  ): DacadooQuestion[] {
    if (!questions) return [];

    //check if subcatory is undefined
    if (subcategory === undefined || questions === undefined) return [];

    return questions[subcategory];
  }
}
