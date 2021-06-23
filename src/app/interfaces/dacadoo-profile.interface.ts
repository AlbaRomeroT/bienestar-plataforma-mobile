export interface DacadooProfileResponse {
  data?: DacadooProfile[];
}

export interface DacadooProfile {
  accountPrivileges?: any[];
  leaders?: Leader[];
  modificationTime?: string;
  links?: Link[];
  name?: Name;
  media?: any[];
  client?: Client;
  kind?: string;
  expirationTime?: string;
  accountStatus?: string;
  id?: string;
  followers?: Leader[];
  creator?: Client;
  valid?: boolean;
  emailConfirmed?: boolean;
  relation?: string;
  emailDomain?: string;
  factors?: Factors;
  language?: string;
  joinTime?: string;
  public?: boolean;
  email?: string;

  // for friend requests
  requestSent?: boolean;
  requestAccepted?: boolean;
  requestRelation?: string;

  // for challenge ranking
  challengeProgress?: number;
}

export interface Factors {
  password?: boolean;
}

export interface Client {
  id?: string;
  kind?: string;
  links?: Link[];
}

export interface Name {
  firstName?: string;
  displayName?: string;
  lastName?: string;
}

export interface Link {
  rel?: string;
  href?: string;
}

export interface Leader {
  kind?: string;
  count?: number;
}
