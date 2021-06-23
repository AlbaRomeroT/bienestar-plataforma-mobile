export interface CoachChatResponse {
  data: CoachChat[];
}

export interface CoachChat {
  seen?: boolean;
  body?: string;
  subcategory?: string;
  lead?: string;
  inputs?: Input[];
  creator?: Creator;
  sharing?: Sharing;
  icon?: string;
  order?: number;
  modificationTime?: string;
  completionTime?: string;
  subject?: Creator;
  category?: string;
  time?: string;
  kind?: string;
  completed?: boolean;
  links?: Link[];
  objectives?: any[];
  message?: string;
  id?: string;
  rewards?: any[];
  valid?: boolean;
  title?: string;
}

export interface Creator {
  kind: string;
  id: string;
  links: Link[];
}

export interface Link {
  rel: string;
  href: string;
}

export interface Input {
  min?: number;
  max?: number;
  options?: Option[];
  text?: string;
  type?: string;
  key?: string;

  response?: string;
  selected?: any;
}

export interface Option {
  hint: string;
  text: string;
  value: string;
}

export interface Sharing {
  group: boolean;
  subjects: any[];
  user: boolean;
  public: boolean;
}

export interface CoachChatSave {
  id: string;
  completed?: boolean;
  inputs?: Input[];
  seen?: boolean;
}
