/** https://secure.dacadoo.com/confluence/display/SB/Health+Score */
export class HealthScoreResponse {
  data: HealthScore[];
}

export class HealthScore {
  components: ComponentScore;
  score: number;
  date: string;
}

export class ComponentScore {
  body: number;
  lifestyle: number;
  feelings: number;
}
