export interface PointsResponse {
  data: Datum[];
}

export interface Datum {
  sums: Sums;
}

export interface Sums {
  earned: number;
}



export interface DacadooHistoryPointsResponse {
  data: DacadooHistoryPoint[];
  links: Link[];
}

export interface DacadooHistoryPoint {
  model: string;
  creator: Creator;
  links: Link[];
  mainCategory: string;
  kind: string;
  earned: number;
  period: number;
  sharing: Sharing;
  valid: boolean;
  eventDetails: EventDetails;
  id: string;
  object?: Creator;
  currency: string;
  time: string;
  slot: number;
  modificationTime: string;
  subCategory: string;
  customer: string;
  subject: Creator;
  expirationTime: string;

  // custom fields
  pointsAtDate: number;
}

export interface Creator {
  kind: Kind;
  id: string;
  links: Link[];
}

export enum Kind {
  Bloodpressure = "bloodpressure",
  Bloodwork = "bloodwork",
  User = "user",
  Weight = "weight",
}

export interface Link {
  rel: string;
  href: string;
}

export interface EventDetails {
  parameter?: number;
  descHeader: string;
  name: string;
  descBody: string;
}

export interface Sharing {
  public: boolean;
  subjects: any[];
  user: boolean;
  group: boolean;
}
