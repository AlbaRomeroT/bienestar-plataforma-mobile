export interface ActivityResponse {
  data?: Activity[];
  links?: Link[];
}

export interface Activity {
  object: Object;
  time: string;
  sharing: Sharing;
  valid: boolean;
  creator: Creator;
  id: string;
  expirationTime: string;
  kind: string;
  modificationTime: string;
  links: Link[];
  subject: Creator;
}

export interface Creator {
  id: string;
  links: Link[];
  kind: string;
}

export interface Object {
  value?: number;
  sharing: Sharing;
  earnedPeriods?: string[];
  valid: boolean;
  creator: Creator;
  earnedTime?: string;
  id: string;
  links: Link[];
  achievement?: string;
  kind: string;
  modificationTime: string;
  tier?: number;
  expirationTime: string;
  subject: Creator;
  time?: string;
  media?: any[];
  power?: number;
  classification?: string;
  energy?: number;
  duration?: number;
  normenergy?: number;
  normpower?: number;
  client?: Creator;
  splits?: any[];
  samples?: any[];
  companions?: any[];
  type?: string;
  activity?: string;
  acquisition?: string;
  logLikelihood?: number;
  tags?: Tag[];
}

export interface Tag {
  value: string;
  radioset: string;
  count: number;
}

export interface Sharing {
  subjects?: any[];
  user?: boolean;
  public?: boolean;
  group?: boolean;
}

export interface Link {
  href?: string;
  rel?: string;
}

export interface ActivityToSpanish {
  sharing?: Sharing;
  valid?: boolean;
  kind?: string;
  client?: Client;
  splits?: any[];
  aliases?: Alias[];
  values?: any[];
  links?: any[];
  subject?: Subject;
  key?: string;
  creator?: Client;
  expirationTime?: string;
  id?: string;
  phrase?: string;
  icon?: string;
  modificationTime?: string;
  name?: string;
  normpower?: number;
  speedlimit?: number;
}

interface Subject {
  links?: any[];
  id?: string;
  kind?: string;
}

interface Alias {
  key?: string;
  service?: string;
}

interface Client {
  links?: Link[];
  id?: string;
  kind?: string;
}
