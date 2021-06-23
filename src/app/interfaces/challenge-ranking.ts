export interface ChallengeRankingResponse {
  data?: ChallengeRanking[];
  links?: Link[];
}

interface ChallengeRanking {
  subject?: Subject;
  creator?: Creator;
  valid?: boolean;
  ranking?: Ranking[];
  object?: Subject;
  expirationTime?: string;
  id?: string;
  kind?: string;
  sharing?: Sharing;
  links?: Link[];
  modificationTime?: string;
}

interface Sharing {
  subjects?: any[];
  user?: boolean;
  group?: boolean;
  public?: boolean;
}

interface Ranking {
  subjectKind?: string;
  id?: string;
  kind?: string;
  subjectId?: string;
  rankingValue: number;
  values: number[];
}

interface Creator {
  id?: string;
  kind?: string;
  links?: any[];
}

interface Subject {
  id?: string;
  kind?: string;
  links?: Link[];
}

interface Link {
  rel?: string;
  href?: string;
}
