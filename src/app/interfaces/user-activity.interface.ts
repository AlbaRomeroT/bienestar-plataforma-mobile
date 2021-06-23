export interface UserActivityResponse {
  data?: UserActivity[];
  links?: Link[];
}

export interface UserActivity {
  subject?: Subject;
  normpower?: number;
  logLikelihood?: number;
  media?: any[];
  time?: string;
  modificationTime?: string;
  activity?: string;
  normenergy?: number;
  creator?: Subject;
  sharing?: Sharing;
  classification?: string;
  links?: Link[];
  expirationTime?: string;
  client?: Subject;
  samples?: any[];
  duration?: number;
  valid?: boolean;
  kind?: string;
  energy?: number;
  id?: string;
  companions?: any[];
  splits?: any[];
  power?: number;
  type?: string;
  acquisition?: string;
}

export interface Sharing {
  subjects?: any[];
  user?: boolean;
  public?: boolean;
  group?: boolean;
}

export interface Subject {
  links?: Link[];
  id?: string;
  kind?: string;
}

export interface Link {
  href?: string;
  rel?: string;
}
