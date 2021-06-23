export interface DacadooQuestionResponse {
  category: string;
  questionList?: DacadooQuestions;
}
export interface DacadooQuestions {
  feeling?: DacadooQuestion[];
  body?: DacadooQuestion[];
  habits?: DacadooQuestion[];
  HEART?: DacadooQuestion[];
  HIPERTENSION?: DacadooQuestion[];
  DIABETES?: DacadooQuestion[];
  exercise?: DacadooQuestion[];
  alcohol?: DacadooQuestion[];
  smoke?: DacadooQuestion[];
  food?: DacadooQuestion[];
  coffee?: DacadooQuestion[];
  RENAL?: DacadooQuestion[];
}
export interface DacadooQuestion {
  id: string;
  question: string;
  value?: any;
  response: DacadooFeelingResponseOptions[];
}
export interface DacadooFeelingResponseOptions {
  min?: number;
  max?: number;
  default?: number;
  key?: string;
  value?: string;
}
