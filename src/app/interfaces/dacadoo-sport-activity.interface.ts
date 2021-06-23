export interface DacadooSportActivityResponse {
  data?: DacadooSportActivity[];
  links?: Link[];
}

export interface DacadooSportActivity {
  name: string;
  splits: Split[];
  creator: Creator;
  values: string[];
  speedlimit: number;
  id: string;
  key: string;
  icon: string;
  links: Link[];
  normpower: number;
  kind: string;
  expirationTime: string;
  phrase: string;
  client: Creator;
  valid: boolean;
  subject: Subject;
  modificationTime: string;
  sharing: Sharing;
  aliases: any[];
}

interface Sharing {
  public: boolean;
  group: boolean;
  user: boolean;
  subjects: any[];
}

interface Subject {
  id: string;
  links: any[];
  kind: string;
}

interface Creator {
  id: string;
  links: Link[];
  kind: string;
}

interface Link {
  href: string;
  rel: string;
}

interface Split {
  value: number;
  unit: string;
}



export interface DacadooManualSportActivityToSave {
  activity?: string;
  duration?: number;
  acquisition?: "manual";
  distance?: number;
  descent?: number;
  ascent?: number;
  heartRate?: number;
  endTime?: string;
  time?: string;
}