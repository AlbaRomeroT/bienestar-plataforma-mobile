export interface PurposeResponse {
  data: Purpose[];
}

export interface Purpose {
  id?: string;
  key?: string;
  inputs?: any[];
  valid?: boolean;
  title?: string;
  subcategory?: string;
  creator?: Client;
  time?: string;
  sharing?: Sharing;
  subject?: Client;
  links?: Link[];
  body?: string;
  kind?: string;
  rewards?: any[];
  category?: string;
  objectives?: Objective[];
  order?: number;
  lead?: string;
  modificationTime?: string;
  completed?: boolean;
  message?: string;
  seen?: boolean;
  client?: Client;
  availability?: string;
}

export interface Client {
  links?: Link[];
  id?: string;
  kind?: string;
}

export interface Link {
  href?: string;
  rel?: string;
}

export interface Objective {
  text?: string;
  value?: number;
  unit?: string;
  key?: string;
  targetValue?: number;
}

export interface Sharing {
  public?: boolean;
  user?: boolean;
  group?: boolean;
  subjects?: any[];
}
