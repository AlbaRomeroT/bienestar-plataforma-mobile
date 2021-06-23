export interface HealthScoreResponse {
  data?: HealthScore[];
}

export interface HealthScore {
  valid?: boolean;
  uncertainty?: number;
  components?: Components;
  links?: Link[];
  confidenceUpper?: number;
  kind?: string;
  modificationTime?: string;
  creator?: Creator;
  sharing?: Sharing;
  id?: string;
  score?: number;
  subscores?: Subscores;
  date?: string;
  subject?: Creator;
  confidenceLower?: number;
  expirationTime?: string;
}

interface Subscores {
  wellness?: number;
  movement?: number;
  sleep?: number;
  depression?: number;
  smoking?: number;
  obesity?: number;
  stress?: number;
  nutrition?: number;
}

interface Sharing {
  public?: boolean;
  subjects?: any[];
  group?: boolean;
  user?: boolean;
}

interface Creator {
  links?: Link[];
  kind?: string;
  id?: string;
}

interface Link {
  href?: string;
  rel?: string;
}

interface Components {
  body?: number;
  lifestyle?: number;
  feelings?: number;
}
